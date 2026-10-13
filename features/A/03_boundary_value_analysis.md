# A-FR03 — Boundary Value Analysis

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `A-FR03` |
| Feature | Quên mật khẩu và đặt lại mật khẩu (2 bước) |
| Đầu vào | `01_spec_and_oracle.md`; `02_domain_model.md` ở trạng thái `REVIEWED — HUMAN APPROVED` |
| Kỹ thuật | Boundary Value Analysis (BVA), kết hợp Equivalence Partitioning đã chốt ở Step 2 |
| Trạng thái | `REVIEWED` |
| Người yêu cầu review | Nguyễn Phúc Hậu (`23120252`) |
| Ngày review | 2026-10-12 |
| Mục tiêu | Chọn dữ liệu ngay dưới, tại và ngay trên các boundary có căn cứ từ SRS; chưa viết test case hoặc ghi actual result |

## 2. Cơ sở và quy ước BVA

Các boundary trong tài liệu này chỉ được lấy từ business rule đã xác nhận trong
`01_spec_and_oracle.md`:

- OTP phải gồm đúng 6 chữ số.
- Mật khẩu mới phải có ít nhất 8 ký tự.
- Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự trong
  tập `@ $ ! % * ? &`.
- Xác nhận mật khẩu phải trùng hoàn toàn với mật khẩu mới.

Áp dụng robust BVA ba điểm cho đại lượng có thứ tự:

```text
B-1 = ngay dưới boundary
B   = tại boundary
B+1 = ngay trên boundary
```

Với điều kiện `length = 6`, miền hợp lệ chỉ có đúng boundary 6 nên chọn
`5, 6, 7`. Với điều kiện `length >= 8`, chọn `7, 8, 9`. Với điều kiện số lượng
ký tự thuộc một nhóm `count >= 1`, chọn `0, 1, 2`.

Nguyên tắc cô lập biến:

- Khi thay đổi một boundary của password, giữ các nhóm ký tự còn lại hợp lệ.
- Khi thay đổi số lượng của một nhóm ký tự, giữ tổng length bằng 8 để không làm
  lẫn lỗi composition với lỗi minimum length.
- OTP hợp lệ phải lấy từ chính lượt yêu cầu hiện tại, không hard-code một giá trị
  minh họa làm OTP đúng.
- Các giá trị ở đây là test data candidate. Procedure, precondition đầy đủ và
  expected result chi tiết sẽ được viết ở Step 4.

## 3. Nominal baseline

| Biến | Giá trị/quy tắc nominal | Lý do |
|---|---|---|
| Email | `test@eshop.com`, tài khoản seed đã đăng ký | Thuộc `ES-V1 ∧ EM-V1` |
| OTP hiện hành | Ký hiệu `T`: OTP 6 chữ số lấy từ response/demo display của chính lượt chạy | Thuộc `OF-V1 ∧ OV-V1 ∧ OB-V1 ∧ OL-V1` nếu SUT tuân thủ SRS |
| Mật khẩu mới | `Aa1!bbbb` | Dài 8; có đúng 1 chữ hoa, ít nhất 1 chữ thường, đúng 1 chữ số và đúng 1 special hợp lệ |
| Xác nhận mật khẩu | Trùng chính xác với mật khẩu mới | Thuộc `PC-V1` |
| Trạng thái OTP | Active, gắn đúng email, chưa dùng | Thuộc `OL-V1 ∧ OB-V1` |

`T` không phải chuỗi cố định. Nếu hệ thống chỉ phát hành OTP 4 chữ số như static
review dự đoán, precondition cho các candidate cần OTP hợp lệ theo oracle không
đạt; kết quả đó phải được ghi ở execution như một nonconformance, không đổi
boundary từ 6 thành 4.

## 4. Inventory boundary

| Boundary ID | Characteristic | Rule | Boundary | Điểm chọn | Có thể thiết kế |
|---|---|---|---:|---|---|
| `A-B01` | OTP length | `A-R01`, `A-R04`, `A-R05` | `length = 6` | `5, 6, 7` | Có |
| `A-B02` | Password length | `A-R04`, `A-R06` | `length >= 8` | `7, 8, 9` | Có |
| `A-B03` | Số chữ hoa | `A-R04`, `A-R06` | `count >= 1` | `0, 1, 2` | Có |
| `A-B04` | Số chữ thường | `A-R04`, `A-R06` | `count >= 1` | `0, 1, 2` | Có |
| `A-B05` | Số chữ số | `A-R04`, `A-R06` | `count >= 1` | `0, 1, 2` | Có |
| `A-B06` | Số allowed special | `A-R04`, `A-R06` | `count >= 1` | `0, 1, 2` | Có |
| `A-B07` | Password–confirm equality | `A-R04`, `A-R07` | Equality boundary | Equal / lệch tối thiểu | Có, relational boundary |
| `A-B08` | OTP expiry time | `A-R09` | Duration chưa được quy định | Không thể chọn `t-1, t, t+1` | Chưa thể định lượng |
| `A-B09` | Email length | `A-R01`, `A-R02` | Min/max chưa được quy định | Không có | Không tạo boundary |
| `A-B10` | Password max length | `A-R04`, `A-R06` | Max chưa được quy định | Không có | Không tạo boundary |

