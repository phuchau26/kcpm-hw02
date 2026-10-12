# A-FR03 — Domain model

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `A-FR03` |
| Feature | Quên mật khẩu và đặt lại mật khẩu (2 bước) |
| Đầu vào | `01_spec_and_oracle.md` ở trạng thái `REVIEWED — PROJECT SOURCE BASELINE` |
| Kỹ thuật | Equivalence Partitioning trong Domain Testing |
| Trạng thái | `REVIEWED — HUMAN APPROVED` |
| Người review | Nguyễn Phúc Hậu (`23120252`) |
| Ngày review | 2026-10-12 |
| Mục tiêu | Chia input, quan hệ và trạng thái thành các partition có thể truy vết; chưa chọn boundary value hoặc viết test case |

## 2. Nguyên tắc mô hình hóa

- Mỗi characteristic được chia thành các partition loại trừ nhau trong chính
  characteristic đó.
- Các characteristic độc lập được giữ riêng để tránh tạo partition chồng lấn.
  Ví dụ format OTP, quan hệ OTP–email và lifecycle OTP là ba chiều khác nhau.
- Một luồng hợp lệ là phép hội của tất cả valid partition bắt buộc.
- Khi khảo sát một invalid partition ở bước thiết kế test case, các characteristic
  còn lại sẽ dùng nominal valid value để cô lập nguyên nhân.
- Không tạo max length, OTP lifetime hoặc exact error message vì spec đánh dấu
  các giá trị này là `NOT SPECIFIED`.

## 3. Domain của Bước 1 — Yêu cầu OTP

### 3.1 Email syntax (`ES`)

| Partition ID | Phân loại | Mô tả miền | Representative data sơ bộ | Expected class | Rule |
|---|---|---|---|---|---|
| `ES-V1` | Valid | Chuỗi không rỗng và thỏa HTML5 email format | `test@eshop.com` | Có thể tiếp tục kiểm tra membership | `A-R01`, `A-R11` |
| `ES-I1` | Invalid | Giá trị rỗng | `""` | Reject; giữ ở Bước 1 | `A-R02` |
| `ES-I2` | Invalid | Không rỗng nhưng sai email format | `test-at-eshop` | Reject; giữ ở Bước 1 | `A-R02`, `A-R11` |

SRS không cung cấp min/max length nên không tạo partition dựa trên độ dài email.

### 3.2 Email membership (`EM`)

Characteristic này chỉ được đánh giá khi email thuộc `ES-V1`.

| Partition ID | Phân loại | Mô tả miền | Representative data sơ bộ | Expected class | Rule |
|---|---|---|---|---|---|
| `EM-V1` | Valid | Email tồn tại trong tập user đã đăng ký | `test@eshop.com` | Tạo OTP và chuyển sang Bước 2 | `A-R01` |
| `EM-I1` | Invalid | Email đúng format nhưng không tồn tại | `notfound@eshop.com` | Reject; không tạo OTP | `A-R02` |

### 3.3 Predicate hợp lệ của Bước 1

```text
STEP1_VALID = ES-V1 ∧ EM-V1
```

`ES-I1`, `ES-I2` hoặc `EM-I1` đều làm yêu cầu OTP không hợp lệ. Không cần kết hợp
`EM` với `ES-I1/ES-I2` vì membership không có ý nghĩa khi syntax chưa hợp lệ.

## 4. Domain của Bước 2 — OTP

### 4.1 OTP presence và format (`OF`)

Các partition được phân loại theo thứ tự: empty → numeric length → character set,
nhằm bảo đảm một input chỉ thuộc một partition format.

| Partition ID | Phân loại | Mô tả miền | Representative data sơ bộ | Expected class | Rule |
|---|---|---|---|---|---|
| `OF-V1` | Valid | Đúng 6 ký tự và cả 6 đều là chữ số | `123456` | Tiếp tục kiểm tra value/binding/lifecycle | `A-R04` |
| `OF-I1` | Invalid | Rỗng | `""` | Reject reset | `A-R05` |
| `OF-I2` | Invalid | Không rỗng, chỉ gồm số nhưng length khác 6 | `1234` | Reject reset | `A-R05` |
| `OF-I3` | Invalid | Length bằng 6 nhưng có ít nhất một ký tự không phải số | `12A456` | Reject reset | `A-R05` |
| `OF-I4` | Invalid | Length khác 6 và đồng thời có ký tự không phải số | `12A4` | Reject reset | `A-R05` |

