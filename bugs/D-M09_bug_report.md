# D-M09 — Bug report

## 1. Thông tin chung

| Trường | Giá trị |
|---|---|
| Feature | `D-M09` — Discount Coupon trên Mobile checkout |
| Runtime thực thi | Chuẩn: Expo Web/Chromium `440 × 956`; bổ sung: thiết bị iOS thật qua Expo Go/Expo SDK 57 |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Execution | `2026-10-15T19:32:01+07:00`–`2026-10-15T19:32:59+07:00` |
| Kết quả nguồn | `evidence/D/execution/results.json` |
| Thống kê nguồn | 50 designed; 19 PASS; 11 FAIL; 20 BLOCKED; 0 NOT RUN |
| Root-cause group | 7 nhóm: 5 defect Backend đã có canonical record ở Pool B và 2 defect riêng của Mobile |
| Defect mới của Pool D | 2 (`D-BUG-001`, `D-BUG-002`) |
| Trạng thái tài liệu | `PENDING HUMAN REVIEW — NATIVE iOS SUPPLEMENT` |
| Người review | Nguyễn Phúc Hậu (`23120252`) |
| Thời điểm xác nhận | 2026-10-15 20:06:05 +07:00 |

Môi trường dùng Backend `http://127.0.0.1:3000`, Expo Web
`http://127.0.0.1:8081`, SQLite fixture cô lập và Chrome/Chromium hệ thống. Runner
đã hoàn tất đủ 50 record, không có automation error và xác nhận hash source SHOP
không đổi. `service-logs.txt` không ghi nhận environment/connection issue làm mất
verdict trong lần chạy này.

Không có video. Evidence động sử dụng Playwright trace (`.zip`) cùng screenshot,
`results.json` và service log.

Ngày 2026-10-16 có thêm 9 screenshot trên thiết bị iOS thật tại
`evidence/D/native-ios/screenshots/`. Bộ ảnh dùng baseline Expo SDK/API config mới
nên chỉ corroborate kết quả; không thay đổi thống kê hoặc tạo defect mới.

## 2. Nguyên tắc chống trùng defect giữa Pool B và D

Năm root cause Backend đã được xác nhận bởi Pool B không được tạo lại thành
`D-BUG-*`. Tài liệu này dẫn canonical defect `B-BUG-001`–`B-BUG-005` và bổ sung
test/evidence Mobile để chứng minh ảnh hưởng trên đường D-M09. Chỉ lỗi có root
cause nằm trong `frontend-mobile/App.js` mới nhận ID defect mới của Pool D.

## 3. Tổng hợp root-cause group

| Canonical defect | Layer | Tiêu đề | Test case D | Severity | Priority | Kết luận |
|---|---|---|---|---|---|---|
| `B-BUG-001` | Backend | Sai công thức percent discount | `D-TC-008`, `D-TC-031`; góp phần vào `D-TC-044` | Critical | P1 | Confirmed; dẫn chiếu Pool B |
| `B-BUG-002` | Backend | Từ chối total bằng minimum | `D-TC-017` | Medium | P1 | Confirmed; dẫn chiếu Pool B |
| `B-BUG-003` | Backend | Tin total do client gửi, không recompute authoritative pricing | `D-TC-019`, `D-TC-020`, `D-TC-044` | Critical | P1 | Confirmed; dẫn chiếu Pool B |
| `B-BUG-004` | Backend | Apply coupon không yêu cầu authentication | `D-TC-027`, `D-TC-028` | High | P1 | Confirmed; dẫn chiếu Pool B |
| `B-BUG-005` | Backend | Usage identity lấy từ request body thay vì JWT | `D-TC-026` | Critical | P1 | Confirmed; dẫn chiếu Pool B |
| `D-BUG-001` | Mobile render/style | Positive action không dùng màu xanh dương | `D-TC-046` | Low | P3 | Confirmed; defect mới của Pool D |
| `D-BUG-002` | Mobile render/layout | Validation error nằm dưới action Apply | `D-TC-047` | Low | P3 | Confirmed; defect mới của Pool D |

`D-TC-044` được ánh xạ chính vào `B-BUG-003` vì checkout lưu trực tiếp total do
client gửi; giá trị sai ban đầu còn chịu tác động của `B-BUG-001`. Case này không
được đếm thành defect thứ tám.

## 4. Defect Backend dùng chung — canonical record ở Pool B

### B-BUG-001 — Sai công thức percent discount

