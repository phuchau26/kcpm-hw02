# A-FR03 — Bug report

## 1. Thông tin chung

| Trường | Giá trị |
|---|---|
| Feature | `A-FR03` — Quên mật khẩu và đặt lại mật khẩu |
| Nền tảng | Web |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Lần chạy | 2026-10-12T21:33:42+07:00 đến 2026-10-12T21:33:55+07:00 |
| Môi trường | Chrome hệ thống; Web `127.0.0.1:5173`; API `127.0.0.1:3000`; SQLite fixture |
| Nguồn kết quả | `features/A/05_execution_results.md`; `evidence/A/execution/results.json` |
| Full trace | `evidence/A/execution/traces/A-FR03-full-run.zip` |
| Trạng thái tài liệu | `REVIEWED — USER-DELEGATED AI REVIEW` |
| Căn cứ chấp nhận | Sinh viên ủy quyền AI quyết định review cuối ngày 2026-10-13 |

Severity dùng ba mức: `Major` khi làm sai rule nghiệp vụ/bảo mật hoặc chặn một
phần lớn luồng; `Minor` khi chức năng chính vẫn truy cập được nhưng vi phạm GUI,
validation hoặc accessibility. Priority phản ánh thứ tự đề nghị sửa, không phải
severity.

## 2. Tổng hợp defect đã xác nhận bằng execution

| Bug ID | Tóm tắt | Test case | Severity | Priority | Status |
|---|---|---|---|---|---|
| `A-BUG-001` | OTP được sinh và hiển thị chỉ có 4 chữ số | `A-TC-001` | Major | High | Confirmed — User-Delegated Review |
| `A-BUG-002` | Email dùng `type="text"`, cho phép email sai format gọi API | `A-TC-003`, `A-TC-035` | Minor | High | Confirmed — User-Delegated Review |
| `A-BUG-003` | Validation error dùng `alert()` thay vì inline phía trên submit | `A-TC-004`, `A-TC-036` | Minor | Medium | Confirmed — User-Delegated Review |
| `A-BUG-004` | Thiếu Step Indicator và control quay lại trang đăng nhập | `A-TC-034` | Minor | Medium | Confirmed — User-Delegated Review |
| `A-BUG-005` | Label của các field bắt buộc thiếu ký hiệu `*` | `A-TC-035` | Minor | Low | Confirmed — User-Delegated Review |
| `A-BUG-006` | Bước 2 thiếu trường xác nhận mật khẩu | `A-TC-035`, `A-TC-038` | Major | High | Confirmed — User-Delegated Review |
| `A-BUG-007` | Trang dùng `<h2>`, không có đúng một `<h1>` | `A-TC-037` | Minor | Low | Confirmed — User-Delegated Review |
| `A-BUG-008` | Nút đặt lại mật khẩu dùng màu xanh lá thay vì xanh dương | `A-TC-037` | Minor | Low | Confirmed — User-Delegated Review |

`A-TC-038` không tạo defect Tab-order riêng: chuỗi focus bị thiếu control vì
chính trường confirm password không tồn tại, cùng root cause với `A-BUG-006`.

## 3. Chi tiết defect

### A-BUG-001 — OTP chỉ có 4 chữ số

| Trường | Nội dung |
|---|---|
| Requirement | `A-R01`, `SEC-07`; boundary `A-B01-ON` |
| Test case | `A-TC-001` |
| Môi trường | Môi trường chung tại mục 1; user seed `test@eshop.com` |
| Precondition | Email tồn tại; `reset_token` được xóa trước case |
| Bước tái hiện | Mở `/forgot-password`; nhập `test@eshop.com`; bấm **Lấy mã OTP**; đối chiếu OTP trên UI và SQLite |
| Expected | Sinh và hiển thị OTP ngẫu nhiên đúng 6 chữ số; chuyển Bước 2 |
| Actual | UI và DB cùng nhận `4736`, length 4; UI còn ghi “Mã OTP (4 số)” |
| Severity / Priority | Major / High |
| Evidence | `evidence/A/execution/screenshots/A-TC-001.png`; `evidence/A/execution/results.json`; `evidence/A/execution/traces/A-FR03-full-run.zip` |
| Root cause evidence | `SHOP/backend/server.js:72` sinh miền 1000–9999; `ForgotPassword.jsx:69` ghi nhãn 4 số |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

