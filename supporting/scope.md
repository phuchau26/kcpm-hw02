# Phạm vi thực hiện HW02

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Bài tập | HW02 — Domain Testing trên EShop |
| Người phụ trách phạm vi | Nguyễn Phúc Hậu — MSSV 23120252 |
| Thời điểm ghi nhận | 2026-10-09T09:00:33+07:00 |
| Múi giờ | Asia/Saigon (`UTC+07:00`) |
| Thư mục SUT | `SHOP/` |
| Nhánh SUT | `main` |
| Commit SUT | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Nguồn phân công | Sinh viên xác nhận trong phiên làm việc với Codex |
| Bằng chứng không trùng feature trong nhóm | Chưa bổ sung; cần lấy từ bảng phân công hoặc xác nhận của nhóm |

## 2. Các feature được phân công

Sinh viên sẽ áp dụng cả `Domain Testing` và `Boundary Value Analysis` cho bốn
feature sau, mỗi pool một feature.

| Pool | Mã phạm vi | Feature được phân công | Nền tảng | Trạng thái |
|---|---|---|---|---|
| A | `A-FR03` | FR-03 — Quên mật khẩu và đặt lại mật khẩu gồm hai bước | Web | Sinh viên đã xác nhận |
| B | `B-FR09` | FR-09 — Discount Coupon | Web checkout | Sinh viên đã xác nhận |
| C | `C-FR14` | FR-14 — Quản lý danh mục | Admin Web | Sinh viên đã xác nhận |
| D | `D-M09` | Mobile Feature 9 — Discount Coupon được kiểm thử trên ứng dụng Mobile | React Native / Expo Mobile | Sinh viên đã xác nhận; vẫn cần bằng chứng tên feature chính thức từ bảng phân công hoặc Moodle |

`B-FR09` và `D-M09` sử dụng cùng nhóm quy tắc nghiệp vụ của coupon nhưng được
thực hiện trên hai nền tảng khác nhau. Hai phạm vi này được xem là hai phần phân
công riêng biệt: Pool B kiểm thử luồng Web checkout, còn Pool D kiểm thử luồng
Mobile checkout. Evidence, thông tin môi trường và kết quả thực thi phải được thu
thập riêng; kết quả trên một nền tảng không được dùng để khẳng định nền tảng còn
lại đã được kiểm thử.

## 3. Phạm vi chi tiết của từng feature

### 3.1 Pool A — `A-FR03`

**Bao gồm**

- Bước 1: yêu cầu OTP đặt lại mật khẩu bằng email đã đăng ký.
- Quy tắc OTP gồm sáu chữ số được cung cấp trong môi trường kiểm thử.
- Chỉ báo bước và thao tác quay lại trang đăng nhập nếu thuộc phạm vi feature.
- Bước 2: OTP, mật khẩu mới, xác nhận mật khẩu, chính sách mật khẩu và quy tắc hai mật khẩu phải khớp nhau.
- Quan hệ giữa OTP và email đã dùng để yêu cầu OTP.
- Các miền hợp lệ, không hợp lệ, giá trị biên và ràng buộc phụ thuộc được suy ra từ yêu cầu đã kiểm chứng.

**Không bao gồm, trừ khi cần làm điều kiện tiên quyết hoặc test oracle**

- Kiểm thử toàn bộ chức năng đăng ký ngoài những quy tắc mật khẩu được FR-03 viện dẫn.
- Kiểm thử chung chức năng đăng nhập và khóa tài khoản.
- Độ tin cậy của nhà cung cấp email ngoài hành vi demo được SUT quy định.

### 3.2 Pool B — `B-FR09`

**Bao gồm**

- Nhập và áp dụng coupon trong luồng Web checkout.
- Trạng thái tồn tại/hoạt động, hạn sử dụng, ngưỡng tối thiểu của đơn hàng, trạng thái đăng nhập và giới hạn số lần dùng của từng người dùng.
- Công thức giảm giá loại `percent` và `fixed`.
- Kết quả `discount_amount` và `final_amount`.
- Coupon mẫu chỉ được dùng làm test data có kiểm soát; expected result vẫn phải dựa trên quy tắc nghiệp vụ.

**Không bao gồm, trừ khi cần chuẩn bị hoặc dọn test data**

- Coupon CRUD dành cho Admin thuộc FR-17.
- Các hành vi chung của giỏ hàng và checkout không liên quan đến việc áp dụng coupon.
- Chuyển trạng thái đơn hàng sau checkout.

### 3.3 Pool C — `C-FR14`

**Bao gồm**

- Quyền Admin cần thiết để truy cập chức năng quản lý danh mục.
- Xem, thêm và xóa danh mục.
- Kiểm tra tên danh mục bắt buộc, bao gồm miền dữ liệu rỗng và các giá trị biên phù hợp.
- Chuẩn bị và dọn test data phục vụ thực thi test case.

**Điểm cần làm rõ**

- Tên feature ghi “Category CRUD”, nhưng `README.md` hiện chỉ mô tả thao tác Thêm, Xem và Xóa. Không được tự suy đoán hành vi Update. Chỉ đưa Update vào phạm vi và đặt expected result khi có đặc tả chính thức hoặc xác nhận của giảng viên/TA.

**Không bao gồm nếu chưa có xác nhận bổ sung**

- Product CRUD và import sản phẩm.
- Quản lý coupon, đơn hàng và người dùng.
- Các phép tính trên Dashboard.

### 3.4 Pool D — `D-M09`

**Bao gồm**

