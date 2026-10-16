import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabaseFixture } from "./fixtures/database.mjs";

const require = createRequire(import.meta.url);
const automationRoot = path.dirname(fileURLToPath(import.meta.url));
const submissionRoot = path.resolve(automationRoot, "../..");
const workspaceRoot = path.resolve(submissionRoot, "..");
const shopRoot = path.join(workspaceRoot, "SHOP");
const runtimeRoot = path.join(automationRoot, "runtime");
const databasePath = path.join(runtimeRoot, "c-fr14-fixture.sqlite");
const evidenceRoot = path.join(submissionRoot, "evidence", "C", "execution");
const screenshotRoot = path.join(evidenceRoot, "screenshots");
const traceRoot = path.join(evidenceRoot, "traces");
const resultPath = path.join(evidenceRoot, "results.json");
const serviceLogPath = path.join(evidenceRoot, "service-logs.txt");
const reportPath = path.join(submissionRoot, "features", "C", "05_execution_results.md");
const testCasePath = path.join(submissionRoot, "features", "C", "04_test_cases.md");

const ADMIN_URL = "http://127.0.0.1:5174";
const API_URL = "http://127.0.0.1:3000";
const BASELINE = "85af3ba875c88283615e22cb108f13e2fccaf0e9";
const credentials = {
  adminPassword: `C-FR14-admin-${randomUUID()}`,
  userPassword: `C-FR14-user-${randomUUID()}`,
};
const ADMIN = { email: "admin.c-fr14@example.test", password: credentials.adminPassword };
const USER = { email: "user.c-fr14@example.test", password: credentials.userPassword };
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const executionOrder = Array.from({ length: 48 }, (_, index) => `C-TC-${String(index + 1).padStart(3, "0")}`);

const serviceProcesses = [];
const serviceLogs = [];
const results = [];
let browser;
let fixture;
let secretKey;

function localIso(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(date);
  return `${parts.replace(" ", "T")}+07:00`;
}

function relative(target) {
  return path.relative(submissionRoot, target).replaceAll("\\", "/");
}

async function readDesignedCases() {
  const markdown = await fs.readFile(testCasePath, "utf8");
  const map = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!/^\| `C-TC-\d{3}` \|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    const id = cells[0].replaceAll("`", "");
    map.set(id, {
      id,
      group: cells[1],
      title: cells[2],
      steps: cells[3],
      expected: cells[4],
      coverage: cells[5].replaceAll("`", ""),
    });
  }
  if (map.size !== 48) throw new Error(`Expected 48 designed cases, found ${map.size}.`);
  return map;
}

async function findBrowserExecutable() {
  for (const candidate of chromeCandidates) {
    try { await fs.access(candidate); return candidate; } catch { /* next */ }
  }
  throw new Error("Không tìm thấy Chrome/Edge executable.");
}

async function urlReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.status < 500;
  } catch { return false; }
}

