# B-FR09 — Feature closure

## 1. Trạng thái chốt workflow

| Trường | Giá trị |
|---|---|
| Feature | `B-FR09` — Discount Coupon trên Web checkout |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Người thực hiện | Nguyễn Phúc Hậu (`23120252`) |
| Trạng thái workflow | `APPROVED` |
| Trạng thái chất lượng SUT | `NOT ACCEPTED — 14 FAIL, 10 BLOCKED` |
| Trạng thái artifact | `REVIEWED` |

“Technically complete” chỉ có nghĩa chuỗi artifact Step 1–7 đã được tạo và truy
vết trong phạm vi hiện tại. Nó không có nghĩa feature hoạt động đúng hoặc
functional execution coverage đạt 100%.

## 2. Phạm vi và môi trường

- Phạm vi: FR-09 Discount Coupon trên Web checkout; năm điều kiện C1–C5, percent/fixed
  formula, trusted total, authentication/identity/usage và GUI rule liên quan.
- Oracle chính: `SHOP/README.md`; API contract: `SHOP/api_specification.md`.
- Lần chạy: 2026-10-13T21:30:34+07:00 đến 21:31:16+07:00.
- Web/API: `127.0.0.1:5173` / `127.0.0.1:3000`; Chrome hệ thống; Node v22.15.1.
- Automation: Playwright tuần tự với SQLite fixture cô lập.
- Source `SHOP` không bị sửa để ép test pass.

## 3. Kỹ thuật đã áp dụng

- Equivalence Partitioning cho code/active, expiry, threshold, auth, identity,
  usage, coupon type, arithmetic output và UI conformance.
- Robust BVA cho order threshold, usage count, expiry, positive discount,
  minimum-order config và usage-limit config.
- Trust-boundary testing cho client-supplied total và `user_id` so với server/JWT.
- Relational testing cho cặp user–coupon và usage limit.
- Structural/UI checks cho money format, `h1`, breadcrumb, color, Tab order và error placement.

## 4. Thống kê cuối cùng

| Chỉ số | Số lượng | Tỷ lệ trên 41 case |
|---|---:|---:|
| Designed / Attempted | 41 | 100% |
| Executed (`PASS + FAIL`) | 31 | 75.61% |
| Passed | 17 | 41.46% |
| Failed | 14 | 34.15% |
| Blocked | 10 | 24.39% |
| Not Run | 0 | 0% |

`17/31 = 54.84%` chỉ là tỷ lệ PASS trong case có verdict, không chứng minh chất
lượng tổng thể khi còn 14 FAIL và 10 case thiếu oracle/capability.

## 5. Defect và gap

- 9 confirmed defect: `B-BUG-001`–`B-BUG-009`, bao phủ đủ 14 FAIL.
- Critical/P1: sai công thức percent, tin total client và tin body `user_id`.
- High/P1: apply không yêu cầu auth và checkout/coupon UI không protected.
- 7 requirement gap: `B-GAP-R01`–`B-GAP-R07`.
- 2 additional implementation risk: `B-IG-01`, `B-IG-02`.
- 1 testability gap: `B-TG-01` — không có injectable clock.
- 3 blocked condition: `B-BC-01`–`B-BC-03`.

Chi tiết nằm trong `bugs/B-FR09_bug_report.md` và
`features/B/06_ai_gap_analysis.md`.

## 6. Case BLOCKED và điều kiện chạy lại

| Nhóm case | Số lượng | Điều kiện để chạy regression |
|---|---:|---|
| `B-TC-005`–`008` | 4 | Chốt empty/trim/case/normalization contract |
| `B-TC-010`–`012` | 3 | Chốt timezone/granularity/equality và cung cấp controlled clock |
| `B-TC-032`–`034` | 3 | Chốt rounding, percent cap, fixed cap và final floor |

## 7. Coverage summary

- Design coverage: `19/19` rule `B-R01`–`B-R19` có test case.
- Boundary catalog: `8/8` `B-B01`–`B-B08` được liên kết; `B-B07/08` là gap boundary.
- Supporting data coverage: `B-PC-01`–`B-PC-09` tách khỏi 41 application case.
- Execution coverage: `31/41 = 75.61%` case có verdict PASS/FAIL.
- Defect traceability: `9/9` Bug ID có FAIL và evidence.
- Evidence completeness: 41 screenshot, 41 trace, `results.json` và service log.

Không tuyên bố functional quality coverage hoặc boundary execution coverage 100%.

## 8. Residual risk và nội dung chưa kiểm chứng

Residual risk ở mức **rất cao** vì có lỗi tài chính và trust-boundary:

- Percent formula có thể tạo discount âm và làm final tăng mạnh.
- Backend tin total do client gửi, cho phép sai lệch pricing/threshold.
- Apply coupon thiếu authentication; identity usage có thể bị giả bằng body `user_id`.
- Checkout/coupon UI truy cập được khi chưa đăng nhập.
- Minimum equality bị từ chối sai.
- Chưa kiểm chứng exact expiry boundary, normalization, rounding và cap/floor.
- Usage eligibility PASS không chứng minh increment atomic/idempotent hoặc rollback khi checkout lỗi.
- Chưa kiểm chứng concurrency, duplicate request, browser khác hoặc Mobile.

## 9. Danh sách artifact và evidence

- Step 1–7: `features/B/01_spec_and_oracle.md` đến `07_feature_closure.md`.
- Traceability: `features/B/07_traceability_matrix.md`.
- Bug report: `bugs/B-FR09_bug_report.md`.
- Automation: `automation/B-FR09/`.
- Machine result: `evidence/B/execution/results.json`.
- Screenshots/traces: `evidence/B/execution/screenshots/`, `traces/`.
- Service log: `evidence/B/execution/service-logs.txt`.
- Report: `report/latex/chapters/03_feature_b.tex` và các phần tổng hợp liên quan.

## 10. Kết luận feature

Workflow kiểm thử B-FR09 đã hoàn thành về mặt kỹ thuật trong phạm vi hiện tại:
oracle, domain model, EP/BVA, 41 test case, automation, execution evidence,
defect/gap analysis, traceability và report đều có artifact. Tuy nhiên feature
**không được kết luận hoạt động đúng** vì còn 14 FAIL và 10 BLOCKED. Chất lượng
SUT chưa được chấp nhận; cần sửa defect, chốt requirement gap và regression.
