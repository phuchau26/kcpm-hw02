# A-FR03 — AI gap analysis

## 1. Thông tin tài liệu

| Trường | Giá trị |
|---|---|
| Đầu vào | Step 1–5 đã review/cross-check; source SHOP chỉ đọc |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Mục tiêu | Tách defect đã thực thi khỏi requirement, implementation và testability gap |
| Trạng thái | `REVIEWED` |
| Căn cứ chấp nhận | Số liệu đã đối chiếu với evidence và source |

Phân tích này không sửa oracle theo implementation và không biến static finding
thành execution result. “Confirmed defect” chỉ dùng cho sai lệch đã có case
`FAIL`; gap chỉ mô tả phần chưa thể kết luận đầy đủ qua luồng Web đã thiết kế.

## 2. Kết quả đối chiếu Step 5

| Nhóm | Số lượng | Kết luận |
|---|---:|---|
| Confirmed defect | 8 | Có execution result và evidence; chi tiết trong `bugs/A-FR03_bug_report.md` |
| Requirement gap | 1 | Thiếu duration và quy tắc inclusive/exclusive của OTP expiry |
| Implementation gap bổ sung | 4 | Source trái requirement nhưng các case tương ứng đang `BLOCKED`; chưa đổi thành FAIL |
| Testability gap | 1 | Thiếu confirm control chặn procedure Web của 29 case |
| Blocked condition | 2 | Confirm control; expiry rule/state/fixture |

## 3. Confirmed defect gap

| Gap ID | Oracle | Hành vi thực tế | Defect | Test case |
|---|---|---|---|---|
| `A-GAP-CD01` | OTP 6 chữ số | OTP và label 4 chữ số | `A-BUG-001` | `A-TC-001` |
| `A-GAP-CD02` | Email `type=email` | `type=text`, invalid syntax gọi API | `A-BUG-002` | `A-TC-003`, `035` |
| `A-GAP-CD03` | Error inline trên submit | Chỉ dùng alert | `A-BUG-003` | `A-TC-004`, `036` |
| `A-GAP-CD04` | Step Indicator và về login | Không indicator; quay lại Step 1 | `A-BUG-004` | `A-TC-034` |
| `A-GAP-CD05` | Field bắt buộc có `*` | Label không có `*` | `A-BUG-005` | `A-TC-035` |
| `A-GAP-CD06` | Có confirm password | Không có state/control confirm | `A-BUG-006` | `A-TC-035`, `038` |
| `A-GAP-CD07` | Đúng một `<h1>` | Dùng `<h2>`, không có `<h1>` | `A-BUG-007` | `A-TC-037` |
| `A-GAP-CD08` | Positive action màu xanh dương | Nút reset màu xanh lá | `A-BUG-008` | `A-TC-037` |

## 4. Requirement gap

### A-GAP-RQ01 — OTP expiry chưa đủ định lượng

- SRS/SEC-07 yêu cầu OTP “có thời hạn”, nhưng không cho duration và không nói
  token đúng tại mốc hết hạn được xem là còn hạn hay hết hạn.
- Không được tự đặt số phút/giây; vì thế `A-B08` không thể chọn `t-1/t/t+1` và
  `A-TC-014` chưa có oracle thời gian định lượng.
- Đề xuất: product owner/giảng viên xác nhận duration và boundary convention;
  sau đó bổ sung acceptance criterion và fixture thời gian.

## 5. Implementation gap bổ sung chưa được nâng thành defect execution

| Gap ID | Requirement | Static source observation | Case bị ảnh hưởng | Kết luận hiện tại |
|---|---|---|---|---|
| `A-GAP-IM01` | Password dùng special trong `@$!%*?&` | Regex tại `ForgotPassword.jsx:26` lại bắt whitespace và chỉ cho chữ/số/whitespace | `A-TC-005`, `016`–`028` | Source-confirmed implementation gap; execution bị chặn |
| `A-GAP-IM02` | OTP có expiry | `database.js:50–60` không có expiry column; `server.js:87–98` không kiểm tra thời gian | `A-TC-014` | Source-confirmed implementation gap; còn requirement gap về duration |
| `A-GAP-IM03` | Password không lưu plaintext | `server.js:90–91` ghi trực tiếp `newPassword` vào `users.password` | `A-TC-033` | Security implementation gap; execution bị chặn |
| `A-GAP-IM04` | Password policy được thực thi end-to-end | Endpoint reset ở `server.js:87–98` không validate password; chỉ dựa vào client | `A-TC-016`–`028` | Backend validation gap; execution Web bị chặn |

Các gap này có bằng chứng source nhưng chưa có actual result đúng procedure của
test case, nên không sửa trạng thái `BLOCKED` và không tạo bug confirmed mới.

## 6. Testability gap và blocked condition

### A-GAP-TS01 — Thiếu control để thiết lập `CONFIRM_VALID`

Procedure `PROC-RESET` yêu cầu nhập password và confirm password. UI thực tế chỉ
có một password field; automation không được sửa DOM/SUT hoặc bỏ bước oracle.
Hệ quả: `A-TC-005`–`A-TC-033` đều `BLOCKED`. Đây đồng thời là tác động về
testability của defect `A-BUG-006`, không phải 29 defect riêng.

### A-BLOCK-02 — Không thể tạo state OTP expired có nghĩa

`A-TC-014` bị chặn thêm bởi ba yếu tố: không có duration chính thức, schema không
có expiry state và endpoint không kiểm tra thời gian. Chỉ bổ sung confirm field
vẫn chưa làm case này executable.

## 7. Traceability requirement → test → result → defect/gap

