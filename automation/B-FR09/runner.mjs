import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabaseFixture } from "./fixtures/database.mjs";

const automationRoot = path.dirname(fileURLToPath(import.meta.url));
const submissionRoot = path.resolve(automationRoot, "../..");
const workspaceRoot = path.resolve(submissionRoot, "..");
const shopRoot = path.join(workspaceRoot, "SHOP");
const runtimeRoot = path.join(automationRoot, "runtime");
const databasePath = path.join(runtimeRoot, "b-fr09-fixture.sqlite");
const evidenceRoot = path.join(submissionRoot, "evidence", "B", "execution");
const screenshotRoot = path.join(evidenceRoot, "screenshots");
const traceRoot = path.join(evidenceRoot, "traces");
const resultPath = path.join(evidenceRoot, "results.json");
const serviceLogPath = path.join(evidenceRoot, "service-logs.txt");
const reportPath = path.join(submissionRoot, "features", "B", "05_execution_results.md");
const testCasePath = path.join(submissionRoot, "features", "B", "04_test_cases.md");

const WEB_URL = "http://127.0.0.1:5173";
const API_URL = "http://127.0.0.1:3000";
const fixtureCredentials = {
  userPassword: `B-FR09-${randomUUID()}`,
  adminPassword: `B-FR09-admin-${randomUUID()}`,
};
const U1 = { id: 1, email: "test@eshop.com", password: fixtureCredentials.userPassword };
const U2 = { id: 2, email: "test2@eshop.com", password: fixtureCredentials.userPassword };
const BASELINE = "85af3ba875c88283615e22cb108f13e2fccaf0e9";

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const executionOrder = [
  "B-TC-035", "B-TC-036", "B-TC-037", "B-TC-038", "B-TC-039",
  "B-TC-001", "B-TC-002", "B-TC-003", "B-TC-004", "B-TC-009",
  "B-TC-013", "B-TC-014", "B-TC-015", "B-TC-016", "B-TC-017",
  "B-TC-018", "B-TC-019", "B-TC-020", "B-TC-021", "B-TC-022",
  "B-TC-023", "B-TC-024", "B-TC-025", "B-TC-026", "B-TC-027",
  "B-TC-028", "B-TC-029", "B-TC-030", "B-TC-031", "B-TC-040",
  "B-TC-041", "B-TC-010", "B-TC-011", "B-TC-012", "B-TC-005",
  "B-TC-006", "B-TC-007", "B-TC-008", "B-TC-032", "B-TC-033",
  "B-TC-034",
];

const serviceProcesses = [];
const serviceLogs = [];
const results = [];
const fixtureChecks = [];
let browser;
let fixture;

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
    if (!/^\| `B-TC-\d{3}` \|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    const id = cells[0].replaceAll("`", "");
    map.set(id, {
      id,
      title: cells[2].replaceAll("`", ""),
      expected: cells[4],
      coverage: cells[5].replaceAll("`", ""),
    });
  }
  if (map.size !== 41) throw new Error(`Expected 41 designed cases, found ${map.size}.`);
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
        const text = line.trimEnd();
        if (text) serviceLogs.push(`[${localIso()}] [${name}] ${text}`);
      }
    });
  }
}

async function assertPortFree(url, name) {
  if (await urlReady(url)) {
    throw new Error(`${name} đã có service khác; runner từ chối tái sử dụng để bảo toàn fixture cô lập.`);
  }
}

async function prepareRuntimeBackend() {
  await fs.mkdir(runtimeRoot, { recursive: true });
  await fs.writeFile(
    path.join(runtimeRoot, "package.json"),
    '{"private":true,"type":"commonjs"}\n',
    "utf8",
  );
  await fs.copyFile(path.join(shopRoot, "backend", "server.js"), path.join(runtimeRoot, "server.js"));
  const adapter = [
    'const sqlite3 = require("sqlite3").verbose();',
    'const db = new sqlite3.Database(process.env.B_FR09_DB_PATH);',
    'module.exports = db;',
    "",
  ].join("\n");
  await fs.writeFile(path.join(runtimeRoot, "database.js"), adapter, "utf8");
}

