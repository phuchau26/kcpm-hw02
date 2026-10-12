# A-FR03 — Test case design và review

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `A-FR03` |
| Feature | Quên mật khẩu và đặt lại mật khẩu (2 bước) |
| Nền tảng | Web |
| Đầu vào | `01_spec_and_oracle.md`, `02_domain_model.md`, `03_boundary_value_analysis.md` đã review |
| Kỹ thuật | Equivalence Partitioning, Boundary Value Analysis, state transition và UI conformance |
| Số test case thiết kế | 38 (`A-TC-001`–`A-TC-038`) |
| Trạng thái | `REVIEWED — USER-DELEGATED AI VERIFICATION` |
| Người yêu cầu review | Nguyễn Phúc Hậu (`23120252`) |
| Người thực hiện kiểm tra | OpenAI Codex, theo yêu cầu của sinh viên |
| Ngày review | 2026-10-12 |
| Phạm vi bước | Thiết kế test; chưa thực thi, chưa gán Pass/Fail và chưa xác nhận bug |

## 2. Quy tắc thiết kế

- Mỗi negative case cô lập một invalid partition hoặc một boundary chính khi có
  thể; các characteristic còn lại dùng nominal valid value.
- Các điểm BVA dùng đúng dữ liệu đã review trong `03_boundary_value_analysis.md`.
- Không dùng actual behavior của source code làm expected result.
- Không yêu cầu exact error message/status khi SRS/API không quy định; oracle
  tối thiểu là accept/reject, state transition và việc password cũ có đổi hay không.
- `NOT RUN` chỉ là trạng thái thiết kế. Pass/Fail/Blocked thực tế và evidence được
  ghi ở Step 5.
- Case `A-TC-014` được thiết kế nhưng chưa thể định lượng thời gian do SRS không
  công bố OTP lifetime; không tự đặt một số phút/giây.

## 3. Test data và fixture

| ID | Dữ liệu/fixture | Quy tắc sử dụng |
|---|---|---|
| `E1` | Tài khoản đã đăng ký, có quyền đăng nhập và biết password hiện tại | Tài khoản chính; ghi lại password gốc trước execution |
| `E2` | Tài khoản đã đăng ký thứ hai | Dùng kiểm tra OTP–email binding |
| `E3` | Email đúng format nhưng chưa đăng ký | Không được tạo OTP |
| `T1` | Token kiểm soát `654321`, gắn với `E1`, active và chưa dùng | Fixture Step 2; đáp ứng oracle 6 chữ số |
| `T2` | Token kiểm soát `123456`, gắn với `E2`, active và chưa dùng | Fixture kiểm tra cross-email |
| `P8` | `Aa1!bbbb` | Nominal password tại length 8 |
| `P-old` | Password hiện tại của `E1` trước mỗi case | Phải còn dùng được sau mọi negative case |

### 3.1 Nguyên tắc fixture

1. Với test Bước 1, để SUT tự sinh OTP nhằm quan sát output thật.
2. Với test Bước 2, trước tiên yêu cầu OTP qua Web để UI chuyển sang Bước 2,
   sau đó mới ghi trực tiếp `reset_token = T1` cho `E1` trong database test.
   Thứ tự này tránh endpoint forgot-password ghi đè fixture 6 chữ số bằng token
   do implementation tự sinh.
3. Trước mỗi case reset, khôi phục `E1` về `P-old` và tạo token mới, trừ case
   kiểm tra reuse cần giữ state sau lần reset thành công.
4. Sau mỗi success case, khôi phục password và token để case sau độc lập.
5. Không dùng dữ liệu production; không đưa password, token hoặc database chạy
   thử vào Git.

## 4. Procedure dùng chung

### `PROC-REQ` — Yêu cầu OTP qua Web

1. Mở trang Forgot Password trên Web.
2. Nhập email theo test data.
3. Chọn nút lấy OTP.
4. Quan sát lỗi, Step Indicator, việc chuyển bước và OTP demo display.
5. Kiểm tra database khi case yêu cầu xác nhận có/không tạo token.

### `PROC-RESET` — Gửi yêu cầu reset qua Web

1. Khôi phục password của `E1` về `P-old` và mở luồng Forgot Password.
2. Yêu cầu OTP cho `E1` để Web chuyển sang Bước 2.
3. Sau khi Bước 2 đã render, ghi token fixture của test case vào database. Với
   case “không có token”, đặt `reset_token = NULL`; với cross-email, chỉ giữ
   `T2` gắn với `E2`.
