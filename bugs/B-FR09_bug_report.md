# B-FR09 — Bug report

## 1. Thông tin chung

| Trường | Giá trị |
|---|---|
| Feature | `B-FR09` — Discount Coupon trên Web checkout |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Execution | `2026-10-13T21:30:34+07:00`–`2026-10-13T21:31:16+07:00` |
| Kết quả nguồn | `evidence/B/execution/results.json` |
| Thống kê nguồn | 41 designed; 17 PASS; 14 FAIL; 10 BLOCKED; 0 NOT RUN |
| Defect đã nhóm | 9 defect từ 14 case FAIL |
| Trạng thái tài liệu | `PENDING HUMAN REVIEW` |

Môi trường chung: Windows `win32 x64`, Node.js `v22.15.1`, Vite `8.0.12`,
System Chrome/Chromium, Web `http://127.0.0.1:5173`, API
`http://127.0.0.1:3000`, SQLite fixture cô lập. Mỗi case reset database trước
khi chạy. Các case BLOCKED không được ghi thành bug.

## 2. Danh sách defect

| Defect | Tiêu đề | Test case | Severity | Priority | Trạng thái |
|---|---|---|---|---|---|
| `B-BUG-001` | Sai công thức percent discount | `B-TC-001`, `B-TC-030` | Critical | P1 | Confirmed |
| `B-BUG-002` | Từ chối order total bằng minimum | `B-TC-014`, `B-TC-041` | Medium | P1 | Confirmed |
| `B-BUG-003` | Tin total do client gửi, không recompute từ cart | `B-TC-016`, `B-TC-017` | Critical | P1 | Confirmed |
| `B-BUG-004` | Apply coupon không yêu cầu authentication | `B-TC-018`–`B-TC-020` | High | P1 | Confirmed |
| `B-BUG-005` | Usage identity lấy từ request body thay vì JWT | `B-TC-021` | Critical | P1 | Confirmed |
| `B-BUG-006` | Checkout/coupon UI truy cập được khi chưa đăng nhập | `B-TC-022` | High | P1 | Confirmed |
| `B-BUG-007` | Checkout thiếu `h1` và breadcrumb | `B-TC-036` | Low | P3 | Confirmed |
| `B-BUG-008` | Positive action không dùng màu xanh dương | `B-TC-037` | Low | P3 | Confirmed |
| `B-BUG-009` | Validation error nằm dưới action | `B-TC-039` | Low | P3 | Confirmed |

## 3. Chi tiết defect

### B-BUG-001 — Sai công thức percent discount

| Trường | Nội dung |
|---|---|
| Requirement | `B-R12`, `B-R14`: `discount = total × percent / 100`; `final = total − discount` |
| Test case | `B-TC-001`, `B-TC-030` |
| Precondition | Coupon percent active, còn hạn, đạt minimum/usage; authenticated user; fixture reset |
| Bước tái hiện | 1. Mở checkout với total 400.000 ₫. 2. Áp dụng `SAVE10` hoặc `PERCENT1`. 3. Quan sát response/UI. |
| Expected | `SAVE10`: discount 40.000, final 360.000; `PERCENT1`: discount 4.000, final 396.000. |
| Actual | `SAVE10`: discount `-3.600.000`, final `4.000.000`; `PERCENT1`: discount `0`, final `400.000`. |
| Root cause | `SHOP/backend/server.js:398–403` và `418–423` tính `total_amount * (1 - coupon.discount_value)` thay vì `total_amount * coupon.discount_value / 100`. |
| Severity / Priority | Critical / P1 — có thể làm tăng tổng thanh toán và tạo discount âm. |
| Evidence | `evidence/B/execution/results.json`; `screenshots/B-TC-001.png`, `B-TC-030.png`; `traces/B-TC-001.zip`, `B-TC-030.zip` trong `evidence/B/execution/` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-002 — Từ chối order total bằng minimum