### 4.2 OTP value (`OV`)

Characteristic này chỉ được đánh giá khi OTP thuộc `OF-V1`.

| Partition ID | Phân loại | Mô tả miền | Expected class | Rule |
|---|---|---|---|---|
| `OV-V1` | Valid | Giá trị trùng OTP hiện hành đã phát hành | Tiếp tục kiểm tra binding/lifecycle | `A-R04` |
| `OV-I1` | Invalid | Đúng format nhưng không trùng OTP hiện hành | Reject reset | `A-R05` |

OTP hợp lệ phải lấy từ response/demo display của lượt chạy; `123456` chỉ là dữ
liệu minh họa format, không được hard-code làm valid OTP khi execution.

### 4.3 Quan hệ OTP–email (`OB`)

| Partition ID | Phân loại | Mô tả miền | Expected class | Rule |
|---|---|---|---|---|
| `OB-V1` | Valid | OTP được phát hành cho đúng email đang reset | Tiếp tục kiểm tra lifecycle | `A-R04` |
| `OB-I1` | Invalid | OTP hợp lệ về format/value nhưng thuộc email khác | Reject reset | `A-R05` |

### 4.4 OTP lifecycle (`OL`)

| Partition ID | Phân loại | Mô tả miền trạng thái | Expected class | Rule |
|---|---|---|---|---|
| `OL-V1` | Valid | Đã phát hành, còn hạn và chưa dùng | Có thể reset nếu các input khác hợp lệ | `A-R04` |
| `OL-I1` | Invalid | Chưa từng phát hành hoặc không có token hiện hành | Reject reset | `A-R05` |
| `OL-I2` | Invalid | Đã hết hạn | Reject reset | `A-R09` |
| `OL-I3` | Invalid | Đã dùng thành công và bị vô hiệu hóa | Reject reuse | `A-R08` |

Duration cụ thể của `OL-V1 → OL-I2` là `NOT SPECIFIED`; Step 3 không được tự đặt
boundary thời gian.

## 5. Domain của mật khẩu mới

### 5.1 Presence và length (`PL`)

| Partition ID | Phân loại | Mô tả miền | Representative data sơ bộ | Expected class | Rule |
|---|---|---|---|---|---|
| `PL-V1` | Valid | Length ≥ 8 | `Valid123!` | Tiếp tục kiểm tra composition | `A-R04`, `A-R06` |
| `PL-I1` | Invalid | Rỗng | `""` | Reject reset | `A-R06` |
| `PL-I2` | Invalid | Không rỗng và length < 8 | `Ab1!` | Reject reset | `A-R06` |

Không có partition “quá dài” vì SRS không cung cấp max length.

### 5.2 Character composition

Mỗi nhóm ký tự là một characteristic nhị phân độc lập. Password hợp lệ phải thuộc
valid partition của cả bốn nhóm.

| Characteristic | Valid partition | Invalid partition | Rule |
|---|---|---|---|
| Uppercase (`PU`) | `PU-V1`: có ≥ 1 chữ hoa | `PU-I1`: không có chữ hoa | `A-R06` |
| Lowercase (`PW`) | `PW-V1`: có ≥ 1 chữ thường | `PW-I1`: không có chữ thường | `A-R06` |
| Digit (`PD`) | `PD-V1`: có ≥ 1 chữ số | `PD-I1`: không có chữ số | `A-R06` |
| Allowed special (`PS`) | `PS-V1`: có ≥ 1 ký tự trong `@ $ ! % * ? &` | `PS-I1`: không có ký tự nào trong tập cho phép | `A-R06` |

Một ký tự đặc biệt ngoài tập cho phép, ví dụ `#`, không làm thỏa `PS-V1`. Nếu
password đồng thời chứa `!` và `#`, điều kiện special vẫn hợp lệ nhờ `!`; SRS
không cấm ký tự bổ sung nên không tạo invalid partition chỉ vì có `#`.

