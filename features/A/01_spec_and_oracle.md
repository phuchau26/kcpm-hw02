# A-FR03 — Đặc tả và test oracle

## 1. Thông tin phân tích

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `A-FR03` |
| Feature | Quên mật khẩu và đặt lại mật khẩu (2 bước) |
| Nền tảng | Web |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật sẽ áp dụng | `Domain Testing`, sau đó `Boundary Value Analysis` |
| Trạng thái tài liệu | `REVIEWED — PROJECT SOURCE BASELINE` |
| Thời điểm review | 2026-10-09T17:45:40+07:00 |
| Phạm vi của bước | Chốt rule, nguồn và oracle; chưa thiết kế hoặc thực thi test case |

## 2. Kết luận về nguồn test oracle

`SHOP/README.md` là test oracle nghiệp vụ chính vì phần mở đầu của file xác định
rõ đây là **System Requirements Specification**, mô tả **yêu cầu nghiệp vụ đúng**
và được dùng để thiết kế test case trước khi kiểm thử implementation. Phần hướng
dẫn kiểm thử trong `SHOP/setup_guide.md` tiếp tục yêu cầu bám sát SRS và cho biết
SUT được cố ý cài nhiều bug.

Thứ tự sử dụng nguồn:

1. `SHOP/README.md`: oracle cho business rule, GUI rule và security rule.
2. `SHOP/api_specification.md`: contract về endpoint, request và response đã công bố.
3. `SHOP/setup_guide.md`: cách chạy SUT và xác nhận vai trò của SRS.
4. Source code, database schema và smoke evidence: xác định đường thực thi,
   actual implementation và discrepancy; không ghi đè oracle trong SRS.

Hai README trong `frontend-web` và `frontend-admin` chỉ là nội dung mặc định của
Vite, không bổ sung business rule. Không tìm thấy file Markdown nào khác trong
`SHOP` chứa rule cho FR-03.

## 3. Phạm vi source review

| Nhóm | Nội dung đã review | Kết quả dùng cho A-FR03 |
|---|---|---|
| Toàn bộ Markdown | Năm file `.md` trong `SHOP` | Xác định SRS, API contract, cách chạy và loại hai README mặc định khỏi nguồn nghiệp vụ |
| Backend | `backend/server.js`, `backend/database.js`, package/config liên quan | Xác định hai endpoint, cách sinh/lưu/xóa OTP, schema và cách cập nhật mật khẩu |
| Frontend Web | Router, `ForgotPassword.jsx`, `Register.jsx` và cấu trúc ứng dụng | Xác định form hai bước, validation hiện tại, điều hướng và các control thực có |
| Mobile | Các đoạn forgot/reset password trong `frontend-mobile/App.js` | Đối chiếu dùng chung Backend; không dùng làm oracle hoặc evidence thay cho Web |
| Toàn dự án | Inventory 63 file, quét toàn bộ tham chiếu `forgot-password`, `reset-password`, OTP và reset token | Không phát hiện thêm rule FR-03 ngoài SRS/API nêu trên |
| Không dùng làm rule | Ảnh/static asset, SQLite runtime, `node_modules`, package lock | Không chứa đặc tả nghiệp vụ; không dùng làm oracle |

Repo `SHOP` có thay đổi runtime/local setup tại thời điểm review. Baseline nghiệp
vụ vẫn được gắn với commit nêu ở mục 1; thay đổi API URL Mobile không ảnh hưởng
oracle Web của A-FR03.

## 4. Luồng chức năng chuẩn theo SRS

### Bước 1 — Yêu cầu OTP

1. Người dùng nhập email hợp lệ đã đăng ký.
2. Hệ thống sinh OTP ngẫu nhiên gồm đúng 6 chữ số.
3. Trong môi trường demo, OTP được hiển thị trực tiếp trên màn hình thay cho việc
   gửi email.