async function waitForUrl(url, name, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await urlReady(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${name} không sẵn sàng tại ${url}`);
}

function captureServiceOutput(name, child) {
  for (const stream of [child.stdout, child.stderr]) {
    stream?.on("data", (data) => {
      for (const line of data.toString().split(/\r?\n/)) {
        if (line.trim()) serviceLogs.push(`[${localIso()}] [${name}] ${line.trimEnd()}`);
      }
    });
  }
}

async function assertPortFree(url, name) {
  if (await urlReady(url)) {
    throw new Error(`${name} đang có service khác; runner từ chối tái sử dụng để bảo toàn fixture cô lập.`);
  }
}

async function prepareRuntimeBackend() {
  await fs.mkdir(runtimeRoot, { recursive: true });
  await fs.writeFile(path.join(runtimeRoot, "package.json"), '{"private":true,"type":"commonjs"}\n', "utf8");
  const sourcePath = path.join(shopRoot, "backend", "server.js");
  const source = await fs.readFile(sourcePath, "utf8");
  const secretMatch = source.match(/const SECRET_KEY = ["']([^"']+)["']/);
  if (!secretMatch) throw new Error("Không đọc được JWT secret từ SUT baseline.");
  secretKey = secretMatch[1];
  await fs.copyFile(sourcePath, path.join(runtimeRoot, "server.js"));
  const adapter = [
    'const sqlite3 = require("sqlite3").verbose();',
    'const db = new sqlite3.Database(process.env.C_FR14_DB_PATH);',
    'module.exports = db;',
    "",
  ].join("\n");
  await fs.writeFile(path.join(runtimeRoot, "database.js"), adapter, "utf8");
}

async function startServices() {
  await assertPortFree(`${API_URL}/api/products`, "Backend port 3000");
  await assertPortFree(ADMIN_URL, "Admin frontend port 5174");
  await prepareRuntimeBackend();

  const backend = spawn(process.execPath, [path.join(runtimeRoot, "server.js")], {
    cwd: runtimeRoot,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      C_FR14_DB_PATH: databasePath,
      NODE_PATH: path.join(shopRoot, "backend", "node_modules"),
    },
  });
  captureServiceOutput("backend", backend);
  serviceProcesses.push({ name: "backend", child: backend });
  await waitForUrl(`${API_URL}/api/products`, "Backend");

  const vite = path.join(shopRoot, "frontend-admin", "node_modules", "vite", "bin", "vite.js");
  const frontend = spawn(process.execPath, [vite, "--host", "127.0.0.1", "--port", "5174", "--strictPort"], {
    cwd: path.join(shopRoot, "frontend-admin"),
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  captureServiceOutput("admin-frontend", frontend);
  serviceProcesses.push({ name: "admin-frontend", child: frontend });
  await waitForUrl(ADMIN_URL, "Admin frontend");
}

async function stopServices() {
  for (const { name, child } of serviceProcesses.reverse()) {
    if (!child.killed) child.kill();
    serviceLogs.push(`[${localIso()}] [${name}] Runner sent stop signal to PID ${child.pid}.`);
  }
}

async function loginToken(account) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(account),
  });
  const body = await response.json();
  if (!response.ok || !body.token) throw new Error(`Fixture login failed: ${response.status}`);
  return body.token;
}

function expiredToken(role = "admin") {
  const jwt = require(path.join(shopRoot, "backend", "node_modules", "jsonwebtoken"));
  return jwt.sign({ id: role === "admin" ? 1 : 2, role, exp: Math.floor(Date.now() / 1000) - 60 }, secretKey);
}

async function api(method, route, { body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let parsed = text;
  try { parsed = text ? JSON.parse(text) : null; } catch { /* keep text */ }
  return { status: response.status, ok: response.ok, body: parsed };
}

async function snapshot() {
  return {
    categories: await fixture.categories(),
    products: await fixture.products(),
  };
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function outcome(status, actual, reason = "") {
  return { status, actual, reason };
}

function compare(condition, actual, failureReason) {
  return condition ? outcome("PASS", actual) : outcome("FAIL", actual, failureReason);
}

function blocked(actual, reason) {
  return outcome("BLOCKED", actual, reason);
}

async function openAdmin(page, token) {
  await page.goto(ADMIN_URL, { waitUntil: "domcontentloaded" });
  await page.evaluate((value) => localStorage.setItem("adminToken", value), token);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("h1").waitFor({ timeout: 7000 });
  await page.getByText("Danh mục", { exact: true }).click();
  await page.getByText(/Quản lý Danh mục/i).waitFor({ timeout: 5000 });
  await page.waitForTimeout(150);
}

async function adminToken() {
  return loginToken(ADMIN);
}

async function userToken() {
  return loginToken(USER);
}

async function uiRows(page) {
  return page.locator("tbody tr").evaluateAll((rows) => rows.map((row) => {
    const cells = [...row.querySelectorAll("td")].map((cell) => cell.textContent?.trim() ?? "");
    return { id: Number(cells[0]?.replace("#", "")), name: cells[1] ?? "" };
  }));
}

async function apiMutation(method, route, body, token) {
  const before = await snapshot();
  const response = await api(method, route, { body, token });
  const after = await snapshot();
  return { response, before, after };
}

function stateUnchanged(actual) {
  return sameJson(actual.before, actual.after);
}

async function createAndOpen(page, name) {
  const token = await adminToken();
  const actual = await apiMutation("POST", "/api/categories", { name }, token);
  await openAdmin(page, token);
  return { ...actual, rows: await uiRows(page) };
}

async function executeCase(id, page) {
  switch (id) {
    case "C-TC-001":
    case "C-TC-003": {
      const expected = await fixture.categories();
      await openAdmin(page, await adminToken());
      const rows = await uiRows(page);
      return compare(sameJson(rows, expected), { expected, rows }, "Danh sách UI không khớp snapshot category.");
    }
    case "C-TC-002": {
      await fixture.exec("DELETE FROM products; DELETE FROM categories;");
      await openAdmin(page, await adminToken());
      const rows = await uiRows(page);
      const mainText = await page.locator("div.flex-1").innerText();
      const iconCount = await page.locator('img, svg, [role="img"]').count();
      const friendly = /không có|trống|chưa có/i.test(mainText);
      return compare(rows.length === 0 && iconCount > 0 && friendly,
        { rows, iconCount, mainText }, "Empty list thiếu icon/hình hoặc message thân thiện.");
    }
    case "C-TC-004": {
      const payload = '<img src=x onerror="window.__cfr14=1">';
      await fixture.run("INSERT INTO categories (id, name) VALUES (?, ?)", [10, payload]);
      await openAdmin(page, await adminToken());
      const textVisible = await page.getByText(payload, { exact: true }).count();
      const injected = await page.locator('tbody img[src="x"]').count();
      const executed = await page.evaluate(() => window.__cfr14 === 1);
      return compare(textVisible === 1 && injected === 0 && !executed,
        { textVisible, injected, executed }, "Markup không được render an toàn như text.");
    }
    case "C-TC-005": {
      const token = await adminToken();
      const before = await snapshot();
      await openAdmin(page, token);
      const responseWait = page.waitForResponse((response) => response.url().endsWith("/api/categories") && response.request().method() === "POST");
      await page.getByPlaceholder("Tên danh mục mới").fill("Thiết bị đeo C-FR14");
      await page.getByRole("button", { name: "Thêm mới" }).click();
      const response = await responseWait;
      await page.waitForTimeout(200);
      const after = await snapshot();
      const created = after.categories.filter((row) => row.name === "Thiết bị đeo C-FR14");
      const oldUnchanged = before.categories.every((row) => after.categories.some((next) => sameJson(row, next)));
      return compare(response.ok() && created.length === 1 && after.categories.length === before.categories.length + 1 && oldUnchanged,
        { status: response.status(), before, after, created }, "Create UI nominal không thỏa state/invariant.");
    }
    case "C-TC-006":
    case "C-TC-007":
    case "C-TC-008": {
      const body = id === "C-TC-006" ? { name: "A" } : id === "C-TC-007" ? {} : { name: "" };
      const actual = await apiMutation("POST", "/api/categories", body, await adminToken());
      if (id === "C-TC-006") {
        const created = actual.after.categories.filter((row) => row.name === "A");
        return compare(actual.response.ok && created.length === 1 && actual.after.categories.length === actual.before.categories.length + 1,
          actual, "Name một ký tự không được Create đúng một record.");
      }
      return compare(!actual.response.ok && stateUnchanged(actual), actual,
        "Missing/empty name không bị reject hoặc database đã đổi.");
    }
    case "C-TC-009": {
      const token = await adminToken();
      const before = await snapshot();
      let postRequests = 0;
      page.on("request", (request) => {
        if (request.url().endsWith("/api/categories") && request.method() === "POST") postRequests += 1;
      });
      await openAdmin(page, token);
      await page.getByRole("button", { name: "Thêm mới" }).click();
      await page.waitForTimeout(250);
      const after = await snapshot();
      const buttonTop = await page.getByRole("button", { name: "Thêm mới" }).evaluate((el) => el.getBoundingClientRect().top);
      const errorCandidates = page.locator("form").locator('[role="alert"], .error, [class*="text-red"]');
      const errorCount = await errorCandidates.count();
      const errorTop = errorCount ? await errorCandidates.first().evaluate((el) => el.getBoundingClientRect().top) : null;
      return compare(postRequests === 0 && stateUnchanged({ before, after }) && errorTop !== null && errorTop < buttonTop,
        { postRequests, before, after, errorCount, errorTop, buttonTop }, "Empty UI submit không được chặn với inline error phía trên nút.");
    }
    case "C-TC-010":
    case "C-TC-011":
    case "C-TC-012":
    case "C-TC-013": {
      const name = {
        "C-TC-010": " ",
        "C-TC-011": "  Laptop  ",
        "C-TC-012": "Laptop",
        "C-TC-013": "laptop",
      }[id];
      const actual = await apiMutation("POST", "/api/categories", { name }, await adminToken());
      return blocked({ name, ...actual }, "SRS chưa quy định whitespace/trim/duplicate/case semantics.");
    }
    case "C-TC-014":
    case "C-TC-015": {
      const name = id === "C-TC-014" ? "Phụ kiện & Cáp (USB-C)" : "Điện thoại_日本語_🙂";
      const actual = await createAndOpen(page, name);
      const created = actual.after.categories.filter((row) => row.name === name);
      const visible = actual.rows.filter((row) => row.name === name);
      return compare(actual.response.ok && created.length === 1 && visible.length === 1,
        { name, ...actual }, "Special/Unicode non-empty name không round-trip đúng.");
    }
    case "C-TC-016": {
      const name = '<img src=x onerror="window.__cfr14=1">';
      const actual = await createAndOpen(page, name);
      const injected = await page.locator('tbody img[src="x"]').count();
      const executed = await page.evaluate(() => window.__cfr14 === 1);
      const exactText = await page.getByText(name, { exact: true }).count();
      const onlyOne = actual.after.categories.length === actual.before.categories.length + 1;
      return compare(actual.response.ok && onlyOne && injected === 0 && !executed && exactText === 1,
        { ...actual, injected, executed, exactText }, "Create markup vi phạm state isolation hoặc safe render.");
    }
    case "C-TC-017":
    case "C-TC-018":
    case "C-TC-019": {
      const length = { "C-TC-017": 255, "C-TC-018": 256, "C-TC-019": 1024 }[id];
      const name = `C${"x".repeat(length - 1)}`;
      const actual = await apiMutation("POST", "/api/categories", { name }, await adminToken());
      return blocked({ length, ...actual }, "Category không có maximum length oracle; đây là upper-length probe.");
    }
    case "C-TC-020": {
      const actual = await apiMutation("POST", "/api/categories", { name: null }, await adminToken());
      return blocked(actual, "SRS/API contract chưa quy định null/wrong-type representation.");
    }
    case "C-TC-021":
    case "C-TC-022":
    case "C-TC-023":
    case "C-TC-024":
    case "C-TC-025": {
      const target = id === "C-TC-024" ? 999 : id === "C-TC-025" ? 2 : 4;
      const body = id === "C-TC-022" ? { name: "" } : id === "C-TC-023" ? {} : { name: `Updated ${id}` };
      const actual = await apiMutation("PUT", `/api/categories/${target}`, body, await adminToken());
      const refs = await fixture.referenceCount(target);
      return blocked({ target, refs, ...actual }, "Update không có business oracle trong nội dung FR-14.");
    }
    case "C-TC-026": {
      const actual = await apiMutation("DELETE", "/api/categories/4", undefined, await adminToken());
      const targetGone = !actual.after.categories.some((row) => row.id === 4);
      const nonTargets = actual.before.categories.filter((row) => row.id !== 4);
      return compare(actual.response.ok && targetGone && sameJson(nonTargets, actual.after.categories),
        actual, "Delete nominal không chỉ xóa đúng target.");
    }
    case "C-TC-027":
    case "C-TC-028":
    case "C-TC-029":
    case "C-TC-030":
    case "C-TC-031": {
      const raw = {
        "C-TC-027": "999",
        "C-TC-028": "0",
        "C-TC-029": "-1",
        "C-TC-030": "1.5",
        "C-TC-031": "abc",
      }[id];
      const actual = await apiMutation("DELETE", `/api/categories/${encodeURIComponent(raw)}`, undefined, await adminToken());
      return blocked({ rawId: raw, ...actual }, "SRS chưa quy định response/verdict cho nonexistent hoặc malformed ID.");
    }
    case "C-TC-032": {
      const raw = "1 OR 1=1";
      const actual = await apiMutation("DELETE", `/api/categories/${encodeURIComponent(raw)}`, undefined, await adminToken());
      return compare(stateUnchanged(actual), { rawId: raw, ...actual }, "SQL-like ID đã làm thay đổi category/non-target state.");
    }
    case "C-TC-033":
    case "C-TC-034": {
      const target = id === "C-TC-033" ? 2 : 1;
      const refsBefore = await fixture.referenceCount(target);
      const actual = await apiMutation("DELETE", `/api/categories/${target}`, undefined, await adminToken());
      const refsAfter = await fixture.referenceCount(target);
      return blocked({ target, refsBefore, refsAfter, ...actual }, "SRS chưa quy định referential policy cho Delete category.");
    }
    case "C-TC-035":
    case "C-TC-036":
    case "C-TC-037":
    case "C-TC-038": {
      const token = id === "C-TC-035" ? undefined
        : id === "C-TC-036" ? "invalid.signature.token"
          : id === "C-TC-037" ? expiredToken("admin")
            : await userToken();
      const actual = await apiMutation("POST", "/api/categories", { name: `Auth ${id}` }, token);
      return compare(!actual.response.ok && stateUnchanged(actual), actual,
        "Create mutation không bị reject bởi authentication/authorization oracle.");
    }
    case "C-TC-039":
    case "C-TC-040": {
      const token = id === "C-TC-039" ? undefined : await userToken();
      const actual = await apiMutation("DELETE", "/api/categories/4", undefined, token);
      return compare(!actual.response.ok && stateUnchanged(actual), actual,
        "Delete mutation không bị reject bởi authentication/authorization oracle.");
    }
    case "C-TC-041": {
      const dialogs = [];
      page.on("dialog", async (dialog) => { dialogs.push(dialog.message()); await dialog.dismiss(); });
      await page.goto(ADMIN_URL, { waitUntil: "domcontentloaded" });
      const inputs = page.locator("form input");
      await inputs.nth(0).fill(USER.email);
      await inputs.nth(1).fill(USER.password);
      await page.getByRole("button", { name: "Login" }).click();
      await page.waitForTimeout(250);
      const tokenStored = await page.evaluate(() => localStorage.getItem("adminToken"));
      const loginVisible = await page.getByRole("button", { name: "Login" }).count();
      return compare(!tokenStored && loginVisible === 1 && dialogs.length > 0,
        { tokenStored: Boolean(tokenStored), loginVisible, dialogs }, "User login không bị Admin UI từ chối.");
    }
    case "C-TC-042": {
      await page.goto(ADMIN_URL, { waitUntil: "domcontentloaded" });
      await page.evaluate((value) => localStorage.setItem("adminToken", value), await userToken());
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(700);
      const adminShell = await page.getByText("Danh mục", { exact: true }).count();
      const tokenStillStored = await page.evaluate(() => Boolean(localStorage.getItem("adminToken")));
      return compare(adminShell === 0 && !tokenStillStored,
        { adminShell, tokenStillStored }, "JWT user trong localStorage truy cập được Admin subsystem.");
    }
    case "C-TC-043": {
      const token = await adminToken();
      await openAdmin(page, token);
      let postRequests = 0;
      page.on("request", (request) => {
        if (request.url().endsWith("/api/categories") && request.method() === "POST") postRequests += 1;
      });
      const before = await snapshot();
      const input = page.getByPlaceholder("Tên danh mục mới");
      const hasRequired = await input.getAttribute("required") !== null;
      const nearbyText = await input.locator("xpath=ancestor::form").innerText();
      await page.getByRole("button", { name: "Thêm mới" }).click();
      await page.waitForTimeout(200);
      const after = await snapshot();
      const buttonTop = await page.getByRole("button", { name: "Thêm mới" }).evaluate((el) => el.getBoundingClientRect().top);
      const errors = page.locator("form").locator('[role="alert"], .error, [class*="text-red"]');
      const errorCount = await errors.count();
      const errorTop = errorCount ? await errors.first().evaluate((el) => el.getBoundingClientRect().top) : null;
      return compare((hasRequired || nearbyText.includes("*")) && postRequests === 0 && errorTop !== null && errorTop < buttonTop && sameJson(before, after),
        { hasRequired, nearbyText, postRequests, errorCount, errorTop, buttonTop, before, after }, "Required marker/error placement hoặc request suppression không đạt.");
    }
    case "C-TC-044": {
      await openAdmin(page, await adminToken());
      const headings = await page.locator("h1").allTextContents();
      const describesCategory = headings.length === 1 && /danh mục|category/i.test(headings[0]);
      return compare(describesCategory, { headings }, "Trang không có đúng một h1 mô tả category.");
    }
    case "C-TC-045": {
      await openAdmin(page, await adminToken());
      const breadcrumbs = await page.locator('nav[aria-label*="breadcrumb" i], .breadcrumb').count();
      return blocked({ breadcrumbs }, "FR-23 không bắt buộc breadcrumb cho Admin category page.");
    }
    case "C-TC-046": {
      await openAdmin(page, await adminToken());
      const colors = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll("button")];
        const color = (label) => {
          const button = buttons.find((item) => item.textContent?.trim() === label);
          return button ? getComputedStyle(button).backgroundColor : null;
        };
        return { create: color("Thêm mới"), delete: color("Xóa") };
      });
      const blue = ["rgb(37, 99, 235)", "rgb(59, 130, 246)"].includes(colors.create);
      const red = ["rgb(239, 68, 68)", "rgb(220, 38, 38)"].includes(colors.delete);
      return compare(blue && red, colors, "Màu Create/Delete không đúng positive/danger convention.");
    }
    case "C-TC-047": {
      await openAdmin(page, await adminToken());
      await page.locator("body").click({ position: { x: 2, y: 2 } });
      const sequence = [];
      for (let index = 0; index < 8; index += 1) {
        await page.keyboard.press("Tab");
        sequence.push(await page.evaluate(() => {
          const element = document.activeElement;
          return {
            tag: element?.tagName ?? "NONE",
            text: element?.textContent?.trim() ?? "",
            placeholder: element?.getAttribute("placeholder") ?? "",
          };
        }));
      }
      const inputIndex = sequence.findIndex((item) => item.placeholder === "Tên danh mục mới");
      const addIndex = sequence.findIndex((item) => item.text === "Thêm mới");
      const deleteIndex = sequence.findIndex((item) => item.text === "Xóa");
      return compare(inputIndex >= 0 && addIndex > inputIndex && deleteIndex > addIndex,
        { sequence, inputIndex, addIndex, deleteIndex }, "Tab order không đi qua input → Thêm → Xóa.");
    }
    case "C-TC-048": {
      await openAdmin(page, await adminToken());
      const panel = await page.getByText(/Quản lý Danh mục/i).locator("xpath=..").innerText().catch(async () => page.locator("div.flex-1").innerText());
      const placeholder = await page.getByPlaceholder("Tên danh mục mới").getAttribute("placeholder");
      const required = ["Quản lý Danh mục", "Thêm mới", "Tên Danh Mục", "Hành động", "Xóa"];
      return compare(required.every((text) => panel.includes(text)) && placeholder === "Tên danh mục mới",
        { required, placeholder, panel }, "Category UI thiếu nhãn tiếng Việt bắt buộc.");
    }
    default:
      return outcome("NOT RUN", {}, "Runner không có implementation cho test ID.");
  }
}

async function diagnostic(page, record) {
  await page.evaluate((payload) => {
    const pre = document.createElement("pre");
    pre.id = "c-fr14-runner-diagnostic";
    pre.style.cssText = "white-space:pre-wrap;border:2px solid #444;padding:12px;background:#fff;color:#111;position:relative;z-index:99999";
    pre.textContent = JSON.stringify(payload, null, 2);
    document.body.prepend(pre);
  }, record).catch(() => {});
}

async function runOne(test, order) {
  await fixture.reset();
  const context = await browser.newContext({ locale: "vi-VN", viewport: { width: 1440, height: 1000 } });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
  const page = await context.newPage();
  const startedAt = localIso();
  const startedMs = Date.now();
  let verdict;
  try {
    verdict = await executeCase(test.id, page);
  } catch (error) {
    verdict = outcome("BLOCKED", { runnerError: error.message },
      `Automation/runtime error prevented valid comparison: ${error.message}`);
  }
  const screenshot = path.join(screenshotRoot, `${test.id}.png`);
  const trace = path.join(traceRoot, `${test.id}.zip`);
  await diagnostic(page, { id: test.id, status: verdict.status, actual: verdict.actual, reason: verdict.reason });
  await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
  await context.tracing.stop({ path: trace });
  await context.close();
  results.push({
    ...test,
    status: verdict.status,
    actual: verdict.actual,
    reason: verdict.reason,
    executionOrder: order,
    timestamp: startedAt,
    durationMs: Date.now() - startedMs,
    evidence: [relative(screenshot), relative(trace)],
  });
  process.stdout.write(`${test.id}: ${verdict.status}\n`);
}

function summary() {
  const count = (status) => results.filter((item) => item.status === status).length;
  return {
    designed: 48,
    attempted: count("PASS") + count("FAIL") + count("BLOCKED"),
    executed: count("PASS") + count("FAIL"),
    passed: count("PASS"),
    failed: count("FAIL"),
    blocked: count("BLOCKED"),
    notRun: count("NOT RUN"),
  };
}

function md(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function writeReport(run) {
  const rows = run.results.map((item) => {
    const actual = item.reason || JSON.stringify(item.actual);
    return `| \`${item.id}\` | \`${item.status}\` | ${md(actual).slice(0, 420)} | [screenshot](../../${item.evidence[0]}) · [trace](../../${item.evidence[1]}) |`;
  }).join("\n");
  const failedIds = run.results.filter((item) => item.status === "FAIL").map((item) => `\`${item.id}\``).join(", ") || "Không có";
  const blockedIds = run.results.filter((item) => item.status === "BLOCKED").map((item) => `\`${item.id}\``).join(", ") || "Không có";
  const content = `# C-FR14 — Kết quả thực thi Step 5

## 1. Trạng thái

| Trường | Giá trị |
|---|---|
| Artifact | \`features/C/05_execution_results.md\` |
| Trạng thái | \`PENDING HUMAN REVIEW\` |
| Test case baseline | \`features/C/04_test_cases.md\` — user yêu cầu thực thi cùng lượt, chưa qua independent human review |
| SUT baseline | \`${BASELINE}\` |
| Bắt đầu | ${run.startedAt} |
| Kết thúc | ${run.endedAt} |
| Lệnh | \`npm test\` trong \`automation/C-FR14\` |
| Browser | ${run.environment.browser} |
| SQLite fixture | \`automation/C-FR14/runtime/c-fr14-fixture.sqlite\` — runtime only, không commit |

## 2. Thống kê

| Designed | Attempted | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|---:|
| ${run.summary.designed} | ${run.summary.attempted} | ${run.summary.executed} | ${run.summary.passed} | ${run.summary.failed} | ${run.summary.blocked} | ${run.summary.notRun} |

Quy ước: \`attempted = PASS + FAIL + BLOCKED\`; \`executed = PASS + FAIL\`.

## 3. Kết quả từng test case

| Test ID | Verdict | Actual/reason tóm tắt | Evidence |
|---|---|---|---|
${rows}

Chi tiết expected, actual có cấu trúc, timestamp và duration nằm trong
\`evidence/C/execution/results.json\`.

## 4. FAIL và BLOCKED

- FAIL: ${failedIds}.
- BLOCKED: ${blockedIds}.
- BLOCKED do requirement gap không tự động là defect. Automation/runtime error nếu có được
  ghi riêng trong từng result và phải được review trước Step 6.

## 5. Tính cô lập và khả năng tái hiện

- Runner sao chép read-only \`SHOP/backend/server.js\` vào runtime và nạp database adapter
  trỏ tới SQLite fixture riêng.
- Mỗi case reset fixture; test chạy tuần tự theo \`C-TC-001\` → \`C-TC-048\`.
- Runner từ chối dùng port đã bận và chỉ dừng process do chính nó tạo.
- Source và \`SHOP/backend/database.sqlite\` không được runner sửa.
- Service log: \`evidence/C/execution/service-logs.txt\`.
- Machine-readable result: \`evidence/C/execution/results.json\`.

## 6. Human review gate

- [ ] Đối chiếu 48 expected result với actual trong \`results.json\`.
- [ ] Mở screenshot/trace của mọi FAIL và BLOCKED tiêu biểu.
- [ ] Xác nhận thống kê cộng đúng 48 và không có ID trùng/thiếu.
- [ ] Xác nhận gap case không bị ghi thành confirmed defect.
- [ ] Xác nhận source SHOP và runtime database của SHOP không đổi do runner.
- [ ] Chỉ chuyển Step 4–5 sang \`REVIEWED\` sau khi evidence nhất quán.
`;
  await fs.writeFile(reportPath, content, "utf8");
}