4. Nhập OTP, password mới và confirm password theo test data.
5. Submit form.
6. Quan sát accept/reject và thông báo lỗi.
7. Kiểm tra password/token trong database hoặc bằng lần đăng nhập kiểm chứng.

### `PROC-RESET-NEG` — Oracle bổ sung cho negative reset

Thực hiện `PROC-RESET`, sau đó xác nhận yêu cầu bị từ chối và `P-old` vẫn là
password hiện hành. Không khẳng định token có bị giữ lại sau lỗi vì SRS không
quy định hành vi này.

### `PROC-UI` — Kiểm tra UI conformance

Mở cả Bước 1 và Bước 2 ở viewport desktop; kiểm tra DOM bằng DevTools khi cần,
sau đó thao tác keyboard-only cho Tab order. Không suy ra HTML semantics chỉ từ
hình thức trực quan.

## 5. Test case Bước 1 — email và phát hành OTP

| Test ID | Kỹ thuật | Input/điều kiện | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `A-TC-001` | EP + output boundary | Email `E1` hợp lệ, đã đăng ký | `PROC-REQ` | Tạo OTP ngẫu nhiên gồm đúng 6 chữ số, hiển thị trực tiếp trong demo và chuyển sang Bước 2 | `ES-V1`, `EM-V1`, `OS-0→OS-1`, `A-B01-ON`, `A-R01` | `NOT RUN` |
| `A-TC-002` | EP | Email rỗng | `PROC-REQ` | Từ chối, giữ ở Bước 1, hiển thị lỗi phía trên submit và không tạo token | `ES-I1`, `A-R02`, `A-R12` | `NOT RUN` |
| `A-TC-003` | EP | `test-at-eshop` | `PROC-REQ` | HTML5/email validation từ chối; không chuyển bước và không tạo token | `ES-I2`, `A-R02`, `A-R11` | `NOT RUN` |
| `A-TC-004` | EP | Email `E3` đúng format nhưng chưa đăng ký | `PROC-REQ` | Từ chối, giữ ở Bước 1, lỗi phía trên submit và không tạo token | `EM-I1`, `A-R02`, `A-R12` | `NOT RUN` |

`A-TC-001` xác nhận format 6 chữ số, demo display và transition quan sát được.
Một lần chạy không đủ chứng minh phân phối ngẫu nhiên/entropy; kết quả execution
không được ghi “đã chứng minh random” chỉ dựa trên một OTP.

## 6. Test case OTP, binding và lifecycle

Các case negative dùng password/confirm `P8`, trừ khi bảng ghi khác.

| Test ID | Kỹ thuật | OTP/state | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `A-TC-005` | EP + BVA nominal | `T1`, active, đúng `E1`; password/confirm `P8` | `PROC-RESET` | Reset được chấp nhận; password mới hoạt động; token bị vô hiệu hóa | `S2-V1`, `A-B01-ON`, `A-B02-ON`, `A-B03-ON`, `A-B05-ON`, `A-B06-ON`, `A-R04` | `NOT RUN` |
| `A-TC-006` | BVA `B-1` | `65432` — length 5 | `PROC-RESET-NEG` | Từ chối; password hiện tại không đổi | `OF-I2`, `A-B01-LOW`, `A-R05` | `NOT RUN` |
| `A-TC-007` | BVA `B+1` | `6543210` — length 7 | `PROC-RESET-NEG` | Từ chối; password hiện tại không đổi | `OF-I2`, `A-B01-HIGH`, `A-R05` | `NOT RUN` |
| `A-TC-008` | EP | OTP rỗng | `PROC-RESET-NEG` | Từ chối; password hiện tại không đổi | `OF-I1`, `A-R05` | `NOT RUN` |
| `A-TC-009` | EP | `65A321` — length 6, có non-digit | `PROC-RESET-NEG` | Từ chối; password hiện tại không đổi | `OF-I3`, `A-R05` | `NOT RUN` |
| `A-TC-010` | EP | `65A3` — length khác 6 và có non-digit | `PROC-RESET-NEG` | Từ chối; password hiện tại không đổi | `OF-I4`, `A-R05` | `NOT RUN` |
| `A-TC-011` | EP | `999999`, đúng format nhưng khác `T1` | `PROC-RESET-NEG` | Từ chối; password hiện tại không đổi | `OV-I1`, `A-R05` | `NOT RUN` |
| `A-TC-012` | Relational domain | Dùng `T2` của `E2` để reset `E1` | `PROC-RESET-NEG` | Từ chối vì OTP không thuộc email; password của cả hai tài khoản không đổi | `OB-I1`, `A-R05` | `NOT RUN` |
| `A-TC-013` | State partition | `E1` không có token hiện hành; nhập `654321` | `PROC-RESET-NEG` | Từ chối; password hiện tại không đổi | `OL-I1`, `OS-0`, `A-R05` | `NOT RUN` |
| `A-TC-014` | State/boundary gap | OTP của `E1` ở state expired | Chỉ chạy khi có fixture tạo expired token hoặc lifetime chính thức | Từ chối reset; password hiện tại không đổi | `OL-I2`, `OS-2`, `A-B08`, `A-R09` | `DESIGNED — BLOCKED UNTIL FIXTURE/SPEC` |
| `A-TC-015` | State transition | Lần 1 dùng `T1` đặt password thành `P8`; lần 2 dùng lại `T1` nhưng yêu cầu password khác `Aa2!cccc` | `PROC-RESET`, rồi retry token cũ bằng HTTP request thứ hai | Lần đầu thành công; lần hai bị từ chối; password vẫn là `P8`, không đổi thành `Aa2!cccc` | `OL-I3`, `OS-1→OS-3`, `OUT-OTP`, `A-R08` | `NOT RUN` |