- Nhập và áp dụng Discount Coupon từ giao diện Mobile checkout.
- Các điều kiện nghiệp vụ của FR-09 đã được kiểm chứng, nhưng thực thi thông qua Mobile client.
- Giá trị nhập, thông báo, cập nhật trạng thái, trạng thái loading/disabled, số tiền giảm và thành tiền hiển thị trên Mobile.
- Thực thi trên thiết bị hoặc emulator có ghi rõ hệ điều hành, phiên bản Expo/app và phiên bản backend.
- Ảnh chụp và actual result trên Mobile được lưu riêng với Web evidence.

**Điểm cần xác nhận và lưu bằng chứng**

- Đề bài PDF không liệt kê chi tiết từng feature của Pool D.
- `README.md` của SUT nhóm các chức năng Mobile dưới FR-20 và không nêu coupon trong danh sách tóm tắt.
- `frontend-mobile/App.js` có trạng thái coupon, thao tác áp dụng, request đến `/apply-coupon`, phần hiển thị lỗi/kết quả và thành tiền sau giảm. Điều này chứng minh có đường thực thi trong implementation nhưng source code không thể tự làm test oracle cho expected result.
- Cần lưu bảng phân công nhóm, mô tả trên Moodle hoặc xác nhận của giảng viên/TA để chứng minh “Mobile Feature 9 — Discount Coupon” là lựa chọn hợp lệ của Pool D.

**Không bao gồm, trừ khi cần làm điều kiện tiên quyết**

- Các chức năng Mobile khác như đăng ký, hồ sơ, lịch sử đơn hàng và hủy đơn.
- Kiểm thử giao diện tổng quát không liên quan đến coupon.
- Dùng kết quả thực thi trên Web thay cho kết quả thực thi trên Mobile.

## 4. Nguồn yêu cầu và mục đích sử dụng

| Nguồn | Mục đích sử dụng |
|---|---|
| `references/assignment/HW02_Domain_Testing_Assignment_En.pdf` | Quy định bài tập, yêu cầu chọn bốn pool, kỹ thuật bắt buộc, sản phẩm cần nộp và cách tính điểm |
| `SHOP/README.md` | Nguồn quy tắc chức năng hiện có cho FR-03, FR-09, FR-14 và các chức năng Mobile chung |
| `SHOP/api_specification.md` | API contract và chi tiết request/response; phải đối chiếu với `README.md` |
| `SHOP/setup_guide.md` | Cách chuẩn bị môi trường và điều kiện chạy Web/Mobile |
| `SHOP/frontend-mobile/App.js` | Khảo sát implementation và xác định đường kiểm thử; không dùng làm test oracle duy nhất |
| Slide bài giảng | Phương pháp, thuật ngữ và quy tắc chọn test case cho Domain Testing và Boundary Value Analysis |
| Bảng phân công/Moodle/xác nhận giảng viên | Tên chính thức của Mobile feature và bằng chứng không trùng phân công |

Nếu hai nguồn chính thức mâu thuẫn, phải ghi xung đột vào `assumptions.md` và làm
rõ trước khi đặt expected result chính thức.

## 5. Nội dung chung nằm trong phạm vi

- Domain Testing và Boundary Value Analysis cho cả bốn phạm vi feature/nền tảng.
- Giải thích phương pháp theo từng bước và traceability từ quy tắc đến domain, boundary và test case.
- Human review đối với mọi nội dung do AI hỗ trợ tạo.
- Trạng thái thực thi và evidence thật đối với các test case đã chạy.
- AI gap analysis và ghi nhận trung thực test case ở trạng thái `Not Run` hoặc `Blocked`.
- Bug đã được kiểm chứng phải có trong báo cáo Markdown và GitHub Issues của nhóm, kèm screenshot.
- AI Audit Report, AI Disclosure, AI Critique, prompt log, Git commit log, bảng tổng hợp trong README, skill/demo nếu thực hiện và các định dạng nộp bắt buộc.

## 6. Nội dung chung ngoài phạm vi

- Các feature ngoài `A-FR03`, `B-FR09`, `C-FR14` và `D-M09`, trừ điều kiện tiên quyết, test data hoặc bước dọn dữ liệu cần thiết.
- Yêu cầu, expected result, kết quả thực thi, screenshot, bug, timestamp hoặc AI gap bị tạo giả.
- Mặc định xem hành vi hiện tại của implementation là đúng khi đặc tả bị thiếu hoặc mâu thuẫn.
- Chia sẻ prompt hoặc sao chép kết quả giữa các sinh viên.

## 7. Các việc cần xác nhận trước khi khóa phạm vi

Chỉ chuyển sang phân tích test chi tiết sau khi hoàn thành các mục sau:

- [ ] Có bằng chứng từ bảng phân công nhóm rằng bốn feature không trùng với thành viên khác.
- [ ] Có nguồn chính thức xác nhận Mobile Feature 9 là Discount Coupon.
- [ ] Đã kiểm tra deadline và danh sách tài liệu cần nộp trên Moodle.
- [ ] Đã xác nhận thao tác Update của FR-14 nằm trong hay ngoài phạm vi.
- [ ] Có slide môn học để áp dụng đúng phương pháp Domain Testing/BVA.
- [ ] Có thể truy cập bốn feature trên Web, Admin Web và Mobile.
- [ ] Có phương án reset hoặc dọn test data an toàn.

Khi một mục chưa được giải quyết, nội dung liên quan phải được đánh dấu là giả định
hoặc quan sát từ implementation, không được trình bày như yêu cầu đã xác nhận.
