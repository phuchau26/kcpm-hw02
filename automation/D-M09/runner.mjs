import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabaseFixture } from "./fixtures/database.mjs";

const automationRoot = path.dirname(fileURLToPath(import.meta.url));
const submissionRoot = path.resolve(automationRoot, "../..");
const workspaceRoot = path.resolve(submissionRoot, "..");
const shopRoot = path.join(workspaceRoot, "SHOP");
const runtimeRoot = path.join(automationRoot, "runtime");
const databasePath = path.join(runtimeRoot, "d-m09-fixture.sqlite");
const evidenceRoot = path.join(submissionRoot, "evidence", "D", "execution");
const screenshotRoot = path.join(evidenceRoot, "screenshots");
const traceRoot = path.join(evidenceRoot, "traces");
const resultPath = path.join(evidenceRoot, "results.json");
const serviceLogPath = path.join(evidenceRoot, "service-logs.txt");
const reportPath = path.join(submissionRoot, "features", "D", "05_execution_results.md");
const testCasePath = path.join(submissionRoot, "features", "D", "04_test_cases.md");

const MOBILE_URL = "http://127.0.0.1:8081";
const API_URL = "http://127.0.0.1:3000";
const BASELINE = "85af3ba875c88283615e22cb108f13e2fccaf0e9";
const credentials = { userPassword: `D-M09-${randomUUID()}` };
const U1 = { id: 1, email: "test@eshop.com", password: credentials.userPassword };
const U2 = { id: 2, email: "test2@eshop.com", password: credentials.userPassword };
const protectedFiles = [
  path.join(shopRoot, "backend", "server.js"),
  path.join(shopRoot, "backend", "database.sqlite"),
  path.join(shopRoot, "frontend-mobile", "App.js"),
];

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const executionOrder = [
  "D-TC-029", "D-TC-030",
  ...Array.from({ length: 50 }, (_, index) => `D-TC-${String(index + 1).padStart(3, "0")}`)
    .filter((id) => !["D-TC-029", "D-TC-030"].includes(id)),
];

const results = [];
const serviceProcesses = [];
const serviceLogs = [];
let fixture;
let browser;

function localIso(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(date);
  return `${parts.replace(" ", "T")}+07:00`;
}

function relative(target) {
  return path.relative(submissionRoot, target).replaceAll("\\", "/");
}

function outcome(status, actual, reason = "") {
  return { status, actual, reason };
}

function compare(condition, actual, failureReason) {
  return condition ? outcome("PASS", actual) : outcome("FAIL", actual, failureReason);
}

function accepted(response) {
  return response?.status >= 200 && response?.status < 300 && response?.body?.success === true;
}

async function readDesignedCases() {
  const markdown = await fs.readFile(testCasePath, "utf8");
  const map = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!/^\| `D-TC-\d{3}` \|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    const id = cells[0].replaceAll("`", "");
    if (map.has(id)) continue;
    map.set(id, {
      id,
      title: `${cells[1]} — ${cells[2]}`.replaceAll("`", ""),
      expected: cells[4],
      coverage: cells[5].replaceAll("`", ""),
    });
  }
  if (map.size !== 50) throw new Error(`Expected 50 designed cases, found ${map.size}.`);
  return map;
}

async function sha256(file) {
  try {
    const data = await fs.readFile(file);
    return createHash("sha256").update(data).digest("hex");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function protectedHashes() {
  return Object.fromEntries(await Promise.all(protectedFiles.map(async (file) => [relative(file), await sha256(file)])));
}

async function findBrowserExecutable() {
  for (const candidate of chromeCandidates) {
    try { await fs.access(candidate); return candidate; } catch { /* try next */ }
  }
  throw new Error("Không tìm thấy Chrome/Edge executable.");
}

async function urlReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return response.status < 500;
  } catch { return false; }
}

async function waitForUrl(url, name, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await urlReady(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`${name} không sẵn sàng tại ${url}`);
}

