# D-M09 — Traceability matrix tổng thể

## 1. Thông tin ma trận

| Trường | Giá trị |
|---|---|
| Feature | `D-M09` — Discount Coupon trên Mobile checkout |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Runtime evidence | Chuẩn: Expo Web/Chromium `440 × 956`; bổ sung: thiết bị iOS thật qua Expo Go/Expo SDK 57 |
| Chuỗi truy vết | Requirement → partition/state → boundary → test case → result → defect/gap → Mobile evidence |
| Nguồn result | `evidence/D/execution/results.json` |
| Trạng thái | `PENDING HUMAN REVIEW — NATIVE iOS SUPPLEMENT` |

Ký hiệu `—` nghĩa là boundary hoặc defect/gap không áp dụng. Mọi evidence ngắn
trong bảng có prefix `evidence/D/execution/`; mỗi case có screenshot và
Playwright trace. Trace là evidence động của Expo Web. Chín ảnh iOS thật là
evidence bổ sung, không thay thế lần chạy chuẩn và không làm đổi verdict.

## 2. Ma trận theo toàn bộ test case

| Test case | Requirement/gap | Partition/state | Boundary | Result | Defect/gap/condition | Mobile evidence |
|---|---|---|---|---|---|---|
| `D-TC-001` | FR-08, `D-R15` | Cart/checkout nominal, `D-OBJ-08` | — | PASS | — | `screenshots/D-TC-001.png`; `traces/D-TC-001.zip`; `../native-ios/screenshots/D-TC-001-ios-physical.jpg` |
| `D-TC-002` | `D-R08` | `D-AU-I1` | — | PASS | — | `screenshots/D-TC-002.png`; `traces/D-TC-002.zip`; `../native-ios/screenshots/D-TC-002-ios-physical.jpg` |
| `D-TC-003` | `D-GAP-R03` | `D-EP-04`, `D-PC-01`, `D-TR-01` | — | BLOCKED | `D-GAP-R03`, `D-BC-01` | `screenshots/D-TC-003.png`; `traces/D-TC-003.zip`; `../native-ios/screenshots/D-TC-003-ios-physical.jpg` (observation) |
| `D-TC-004` | `D-GAP-R02/R03` | `D-EP-05`, `D-PC-02`, `D-TR-01` | — | BLOCKED | `D-GAP-R02/R03`, `D-BC-01` | `screenshots/D-TC-004.png`; `traces/D-TC-004.zip` |
| `D-TC-005` | `D-GAP-R02` | `D-EP-06`, `D-PC-03` | — | BLOCKED | `D-GAP-R02`, `D-IG-01`, `D-BC-01` | `screenshots/D-TC-005.png`; `traces/D-TC-005.zip` |
| `D-TC-006` | `D-GAP-R02` | `D-EP-08`, `D-PC-05` | — | BLOCKED | `D-GAP-R02`, `D-IG-01`, `D-BC-01` | `screenshots/D-TC-006.png`; `traces/D-TC-006.zip` |
| `D-TC-007` | `D-R01` | `D-EP-01`, `D-EP-07` | — | PASS | — | `screenshots/D-TC-007.png`; `traces/D-TC-007.zip` |
| `D-TC-008` | `D-R11/R12/R14/R16` | `D-EP-09`, `D-DA-V1`, `D-FA-V1`, `D-TR-03` | — | FAIL | `B-BUG-001` | `screenshots/D-TC-008.png`; `traces/D-TC-008.zip`; `../native-ios/screenshots/D-TC-008-ios-physical.jpg` (modified data) |
| `D-TC-009` | `D-R11/R13/R14/R16` | `D-EP-10`, `D-DA-V2`, `D-FA-V1`, `D-TR-03` | — | PASS | — | `screenshots/D-TC-009.png`; `traces/D-TC-009.zip`; `../native-ios/screenshots/D-TC-009-ios-physical.jpg` (modified data) |
| `D-TC-010` | `D-R02` | `D-EP-02`, `D-PC-06`, `D-UI-V2` | — | PASS | — | `screenshots/D-TC-010.png`; `traces/D-TC-010.zip`; `../native-ios/screenshots/D-TC-010-ios-physical.jpg` |
| `D-TC-011` | `D-R02` | `D-EP-03`, `D-PC-07`, `D-UI-V2` | — | PASS | — | `screenshots/D-TC-011.png`; `traces/D-TC-011.zip` |
| `D-TC-012` | `D-R04` | `D-EX-I1` | — | PASS | — | `screenshots/D-TC-012.png`; `traces/D-TC-012.zip`; `../native-ios/screenshots/D-TC-012-ios-physical.jpg` |
| `D-TC-013` | `D-R03` | `D-EX-V1` | `D-B03` before | BLOCKED | `D-GAP-R07`, `D-TG-01`, `D-BC-02` | `screenshots/D-TC-013.png`; `traces/D-TC-013.zip` |
| `D-TC-014` | `D-R04` | `D-EX-I1` | `D-B03` on | BLOCKED | `D-GAP-R07`, `D-TG-01`, `D-BC-02` | `screenshots/D-TC-014.png`; `traces/D-TC-014.zip` |
| `D-TC-015` | `D-R04` | `D-EX-I1` | `D-B03` after | BLOCKED | `D-GAP-R07`, `D-TG-01`, `D-BC-02` | `screenshots/D-TC-015.png`; `traces/D-TC-015.zip` |
| `D-TC-016` | `D-R06` | `D-TH-I1` | `D-B01` below | PASS | — | `screenshots/D-TC-016.png`; `traces/D-TC-016.zip` |
| `D-TC-017` | `D-R05/R12/R14` | `D-TH-V1`, `D-DA-V1`, `D-FA-V1` | `D-B01` on | FAIL | `B-BUG-002` | `screenshots/D-TC-017.png`; `traces/D-TC-017.zip` |
| `D-TC-018` | `D-R05`, `D-GAP-R06` | `D-TH-V1`, `D-DA-U1` | `D-B01` above | PASS | `D-GAP-R06` residual | `screenshots/D-TC-018.png`; `traces/D-TC-018.zip` |
| `D-TC-019` | `D-R15` | `D-TH-I2` | — | FAIL | `B-BUG-003` | `screenshots/D-TC-019.png`; `traces/D-TC-019.zip` |
| `D-TC-020` | `D-R06/R15` | `D-TH-I2` | `D-B01` below | FAIL | `B-BUG-003` | `screenshots/D-TC-020.png`; `traces/D-TC-020.zip` |
| `D-TC-021` | `D-R09` | `D-UL-V1` | `D-B04` L1 below | PASS | `D-GAP-R11`, `D-IG-03` residual | `screenshots/D-TC-021.png`; `traces/D-TC-021.zip` |
| `D-TC-022` | `D-R10` | `D-UL-I1` | `D-B04` L1 on | PASS | `D-GAP-R11`, `D-IG-03` residual | `screenshots/D-TC-022.png`; `traces/D-TC-022.zip`; `../native-ios/screenshots/D-TC-022-ios-physical.jpg` |
| `D-TC-023` | `D-R10` | `D-UL-I1` | `D-B04` L1 above | PASS | `D-GAP-R11`, `D-IG-03` residual | `screenshots/D-TC-023.png`; `traces/D-TC-023.zip` |
| `D-TC-024` | `D-R09` | `D-UL-V1` | `D-B04` L2 below | PASS | `D-GAP-R11`, `D-IG-03` residual | `screenshots/D-TC-024.png`; `traces/D-TC-024.zip` |
| `D-TC-025` | `D-R10` | `D-UL-I1` | `D-B04` L2 on | PASS | `D-GAP-R11`, `D-IG-03` residual | `screenshots/D-TC-025.png`; `traces/D-TC-025.zip` |
| `D-TC-026` | `D-R07/R10` | `D-AU-I3`, `D-UL-I1` | — | FAIL | `B-BUG-005` | `screenshots/D-TC-026.png`; `traces/D-TC-026.zip` |
| `D-TC-027` | `D-R08` | `D-EP-13`, `D-AU-I1` | — | FAIL | `B-BUG-004` | `screenshots/D-TC-027.png`; `traces/D-TC-027.zip` |
| `D-TC-028` | `D-R08` | `D-EP-14`, `D-AU-I2` | — | FAIL | `B-BUG-004` | `screenshots/D-TC-028.png`; `traces/D-TC-028.zip` |
| `D-TC-029` | FR-17 | `D-DV-I1` | `D-B06` below | PASS | — | `screenshots/D-TC-029.png`; `traces/D-TC-029.zip` |
| `D-TC-030` | FR-17 | `D-DV-I1` | `D-B06` on | PASS | — | `screenshots/D-TC-030.png`; `traces/D-TC-030.zip` |
| `D-TC-031` | `D-R12/R14` | `D-DA-V1`, `D-FA-V1` | `D-B06` above | FAIL | `B-BUG-001` | `screenshots/D-TC-031.png`; `traces/D-TC-031.zip` |
| `D-TC-032` | `D-R13/R14` | `D-DA-V2`, `D-FA-V1` | `D-B06` above | PASS | — | `screenshots/D-TC-032.png`; `traces/D-TC-032.zip` |
| `D-TC-033` | `D-GAP-R06` | `D-PC-08`, `D-DA-U1` | — | BLOCKED | `D-GAP-R06`, `D-BC-03` | `screenshots/D-TC-033.png`; `traces/D-TC-033.zip` |
| `D-TC-034` | `D-GAP-R06` | `D-PC-09`, `D-DV-U1` | — | BLOCKED | `D-GAP-R06`, `D-BC-03` | `screenshots/D-TC-034.png`; `traces/D-TC-034.zip` |
| `D-TC-035` | `D-GAP-R06` | `D-PC-10`, `D-FA-U1` | — | BLOCKED | `D-GAP-R06`, `D-BC-03` | `screenshots/D-TC-035.png`; `traces/D-TC-035.zip` |
| `D-TC-036` | `D-GAP-R03` | `D-TR-02`, `D-UI-U1` | — | BLOCKED | `D-GAP-R03`, `D-IG-02`, `D-BC-04` | `screenshots/D-TC-036.png`; `traces/D-TC-036.zip` |
| `D-TC-037` | `D-GAP-R04` | `D-TR-06`, `D-UI-U2` | — | BLOCKED | `D-GAP-R04`, `D-IG-02`, `D-BC-04` | `screenshots/D-TC-037.png`; `traces/D-TC-037.zip` |
| `D-TC-038` | `D-GAP-R04` | `D-TR-06`, `D-UI-U2` | — | BLOCKED | `D-GAP-R04`, `D-IG-02`, `D-BC-04` | `screenshots/D-TC-038.png`; `traces/D-TC-038.zip` |
| `D-TC-039` | `D-GAP-R04` | `D-TR-07`, `D-UI-U2` | — | BLOCKED | `D-GAP-R04`, `D-IG-02`, `D-BC-04` | `screenshots/D-TC-039.png`; `traces/D-TC-039.zip` |
| `D-TC-040` | `D-R02`, `D-GAP-R05` | `D-EP-17`, `D-TR-04` | — | PASS | `D-GAP-R05` residual | `screenshots/D-TC-040.png`; `traces/D-TC-040.zip` |
| `D-TC-041` | `D-GAP-R09` | `D-EP-18`, `D-TR-05` | — | BLOCKED | `D-GAP-R09`, `D-BC-05` | `screenshots/D-TC-041.png`; `traces/D-TC-041.zip` |
| `D-TC-042` | `D-GAP-R09` | `D-EP-19`, `D-TR-05` | — | BLOCKED | `D-GAP-R09`, `D-IG-04`, `D-BC-05` | `screenshots/D-TC-042.png`; `traces/D-TC-042.zip`; `../native-ios/screenshots/D-TC-042-ios-physical.jpg` (observation) |
| `D-TC-043` | `D-GAP-R09` | `D-EP-20`, `D-TR-05` | — | BLOCKED | `D-GAP-R09`, `D-BC-05` | `screenshots/D-TC-043.png`; `traces/D-TC-043.zip` |
| `D-TC-044` | `D-R12/R14/R15` | `D-DA-I1`, `D-TH-I2`, `D-TR-03` | — | FAIL | `B-BUG-003` primary; `B-BUG-001`; `D-GAP-R11` residual | `screenshots/D-TC-044.png`; `traces/D-TC-044.zip` |
| `D-TC-045` | `D-R16/R17/R18` | `D-EP-22/23`, `D-UI-V1/V3` | — | PASS | — | `screenshots/D-TC-045.png`; `traces/D-TC-045.zip` |
| `D-TC-046` | `D-R19` | `D-EP-24`, `D-UI-I3` | — | FAIL | `D-BUG-001` | `screenshots/D-TC-046.png`; `traces/D-TC-046.zip` |
| `D-TC-047` | `D-R20` | `D-EP-25`, `D-UI-I4` | — | FAIL | `D-BUG-002` | `screenshots/D-TC-047.png`; `traces/D-TC-047.zip` |
| `D-TC-048` | `D-GAP-R10` | `D-PLAT-V1` | — | BLOCKED | `D-MG-02`, `D-BC-06` | `screenshots/D-TC-048.png`; `traces/D-TC-048.zip` |
| `D-TC-049` | `D-GAP-R10` | `D-PLAT-U1` | — | BLOCKED | `D-MG-02`, `D-TG-02`, `D-BC-06` | `screenshots/D-TC-049.png`; `traces/D-TC-049.zip` |
| `D-TC-050` | `D-GAP-R08/R10` | `D-EP-26`, `D-UI-U3`, `D-PLAT-U1/U2` | — | BLOCKED | `D-MG-02`, `D-TG-02`, `D-BC-06` | `screenshots/D-TC-050.png`; `traces/D-TC-050.zip` |

