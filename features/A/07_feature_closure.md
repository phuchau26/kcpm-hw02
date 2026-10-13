# A-FR03 — Feature closure

## 1. Trạng thái chốt kỹ thuật

| Trường | Giá trị |
|---|---|
| Feature | `A-FR03` — Quên mật khẩu và đặt lại mật khẩu |
| Nền tảng | Web |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Người thực hiện | Nguyễn Phúc Hậu (`23120252`) |
| Trạng thái workflow | `APPROVED` |
| Trạng thái chất lượng SUT | `NOT FULLY VERIFIED — 29 TEST CASES BLOCKED` |
| Căn cứ sign-off | Artifact Step 1–7, execution result và evidence đã được đối chiếu nhất quán |

“Technically complete” nghĩa là đã hoàn thành chuỗi artifact Step 1–7 trong phạm
vi và bằng chứng hiện có. Nó không có nghĩa feature chạy đúng, mọi requirement
đã pass hoặc execution coverage đạt 100%.

## 2. Phạm vi và môi trường

- Phạm vi: FR-03 Web, gồm yêu cầu OTP, reset password, OTP lifecycle, password
  policy, confirm password và GUI rule liên quan.
- Oracle chính: `SHOP/README.md`; API contract: `SHOP/api_specification.md`.
- Lần chạy: 2026-10-12T21:33:42+07:00 đến 21:33:55+07:00.
- Web/API: `127.0.0.1:5173` / `127.0.0.1:3000`; Chrome hệ thống.
- Automation: Playwright tuần tự với SQLite fixture; fixture đã khôi phục seed
  password và xóa reset token sau lần chạy.
- Source SHOP chỉ được đọc ở Step 6–7; không được sửa để ép test pass.

## 3. Kỹ thuật đã áp dụng

- Equivalence Partitioning cho email syntax/membership, OTP format/value,
  binding/lifecycle, password composition và confirm relationship.
- Boundary Value Analysis cho OTP length, password minimum length, minimum count
  của bốn nhóm ký tự và equality boundary password–confirm.
- State/transition analysis bổ trợ cho OTP chưa phát hành, expired và consumed.
- Structural/UI checks cho semantic heading, input type, marker, inline error,
  step indicator, màu positive action và Tab order.

`A-B08` không thể định lượng vì thiếu OTP lifetime; `A-B09` và `A-B10` không tạo
boundary vì SRS không quy định email length/password max.

## 4. Thống kê cuối cùng

| Chỉ số | Số lượng | Tỷ lệ trên 38 case |
|---|---:|---:|
| Designed | 38 | 100% |
| Executed | 9 | 23.68% |
| Passed | 1 | 2.63% |
| Failed | 8 | 21.05% |
| Blocked | 29 | 76.32% |
| Not Run | 0 | 0% |

Tỷ lệ trên chỉ mô tả trạng thái suite. Không dùng `1/9` hay `1/38` làm chỉ số
chất lượng tổng quát khi phần lớn luồng reset chưa executable.

## 5. Defect và gap

- 8 confirmed defect: `A-BUG-001`–`A-BUG-008`.
- Hai defect Major/High cần ưu tiên: OTP chỉ 4 chữ số (`A-BUG-001`) và thiếu
  confirm password (`A-BUG-006`).
- 1 requirement gap: `A-GAP-RQ01` — chưa có duration/inclusive rule của expiry.
- 4 implementation gap bổ sung: `A-GAP-IM01`–`A-GAP-IM04`.
- 1 testability gap: `A-GAP-TS01` — không thể thiết lập `CONFIRM_VALID` trên UI.
- 2 blocked condition: thiếu confirm control; expiry thiếu rule/state/fixture.

Chi tiết root cause, severity/priority và evidence nằm trong
`bugs/A-FR03_bug_report.md` và `features/A/06_ai_gap_analysis.md`.