4. Giao diện hiển thị Step Indicator, ví dụ `Bước 1 / 2`, và có nút quay lại
   trang đăng nhập.

### Bước 2 — Đặt lại mật khẩu

1. Người dùng nhập OTP, mật khẩu mới và xác nhận mật khẩu mới.
2. OTP phải thuộc đúng email đã yêu cầu, còn hiệu lực và chưa được sử dụng.
3. Mật khẩu mới phải thỏa chính sách mật khẩu mạnh của FR-01.
4. Mật khẩu mới và xác nhận mật khẩu phải khớp nhau.
5. Khi đặt lại thành công, OTP bị vô hiệu hóa và mật khẩu không được lưu dưới
   dạng plaintext.

## 5. Đặc tả input và miền dữ liệu

| ID | Input/trạng thái | Miền hợp lệ | Miền không hợp lệ | Boundary/quan hệ | Oracle |
|---|---|---|---|---|---|
| `A-IN-01` | Email | String đúng định dạng email và đã đăng ký | Rỗng; sai định dạng; đúng định dạng nhưng chưa đăng ký | Membership trong tập email đã đăng ký; min/max length không được SRS quy định | FR-03 bước 1; FR-22 yêu cầu `type="email"` |
| `A-IN-02` | OTP | String gồm đúng 6 chữ số, đúng email, còn hạn, chưa dùng | Rỗng; dài khác 6; chứa ký tự không phải số; sai giá trị; thuộc email khác; hết hạn; đã dùng | Length = 6; quan hệ OTP–email; expiry; one-time | FR-03; SEC-07 |
| `A-IN-03` | Mật khẩu mới | Ít nhất 8 ký tự; có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự trong `@ $ ! % * ? &` | Rỗng; length < 8; thiếu bất kỳ nhóm bắt buộc nào | Min length = 8; số lượng tối thiểu mỗi nhóm = 1; max length không được quy định | FR-01 được FR-03 viện dẫn |
| `A-IN-04` | Xác nhận mật khẩu mới | Trùng hoàn toàn với mật khẩu mới hợp lệ | Rỗng hoặc khác mật khẩu mới | Quan hệ equality với `A-IN-03` | FR-03 bước 2 |
| `A-ST-01` | Trạng thái OTP | Đã phát hành cho đúng email, còn hiệu lực, chưa dùng | Chưa phát hành; sai email; hết hạn; đã dùng | Chuyển trạng thái khi phát hành, hết hạn và dùng thành công | FR-03; SEC-07 |

Không tự thêm giới hạn tối đa hoặc normalization rule vì SRS không quy định.
Việc so sánh mật khẩu xác nhận được kiểm thử theo chuỗi người dùng nhập.

## 6. Business rule và expected result

