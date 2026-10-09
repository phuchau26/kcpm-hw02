# A-FR03 — Đặc tả và test oracle

## 1. Thông tin phân tích

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `A-FR03` |
| Feature | Quên mật khẩu và đặt lại mật khẩu (2 bước) |
| Nền tảng | Web |
| SUT commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật sẽ áp dụng | `Domain Testing`, sau đó `Boundary Value Analysis` |
| Trạng thái tài liệu | `PENDING HUMAN REVIEW` |
| Phạm vi của bước | Chốt rule, nguồn và oracle; chưa thiết kế hoặc thực thi test case |

## 2. Thứ tự ưu tiên nguồn làm oracle

1. `SHOP/README.md`, mục FR-03 và các yêu cầu bảo mật liên quan.
2. `SHOP/api_specification.md`, mục 1.3 và 1.4, dùng để xác định API contract.
3. Đề bài HW02, dùng để xác định phương pháp và sản phẩm phải nộp; đề bài không
   cung cấp rule chi tiết riêng cho FR-03.
4. UI, source code và smoke evidence chỉ được dùng để nhận diện đường thực thi và
   discrepancy. Chúng không tự động trở thành expected result.

Khi các nguồn mâu thuẫn, tài liệu giữ nguyên xung đột và đánh dấu cần xác nhận;
không chọn hành vi implementation làm oracle chỉ vì hệ thống đang chạy như vậy.

## 3. Luồng chức năng chuẩn theo requirement

### Bước 1 — Yêu cầu OTP

1. Người dùng nhập email đã đăng ký.
2. Hệ thống sinh OTP ngẫu nhiên gồm đúng 6 chữ số.
3. Trong môi trường demo, OTP được hiển thị trực tiếp trên màn hình thay cho việc
   gửi email.
4. Giao diện hiển thị chỉ báo bước, ví dụ `Bước 1 / 2`, và có thao tác quay lại
   trang đăng nhập.

### Bước 2 — Đặt lại mật khẩu

1. Người dùng nhập OTP, mật khẩu mới và xác nhận mật khẩu mới.
2. OTP phải thuộc đúng email đã yêu cầu, còn hiệu lực và chưa được sử dụng.
3. Mật khẩu mới phải thỏa chính sách mật khẩu mạnh của FR-01.
4. Mật khẩu mới và xác nhận mật khẩu phải khớp nhau.
5. Khi đặt lại thành công, OTP phải bị vô hiệu hóa và mật khẩu không được lưu
   dưới dạng plaintext.

## 4. Đặc tả input và miền dữ liệu

| ID | Input/trạng thái | Kiểu/định dạng | Miền hợp lệ | Miền không hợp lệ | Boundary hoặc quan hệ cần giữ | Nguồn và trạng thái |
|---|---|---|---|---|---|---|
| `A-IN-01` | Email | String, địa chỉ email | Đúng định dạng và đã đăng ký trong hệ thống | Rỗng; sai định dạng; đúng định dạng nhưng chưa đăng ký | Quan hệ membership với tập email đã đăng ký; độ dài min/max chưa được đặc tả | `README.md` dòng 50; định dạng email được mô tả tại FR-01 dòng 33. Cần xác nhận FR-03 có kế thừa toàn bộ validation định dạng hay không |
| `A-IN-02` | OTP | String số | Đúng 6 chữ số, thuộc email đã yêu cầu, còn hạn, chưa dùng | Rỗng; khác 6 ký tự; có ký tự không phải số; sai OTP; OTP của email khác; hết hạn; đã dùng | Độ dài `6`; quan hệ OTP–email; quan hệ thời gian; trạng thái one-time | `README.md` dòng 51, 60 và SEC-07 dòng 284 — đã có requirement; thời lượng hết hạn chưa được nêu |
| `A-IN-03` | Mật khẩu mới | String | Ít nhất 8 ký tự; có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt trong `@ $ ! % * ? &` | Rỗng; ngắn hơn 8; thiếu bất kỳ nhóm ký tự bắt buộc nào | Boundary tối thiểu `8`; độ dài tối đa chưa được đặc tả | `README.md` dòng 34 và 58 — đã có requirement |
| `A-IN-04` | Xác nhận mật khẩu mới | String | Trùng hoàn toàn với mật khẩu mới hợp lệ | Rỗng hoặc khác mật khẩu mới | Quan hệ equality với `A-IN-03`; xử lý khoảng trắng/case theo so sánh chính xác, nhưng cách normalize chưa được đặc tả | `README.md` dòng 35, 57 và 59 — đã có requirement |
| `A-ST-01` | Trạng thái OTP | Tập trạng thái | Đã phát hành cho đúng email, còn hiệu lực, chưa dùng | Chưa phát hành; hết hạn; đã dùng; đã bị thay thế nếu yêu cầu OTP mới | Chuyển trạng thái sau phát hành, hết hạn và sử dụng | SEC-07 yêu cầu có thời hạn và vô hiệu hóa sau khi dùng; hành vi khi xin OTP mới chưa được đặc tả |