async function assertPortFree(url, name) {
  if (await urlReady(url)) throw new Error(`${name} đang được sử dụng; runner từ chối tái sử dụng service ngoài fixture.`);
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

async function prepareRuntimeBackend() {
  await fs.mkdir(runtimeRoot, { recursive: true });
  await fs.writeFile(path.join(runtimeRoot, "package.json"), '{"private":true,"type":"commonjs"}\n', "utf8");
  await fs.copyFile(path.join(shopRoot, "backend", "server.js"), path.join(runtimeRoot, "server.js"));
  await fs.writeFile(path.join(runtimeRoot, "database.js"), [
    'const sqlite3 = require("sqlite3").verbose();',
    'module.exports = new sqlite3.Database(process.env.D_M09_DB_PATH);',
    "",
  ].join("\n"), "utf8");
}

async function startServices() {
  await assertPortFree(`${API_URL}/api/products`, "Backend port 3000");
  await assertPortFree(MOBILE_URL, "Expo port 8081");
  await prepareRuntimeBackend();

  const backend = spawn(process.execPath, [path.join(runtimeRoot, "server.js")], {
    cwd: runtimeRoot, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, D_M09_DB_PATH: databasePath, NODE_PATH: path.join(shopRoot, "backend", "node_modules") },
  });
  captureServiceOutput("backend", backend);
  serviceProcesses.push({ name: "backend", child: backend });
  await waitForUrl(`${API_URL}/api/products`, "Backend", 30000);

  const expoCli = path.join(shopRoot, "frontend-mobile", "node_modules", "expo", "bin", "cli");
  const expo = spawn(process.execPath, [expoCli, "start", "--web", "--port", "8081", "--host", "localhost"], {
    cwd: path.join(shopRoot, "frontend-mobile"), windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CI: "1", BROWSER: "none" },
  });
  captureServiceOutput("expo-web", expo);
  serviceProcesses.push({ name: "expo-web", child: expo });
  await waitForUrl(MOBILE_URL, "Expo Web", 120000);
}

async function stopServices() {
  for (const { name, child } of serviceProcesses.reverse()) {
    if (!child.killed) child.kill();
    serviceLogs.push(`[${localIso()}] [${name}] Runner sent stop signal to PID ${child.pid}.`);
  }
}

async function loginToken(user = U1) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  const body = await response.json();
  if (!response.ok || !body.token) throw new Error(`Fixture login failed: ${response.status}`);
  return body.token;
}

async function apiApply(body, authorization) {
  const headers = { "content-type": "application/json" };
  if (authorization) headers.authorization = authorization;
  const response = await fetch(`${API_URL}/api/apply-coupon`, {
    method: "POST", headers, body: JSON.stringify(body),
  });
  const text = await response.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
  return { status: response.status, body: parsed };
}

async function gotoMobile(page) {
  await page.goto(MOBILE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByText("EShop Mobile", { exact: true }).waitFor({ timeout: 60000 });
  await page.getByText("Danh sách sản phẩm", { exact: true }).waitFor({ timeout: 30000 });
}

async function loginMobile(page) {
  await page.getByText("Đăng nhập", { exact: true }).click();
  await page.getByPlaceholder("Email").fill(U1.email);
  await page.getByPlaceholder("Mật khẩu").fill(U1.password);
  await page.getByText("Sign In", { exact: true }).click();
  await page.getByText("Chào, Test User", { exact: true }).waitFor({ timeout: 10000 });
}

async function openCheckout(page, total = 400000, authenticated = true) {
  await fixture.run("UPDATE products SET price = ? WHERE id = 1", [total]);
  await gotoMobile(page);
  if (authenticated) await loginMobile(page);
  await page.getByText("Fixture product", { exact: true }).waitFor();
  await page.getByText("Thêm vào giỏ", { exact: true }).first().click();
  await page.getByText(/Giỏ \(1\)/).click();
  await page.getByText("Giỏ Hàng", { exact: true }).waitFor();
  await page.getByText("Tiến hành thanh toán", { exact: true }).click();
  if (authenticated) await page.getByText("Xác Nhận Đơn Hàng", { exact: true }).waitFor();
}

async function applyOnMobile(page, { total = 400000, code = "SAVE10" } = {}) {
  await openCheckout(page, total, true);
  const input = page.getByPlaceholder("Nhập mã giảm giá...");
  await input.fill(code);
  const actionText = page.getByText("Áp dụng", { exact: true });
  const action = actionText.locator("xpath=..");
  const disabled = await action.getAttribute("aria-disabled") === "true" || await action.getAttribute("disabled") !== null;
  if (disabled) return { disabled: true, requestBody: null, response: null };
  const requestPromise = page.waitForRequest((request) => request.url().includes("/api/apply-coupon"));
  const responsePromise = page.waitForResponse((response) => response.url().includes("/api/apply-coupon"));
  await actionText.click();
  const [request, response] = await Promise.all([requestPromise, responsePromise]);
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { raw: text }; }
  await page.waitForTimeout(100);
  return { disabled: false, requestBody: request.postDataJSON(), response: { status: response.status(), body } };
}