| Trường | Nội dung |
|---|---|
| Canonical report | `bugs/B-FR09_bug_report.md`, mục `B-BUG-001` |
| Requirement | `D-R12`, `D-R14`: `discount = total × percent / 100`; `final = total − discount` |
| Test case D | `D-TC-008`, `D-TC-031`; causal input của `D-TC-044` |
| Precondition | Coupon percent active, còn hạn, đạt minimum/usage; fixture reset |
| Bước tái hiện | 1. Mở Mobile checkout với total 400.000 ₫. 2. Áp dụng `SAVE10` hoặc fixture percent 1. 3. Quan sát response và số tiền render. |
| Expected | `SAVE10`: discount 40.000, final 360.000; percent 1: discount 4.000, final 396.000. |
| Actual | `SAVE10`: discount `-3.600.000`, final `4.000.000`; percent 1: discount `0`, final `400.000`. |
| Root cause | `SHOP/backend/server.js:397–401,418–420` tính `total_amount * (1 - coupon.discount_value)` thay vì chia phần trăm cho 100. Mobile chỉ render response tại `App.js:723–730`. |
| Severity / Priority | Critical / P1 |
| Evidence D | `evidence/D/execution/results.json`; screenshots `D-TC-008.png`, `D-TC-031.png`, `D-TC-044.png`; traces cùng Test ID trong `evidence/D/execution/`; `service-logs.txt`; bổ sung `evidence/D/native-ios/screenshots/D-TC-008-ios-physical.jpg` với dữ liệu 4.000.000 ₫ |
| Trạng thái | `CONFIRMED — REVIEWED` |

### B-BUG-002 — Từ chối total bằng minimum

| Trường | Nội dung |
|---|---|
| Canonical report | `bugs/B-FR09_bug_report.md`, mục `B-BUG-002` |
| Requirement | `D-R05`: total bằng minimum phải hợp lệ |
| Test case D | `D-TC-017` |
| Precondition | `SAVE10` hợp lệ; total và `min_order_amount` cùng bằng 300.000 ₫ |
| Bước tái hiện | Gửi apply-coupon với total đúng bằng minimum. |
| Expected | Coupon được chấp nhận tại boundary `M`. |
| Actual | API trả 400 và báo đơn hàng chưa đủ minimum. |
| Root cause | `SHOP/backend/server.js:379` dùng `>` thay vì `>=`. |
| Severity / Priority | Medium / P1 |
| Evidence D | `results.json`; screenshot/trace `D-TC-017`; `service-logs.txt` |
| Trạng thái | `CONFIRMED — REVIEWED` |

### B-BUG-003 — Tin total client, không recompute authoritative pricing

| Trường | Nội dung |
|---|---|
| Canonical report | `bugs/B-FR09_bug_report.md`, mục `B-BUG-003` |
| Requirement | `D-R15`, FR-08: Backend phải tính lại total từ cart/items |
| Test case D | `D-TC-019`, `D-TC-020`, `D-TC-044` |
| Precondition | Cart authoritative lần lượt 400.000 hoặc 299.999 ₫; user hợp lệ |
| Bước tái hiện | 1. Gửi `total_amount` khác cart khi apply. 2. Với checkout, áp dụng percent rồi xác nhận đơn. 3. Đọc order trong fixture. |
| Expected | Apply dùng total server-side; checkout lưu authoritative final 360.000 ₫ cho nominal percent case. |
| Actual | Total giả thấp làm reject, total giả cao bypass minimum; checkout lưu `4.000.000` từ client response sai. |
| Root cause | Apply đọc trực tiếp body tại `server.js:364,379`; checkout đọc và lưu `total_amount` tại `server.js:297–303`. Mobile gửi `cartTotal` khi apply (`App.js:366–368`) và gửi `couponResult.final_amount` khi checkout (`App.js:383–393`). |
| Severity / Priority | Critical / P1 |
| Evidence D | `results.json`; screenshots/traces `D-TC-019`, `D-TC-020`, `D-TC-044`; `service-logs.txt` |
| Trạng thái | `CONFIRMED — REVIEWED` |

### B-BUG-004 — Apply coupon không yêu cầu authentication

| Trường | Nội dung |
|---|---|
| Canonical report | `bugs/B-FR09_bug_report.md`, mục `B-BUG-004` |
| Requirement | `D-R08`, FR-09 C4, SEC-02 |
| Test case D | `D-TC-027`, `D-TC-028` |
| Precondition | Coupon fixed hợp lệ; lần lượt thiếu token và token sai |
| Bước tái hiện | Gửi `POST /api/apply-coupon` không Authorization hoặc với bearer token không hợp lệ. |
| Expected | Request bị từ chối theo authentication contract. |
| Actual | Cả hai request trả 200 và áp dụng `BIGBUY`. |
| Root cause | `SHOP/backend/server.js:363` không gắn middleware `authenticateToken`. Mobile apply request cũng chỉ gửi `Content-Type` tại `App.js:362–369`. |
| Severity / Priority | High / P1 |
| Evidence D | `results.json`; screenshots/traces `D-TC-027`, `D-TC-028`; `service-logs.txt` |
| Trạng thái | `CONFIRMED — REVIEWED` |

