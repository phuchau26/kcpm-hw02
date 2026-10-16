# B-FR09 — Traceability matrix tổng thể

## 1. Thông tin ma trận

| Trường | Giá trị |
|---|---|
| Feature | `B-FR09` — Discount Coupon trên Web checkout |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Chuỗi truy vết | Requirement → partition/state → boundary → test case → result → defect/gap → evidence |
| Nguồn result | `evidence/B/execution/results.json` |
| Trạng thái | `REVIEWED` |

Ký hiệu `—` nghĩa là boundary hoặc defect/gap không áp dụng. Mọi evidence ngắn
trong bảng có prefix `evidence/B/execution/`; mỗi case có screenshot và trace.

## 2. Ma trận theo toàn bộ test case

| Test case | Requirement/gap | Partition/state | Boundary | Result | Defect/gap/condition | Evidence |
|---|---|---|---|---|---|---|
| `B-TC-001` | `B-R11`, `B-R12`, `B-R14` | `CA-V1`, `EX-V1`, `TH-V1`, `AU-V1`, `UL-V1`, `CT-V1`, `DA-V1`, `FA-V1` | — | FAIL | `B-BUG-001` | `screenshots/B-TC-001.png`; `traces/B-TC-001.zip` |
| `B-TC-002` | `B-R11`, `B-R13`, `B-R14` | `CT-V2`, `DA-V2`, `FA-V1` | — | PASS | — | `screenshots/B-TC-002.png`; `traces/B-TC-002.zip` |
| `B-TC-003` | `B-R02` | `CA-I1`, `EL-I1` | — | PASS | — | `screenshots/B-TC-003.png`; `traces/B-TC-003.zip` |
| `B-TC-004` | `B-R02` | `CA-I2`, `EL-I1` | — | PASS | — | `screenshots/B-TC-004.png`; `traces/B-TC-004.zip` |
| `B-TC-005` | `B-GAP-R07` | `CODE-U1` | `B-B08` | BLOCKED | `B-GAP-R07`, `B-BC-01` | `screenshots/B-TC-005.png`; `traces/B-TC-005.zip` |
| `B-TC-006` | `B-GAP-R01`, `B-GAP-R07` | `CODE-U2` | `B-B08` | BLOCKED | `B-GAP-R01`, `B-GAP-R07`, `B-BC-01` | `screenshots/B-TC-006.png`; `traces/B-TC-006.zip` |
| `B-TC-007` | `B-GAP-R01` | `CODE-U3` | `B-B08` | BLOCKED | `B-GAP-R01`, `B-BC-01` | `screenshots/B-TC-007.png`; `traces/B-TC-007.zip` |
| `B-TC-008` | `B-GAP-R01` | `CODE-U3` | `B-B08` | BLOCKED | `B-GAP-R01`, `B-BC-01` | `screenshots/B-TC-008.png`; `traces/B-TC-008.zip` |
| `B-TC-009` | `B-R04` | `EX-I1` | — | PASS | — | `screenshots/B-TC-009.png`; `traces/B-TC-009.zip` |
| `B-TC-010` | `B-R03` | `EX-V1` | `B-B03-BEFORE` | BLOCKED | `B-GAP-R04`, `B-TG-01`, `B-BC-02` | `screenshots/B-TC-010.png`; `traces/B-TC-010.zip` |
| `B-TC-011` | `B-R04` | `EX-I1` | `B-B03-ON` | BLOCKED | `B-GAP-R04`, `B-TG-01`, `B-BC-02` | `screenshots/B-TC-011.png`; `traces/B-TC-011.zip` |
| `B-TC-012` | `B-R04` | `EX-I1` | `B-B03-AFTER` | BLOCKED | `B-GAP-R04`, `B-TG-01`, `B-BC-02` | `screenshots/B-TC-012.png`; `traces/B-TC-012.zip` |
| `B-TC-013` | `B-R06` | `TH-I1` | `B-B01-LOW` | PASS | — | `screenshots/B-TC-013.png`; `traces/B-TC-013.zip` |
| `B-TC-014` | `B-R05`, `B-R12`, `B-R14` | `TH-V1` | `B-B01-ON` | FAIL | `B-BUG-002` | `screenshots/B-TC-014.png`; `traces/B-TC-014.zip` |
| `B-TC-015` | `B-R05`, `B-GAP-R02` | `TH-V1`, `DA-U1` | `B-B01-HIGH` | PASS | `B-GAP-R02` residual | `screenshots/B-TC-015.png`; `traces/B-TC-015.zip` |
| `B-TC-016` | `B-R15` | `TH-I2`, `EL-I6` | — | FAIL | `B-BUG-003` | `screenshots/B-TC-016.png`; `traces/B-TC-016.zip` |
| `B-TC-017` | `B-R06`, `B-R15` | `TH-I2`, `EL-I6` | — | FAIL | `B-BUG-003` | `screenshots/B-TC-017.png`; `traces/B-TC-017.zip` |
| `B-TC-018` | `B-R08` | `AU-I1`, `EL-I4` | — | FAIL | `B-BUG-004` | `screenshots/B-TC-018.png`; `traces/B-TC-018.zip` |
| `B-TC-019` | `B-R08` | `AU-I2`, `EL-I4` | — | FAIL | `B-BUG-004` | `screenshots/B-TC-019.png`; `traces/B-TC-019.zip` |
| `B-TC-020` | `B-R08` | `AU-I2`, `EL-I4` | — | FAIL | `B-BUG-004` | `screenshots/B-TC-020.png`; `traces/B-TC-020.zip` |
| `B-TC-021` | `B-R07`, `B-R10` | `AU-I3`, `UL-I1`, `EL-I6` | — | FAIL | `B-BUG-005` | `screenshots/B-TC-021.png`; `traces/B-TC-021.zip` |
| `B-TC-022` | `B-R08`, FR-08 | `AU-I1` | — | FAIL | `B-BUG-006` | `screenshots/B-TC-022.png`; `traces/B-TC-022.zip` |
| `B-TC-023` | `B-R09` | `UL-V1` | `B-B02-L1-LOW` | PASS | `B-GAP-R06`, `B-IG-02` residual | `screenshots/B-TC-023.png`; `traces/B-TC-023.zip` |
| `B-TC-024` | `B-R10` | `UL-I1` | `B-B02-L1-ON` | PASS | `B-GAP-R06`, `B-IG-02` residual | `screenshots/B-TC-024.png`; `traces/B-TC-024.zip` |
| `B-TC-025` | `B-R10` | `UL-I1` | `B-B02-L1-HIGH` | PASS | `B-GAP-R06`, `B-IG-02` residual | `screenshots/B-TC-025.png`; `traces/B-TC-025.zip` |
| `B-TC-026` | `B-R09` | `UL-V1` | `B-B02-L2-LOW` | PASS | `B-GAP-R06`, `B-IG-02` residual | `screenshots/B-TC-026.png`; `traces/B-TC-026.zip` |
| `B-TC-027` | `B-R10` | `UL-I1` | `B-B02-L2-ON` | PASS | `B-GAP-R06`, `B-IG-02` residual | `screenshots/B-TC-027.png`; `traces/B-TC-027.zip` |
| `B-TC-028` | `B-R10` | `UL-I1` | `B-B02-L2-HIGH` | PASS | `B-GAP-R06`, `B-IG-02` residual | `screenshots/B-TC-028.png`; `traces/B-TC-028.zip` |
| `B-TC-029` | `B-R09`, `B-R10` | `UL-I2`, `UL-V1` | — | PASS | `B-GAP-R06`, `B-IG-02` residual | `screenshots/B-TC-029.png`; `traces/B-TC-029.zip` |
| `B-TC-030` | `B-R12`, `B-R14` | `DV-V1`, `DA-V1`, `FA-V1` | `B-B04-ABOVE` | FAIL | `B-BUG-001` | `screenshots/B-TC-030.png`; `traces/B-TC-030.zip` |
| `B-TC-031` | `B-R13`, `B-R14` | `DV-V1`, `DA-V2`, `FA-V1` | `B-B04-ABOVE` | PASS | — | `screenshots/B-TC-031.png`; `traces/B-TC-031.zip` |
| `B-TC-032` | `B-GAP-R02` | `DA-U1` | — | BLOCKED | `B-GAP-R02`, `B-BC-03` | `screenshots/B-TC-032.png`; `traces/B-TC-032.zip` |
| `B-TC-033` | `B-GAP-R03` | `DV-U1` | `B-B07` | BLOCKED | `B-GAP-R03`, `B-BC-03` | `screenshots/B-TC-033.png`; `traces/B-TC-033.zip` |
| `B-TC-034` | `B-GAP-R03` | `FA-U1` | `B-B07` | BLOCKED | `B-GAP-R03`, `B-BC-03` | `screenshots/B-TC-034.png`; `traces/B-TC-034.zip` |
| `B-TC-035` | `B-R16` | `UI-MONEY-V1/I1` | — | PASS | — | `screenshots/B-TC-035.png`; `traces/B-TC-035.zip` |
| `B-TC-036` | `B-R17` | `UI-H1`, `UI-BREAD` | — | FAIL | `B-BUG-007` | `screenshots/B-TC-036.png`; `traces/B-TC-036.zip` |
| `B-TC-037` | `B-R18` | `UI-COLOR` | — | FAIL | `B-BUG-008` | `screenshots/B-TC-037.png`; `traces/B-TC-037.zip` |
| `B-TC-038` | `B-R18` | `UI-TAB` | — | PASS | — | `screenshots/B-TC-038.png`; `traces/B-TC-038.zip` |
| `B-TC-039` | `B-R19` | `UI-ERROR` | — | FAIL | `B-BUG-009` | `screenshots/B-TC-039.png`; `traces/B-TC-039.zip` |
| `B-TC-040` | `B-R05`, `B-R13`, `B-R14` | `DV-V1` | `B-B05-ON` | PASS | — | `screenshots/B-TC-040.png`; `traces/B-TC-040.zip` |
| `B-TC-041` | `B-R05`, `B-R13`, `B-R14` | `TH-V1` | `B-B05-HIGH` | FAIL | `B-BUG-002` | `screenshots/B-TC-041.png`; `traces/B-TC-041.zip` |