| Trường | Nội dung |
|---|---|
| Requirement | `B-R05`: total bằng minimum là hợp lệ |
| Test case | `B-TC-014`, `B-TC-041` |
| Precondition | Coupon hợp lệ; total lần lượt bằng 300.000 ₫ và 1 ₫ |
| Bước tái hiện | Đặt cart total đúng bằng `min_order_amount`, sau đó áp dụng coupon. |
| Expected | Coupon được chấp nhận tại điểm biên `M`. |
| Actual | API trả 400 với thông báo chưa đủ minimum. |
| Root cause | `SHOP/backend/server.js:379` dùng `total_amount > coupon.min_order_amount`; oracle yêu cầu `>=`. |
| Severity / Priority | Medium / P1 — từ chối người dùng hợp lệ tại biên nghiệp vụ. |
| Evidence | `evidence/B/execution/results.json`; screenshots/traces `B-TC-014`, `B-TC-041` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-003 — Tin total do client gửi, không recompute từ cart

| Trường | Nội dung |
|---|---|
| Requirement | `B-R15`, liên kết FR-08: total phải là trusted server-side value |
| Test case | `B-TC-016`, `B-TC-017` |
| Precondition | Cart authoritative 400.000 hoặc 299.999 ₫; user authenticated |
| Bước tái hiện | Sửa input/body `total_amount` sang giá trị khác cart rồi áp dụng `SAVE10`. |
| Expected | Backend bỏ qua giá trị giả và recompute từ cart/product state. |
| Actual | Giá trị 299.999 làm coupon bị reject dù cart 400.000; giá trị giả 400.000 bypass threshold của cart 299.999. |
| Root cause | `SHOP/frontend-web/src/pages/Checkout.jsx:14,30,93–100` cho sửa total; `SHOP/backend/server.js:364,379,400,420` trực tiếp tin `total_amount` từ body. |
| Severity / Priority | Critical / P1 — phá vỡ pricing integrity và có thể bypass điều kiện coupon. |
| Evidence | `evidence/B/execution/results.json`; screenshots/traces `B-TC-016`, `B-TC-017` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-004 — Apply coupon không yêu cầu authentication

| Trường | Nội dung |
|---|---|
| Requirement | `B-R08`: user phải authenticated |
| Test case | `B-TC-018`, `B-TC-019`, `B-TC-020` |
| Precondition | Coupon fixed hợp lệ; lần lượt không token, token sai và token hết hạn |
| Bước tái hiện | Gửi `POST /api/apply-coupon` với ba auth state nêu trên. |
| Expected | Reject authentication (`401/403` hoặc contract tương đương). |
| Actual | Cả ba request đều trả 200 và áp dụng `BIGBUY`. |
| Root cause | `SHOP/backend/server.js:363` đăng ký route không có `authenticateToken`, khác các route bảo vệ như checkout ở dòng 297. |
| Severity / Priority | High / P1 — bỏ qua precondition authentication. |
| Evidence | `evidence/B/execution/results.json`; screenshots/traces `B-TC-018`–`B-TC-020` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-005 — Usage identity lấy từ request body thay vì JWT

| Trường | Nội dung |
|---|---|
| Requirement | `B-R07`, `B-R10`: usage phải gắn đúng authenticated user–coupon |
| Test case | `B-TC-021` |
| Precondition | Token thuộc U1; U1 đã dùng `SAVE10` 1/1; U2 chưa dùng |
| Bước tái hiện | Gửi token U1 nhưng body có `user_id = U2`. |
| Expected | Identity U1 từ JWT; reject vì U1 đạt limit. |
| Actual | Request được chấp nhận vì usage được kiểm tra theo U2. |
| Root cause | `SHOP/backend/server.js:364,386–389` đọc và dùng `user_id` từ body; route không tạo `req.user`. Frontend cũng gửi `user?.id` tại `Checkout.jsx:31`. |
| Severity / Priority | Critical / P1 — client có thể bypass per-user usage limit. |
| Evidence | `evidence/B/execution/results.json`; `screenshots/B-TC-021.png`; `traces/B-TC-021.zip` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-006 — Checkout/coupon UI truy cập được khi chưa đăng nhập