### 5.3 Predicate mật khẩu hợp lệ

```text
PASSWORD_VALID = PL-V1 ∧ PU-V1 ∧ PW-V1 ∧ PD-V1 ∧ PS-V1
```

## 6. Domain của xác nhận mật khẩu (`PC`)

| Partition ID | Phân loại | Mô tả miền | Expected class | Rule |
|---|---|---|---|---|
| `PC-V1` | Valid | Không rỗng và trùng hoàn toàn với mật khẩu mới | Tiếp tục reset | `A-R04`, `A-R07` |
| `PC-I1` | Invalid | Rỗng | Reject reset | `A-R07` |
| `PC-I2` | Invalid | Không rỗng nhưng khác mật khẩu mới | Reject reset | `A-R07` |

Equality được đánh giá trên chuỗi nhập thực tế; spec không định nghĩa trim,
case-folding hoặc normalization.

## 7. Composite domain của Bước 2

```text
OTP_VALID      = OF-V1 ∧ OV-V1 ∧ OB-V1 ∧ OL-V1
PASSWORD_VALID = PL-V1 ∧ PU-V1 ∧ PW-V1 ∧ PD-V1 ∧ PS-V1
CONFIRM_VALID  = PC-V1

STEP2_VALID = OTP_VALID ∧ PASSWORD_VALID ∧ CONFIRM_VALID
```

| Composite class | Điều kiện | Expected class | Rule |
|---|---|---|---|
| `S2-V1` | `STEP2_VALID` | Reset thành công; token bị vô hiệu hóa; password không lưu plaintext | `A-R04` |
| `S2-I1` | Có bất kỳ invalid OTP partition | Reject; password hiện có không đổi | `A-R05`, `A-R08`, `A-R09` |
| `S2-I2` | OTP hợp lệ nhưng có bất kỳ invalid password partition | Reject; password hiện có không đổi | `A-R06` |
| `S2-I3` | OTP/password hợp lệ nhưng `PC-I1` hoặc `PC-I2` | Reject; password hiện có không đổi | `A-R07` |

Thứ tự `S2-I1 → S2-I2 → S2-I3` là quy tắc cô lập lỗi khi thiết kế test, không
phải yêu cầu về thứ tự validation của implementation.

## 8. State model của OTP

| State ID | Trạng thái | Event vào | Event ra/expected transition | Rule |
|---|---|---|---|---|
| `OS-0` | Chưa có OTP hiện hành | Khởi tạo hoặc chưa từng yêu cầu OTP | Yêu cầu OTP hợp lệ → `OS-1` | `A-R01` |
| `OS-1` | Active | OTP được phát hành | Reset hợp lệ → `OS-3`; hết hạn → `OS-2` | `A-R04`, `A-R09` |
| `OS-2` | Expired | Vượt thời hạn | Reset bị từ chối; yêu cầu OTP mới có thể tạo `OS-1` | `A-R09` |
| `OS-3` | Consumed | Reset thành công | Mọi reuse bị từ chối | `A-R08` |

Hành vi bắt buộc khi yêu cầu OTP mới trong `OS-1` là `NOT SPECIFIED`. Source hiện
ghi đè token cũ, nhưng hành vi đó không được nâng thành oracle.

## 9. Domain conformance của UI và output

Các mục này không phải user-input partition nhưng là observable conformance domain
của cùng feature.

| Dimension ID | Conforming domain | Non-conforming domain | Rule |
|---|---|---|---|
| `UI-STEP` | Có Step Indicator rõ ràng | Thiếu hoặc không thể hiện bước hiện tại | `A-R03` |
| `UI-BACK` | Có nút về trang login | Thiếu hoặc điều hướng sang nơi khác | `A-R03` |
| `UI-REQ` | Mọi label bắt buộc có `*` | Thiếu `*` ở ít nhất một label bắt buộc | `A-R10` |
| `UI-TYPE` | Email `type=email`, password `type=password` | Sai type ở ít nhất một field | `A-R11` |
| `UI-ERROR` | Lỗi nằm phía trên submit | Lỗi ở dưới submit, chỉ alert hoặc không hiển thị | `A-R12` |
| `UI-H1` | Đúng một `<h1>` mô tả trang | Không có hoặc có nhiều hơn một `<h1>` | `A-R13` |
| `UI-LANG` | Nội dung giao diện tiếng Việt | Nội dung người dùng thấy không nhất quán ngôn ngữ | `A-R13` |
| `UI-TAB` | Tab order trên-xuống, trái-phải | Focus order khác yêu cầu | `A-R14` |
| `OUT-HASH` | Password được lưu không plaintext | Password lưu plaintext | `A-R04`, SEC-01 |
| `OUT-OTP` | OTP bị vô hiệu hóa sau reset | OTP còn dùng lại được | `A-R04`, `A-R08` |