## 3. Coverage theo requirement

| Requirement | Test case | Kết quả có thể kết luận |
|---|---|---|
| `B-R01`, `B-R02` | `001`–`004` | Active nominal formula FAIL; nonexistent/inactive reject PASS |
| `B-R03`, `B-R04` | `009`–`012` | Clear expired PASS; exact expiry boundary 3 BLOCKED |
| `B-R05`, `B-R06` | `013`–`017`, `040`, `041` | Below/zero PASS; equality FAIL; trusted-total manipulation FAIL |
| `B-R07`, `B-R08` | `018`–`022`, `029` | 5 auth/identity/access FAIL; coupon-pair binding PASS |
| `B-R09`, `B-R10` | `021`, `023`–`029` | Usage boundaries PASS; forged identity FAIL |
| `B-R11` | `001`, `002` | Fixed nominal PASS; percent nominal FAIL |
| `B-R12` | `001`, `014`, `030` | Percent formula/equality cases FAIL |
| `B-R13` | `002`, `031`, `040`, `041` | Fixed calculation PASS; equality threshold FAIL |
| `B-R14` | `001`, `002`, `014`, `030`, `031`, `040`, `041` | Formula-dependent: 3 PASS, 4 FAIL |
| `B-R15` | `016`, `017` | 2 FAIL — client total được tin dùng |
| `B-R16` | `035` | PASS — định dạng tiền đạt |
| `B-R17` | `036` | FAIL — thiếu `h1` và breadcrumb |
| `B-R18` | `037`, `038` | Màu FAIL; Tab order PASS |
| `B-R19` | `039` | FAIL — error nằm dưới action |

