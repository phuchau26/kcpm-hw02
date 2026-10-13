# A-FR03 — Kết quả thực thi và evidence

## 1. Thông tin lần chạy

| Trường | Giá trị |
|---|---|
| Feature | `A-FR03` — Quên mật khẩu và đặt lại mật khẩu |
| Nền tảng | Web |
| Bắt đầu | 2026-10-12T21:33:42+07:00 |
| Kết thúc | 2026-10-12T21:33:55+07:00 |
| SUT commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Web/API | `http://127.0.0.1:5173` / `http://127.0.0.1:3000` |
| Công cụ | Playwright với Chrome hệ thống, SQLite fixture |
| Chế độ | Tuần tự, một browser context; không sửa source SHOP |
| Trạng thái tài liệu | `REVIEWED — EVIDENCE/SOURCE CROSS-CHECKED` |
| Căn cứ review | Kết quả và evidence đã được đối chiếu với oracle/source |
| Ngày review | 2026-10-12 |

## 2. Test summary

| Chỉ số | Số lượng |
|---|---:|
| Designed | 38 |
| Executed | 9 |
| Passed | 1 |
| Failed | 8 |
| Blocked | 29 |
| Not Run | 0 |

`Executed` chỉ tính case thực sự thao tác/kiểm tra được trên UI; case dừng vì
thiếu precondition/control được ghi `BLOCKED`, không đổi expected result để ép
chạy. Failure IDs: `A-TC-001`, `A-TC-003`, `A-TC-004`, `A-TC-034`, `A-TC-035`, `A-TC-036`, `A-TC-037`, `A-TC-038`. Blocked IDs: `A-TC-005`, `A-TC-006`, `A-TC-007`, `A-TC-008`, `A-TC-009`, `A-TC-010`, `A-TC-011`, `A-TC-012`, `A-TC-013`, `A-TC-014`, `A-TC-015`, `A-TC-016`, `A-TC-017`, `A-TC-018`, `A-TC-019`, `A-TC-020`, `A-TC-021`, `A-TC-022`, `A-TC-023`, `A-TC-024`, `A-TC-025`, `A-TC-026`, `A-TC-027`, `A-TC-028`, `A-TC-029`, `A-TC-030`, `A-TC-031`, `A-TC-032`, `A-TC-033`.

## 3. Kết quả chi tiết