## 5. Quy tắc nghiệp vụ và test oracle

| Rule ID | Điều kiện/kích thích | Expected result dùng làm oracle | Nguồn | Mức chắc chắn |
|---|---|---|---|---|
| `A-R01` | Email hợp lệ và đã đăng ký gửi yêu cầu OTP | Tạo OTP ngẫu nhiên đúng 6 chữ số; trong môi trường demo hiển thị OTP; chuyển tới bước 2 | `README.md` dòng 50–51; `api_specification.md` dòng 34–42 | Đã xác nhận về OTP 6 số và demo display; API không mô tả bước UI |
| `A-R02` | Email rỗng, sai định dạng hoặc chưa đăng ký | Không tạo OTP và không chuyển sang trạng thái đặt lại mật khẩu; thông báo/status cụ thể chưa được đặc tả | Điều kiện “Email đã đăng ký” tại `README.md` dòng 50 | Expected result tổng quát đã suy ra từ precondition; wording/status cần xác nhận |
| `A-R03` | Mở luồng quên mật khẩu | Hiển thị chỉ báo bước và thao tác quay lại trang đăng nhập | `README.md` dòng 52–53 | Đã xác nhận |
| `A-R04` | OTP đúng 6 số, đúng email, còn hạn, chưa dùng; mật khẩu hợp lệ; xác nhận khớp | Chấp nhận đặt lại mật khẩu, lưu mật khẩu theo cơ chế không plaintext và vô hiệu hóa OTP | `README.md` dòng 57–60; SEC-01, SEC-07 | Đã xác nhận ở mức nghiệp vụ; response/redirect cụ thể chưa được nêu |
| `A-R05` | OTP sai định dạng, sai giá trị, thuộc email khác, hết hạn hoặc đã dùng | Từ chối đặt lại; mật khẩu hiện có không thay đổi | `README.md` dòng 60; SEC-07 | Đã xác nhận ở mức nghiệp vụ; wording/status chưa được nêu |
| `A-R06` | Mật khẩu mới ngắn hơn 8 hoặc thiếu chữ hoa/chữ thường/chữ số/ký tự đặc biệt | Từ chối đặt lại; mật khẩu hiện có không thay đổi | FR-01 dòng 34 được FR-03 dòng 58 viện dẫn | Đã xác nhận |
| `A-R07` | Xác nhận mật khẩu rỗng hoặc khác mật khẩu mới | Từ chối đặt lại; mật khẩu hiện có không thay đổi | `README.md` dòng 57 và 59 | Đã xác nhận |
| `A-R08` | OTP đã được dùng thành công, sau đó được gửi lại | Từ chối lần dùng lại | SEC-07 dòng 284 | Đã xác nhận |
| `A-R09` | OTP vượt quá thời hạn hiệu lực | Từ chối đặt lại | SEC-07 dòng 284 | Có requirement về hết hạn nhưng thiếu thời lượng cụ thể |

## 6. API contract đã ghi nhận

| Endpoint | Request theo đặc tả API | Success response đã mô tả | Khoảng trống |
|---|---|---|---|
| `POST /api/forgot-password` | `email` | HTTP 200 với `message` và `resetToken`; ví dụ token `123456` | Không mô tả response cho email rỗng, sai định dạng hoặc chưa đăng ký |
| `POST /api/reset-password` | `email`, `resetToken`, `newPassword` | Chưa có success response trong tài liệu | Contract không có `confirmPassword`; không mô tả validation, status hoặc error response |

`confirmPassword` là rule UI/nghiệp vụ bắt buộc theo README. API có thể chỉ nhận
`newPassword` sau khi client đã so khớp hai trường, nhưng trách nhiệm validation
giữa client và server chưa được tài liệu phân định rõ.

## 7. Discrepancy quan sát từ implementation và smoke evidence

Các mục sau là quan sát cần kiểm thử hoặc làm rõ, chưa phải verdict bug:

