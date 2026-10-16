# D-M09 — Feature closure

## 1. Trạng thái chốt workflow

| Trường | Giá trị |
|---|---|
| Feature | `D-M09` — Discount Coupon trên Mobile checkout |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Người thực hiện | Nguyễn Phúc Hậu (`23120252`) |
| Trạng thái workflow | `APPROVED` |
| Trạng thái chất lượng SUT | `NOT ACCEPTED — 11 FAIL, 20 BLOCKED; LIMITED PHYSICAL iOS SUPPLEMENT` |
| Trạng thái artifact | `PENDING HUMAN REVIEW — NATIVE iOS SUPPLEMENT` |

“Technically complete” chỉ có nghĩa chuỗi artifact Step 1–7 đã được tạo và truy
vết trong phạm vi hiện tại. Nó không có nghĩa Mobile feature hoạt động đúng,
không có nghĩa native coverage đạt được và không thay thế regression.

## 2. Phạm vi, baseline và môi trường

- Phạm vi: Discount Coupon tại Mobile checkout; C1–C5, percent/fixed formula,
  trusted total, authentication/identity/usage và GUI rule liên quan.
- Oracle chính: `SHOP/README.md`; API contract: `SHOP/api_specification.md`.
- Lần chạy: 2026-10-15T19:32:01+07:00 đến 19:32:59+07:00.
- Nền tảng: Expo Web tại `127.0.0.1:8081`, Backend `127.0.0.1:3000`, Chromium
  hệ thống, viewport `440 × 956`, Windows x64, Node.js v22.15.1.
- Thiết bị lần chạy chuẩn: không dùng Android/iOS emulator hoặc thiết bị thật;
  viewport Mobile trên browser không được xem là native evidence.
- Evidence bổ sung: 9 screenshot trên thiết bị iOS thật qua Expo Go/Expo SDK 57,
  chụp ngày 2026-10-16 khoảng 09:25–09:29. Model thiết bị và phiên bản iOS chưa
  được ghi nhận; endpoint API dùng qua LAN. Đây là baseline deviation nên không
  thay thế kết quả chuẩn.
- Automation: Playwright tuần tự, API probe và SQLite fixture cô lập.
- Source `SHOP` và `backend/database.sqlite` không bị runner sửa.

## 3. Kỹ thuật đã áp dụng

- Equivalence Partitioning cho coupon code/state, auth, transport, type,
  arithmetic, UI output và platform.
- BVA cho order minimum, expiry, usage count/limit và positive discount value.
- Trust-boundary testing cho client total, JWT identity và checkout final amount.
- State-transition probe cho idle/loading/success/error và edit-after-result.
- UI conformance cho money format, tiếng Việt, positive-action color và error placement.
- Environment partition tách Expo Web khỏi native Android/iOS.

## 4. Thống kê cuối cùng

| Chỉ số | Số lượng | Tỷ lệ trên 50 case |
|---|---:|---:|
| Designed / Attempted | 50 | 100% |
| Executed (`PASS + FAIL`) | 30 | 60.00% |
| Passed | 19 | 38.00% |
| Failed | 11 | 22.00% |
| Blocked | 20 | 40.00% |
| Not Run | 0 | 0% |

`19/30 = 63.33%` là tỷ lệ PASS trong case có verdict, không chứng minh feature
đạt chất lượng vì còn 11 FAIL, 20 BLOCKED và native coverage mới chỉ là evidence bổ sung.

## 5. Defect và gap

- 7 confirmed root-cause group bao phủ đủ 11 FAIL.
- 5 lỗi Backend dùng chung dẫn canonical record `B-BUG-001`–`B-BUG-005`; không
  tạo bản sao lỗi Backend cho Pool D.
- 2 defect riêng Mobile: `D-BUG-001` sai màu positive action và `D-BUG-002`
  validation error nằm dưới Apply.
- 11 requirement gap: `D-GAP-R01`–`D-GAP-R11`.
- 4 implementation risk: `D-IG-01`–`D-IG-04`.
- 2 Mobile/environment gap: `D-MG-01`, `D-MG-02`.
- 2 testability gap: `D-TG-01`, `D-TG-02`.
- 6 blocked condition: `D-BC-01`–`D-BC-06`.

