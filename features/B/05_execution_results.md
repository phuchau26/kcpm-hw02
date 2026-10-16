# B-FR09 — Kết quả thực thi Step 5

## 1. Trạng thái

| Trường | Giá trị |
|---|---|
| Artifact | `features/B/05_execution_results.md` |
| Trạng thái | `REVIEWED — EVIDENCE CONSISTENCY VERIFIED` |
| Test case baseline | `04_test_cases.md` — đã review trước execution |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Bắt đầu | 2026-10-13T21:30:34+07:00 |
| Kết thúc | 2026-10-13T21:31:16+07:00 |
| Lệnh | `npm test` trong `automation/B-FR09` |
| Browser | System Chromium channel: C:\Program Files\Google\Chrome\Application\chrome.exe |
| SQLite fixture | `automation/B-FR09/runtime/b-fr09-fixture.sqlite` — runtime only, không commit |

## 2. Thống kê

| Designed | Attempted | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|---:|
| 41 | 41 | 31 | 17 | 14 | 10 | 0 |

Quy ước: `attempted = PASS + FAIL + BLOCKED`; `executed = PASS + FAIL`.

## 3. Kết quả từng test case

| Test ID | Verdict | Actual/reason tóm tắt | Evidence |
|---|---|---|---|
| `B-TC-001` | `FAIL` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-001.png) · [trace](../../evidence/B/execution/traces/B-TC-001.zip) |
| `B-TC-002` | `PASS` | Áp dụng thành công! Giảm 50,000 ₫ | [screenshot](../../evidence/B/execution/screenshots/B-TC-002.png) · [trace](../../evidence/B/execution/traces/B-TC-002.zip) |
| `B-TC-003` | `PASS` | Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa | [screenshot](../../evidence/B/execution/screenshots/B-TC-003.png) · [trace](../../evidence/B/execution/traces/B-TC-003.zip) |
| `B-TC-004` | `PASS` | Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa | [screenshot](../../evidence/B/execution/screenshots/B-TC-004.png) · [trace](../../evidence/B/execution/traces/B-TC-004.zip) |
| `B-TC-005` | `BLOCKED` | SRS chưa quy định business verdict cho empty/whitespace và UI không cho submit. | [screenshot](../../evidence/B/execution/screenshots/B-TC-005.png) · [trace](../../evidence/B/execution/traces/B-TC-005.zip) |
| `B-TC-006` | `BLOCKED` | SRS chưa quy định business verdict cho empty/whitespace và UI không cho submit. | [screenshot](../../evidence/B/execution/screenshots/B-TC-006.png) · [trace](../../evidence/B/execution/traces/B-TC-006.zip) |
| `B-TC-007` | `BLOCKED` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-007.png) · [trace](../../evidence/B/execution/traces/B-TC-007.zip) |
| `B-TC-008` | `BLOCKED` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-008.png) · [trace](../../evidence/B/execution/traces/B-TC-008.zip) |
| `B-TC-009` | `PASS` | Mã giảm giá đã hết hạn | [screenshot](../../evidence/B/execution/screenshots/B-TC-009.png) · [trace](../../evidence/B/execution/traces/B-TC-009.zip) |
| `B-TC-010` | `BLOCKED` | SUT không có clock injection và requirement chưa chốt timezone/granularity; không thể đánh giá E−δ/E/E+δ tin cậy. | [screenshot](../../evidence/B/execution/screenshots/B-TC-010.png) · [trace](../../evidence/B/execution/traces/B-TC-010.zip) |
| `B-TC-011` | `BLOCKED` | SUT không có clock injection và requirement chưa chốt timezone/granularity; không thể đánh giá E−δ/E/E+δ tin cậy. | [screenshot](../../evidence/B/execution/screenshots/B-TC-011.png) · [trace](../../evidence/B/execution/traces/B-TC-011.zip) |
| `B-TC-012` | `BLOCKED` | SUT không có clock injection và requirement chưa chốt timezone/granularity; không thể đánh giá E−δ/E/E+δ tin cậy. | [screenshot](../../evidence/B/execution/screenshots/B-TC-012.png) · [trace](../../evidence/B/execution/traces/B-TC-012.zip) |
| `B-TC-013` | `PASS` | Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này | [screenshot](../../evidence/B/execution/screenshots/B-TC-013.png) · [trace](../../evidence/B/execution/traces/B-TC-013.zip) |
| `B-TC-014` | `FAIL` | Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này | [screenshot](../../evidence/B/execution/screenshots/B-TC-014.png) · [trace](../../evidence/B/execution/traces/B-TC-014.zip) |
| `B-TC-015` | `PASS` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-015.png) · [trace](../../evidence/B/execution/traces/B-TC-015.zip) |
| `B-TC-016` | `FAIL` | Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này | [screenshot](../../evidence/B/execution/screenshots/B-TC-016.png) · [trace](../../evidence/B/execution/traces/B-TC-016.zip) |
| `B-TC-017` | `FAIL` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-017.png) · [trace](../../evidence/B/execution/traces/B-TC-017.zip) |
| `B-TC-018` | `FAIL` | Apply-coupon chấp nhận request không có/không hợp lệ/hết hạn auth. | [screenshot](../../evidence/B/execution/screenshots/B-TC-018.png) · [trace](../../evidence/B/execution/traces/B-TC-018.zip) |
| `B-TC-019` | `FAIL` | Apply-coupon chấp nhận request không có/không hợp lệ/hết hạn auth. | [screenshot](../../evidence/B/execution/screenshots/B-TC-019.png) · [trace](../../evidence/B/execution/traces/B-TC-019.zip) |
| `B-TC-020` | `FAIL` | Apply-coupon chấp nhận request không có/không hợp lệ/hết hạn auth. | [screenshot](../../evidence/B/execution/screenshots/B-TC-020.png) · [trace](../../evidence/B/execution/traces/B-TC-020.zip) |
| `B-TC-021` | `FAIL` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-021.png) · [trace](../../evidence/B/execution/traces/B-TC-021.zip) |
| `B-TC-022` | `FAIL` | Người chưa đăng nhập truy cập checkout và áp dụng coupon được. | [screenshot](../../evidence/B/execution/screenshots/B-TC-022.png) · [trace](../../evidence/B/execution/traces/B-TC-022.zip) |
| `B-TC-023` | `PASS` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-023.png) · [trace](../../evidence/B/execution/traces/B-TC-023.zip) |
| `B-TC-024` | `PASS` | Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn) | [screenshot](../../evidence/B/execution/screenshots/B-TC-024.png) · [trace](../../evidence/B/execution/traces/B-TC-024.zip) |
| `B-TC-025` | `PASS` | Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn) | [screenshot](../../evidence/B/execution/screenshots/B-TC-025.png) · [trace](../../evidence/B/execution/traces/B-TC-025.zip) |
| `B-TC-026` | `PASS` | Áp dụng thành công! Giảm 100,000 ₫ | [screenshot](../../evidence/B/execution/screenshots/B-TC-026.png) · [trace](../../evidence/B/execution/traces/B-TC-026.zip) |
| `B-TC-027` | `PASS` | Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn) | [screenshot](../../evidence/B/execution/screenshots/B-TC-027.png) · [trace](../../evidence/B/execution/traces/B-TC-027.zip) |
| `B-TC-028` | `PASS` | Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn) | [screenshot](../../evidence/B/execution/screenshots/B-TC-028.png) · [trace](../../evidence/B/execution/traces/B-TC-028.zip) |
| `B-TC-029` | `PASS` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/B/execution/screenshots/B-TC-029.png) · [trace](../../evidence/B/execution/traces/B-TC-029.zip) |
| `B-TC-030` | `FAIL` | Áp dụng thành công! Giảm 1% | [screenshot](../../evidence/B/execution/screenshots/B-TC-030.png) · [trace](../../evidence/B/execution/traces/B-TC-030.zip) |
| `B-TC-031` | `PASS` | Áp dụng thành công! Giảm 1 ₫ | [screenshot](../../evidence/B/execution/screenshots/B-TC-031.png) · [trace](../../evidence/B/execution/traces/B-TC-031.zip) |
| `B-TC-032` | `BLOCKED` | SRS không quy định integer rounding cho fractional VND; actual được ghi nhưng không có rounding oracle. | [screenshot](../../evidence/B/execution/screenshots/B-TC-032.png) · [trace](../../evidence/B/execution/traces/B-TC-032.zip) |
| `B-TC-033` | `BLOCKED` | SRS không quy định percent maximum/cap/reject. | [screenshot](../../evidence/B/execution/screenshots/B-TC-033.png) · [trace](../../evidence/B/execution/traces/B-TC-033.zip) |
| `B-TC-034` | `BLOCKED` | SRS không quy định cap/floor khi fixed discount lớn hơn total. | [screenshot](../../evidence/B/execution/screenshots/B-TC-034.png) · [trace](../../evidence/B/execution/traces/B-TC-034.zip) |
| `B-TC-035` | `PASS` | Áp dụng thành công! Giảm 50,000 ₫ | [screenshot](../../evidence/B/execution/screenshots/B-TC-035.png) · [trace](../../evidence/B/execution/traces/B-TC-035.zip) |
| `B-TC-036` | `FAIL` | Checkout thiếu đúng một h1 và/hoặc breadcrumb. | [screenshot](../../evidence/B/execution/screenshots/B-TC-036.png) · [trace](../../evidence/B/execution/traces/B-TC-036.zip) |
| `B-TC-037` | `FAIL` | Positive action không dùng màu xanh dương. | [screenshot](../../evidence/B/execution/screenshots/B-TC-037.png) · [trace](../../evidence/B/execution/traces/B-TC-037.zip) |
| `B-TC-038` | `PASS` |  | [screenshot](../../evidence/B/execution/screenshots/B-TC-038.png) · [trace](../../evidence/B/execution/traces/B-TC-038.zip) |
| `B-TC-039` | `FAIL` | Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa | [screenshot](../../evidence/B/execution/screenshots/B-TC-039.png) · [trace](../../evidence/B/execution/traces/B-TC-039.zip) |
| `B-TC-040` | `PASS` | Áp dụng thành công! Giảm 1 ₫ | [screenshot](../../evidence/B/execution/screenshots/B-TC-040.png) · [trace](../../evidence/B/execution/traces/B-TC-040.zip) |
| `B-TC-041` | `FAIL` | Đơn hàng chưa đủ giá trị tối thiểu 1 ₫ để áp dụng mã này | [screenshot](../../evidence/B/execution/screenshots/B-TC-041.png) · [trace](../../evidence/B/execution/traces/B-TC-041.zip) |