| ID | Requirement/oracle | Quan sát implementation/UI | Evidence/nguồn quan sát | Trạng thái |
|---|---|---|---|---|
| `A-D01` | OTP đúng 6 chữ số | Backend sinh 4 chữ số; UI ghi “Mã OTP (4 số)” và smoke evidence hiển thị `7870` | `backend/server.js` dòng 72; `ForgotPassword.jsx` dòng 69; `A-FR03-SMOKE-002` | Mâu thuẫn trực tiếp, cần test và human review |
| `A-D02` | Bước 2 có mật khẩu mới và xác nhận mật khẩu mới | UI chỉ có trường mật khẩu mới; API contract cũng không có `confirmPassword` | `ForgotPassword.jsx` dòng 78–86; API spec dòng 44–52 | Thiếu thành phần so với README |
| `A-D03` | Mật khẩu đặc biệt thuộc `@ $ ! % * ? &` | Regex hiện tại yêu cầu whitespace và chỉ cho chữ, số, whitespace | `ForgotPassword.jsx` dòng 26–29 | Mâu thuẫn trực tiếp, cần test |
| `A-D04` | OTP có thời hạn | Backend chỉ lưu token, chưa quan sát thấy timestamp/expiry trong hai endpoint | `backend/server.js` dòng 68–98 | Cần kiểm tra schema và thực thi trước khi kết luận |
| `A-D05` | Có Step Indicator và nút quay lại trang đăng nhập | UI không hiển thị chỉ báo bước; nút “Quay lại” ở bước 2 đưa về bước 1 | `ForgotPassword.jsx` dòng 41–98; smoke evidence | Khác requirement; cần xác nhận thao tác điều hướng |
| `A-D06` | Email cần validation phù hợp | UI dùng `type="text"`, không phải `type="email"` | `ForgotPassword.jsx` dòng 48–55 | Validation cụ thể của FR-03 chưa rõ; không dùng FR-02 làm oracle nếu chưa xác nhận |
| `A-D07` | Mật khẩu không lưu plaintext | Backend hiện cập nhật trực tiếp `newPassword` vào cột password | `backend/server.js` dòng 87–95 | Mâu thuẫn với SEC-01; thuộc security oracle liên quan trực tiếp |

## 8. Boundary candidate cho bước BVA sau này

Danh sách này chỉ đánh dấu biên từ requirement, chưa phải test case:

- Độ dài OTP: `5`, `6`, `7` ký tự; tại độ dài 6 cần tách toàn số và có ký tự
  không phải số.
- Độ dài mật khẩu: `7`, `8`, `9` ký tự, đồng thời giữ các nhóm ký tự khác hợp lệ
  để cô lập biến độ dài.
- Với từng nhóm ký tự bắt buộc của mật khẩu: 0 và 1 ký tự thuộc nhóm đó, giữ các
  nhóm khác hợp lệ.
- Xác nhận mật khẩu: bằng hoàn toàn và khác đúng một ký tự.
- Thời gian OTP: ngay trước, đúng tại và ngay sau thời điểm hết hạn chỉ có thể xác
  định khi thời lượng và quy tắc inclusive/exclusive được cung cấp.

Không đặt boundary cho độ dài tối đa của email, OTP lifetime hoặc mật khẩu vì
các giá trị này chưa có trong nguồn requirement hiện tại.

## 9. Câu hỏi cần xác nhận

1. Thời hạn OTP chính xác là bao nhiêu giây/phút, và thời điểm hết hạn có được
   tính là hợp lệ không?
2. Khi yêu cầu OTP mới, OTP cũ có bị vô hiệu hóa ngay không?
3. FR-03 có bắt buộc áp dụng validation định dạng email giống FR-01/FR-02 không?
4. Giới hạn độ dài tối đa của email, OTP input và mật khẩu là bao nhiêu?
5. Expected status code và thông báo lỗi cho từng trường hợp không hợp lệ là gì?
6. Sau khi đặt lại mật khẩu thành công, UI phải chuyển tới trang đăng nhập hay giữ
   nguyên màn hình?
7. Việc so khớp `confirmPassword` chỉ do client thực hiện hay Backend API cũng phải
   nhận và kiểm tra trường này?

## 10. Human review gate

Trước khi chuyển sang Step 2 — mô hình Domain Testing, sinh viên cần:

- [ ] Xác nhận thứ tự ưu tiên nguồn và các rule `A-R01` đến `A-R09`.
- [ ] Xác nhận cách xử lý mâu thuẫn OTP 6 số/4 số mà không sửa oracle theo source.
- [ ] Xác nhận policy mật khẩu và vai trò của `confirmPassword`.
- [ ] Đánh dấu câu hỏi nào đã được giảng viên/TA hoặc tài liệu chính thức giải đáp.
- [ ] Chuyển trạng thái tài liệu từ `PENDING HUMAN REVIEW` sang trạng thái review phù hợp.
