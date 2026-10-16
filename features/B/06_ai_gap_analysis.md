# B-FR09 — Gap analysis
## 1. Thông tin tài liệu

| Trường | Giá trị |
|---|---|
| Feature | `B-FR09` — Discount Coupon trên Web checkout |
| Nguồn oracle | `01_spec_and_oracle.md`–`04_test_cases.md` |
| Nguồn thực thi | `05_execution_results.md`, `evidence/B/execution/results.json` và toàn bộ screenshot/trace/service log |
| Source review | Read-only tại baseline `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Thống kê | 17 PASS; 14 FAIL; 10 BLOCKED; 0 NOT RUN |
| Defect | 9 confirmed defect, bao phủ đủ 14 FAIL |
| Requirement gap | 7 (`B-GAP-R01`–`B-GAP-R07`) |
| Additional implementation risk | 2, chưa nâng thành defect |
| Testability gap | 1 |
| Blocked condition | 3 nhóm, ảnh hưởng 10 case |
| Trạng thái | `REVIEWED` |

## 2. Nguyên tắc phân loại

- **Confirmed defect**: actual khác oracle có căn cứ và có evidence tái hiện.
- **Requirement gap**: SRS/API không đủ để xác định expected result cụ thể.
- **Implementation gap/risk**: source có điểm thiếu hoặc không nhất quán nhưng
  chưa đủ oracle/evidence để kết luận defect độc lập.
- **Testability gap**: thiếu control/observability để đánh giá oracle tin cậy.
- **Blocked condition**: điều kiện cụ thể ngăn case nhận PASS/FAIL.

Không dùng behavior hiện tại làm oracle và không biến case BLOCKED thành bug.

## 3. Confirmed defect — implementation khác oracle

| Defect | Oracle | Root cause có căn cứ | Test case | Ảnh hưởng |
|---|---|---|---|---|
| `B-BUG-001` | `B-R12`, `B-R14` | `server.js:400,420` dùng `total × (1 − value)` | `B-TC-001`, `030` | Discount âm/sai; final tăng hoặc không giảm |
| `B-BUG-002` | `B-R05` | `server.js:379` dùng `>` thay vì `>=` | `B-TC-014`, `041` | Từ chối đúng tại minimum |
| `B-BUG-003` | `B-R15` | UI cho sửa total; API tin body total | `B-TC-016`, `017` | Pricing/threshold có thể bị thao túng |
| `B-BUG-004` | `B-R08` | `/api/apply-coupon` thiếu `authenticateToken` | `B-TC-018`–`020` | Missing/invalid/expired token vẫn apply được |
| `B-BUG-005` | `B-R07`, `B-R10` | Usage query dùng `user_id` client | `B-TC-021` | Bypass per-user limit |
| `B-BUG-006` | `B-R08`, FR-08 | `/checkout` không protected; apply không guard user | `B-TC-022` | Unauthenticated UI flow truy cập được |
| `B-BUG-007` | `B-R17` | Checkout dùng `h2`, không breadcrumb | `B-TC-036` | Semantic/navigation không đạt GUI rule |
| `B-BUG-008` | `B-R18` | Apply orange, checkout green | `B-TC-037` | Positive-action color không đạt GUI rule |
| `B-BUG-009` | `B-R19` | Error render sau action block | `B-TC-039` | Validation placement không đạt GUI rule |

Chi tiết reproduction, severity, priority và evidence nằm tại
`bugs/B-FR09_bug_report.md`.

## 4. Requirement gap

| Gap | Nội dung chưa được quy định | Case bị ảnh hưởng | Quan sát thực tế | Phân loại/kết luận |
|---|---|---|---|---|
| `B-GAP-R01` | Trim, case-folding và code length | `B-TC-006`–`008` | Web trim + uppercase trước API; API lookup exact | Requirement gap; không Pass/Fail normalization |
| `B-GAP-R02` | Rounding fractional VND | `B-TC-015`, `032` | `015` chỉ assert acceptance; `032` ghi actual | Requirement gap; cần rounding policy |
| `B-GAP-R03` | Percent maximum, fixed cap, final floor | `B-TC-033`, `034` | Percent 101 và fixed > total tạo output bất thường | Requirement gap; chưa xác nhận defect vì thiếu cap/floor oracle |
| `B-GAP-R04` | Timezone, clock granularity, exact expiry instant | `B-TC-010`–`012` | Không chạy comparison tại `E±δ` | Requirement + testability gap |
| `B-GAP-R05` | Exact error status/message | Mọi reject case | Chỉ assert accept/reject, không ép exact text/status | Không làm mất verdict business-level |
| `B-GAP-R06` | Thời điểm/transaction tăng usage | `B-TC-023`–`029` | Usage fixture kiểm tra eligibility; không assert lifecycle increment | Requirement gap; cần chốt apply hay checkout |
| `B-GAP-R07` | Apply-empty behavior | `B-TC-005`, `006` | Button disabled khi trim rỗng | Requirement gap; không có business verdict |

### Đề xuất xử lý requirement gap

1. Chốt normalization contract ở cả Web/API: trim, case sensitivity và length.
2. Chốt currency rounding mode và unit.
3. Chốt discount maximum/cap/final floor.
4. Chốt timezone, precision và equality semantics của expiry.
5. Chốt thời điểm usage được ghi, tính atomic và rollback khi checkout lỗi.
6. Chốt response contract tối thiểu nếu cần kiểm tra status/message chính xác.

Không sửa source trước khi các rule trên được owner xác nhận.

## 5. Additional implementation gap/risk chưa phải confirmed defect

| ID | Source/quan sát | Lý do chưa gọi defect | Case liên quan | Đề xuất |
|---|---|---|---|---|
| `B-IG-01` | Web normalize code tại `Checkout.jsx:29`, còn Backend query exact tại `server.js:370` | SRS chưa quy định normalization và API-client consistency | `B-TC-006`–`008` | Sau khi chốt `B-GAP-R01`, normalize tại trusted boundary và test cả Web/API |
| `B-IG-02` | Usage chỉ được ghi bởi request riêng sau checkout (`Checkout.jsx:45–59`; `server.js:443–451`) | SRS chưa chốt lifecycle/transaction, Step 5 chỉ kiểm tra eligibility | `B-TC-023`–`029`; `B-GAP-R06` | Chốt event rồi kiểm tra atomicity, duplicate request và failed checkout |

Hai risk này không được cộng vào 9 confirmed defect.

## 6. Testability gap

| ID | Gap | Case | Evidence/ảnh hưởng | Điều kiện để khắc phục |
|---|---|---|---|---|
| `B-TG-01` | SUT gọi trực tiếp `new Date()` (`server.js:380`) và không có clock injection; timezone/granularity chưa công bố | `B-TC-010`–`012` | Không thể đặt chính xác `E−δ/E/E+δ` trong cùng time model; ba case BLOCKED | Injectable clock hoặc fake-time-compatible service, cộng contract timezone/precision |

SQLite fixture và service orchestration đã cô lập được data/process; đây không còn
là blocked condition. Log có noise từ browser policy/extension nhưng không làm
mất request/response hay verdict của case nào.

## 7. Blocked condition

| ID | Điều kiện thiếu | Case | Vì sao không thể verdict | Điều kiện rerun |
|---|---|---|---|---|
| `B-BC-01` | Oracle code normalization/empty behavior | `B-TC-005`–`008` | Actual quan sát được nhưng không có expected business behavior | Owner chốt `B-GAP-R01`, `B-GAP-R07` |
| `B-BC-02` | Controlled clock + time contract | `B-TC-010`–`012` | Không thể đánh giá đúng ba điểm sát expiry | Khắc phục `B-TG-01`, chốt `B-GAP-R04` |
| `B-BC-03` | Rounding/cap/floor oracle | `B-TC-032`–`034` | Không có tiêu chí Pass/Fail cho output cực trị | Owner chốt `B-GAP-R02`, `B-GAP-R03` |

Tổng `4 + 3 + 3 = 10` case BLOCKED. Không case nào trong ba nhóm được ghi
thành confirmed defect chỉ dựa vào actual bất thường.

## 8. Layer gap: requirement → UI → backend → database → testability

| Layer | Khoảng cách chính | Defect/gap | Ảnh hưởng |
|---|---|---|---|
| Requirement | Thiếu normalization, rounding, cap/floor, time model, usage lifecycle | `B-GAP-R01`–`R07` | 10 case BLOCKED; một số negative/extreme output chưa có verdict |
| UI | Editable total, unprotected checkout, sai semantic/color/error placement | `BUG-003`, `006`–`009` | Pricing integrity, access flow và GUI conformance |
| Backend | Sai percent formula, sai equality, thiếu auth, tin body identity/total | `BUG-001`–`005` | Financial và usage-limit risk cao |
| Database | Schema chỉ enforce unique code; không có CHECK cho type/value/min/limit | Precondition scope và `B-GAP-R03/R06` | Fixture gate phải ngăn invalid config; không suy diễn FR-09 behavior từ corrupt data |
| Testability | Không injectable clock | `B-TG-01`, `B-BC-02` | Không kiểm chứng exact expiry boundary |

## 9. Coverage và traceability tóm tắt

| Nhóm | Test ID | Kết quả | Defect/gap |
|---|---|---|---|
| Nominal/code/active | `001`–`009` | 4 PASS, 1 FAIL, 4 BLOCKED | `BUG-001`; `GAP-R01/R07`; `BC-01` |
| Expiry boundary | `010`–`012` | 3 BLOCKED | `GAP-R04`; `TG-01`; `BC-02` |
| Threshold/trusted total | `013`–`017` | 2 PASS, 3 FAIL | `BUG-002`, `BUG-003`; `GAP-R02` |
| Auth/identity | `018`–`022` | 5 FAIL | `BUG-004`–`BUG-006` |
| Usage | `023`–`029` | 7 PASS | `GAP-R06`, `IG-02` residual |
| Discount/extreme | `030`–`034` | 1 PASS, 1 FAIL, 3 BLOCKED | `BUG-001`; `GAP-R02/R03`; `BC-03` |
| UI | `035`–`039` | 2 PASS, 3 FAIL | `BUG-007`–`BUG-009` |
| Config lower boundary | `040`–`041` | 1 PASS, 1 FAIL | `BUG-002` |

Các tổng theo nhóm: `17 PASS + 14 FAIL + 10 BLOCKED = 41`.

## 10. Residual risk và giới hạn kết luận

- Chưa xác nhận behavior sát expiry, normalization, rounding và cap/floor.
- Usage eligibility pass không chứng minh usage increment atomic/idempotent.
- Fixed coupon nominal pass không bù cho percent formula defect.
- 41 case đều attempted, nhưng chỉ 31 case có verdict PASS/FAIL; không được tuyên
  bố coverage thực thi 100% về chất lượng SUT.
- Các defect Critical/High cần sửa và regression toàn bộ arithmetic, trust,
  authentication và usage-binding trước khi chấp nhận feature.
