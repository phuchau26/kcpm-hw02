# A-FR03 — Traceability matrix tổng thể

## 1. Thông tin ma trận

| Trường | Giá trị |
|---|---|
| Feature | `A-FR03` — Quên mật khẩu và đặt lại mật khẩu trên Web |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Chuỗi truy vết | Requirement → partition → boundary → test case → result → defect/gap → evidence |
| Nguồn result | `evidence/A/execution/results.json` |
| Trạng thái | `REVIEWED — USER-DELEGATED AI REVIEW` |
| Căn cứ chấp nhận | Sinh viên ủy quyền AI quyết định review cuối ngày 2026-10-13 |

Ký hiệu `—` nghĩa là kỹ thuật hoặc liên kết đó không áp dụng cho case, không
phải dữ liệu bị bỏ sót. Prefix đầy đủ của screenshot là
`evidence/A/execution/screenshots/`.

## 2. Ma trận theo toàn bộ test case

| Test case | Requirement | Partition/state | Boundary | Result | Defect/gap | Evidence |
|---|---|---|---|---|---|---|
| `A-TC-001` | `A-R01`, `SEC-07` | `ES-V1`, `EM-V1`, `OS-0→OS-1` | `A-B01-ON` | FAIL | `A-BUG-001`, `A-GAP-CD01` | `evidence/A/execution/screenshots/A-TC-001.png` |
| `A-TC-002` | `A-R02`, `A-R12` | `ES-I1` | — | PASS | — | `evidence/A/execution/screenshots/A-TC-002.png` |
| `A-TC-003` | `A-R02`, `A-R11` | `ES-I2` | — | FAIL | `A-BUG-002`, `A-GAP-CD02` | `evidence/A/execution/screenshots/A-TC-003.png` |
| `A-TC-004` | `A-R02`, `A-R12` | `EM-I1` | — | FAIL | `A-BUG-003`, `A-GAP-CD03` | `evidence/A/execution/screenshots/A-TC-004.png` |
| `A-TC-005` | `A-R04` | `S2-V1`, `OF/OV/OB/OL-V1`, `PC-V1` | `A-B01/02/03/05/06/07-ON` | BLOCKED | `A-BUG-006`, `A-GAP-TS01` | `shared-missing-confirm-password.png` |
| `A-TC-006` | `A-R05` | `OF-I2` | `A-B01-LOW` | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-007` | `A-R05` | `OF-I2` | `A-B01-HIGH` | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-008` | `A-R05` | `OF-I1` | — | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-009` | `A-R05` | `OF-I3` | — | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-010` | `A-R05` | `OF-I4` | — | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-011` | `A-R05` | `OV-I1` | — | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-012` | `A-R05` | `OB-I1` | — | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-013` | `A-R05` | `OL-I1`, `OS-0` | — | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-014` | `A-R09`, `SEC-07` | `OL-I2`, `OS-2` | `A-B08` | BLOCKED | `A-GAP-RQ01`, `A-GAP-IM02`, `A-GAP-TS01`, `A-BLOCK-02` | shared blocker + source |
| `A-TC-015` | `A-R08`, `SEC-07` | `OL-I3`, `OS-1→OS-3`, `OUT-OTP` | — | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-TC-016` | `A-R06` | `PL-I2` | `A-B02-LOW` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-017` | `A-R04` | `PL-V1` | `A-B02-HIGH` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-018` | `A-R06` | `PU-I1` | `A-B03-LOW` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-019` | `A-R04` | `PU-V1` | `A-B03-HIGH` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-020` | `A-R06` | `PW-I1` | `A-B04-LOW` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-021` | `A-R04` | `PW-V1` | `A-B04-ON` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-022` | `A-R04` | `PW-V1` | `A-B04-HIGH` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-023` | `A-R06` | `PD-I1` | `A-B05-LOW` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-024` | `A-R04` | `PD-V1` | `A-B05-HIGH` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-025` | `A-R06` | `PS-I1` | `A-B06-LOW` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-026` | `A-R04` | `PS-V1` | `A-B06-HIGH` | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-027` | `A-R06` | `PS-I1` (set membership) | — | BLOCKED | `A-GAP-IM01`, `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-028` | `A-R06` | `PL-I1`, `S2-I2` | — | BLOCKED | `A-GAP-IM04`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-029` | `A-R07` | `PC-I1` | — | BLOCKED | `A-BUG-006`, `A-GAP-TS01` | shared blocker |
| `A-TC-030` | `A-R07` | `PC-I2` | `A-B07-SUB` | BLOCKED | `A-BUG-006`, `A-GAP-TS01` | shared blocker |
| `A-TC-031` | `A-R07` | `PC-I2` | `A-B07-CASE` | BLOCKED | `A-BUG-006`, `A-GAP-TS01` | shared blocker |
| `A-TC-032` | `A-R07` | `PC-I2` | `A-B07-DEL` | BLOCKED | `A-BUG-006`, `A-GAP-TS01` | shared blocker |
| `A-TC-033` | `A-R04`, `SEC-01` | `OUT-HASH` | — | BLOCKED | `A-GAP-IM03`, `A-GAP-TS01` | shared blocker + source |
| `A-TC-034` | `A-R03` | `UI-STEP`, `UI-BACK` | — | FAIL | `A-BUG-004`, `A-GAP-CD04` | `evidence/A/execution/screenshots/A-TC-034.png` |
| `A-TC-035` | `A-R10`, `A-R11`, `A-R07` | `UI-REQ`, `UI-TYPE`, `PC` | — | FAIL | `A-BUG-002`, `A-BUG-005`, `A-BUG-006`; `A-GAP-CD02`, `A-GAP-CD05`, `A-GAP-CD06` | `evidence/A/execution/screenshots/A-TC-035.png` |
| `A-TC-036` | `A-R12` | `UI-ERROR` | — | FAIL | `A-BUG-003`, `A-GAP-CD03` | `evidence/A/execution/screenshots/A-TC-036.png` |
| `A-TC-037` | `A-R13`, FR-21 color | `UI-H1`, `UI-LANG` | — | FAIL | `A-BUG-007`, `A-BUG-008`; `A-GAP-CD07`, `A-GAP-CD08` | `evidence/A/execution/screenshots/A-TC-037.png` |
| `A-TC-038` | `A-R14` | `UI-TAB` | — | FAIL | `A-BUG-006`, `A-GAP-CD06` | `evidence/A/execution/screenshots/A-TC-038.png` |

“shared blocker” là
`evidence/A/execution/screenshots/shared-missing-confirm-password.png`.

## 3. Kiểm soát coverage theo requirement

| Requirement | Test case thiết kế | Kết quả có thể kết luận |
|---|---|---|
| `A-R01` | `001` | FAIL — OTP length |
| `A-R02` | `002`–`004` | 1 PASS, 2 FAIL |
| `A-R03` | `034` | FAIL |
| `A-R04` | `005`, `017`, `019`, `021`, `022`, `024`, `026`, `033` | 8 BLOCKED |
| `A-R05` | `006`–`013` | 8 BLOCKED |
| `A-R06` | `016`, `018`, `020`, `023`, `025`, `027`, `028` | 7 BLOCKED |
| `A-R07` | `029`–`032` và structural check `035` | 4 BLOCKED; confirm control FAIL ở TC035 |
| `A-R08` | `015` | BLOCKED |
| `A-R09` | `014` | BLOCKED |
| `A-R10` | `035` | FAIL |
| `A-R11` | `003`, `035` | FAIL |
| `A-R12` | `002`, `004`, `036` | 1 PASS, 2 FAIL |
| `A-R13` | `037` | FAIL cho `<h1>`; tiếng Việt đạt trong observation |
| `A-R14` | `038` | FAIL do thiếu control confirm |

Coverage thiết kế là `14/14` rule có ít nhất một test case, nhưng đây không phải
coverage thực thi đầy đủ. Chỉ `9/38 = 23.68%` test case đã được thực thi; 29 case
còn lại bị chặn.

## 4. Kiểm soát coverage theo boundary

| Boundary | Trace tới test | Trạng thái cuối |
|---|---|---|
| `A-B01` | `001`, `005`–`007` | Điểm phát hành ON FAIL; reset LOW/ON/HIGH BLOCKED |
| `A-B02` | `005`, `016`, `017` | BLOCKED |
| `A-B03` | `005`, `018`, `019` | BLOCKED |
| `A-B04` | `020`–`022` | BLOCKED |
| `A-B05` | `005`, `023`, `024` | BLOCKED |
| `A-B06` | `005`, `025`, `026` | BLOCKED |
| `A-B07` | `005`, `030`–`032` | BLOCKED; confirm control không tồn tại |
| `A-B08` | `014` | BLOCKED; không định lượng và không có expiry state |
| `A-B09` | Không tạo BVA case | SRS không quy định email min/max |
| `A-B10` | Không tạo BVA case | SRS không quy định password max |

## 5. Kiểm soát defect và gap

| ID | Test case/nguồn truy vết |
|---|---|
| `A-BUG-001` | `A-TC-001` |
| `A-BUG-002` | `A-TC-003`, `035` |
| `A-BUG-003` | `A-TC-004`, `036` |
| `A-BUG-004` | `A-TC-034` |
| `A-BUG-005` | `A-TC-035` |
| `A-BUG-006` | `A-TC-035`, `038`; blocker của `005`–`033` |
| `A-BUG-007` | `A-TC-037` |
| `A-BUG-008` | `A-TC-037` |
| `A-GAP-RQ01` | `A-R09`, `A-B08`, `A-TC-014` |
| `A-GAP-IM01` | `A-R06`, password cases `016`–`027`; static source |
| `A-GAP-IM02` | `A-R09`, `A-TC-014`; static source |
| `A-GAP-IM03` | `SEC-01`, `A-TC-033`; static source |
| `A-GAP-IM04` | `A-R06`, `A-TC-016`–`028`; static source |
| `A-GAP-TS01` | `A-TC-005`–`033`; shared blocker evidence |
| `A-BLOCK-02` | `A-TC-014`; requirement/schema/fixture expiry |

## 6. Kiểm tra tính toàn vẹn

- [x] Có đúng 38 Test ID, từ `A-TC-001` đến `A-TC-038`.
- [x] Bao phủ `A-R01`–`A-R14` ở mức thiết kế.
- [x] Ghi rõ trạng thái `A-B01`–`A-B10`, kể cả hai boundary không được SRS quy định.
- [x] Truy vết đủ `A-BUG-001`–`A-BUG-008`.
- [x] Không đổi `PASS/FAIL/BLOCKED` từ `results.json`.
- [x] Không coi static finding là execution FAIL.