## 3. Coverage theo requirement

| Requirement | Test case | Kết quả có thể kết luận |
|---|---|---|
| `D-R01`, `D-R02` | `007`, `010`, `011`, `040` | Active mapping và business reject PASS |
| `D-R03`, `D-R04` | `012`–`015` | Clear expired PASS; exact boundary 3 BLOCKED |
| `D-R05`, `D-R06` | `016`–`020` | Below/above PASS; equality và trusted-total FAIL |
| `D-R07`, `D-R08` | `002`, `026`–`028` | UI unauth guard PASS; API identity/auth 3 FAIL |
| `D-R09`, `D-R10` | `021`–`026` | Usage boundary PASS; forged identity FAIL |
| `D-R11` | `008`, `009` | Fixed nominal PASS; percent nominal FAIL |
| `D-R12`, `D-R14` | `008`, `017`, `031`, `044` | Percent/formula/integration FAIL |
| `D-R13` | `009`, `032` | Fixed formula PASS |
| `D-R15` | `001`, `019`, `020`, `044` | UI read-only PASS; Backend authoritative pricing FAIL |
| `D-R16` | `008`, `009`, `045` | Fixed output PASS; percent output FAIL |
| `D-R17`, `D-R18` | `045` | Money format và tiếng Việt PASS |
| `D-R19` | `046` | FAIL — positive action sai màu |
| `D-R20` | `047` | FAIL — error nằm dưới action |