async function startServices() {
  await assertPortFree(`${API_URL}/api/products`, "Backend port 3000");
  await assertPortFree(`${WEB_URL}/checkout`, "Frontend port 5173");
  await prepareRuntimeBackend();

  const backend = spawn(process.execPath, [path.join(runtimeRoot, "server.js")], {
    cwd: runtimeRoot,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      B_FR09_DB_PATH: databasePath,
      NODE_PATH: path.join(shopRoot, "backend", "node_modules"),
    },
  });
  captureServiceOutput("backend", backend);
  serviceProcesses.push({ name: "backend", child: backend });
  await waitForUrl(`${API_URL}/api/products`, "Backend");

  const vite = path.join(shopRoot, "frontend-web", "node_modules", "vite", "bin", "vite.js");
  const frontend = spawn(process.execPath, [vite, "--host", "127.0.0.1", "--port", "5173", "--strictPort"], {
    cwd: path.join(shopRoot, "frontend-web"),
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  captureServiceOutput("frontend", frontend);
  serviceProcesses.push({ name: "frontend", child: frontend });
  await waitForUrl(`${WEB_URL}/checkout`, "Frontend");
}

async function stopServices() {
  for (const { name, child } of serviceProcesses.reverse()) {
    if (!child.killed) child.kill();
    serviceLogs.push(`[${localIso()}] [${name}] Runner sent stop signal to PID ${child.pid}.`);
  }
}

async function loginToken(user = U1) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  const body = await response.json();
  if (!response.ok || !body.token) throw new Error(`Login fixture failed: ${response.status}`);
  return body.token;
}

async function establishOrigin(page) {
  await page.goto(WEB_URL, { waitUntil: "domcontentloaded" });
}

async function apiApply(page, body, authorization) {
  await establishOrigin(page);
  return page.evaluate(async ({ apiUrl, requestBody, auth }) => {
    const headers = { "content-type": "application/json" };
    if (auth) headers.Authorization = auth;
    const response = await fetch(`${apiUrl}/api/apply-coupon`, {
      method: "POST", headers, body: JSON.stringify(requestBody),
    });
    return { status: response.status, body: await response.json() };
  }, { apiUrl: API_URL, requestBody: body, auth: authorization });
}

async function openCheckoutWithCart(page, total, authenticated = true) {
  await fixture.run("UPDATE products SET price = ? WHERE id = 1", [total]);
  await establishOrigin(page);
  if (authenticated) {
    const token = await loginToken(U1);
    await page.evaluate((value) => localStorage.setItem("token", value), token);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText(/Chào, Test User/).waitFor({ timeout: 5000 });
  } else {
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
  }
  await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
  await page.getByRole("link", { name: /Giỏ hàng/ }).click();
  if (authenticated) {
    await page.getByRole("button", { name: "Tiến hành thanh toán" }).click();
    await page.waitForURL(/\/checkout$/);
  } else {
    await page.goto(`${WEB_URL}/checkout`, { waitUntil: "domcontentloaded" });
  }
}

async function applyOnWeb(page, { total, code, authenticated = true, editTotal }) {
  await openCheckoutWithCart(page, total, authenticated);
  if (editTotal !== undefined) {
    const input = page.locator('input[type="number"]');
    await input.fill(String(editTotal));
  }
  const codeInput = page.getByPlaceholder("Nhập mã giảm giá...");
  await codeInput.fill(code);
  const button = page.getByRole("button", { name: "Áp dụng" });
  if (await button.isDisabled()) return { disabled: true, response: null };
  const responsePromise = page.waitForResponse((response) => response.url().includes("/api/apply-coupon"));
  await button.click();
  const response = await responsePromise;
  const body = await response.json();
  await page.waitForTimeout(100);
  return { disabled: false, response: { status: response.status(), body } };
}

function accepted(response) {
  return response?.status >= 200 && response?.status < 300 && response?.body?.success === true;
}

function outcome(status, actual, reason = "") {
  return { status, actual, reason };
}

function compare(condition, actual, failureReason) {
  return condition ? outcome("PASS", actual) : outcome("FAIL", actual, failureReason);
}