async function blockedClock(page) {
  await gotoMobile(page);
  return outcome("BLOCKED", { runtime: "Expo Web", controlledClock: false },
    "SUT không có clock injection; không thể so sánh tin cậy E−δ/E/E+δ. Cần controlled server clock trước khi chạy lại.");
}

async function executeCase(id, page) {
  switch (id) {
    case "D-TC-001": {
      await openCheckout(page, 400000, true);
      const inputVisible = await page.getByPlaceholder("Nhập mã giảm giá...").isVisible();
      const actionVisible = await page.getByText("Áp dụng", { exact: true }).isVisible();
      const totalInput = page.locator('input[value="400000"]');
      const readOnly = await totalInput.getAttribute("readonly") !== null || await totalInput.isEditable() === false;
      return compare(inputVisible && actionVisible && readOnly, { inputVisible, actionVisible, readOnly }, "Checkout/coupon control hoặc total read-only không đúng.");
    }
    case "D-TC-002": {
      let dialogText = null;
      page.on("dialog", async (dialog) => { dialogText = dialog.message(); await dialog.dismiss(); });
      await openCheckout(page, 400000, false);
      await page.waitForTimeout(200);
      const loginVisible = await page.getByText("Đăng Nhập", { exact: true }).isVisible().catch(() => false);
      return compare(loginVisible, { loginVisible, dialogText }, "Người chưa đăng nhập vẫn tới được checkout/apply coupon.");
    }
    case "D-TC-003":
    case "D-TC-004": {
      await openCheckout(page, 400000, true);
      const input = page.getByPlaceholder("Nhập mã giảm giá...");
      await input.fill(id === "D-TC-003" ? "" : "   ");
      const action = page.getByText("Áp dụng", { exact: true }).locator("xpath=..");
      const actual = { ariaDisabled: await action.getAttribute("aria-disabled"), disabled: await action.getAttribute("disabled") };
      return outcome("BLOCKED", actual, "SRS chưa quy định disabled/dispatch cho empty hoặc whitespace; automation chỉ ghi observation.");
    }
    case "D-TC-005":
    case "D-TC-006": {
      const actual = await applyOnMobile(page, { total: 400000, code: id === "D-TC-005" ? "save10" : "  SAVE10  " });
      return outcome("BLOCKED", actual, "SRS chưa quy định trim/case normalization; request body chỉ là observation.");
    }
    case "D-TC-007": {
      const actual = await applyOnMobile(page, { total: 400000, code: "SAVE10" });
      return compare(accepted(actual.response), actual, "Coupon tồn tại/active không đi tiếp tới success.");
    }
    case "D-TC-008": {
      const actual = await applyOnMobile(page, { total: 400000, code: "SAVE10" });
      return compare(accepted(actual.response) && actual.response.body.discount_amount === 40000 && actual.response.body.final_amount === 360000,
        actual, "Percent discount/final khác công thức FR-09.");
    }
    case "D-TC-009": {
      const actual = await applyOnMobile(page, { total: 600000, code: "BIGBUY" });
      return compare(accepted(actual.response) && actual.response.body.discount_amount === 50000 && actual.response.body.final_amount === 550000,
        actual, "Fixed discount/final khác FR-09.");
    }
    case "D-TC-010":
    case "D-TC-011":
    case "D-TC-012": {
      const code = { "D-TC-010": "NO_SUCH_COUPON", "D-TC-011": "INACTIVE10", "D-TC-012": "EXPIRED" }[id];
      const actual = await applyOnMobile(page, { total: 600000, code });
      const noDiscount = await page.getByText(/Tiết kiệm:/).count() === 0;
      return compare(actual.response?.status >= 400 && noDiscount, { ...actual, noDiscount }, "Coupon invalid/inactive/expired không bị từ chối.");
    }
    case "D-TC-013":
    case "D-TC-014":
    case "D-TC-015":
      return blockedClock(page);
    case "D-TC-016":
    case "D-TC-017":
    case "D-TC-018": {
      const total = { "D-TC-016": 299999, "D-TC-017": 300000, "D-TC-018": 300001 }[id];
      const actual = await apiApply({ code: "SAVE10", total_amount: total, user_id: U1.id });
      if (id === "D-TC-016") return compare(!accepted(actual), actual, "M−1 phải bị từ chối.");
      if (id === "D-TC-017") return compare(accepted(actual) && actual.body.discount_amount === 30000 && actual.body.final_amount === 270000, actual, "M phải hợp lệ theo inclusive boundary.");
      return compare(accepted(actual), actual, "M+1 phải được chấp nhận; không assert rounding.");
    }
    case "D-TC-019": {
      await fixture.run("UPDATE products SET price = 400000 WHERE id = 1");
      const actual = await apiApply({ code: "SAVE10", total_amount: 299999, user_id: U1.id });
      return compare(accepted(actual) && actual.body.discount_amount === 40000 && actual.body.final_amount === 360000,
        { response: actual, cartTotal: 400000, forgedTotal: 299999 }, "Backend tin total client thấp thay vì recompute cart.");
    }
    case "D-TC-020": {
      await fixture.run("UPDATE products SET price = 299999 WHERE id = 1");
      const actual = await apiApply({ code: "SAVE10", total_amount: 400000, user_id: U1.id });
      return compare(!accepted(actual), { response: actual, cartTotal: 299999, forgedTotal: 400000 }, "Backend tin total client cao và cho bypass minimum.");
    }
    case "D-TC-021":
    case "D-TC-022":
    case "D-TC-023":
    case "D-TC-024":
    case "D-TC-025": {
      const limitOne = ["D-TC-021", "D-TC-022", "D-TC-023"].includes(id);
      const couponId = limitOne ? 1 : 3;
      const code = limitOne ? "SAVE10" : "LIMIT2";
      const count = { "D-TC-021": 0, "D-TC-022": 1, "D-TC-023": 2, "D-TC-024": 1, "D-TC-025": 2 }[id];
      await fixture.addUsage(couponId, U1.id, count);
      const actual = await apiApply({ code, total_amount: 600000, user_id: U1.id });
      const shouldAccept = ["D-TC-021", "D-TC-024"].includes(id);
      return compare(accepted(actual) === shouldAccept, { response: actual, usageCount: count }, "Usage-limit verdict khác oracle.");
    }
    case "D-TC-026": {
      await fixture.addUsage(1, U1.id, 1);
      const token = await loginToken(U1);
      const actual = await apiApply({ code: "SAVE10", total_amount: 400000, user_id: U2.id }, `Bearer ${token}`);
      return compare(!accepted(actual), { response: actual, tokenUser: U1.id, bodyUser: U2.id }, "Backend dùng user_id từ body thay vì JWT identity.");
    }
    case "D-TC-027":
    case "D-TC-028": {
      const auth = id === "D-TC-027" ? undefined : "Bearer invalid.fixture.token";
      const actual = await apiApply({ code: "BIGBUY", total_amount: 600000, user_id: U1.id }, auth);
      return compare([401, 403].includes(actual.status), actual, "Apply-coupon chấp nhận request thiếu hoặc sai JWT.");
    }
    case "D-TC-029":
    case "D-TC-030": {
      const discountValue = id === "D-TC-029" ? -1 : 0;
      const acceptedByFixture = fixture.validateNominalCoupon({ code: "INVALID", type: "fixed", discountValue, minimum: 0, limit: 1 });
      return compare(!acceptedByFixture, { discountValue, acceptedByFixture }, "Fixture gate chấp nhận discount không dương.");
    }
    case "D-TC-031":
    case "D-TC-032": {
      const percent = id === "D-TC-031";
      const actual = await apiApply({ code: percent ? "PERCENT1" : "FIXED1", total_amount: percent ? 400000 : 600000, user_id: U1.id });
      const expectedDiscount = percent ? 4000 : 1;
      const expectedFinal = percent ? 396000 : 599999;
      return compare(accepted(actual) && actual.body.discount_amount === expectedDiscount && actual.body.final_amount === expectedFinal,
        actual, "Discount lower-bound formula khác oracle.");
    }
    case "D-TC-033":
    case "D-TC-034":
    case "D-TC-035": {
      const data = {
        "D-TC-033": { id: 20, code: "FRACTION", type: "percent", discountValue: 10, total: 333333 },
        "D-TC-034": { id: 21, code: "PERCENT101", type: "percent", discountValue: 101, total: 400000 },
        "D-TC-035": { id: 22, code: "OVERFIXED", type: "fixed", discountValue: 700000, total: 600000 },
      }[id];
      await fixture.insertCoupon({ ...data, minimum: 0, expiry: "2099-12-31", limit: 1 });
      const actual = await apiApply({ code: data.code, total_amount: data.total, user_id: U1.id });
      return outcome("BLOCKED", actual, "Thiếu oracle rounding/maximum/cap/floor; automation chỉ ghi actual.");
    }
    case "D-TC-036": {
      await openCheckout(page, 600000, true);
      await page.getByPlaceholder("Nhập mã giảm giá...").fill("BIGBUY");
      let requestCount = 0;
      await page.route("**/api/apply-coupon", async (route) => {
        requestCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 600));
        await route.continue();
      });
      const actionText = page.getByText("Áp dụng", { exact: true });
      await actionText.click();
      await page.getByText("...", { exact: true }).waitFor();
      const action = page.getByText("...", { exact: true }).locator("xpath=..");
      const during = { ariaDisabled: await action.getAttribute("aria-disabled"), requestCount };
      await page.waitForResponse((response) => response.url().includes("/api/apply-coupon"));
      return outcome("BLOCKED", { during, finalRequestCount: requestCount }, "Loading/double-tap behavior chưa có oracle; actual được ghi nhận.");
    }
    case "D-TC-037":
    case "D-TC-038": {
      const actual = await applyOnMobile(page, { total: 600000, code: "BIGBUY" });
      const input = page.getByPlaceholder("Nhập mã giảm giá...");
      await input.fill(id === "D-TC-037" ? "" : "SAVE10");
      const successVisible = await page.getByText(/Tiết kiệm:/).count() > 0;
      return outcome("BLOCKED", { apply: actual, successVisibleAfterEdit: successVisible }, "Reset-on-edit chưa có oracle; actual được ghi nhận.");
    }
    case "D-TC-039": {
      const actual = await applyOnMobile(page, { total: 600000, code: "NO_SUCH_COUPON" });
      await page.getByPlaceholder("Nhập mã giảm giá...").fill("BIGBUY");
      const oldErrorVisible = await page.getByText(/không tồn tại|vô hiệu hóa/i).count() > 0;
      return outcome("BLOCKED", { apply: actual, oldErrorVisibleAfterEdit: oldErrorVisible }, "Error reset-on-edit chưa có oracle; actual được ghi nhận.");
    }
    case "D-TC-040": {
      const actual = await applyOnMobile(page, { total: 600000, code: "NO_SUCH_COUPON" });
      return compare(actual.response?.status >= 400 && await page.getByText(/Tiết kiệm:/).count() === 0, actual, "Business reject bị hiển thị như coupon success.");
    }
    case "D-TC-041":
    case "D-TC-042":
    case "D-TC-043": {
      await openCheckout(page, 600000, true);
      const mode = id;
      await page.route("**/api/apply-coupon", async (route) => {
        if (mode === "D-TC-041") await route.fulfill({ status: 500, contentType: "application/json", body: '{"error":"fixture 500"}' });
        else if (mode === "D-TC-042") await route.abort("connectionrefused");
        else await route.fulfill({ status: 200, contentType: "text/plain", body: "not-json" });
      });
      await page.getByPlaceholder("Nhập mã giảm giá...").fill("BIGBUY");
      await page.getByText("Áp dụng", { exact: true }).click();
      await page.waitForTimeout(500);
      const bodyText = await page.locator("body").innerText();
      return outcome("BLOCKED", { mode, bodyText: bodyText.slice(-1000) }, "SRS chưa quy định resilience/message cho HTTP 5xx, transport hoặc parse failure.");
    }
    case "D-TC-044": {
      const actual = await applyOnMobile(page, { total: 400000, code: "SAVE10" });
      await page.getByText("Xác Nhận Thanh Toán", { exact: true }).click();
      await page.getByText("Thanh toán thành công!", { exact: true }).waitFor({ timeout: 10000 }).catch(() => {});
      const order = await fixture.get("SELECT total_amount FROM orders ORDER BY id DESC LIMIT 1");
      return compare(actual.response?.body?.final_amount === 360000 && order?.total_amount === 360000,
        { apply: actual, storedOrder: order }, "Checkout không dùng authoritative final 360000 hoặc tin client total sai.");
    }
    case "D-TC-045": {
      const actual = await applyOnMobile(page, { total: 600000, code: "BIGBUY" });
      const text = await page.locator("body").innerText();
      const values = ["600.000 ₫", "50.000 ₫", "550.000 ₫"];
      return compare(values.every((value) => text.includes(value)) && /Tổng thanh toán|Tiết kiệm|Thành tiền/.test(text),
        { response: actual.response, requiredValues: values }, "Amount format/ký hiệu/ngôn ngữ không đúng.");
    }
    case "D-TC-046": {
      await openCheckout(page, 600000, true);
      await page.getByPlaceholder("Nhập mã giảm giá...").fill("BIGBUY");
      const colors = await page.evaluate(() => {
        const colorFor = (text) => {
          const leaf = [...document.querySelectorAll("div,span")].find((node) => node.textContent?.trim() === text && node.children.length === 0);
          const action = leaf?.closest('[role="button"]') ?? leaf?.parentElement;
          return action ? getComputedStyle(action).backgroundColor : null;
        };
        return { apply: colorFor("Áp dụng"), checkout: colorFor("Xác Nhận Thanh Toán") };
      });
      const blue = (value) => ["rgb(37, 99, 235)", "rgb(59, 130, 246)"].includes(value);
      return compare(blue(colors.apply) && blue(colors.checkout), colors, "Positive action không dùng màu xanh dương.");
    }
    case "D-TC-047": {
      const actual = await applyOnMobile(page, { total: 600000, code: "NO_SUCH_COUPON" });
      const positions = await page.evaluate(() => {
        const leaves = [...document.querySelectorAll("div,span")];
        const applyLeaf = leaves.find((node) => node.textContent?.trim() === "Áp dụng" && node.children.length === 0);
        const errorLeaf = leaves.find((node) => /không tồn tại|vô hiệu hóa/i.test(node.textContent ?? "") && node.children.length === 0);
        return { applyTop: applyLeaf?.getBoundingClientRect().top ?? null, errorTop: errorLeaf?.getBoundingClientRect().top ?? null };
      });
      return compare(positions.errorTop !== null && positions.applyTop !== null && positions.errorTop < positions.applyTop,
        { response: actual.response, positions }, "Validation feedback nằm dưới action Apply.");
    }
    case "D-TC-048": {
      await openCheckout(page, 600000, true);
      await page.getByPlaceholder("Nhập mã giảm giá...").focus();
      const metrics = await page.evaluate(() => ({
        innerWidth, scrollWidth: document.documentElement.scrollWidth,
        innerHeight, scrollHeight: document.documentElement.scrollHeight,
      }));
      return outcome("BLOCKED", metrics, "Viewport observation không có pass/fail oracle và không đại diện native Mobile.");
    }
    case "D-TC-049":
      return outcome("BLOCKED", { runtime: "Expo Web", nativeKeyboard: false }, "Playwright Expo Web không điều khiển soft keyboard Android/iOS; cần native runtime và Maestro/Appium/Detox.");
    case "D-TC-050":
      return outcome("BLOCKED", { runtime: "Expo Web", nativeAccessibilityTree: false }, "DOM/accessibility tree Expo Web không đại diện React Native; cần native runtime và accessibility tooling.");
    default:
      return outcome("NOT RUN", {}, "Runner không có implementation cho Test ID.");
  }
}

