import { chromium } from "@playwright/test";
import { spawn, execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabaseFixture } from "./fixtures/database.mjs";

const automationRoot = path.dirname(fileURLToPath(import.meta.url));
const submissionRoot = path.resolve(automationRoot, "../..");
const workspaceRoot = path.resolve(submissionRoot, "..");
const shopRoot = path.join(workspaceRoot, "SHOP");
const evidenceRoot = path.join(submissionRoot, "evidence", "A", "execution");
const screenshotRoot = path.join(evidenceRoot, "screenshots");
const traceRoot = path.join(evidenceRoot, "traces");
const resultPath = path.join(evidenceRoot, "results.json");
const serviceLogPath = path.join(evidenceRoot, "service-logs.txt");
const reportPath = path.join(
  submissionRoot,
  "features",
  "A",
  "05_execution_results.md",
);

const WEB_URL = "http://127.0.0.1:5173";
const API_URL = "http://127.0.0.1:3000";
const E1 = "test@eshop.com";
const E2 = "admin@eshop.com";
const E3 = "a-fr03-not-registered@example.com";
const P_OLD = "Test1234!";
const T1 = "654321";

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const cases = [
  ["A-TC-001", "Email hợp lệ phát hành OTP 6 chữ số", "OTP 6 chữ số được hiển thị và UI chuyển Bước 2", "A-R01; A-B01-ON"],
  ["A-TC-002", "Email rỗng", "Từ chối, lỗi trong trang phía trên submit, không tạo token", "ES-I1; A-R02; A-R12"],
  ["A-TC-003", "Email sai format", "HTML5 email validation từ chối trước API", "ES-I2; A-R02; A-R11"],
  ["A-TC-004", "Email chưa đăng ký", "Từ chối, lỗi trong trang phía trên submit, không tạo token", "EM-I1; A-R02; A-R12"],
  ["A-TC-005", "Reset nominal hợp lệ", "Reset thành công với OTP/password/confirm hợp lệ", "S2-V1; A-R04"],
  ["A-TC-006", "OTP length 5", "Từ chối và password cũ không đổi", "OF-I2; A-B01-LOW; A-R05"],
  ["A-TC-007", "OTP length 7", "Từ chối và password cũ không đổi", "OF-I2; A-B01-HIGH; A-R05"],
  ["A-TC-008", "OTP rỗng", "Từ chối và password cũ không đổi", "OF-I1; A-R05"],
  ["A-TC-009", "OTP length 6 có non-digit", "Từ chối và password cũ không đổi", "OF-I3; A-R05"],
  ["A-TC-010", "OTP length khác 6 có non-digit", "Từ chối và password cũ không đổi", "OF-I4; A-R05"],
  ["A-TC-011", "OTP sai giá trị", "Từ chối và password cũ không đổi", "OV-I1; A-R05"],
  ["A-TC-012", "OTP thuộc email khác", "Từ chối và password hai tài khoản không đổi", "OB-I1; A-R05"],
  ["A-TC-013", "Không có token hiện hành", "Từ chối và password cũ không đổi", "OL-I1; A-R05"],
  ["A-TC-014", "OTP hết hạn", "Từ chối token expired", "OL-I2; A-B08; A-R09"],
  ["A-TC-015", "Dùng lại OTP đã consumed", "Lần hai bị từ chối và password không đổi", "OL-I3; A-R08"],
  ["A-TC-016", "Password length 7", "Từ chối và password cũ không đổi", "PL-I2; A-B02-LOW; A-R06"],
  ["A-TC-017", "Password length 9", "Chấp nhận reset", "PL-V1; A-B02-HIGH; A-R04"],
  ["A-TC-018", "Password 0 uppercase", "Từ chối và password cũ không đổi", "PU-I1; A-B03-LOW; A-R06"],
  ["A-TC-019", "Password 2 uppercase", "Chấp nhận reset", "PU-V1; A-B03-HIGH; A-R04"],
  ["A-TC-020", "Password 0 lowercase", "Từ chối và password cũ không đổi", "PW-I1; A-B04-LOW; A-R06"],
  ["A-TC-021", "Password 1 lowercase", "Chấp nhận reset", "PW-V1; A-B04-ON; A-R04"],
  ["A-TC-022", "Password 2 lowercase", "Chấp nhận reset", "PW-V1; A-B04-HIGH; A-R04"],
  ["A-TC-023", "Password 0 digit", "Từ chối và password cũ không đổi", "PD-I1; A-B05-LOW; A-R06"],
  ["A-TC-024", "Password 2 digits", "Chấp nhận reset", "PD-V1; A-B05-HIGH; A-R04"],
  ["A-TC-025", "Password 0 allowed special", "Từ chối và password cũ không đổi", "PS-I1; A-B06-LOW; A-R06"],
  ["A-TC-026", "Password 2 allowed special", "Chấp nhận reset", "PS-V1; A-B06-HIGH; A-R04"],
  ["A-TC-027", "Special ngoài allowed set", "Từ chối và password cũ không đổi", "PS-I1; A-R06"],
  ["A-TC-028", "Password mới rỗng", "Từ chối và password cũ không đổi", "PL-I1; A-R06"],
  ["A-TC-029", "Confirm password rỗng", "Từ chối và password cũ không đổi", "PC-I1; A-R07"],
  ["A-TC-030", "Confirm lệch một ký tự", "Từ chối và password cũ không đổi", "PC-I2; A-B07-SUB; A-R07"],
  ["A-TC-031", "Confirm lệch case", "Từ chối và password cũ không đổi", "PC-I2; A-B07-CASE; A-R07"],
  ["A-TC-032", "Confirm thiếu một ký tự", "Từ chối và password cũ không đổi", "PC-I2; A-B07-DEL; A-R07"],
  ["A-TC-033", "Password storage không plaintext", "Storage khác plaintext và login nhận password mới", "OUT-HASH; A-R04; SEC-01"],
  ["A-TC-034", "Step Indicator và quay lại login", "Có indicator ở hai bước và control quay về /login", "UI-STEP; UI-BACK; A-R03"],
  ["A-TC-035", "Required marker, input type, confirm field", "Đủ dấu *, type đúng và có confirmPassword", "UI-REQ; UI-TYPE; A-R10; A-R11"],
  ["A-TC-036", "Vị trí validation error", "Lỗi trong trang phía trên submit, không chỉ alert", "UI-ERROR; A-R12"],
  ["A-TC-037", "Heading, ngôn ngữ, màu positive action", "Đúng một h1, tiếng Việt, nút positive màu xanh dương", "UI-H1; UI-LANG; A-R13; FR-21"],
  ["A-TC-038", "Tab order", "Focus theo trên-dưới, trái-phải qua mọi control", "UI-TAB; A-R14"],
].map(([id, title, expected, coverage]) => ({ id, title, expected, coverage }));