async function main() {
  const startedAt = localIso();
  await fs.rm(screenshotRoot, { recursive: true, force: true });
  await fs.rm(traceRoot, { recursive: true, force: true });
  await fs.mkdir(screenshotRoot, { recursive: true });
  await fs.mkdir(traceRoot, { recursive: true });
  await fs.mkdir(runtimeRoot, { recursive: true });

  const designed = await readDesignedCases();
  fixture = createDatabaseFixture(shopRoot, databasePath, credentials);
  await fixture.initialize();
  await startServices();
  const executablePath = await findBrowserExecutable();
  browser = await chromium.launch({ executablePath, headless: true });

  try {
    for (let index = 0; index < executionOrder.length; index += 1) {
      await runOne(designed.get(executionOrder[index]), index + 1);
    }
  } finally {
    await browser?.close();
    await stopServices();
  }

  const endedAt = localIso();
  const run = {
    schemaVersion: 1,
    feature: "C-FR14",
    platform: "Admin Web",
    baseline: BASELINE,
    startedAt,
    endedAt,
    command: "npm test",
    environment: {
      os: `${process.platform} ${process.arch}`,
      node: process.version,
      browser: `System Chromium channel: ${executablePath}`,
      adminUrl: ADMIN_URL,
      apiUrl: API_URL,
      timezone: "Asia/Saigon (UTC+07:00)",
      database: "isolated SQLite runtime fixture",
    },
    conventions: {
      attempted: "PASS + FAIL + BLOCKED",
      executed: "PASS + FAIL",
    },
    executionOrder,
    summary: summary(),
    results: [...results].sort((a, b) => a.id.localeCompare(b.id)),
  };
  await fs.writeFile(resultPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  serviceLogs.push(`[${endedAt}] [runner] Summary ${JSON.stringify(run.summary)}`);
  await fs.writeFile(serviceLogPath, `${serviceLogs.join("\n")}\n`, "utf8");
  await writeReport(run);
  process.stdout.write(`${JSON.stringify(run.summary)}\n`);
}

main().catch(async (error) => {
  serviceLogs.push(`[${localIso()}] [runner] FATAL ${error.stack ?? error.message}`);
  await browser?.close().catch(() => {});
  await stopServices().catch(() => {});
  await fs.mkdir(evidenceRoot, { recursive: true }).catch(() => {});
  await fs.writeFile(serviceLogPath, `${serviceLogs.join("\n")}\n`, "utf8").catch(() => {});
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