async function captureDiagnosticPage(page, payload) {
  await page.evaluate((record) => {
    const pre = document.createElement("pre");
    pre.id = "d-m09-runner-diagnostic";
    pre.style.cssText = "white-space:pre-wrap;border:2px solid #333;padding:12px;background:#fff;color:#111;position:relative;z-index:99999";
    pre.textContent = JSON.stringify(record, null, 2);
    document.body.prepend(pre);
  }, payload).catch(() => {});
}

async function runOne(test, order) {
  await fixture.reset();
  const context = await browser.newContext({ locale: "vi-VN", viewport: { width: 440, height: 956 } });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
  const page = await context.newPage();
  const startedAt = localIso();
  const startedMs = Date.now();
  let verdict;
  try {
    verdict = await executeCase(test.id, page);
  } catch (error) {
    verdict = outcome("BLOCKED", { runnerError: error.message }, `Automation/runtime error prevented valid comparison: ${error.message}`);
  }
  await captureDiagnosticPage(page, { id: test.id, status: verdict.status, actual: verdict.actual, reason: verdict.reason });
  const screenshot = path.join(screenshotRoot, `${test.id}.png`);
  const trace = path.join(traceRoot, `${test.id}.zip`);
  await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
  await context.tracing.stop({ path: trace });
  await context.close();
  results.push({
    id: test.id, title: test.title, coverage: test.coverage, expected: test.expected,
    status: verdict.status, actual: verdict.actual, reason: verdict.reason,
    executionOrder: order, timestamp: startedAt, durationMs: Date.now() - startedMs,
    evidence: [relative(screenshot), relative(trace)],
  });
  process.stdout.write(`${test.id}: ${verdict.status}\n`);
}