| Test ID | Status | Actual result | Coverage | Evidence |
|---|---|---|---|---|
| `A-TC-001` | `FAIL` | step2=true; DB token=4736; display=4736; length=4. | A-R01; A-B01-ON | `evidence/A/execution/screenshots/A-TC-001.png` |
| `A-TC-002` | `PASS` | HTML validity=false; native validation="Please fill out this field."; reset_token=NULL. Browser hiển thị validation bubble phía trên submit. | ES-I1; A-R02; A-R12 | `evidence/A/execution/screenshots/A-TC-002.png` |
| `A-TC-003` | `FAIL` | input type=text; API requests=1; dialogs=["Lỗi: User not found"]. | ES-I2; A-R02; A-R11 | `evidence/A/execution/screenshots/A-TC-003.png` |
| `A-TC-004` | `FAIL` | user exists=false; inline errors=[]; dialogs=["Lỗi: User not found"]. Request bị từ chối nhưng lỗi chỉ xuất hiện bằng alert. | EM-I1; A-R02; A-R12 | `evidence/A/execution/screenshots/A-TC-004.png` |
| `A-TC-005` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | S2-V1; A-R04 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-006` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OF-I2; A-B01-LOW; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-007` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OF-I2; A-B01-HIGH; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-008` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OF-I1; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-009` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OF-I3; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-010` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OF-I4; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-011` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OV-I1; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-012` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OB-I1; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-013` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OL-I1; A-R05 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-014` | `BLOCKED` | Không có OTP lifetime/inclusive rule và schema không có expiry state; đồng thời UI thiếu confirmPassword. Không thể tạo precondition hợp lệ mà không sửa SUT/oracle. | OL-I2; A-B08; A-R09 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-015` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OL-I3; A-R08 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-016` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PL-I2; A-B02-LOW; A-R06 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-017` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PL-V1; A-B02-HIGH; A-R04 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-018` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PU-I1; A-B03-LOW; A-R06 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-019` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PU-V1; A-B03-HIGH; A-R04 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-020` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PW-I1; A-B04-LOW; A-R06 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-021` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PW-V1; A-B04-ON; A-R04 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-022` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PW-V1; A-B04-HIGH; A-R04 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-023` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PD-I1; A-B05-LOW; A-R06 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-024` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PD-V1; A-B05-HIGH; A-R04 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-025` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PS-I1; A-B06-LOW; A-R06 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-026` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PS-V1; A-B06-HIGH; A-R04 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-027` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PS-I1; A-R06 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-028` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PL-I1; A-R06 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-029` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PC-I1; A-R07 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-030` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PC-I2; A-B07-SUB; A-R07 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-031` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PC-I2; A-B07-CASE; A-R07 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-032` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | PC-I2; A-B07-DEL; A-R07 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-033` | `BLOCKED` | UI không có trường confirmPassword nên không thể thiết lập CONFIRM_VALID và thực hiện PROC-RESET đúng thiết kế mà không sửa SUT. Không dùng API thay thế Web end-to-end. | OUT-HASH; A-R04; SEC-01 | `evidence/A/execution/screenshots/shared-missing-confirm-password.png` |
| `A-TC-034` | `FAIL` | step1 indicator=false; step2 indicator=false; login control step1=0; back button=true; returned /login=false. | UI-STEP; UI-BACK; A-R03 | `evidence/A/execution/screenshots/A-TC-034.png` |
| `A-TC-035` | `FAIL` | email type=text; labels=["Nhập Email của bạn","Mã OTP (4 số)","Mật khẩu mới"]; step2 input types=["text","password"]; confirm field=false; required markers=false. | UI-REQ; UI-TYPE; A-R10; A-R11 | `evidence/A/execution/screenshots/A-TC-035.png` |
| `A-TC-036` | `FAIL` | step1 inline errors=[]; step2 inline errors=[]; dialogs=["Lỗi: User not found","Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."]. | UI-ERROR; A-R12 | `evidence/A/execution/screenshots/A-TC-036.png` |
| `A-TC-037` | `FAIL` | h1 step1/step2=0/0; Vietnamese=true; submit classes=["w-full bg-blue-600 text-white py-2 rounded","w-full bg-green-600 text-white py-2 rounded"]. | UI-H1; UI-LANG; A-R13; FR-21 | `evidence/A/execution/screenshots/A-TC-037.png` |
| `A-TC-038` | `FAIL` | step1 focus=["a:EShop","a:Giỏ hàng","a:Đăng nhập","a:Đăng ký","input:text","button:submit:Lấy mã OTP"]; step2 focus=["a:EShop","a:Giỏ hàng","a:Đăng nhập","a:Đăng ký","input:text","input:password","button:submit:Đặt lại mật khẩu","button:button:← Quay lại","body:EShopGiỏ hàngĐăng nhậpĐăng kýQuên Mật KhẩuMã OTP của bạn là: 5056Mã OTP (4 số)Mật khẩu mớiĐặt lại mật khẩu← Quay lại© 2026 EShop SUT. Dành cho mục đích kiểm thử."]; expected step2 includes confirm password before submit. | UI-TAB; A-R14 | `evidence/A/execution/screenshots/A-TC-038.png` |

## 4. Phân tích blocker

- UI Bước 2 không có trường `confirmPassword`. Vì vậy các case cần
  `CONFIRM_VALID` không thể thực hiện đúng procedure Web đã review; gọi API
  trực tiếp không được dùng thay cho Web end-to-end.
- `A-TC-014` còn bị chặn độc lập vì SRS không quy định OTP lifetime/rule tại
  đúng thời điểm hết hạn và database không có expiry state.
- Screenshot blocker dùng chung:
  `evidence/A/execution/screenshots/shared-missing-confirm-password.png`.

## 5. Các failure cluster cần đánh giá ở Step 6

1. OTP do SUT phát hành và label UI không tuân thủ 6 chữ số.
2. Validation error dùng browser native/`alert()`, không hiển thị trong trang
   phía trên submit.
3. Thiếu Step Indicator và control quay lại login đúng yêu cầu.
4. Thiếu confirm password, required marker và sai input type email.
5. Thiếu `<h1>`, nút reset sai màu và Tab order thiếu control confirm.

Các cluster trên là kết quả execution/candidate defect; Bug ID và GitHub Issue
được quyết định ở Step 6 sau human review, không gán trong file này.

## 6. Evidence và khả năng tái lập

- Machine-readable result: `evidence/A/execution/results.json`.
- Full Playwright trace: `evidence/A/execution/traces/A-FR03-full-run.zip`.
- Service log: `evidence/A/execution/service-logs.txt`.
- Automation source: `automation/A-FR03/`.
- Cleanup: password seed restored = `true`;
  reset token cleared = `true`.

## 7. Review record

- [x] Đã mở và đối chiếu screenshot của mọi case FAIL.
- [x] Đã mở shared blocker screenshot và xác nhận thiếu confirm field.
- [x] Đã đối chiếu actual result với `results.json`, trace và source liên quan.
- [x] Đã xác nhận classification `1 PASS / 8 FAIL / 29 BLOCKED` nhất quán.
- [x] Đã nhóm failure theo root cause trong `bugs/A-FR03_bug_report.md`.
- [x] Đã giữ nguyên expected result; không nâng case `BLOCKED` thành `FAIL`.

**Kết luận review:** Kết quả Step 5 đủ nhất quán để dùng làm đầu vào Step 6.