## 6. Case BLOCKED và điều kiện chạy lại

| Nhóm case | Số lượng | Điều kiện để chạy regression |
|---|---:|---|
| `A-TC-005`–`013`, `015`–`033` | 28 | Bổ sung confirm password control và equality validation đúng SRS; không bỏ bước confirm trong procedure |
| `A-TC-014` | 1 | Điều kiện trên, cộng OTP lifetime chính thức, expiry state/check và fixture tạo token expired |

Sau khi khắc phục, phải chạy lại đủ 29 case qua Web end-to-end; API-only test có
thể bổ trợ nhưng không thay thế procedure đã thiết kế.

## 7. Coverage summary

- Design coverage: `14/14` business/UI rule `A-R01`–`A-R14` có test case.
- Test case execution coverage: `9/38 = 23.68%`.
- Boundary catalog: đủ trạng thái cho `A-B01`–`A-B10`; phần lớn điểm `A-B01`–`08`
  chưa được thực thi do blocker; `A-B09/10` không có boundary được đặc tả.
- Defect traceability: đủ `8/8` Bug ID tới test case FAIL và evidence.
- Gap traceability: requirement, implementation, testability gap đều có nguồn
  và test case bị ảnh hưởng.

Không tuyên bố functional coverage hoặc boundary execution coverage 100%.

## 8. Residual risk và nội dung chưa kiểm chứng

Residual risk ở mức **cao** vì luồng reset password chính chưa có một case end-to-end
thành công theo SRS. Chưa kiểm chứng qua execution:

- Reset nominal, OTP format/value/binding, one-time use và expired behavior.
- Toàn bộ boundary password policy và confirm equality.
- Password không lưu plaintext và đăng nhập bằng password mới.
- Backend thực thi password policy khi bỏ qua client validation.
- Entropy/phân phối ngẫu nhiên của OTP; một lần chạy chỉ chứng minh length sai.
- OTP lifetime cụ thể, email/password maximum length vì SRS không cung cấp.
- Hành vi trên browser/version khác hoặc Mobile; phạm vi A chỉ là Web.

## 9. Danh sách artifact và evidence

- Step 1–7: `features/A/01_spec_and_oracle.md` đến
  `features/A/07_feature_closure.md`.
- Traceability tổng thể: `features/A/07_traceability_matrix.md`.
- Bug report: `bugs/A-FR03_bug_report.md`.
- Automation: `automation/A-FR03/`.
- Machine result: `evidence/A/execution/results.json`.
- Screenshots: `evidence/A/execution/screenshots/`.
- Full trace: `evidence/A/execution/traces/A-FR03-full-run.zip`.
- Service log: `evidence/A/execution/service-logs.txt`.
- Report: `report/latex/chapters/02_feature_a.tex`, chapter AI gap và Bug Report.

## 10. Kết luận feature

Workflow kiểm thử A-FR03 trong phạm vi hiện tại đã hoàn thành về mặt kỹ thuật:
oracle, domain model, BVA, 38 test case, automation, execution record, defect/gap
analysis, traceability và report content đều có artifact. Tuy nhiên chất lượng
SUT **chưa được xác nhận đầy đủ** vì 29/38 case bị chặn. Feature không được kết
luận “Pass” và cần regression sau khi bổ sung confirm password và OTP expiry.

## 11. Human sign-off

- [x] Xác nhận ma trận có đủ 38 case, 14 rule, 10 boundary và 8 Bug ID.
- [x] Xác nhận thống kê `38/9/1/8/29/0` không bị thay đổi.
- [x] Xác nhận residual risk và danh sách chưa kiểm chứng là đầy đủ.
- [x] Xác nhận nội dung báo cáo/ảnh evidence phản ánh đúng artifact nguồn.
- [x] Xác nhận artifact Step 5–7 nhất quán với execution result và evidence.
- [x] Chốt closure và chuẩn bị commit Step 5–7.