async function executeCase(id, page) {
  switch (id) {
    case "B-TC-001": {
      const actual = await applyOnWeb(page, { total: 400000, code: "SAVE10" });
      const body = actual.response?.body;
      return compare(accepted(actual.response) && body.discount_amount === 40000 && body.final_amount === 360000,
        actual, "Percent discount/final khác công thức SRS.");
    }
    case "B-TC-002": {
      const actual = await applyOnWeb(page, { total: 600000, code: "BIGBUY" });
      const body = actual.response?.body;
      return compare(accepted(actual.response) && body.discount_amount === 50000 && body.final_amount === 550000,
        actual, "Fixed discount/final không đúng.");
    }
    case "B-TC-003": {
      const actual = await applyOnWeb(page, { total: 400000, code: "NOTEXIST" });
      return compare(actual.response?.status >= 400 && !(await page.getByText(/Tiết kiệm:/).count()), actual,
        "Coupon không tồn tại không bị từ chối đúng.");
    }
    case "B-TC-004": {
      const actual = await applyOnWeb(page, { total: 400000, code: "INACTIVE10" });
      return compare(actual.response?.status >= 400 && !(await page.getByText(/Tiết kiệm:/).count()), actual,
        "Coupon inactive không bị từ chối đúng.");
    }
    case "B-TC-005":
    case "B-TC-006": {
      const code = id === "B-TC-005" ? "" : "   ";
      const actual = await applyOnWeb(page, { total: 400000, code });
      return outcome("BLOCKED", actual,
        "SRS chưa quy định business verdict cho empty/whitespace và UI không cho submit.");
    }
    case "B-TC-007":
    case "B-TC-008": {
      const code = id === "B-TC-007" ? "save10" : " SAVE10 ";
      const actual = await applyOnWeb(page, { total: 400000, code });
      return outcome("BLOCKED", actual,
        "SRS chưa quy định case-folding/trim; actual được ghi nhận nhưng không có oracle để Pass/Fail normalization.");
    }
    case "B-TC-009": {
      const actual = await applyOnWeb(page, { total: 400000, code: "EXPIRED" });
      return compare(actual.response?.status >= 400 && /hết hạn/i.test(actual.response?.body?.error ?? ""), actual,
        "Coupon hết hạn không bị từ chối.");
    }
    case "B-TC-010":
    case "B-TC-011":
    case "B-TC-012": {
      await openCheckoutWithCart(page, 400000, true);
      return outcome("BLOCKED", { controlledClock: false, page: page.url() },
        "SUT không có clock injection và requirement chưa chốt timezone/granularity; không thể đánh giá E−δ/E/E+δ tin cậy.");
    }
    case "B-TC-013":
    case "B-TC-014":
    case "B-TC-015": {
      const total = { "B-TC-013": 299999, "B-TC-014": 300000, "B-TC-015": 300001 }[id];
      const actual = await applyOnWeb(page, { total, code: "SAVE10" });
      if (id === "B-TC-013") return compare(!accepted(actual.response), actual, "M−1 không bị từ chối.");
      if (id === "B-TC-014") return compare(accepted(actual.response) && actual.response.body.discount_amount === 30000 && actual.response.body.final_amount === 270000, actual,
        "Tại M phải hợp lệ và đúng công thức.");
      return compare(accepted(actual.response), actual, "M+1 phải được chấp nhận; rounding không được assert.");
    }
    case "B-TC-016": {
      const actual = await applyOnWeb(page, { total: 400000, editTotal: 299999, code: "SAVE10" });
      return compare(accepted(actual.response) && actual.response.body.discount_amount === 40000 && actual.response.body.final_amount === 360000,
        { ...actual, editableInput: true, authoritativeCartTotal: 400000 },
        "UI cho sửa total và Backend dùng total đã sửa thay vì recompute cart.");
    }
    case "B-TC-017": {
      await fixture.run("UPDATE products SET price = ? WHERE id = 1", [299999]);
      const actual = await apiApply(page, { code: "SAVE10", total_amount: 400000, user_id: U1.id });
      return compare(!accepted(actual), { response: actual, authoritativeCartTotal: 299999, forgedTotal: 400000 },
        "Backend tin total_amount client và cho bypass threshold.");
    }
    case "B-TC-018":
    case "B-TC-019":
    case "B-TC-020": {
      const auth = id === "B-TC-018" ? undefined : id === "B-TC-019" ? "Bearer invalid.signature" : "Bearer expired.fixture.token";
      const actual = await apiApply(page, { code: "BIGBUY", total_amount: 600000, user_id: null }, auth);
      return compare(actual.status === 401 || actual.status === 403, actual,
        "Apply-coupon chấp nhận request không có/không hợp lệ/hết hạn auth.");
    }
    case "B-TC-021": {
      await fixture.addUsage(1, U1.id, 1);
      const token = await loginToken(U1);
      const actual = await apiApply(page, { code: "SAVE10", total_amount: 400000, user_id: U2.id }, `Bearer ${token}`);
      return compare(!accepted(actual), { response: actual, tokenUser: U1.id, bodyUser: U2.id },
        "Backend dùng user_id từ body thay vì identity trong JWT.");
    }
    case "B-TC-022": {
      await page.goto(`${WEB_URL}/checkout`, { waitUntil: "domcontentloaded" });
      const pageAccessible = page.url().endsWith("/checkout") && await page.getByPlaceholder("Nhập mã giảm giá...").isVisible();
      const actual = await applyOnWeb(page, { total: 600000, code: "BIGBUY", authenticated: false });
      return compare(!pageAccessible && !accepted(actual.response), { pageAccessible, apply: actual },
        "Người chưa đăng nhập truy cập checkout và áp dụng coupon được.");
    }
    case "B-TC-023":
    case "B-TC-024":
    case "B-TC-025":
    case "B-TC-026":
    case "B-TC-027":
    case "B-TC-028": {
      const isLimitOne = ["B-TC-023", "B-TC-024", "B-TC-025"].includes(id);
      const couponId = isLimitOne ? 1 : 3;
      const code = isLimitOne ? "SAVE10" : "VIP100";
      const count = {
        "B-TC-023": 0, "B-TC-024": 1, "B-TC-025": 2,
        "B-TC-026": 1, "B-TC-027": 2, "B-TC-028": 3,
      }[id];
      await fixture.addUsage(couponId, U1.id, count);
      const actual = await applyOnWeb(page, { total: 600000, code });
      const shouldAccept = id === "B-TC-023" || id === "B-TC-026";
      return compare(accepted(actual.response) === shouldAccept, { ...actual, usageCount: count },
        "Usage-limit verdict khác oracle.");
    }
    case "B-TC-029": {
      await fixture.addUsage(2, U1.id, 1);
      const actual = await applyOnWeb(page, { total: 400000, code: "SAVE10" });
      return compare(accepted(actual.response), actual, "Usage của coupon khác làm sai eligibility.");
    }
    case "B-TC-030": {
      const actual = await applyOnWeb(page, { total: 400000, code: "PERCENT1" });
      return compare(accepted(actual.response) && actual.response.body.discount_amount === 4000 && actual.response.body.final_amount === 396000,
        actual, "Percent lower-bound formula sai.");
    }
    case "B-TC-031": {
      const actual = await applyOnWeb(page, { total: 600000, code: "FIXED1" });
      return compare(accepted(actual.response) && actual.response.body.discount_amount === 1 && actual.response.body.final_amount === 599999,
        actual, "Fixed lower-bound formula sai.");
    }
    case "B-TC-032": {
      await fixture.insertCoupon({ id: 20, code: "FRACTION", type: "percent", discountValue: 10, minimum: 0, expiry: "2099-12-31", limit: 1 });
      const actual = await apiApply(page, { code: "FRACTION", total_amount: 100001, user_id: U1.id });
      return outcome("BLOCKED", actual, "SRS không quy định integer rounding cho fractional VND; actual được ghi nhưng không có rounding oracle.");
    }
    case "B-TC-033": {
      await fixture.insertCoupon({ id: 21, code: "PERCENT101", type: "percent", discountValue: 101, minimum: 0, expiry: "2099-12-31", limit: 1 });
      const actual = await apiApply(page, { code: "PERCENT101", total_amount: 400000, user_id: U1.id });
      return outcome("BLOCKED", actual, "SRS không quy định percent maximum/cap/reject.");
    }
    case "B-TC-034": {
      await fixture.insertCoupon({ id: 22, code: "OVERFIXED", type: "fixed", discountValue: 700000, minimum: 0, expiry: "2099-12-31", limit: 1 });
      const actual = await apiApply(page, { code: "OVERFIXED", total_amount: 600000, user_id: U1.id });
      return outcome("BLOCKED", actual, "SRS không quy định cap/floor khi fixed discount lớn hơn total.");
    }
    case "B-TC-035": {
      const actual = await applyOnWeb(page, { total: 600000, code: "BIGBUY" });
      const text = await page.locator("main").innerText();
      const values = ["600.000 ₫", "50.000 ₫", "550.000 ₫"];
      return compare(values.every((value) => text.includes(value)), { response: actual.response, requiredValues: values, visibleText: text },
        "Một hoặc nhiều giá trị tiền không dùng separator/ký hiệu ₫ đúng.");
    }
    case "B-TC-036": {
      await openCheckoutWithCart(page, 600000, true);
      const h1 = await page.locator("h1").count();
      const breadcrumb = await page.locator('nav[aria-label*="breadcrumb" i], .breadcrumb').count();
      return compare(h1 === 1 && breadcrumb > 0, { h1Count: h1, breadcrumbCount: breadcrumb },
        "Checkout thiếu đúng một h1 và/hoặc breadcrumb.");
    }
    case "B-TC-037": {
      await openCheckoutWithCart(page, 600000, true);
      await page.getByPlaceholder("Nhập mã giảm giá...").fill("BIGBUY");
      const colors = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll("button")];
        const pick = (label) => {
          const element = buttons.find((button) => button.textContent?.trim() === label);
          return element ? getComputedStyle(element).backgroundColor : null;
        };
        return { apply: pick("Áp dụng"), checkout: pick("Xác Nhận Thanh Toán") };
      });
      const blue = (value) => value === "rgb(37, 99, 235)" || value === "rgb(59, 130, 246)";
      return compare(blue(colors.apply) && blue(colors.checkout), colors,
        "Positive action không dùng màu xanh dương.");
    }
    case "B-TC-038": {
      await openCheckoutWithCart(page, 600000, true);
      await page.getByPlaceholder("Nhập mã giảm giá...").fill("BIGBUY");
      await page.locator("body").click({ position: { x: 2, y: 2 } });
      const sequence = [];
      for (let index = 0; index < 12; index += 1) {
        await page.keyboard.press("Tab");
        sequence.push(await page.evaluate(() => {
          const element = document.activeElement;
          return `${element?.tagName ?? "NONE"}:${element?.textContent?.trim() ?? ""}:${element?.getAttribute("placeholder") ?? ""}`;
        }));
      }
      const joined = sequence.join(" | ");
      const required = ["Giỏ hàng", "Tổng tiền thanh toán", "Nhập mã giảm giá", "Áp dụng", "Xác Nhận Thanh Toán"];
      const reached = required.every((label) => joined.includes(label) || (label === "Tổng tiền thanh toán" && joined.includes("INPUT")));
      return compare(reached, { sequence }, "Không thể reach mọi control theo tab order hợp lý.");
    }
    case "B-TC-039": {
      const actual = await applyOnWeb(page, { total: 600000, code: "NOTEXIST" });
      const positions = await page.evaluate(() => {
        const button = [...document.querySelectorAll("button")].find((item) => item.textContent?.trim() === "Áp dụng");
        const error = [...document.querySelectorAll("p")].find((item) => item.textContent?.includes("Mã giảm giá"));
        return { buttonTop: button?.getBoundingClientRect().top ?? null, errorTop: error?.getBoundingClientRect().top ?? null };
      });
      return compare(positions.errorTop !== null && positions.buttonTop !== null && positions.errorTop < positions.buttonTop,
        { response: actual.response, positions }, "Error hiển thị dưới action Áp dụng thay vì phía trên.");
    }
    case "B-TC-040":
    case "B-TC-041": {
      const data = id === "B-TC-040"
        ? { total: 100, code: "MINZERO", discount: 1, final: 99 }
        : { total: 1, code: "MINONE", discount: 1, final: 0 };
      const actual = await applyOnWeb(page, data);
      return compare(accepted(actual.response) && actual.response.body.discount_amount === data.discount && actual.response.body.final_amount === data.final,
        actual, "Lower-bound minimum/equality behavior khác oracle.");
    }
    default:
      return outcome("NOT RUN", {}, "Runner không có implementation cho test ID.");
  }
}