Chi tiết nằm tại `bugs/D-M09_bug_report.md` và
`features/D/06_ai_gap_analysis.md`.

## 6. Case BLOCKED và điều kiện chạy lại

| Nhóm case | Số lượng | Điều kiện để chạy regression |
|---|---:|---|
| `D-TC-003`–`006` | 4 | Chốt empty/whitespace/trim/case normalization và disabled behavior |
| `D-TC-013`–`015` | 3 | Chốt timezone/granularity và cung cấp controlled clock |
| `D-TC-033`–`035` | 3 | Chốt rounding, percent maximum, fixed cap và final floor |
| `D-TC-036`–`039` | 4 | Chốt loading/double-tap/reset-on-edit contract |
| `D-TC-041`–`043` | 3 | Chốt network/retry/offline/malformed-response behavior |
| `D-TC-048`–`050` | 3 | Chốt device matrix và chạy native viewport/keyboard/accessibility |

## 7. Coverage summary

- Design coverage: `20/20` rule `D-R01`–`D-R20` có test case.
- Boundary catalog: `6/6` `D-B01`–`D-B06` có test hoặc fixture check.
- Execution coverage: `30/50 = 60.00%` case có verdict PASS/FAIL.
- Defect traceability: `7/7` root-cause group có FAIL và Mobile evidence.
- Gap traceability: `11/11` requirement gap được ghi nhận.
- Evidence completeness: 50 screenshot, 50 Playwright trace, `results.json`,
  service log và 9 screenshot iOS thật; không có native video/trace.

Không tuyên bố functional quality coverage, boundary execution coverage hoặc
native platform coverage là 100%.

## 8. Residual risk và nội dung chưa kiểm chứng

Residual risk ở mức **rất cao** vì có lỗi financial và trust-boundary:

- Percent formula tạo discount âm và làm final tăng mạnh.
- Backend tin total client tại apply/checkout; authoritative pricing không được bảo đảm.
- Apply coupon thiếu authentication; `user_id` body có thể bypass usage identity.
- Equality tại minimum bị từ chối sai.
- Positive-action color và validation placement không đạt GUI rule trên Expo Web.
- Chưa kiểm chứng exact expiry boundary, normalization, rounding/cap/floor,
  loading/reset state, retry/offline và usage atomicity/rollback.
- Đã quan sát layout và soft keyboard trên một thiết bị iOS thật, nhưng chưa kiểm
  chứng Android, orientation, screen reader, native focus/semantics hoặc performance.
- Kết nối LAN hoạt động ở lần iOS bổ sung; baseline chuẩn và cấu hình mới khác nhau,
  nên vẫn cần kiểm tra endpoint theo từng environment.
- Chưa kiểm chứng concurrency, duplicate checkout/usage request hoặc mạng di động thực.

## 9. Danh sách artifact và evidence

- Step 1–7: `features/D/01_spec_and_oracle.md` đến `07_feature_closure.md`.
- Traceability: `features/D/07_traceability_matrix.md`.
- Bug report: `bugs/D-M09_bug_report.md`.
- Automation: `automation/D-M09/`.
- Machine result: `evidence/D/execution/results.json`.
- Screenshots/traces: `evidence/D/execution/screenshots/`, `traces/`.
- Service log: `evidence/D/execution/service-logs.txt`.
- Native iOS screenshots: `evidence/D/native-ios/screenshots/`.
- Smoke evidence: `evidence/D/smoke/D-M09-SMOKE-001-mobile-coupon.png`.
- Report: `report/latex/chapters/05_feature_d.tex` và các phần tổng hợp liên quan.

## 10. Kết luận feature

Workflow kiểm thử D-M09 đã hoàn thành về mặt kỹ thuật với baseline Expo Web và
một bộ evidence bổ sung giới hạn trên thiết bị iOS thật:
oracle, domain model, EP/BVA, 50 test case, automation, execution evidence,
defect/gap analysis, traceability và report đều có artifact. Tuy nhiên feature
**không được kết luận hoạt động đúng** vì còn 11 FAIL, 20 BLOCKED; chưa có Android,
native accessibility hoặc native automation evidence. Chất lượng SUT chưa được
chấp nhận; cần sửa defect, chốt gap và chạy regression đa nền tảng.
