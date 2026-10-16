# C-FR14 — Traceability matrix tổng thể

## 1. Thông tin ma trận

| Trường | Giá trị |
|---|---|
| Feature | `C-FR14` — Quản lý Danh mục trên Admin Web |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Chuỗi truy vết | Requirement → partition/state → boundary → test case → result → defect/gap → evidence |
| Nguồn result | `evidence/C/execution/results.json` |
| Trạng thái | `REVIEWED` |

Ký hiệu `—` nghĩa là boundary hoặc defect/gap không áp dụng, không phải dữ liệu
bị bỏ sót. Mọi evidence ngắn trong bảng có prefix
`evidence/C/execution/`; mỗi case có cả screenshot và Playwright trace.

## 2. Ma trận theo toàn bộ test case

| Test case | Requirement | Partition/state | Boundary | Result | Defect/gap/condition | Evidence |
|---|---|---|---|---|---|---|
| `C-TC-001` | `C-R11`, `C-R12` | `C-LS-V1` | — | PASS | — | `screenshots/C-TC-001.png`; `traces/C-TC-001.zip` |
| `C-TC-002` | `C-R13` | `C-LS-V2` | `C-B07` | FAIL | `C-BUG-001` | `screenshots/C-TC-002.png`; `traces/C-TC-002.zip` |
| `C-TC-003` | `C-R11`, `C-R12` | `C-LS-V1` | — | PASS | — | `screenshots/C-TC-003.png`; `traces/C-TC-003.zip` |
| `C-TC-004` | `C-R04` | `C-NM-V2`, `C-UI-SAFE` | — | PASS | — | `screenshots/C-TC-004.png`; `traces/C-TC-004.zip` |
| `C-TC-005` | `C-R06`, `C-R09`, `C-R10` | `C-NM-V1`, `C-PS-V1` | — | PASS | — | `screenshots/C-TC-005.png`; `traces/C-TC-005.zip` |
| `C-TC-006` | `C-R06`, `C-R08`, `C-R09` | `C-NM-V1` | `C-B01`, `C-B02` | PASS | — | `screenshots/C-TC-006.png`; `traces/C-TC-006.zip` |
| `C-TC-007` | `C-R07` | `C-NM-I1`, `C-PS-V3` | `C-B01` | FAIL | `C-BUG-002` | `screenshots/C-TC-007.png`; `traces/C-TC-007.zip` |
| `C-TC-008` | `C-R08` | `C-NM-I2`, `C-PS-V3` | `C-B02` | FAIL | `C-BUG-002` | `screenshots/C-TC-008.png`; `traces/C-TC-008.zip` |
| `C-TC-009` | `C-R08`, `C-R20`, `C-R21` | `C-NM-I2`, `C-UI-REQ`, `C-UI-ERR` | `C-B02` | FAIL | `C-BUG-002`, `C-BUG-003` | `screenshots/C-TC-009.png`; `traces/C-TC-009.zip` |
| `C-TC-010` | `C-GAP-R02` | `C-NM-U1` | `C-B03` | BLOCKED | `C-BC-01` | `screenshots/C-TC-010.png`; `traces/C-TC-010.zip` |
| `C-TC-011` | `C-GAP-R02` | `C-NM-U2` | — | BLOCKED | `C-BC-01` | `screenshots/C-TC-011.png`; `traces/C-TC-011.zip` |
| `C-TC-012` | `C-GAP-R03` | `C-NM-U3` | — | BLOCKED | `C-BC-01` | `screenshots/C-TC-012.png`; `traces/C-TC-012.zip` |
| `C-TC-013` | `C-GAP-R03` | `C-NM-U4` | — | BLOCKED | `C-BC-01` | `screenshots/C-TC-013.png`; `traces/C-TC-013.zip` |
| `C-TC-014` | `C-R06`, `C-R08`, `C-R09` | `C-NM-V1` | — | PASS | — | `screenshots/C-TC-014.png`; `traces/C-TC-014.zip` |
| `C-TC-015` | `C-R06`, `C-R08`, `C-R09`; `C-GAP-R04` | `C-NM-V1` | — | PASS | `C-GAP-R04` residual | `screenshots/C-TC-015.png`; `traces/C-TC-015.zip` |
| `C-TC-016` | `C-R04`, `C-R06`, `C-R10` | `C-NM-V2`, `C-UI-SAFE` | — | PASS | — | `screenshots/C-TC-016.png`; `traces/C-TC-016.zip` |
| `C-TC-017` | `C-GAP-R04` | `C-NM-U5` | `C-B04` | BLOCKED | `C-BC-02` | `screenshots/C-TC-017.png`; `traces/C-TC-017.zip` |
| `C-TC-018` | `C-GAP-R04` | `C-NM-U5` | `C-B04` | BLOCKED | `C-BC-02` | `screenshots/C-TC-018.png`; `traces/C-TC-018.zip` |
| `C-TC-019` | `C-GAP-R04` | `C-NM-U5` | `C-B04` | BLOCKED | `C-BC-02` | `screenshots/C-TC-019.png`; `traces/C-TC-019.zip` |
| `C-TC-020` | `C-GAP-R04`, `C-GAP-R05` | `C-NM-U6` | — | BLOCKED | `C-BC-02` | `screenshots/C-TC-020.png`; `traces/C-TC-020.zip` |
| `C-TC-021` | `C-GAP-R01` | `C-OP-U1`, `C-TR-04` | — | BLOCKED | `C-IG-01`, `C-BC-03` | `screenshots/C-TC-021.png`; `traces/C-TC-021.zip` |
| `C-TC-022` | `C-GAP-R01`, `C-R08` | `C-OP-U1`, `C-NM-I2` | `C-B02` | BLOCKED | `C-IG-01`, `C-BC-03` | `screenshots/C-TC-022.png`; `traces/C-TC-022.zip` |
| `C-TC-023` | `C-GAP-R01` | `C-OP-U1`, `C-NM-I1` | `C-B01` | BLOCKED | `C-IG-01`, `C-BC-03` | `screenshots/C-TC-023.png`; `traces/C-TC-023.zip` |
| `C-TC-024` | `C-GAP-R01`, `C-GAP-R06` | `C-ID-U1`, `C-TR-09` | `C-B06` | BLOCKED | `C-IG-01`, `C-IG-02`, `C-BC-03` | `screenshots/C-TC-024.png`; `traces/C-TC-024.zip` |
| `C-TC-025` | `C-GAP-R01`, `C-GAP-R07` | `C-RF-U1`, `C-RM-06` | `C-B08` | BLOCKED | `C-IG-01`, `C-IG-03`, `C-BC-03` | `screenshots/C-TC-025.png`; `traces/C-TC-025.zip` |
| `C-TC-026` | `C-R14`, `C-R15` | `C-ID-V1`, `C-RF-V1`, `C-PS-V2` | `C-B06`, `C-B08` | PASS | — | `screenshots/C-TC-026.png`; `traces/C-TC-026.zip` |
| `C-TC-027` | `C-GAP-R06` | `C-ID-U1`, `C-TR-09` | `C-B06` | BLOCKED | `C-IG-02`, `C-BC-04` | `screenshots/C-TC-027.png`; `traces/C-TC-027.zip` |
| `C-TC-028` | `C-GAP-R06` | `C-ID-A03` | `C-B05` | BLOCKED | `C-IG-02`, `C-BC-04` | `screenshots/C-TC-028.png`; `traces/C-TC-028.zip` |
| `C-TC-029` | `C-GAP-R06` | `C-ID-A04` | — | BLOCKED | `C-IG-02`, `C-BC-04` | `screenshots/C-TC-029.png`; `traces/C-TC-029.zip` |
| `C-TC-030` | `C-GAP-R06` | `C-ID-A05` | — | BLOCKED | `C-IG-02`, `C-BC-04` | `screenshots/C-TC-030.png`; `traces/C-TC-030.zip` |
| `C-TC-031` | `C-GAP-R05`, `C-GAP-R06` | `C-ID-A06` | — | BLOCKED | `C-IG-02`, `C-BC-04` | `screenshots/C-TC-031.png`; `traces/C-TC-031.zip` |
| `C-TC-032` | `C-R05`, `C-R15` | `C-ID-A07` | — | PASS | — | `screenshots/C-TC-032.png`; `traces/C-TC-032.zip` |
| `C-TC-033` | `C-GAP-R07` | `C-RF-U1`, `C-RM-02` | `C-B08` | BLOCKED | `C-IG-03`, `C-BC-05` | `screenshots/C-TC-033.png`; `traces/C-TC-033.zip` |
| `C-TC-034` | `C-GAP-R07` | `C-RF-U1`, `C-RM-03` | `C-B08` | BLOCKED | `C-IG-03`, `C-BC-05` | `screenshots/C-TC-034.png`; `traces/C-TC-034.zip` |
| `C-TC-035` | `C-R02` | `C-AU-I1`, `C-PS-V3` | — | PASS | — | `screenshots/C-TC-035.png`; `traces/C-TC-035.zip` |
| `C-TC-036` | `C-R02` | `C-AU-I2`, `C-PS-V3` | — | PASS | — | `screenshots/C-TC-036.png`; `traces/C-TC-036.zip` |
| `C-TC-037` | `C-R02` | `C-AU-I3`, `C-PS-V3` | — | PASS | — | `screenshots/C-TC-037.png`; `traces/C-TC-037.zip` |
| `C-TC-038` | `C-R03` | `C-RL-I1`, `C-EL-I2` | — | FAIL | `C-BUG-004` | `screenshots/C-TC-038.png`; `traces/C-TC-038.zip` |
| `C-TC-039` | `C-R02`, `C-R15` | `C-AU-I1`, `C-TR-08` | — | PASS | — | `screenshots/C-TC-039.png`; `traces/C-TC-039.zip` |
| `C-TC-040` | `C-R03`, `C-R15` | `C-RL-I1`, `C-EL-I5` | — | FAIL | `C-BUG-004` | `screenshots/C-TC-040.png`; `traces/C-TC-040.zip` |
| `C-TC-041` | `C-R01` | `C-RL-I1` | — | PASS | — | `screenshots/C-TC-041.png`; `traces/C-TC-041.zip` |
| `C-TC-042` | `C-R01`, `C-R03` | `C-DM-04`, `C-RL-I1` | — | FAIL | `C-BUG-004` | `screenshots/C-TC-042.png`; `traces/C-TC-042.zip` |
| `C-TC-043` | `C-R20`, `C-R21` | `C-UI-REQ`, `C-UI-ERR` | `C-B02` | FAIL | `C-BUG-002`, `C-BUG-003` | `screenshots/C-TC-043.png`; `traces/C-TC-043.zip` |
| `C-TC-044` | `C-R18` | `C-UI-H1` | — | FAIL | `C-BUG-005` | `screenshots/C-TC-044.png`; `traces/C-TC-044.zip` |
| `C-TC-045` | FR-23 không áp dụng | N/A | — | BLOCKED | `C-BC-06` | `screenshots/C-TC-045.png`; `traces/C-TC-045.zip` |
| `C-TC-046` | `C-R17` | `C-UI-COLOR` | — | PASS | — | `screenshots/C-TC-046.png`; `traces/C-TC-046.zip` |
| `C-TC-047` | `C-R19` | `C-UI-TAB` | — | PASS | — | `screenshots/C-TC-047.png`; `traces/C-TC-047.zip` |
| `C-TC-048` | `C-R16` | `C-UI-LANG` | — | PASS | — | `screenshots/C-TC-048.png`; `traces/C-TC-048.zip` |