| Requirement | Partition/boundary | Test case | Result | Defect/gap | Evidence |
|---|---|---|---|---|---|
| `A-R01` | `ES-V1`, `EM-V1`, `A-B01-ON` | `A-TC-001` | FAIL | `A-BUG-001` | `A-TC-001.png` |
| `A-R02` | `ES-I1`, `ES-I2`, `EM-I1` | `A-TC-002`–`004` | 1 PASS, 2 FAIL | `A-BUG-002`, `003` | `A-TC-002.png`–`004.png` |
| `A-R03` | `UI-STEP`, `UI-BACK` | `A-TC-034` | FAIL | `A-BUG-004` | `A-TC-034.png` |
| `A-R04` | valid composite; `A-B01`–`07` nominal/valid | `A-TC-005`, `017`, `019`, `021`, `022`, `024`, `026`, `033` | BLOCKED | `A-BUG-006`, `A-GAP-TS01`; `IM03` cho TC033 | shared blocker |
| `A-R05` | OTP invalid partitions; `A-B01-LOW/HIGH` | `A-TC-006`–`013` | BLOCKED | `A-BUG-006`, `A-GAP-TS01` | shared blocker |
| `A-R06` | password invalid; `A-B02`–`06` | `A-TC-016`, `018`, `020`, `023`, `025`, `027`, `028` | BLOCKED | `A-GAP-IM01`, `IM04`, `TS01` | shared blocker + source |
| `A-R07` | `PC-I1/I2`, `A-B07` | `A-TC-029`–`032` | BLOCKED | `A-BUG-006`, `A-GAP-TS01` | shared blocker |
| `A-R08` | `OL-I3` | `A-TC-015` | BLOCKED | `A-GAP-TS01` | shared blocker |
| `A-R09` | `OL-I2`, `A-B08` | `A-TC-014` | BLOCKED | `A-GAP-RQ01`, `IM02`, `TS01`, `A-BLOCK-02` | shared blocker + source |
| `A-R10` | `UI-REQ` | `A-TC-035` | FAIL | `A-BUG-005` | `A-TC-035.png` |
| `A-R11` | `ES-I2`, `UI-TYPE` | `A-TC-003`, `035` | FAIL | `A-BUG-002` | `A-TC-003.png`, `035.png` |
| `A-R12` | `UI-ERROR` | `A-TC-002`, `004`, `036` | 1 PASS, 2 FAIL | `A-BUG-003` | `A-TC-002.png`, `004.png`, `036.png` |
| `A-R13` | `UI-H1`, `UI-LANG` | `A-TC-037` | FAIL | `A-BUG-007`; language phần Việt hóa PASS | `A-TC-037.png` |
| `A-R14` | `UI-TAB` | `A-TC-038` | FAIL | `A-BUG-006` | `A-TC-038.png` |
| FR-21 color | positive action | `A-TC-037` | FAIL | `A-BUG-008` | `A-TC-037.png` |
| `SEC-01` | `OUT-HASH` | `A-TC-033` | BLOCKED | `A-GAP-IM03`, `TS01` | source + shared blocker |
| `SEC-07` | OTP entropy/expiry/one-time | `A-TC-001`, `014`, `015` | 1 FAIL, 2 BLOCKED | `A-BUG-001`, `RQ01`, `IM02`, `TS01` | screenshot/source/shared blocker |

Evidence path đầy đủ có prefix `evidence/A/execution/screenshots/`; kết quả máy
đọc ở `evidence/A/execution/results.json`, trace ở
`evidence/A/execution/traces/A-FR03-full-run.zip`.

## 8. Traceability boundary chưa chạy

| Boundary | Test case | Kết quả/Gap |
|---|---|---|
| `A-B01` | `A-TC-001`, `005`–`007` | ON phát hành FAIL; reset LOW/ON/HIGH BLOCKED bởi `TS01` |
| `A-B02`–`A-B06` | `A-TC-005`, `016`–`026` | BLOCKED bởi `TS01`; thêm `IM01/IM04` |
| `A-B07` | `A-TC-005`, `029`–`032` | BLOCKED; control quan hệ không tồn tại (`A-BUG-006`) |
| `A-B08` | `A-TC-014` | Không định lượng (`RQ01`) và không có state (`IM02`) |
| `A-B09` | Không có boundary case | SRS không quy định email min/max; EP đã dùng ở TC002–004 |
| `A-B10` | Không có boundary case | SRS không quy định password max; không tự suy diễn |

## 9. Đề xuất xử lý theo thứ tự

1. Sửa `A-BUG-006` để mở khóa phần lớn suite; bổ sung confirm và kiểm tra equality.
2. Sửa OTP thành 6 chữ số và bổ sung expiry state/check sau khi chốt `RQ01`.
3. Đồng bộ password policy ở client/backend và hash password trước khi lưu.
4. Sửa email validation, inline errors, indicator/navigation và các GUI defect.
5. Chạy regression toàn bộ `A-TC-001`–`038`; không chuyển các case đang
   `BLOCKED` thành PASS/FAIL trước lần chạy thật.

## 10. Checklist sinh viên review

- [x] Xác nhận 8 confirmed defect khớp evidence.
- [x] Xác nhận `RQ01` là thiếu thông tin, không phải giá trị tự đặt thêm.
- [x] Xác nhận 4 implementation gap chỉ là source-confirmed finding.
- [x] Xác nhận `TS01` giải thích đúng 29 case `BLOCKED`.
- [x] Xác nhận traceability không thiếu `A-R01`–`A-R14`, `SEC-01`, `SEC-07`.
- [x] Chấp nhận artifact sau khi đối chiếu số liệu và evidence.
