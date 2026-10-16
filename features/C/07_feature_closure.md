# C-FR14 — Feature closure

## 1. Trạng thái chốt workflow

| Trường | Giá trị |
|---|---|
| Feature | `C-FR14` — Quản lý Danh mục trên Admin Web |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Người thực hiện | Nguyễn Phúc Hậu (`23120252`) |
| Trạng thái workflow | `APPROVED` |
| Trạng thái chất lượng SUT | `NOT ACCEPTED — 9 FAIL, 21 BLOCKED` |
| Trạng thái artifact | `REVIEWED` |

“Technically complete” chỉ có nghĩa chuỗi artifact Step 1–7 đã được tạo, thực
thi và truy vết trong phạm vi hiện tại. Nó không có nghĩa feature hoạt động đúng,
mọi requirement đã pass hoặc execution coverage đạt 100%.

## 2. Phạm vi và môi trường

- Phạm vi: FR-14 trên Admin Web, gồm Read/Create/Delete, access control, category
  name, ID/reference probes và GUI rule liên quan. Update vẫn là requirement gap.
- Oracle chính: `SHOP/README.md`; API contract: `SHOP/api_specification.md`.
- Lần chạy: 2026-10-13T22:55:04+07:00 đến 22:55:31+07:00.
- Admin/API: `127.0.0.1:5174` / `127.0.0.1:3000`; Chrome hệ thống; Node v22.15.1.
- Automation: Playwright tuần tự, reset SQLite fixture cô lập trước từng case.
- Source `SHOP` không bị sửa; runtime DB, service và `node_modules` không thuộc artifact commit.

## 3. Kỹ thuật đã áp dụng

- Equivalence Partitioning cho name presence/value, list state, ID, reference,
  authentication, role và UI conformance.
- Boundary Value Analysis cho missing/empty/one-character name, whitespace,
  candidate upper length, ID 0/existing/nonexistent và reference count.
- State/transition analysis cho nonexistent → created → updated → deleted; Update
  chỉ được ghi observation vì FR-14 chưa chốt expected behavior.
- Structural/UI checks cho safe rendering, empty state, required marker, error
  placement, heading, màu button, Tab order và ngôn ngữ.

## 4. Thống kê cuối cùng

| Chỉ số | Số lượng | Tỷ lệ trên 48 case |
|---|---:|---:|
| Designed / Attempted | 48 | 100% |
| Executed (`PASS + FAIL`) | 27 | 56.25% |
| Passed | 18 | 37.50% |
| Failed | 9 | 18.75% |
| Blocked | 21 | 43.75% |
| Not Run | 0 | 0% |

`18/27 = 66.67%` chỉ là tỷ lệ PASS trong các case có verdict, không phải chỉ số
khẳng định chất lượng feature vì 21 case chưa có business oracle đầy đủ.

## 5. Defect và gap

- 5 confirmed defect: `C-BUG-001`–`C-BUG-005`, bao phủ đủ 9 FAIL.
- `C-BUG-004` là Critical/P1: user thường có thể truy cập và mutation Category Admin.
- `C-BUG-002` là Major/P1: missing/empty category name được lưu vào database.
- 9 requirement gap: `C-GAP-R01`–`C-GAP-R09`.
- 3 additional implementation risk: `C-IG-01`–`C-IG-03`.
- 1 testability gap: `C-TG-01`, đã được runner giảm thiểu bằng runtime adapter.
- 6 blocked condition: `C-BC-01`–`C-BC-06`.

Chi tiết root cause và evidence nằm trong `bugs/C-FR14_bug_report.md` và
`features/C/06_ai_gap_analysis.md`.

## 6. Case BLOCKED và điều kiện chạy lại

| Nhóm case | Số lượng | Điều kiện để chạy regression |
|---|---:|---|
| `C-TC-010`–`013` | 4 | Chốt trim/whitespace, duplicate và case-sensitivity |
| `C-TC-017`–`020` | 4 | Chốt upper length, null/wrong-type và response contract |
| `C-TC-021`–`025` | 5 | Chốt Update thuộc phạm vi và expected behavior |
| `C-TC-027`–`031` | 5 | Chốt nonexistent/malformed ID contract |
| `C-TC-033`, `034` | 2 | Chốt referential policy khi Product tham chiếu Category |
| `C-TC-045` | 1 | Giữ N/A hoặc chỉ chạy lại nếu FR-23 mở rộng breadcrumb sang Admin Category |

## 7. Coverage summary

- Design coverage: `21/21` rule `C-R01`–`C-R21` có test case.
- Boundary catalog: `8/8` boundary `C-B01`–`C-B08` có liên kết test/probe.
- Execution coverage: `27/48 = 56.25%` case có verdict PASS/FAIL.
- Defect traceability: `5/5` Bug ID có test FAIL và evidence.
- Gap traceability: `9/9` requirement gap được ghi nhận; gap không áp dụng có lý do.
- Evidence completeness: 48 screenshot, 48 trace, một `results.json` và service log.

Không tuyên bố functional quality coverage hoặc boundary execution coverage 100%.

## 8. Residual risk và nội dung chưa kiểm chứng

Residual risk ở mức **cao**, trong đó authorization risk ở mức nghiêm trọng nhất:

- User thường có thể Create/Delete category bằng API và truy cập Admin shell bằng token restore.
- Missing/empty name có thể tạo record `NULL`/empty, làm giảm data integrity.
- Chưa xác nhận Update là requirement hay chỉ là API thừa.
- Chưa có verdict cho whitespace/trim, duplicate/case, maximum length và `null`.
- Chưa có verdict cho nonexistent/malformed ID hoặc referenced-category deletion.
- Actual cho referenced deletion tạo orphan, nhưng chưa được gọi bug vì policy chưa có.
- Chưa kiểm chứng browser khác, concurrency/race, transaction behavior hoặc dataset lớn.
- Testability vẫn phụ thuộc runtime adapter do port/DB/API URL hard-coded.

## 9. Danh sách artifact và evidence

- Step 1–7: `features/C/01_spec_and_oracle.md` đến `07_feature_closure.md`.
- Traceability: `features/C/07_traceability_matrix.md`.
- Bug report: `bugs/C-FR14_bug_report.md`.
- Automation: `automation/C-FR14/`.
- Machine result: `evidence/C/execution/results.json`.
- Screenshots/traces: `evidence/C/execution/screenshots/`, `traces/`.
- Service log: `evidence/C/execution/service-logs.txt`.
- Report: `report/latex/chapters/04_feature_c.tex` và các phần tổng hợp liên quan.

## 10. Kết luận feature

Workflow kiểm thử C-FR14 đã hoàn thành về mặt kỹ thuật trong phạm vi hiện tại:
oracle, domain model, EP/BVA, 48 test case, automation, execution evidence,
defect/gap analysis, traceability và report đều có artifact. Tuy nhiên feature
**không được kết luận hoạt động đúng** vì còn 9 FAIL và 21 BLOCKED. Chất lượng
SUT chưa được chấp nhận; cần sửa defect, chốt requirement gap và regression đầy đủ.