Chi tiết expected, actual có cấu trúc, thời lượng và timestamp nằm trong
`evidence/B/execution/results.json`.

## 4. Supporting precondition check

Các check này xác nhận unique constraint và fixture gate; không tính vào 41 Web test case.

| Check ID | Verdict | Actual |
|---|---|---|
| `B-PC-01` | `PASS` | `{"duplicateRejected":true}` |
| `B-PC-02` | `PASS` | `{"acceptedByFixture":false}` |
| `B-PC-03` | `PASS` | `{"acceptedByFixture":false}` |
| `B-PC-04` | `PASS` | `{"acceptedByFixture":false}` |
| `B-PC-05` | `PASS` | `{"acceptedByFixture":false}` |
| `B-PC-06` | `PASS` | `{"acceptedByFixture":false}` |
| `B-PC-07` | `PASS` | `{"acceptedByFixture":false}` |
| `B-PC-08` | `PASS` | `{"acceptedByFixture":false}` |
| `B-PC-09` | `PASS` | `{"acceptedByFixture":false}` |

## 5. Blocked condition

- `B-TC-005`–`B-TC-008`: thiếu oracle cho empty/whitespace/case/trim normalization.
- `B-TC-010`–`B-TC-012`: không có controlled clock và chưa chốt timezone/granularity.
- `B-TC-032`–`B-TC-034`: thiếu oracle rounding, maximum/cap và final floor.

Các case BLOCKED có screenshot/trace chẩn đoán nhưng không được ghi thành defect
chỉ dựa trên trạng thái BLOCKED.

## 6. Tính cô lập và khả năng tái hiện

- Runner sao chép read-only `SHOP/backend/server.js` vào runtime và nạp database
  adapter trỏ đến SQLite riêng; không sửa source hoặc runtime database của SHOP.
- Mỗi case reset fixture, coupon usage và test data trước khi chạy.
- Runner chỉ dùng port trống và chỉ dừng process do chính nó tạo.
- Service log: `evidence/B/execution/service-logs.txt`.
- Machine-readable result: `evidence/B/execution/results.json`.