## 5. Boundary của OTP length — `A-B01`

Giả sử `T = t1t2t3t4t5t6` là OTP 6 chữ số đang active của email nominal.

| Data ID | Vị trí | Dữ liệu candidate | Length | Partition dự kiến | Expected class | Rule |
|---|---|---|---:|---|---|---|
| `A-B01-LOW` | `B-1` | `t1t2t3t4t5` | 5 | `OF-I2` | Reject reset; password cũ không đổi | `A-R05` |
| `A-B01-ON` | `B` | `T` | 6 | `OF-V1`; các chiều OTP khác giữ valid | Có thể reset khi password/confirm hợp lệ | `A-R04` |
| `A-B01-HIGH` | `B+1` | `T` + `0` | 7 | `OF-I2` | Reject reset; password cũ không đổi | `A-R05` |

Các candidate 5 và 7 chữ số đồng thời không thể trùng token hiện hành. Đây là
ràng buộc tự nhiên giữa `OF` và `OV`, không phải lý do loại bỏ boundary length.
Khi đánh giá lỗi, oracle tối thiểu là yêu cầu phải bị từ chối; không yêu cầu SUT
phải báo chính xác “sai độ dài” vì exact error message không được quy định.

Các trường hợp dài 6 nhưng có ký tự không phải số (`12A456`) và khác giá trị
OTP hiện hành thuộc Equivalence Partitioning (`OF-I3`, `OV-I1`), không phải điểm
BVA mới. Chúng sẽ được đưa vào test design ở Step 4 để bao phủ partition.

## 6. Boundary của password length — `A-B02`

Ba chuỗi dưới đây đều có chữ hoa, chữ thường, chữ số và allowed special; chỉ
length thay đổi quanh boundary 8.

| Data ID | Vị trí | Password candidate | Length | Partition dự kiến | Expected class | Rule |
|---|---|---|---:|---|---|---|
| `A-B02-LOW` | `B-1` | `Aa1!bbb` | 7 | `PL-I2` | Reject reset; password cũ không đổi | `A-R06` |
| `A-B02-ON` | `B` | `Aa1!bbbb` | 8 | `PL-V1 ∧ PU-V1 ∧ PW-V1 ∧ PD-V1 ∧ PS-V1` | Password hợp lệ về policy | `A-R04`, `A-R06` |
| `A-B02-HIGH` | `B+1` | `Aa1!bbbbb` | 9 | Cùng valid partitions như trên | Password hợp lệ về policy | `A-R04`, `A-R06` |

Không chọn điểm gần max length vì SRS không quy định max. Empty password vẫn
phải được kiểm thử theo `PL-I1` ở Step 4 nhưng không phải điểm lân cận boundary 8.

## 7. Boundary số lượng nhóm ký tự bắt buộc

Mọi candidate trong mục này có length đúng 8. Mỗi bảng chỉ làm thay đổi số lượng
của nhóm đang xét; các nhóm bắt buộc còn lại vẫn hiện diện.

### 7.1 Chữ hoa — `A-B03`

| Data ID | Vị trí | Password candidate | Số chữ hoa | Partition dự kiến | Expected class |
|---|---|---|---:|---|---|
| `A-B03-LOW` | `B-1` | `aa1!bbbb` | 0 | `PU-I1` | Reject reset |
| `A-B03-ON` | `B` | `Aa1!bbbb` | 1 | `PU-V1` | Hợp lệ theo boundary chữ hoa |
| `A-B03-HIGH` | `B+1` | `AAa1!bbb` | 2 | `PU-V1` | Hợp lệ theo boundary chữ hoa |

### 7.2 Chữ thường — `A-B04`

| Data ID | Vị trí | Password candidate | Số chữ thường | Partition dự kiến | Expected class |
|---|---|---|---:|---|---|
| `A-B04-LOW` | `B-1` | `AA1!BBBB` | 0 | `PW-I1` | Reject reset |
| `A-B04-ON` | `B` | `Aa1!BBBB` | 1 | `PW-V1` | Hợp lệ theo boundary chữ thường |
| `A-B04-HIGH` | `B+1` | `Aaa1!BBB` | 2 | `PW-V1` | Hợp lệ theo boundary chữ thường |