## 3. Coverage theo requirement

| Requirement | Test case | Kết quả có thể kết luận |
|---|---|---|
| `C-R01` | `041`, `042` | Interactive user login PASS; restored user token FAIL (`C-BUG-004`) |
| `C-R02` | `035`–`037`, `039` | 4 PASS cho missing/invalid/expired JWT |
| `C-R03` | `038`, `040`, `042` | 3 FAIL — role admin không được cưỡng chế |
| `C-R04` | `004`, `016` | 2 PASS — markup render an toàn |
| `C-R05` | `032` | PASS — SQL-like ID không xóa nhiều record |
| `C-R06` | `005`, `006`, `014`–`016` | 5 PASS cho Create non-empty |
| `C-R07` | `007` | FAIL — missing name được lưu `NULL` |
| `C-R08` | `006`, `008`, `009`, `014`, `015`, `022` | Valid PASS; empty Create FAIL; Update BLOCKED |
| `C-R09` | `005`, `006`, `014`, `015` | 4 PASS — Create quan sát lại được qua Read |
| `C-R10` | `005`, `016` | 2 PASS — record cũ giữ nguyên |
| `C-R11`, `C-R12` | `001`, `003` | 2 PASS — list và ID/name fidelity |
| `C-R13` | `002` | FAIL — thiếu empty state |
| `C-R14` | `026` | PASS — Delete existing unreferenced |
| `C-R15` | `026`, `032`, `039`, `040` | 3 PASS; role-user Delete FAIL do `C-BUG-004` |
| `C-R16` | `048` | PASS — nhãn Category bằng tiếng Việt |
| `C-R17` | `046` | PASS — màu Thêm/Xóa đúng |
| `C-R18` | `044` | FAIL — `h1` không mô tả Category |
| `C-R19` | `047` | PASS — Tab order quan sát được đúng |
| `C-R20`, `C-R21` | `009`, `043` | FAIL — thiếu `*`, inline error và request suppression |