## 7. Test case password policy

Mỗi case dùng `T1` active, đúng `E1`; confirm trùng candidate password. Các
candidate valid dự kiến reset thành công; candidate invalid phải bị từ chối.

| Test ID | Kỹ thuật | Password candidate | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|
| `A-TC-016` | BVA length `B-1` | `Aa1!bbb` — length 7 | Reject; `P-old` không đổi | `PL-I2`, `A-B02-LOW`, `A-R06` | `NOT RUN` |
| `A-TC-017` | BVA length `B+1` | `Aa1!bbbbb` — length 9 | Accept reset | `PL-V1`, `A-B02-HIGH`, `A-R04` | `NOT RUN` |
| `A-TC-018` | BVA uppercase `B-1` | `aa1!bbbb` — 0 uppercase | Reject; `P-old` không đổi | `PU-I1`, `A-B03-LOW`, `A-R06` | `NOT RUN` |
| `A-TC-019` | BVA uppercase `B+1` | `AAa1!bbb` — 2 uppercase | Accept reset | `PU-V1`, `A-B03-HIGH`, `A-R04` | `NOT RUN` |
| `A-TC-020` | BVA lowercase `B-1` | `AA1!BBBB` — 0 lowercase | Reject; `P-old` không đổi | `PW-I1`, `A-B04-LOW`, `A-R06` | `NOT RUN` |
| `A-TC-021` | BVA lowercase `B` | `Aa1!BBBB` — 1 lowercase | Accept reset | `PW-V1`, `A-B04-ON`, `A-R04` | `NOT RUN` |
| `A-TC-022` | BVA lowercase `B+1` | `Aaa1!BBB` — 2 lowercase | Accept reset | `PW-V1`, `A-B04-HIGH`, `A-R04` | `NOT RUN` |
| `A-TC-023` | BVA digit `B-1` | `AaB!cccc` — 0 digit | Reject; `P-old` không đổi | `PD-I1`, `A-B05-LOW`, `A-R06` | `NOT RUN` |
| `A-TC-024` | BVA digit `B+1` | `Aa12!bbb` — 2 digits | Accept reset | `PD-V1`, `A-B05-HIGH`, `A-R04` | `NOT RUN` |
| `A-TC-025` | BVA special `B-1` | `Aa1bbbbb` — 0 allowed special | Reject; `P-old` không đổi | `PS-I1`, `A-B06-LOW`, `A-R06` | `NOT RUN` |
| `A-TC-026` | BVA special `B+1` | `Aa1!?bbb` — 2 allowed special | Accept reset | `PS-V1`, `A-B06-HIGH`, `A-R04` | `NOT RUN` |
| `A-TC-027` | Set-membership EP | `Aa1#bbbb` — `#` ngoài allowed set và không có allowed special | Reject; `P-old` không đổi | `PS-I1`, `A-R06` | `NOT RUN` |
| `A-TC-028` | EP | Password mới rỗng; confirm rỗng | Reject; `P-old` không đổi | `PL-I1`, `S2-I2`, `A-R06` | `NOT RUN` |