Design coverage là `19/19` rule có ít nhất một test. Đây không phải execution
coverage đầy đủ vì expiry/normalization/rounding/cap vẫn còn BLOCKED.

## 4. Coverage theo boundary và supporting check

| Boundary | Test/check | Trạng thái cuối |
|---|---|---|
| `B-B01` threshold | `013`–`015` | Below PASS; equality FAIL; above PASS với rounding residual |
| `B-B02` usage count | `023`–`028` | 6 PASS cho limit 1 và 2 |
| `B-B03` expiry | `010`–`012` | 3 BLOCKED do clock/time contract |
| `B-B04` discount positive | `B-PC-02`–`05`; `030`, `031` | Invalid side là precondition check; percent FAIL, fixed PASS |
| `B-B05` minimum config | `B-PC-06`; `040`, `041` | 0 PASS; 1/equality FAIL |
| `B-B06` usage-limit config | `B-PC-07`; `023`–`028` | L=1 và L=2 PASS; invalid config không là app case |
| `B-B07` cap/max | `033`, `034` | 2 BLOCKED — không có specified cap/floor |
| `B-B08` code normalization | `005`–`008` | 4 BLOCKED — không có normalization oracle |

Supporting check `B-PC-01`–`B-PC-09` chỉ bảo vệ fixture/data integrity, không
được tính vào 41 Web application test case hoặc dùng để tăng PASS count.

## 5. Coverage defect và gap

- `B-BUG-001`–`B-BUG-009` đều truy tới case FAIL và evidence; 14 FAIL không bị
  trình bày thành 14 bug riêng.
- `B-GAP-R01`–`B-GAP-R07` có case hoặc residual scope cụ thể.
- `B-IG-01`, `B-IG-02` là source risk, không phải confirmed defect bổ sung.
- `B-TG-01` và `B-BC-01`–`B-BC-03` giải thích đúng 10 case BLOCKED.

## 6. Kiểm tra tính toàn vẹn

- [ ] Có đúng 41 Test ID, từ `B-TC-001` đến `B-TC-041`.
- [ ] Bao phủ `B-R01`–`B-R19` ở mức thiết kế.
- [ ] Truy vết đủ `B-B01`–`B-B08` và `B-PC-01`–`B-PC-09`.
- [ ] Truy vết đủ `B-BUG-001`–`B-BUG-009`, `B-GAP-R01`–`B-GAP-R07`.
- [ ] Giữ nguyên `17 PASS / 14 FAIL / 10 BLOCKED / 0 NOT RUN`.
- [ ] Không coi source risk hoặc case BLOCKED là confirmed defect.
