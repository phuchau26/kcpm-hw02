# Môi trường kiểm thử HW02

## 1. Trạng thái tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Thời điểm ghi nhận ban đầu | 2026-10-09T10:22:29+07:00 |
| Thời điểm cập nhật smoke evidence | 2026-10-09, từ 10:31 đến 10:48 theo đồng hồ hiển thị trong ảnh |
| Thời điểm cập nhật native iOS evidence | 2026-10-16, khoảng 09:25–09:29 theo đồng hồ trong ảnh |
| Múi giờ | Asia/Saigon (`UTC+07:00`) |
| Phạm vi tài liệu | Cấu hình, khả năng khởi chạy và khả năng truy cập ban đầu vào các feature của SUT |
| Trạng thái khởi chạy | Sinh viên xác nhận đã khởi chạy được Backend, Web, Admin Web và Mobile |
| Trạng thái smoke test feature | Đã thu evidence cho bốn feature; ghi nhận ở mức `Accessible` |
| Kết luận Pass/Fail | Chưa có; smoke evidence không thay thế việc thiết kế và thực thi test case |

Tài liệu ban đầu được lập trước khi kiểm tra các feature thuộc Pool A/B/C/D. Phần cập
nhật bên dưới ghi nhận khả năng truy cập và trạng thái UI quan sát được trong smoke
test. Việc truy cập thành công không đồng nghĩa feature đã vượt qua kiểm thử chính thức.

## 2. Phiên bản SUT

| Trường thông tin | Giá trị |
|---|---|
| Repository cục bộ | `HW2/SHOP` |
| Nhánh | `main` |
| Commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Nguồn | Repository EShop do giảng viên cung cấp |
| Trạng thái cục bộ | `backend/database.sqlite` đã thay đổi và `backend/node_modules/` chưa được Git theo dõi do quá trình cài đặt/chạy |

Các thay đổi runtime nêu trên thuộc repo SUT, không được đưa vào Git repository hoặc
gói nộp của `submission-src`.

## 3. Máy thực thi

| Thành phần | Phiên bản/giá trị đã kiểm tra |
|---|---|
| Hệ điều hành | Microsoft Windows NT `10.0.22631.0` |
| Kiến trúc | `win32 x64` |
| PowerShell | `5.1.22621.6133` |
| Node.js | `v22.15.1` |
| npm | `11.8.0` |
| Git | `2.49.0.windows.1` |

`setup_guide.md` yêu cầu Node.js từ phiên bản 18.x trở lên; phiên bản đang dùng đáp
ứng điều kiện này.

## 4. Cấu hình các nền tảng

| Nền tảng | Công nghệ/phiên bản từ SUT | Lệnh khởi chạy | Địa chỉ dự kiến | Trạng thái hiện tại |
|---|---|---|---|---|
| Backend API | Node.js, Express `^5.2.1`, SQLite `^6.0.1` | `node server.js` trong `SHOP/backend` | `http://localhost:3000` | Sinh viên xác nhận đã chạy được; port 3000 không lắng nghe tại thời điểm ghi nhận |
| Frontend Web | React `^19.2.6`, Vite `^8.0.12` | `npm run dev` trong `SHOP/frontend-web` | `http://localhost:5173` | Ảnh lúc 10:31–10:33 cho thấy FR-03 và FR-09 truy cập được |
| Admin Web | React `^19.2.6`, Vite `^8.0.12` | `npm run dev` trong `SHOP/frontend-admin` | `http://localhost:5174` | Ảnh lúc 10:37 cho thấy trang quản lý danh mục truy cập được |
| Mobile — smoke/baseline chuẩn | Expo SDK package `~54.0.33`, Expo CLI `54.0.24`, React Native `0.81.5`, React `19.1.0` | `npx expo start` trong `SHOP/frontend-mobile` | `http://localhost:8081` trong lần chạy Expo Web | Smoke và execution chuẩn dùng Chrome/Chromium device emulation |
| Mobile — native supplement | Expo SDK 57, React Native `0.86.3`, React `19.2.3` | `npx expo start` và mở bằng Expo Go | API Backend qua địa chỉ LAN/configurable endpoint | 9 ảnh xác nhận app chạy và gọi API trên một thiết bị iOS thật |