`A-TC-005` tái sử dụng nominal `P8` để bao phủ điểm `B` của password length,
uppercase, digit và special. `A-TC-021` riêng biệt bao phủ đúng lowercase count
bằng 1; không khai tăng coverage chỉ vì nominal `P8` có nhiều chữ thường.

Ở `A-TC-028`, password mới rỗng buộc confirm cũng rỗng nếu muốn hai chuỗi bằng
nhau; do đó `PL-I1` và `PC-I1` không thể cô lập hoàn toàn ở UI. `PL-I1` là mục
tiêu chính của case, còn `PC-I1` được kiểm tra riêng bằng `A-TC-029` với password
mới hợp lệ.

## 8. Test case confirm password và security output

| Test ID | Kỹ thuật | Dữ liệu/điều kiện | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `A-TC-029` | EP | New password `P8`; confirm rỗng | `PROC-RESET-NEG` | Từ chối; `P-old` không đổi | `PC-I1`, `A-R07` | `NOT RUN` |
| `A-TC-030` | Relational boundary | New `Aa1!bbbb`; confirm `Aa1!bbbc` | `PROC-RESET-NEG` | Từ chối vì khác đúng một ký tự; `P-old` không đổi | `PC-I2`, `A-B07-SUB`, `A-R07` | `NOT RUN` |
| `A-TC-031` | Relational boundary | New `Aa1!bbbb`; confirm `aa1!bbbb` | `PROC-RESET-NEG` | Từ chối vì khác case; `P-old` không đổi | `PC-I2`, `A-B07-CASE`, `A-R07` | `NOT RUN` |
| `A-TC-032` | Relational boundary | New `Aa1!bbbb`; confirm `Aa1!bbb` | `PROC-RESET-NEG` | Từ chối vì thiếu một ký tự; `P-old` không đổi | `PC-I2`, `A-B07-DEL`, `A-R07` | `NOT RUN` |
| `A-TC-033` | Security/output | Reset hợp lệ với `T1` và `P8`; kiểm tra storage sau success | `PROC-RESET`, sau đó inspect record của `E1` | Password lưu không trùng plaintext `P8`; cơ chế đăng nhập vẫn xác thực password mới | `OUT-HASH`, `A-R04`, SEC-01 | `NOT RUN` |

Điểm equality `A-B07-ON` được bao phủ bởi `A-TC-005`, nơi confirm trùng chính
xác `P8`.

## 9. Test case UI conformance

| Test ID | Kỹ thuật | Kiểm tra | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `A-TC-034` | Structural/UI | Step Indicator và quay lại login | `PROC-UI` ở cả hai bước | Có chỉ báo bước rõ ràng; có control quay lại đúng trang đăng nhập | `UI-STEP`, `UI-BACK`, `A-R03` | `NOT RUN` |
| `A-TC-035` | Structural/UI | Required marker, input type và confirm field | Inspect DOM bằng `PROC-UI` | Mọi field bắt buộc có `*`; email là `type=email`; password/confirm là `type=password`; confirm field tồn tại | `UI-REQ`, `UI-TYPE`, `PC`, `A-R10`, `A-R11` | `NOT RUN` |
| `A-TC-036` | Structural/UI | Vị trí lỗi | Gây lỗi ở Bước 1 và Bước 2 bằng dữ liệu invalid | Lỗi hiển thị trong trang, phía trên nút submit; không chỉ dùng alert và không đặt dưới nút | `UI-ERROR`, `A-R12` | `NOT RUN` |
| `A-TC-037` | Structural/UI | Heading, ngôn ngữ và màu nút positive action | `PROC-UI`; inspect DOM/style | Mỗi trang có đúng một `<h1>` mô tả trang; nội dung tiếng Việt; nút submit/reset dùng màu xanh dương | `UI-H1`, `UI-LANG`, `A-R13`; FR-21 color | `NOT RUN` |
| `A-TC-038` | Sequence/UI | Tab order keyboard-only | Tải lại trang; dùng Tab từ đầu ở cả hai bước | Focus đi từ trên xuống dưới, trái sang phải và tới mọi control tương tác | `UI-TAB`, `A-R14` | `NOT RUN` |

## 10. Traceability business rule → test case