## 10. Nominal baseline cho thiết kế test sau này

Baseline chỉ phục vụ việc giữ các biến còn lại hợp lệ; chưa phải test case:

| Biến | Nominal valid data/quy tắc lấy dữ liệu |
|---|---|
| Email | `test@eshop.com`, tài khoản seed đã đăng ký |
| OTP | OTP đúng 6 chữ số lấy từ chính response/demo display của lượt yêu cầu hiện tại |
| Mật khẩu mới | `Valid123!` |
| Xác nhận mật khẩu | Trùng chính xác với mật khẩu mới |
| OTP state | Active, đúng email, chưa dùng |

Không dùng OTP `7870` trong smoke evidence làm nominal value vì nó thuộc actual
implementation 4 số, trái oracle 6 số.

## 11. Traceability từ rule tới domain

| Rule | Domain/partition bao phủ |
|---|---|
| `A-R01` | `ES-V1`, `EM-V1`, `OS-0 → OS-1` |
| `A-R02` | `ES-I1`, `ES-I2`, `EM-I1` |
| `A-R03` | `UI-STEP`, `UI-BACK` |
| `A-R04` | `OTP_VALID`, `PASSWORD_VALID`, `PC-V1`, `S2-V1`, `OUT-HASH`, `OUT-OTP` |
| `A-R05` | `OF-I1`–`OF-I4`, `OV-I1`, `OB-I1`, `OL-I1` |
| `A-R06` | `PL-I1`, `PL-I2`, `PU-I1`, `PW-I1`, `PD-I1`, `PS-I1` |
| `A-R07` | `PC-I1`, `PC-I2` |
| `A-R08` | `OL-I3`, `OS-3`, `OUT-OTP` |
| `A-R09` | `OL-I2`, `OS-2` |
| `A-R10` | `UI-REQ` |
| `A-R11` | `ES` format, `UI-TYPE` |
| `A-R12` | `UI-ERROR` |
| `A-R13` | `UI-H1`, `UI-LANG` |
| `A-R14` | `UI-TAB` |

## 12. Quy tắc chuyển sang BVA và test case

- Step 3 mới chọn giá trị ngay dưới/tại/ngay trên boundary; file này chỉ xác định
  partition và vị trí có boundary.
- Mỗi invalid partition cần ít nhất một candidate test ở Step 4, trừ khi được gộp
  có giải thích hoặc không thể thực thi do `NOT SPECIFIED`.
- Test negative phải thay đổi một characteristic chính so với nominal baseline
  khi có thể, tránh nhiều invalid condition làm mơ hồ nguyên nhân.
- Quan hệ OTP–email, OTP lifecycle và password–confirm phải có test riêng vì
  không thể bao phủ đầy đủ bằng input format đơn lẻ.
- UI/output conformance được thiết kế test riêng, không trộn vào equivalence class
  của input nếu không cần thiết.

## 13. Human review gate

- [x] Xác nhận các partition trong từng characteristic là loại trừ nhau.
- [x] Xác nhận valid predicate của Bước 1 và Bước 2.
- [x] Xác nhận không có boundary hoặc expected result nào được tự thêm ngoài spec.
- [x] Xác nhận nominal baseline không sử dụng hành vi sai đã quan sát.
- [x] Xác nhận traceability bao phủ `A-R01` đến `A-R14`.
- [x] Chuyển trạng thái tài liệu sau khi review trước khi tạo Step 3.