Địa chỉ Vite thực tế có thể thay đổi khi port mặc định bận. Khi thu evidence, phải
ghi URL thật được Terminal cung cấp thay vì mặc định dùng giá trị dự kiến trong bảng.

## 5. Test client ghi nhận từ smoke evidence

| Thành phần | Trạng thái |
|---|---|
| Trình duyệt dùng cho Web/Admin | Giao diện ảnh cho thấy Google Chrome; phiên bản chưa được ghi nhận |
| Thiết bị hoặc emulator Mobile | Không dùng thiết bị thật hoặc native emulator; dùng Chrome device emulation với profile `iPhone 16 Pro Max` |
| Hệ điều hành Mobile | Không áp dụng cho lần smoke test Expo Web |
| Expo Go | Không áp dụng cho lần smoke test Expo Web |
| Độ phân giải/kích thước màn hình | Viewport hiển thị trong DevTools: `440 × 956` |
| Kết nối mạng Mobile–Backend | Expo Web chạy tại `localhost:8081`; API Backend được gọi qua `localhost:3000` |
| Native supplement | Thiết bị iOS thật qua Expo Go/SDK 57; model thiết bị và phiên bản iOS chưa được ghi nhận; API gọi qua LAN |

Tên trình duyệt được nhận diện từ giao diện ảnh; phiên bản chưa nhìn thấy nên không
được suy đoán. Profile device emulation chỉ mô phỏng viewport, không chứng minh hành
vi trên thiết bị iOS thật.

Bộ ảnh native được chụp sau khi nâng Expo SDK và thay đổi cấu hình endpoint. Vì
khác baseline thực thi chuẩn, ảnh chỉ bổ sung bằng chứng nền tảng, không thay đổi
verdict của các test case đã chạy bằng Playwright.

## 6. Test account và test data

- Tài liệu SUT cung cấp một Admin account mặc định. Chỉ ghi email/role trong evidence hoặc báo cáo khi cần; không đưa mật khẩu vào repository bài nộp.
- `SHOP/setup_guide.md` và `SHOP/README.md` đang ghi hai mật khẩu Admin khác nhau. Phải xác nhận credential hoạt động trong lần smoke test và ghi đây là khác biệt tài liệu nếu cần; không dùng source code hoặc một lần đăng nhập làm căn cứ duy nhất cho expected result của feature khác.
- Smoke evidence hiển thị test user `test@eshop.com` cho FR-03 và tên `Test User` cho Web/Mobile checkout; không lưu mật khẩu.
- Lệnh reset dữ liệu theo hướng dẫn là `node database.js` trong `SHOP/backend`.
- Reset database có thể xóa hoặc thay đổi test data. Trước mỗi lượt thực thi phải ghi rõ đã reset hay tái sử dụng dữ liệu hiện có.
- Không dùng dữ liệu cá nhân thật; dùng email, số điện thoại, địa chỉ và đơn hàng giả phục vụ kiểm thử.

## 7. Trạng thái feature sau smoke test ban đầu

| Mã phạm vi | Feature | Nền tảng | Trạng thái |
|---|---|---|---|
| `A-FR03` | Quên mật khẩu và đặt lại mật khẩu | Web | `Accessible` — đã mở trang nhập email và bước nhập OTP/mật khẩu mới |
| `B-FR09` | Discount Coupon | Web checkout | `Accessible` — UI hiển thị coupon `BIGBUY` được áp dụng |
| `C-FR14` | Quản lý danh mục | Admin Web | `Accessible` — đã mở trang và xem danh sách danh mục; ảnh chưa chứng minh thao tác Create/Update/Delete |
| `D-M09` | Discount Coupon | Mobile checkout qua Expo Web | `Accessible` — UI hiển thị coupon `BIGBUY` được áp dụng trong device emulation |

Các trạng thái trên chỉ mô tả màn hình quan sát được. Chưa có verdict `Pass`/`Fail`
cho test case và chưa xác nhận bug.

## 8. Danh mục smoke evidence