### A-BUG-002 — Email sai format vẫn gọi API

| Trường | Nội dung |
|---|---|
| Requirement | `A-R02`, `A-R11`; FR-22 |
| Test case | `A-TC-003`, phần email của `A-TC-035` |
| Môi trường | Môi trường chung tại mục 1 |
| Precondition | Đang ở Bước 1; không có token cho email test |
| Bước tái hiện | Nhập `test-at-eshop`; bấm **Lấy mã OTP**; quan sát request và DOM input |
| Expected | HTML5 email validation chặn trước API; input có `type="email"` |
| Actual | Input có `type="text"`; một request API được gửi và SUT hiện alert `User not found` |
| Severity / Priority | Minor / High |
| Evidence | `evidence/A/execution/screenshots/A-TC-003.png`, `evidence/A/execution/screenshots/A-TC-035.png`; `evidence/A/execution/results.json`; full trace |
| Root cause evidence | `SHOP/frontend-web/src/pages/ForgotPassword.jsx:50` đặt `type="text"` |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

### A-BUG-003 — Lỗi validation không hiển thị inline

| Trường | Nội dung |
|---|---|
| Requirement | `A-R02`, `A-R12`; FR-22 |
| Test case | `A-TC-004`, `A-TC-036` |
| Môi trường | Môi trường chung tại mục 1 |
| Precondition | Bước 1 dùng email chưa đăng ký; Bước 2 dùng dữ liệu password invalid |
| Bước tái hiện | Gửi email chưa đăng ký; sau đó gây lỗi validation ở Bước 2; kiểm tra vùng trước submit |
| Expected | Lỗi nằm trong trang, phía trên nút submit; không chỉ dùng dialog |
| Actual | Không có inline error; lỗi được phát qua `alert()` |
| Severity / Priority | Minor / Medium |
| Evidence | `evidence/A/execution/screenshots/A-TC-004.png`, `evidence/A/execution/screenshots/A-TC-036.png`; dialog events trong `evidence/A/execution/results.json` và full trace |
| Root cause evidence | `ForgotPassword.jsx:20`, `:28`, `:37` gọi `alert()`; không render error state |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

### A-BUG-004 — Luồng hai bước thiếu indicator và quay lại login

| Trường | Nội dung |
|---|---|
| Requirement | `A-R03`; FR-03, FR-22 |
| Test case | `A-TC-034` |
| Môi trường | Môi trường chung tại mục 1 |
| Precondition | Feature truy cập được và có thể chuyển giữa Bước 1/Bước 2 |
| Bước tái hiện | Quan sát Bước 1; yêu cầu OTP; quan sát Bước 2; bấm **Quay lại** |
| Expected | Cả hai bước có Step Indicator; có control về `/login` |
| Actual | Không có indicator; không có control về login; nút **Quay lại** chỉ gọi về Bước 1 |
| Severity / Priority | Minor / Medium |
| Evidence | `evidence/A/execution/screenshots/A-TC-034.png`; `evidence/A/execution/results.json`; full trace |
| Root cause evidence | `ForgotPassword.jsx:41–98` không render indicator/link login; dòng 93 gọi `setStep(1)` |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

### A-BUG-005 — Label bắt buộc thiếu dấu sao

| Trường | Nội dung |
|---|---|
| Requirement | `A-R10`; FR-22 |
| Test case | `A-TC-035` |
| Môi trường | Môi trường chung tại mục 1 |
| Precondition | Quan sát được cả Bước 1 và Bước 2 |
| Bước tái hiện | Kiểm tra label email, OTP và mật khẩu mới |
| Expected | Mỗi field bắt buộc có ký hiệu `*` cạnh label |
| Actual | Không label nào có ký hiệu `*` |
| Severity / Priority | Minor / Low |
| Evidence | `evidence/A/execution/screenshots/A-TC-035.png`; `evidence/A/execution/results.json`; full trace |
| Root cause evidence | Label tại `ForgotPassword.jsx:48`, `:69`, `:79` không chứa `*` |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