Design coverage là `20/20` rule có ít nhất một test. Đây không phải native hoặc
execution coverage đầy đủ vì expiry, normalization, state, resilience và native
interaction còn BLOCKED.

### Native evidence bổ sung

Có 9 screenshot trên thiết bị iOS thật: 5 ảnh bám đúng procedure (`001`, `002`,
`010`, `012`, `022`), 2 ảnh dùng dữ liệu khác thiết kế (`008`, `009`) và 2 ảnh
chỉ dùng làm observation (`003`, `042`). Bộ ảnh được chụp ngày 2026-10-16 sau
khi nâng Expo SDK 57 và dùng API qua LAN, vì vậy không thay thế baseline Expo Web
và không làm thay đổi `PASS/FAIL/BLOCKED`.

## 4. Coverage theo boundary

| Boundary | Test/check | Trạng thái cuối |
|---|---|---|
| `D-B01` order threshold | `016`–`018`, `020` | Below/above PASS; equality và forged total FAIL |
| `D-B02` minimum config | Fixture data check | Được kiểm ở setup; không phải application verdict độc lập |
| `D-B03` expiry | `013`–`015` | 3 BLOCKED do clock/time contract |
| `D-B04` usage count | `021`–`025` | 5 PASS cho limit 1 và 2 |
| `D-B05` usage-limit config | Fixture limit 1/2 | Được bao phủ bởi `021`–`025`; invalid config ngoài FR-09 runtime |
| `D-B06` discount positive | `029`–`032` | Invalid fixture checks PASS; percent FAIL; fixed PASS |

## 5. Coverage defect và gap

- 11 FAIL truy tới 7 root-cause group: 5 canonical Backend defect
  `B-BUG-001`–`B-BUG-005` và 2 Mobile defect `D-BUG-001/002`.
- `D-GAP-R01`–`D-GAP-R11` đều có scope, test hoặc residual-risk link.
- `D-IG-01`–`04` là implementation risk, không phải confirmed defect bổ sung.
- `D-MG-01/02`, `D-TG-01/02` và `D-BC-01`–`06` giải thích platform/testability
  cùng đúng 20 BLOCKED.

## 6. Kiểm tra tính toàn vẹn

- [ ] Có đúng 50 Test ID, từ `D-TC-001` đến `D-TC-050`.
- [ ] Bao phủ `D-R01`–`D-R20` ở mức thiết kế.
- [ ] Truy vết đủ `D-B01`–`D-B06`.
- [ ] Ánh xạ đủ 11 FAIL vào 7 root-cause group, không double-count Backend defect.
- [ ] Giữ nguyên `19 PASS / 11 FAIL / 20 BLOCKED / 0 NOT RUN`.
- [ ] Chỉ dùng 9 ảnh iOS làm evidence bổ sung; không tuyên bố full native coverage.