### 7.3 Chữ số — `A-B05`

| Data ID | Vị trí | Password candidate | Số chữ số | Partition dự kiến | Expected class |
|---|---|---|---:|---|---|
| `A-B05-LOW` | `B-1` | `AaB!cccc` | 0 | `PD-I1` | Reject reset |
| `A-B05-ON` | `B` | `Aa1!bbbb` | 1 | `PD-V1` | Hợp lệ theo boundary chữ số |
| `A-B05-HIGH` | `B+1` | `Aa12!bbb` | 2 | `PD-V1` | Hợp lệ theo boundary chữ số |

### 7.4 Allowed special — `A-B06`

| Data ID | Vị trí | Password candidate | Số allowed special | Partition dự kiến | Expected class |
|---|---|---|---:|---|---|
| `A-B06-LOW` | `B-1` | `Aa1bbbbb` | 0 | `PS-I1` | Reject reset |
| `A-B06-ON` | `B` | `Aa1!bbbb` | 1 | `PS-V1` | Hợp lệ theo boundary special |
| `A-B06-HIGH` | `B+1` | `Aa1!?bbb` | 2 | `PS-V1` | Hợp lệ theo boundary special |

Tất cả candidate trong các bảng `A-B03`–`A-B06` truy vết tới `A-R06`; các điểm
hợp lệ chỉ dẫn tới reset thành công khi OTP và confirm cũng hợp lệ theo `A-R04`.

## 8. Relational boundary password–confirm — `A-B07`

Equality không có thứ tự số học để xác định `B-1/B/B+1`. Vì vậy áp dụng
relational boundary: tại quan hệ equality và lệch tối thiểu một edit, trong khi
password mới giữ nguyên và hợp lệ.

| Data ID | Quan hệ | New password | Confirm password | Partition dự kiến | Expected class | Rule |
|---|---|---|---|---|---|---|
| `A-B07-ON` | Trùng hoàn toàn | `Aa1!bbbb` | `Aa1!bbbb` | `PC-V1` | Confirm hợp lệ | `A-R04` |
| `A-B07-SUB` | Khác đúng 1 ký tự | `Aa1!bbbb` | `Aa1!bbbc` | `PC-I2` | Reject reset; password cũ không đổi | `A-R07` |
| `A-B07-CASE` | Khác case tại 1 ký tự | `Aa1!bbbb` | `aa1!bbbb` | `PC-I2` | Reject reset; password cũ không đổi | `A-R07` |
| `A-B07-DEL` | Thiếu đúng 1 ký tự | `Aa1!bbbb` | `Aa1!bbb` | `PC-I2` | Reject reset; password cũ không đổi | `A-R07` |

Confirm rỗng thuộc `PC-I1` và sẽ được bao phủ bằng Equivalence Partitioning ở
Step 4; nó không phải “ngay dưới” equality boundary theo nghĩa số học.

## 9. Boundary chưa thể định lượng hoặc không tồn tại trong spec

| Characteristic | Quyết định | Lý do và cách xử lý ở Step 4 |
|---|---|---|
| OTP expiry (`A-B08`) | `NOT QUANTIFIABLE` | SRS yêu cầu OTP hết hạn phải bị từ chối nhưng không cho lifetime hoặc quy tắc inclusive/exclusive. Bao phủ state `OL-I2` nếu fixture/API cho phép tạo token expired; không tự đặt phút/giây. |
| Email length (`A-B09`) | `NO SPECIFIED BOUNDARY` | SRS không cho min/max length. Dùng EP cho rỗng, sai format, đúng format đã đăng ký/chưa đăng ký. |
| Password max length (`A-B10`) | `NO SPECIFIED BOUNDARY` | Chỉ có minimum 8; không suy diễn max từ UI, database hay implementation. |
| OTP numeric value | `CATEGORICAL/RELATIONAL` | OTP là string 6 chữ số phải trùng token hiện hành, không phải miền số có min/max nghiệp vụ. Dùng `OV-V1/OV-I1`; không coi `000000` và `999999` là boundary value bắt buộc. |
| Allowed special set | `SET MEMBERSHIP` | Tập ký tự được liệt kê nhưng không có thứ tự. Count boundary được bao phủ ở `A-B06`; ký tự trong/ngoài tập được bao phủ bằng EP ở Step 4. |
| OTP reuse | `STATE TRANSITION` | Bao phủ `OS-1 → OS-3` rồi thử reuse theo `A-R08`, không mô hình hóa thành numeric boundary. |
| UI rules | `CONFORMANCE DOMAIN` | Indicator, label, input type, error position, `<h1>`, ngôn ngữ và Tab order là kiểm tra categorical/structural, không phải BVA. |