Ngày hiển thị trong cả năm ảnh là `09/10/2026`; theo ngữ cảnh máy và múi giờ của tài
liệu, ngày được ghi là 09 tháng 10 năm 2026 (`UTC+07:00`). Thời gian dưới đây được đọc
trực tiếp từ đồng hồ hệ điều hành xuất hiện trong ảnh.

| Mã | File evidence | Thời gian hiển thị | Màn hình/quan sát chính |
|---|---|---|---|
| `A-FR03` | `evidence/A/smoke/A-FR03-SMOKE-001-forgot-password.png` | 10:31 AM | Web `localhost:5173/forgot-password`; form nhập email và nút lấy OTP |
| `A-FR03` | `evidence/A/smoke/A-FR03-SMOKE-002-reset-password.png` | 10:31 AM | Web hiển thị OTP `7870`, nhãn OTP 4 số và form nhập mật khẩu mới |
| `B-FR09` | `evidence/B/smoke/B-FR09-SMOKE-001-web-coupon.png` | 10:33 AM | Web checkout; coupon `BIGBUY`, giảm 50.000đ, tổng 29.950.000đ |
| `C-FR14` | `evidence/C/smoke/C-FR14-SMOKE-001-category-admin.png` | 10:37 AM | Admin Web; trang quản lý và danh sách danh mục |
| `D-M09` | `evidence/D/smoke/D-M09-SMOKE-001-mobile-coupon.png` | 10:48 AM | Expo Web; device emulation `iPhone 16 Pro Max`; coupon `BIGBUY` được áp dụng |

Native supplement gồm 9 ảnh tại `evidence/D/native-ios/screenshots/`, liên quan
`D-TC-001`, `002`, `003`, `008`, `009`, `010`, `012`, `022` và `042`.

### Quan sát cần đối chiếu ở bước phân tích đặc tả

- Ảnh reset password hiển thị OTP `7870` và nhãn “Mã OTP (4 số)”. Cần đối chiếu với
  requirement/oracle của FR-03 trước khi kết luận đây là sai lệch hay bug.
- Ảnh Mobile có dòng Console `POST http://localhost:3000/api/login 401 (Unauthorized)`
  trong khi UI checkout vẫn hiển thị `Test User` và coupon được áp dụng. Cần tái hiện,
  tách request liên quan và kiểm tra log trước khi kết luận.
- Ảnh quản lý danh mục chỉ chứng minh trang truy cập được và dữ liệu hiển thị; chưa
  chứng minh các thao tác CRUD hoạt động.
- Hai ảnh coupon thể hiện một trạng thái áp dụng thành công trên UI, nhưng chưa thay
  thế test case có precondition, input, expected result và actual result được kiểm soát.

## 9. Nguồn thông tin

- `SHOP/setup_guide.md`: prerequisite, lệnh chạy, port dự kiến và cách chạy Mobile.
- `SHOP/README.md`: kiến trúc, URL mặc định và thông tin account demo.
- Các file `package.json` và `frontend-mobile/app.json`: framework và phiên bản dependency.
- Lệnh cục bộ `node --version`, `npm --version`, `git --version`, thông tin hệ điều hành và kiểm tra port.
- Xác nhận của sinh viên rằng cả bốn nền tảng đã từng khởi chạy thành công.
- Năm screenshot smoke test gốc do sinh viên chụp ngày 2026-10-09.

## 10. Việc cần cập nhật trước khi thực thi test case

- [ ] Ghi trình duyệt và phiên bản thực tế.
- [x] Ghi URL/port nhìn thấy của Web, Admin Web, Expo Web và Backend API.
- [x] Ghi môi trường Mobile thực tế là Expo Web với Chrome device emulation.
- [ ] Ghi test account bằng định danh không nhạy cảm; không lưu mật khẩu.
- [ ] Ghi trạng thái reset/seed test data.
- [x] Mở đúng bốn feature và lưu smoke evidence riêng cho từng pool.
- [x] Ghi `Accessible`; chưa đánh Pass/Fail cho test case chưa thiết kế.
- [ ] Đối chiếu requirement của OTP và điều tra request `401` quan sát trong Console.