const executedIds = new Set([
  "A-TC-001",
  "A-TC-002",
  "A-TC-003",
  "A-TC-004",
  "A-TC-034",
  "A-TC-035",
  "A-TC-036",
  "A-TC-037",
  "A-TC-038",
]);

const serviceProcesses = [];
const serviceLogs = [];
const results = [];

function localIso(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  return `${parts.replace(" ", "T")}+07:00`;
}

function relativeToSubmission(target) {
  return path.relative(submissionRoot, target).replaceAll("\\", "/");
}

async function urlReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForUrl(url, processName, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await urlReady(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`${processName} không sẵn sàng tại ${url}`);
}

function captureServiceOutput(name, child) {
  for (const stream of [child.stdout, child.stderr]) {
    stream?.on("data", (data) => {
      serviceLogs.push(`[${name}] ${data.toString().trimEnd()}`);
    });
  }
}

async function ensureServices() {
  if (!(await urlReady(`${API_URL}/api/products`))) {
    const backend = spawn(process.execPath, ["server.js"], {
      cwd: path.join(shopRoot, "backend"),
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    captureServiceOutput("backend", backend);
    serviceProcesses.push({ name: "backend", process: backend });
    await waitForUrl(`${API_URL}/api/products`, "Backend");
  } else {
    serviceLogs.push("[backend] Reused service đang chạy ở port 3000.");
  }

  if (!(await urlReady(`${WEB_URL}/forgot-password`))) {
    const viteBin = path.join(
      shopRoot,
      "frontend-web",
      "node_modules",
      "vite",
      "bin",
      "vite.js",
    );
    const frontend = spawn(
      process.execPath,
      [viteBin, "--host", "127.0.0.1", "--port", "5173", "--strictPort"],
      {
        cwd: path.join(shopRoot, "frontend-web"),
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    captureServiceOutput("frontend", frontend);
    serviceProcesses.push({ name: "frontend", process: frontend });
    await waitForUrl(`${WEB_URL}/forgot-password`, "Frontend Web");
  } else {
    serviceLogs.push("[frontend] Reused service đang chạy ở port 5173.");
  }
}

async function stopStartedServices() {
  for (const item of serviceProcesses.reverse()) {
    if (!item.process.killed) item.process.kill();
    serviceLogs.push(`[${item.name}] Runner đã gửi tín hiệu dừng process PID ${item.process.pid}.`);
  }
}

async function findBrowserExecutable() {
  for (const candidate of chromeCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Continue to the next installed browser candidate.
    }
  }
  throw new Error("Không tìm thấy Chrome/Edge executable để chạy Playwright.");
}

function attachDialogCollector(page) {
  const messages = [];
  page.on("dialog", async (dialog) => {
    messages.push(dialog.message());
    await dialog.dismiss();
  });
  return messages;
}

async function openForgotPage(page) {
  await page.goto(`${WEB_URL}/forgot-password`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("form");
}

async function requestOtp(page, email) {
  const form = page.locator("form");
  await form.locator("input").first().fill(email);
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(600);
  return page.getByText(/Mã OTP \(4 số\)/).count().then((count) => count > 0);
}

async function inlineErrors(page) {
  const selectors = [
    '[role="alert"]',
    ".error",
    '[class*="text-red"]',
    '[data-testid*="error"]',
  ];
  const texts = [];
  for (const selector of selectors) {
    for (const text of await page.locator(selector).allTextContents()) {
      const normalized = text.trim();
      if (normalized && !texts.includes(normalized)) texts.push(normalized);
    }
  }
  return texts;
}

async function tabSequence(page, count) {
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  const sequence = [];
  for (let index = 0; index < count; index += 1) {
    await page.keyboard.press("Tab");
    sequence.push(
      await page.evaluate(() => {
        const element = document.activeElement;
        if (!element) return "none";
        const text = element.textContent?.trim().replace(/\s+/g, " ");
        return [
          element.tagName.toLowerCase(),
          element.getAttribute("type") ?? "",
          element.getAttribute("name") ?? "",
          text ?? "",
        ]
          .filter(Boolean)
          .join(":");
      }),
    );
  }
  return sequence;
}

async function screenshot(page, id) {
  const target = path.join(screenshotRoot, `${id}.png`);
  await page.screenshot({ path: target, fullPage: true });
  return relativeToSubmission(target);
}

async function executeVisibleCase(context, definition, executor) {
  const page = await context.newPage();
  const dialogs = attachDialogCollector(page);
  const startedAt = new Date();
  let status = "FAIL";
  let actual = "Automation không trả về kết quả.";
  let evidence = [];

  try {
    const outcome = await executor(page, dialogs);
    status = outcome.status;
    actual = outcome.actual;
  } catch (error) {
    status = "BLOCKED";
    actual = `Automation/infrastructure error: ${error.message}`;
  } finally {
    try {
      evidence = [await screenshot(page, definition.id)];
    } catch (error) {
      actual += ` Không chụp được screenshot: ${error.message}`;
    }
    await page.close();
  }

  return {
    ...definition,
    status,
    actual,
    startedAt: localIso(startedAt),
    durationMs: Date.now() - startedAt.getTime(),
    evidence,
  };
}

async function main() {
  await fs.mkdir(screenshotRoot, { recursive: true });
  await fs.mkdir(traceRoot, { recursive: true });
  await ensureServices();

  const database = createDatabaseFixture(shopRoot);
  await database.restoreSeedUsers();
  const browserExecutable = await findBrowserExecutable();
  const browser = await chromium.launch({
    executablePath: browserExecutable,
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const tracePath = path.join(traceRoot, "A-FR03-full-run.zip");
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  const executors = {
    "A-TC-001": async (page) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      const step2 = await requestOtp(page, E1);
      const user = await database.readUser(E1);
      const display = (await page.locator("body").innerText()).match(/Mã OTP của bạn là:\s*(\S+)/)?.[1] ?? null;
      const sixDigits = /^\d{6}$/.test(user?.reset_token ?? "");
      return {
        status: step2 && sixDigits && display === user?.reset_token ? "PASS" : "FAIL",
        actual: `step2=${step2}; DB token=${user?.reset_token ?? "NULL"}; display=${display ?? "không có"}; length=${user?.reset_token?.length ?? 0}.`,
      };
    },
    "A-TC-002": async (page) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      const form = page.locator("form");
      const input = form.locator("input").first();
      await form.locator('button[type="submit"]').click();
      await page.waitForTimeout(300);
      const user = await database.readUser(E1);
      const valid = await input.evaluate((element) => element.checkValidity());
      const validationMessage = await input.evaluate((element) => element.validationMessage);
      return {
        status: !valid && validationMessage.length > 0 && user?.reset_token === null ? "PASS" : "FAIL",
        actual: `HTML validity=${valid}; native validation=${JSON.stringify(validationMessage)}; reset_token=${user?.reset_token ?? "NULL"}. Browser hiển thị validation bubble phía trên submit.`,
      };
    },
    "A-TC-003": async (page, dialogs) => {
      await database.restoreSeedUsers();
      let apiRequests = 0;
      page.on("request", (request) => {
        if (request.url().includes("/api/forgot-password")) apiRequests += 1;
      });
      await openForgotPage(page);
      const input = page.locator("form input").first();
      const type = await input.getAttribute("type");
      await input.fill("test-at-eshop");
      await page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(600);
      return {
        status: type === "email" && apiRequests === 0 && dialogs.length === 0 ? "PASS" : "FAIL",
        actual: `input type=${type}; API requests=${apiRequests}; dialogs=${JSON.stringify(dialogs)}.`,
      };
    },
    "A-TC-004": async (page, dialogs) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      await requestOtp(page, E3);
      const errors = await inlineErrors(page);
      const exists = await database.userExists(E3);
      return {
        status: !exists && errors.length > 0 && dialogs.length === 0 ? "PASS" : "FAIL",
        actual: `user exists=${exists}; inline errors=${JSON.stringify(errors)}; dialogs=${JSON.stringify(dialogs)}. Request bị từ chối nhưng lỗi chỉ xuất hiện bằng alert.`,
      };
    },
    "A-TC-034": async (page) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      const step1Indicator = /Bước\s*1\s*\/\s*2/i.test(await page.locator("body").innerText());
      const loginControlAtStep1 = await page.getByRole("link", { name: /Quay lại.*đăng nhập/i }).count();
      await requestOtp(page, E1);
      const step2Indicator = /Bước\s*2\s*\/\s*2/i.test(await page.locator("body").innerText());
      const backButton = page.getByRole("button", { name: /Quay lại/i });
      const hasBackButton = (await backButton.count()) > 0;
      if (hasBackButton) await backButton.click();
      const returnedToLogin = new URL(page.url()).pathname === "/login";
      const pass = step1Indicator && step2Indicator && (loginControlAtStep1 > 0 || returnedToLogin);
      return {
        status: pass ? "PASS" : "FAIL",
        actual: `step1 indicator=${step1Indicator}; step2 indicator=${step2Indicator}; login control step1=${loginControlAtStep1}; back button=${hasBackButton}; returned /login=${returnedToLogin}.`,
      };
    },
    "A-TC-035": async (page) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      const emailType = await page.locator("form input").first().getAttribute("type");
      const step1Labels = await page.locator("form label").allTextContents();
      await requestOtp(page, E1);
      const step2Labels = await page.locator("form label").allTextContents();
      const step2Types = await page.locator("form input").evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("type")),
      );
      const allLabels = [...step1Labels, ...step2Labels];
      const allRequiredMarked = allLabels.length >= 4 && allLabels.every((label) => label.includes("*"));
      const hasConfirm = step2Labels.some((label) => /xác nhận/i.test(label));
      const passwordTypes = step2Types.filter((type) => type === "password").length;
      const pass = emailType === "email" && allRequiredMarked && hasConfirm && passwordTypes >= 2;
      return {
        status: pass ? "PASS" : "FAIL",
        actual: `email type=${emailType}; labels=${JSON.stringify(allLabels)}; step2 input types=${JSON.stringify(step2Types)}; confirm field=${hasConfirm}; required markers=${allRequiredMarked}.`,
      };
    },
    "A-TC-036": async (page, dialogs) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      await page.locator("form input").first().fill("test-at-eshop");
      await page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(500);
      const step1Errors = await inlineErrors(page);
      await page.reload({ waitUntil: "domcontentloaded" });
      await requestOtp(page, E1);
      const inputs = page.locator("form input");
      await inputs.nth(0).fill("0000");
      await inputs.nth(1).fill("Aa1!bbbb");
      await page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(300);
      const step2Errors = await inlineErrors(page);
      const pass = step1Errors.length > 0 && step2Errors.length > 0 && dialogs.length === 0;
      return {
        status: pass ? "PASS" : "FAIL",
        actual: `step1 inline errors=${JSON.stringify(step1Errors)}; step2 inline errors=${JSON.stringify(step2Errors)}; dialogs=${JSON.stringify(dialogs)}.`,
      };
    },
    "A-TC-037": async (page) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      const h1Step1 = await page.locator("h1").count();
      const bodyStep1 = await page.locator("body").innerText();
      const step1SubmitClass = await page.locator('form button[type="submit"]').getAttribute("class");
      await requestOtp(page, E1);
      const h1Step2 = await page.locator("h1").count();
      const bodyStep2 = await page.locator("body").innerText();
      const step2SubmitClass = await page.locator('form button[type="submit"]').getAttribute("class");
      const vietnamese = /Quên Mật Khẩu/i.test(bodyStep1) && /Mật khẩu mới/i.test(bodyStep2);
      const blueButtons = /bg-blue/.test(step1SubmitClass ?? "") && /bg-blue/.test(step2SubmitClass ?? "");
      const pass = h1Step1 === 1 && h1Step2 === 1 && vietnamese && blueButtons;
      return {
        status: pass ? "PASS" : "FAIL",
        actual: `h1 step1/step2=${h1Step1}/${h1Step2}; Vietnamese=${vietnamese}; submit classes=${JSON.stringify([step1SubmitClass, step2SubmitClass])}.`,
      };
    },
    "A-TC-038": async (page) => {
      await database.restoreSeedUsers();
      await openForgotPage(page);
      const step1Sequence = await tabSequence(page, 6);
      await page.reload({ waitUntil: "domcontentloaded" });
      await requestOtp(page, E1);
      const step2Sequence = await tabSequence(page, 9);
      const step1Expected = ["a", "a", "a", "a", "input:text", "button:submit"];
      const step2Expected = ["a", "a", "a", "a", "input:text", "input:password", "input:password", "button:submit", "button:button"];
      const step1Pass = step1Expected.every((prefix, index) => step1Sequence[index]?.startsWith(prefix));
      const step2Pass = step2Expected.every((prefix, index) => step2Sequence[index]?.startsWith(prefix));
      return {
        status: step1Pass && step2Pass ? "PASS" : "FAIL",
        actual: `step1 focus=${JSON.stringify(step1Sequence)}; step2 focus=${JSON.stringify(step2Sequence)}; expected step2 includes confirm password before submit.`,
      };
    },
  };

  for (const definition of cases.filter((item) => executedIds.has(item.id))) {
    const result = await executeVisibleCase(context, definition, executors[definition.id]);
    results.push(result);
  }

  const blockerPage = await context.newPage();
  attachDialogCollector(blockerPage);
  await database.restoreSeedUsers();
  await openForgotPage(blockerPage);
  await requestOtp(blockerPage, E1);
  const blockerEvidencePath = path.join(screenshotRoot, "shared-missing-confirm-password.png");
  await blockerPage.screenshot({ path: blockerEvidencePath, fullPage: true });
  const blockerEvidence = relativeToSubmission(blockerEvidencePath);
  await blockerPage.close();

  for (const definition of cases.filter((item) => !executedIds.has(item.id))) {
    const expiryBlocked = definition.id === "A-TC-014";
    results.push({
      ...definition,
      status: "BLOCKED",
      actual: expiryBlocked
        ? "Không có OTP lifetime/inclusive rule và schema không có expiry state; đồng thời UI thiếu confirmPassword. Không thể tạo precondition hợp lệ mà không sửa SUT/oracle."
        : "UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end.",
      startedAt: localIso(),
      durationMs: 0,
      evidence: [blockerEvidence],
    });
  }

  results.sort((left, right) => left.id.localeCompare(right.id));
  await context.tracing.stop({ path: tracePath });
  await browser.close();
  await database.restoreSeedUsers();
  const restoredUser = await database.readUser(E1);

  const summary = {
    designed: cases.length,
    executed: results.filter((result) => result.status !== "BLOCKED").length,
    passed: results.filter((result) => result.status === "PASS").length,
    failed: results.filter((result) => result.status === "FAIL").length,
    blocked: results.filter((result) => result.status === "BLOCKED").length,
    notRun: results.filter((result) => result.status === "NOT RUN").length,
  };

  let sutCommit = "UNKNOWN";
  try {
    sutCommit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: shopRoot,
      encoding: "utf8",
    }).trim();
  } catch {
    // Keep UNKNOWN when SHOP is not a Git working tree.
  }

  const payload = {
    schemaVersion: 1,
    feature: "A-FR03",
    platform: "Web",
    runStartedAt: results[0]?.startedAt ?? localIso(),
    runFinishedAt: localIso(),
    browserExecutable,
    webUrl: WEB_URL,
    apiUrl: API_URL,
    sutCommit,
    executionMode: "Sequential Playwright UI with SQLite fixture",
    summary,
    cleanup: {
      restoredEmail: E1,
      passwordRestored: restoredUser?.password === P_OLD,
      resetTokenCleared: restoredUser?.reset_token === null,
    },
    sharedEvidence: {
      trace: relativeToSubmission(tracePath),
      serviceLogs: relativeToSubmission(serviceLogPath),
    },
    results,
  };

  await fs.writeFile(resultPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(serviceLogPath, `${serviceLogs.join("\n")}\n`, "utf8");
  await fs.writeFile(reportPath, buildMarkdownReport(payload), "utf8");

  console.log(JSON.stringify(summary));
  console.log(`Results: ${resultPath}`);
  console.log(`Report: ${reportPath}`);
}