async function runFixtureChecks() {
  const started = localIso();
  await fixture.reset();
  try {
    await fixture.insertCoupon({ id: 30, code: "DUP10", type: "fixed", discountValue: 1, minimum: 0, expiry: "2099-12-31", limit: 1 });
    let rejected = false;
    try {
      await fixture.insertCoupon({ id: 31, code: "DUP10", type: "fixed", discountValue: 1, minimum: 0, expiry: "2099-12-31", limit: 1 });
    } catch { rejected = true; }
    fixtureChecks.push({ id: "B-PC-01", status: rejected ? "PASS" : "FAIL", actual: { duplicateRejected: rejected }, timestamp: started });
  } finally { await fixture.reset(); }

  const candidates = [
    ["B-PC-02", { code: "NEG-P", type: "percent", discountValue: -1, minimum: 0, limit: 1 }],
    ["B-PC-03", { code: "ZERO-P", type: "percent", discountValue: 0, minimum: 0, limit: 1 }],
    ["B-PC-04", { code: "NEG-F", type: "fixed", discountValue: -1, minimum: 0, limit: 1 }],
    ["B-PC-05", { code: "ZERO-F", type: "fixed", discountValue: 0, minimum: 0, limit: 1 }],
    ["B-PC-06", { code: "NEG-M", type: "fixed", discountValue: 1, minimum: -1, limit: 1 }],
    ["B-PC-07", { code: "ZERO-L", type: "fixed", discountValue: 1, minimum: 0, limit: 0 }],
    ["B-PC-08", { code: "TEXT-D", type: "fixed", discountValue: "abc", minimum: 0, limit: 1 }],
    ["B-PC-09", { code: "TIER", type: "tiered", discountValue: 1, minimum: 0, limit: 1 }],
  ];
  for (const [id, candidate] of candidates) {
    const acceptedByFixture = fixture.validateCouponForNominalFixture(candidate);
    fixtureChecks.push({ id, status: !acceptedByFixture ? "PASS" : "FAIL", actual: { acceptedByFixture }, timestamp: localIso() });
  }
}