Design coverage là `21/21` rule có ít nhất một test. Đây không phải execution
coverage 100%: các composite có Update vẫn phụ thuộc requirement gap.

## 4. Coverage theo boundary

| Boundary | Test case | Trạng thái cuối |
|---|---|---|
| `C-B01` | `006`, `007`, `023` | One-character PASS; missing Create FAIL; Update missing BLOCKED |
| `C-B02` | `006`, `008`, `009`, `022`, `043` | One-character PASS; empty Create/UI FAIL; Update empty BLOCKED |
| `C-B03` | `010` | BLOCKED — whitespace oracle chưa có |
| `C-B04` | `017`–`019` | BLOCKED — không có upper length |
| `C-B05` | `028` | BLOCKED — ID 0 contract chưa có |
| `C-B06` | `024`, `026`, `027` | Existing Delete PASS; Update/Delete nonexistent BLOCKED |
| `C-B07` | `002` | FAIL — empty list thiếu empty state |
| `C-B08` | `025`, `026`, `033`, `034` | Unreferenced Delete PASS; referenced cases BLOCKED |

## 5. Coverage defect và gap

- `C-BUG-001`–`C-BUG-005` đều truy tới ít nhất một case FAIL và evidence.
- `C-GAP-R01`–`C-GAP-R07` có case/probe cụ thể; `C-GAP-R08` là exclusion về
  list ordering/filter/pagination; `C-GAP-R09` là exclusion về confirmation dialog.
- `C-IG-01`–`C-IG-03` chỉ là source-confirmed risk, không đổi verdict execution.
- `C-TG-01` đã được runtime adapter giảm thiểu, không tạo BLOCKED ở lần chạy này.
- `C-BC-01`–`C-BC-06` cộng đúng `4+4+5+5+2+1=21` case BLOCKED.

## 6. Kiểm tra tính toàn vẹn

- [ ] Có đúng 48 Test ID, từ `C-TC-001` đến `C-TC-048`.
- [ ] Bao phủ `C-R01`–`C-R21` ở mức thiết kế.
- [ ] Truy vết đủ `C-B01`–`C-B08`.
- [ ] Truy vết đủ `C-BUG-001`–`C-BUG-005` và `C-GAP-R01`–`C-GAP-R09`.
- [ ] Giữ nguyên `18 PASS / 9 FAIL / 21 BLOCKED / 0 NOT RUN`.
- [ ] Không coi source finding hoặc case BLOCKED là confirmed defect.