| Rule ID | Điều kiện/kích thích | Expected result dùng làm oracle | Nguồn | Trạng thái review |
|---|---|---|---|---|
| `A-R01` | Email đúng định dạng và đã đăng ký | Tạo OTP ngẫu nhiên đúng 6 chữ số; demo hiển thị OTP; chuyển sang bước 2 | FR-03; API spec 1.3 | `CONFIRMED` |
| `A-R02` | Email rỗng, sai định dạng hoặc chưa đăng ký | Từ chối yêu cầu; không chuyển sang bước 2; hiển thị lỗi phía trên nút submit | FR-03 precondition; FR-22 | `CONFIRMED`; exact message/status không được quy định |
| `A-R03` | Hiển thị luồng hai bước | Có Step Indicator rõ ràng và nút quay lại trang đăng nhập | FR-03; FR-22 | `CONFIRMED` |
| `A-R04` | OTP đúng, đúng email, còn hạn, chưa dùng; hai mật khẩu hợp lệ và khớp | Đặt lại thành công; mật khẩu được lưu không plaintext; OTP bị vô hiệu hóa | FR-03; SEC-01; SEC-07 | `CONFIRMED`; redirect/response text không được quy định |
| `A-R05` | OTP sai format/value, thuộc email khác, hết hạn hoặc đã dùng | Từ chối; mật khẩu hiện có không thay đổi; hiển thị lỗi | FR-03; SEC-07; FR-22 | `CONFIRMED`; exact message/status không được quy định |
| `A-R06` | Mật khẩu mới ngắn hơn 8 hoặc thiếu nhóm ký tự bắt buộc | Từ chối; mật khẩu hiện có không thay đổi | FR-01 được FR-03 viện dẫn | `CONFIRMED` |
| `A-R07` | Xác nhận mật khẩu rỗng hoặc không khớp | Từ chối; mật khẩu hiện có không thay đổi | FR-03 | `CONFIRMED` |
| `A-R08` | Dùng lại OTP sau lần reset thành công | Từ chối lần dùng lại | SEC-07 | `CONFIRMED` |
| `A-R09` | OTP đã hết hạn | Từ chối reset | SEC-07 | `CONFIRMED`; duration không được quy định |
| `A-R10` | Render các trường bắt buộc | Mỗi label bắt buộc có ký hiệu `*` | FR-22 | `CONFIRMED` |
| `A-R11` | Render email và password | Email dùng `type="email"`; password dùng `type="password"` | FR-22 | `CONFIRMED` |
| `A-R12` | Có validation error | Lỗi xuất hiện phía trên nút submit | FR-22 | `CONFIRMED` |
| `A-R13` | Render trang | Dùng tiếng Việt và có đúng một thẻ `<h1>` mô tả trang | FR-21 | `CONFIRMED` |
| `A-R14` | Di chuyển focus bằng Tab | Focus đi từ trên xuống dưới, trái sang phải | FR-21 | `CONFIRMED` |

## 7. API contract

| Endpoint | Request theo API spec | Success response được mô tả | Phần SRS/API không quy định |
|---|---|---|---|
| `POST /api/forgot-password` | `email` | HTTP 200 với `message` và `resetToken`; ví dụ `123456` | Error status/message cho email không hợp lệ |
| `POST /api/reset-password` | `email`, `resetToken`, `newPassword` | Không ghi trong API spec | Success/error status và message |

`confirmPassword` là field UI bắt buộc theo SRS. API có thể chỉ nhận
`newPassword` sau khi UI đã so khớp hai trường; oracle end-to-end là hệ thống phải
từ chối khi hai giá trị không khớp, không phụ thuộc validation đặt ở layer nào.

## 8. Discrepancy của implementation cần kiểm thử

Các mục dưới đây là candidate nonconformance từ static review/smoke evidence,
chưa thay thế kết quả test execution và chưa được tự động ghi thành bug report.

| ID | Oracle | Implementation quan sát được | Nguồn quan sát |
|---|---|---|---|
| `A-D01` | OTP đúng 6 chữ số | Backend sinh 4 chữ số; Web ghi “Mã OTP (4 số)”; smoke evidence hiển thị `7870` | `server.js` forgot-password; `ForgotPassword.jsx`; `A-FR03-SMOKE-002` |
| `A-D02` | Bước 2 có `confirmPassword` | Web không render hoặc gửi trường xác nhận | `ForgotPassword.jsx` |
| `A-D03` | Password chứa ký tự đặc biệt trong tập SRS | Regex Web yêu cầu whitespace và chỉ cho chữ/số/whitespace | `ForgotPassword.jsx` |
| `A-D04` | OTP có thời hạn | Schema chỉ có `reset_token`, không có expiry; endpoint không kiểm tra thời gian | `database.js`; `server.js` |
| `A-D05` | Có Step Indicator và nút về login | Web thiếu Step Indicator; nút “Quay lại” đưa từ bước 2 về bước 1 | `ForgotPassword.jsx` |
| `A-D06` | Email dùng `type="email"` | Web dùng `type="text"` | `ForgotPassword.jsx` |
| `A-D07` | Password không lưu plaintext | Backend ghi trực tiếp `newPassword` vào cột `password` | `server.js`; `database.js` |
| `A-D08` | Label bắt buộc có `*` | Các label FR-03 không có ký hiệu `*` | `ForgotPassword.jsx` |
| `A-D09` | Trang có đúng một `<h1>` | Trang dùng `<h2>` và không có `<h1>` | `ForgotPassword.jsx`; `App.jsx` |
| `A-D10` | Lỗi nằm phía trên submit | Web dùng `alert()` cho lỗi ở cả hai bước | `ForgotPassword.jsx` |
| `A-D11` | Nút hành động tích cực màu xanh dương | Nút reset password ở bước 2 dùng màu xanh lá | `ForgotPassword.jsx` |
| `A-D12` | Password policy phải được thực thi end-to-end | Backend reset không validation `newPassword`; client có thể bị bypass | `server.js` |