async function captureDiagnosticPage(page, result) {
  await page.evaluate((payload) => {
    const pre = document.createElement("pre");
    pre.id = "b-fr09-runner-diagnostic";
    pre.style.cssText = "white-space:pre-wrap;border:2px solid #444;padding:12px;background:#fff;color:#111";
    pre.textContent = JSON.stringify(payload, null, 2);
    document.body.prepend(pre);
  }, result).catch(() => {});
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
  await captureDiagnosticPage(page, { id: test.id, status: verdict.status, actual: verdict.actual, reason: verdict.reason });
  await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
  await context.tracing.stop({ path: trace });
  await context.close();
  const record = {
    id: test.id,
    title: test.title,
    coverage: test.coverage,
    expected: test.expected,
    status: verdict.status,
    actual: verdict.actual,
    reason: verdict.reason,
    executionOrder: order,
    timestamp: startedAt,
    durationMs: Date.now() - startedMs,
    evidence: [relative(screenshot), relative(trace)],
  };
  results.push(record);
  process.stdout.write(`${test.id}: ${verdict.status}\n`);
}

function summary() {
  const count = (status) => results.filter((item) => item.status === status).length;
  return {
    designed: 41,
    attempted: count("PASS") + count("FAIL") + count("BLOCKED"),
    executed: count("PASS") + count("FAIL"),
    passed: count("PASS"),
    failed: count("FAIL"),
    blocked: count("BLOCKED"),
    notRun: count("NOT RUN"),
  };
}