| Rule | Test case bao phủ |
|---|---|
| `A-R01` | `A-TC-001` |
| `A-R02` | `A-TC-002`–`A-TC-004` |
| `A-R03` | `A-TC-034` |
| `A-R04` | `A-TC-005`, `A-TC-017`, `A-TC-019`, `A-TC-021`, `A-TC-022`, `A-TC-024`, `A-TC-026`, `A-TC-033` |
| `A-R05` | `A-TC-006`–`A-TC-013` |
| `A-R06` | `A-TC-016`, `A-TC-018`, `A-TC-020`, `A-TC-023`, `A-TC-025`, `A-TC-027`, `A-TC-028` |
| `A-R07` | `A-TC-029`–`A-TC-032` |
| `A-R08` | `A-TC-015` |
| `A-R09` | `A-TC-014` |
| `A-R10` | `A-TC-035` |
| `A-R11` | `A-TC-003`, `A-TC-035` |
| `A-R12` | `A-TC-002`, `A-TC-004`, `A-TC-036` |
| `A-R13` | `A-TC-037` |
| `A-R14` | `A-TC-038` |

## 11. Traceability boundary → test case

| Boundary | `B-1`/invalid-near | `B` | `B+1`/valid-near |
|---|---|---|---|
| `A-B01` OTP length 6 | `A-TC-006` | `A-TC-001`, `A-TC-005` | `A-TC-007` |
| `A-B02` password length 8 | `A-TC-016` | `A-TC-005` | `A-TC-017` |
| `A-B03` uppercase count 1 | `A-TC-018` | `A-TC-005` | `A-TC-019` |
| `A-B04` lowercase count 1 | `A-TC-020` | `A-TC-021` | `A-TC-022` |
| `A-B05` digit count 1 | `A-TC-023` | `A-TC-005` | `A-TC-024` |
| `A-B06` allowed-special count 1 | `A-TC-025` | `A-TC-005` | `A-TC-026` |
| `A-B07` equality | `A-TC-030`–`A-TC-032` | `A-TC-005` | Không có thứ tự số học |
| `A-B08` expiry | `A-TC-014` khi có fixture/lifetime | Chưa định lượng | Chưa định lượng |
| `A-B09` email length | Không tạo test BVA | Không có boundary trong SRS | Không tạo test BVA |
| `A-B10` password max | Không tạo test BVA | Không có boundary trong SRS | Không tạo test BVA |

## 12. Thứ tự execution đề xuất

1. Chạy `A-TC-034`–`A-TC-038` để ghi nhận control/UI hiện hữu.
2. Chạy `A-TC-001`–`A-TC-004` cho Bước 1.
3. Chuẩn bị token fixture 6 chữ số rồi chạy các negative case OTP.
4. Chạy password/confirm negative case; khôi phục fixture sau mỗi case.
5. Chạy từng success boundary case với token mới và cleanup ngay sau đó.
6. Chạy reuse và storage/security case cuối để tránh state làm nhiễu case khác.
7. Ghi `Blocked` trung thực cho case không có control/fixture; không đổi expected
   result để ép case chạy được.

## 13. Review gate

- [x] Xác nhận 38 test ID là duy nhất và liên tục.
- [x] Xác nhận mỗi invalid partition trong domain model có ít nhất một test case.
- [x] Xác nhận mọi điểm BVA khả thi có test case và data đúng file Step 3.
- [x] Xác nhận expected result chỉ dựa trên oracle, không theo implementation bug.
- [x] Xác nhận fixture 6 chữ số phù hợp để cô lập test Bước 2.
- [x] Xác nhận các success case có cleanup và negative case kiểm tra `P-old` không đổi.
- [x] Xác nhận traceability bao phủ `A-R01`–`A-R14`.
- [x] Review/correct test cases trước khi đổi trạng thái và bắt đầu Step 5.

**Review record:** Sinh viên yêu cầu AI thực hiện kiểm tra thay. Review đã đối
chiếu SRS, ba artifact Step 1–3 và đường thực thi trong `ForgotPassword.jsx`,
`server.js`, `database.js`. Hai lỗi khả thi đã được sửa: thứ tự tạo token fixture
sau khi UI sang Bước 2, và dùng password khác ở lần reuse token. Review cũng làm
rõ giới hạn chứng minh randomness và coupling không tránh được của password rỗng.
Kiểm tra tự động xác nhận 38 test ID duy nhất/liên tục, đủ invalid partition,
`A-R01`–`A-R14`, `A-B01`–`A-B10` và password data đúng length/composition. Trạng
thái trên ghi rõ đây không phải human review trực tiếp.