### B-BUG-005 — Usage identity lấy từ body thay vì JWT

| Trường | Nội dung |
|---|---|
| Canonical report | `bugs/B-FR09_bug_report.md`, mục `B-BUG-005` |
| Requirement | `D-R07`, `D-R10`: usage gắn với authenticated identity |
| Test case D | `D-TC-026` |
| Precondition | Token U1; U1 đạt usage 1/1; body giả `user_id=U2` chưa dùng |
| Bước tái hiện | Gửi token U1 nhưng body dùng ID của U2 rồi apply `SAVE10`. |
| Expected | Dùng U1 từ JWT và reject do đạt limit. |
| Actual | Request được chấp nhận theo usage của U2. |
| Root cause | `server.js:364,386–389` dùng `user_id` trong body; route không thiết lập `req.user`. Mobile gửi `user?.id` ở `App.js:368`. |
| Severity / Priority | Critical / P1 |
| Evidence D | `results.json`; screenshot/trace `D-TC-026`; `service-logs.txt` |
| Trạng thái | `CONFIRMED — REVIEWED` |

## 5. Defect riêng của Mobile client

### D-BUG-001 — Positive action không dùng màu xanh dương

| Trường | Nội dung |
|---|---|
| Requirement | `D-R19`, GUI rule FR-21 |
| Test case | `D-TC-046` |
| Precondition | Mobile checkout mở được; input coupon có giá trị để enable Apply |
| Bước tái hiện | Mở checkout, nhập `BIGBUY`, đo computed background color của Apply và Checkout trên Expo Web. |
| Expected | Positive action dùng màu xanh dương. |
| Actual | Apply `rgb(249, 115, 22)` (orange); Checkout `rgb(22, 163, 74)` (green). |
| Root cause | `frontend-mobile/App.js:706–713,1065–1066` dùng `orangeButton`; `742–748,1173–1174` dùng `checkoutBtn` màu xanh lá. Đây là source riêng của Mobile, không phải root cause Backend. |
| Severity / Priority | Low / P3 |
| Evidence | `evidence/D/execution/results.json`; screenshot `screenshots/D-TC-046.png`; trace `traces/D-TC-046.zip`; service log cùng execution root |
| Trạng thái | `CONFIRMED — REVIEWED` |

`B-BUG-008` có cùng biểu hiện GUI trên Web nhưng dùng source component khác; do đó
`D-BUG-001` là defect Mobile độc lập, không phải bản sao Backend.

### D-BUG-002 — Validation error nằm dưới action Apply

| Trường | Nội dung |
|---|---|
| Requirement | `D-R20`, GUI rule FR-22 |
| Test case | `D-TC-047` |
| Precondition | Mobile checkout nominal; code `NO_SUCH_COUPON` |
| Bước tái hiện | Áp dụng code không tồn tại rồi đo vị trí action và feedback. |
| Expected | Validation feedback nằm phía trên action Apply liên quan. |
| Actual | Apply top `341 px`; error top `379 px`, tức error nằm dưới action. |
| Root cause | `App.js:693–721` render khối input/action trước `couponError`; đây là layout/state render của Mobile client. |
| Severity / Priority | Low / P3 |
| Evidence | `results.json`; screenshot `screenshots/D-TC-047.png`; trace `traces/D-TC-047.zip`; service log cùng execution root |
| Trạng thái | `CONFIRMED — REVIEWED` |

`B-BUG-009` là lỗi tương tự trên Web nhưng nằm trong `Checkout.jsx`; hai client
phải sửa riêng và không được gộp thành một Backend defect.

## 6. Reconciliation

Ánh xạ primary root cause của 11 FAIL:

- `D-TC-008`, `D-TC-031` → `B-BUG-001`.
- `D-TC-017` → `B-BUG-002`.
- `D-TC-019`, `D-TC-020`, `D-TC-044` → `B-BUG-003`; `D-TC-044` còn chịu tác động của `B-BUG-001`.
- `D-TC-027`, `D-TC-028` → `B-BUG-004`.
- `D-TC-026` → `B-BUG-005`.
- `D-TC-046` → `D-BUG-001`.
- `D-TC-047` → `D-BUG-002`.

Tổng primary mapping: `2 + 1 + 3 + 2 + 1 + 1 + 1 = 11` FAIL. Không có
case PASS hoặc BLOCKED nào được chuyển thành defect.

Ảnh `D-TC-042-ios-physical.jpg` cho thấy khi tắt kết nối, Mobile render chuỗi
exception thô có `ExpoModulesCore/Promise.swift:56`. Do chưa có oracle về message,
retry hoặc fallback (`D-GAP-R09`), quan sát này được ghi thành `D-IG-04`, không
được nâng thành confirmed defect và không biến case BLOCKED thành FAIL.