### A-BUG-006 — Thiếu trường xác nhận mật khẩu

| Trường | Nội dung |
|---|---|
| Requirement | `A-R04`, `A-R07`, `A-R14`; FR-03 |
| Test case | Fail: `A-TC-035`, `A-TC-038`; blocker liên quan: `A-TC-005`–`A-TC-033` |
| Môi trường | Môi trường chung tại mục 1 |
| Precondition | Đã yêu cầu OTP và đang ở Bước 2 |
| Bước tái hiện | Quan sát form Bước 2; dùng Tab qua toàn bộ control |
| Expected | Có password và confirm password, cả hai `type="password"`; Tab tới confirm trước submit |
| Actual | Chỉ có OTP và một password input; chuỗi Tab đi thẳng từ password tới submit |
| Severity / Priority | Major / High |
| Evidence | `evidence/A/execution/screenshots/A-TC-035.png`, `evidence/A/execution/screenshots/A-TC-038.png`, `evidence/A/execution/screenshots/shared-missing-confirm-password.png`; full trace |
| Root cause evidence | State và JSX ở `ForgotPassword.jsx:5–10`, `:63–96` không có confirm password |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

### A-BUG-007 — Không có thẻ `<h1>` mô tả trang

| Trường | Nội dung |
|---|---|
| Requirement | `A-R13`; FR-21 |
| Test case | Phần heading của `A-TC-037` |
| Môi trường | Môi trường chung tại mục 1 |
| Precondition | Quan sát được cả hai bước |
| Bước tái hiện | Đếm phần tử `<h1>` trong DOM ở Bước 1 và Bước 2 |
| Expected | Mỗi trạng thái trang có đúng một `<h1>` mô tả nội dung |
| Actual | Số `<h1>` là 0 ở cả hai bước; tiêu đề dùng `<h2>` |
| Severity / Priority | Minor / Low |
| Evidence | `evidence/A/execution/screenshots/A-TC-037.png`; `evidence/A/execution/results.json`; full trace |
| Root cause evidence | `ForgotPassword.jsx:43` dùng `<h2>` |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

### A-BUG-008 — Nút reset dùng sai màu positive action

| Trường | Nội dung |
|---|---|
| Requirement | FR-21 — positive action dùng màu xanh dương |
| Test case | Phần màu nút của `A-TC-037` |
| Môi trường | Môi trường chung tại mục 1 |
| Precondition | Đang ở Bước 2 |
| Bước tái hiện | Kiểm tra class/style của nút **Đặt lại mật khẩu** |
| Expected | Nút positive action dùng màu xanh dương |
| Actual | Nút dùng class `bg-green-600` |
| Severity / Priority | Minor / Low |
| Evidence | `evidence/A/execution/screenshots/A-TC-037.png`; `evidence/A/execution/results.json`; full trace |
| Root cause evidence | `ForgotPassword.jsx:90` dùng `bg-green-600` |
| Status | `CONFIRMED — USER-DELEGATED REVIEW` |

## 4. Phạm vi kết luận

- Có 8 defect được xác nhận bằng execution; 8 test case FAIL được ánh xạ tới
  các defect này nhưng không theo quan hệ một-một.
- 29 case `BLOCKED` không được ghi thành defect mới. Chúng là tác động của
  `A-BUG-006`; riêng `A-TC-014` còn phụ thuộc expiry rule/fixture.
- Các sai lệch chỉ phát hiện qua static source review được giữ trong
  `features/A/06_ai_gap_analysis.md`, chưa gắn trạng thái defect confirmed.

## 5. Checklist sinh viên review

- [x] Đồng ý cách nhóm root cause và số lượng 8 defect.
- [x] Đồng ý severity/priority của từng defect.
- [x] Đối chiếu evidence/trace của các defect, ưu tiên defect Major.
- [x] Xác nhận 29 case `BLOCKED` không bị đếm thành 29 defect.
- [x] Chuyển tám defect sang `CONFIRMED — USER-DELEGATED REVIEW`.

Review được thực hiện theo yêu cầu ủy quyền rõ ràng của sinh viên ngày
2026-10-13; tài liệu không tuyên bố đây là independent human review.