Implementation có hai hành vi phù hợp cần lưu ý: query reset ghép email với token,
và token được đặt `NULL` sau reset thành công. Điều này hỗ trợ liên kết OTP–email
và one-time use, nhưng vẫn cần execution test để xác nhận observable behavior.

## 9. Boundary candidate cho Step 3

Danh sách này chỉ đánh dấu biên từ SRS, chưa phải test case:

- OTP length: `5`, `6`, `7`; tại length 6 tách miền toàn số và có ký tự khác số.
- Password length: `7`, `8`, `9`, giữ các nhóm ký tự khác hợp lệ để cô lập biến.
- Với từng nhóm ký tự bắt buộc: `0` và `1`, giữ các nhóm còn lại hợp lệ.
- Confirm password: bằng hoàn toàn và khác đúng một ký tự.
- OTP expiry: SRS yêu cầu có expiry nhưng không cho duration, nên chưa thể đặt
  mốc thời gian ngay dưới/tại/ngay trên biên.

Không đặt boundary cho max email/password length hoặc OTP lifetime cụ thể vì dự
án không cung cấp các giá trị đó.

## 10. Các giá trị không được dự án quy định

Các nội dung sau được đánh dấu `NOT SPECIFIED`, không còn coi là câu hỏi chặn
toàn bộ Step 2:

- Duration cụ thể và quy tắc inclusive/exclusive của OTP expiry.
- Max length của email và password.
- Exact HTTP error status/message cho phần lớn invalid partition.
- Điều hướng hoặc success message sau reset.
- Hành vi nghiệp vụ bắt buộc khi xin OTP mới; implementation hiện ghi đè token cũ.

Test case không được tự tạo expected value cho các nội dung trên. Có thể kiểm thử
phần rule đã xác định hoặc ghi `Assumption`/`Not Testable` cho phần phụ thuộc giá
trị còn thiếu.

## 11. Review record

- [x] Đã đọc toàn bộ năm file Markdown trong `SHOP`.
- [x] Đã inventory toàn bộ dự án và quét mọi tham chiếu FR-03/OTP/reset token.
- [x] Đã đọc đầy đủ Backend endpoint/schema và Frontend Web liên quan A-FR03.
- [x] Đã đối chiếu implementation Mobile nhưng không dùng thay Web oracle.
- [x] Đã xác nhận `SHOP/README.md` là SRS nghiệp vụ đúng của bài.
- [x] Đã map input/rule/UI requirement tới oracle tương ứng.
- [x] Đã tách requirement, API contract, implementation discrepancy và giá trị
  `NOT SPECIFIED`.
- [x] Đã giữ nguyên mâu thuẫn OTP 6 số/4 số để kiểm thử, không sửa oracle theo code.

**Kết luận review:** Step 1 đủ cơ sở để chuyển sang `02_domain_model.md`. Các rule
`A-R01`–`A-R14` được dùng làm baseline; phần `NOT SPECIFIED` không được tự suy
diễn thành expected result.