function markdownEscape(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function writeReport(run) {
  const stats = run.summary;
  const rows = [...results].sort((a, b) => a.id.localeCompare(b.id)).map((item) => {
    const summaryText = item.actual?.response?.body?.error
      ?? item.actual?.response?.body?.message
      ?? item.actual?.body?.error
      ?? item.reason
      ?? "Quan sát khớp oracle";
    return `| \`${item.id}\` | \`${item.status}\` | ${markdownEscape(summaryText)} | [screenshot](../../${item.evidence[0]}) · [trace](../../${item.evidence[1]}) |`;
  }).join("\n");
  const fixtureRows = fixtureChecks.map((item) =>
    `| \`${item.id}\` | \`${item.status}\` | \`${markdownEscape(JSON.stringify(item.actual))}\` |`,
  ).join("\n");
  const content = `# B-FR09 — Kết quả thực thi Step 5

## 1. Trạng thái

| Trường | Giá trị |
|---|---|
| Artifact | \`features/B/05_execution_results.md\` |
| Trạng thái | \`PENDING REVIEW\` |
| Test case baseline | \`04_test_cases.md\` — đã review trước execution |
| SUT baseline | \`${BASELINE}\` |
| Bắt đầu | ${run.startedAt} |
| Kết thúc | ${run.endedAt} |
| Lệnh | \`npm test\` trong \`automation/B-FR09\` |
| Browser | ${run.environment.browser} |
| SQLite fixture | \`automation/B-FR09/runtime/b-fr09-fixture.sqlite\` — runtime only, không commit |

## 2. Thống kê

| Designed | Attempted | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|---:|
| ${stats.designed} | ${stats.attempted} | ${stats.executed} | ${stats.passed} | ${stats.failed} | ${stats.blocked} | ${stats.notRun} |

Quy ước: \`attempted = PASS + FAIL + BLOCKED\`; \`executed = PASS + FAIL\`.

## 3. Kết quả từng test case

| Test ID | Verdict | Actual/reason tóm tắt | Evidence |
|---|---|---|---|
${rows}

Chi tiết expected, actual có cấu trúc, thời lượng và timestamp nằm trong
\`evidence/B/execution/results.json\`.

## 4. Supporting precondition check

Các check này xác nhận unique constraint và fixture gate; không tính vào 41 Web test case.

| Check ID | Verdict | Actual |
|---|---|---|
${fixtureRows}

## 5. Blocked condition

- \`B-TC-005\`–\`B-TC-008\`: thiếu oracle cho empty/whitespace/case/trim normalization.
- \`B-TC-010\`–\`B-TC-012\`: không có controlled clock và chưa chốt timezone/granularity.
- \`B-TC-032\`–\`B-TC-034\`: thiếu oracle rounding, maximum/cap và final floor.

Các case BLOCKED có screenshot/trace chẩn đoán nhưng không được ghi thành defect
chỉ dựa trên trạng thái BLOCKED.

## 6. Tính cô lập và khả năng tái hiện

- Runner sao chép read-only \`SHOP/backend/server.js\` vào runtime và nạp database
  adapter trỏ đến SQLite riêng; không sửa source hoặc runtime database của SHOP.
- Mỗi case reset fixture, coupon usage và test data trước khi chạy.
- Runner chỉ dùng port trống và chỉ dừng process do chính nó tạo.
- Service log: \`evidence/B/execution/service-logs.txt\`.
- Machine-readable result: \`evidence/B/execution/results.json\`.

## 7. Human review gate

- [ ] Đối chiếu 41 expected result với actual trong \`results.json\`.
- [ ] Mở screenshot/trace của mọi FAIL và các BLOCKED tiêu biểu.
- [ ] Xác nhận thống kê cộng đúng 41 và 9 precondition check tách riêng.
- [ ] Xác nhận source SHOP và \`backend/database.sqlite\` không bị runner sửa.
- [ ] Chỉ chuyển sang \`REVIEWED\` sau khi defect/gap mapping ở Step 6 nhất quán.
`;
  await fs.writeFile(reportPath, content, "utf8");
}

async function main() {
  const startedAt = localIso();
  await fs.mkdir(screenshotRoot, { recursive: true });
  await fs.mkdir(traceRoot, { recursive: true });
  await fs.rm(screenshotRoot, { recursive: true, force: true });
  await fs.rm(traceRoot, { recursive: true, force: true });
  await fs.mkdir(screenshotRoot, { recursive: true });
  await fs.mkdir(traceRoot, { recursive: true });
  await fs.mkdir(runtimeRoot, { recursive: true });

  const designed = await readDesignedCases();
  fixture = createDatabaseFixture(shopRoot, databasePath, fixtureCredentials);
  await fixture.initialize();
  await runFixtureChecks();
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
    feature: "B-FR09",
    platform: "Web checkout",
    baseline: BASELINE,
    startedAt,
    endedAt,
    command: "npm test",
    environment: {
      os: `${process.platform} ${process.arch}`,
      node: process.version,
      browser: `System Chromium channel: ${executablePath}`,
      webUrl: WEB_URL,
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
    fixtureChecks,
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
  await stopServices().catch(() => {});
  await fs.mkdir(evidenceRoot, { recursive: true }).catch(() => {});
  await fs.writeFile(serviceLogPath, `${serviceLogs.join("\n")}\n`, "utf8").catch(() => {});
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