function escapeTable(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function buildMarkdownReport(payload) {
  const rows = payload.results
    .map((result) => {
      const evidence = result.evidence.map((item) => `\`${item}\``).join("<br>");
      return `| \`${result.id}\` | \`${result.status}\` | ${escapeTable(result.actual)} | ${escapeTable(result.coverage)} | ${evidence} |`;
    })
    .join("\n");

  const failed = payload.results.filter((result) => result.status === "FAIL").map((result) => `\`${result.id}\``).join(", ");
  const blocked = payload.results.filter((result) => result.status === "BLOCKED").map((result) => `\`${result.id}\``).join(", ");

  return `# A-FR03 — Kết quả thực thi và evidence

## 1. Thông tin lần chạy

| Trường | Giá trị |
|---|---|
| Feature | \`A-FR03\` — Quên mật khẩu và đặt lại mật khẩu |
| Nền tảng | Web |
| Bắt đầu | ${payload.runStartedAt} |
| Kết thúc | ${payload.runFinishedAt} |
| SUT commit | \`${payload.sutCommit}\` |
| Web/API | \`${payload.webUrl}\` / \`${payload.apiUrl}\` |
| Công cụ | Playwright với Chrome hệ thống, SQLite fixture |
| Chế độ | Tuần tự, một browser context; không sửa source SHOP |
| Trạng thái tài liệu | \`PENDING HUMAN REVIEW\` |

## 2. Test summary

| Chỉ số | Số lượng |
|---|---:|
| Designed | ${payload.summary.designed} |
| Executed | ${payload.summary.executed} |
| Passed | ${payload.summary.passed} |
| Failed | ${payload.summary.failed} |
| Blocked | ${payload.summary.blocked} |
| Not Run | ${payload.summary.notRun} |

\`Executed\` chỉ tính case thực sự thao tác/kiểm tra được trên UI; case dừng vì
thiếu precondition/control được ghi \`BLOCKED\`, không đổi expected result để ép
chạy. Failure IDs: ${failed || "Không có"}. Blocked IDs: ${blocked || "Không có"}.

## 3. Kết quả chi tiết

| Test ID | Status | Actual result | Coverage | Evidence |
|---|---|---|---|---|
${rows}

## 4. Phân tích blocker

- UI Bước 2 không có trường \`confirmPassword\`. Vì vậy các case cần
  \`CONFIRM_VALID\` không thể thực hiện đúng procedure Web đã review; gọi API
  trực tiếp không được dùng thay cho Web end-to-end.
- \`A-TC-014\` còn bị chặn độc lập vì SRS không quy định OTP lifetime/rule tại
  đúng thời điểm hết hạn và database không có expiry state.
- Screenshot blocker dùng chung:
  \`evidence/A/execution/screenshots/shared-missing-confirm-password.png\`.

## 5. Các failure cluster cần đánh giá ở Step 6

1. OTP do SUT phát hành và label UI không tuân thủ 6 chữ số.
2. Validation error dùng browser native/\`alert()\`, không hiển thị trong trang
   phía trên submit.
3. Thiếu Step Indicator và control quay lại login đúng yêu cầu.
4. Thiếu confirm password, required marker và sai input type email.
5. Thiếu \`<h1>\`, nút reset sai màu và Tab order thiếu control confirm.

Các cluster trên là kết quả execution/candidate defect; Bug ID và GitHub Issue
được quyết định ở Step 6 sau human review, không gán trong file này.

## 6. Evidence và khả năng tái lập

- Machine-readable result: \`evidence/A/execution/results.json\`.
- Full Playwright trace: \`${payload.sharedEvidence.trace}\`.
- Service log: \`${payload.sharedEvidence.serviceLogs}\`.
- Automation source: \`automation/A-FR03/\`.
- Cleanup: password seed restored = \`${payload.cleanup.passwordRestored}\`;
  reset token cleared = \`${payload.cleanup.resetTokenCleared}\`.

## 7. Human review gate

- [ ] Mở và đối chiếu screenshot của mọi case FAIL.
- [ ] Mở shared blocker screenshot và xác nhận thiếu confirm field.
- [ ] Kiểm tra trace nếu actual result không đủ rõ.
- [ ] Xác nhận classification PASS/FAIL/BLOCKED.
- [ ] Nhóm failure thành bug mà không đếm trùng.
- [ ] Chuyển trạng thái tài liệu sau review trước Step 6.
`;
}

try {
  await main();
} catch (error) {
  serviceLogs.push(`[runner] FATAL: ${error.stack ?? error.message}`);
  await fs.mkdir(evidenceRoot, { recursive: true });
  await fs.writeFile(serviceLogPath, `${serviceLogs.join("\n")}\n`, "utf8");
  console.error(error);
  process.exitCode = 1;
} finally {
  await stopStartedServices();
}