## 10. Traceability từ rule tới BVA

| Rule | BVA coverage | Ghi chú |
|---|---|---|
| `A-R01` | `A-B01-ON` | Kiểm tra OTP được phát hành có length 6; tính ngẫu nhiên không phải numeric boundary đã định lượng |
| `A-R02` | Không có BVA định lượng | Email dùng các partition `ES-I1`, `ES-I2`, `EM-I1` ở Step 4 |
| `A-R03` | Không áp dụng BVA | UI conformance |
| `A-R04` | `A-B01-ON`, `A-B02-ON/HIGH`, các điểm `ON/HIGH` của `A-B03`–`A-B06`, `A-B07-ON` | Chỉ đạt success class khi toàn bộ composite predicate hợp lệ |
| `A-R05` | `A-B01-LOW/HIGH` | Các OTP invalid partition khác dùng EP |
| `A-R06` | `A-B02`–`A-B06` | Bao phủ minimum length và minimum count của bốn nhóm |
| `A-R07` | `A-B07` | Relational boundary và EP cho confirm rỗng |
| `A-R08` | Không áp dụng numeric BVA | State transition/use-once test |
| `A-R09` | `A-B08 — NOT QUANTIFIABLE` | Cần fixture hoặc thông tin lifetime để chọn mốc thời gian |
| `A-R10` | Không áp dụng BVA | UI conformance |
| `A-R11` | Không áp dụng BVA | Email syntax và input type dùng EP/inspection |
| `A-R12` | Không áp dụng BVA | Vị trí lỗi là UI conformance |
| `A-R13` | Không áp dụng BVA | Heading và ngôn ngữ là structural/categorical |
| `A-R14` | Không áp dụng BVA | Tab order là sequence conformance |

## 11. Quy tắc chuyển dữ liệu BVA thành test case

Ở Step 4:

1. Tạo test case cho từng điểm `LOW`, `ON`, `HIGH` của `A-B01`–`A-B06`, nhưng
   có thể tái sử dụng một nominal success case khi cùng một data value xuất hiện.
2. Không tuyên bố nhiều coverage độc lập chỉ vì cùng chuỗi `Aa1!bbbb` nằm tại
   nhiều boundary; traceability phải chỉ rõ các boundary được quan sát trong case.
3. Với negative case, giữ OTP active và confirm khớp candidate password trừ khi
   chính quan hệ confirm là biến đang kiểm thử.
4. Expected result không dùng exact status/message nếu SRS/API không quy định;
   chỉ yêu cầu accept/reject, không đổi password cũ và vị trí lỗi theo UI rule.
5. Tách kiểm tra security output (`OUT-HASH`) và one-time OTP (`OUT-OTP`) khỏi
   input boundary để nguyên nhân pass/fail rõ ràng.
6. Đưa các invalid partition không phải boundary (`OF-I1`, `OF-I3`, `OF-I4`,
   `OV-I1`, `OB-I1`, `OL-I1`–`OL-I3`, `PL-I1`, `PC-I1`) vào bộ test EP.
7. Nếu SUT phát hành OTP 4 số, ghi actual result và evidence ở Step 5; không sửa
   data design thành boundary 3/4/5.

## 12. Review gate

- [x] Xác nhận chỉ dùng boundary có nguồn từ `A-R01`–`A-R09`.
- [x] Xác nhận dữ liệu `A-B02`–`A-B06` cô lập đúng characteristic cần kiểm tra.
- [x] Xác nhận từng chuỗi password có length và số nhóm ký tự đúng như bảng.
- [x] Xác nhận không tự đặt OTP lifetime, email max length hoặc password max length.
- [x] Xác nhận relational boundary của confirm password phù hợp với equality rule.
- [x] Xác nhận traceability giải thích đủ `A-R01`–`A-R14`, kể cả rule không áp dụng BVA.
- [x] Chuyển trạng thái tài liệu sau review trước khi viết Step 4 test case.

**Review record:** Phép kiểm tra cấu trúc xác nhận đủ 10 boundary ID, 14 rule ID,
22 data row không trùng ID và 15/15
password candidate có length/composition đúng như bảng. Các boundary được đối
chiếu lại với FR-01, FR-03 và SEC-07 trong `SHOP/README.md`. Không phát hiện nội
dung cần sửa.