function summary() {
  const count = (status) => results.filter((item) => item.status === status).length;
  return {
    designed: 50,
    attempted: count("PASS") + count("FAIL") + count("BLOCKED"),
    executed: count("PASS") + count("FAIL"),
    passed: count("PASS"), failed: count("FAIL"), blocked: count("BLOCKED"), notRun: count("NOT RUN"),
  };
}

function markdownEscape(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function writeReport(run) {
  const rows = run.results.map((item) => {
    const observed = item.actual?.response?.body?.error ?? item.actual?.response?.body?.message
      ?? item.actual?.body?.error;
    const actual = item.status === "PASS"
      ? (observed || "Quan sát khớp oracle")
      : (item.reason || observed || "Xem actual có cấu trúc trong results.json");
    return `| \`${item.id}\` | \`${item.status}\` | ${markdownEscape(actual)} | [screenshot](../../${item.evidence[0]}) · [trace](../../${item.evidence[1]}) |`;
  }).join("\n");
  const stats = run.summary;
  const content = `# D-M09 — Kết quả thực thi Step 5

## 1. Trạng thái và baseline

| Trường | Giá trị |
|---|---|
| Trạng thái | \`PENDING HUMAN REVIEW\` |
| Test design | \`features/D/04_test_cases.md\` — \`REVIEWED — HUMAN REVIEW\` |
| SUT baseline | \`${BASELINE}\` |
| Runtime | Expo Web, Chromium, viewport \`440 × 956\` |
| Bắt đầu | ${run.startedAt} |
| Kết thúc | ${run.endedAt} |
| Lệnh | \`npm test\` trong \`automation/D-M09\` |
| SQLite fixture | \`automation/D-M09/runtime/d-m09-fixture.sqlite\` — runtime only |

Expo Web là runtime của lần chạy này, không phải bằng chứng native Android/iOS.

## 2. Thống kê

| Designed | Attempted | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|---:|
| ${stats.designed} | ${stats.attempted} | ${stats.executed} | ${stats.passed} | ${stats.failed} | ${stats.blocked} | ${stats.notRun} |

Quy ước: \`attempted = PASS + FAIL + BLOCKED\`; \`executed = PASS + FAIL\`.

## 3. Kết quả từng test case

| Test ID | Verdict | Actual/reason tóm tắt | Evidence |
|---|---|---|---|
${rows}

Expected, actual có cấu trúc, timestamp, duration và environment đầy đủ nằm trong
\`evidence/D/execution/results.json\`.

## 4. Blocked condition

- \`D-TC-003\`–\`006\`: thiếu oracle cho empty/whitespace và normalization.
- \`D-TC-013\`–\`015\`: không có controlled clock để kiểm tra sát expiry.
- \`D-TC-033\`–\`039\`: thiếu oracle rounding/cap/floor hoặc UI state transition.
- \`D-TC-041\`–\`043\`: thiếu resilience/message oracle.
- \`D-TC-048\`: chỉ là viewport observation trên Expo Web.
- \`D-TC-049\`–\`050\`: cần Android/iOS native runtime và công cụ phù hợp.

BLOCKED không được xem là defect khi chưa có oracle và evidence độc lập.

## 5. Tính cô lập và source integrity

- Backend được copy read-only vào \`automation/D-M09/runtime\` và trỏ tới SQLite fixture riêng.
- Fixture reset trước mỗi test case; không dùng \`SHOP/backend/database.sqlite\`.
- Runner chỉ dùng port trống và chỉ dừng process do chính runner tạo.
- Hash trước/sau của ba file được bảo vệ: \`${run.sourceIntegrity.unchanged ? "UNCHANGED" : "CHANGED"}\`.
- Service log: \`evidence/D/execution/service-logs.txt\`.

## 6. Human review gate

- [ ] Đối chiếu đủ 50 record trong \`results.json\` với test design.
- [ ] Mở screenshot/trace của mọi FAIL và BLOCKED tiêu biểu.
- [ ] Xác nhận PASS + FAIL + BLOCKED + NOT RUN = 50.
- [ ] Xác nhận các case gap không bị ép thành PASS.
- [ ] Xác nhận Expo Web không bị trình bày như native evidence.
- [ ] Xác nhận source SHOP và database runtime không thay đổi trong lần chạy.
`;
  await fs.writeFile(reportPath, content, "utf8");
}

async function main() {
  const startedAt = localIso();
  const hashesBefore = await protectedHashes();
  await fs.mkdir(evidenceRoot, { recursive: true });
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

  const hashesAfter = await protectedHashes();
  const unchanged = JSON.stringify(hashesBefore) === JSON.stringify(hashesAfter);
  const endedAt = localIso();
  const run = {
    schemaVersion: 1, feature: "D-M09", platform: "Expo Web with mobile viewport",
    baseline: BASELINE, startedAt, endedAt, command: "npm test",
    environment: {
      os: `${process.platform} ${process.arch}`, node: process.version,
      browser: `System Chromium: ${executablePath}`, mobileUrl: MOBILE_URL, apiUrl: API_URL,
      viewport: { width: 440, height: 956 }, timezone: "Asia/Saigon (UTC+07:00)",
      database: "isolated SQLite runtime fixture", nativeMobile: false,
    },
    conventions: { attempted: "PASS + FAIL + BLOCKED", executed: "PASS + FAIL" },
    executionOrder, summary: summary(), sourceIntegrity: { before: hashesBefore, after: hashesAfter, unchanged },
    results: [...results].sort((a, b) => a.id.localeCompare(b.id)),
  };
  await fs.writeFile(resultPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  serviceLogs.push(`[${endedAt}] [runner] Summary ${JSON.stringify(run.summary)}`);
  serviceLogs.push(`[${endedAt}] [runner] Source integrity unchanged=${unchanged}`);
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