| Trường | Nội dung |
|---|---|
| Requirement | `B-R08` và FR-08: unauthenticated user không được tiến hành checkout/apply |
| Test case | `B-TC-022` |
| Precondition | Local storage không có token; browser context mới |
| Bước tái hiện | Mở trực tiếp `/checkout`, nhập coupon và bấm Áp dụng. |
| Expected | Redirect/chặn trước checkout và coupon action. |
| Actual | Trang, total input và coupon action đều hiển thị; request apply được gửi. |
| Root cause | `SHOP/frontend-web/src/App.jsx:58` render `Checkout` không có protected route; `Checkout.jsx:23–35` không guard authentication trước apply. |
| Severity / Priority | High / P1 — UI cho phép thao tác ngoài authenticated flow. |
| Evidence | `evidence/B/execution/results.json`; `screenshots/B-TC-022.png`; `traces/B-TC-022.zip` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-007 — Checkout thiếu `h1` và breadcrumb

| Trường | Nội dung |
|---|---|
| Requirement | `B-R17` |
| Test case | `B-TC-036` |
| Precondition | Checkout truy cập được với nominal cart |
| Bước tái hiện | Mở checkout và inspect semantic DOM. |
| Expected | Đúng một `h1` mô tả trang và có breadcrumb. |
| Actual | `h1Count = 0`, `breadcrumbCount = 0`. |
| Root cause | `Checkout.jsx:80` dùng `h2`; component không render breadcrumb. |
| Severity / Priority | Low / P3 — ảnh hưởng navigation/semantic accessibility. |
| Evidence | `evidence/B/execution/results.json`; screenshot/trace `B-TC-036` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-008 — Positive action không dùng màu xanh dương

| Trường | Nội dung |
|---|---|
| Requirement | `B-R18` |
| Test case | `B-TC-037` |
| Precondition | Checkout nominal; nút Áp dụng được enable |
| Bước tái hiện | Inspect computed background color của Apply và Checkout. |
| Expected | Positive action dùng màu xanh dương. |
| Actual | Apply `rgb(249,115,22)` (orange); Checkout `rgb(22,163,74)` (green). |
| Root cause | `Checkout.jsx:119` dùng `bg-orange-500`; dòng 145 dùng `bg-green-600`. |
| Severity / Priority | Low / P3 — không tuân GUI rule. |
| Evidence | `evidence/B/execution/results.json`; screenshot/trace `B-TC-037` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

### B-BUG-009 — Validation error nằm dưới action

| Trường | Nội dung |
|---|---|
| Requirement | `B-R19` |
| Test case | `B-TC-039` |
| Precondition | Checkout nominal; code `NOTEXIST` |
| Bước tái hiện | Áp dụng code không tồn tại và đo vị trí error/action. |
| Expected | Error nằm phía trên action liên quan. |
| Actual | Apply top = 388 px; error top = 438 px, tức error nằm dưới action. |
| Root cause | `Checkout.jsx:124–126` render `couponError` sau khối input/button. |
| Severity / Priority | Low / P3 — không tuân GUI validation placement. |
| Evidence | `evidence/B/execution/results.json`; screenshot/trace `B-TC-039` |
| Trạng thái | `CONFIRMED — PENDING HUMAN REVIEW` |

## 4. Reconciliation

Mọi FAIL được ánh xạ đúng một defect:

`001,030 → BUG-001`; `014,041 → BUG-002`; `016,017 → BUG-003`;
`018–020 → BUG-004`; `021 → BUG-005`; `022 → BUG-006`;
`036 → BUG-007`; `037 → BUG-008`; `039 → BUG-009`.

Tổng cộng `2+2+2+3+1+1+1+1+1 = 14` case FAIL. Không có case PASS hoặc
BLOCKED nào được dùng để tăng số bug.

## 5. Human review gate

- [ ] Xác nhận 9 defect thực sự khác root cause và không double-count.
- [ ] Mở evidence của toàn bộ defect Critical/High.
- [ ] Xác nhận severity/priority theo quy ước môn học.
- [ ] Xác nhận source reference đúng baseline.
- [ ] Chuyển từng defect sang verdict review phù hợp trước Step 7.
