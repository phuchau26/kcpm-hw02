# B-FR09 — Đặc tả và test oracle

## 1. Thông tin phân tích

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `B-FR09` |
| Feature | FR-09 — Discount Coupon |
| Nền tảng | Web checkout |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật dự kiến | `Domain Testing`, sau đó `Boundary Value Analysis` |
| Trạng thái tài liệu | `REVIEWED — HUMAN APPROVED` |
| Thời điểm review | 2026-10-13 10:45:03 +07:00 |
| Phạm vi bước | Chốt business rule, input, precondition và test oracle; chưa thiết kế hoặc thực thi test case |

## 2. Kết luận về nguồn test oracle

`SHOP/README.md` là test oracle nghiệp vụ chính. Phần mở đầu của file tự xác định
đây là **System Requirements Specification**, mô tả yêu cầu nghiệp vụ đúng để
thiết kế test case trước khi kiểm thử implementation. `SHOP/setup_guide.md` tiếp
tục yêu cầu bám sát SRS và cho biết SUT được cố ý cài nhiều bug.

Thứ tự sử dụng nguồn:

1. `SHOP/README.md`: oracle cho FR-08, FR-09, các GUI rule liên quan và điều kiện
   dữ liệu coupon được tạo theo FR-17.
2. `SHOP/api_specification.md`: contract đã công bố cho `POST /api/apply-coupon`.
3. `SHOP/setup_guide.md`: cách chạy SUT và xác nhận vai trò của SRS.
4. Source Web, Backend và database schema: xác định đường thực thi cùng hành vi
   hiện tại; không được dùng để sửa expected result theo implementation.

Khi API specification thiếu hoặc mâu thuẫn với SRS, SRS được giữ làm business
oracle và mâu thuẫn được ghi rõ. Hai README trong các frontend là nội dung mặc
định của Vite, không bổ sung rule cho coupon.

## 3. Phạm vi và source đã review

### 3.1 Trong phạm vi

- Nhập và áp dụng coupon tại Web checkout.
- Năm điều kiện C1–C5 của FR-09.
- Công thức `percent`, `fixed`, `discount_amount` và `final_amount`.
- Quan hệ với tổng tiền checkout đáng tin cậy theo FR-08.
- Phản hồi và trình bày kết quả coupon trên Web.
- Schema/seed coupon và usage chỉ để xác định test data, precondition và đường
  thực thi.

### 3.2 Ngoài phạm vi

- Coupon CRUD trên Admin thuộc FR-17, trừ rule toàn vẹn dữ liệu làm precondition.
- Coupon trên Mobile thuộc `D-M09`; evidence Web không thay cho Mobile.
- Hành vi giỏ hàng, tạo đơn và chuyển trạng thái đơn không liên quan trực tiếp,
  trừ việc xác định tổng tiền và ghi nhận lượt dùng coupon.

### 3.3 Source review

| Nhóm | File/logic đã đọc | Mục đích |
|---|---|---|
| Tài liệu | Toàn bộ 5 file Markdown trong `SHOP` | Xác định SRS, API contract, cách chạy và loại tài liệu Vite mặc định |
| Web UI | `frontend-web/src/pages/Checkout.jsx` | Input code, request áp dụng, loading/error/result và số tiền hiển thị |
| Web state/navigation | `App.jsx`, `Cart.jsx`, `AuthContext.jsx`, `CartContext.jsx` | Điều kiện đăng nhập, route checkout, JWT, user và nguồn `cartTotal` |
| Backend | `backend/server.js` | Authentication middleware, checkout, apply coupon, usage recording và inline validation |
| Database | `backend/database.js` | Schema `coupons`, `coupon_usage`, default và coupon seed |
| Đối chiếu ngoài phạm vi | `frontend-admin/src/App.jsx`, `frontend-mobile/App.js` | Xác nhận Admin/Mobile có đường coupon riêng; không dùng làm oracle/evidence cho Pool B |

Đã inventory 63 file dự án sau khi loại generated dependency/build và tìm thấy 7
file có tham chiếu coupon/discount. Không có validation module riêng cho FR-09;
validation hiện tại nằm trực tiếp trong `Checkout.jsx` và `server.js`.

Repo `SHOP` có thay đổi runtime/local ở database và Mobile tại thời điểm review.
Các thay đổi đó không được dùng làm baseline nghiệp vụ của Web; baseline vẫn là
commit nêu tại mục 1.

## 4. Luồng chức năng chuẩn theo SRS

### 4.1 Precondition

1. Người dùng có JWT hợp lệ và đang ở Web checkout.
2. Giỏ hàng có dữ liệu; tổng tiền được hệ thống tính tự động từ giỏ hàng, không
   cho người dùng chỉnh sửa và phải được Backend tính lại.
3. Coupon test data có trạng thái xác định trong database: code, type,
   `discount_value`, `min_order_amount`, `expired_at`, `is_active` và
   `max_uses_per_user`.
4. Số lượt coupon đã dùng của đúng user có thể xác định từ `coupon_usage`.

### 4.2 Áp dụng coupon

1. Người dùng nhập code và yêu cầu áp dụng.
2. Hệ thống xác minh đồng thời C1–C5: tồn tại/active, còn hạn, đủ ngưỡng, đăng
   nhập bằng JWT hợp lệ và chưa hết lượt dùng.
3. Nếu một điều kiện không đạt, hệ thống từ chối áp dụng; tổng thanh toán không
   được thay đổi bởi coupon đó.
4. Nếu tất cả điều kiện đạt, hệ thống tính `discount_amount` theo type, sau đó
   tính `final_amount` và trả/hiển thị hai giá trị này.

## 5. Input, trạng thái và miền dữ liệu ở mức đặc tả

| ID | Input/trạng thái | Miền hợp lệ theo oracle | Miền không hợp lệ/không đạt | Boundary/quan hệ chính | Nguồn |
|---|---|---|---|---|---|
| `B-IN-01` | Coupon code | Code ánh xạ đúng một coupon tồn tại và `is_active = 1` | Không tồn tại hoặc inactive | Membership trong tập coupon active; length/charset/case chưa quy định | FR-09 C1 |
| `B-IN-02` | Tổng đơn hàng | Tổng do hệ thống tính từ giỏ hàng và `total >= min_order_amount` | Tổng không đáng tin cậy từ client hoặc `total < min_order_amount` | `min-1`, `min`, `min+1` theo đơn vị tiền được hỗ trợ | FR-08; FR-09 C3 |
| `B-ST-01` | Thời điểm hết hạn | Thời điểm hiện tại trước `expired_at` | Hiện tại tại hoặc sau thời điểm hết hạn | Quan hệ `now < expired_at`; timezone/granularity chưa quy định | FR-09 C2 |
| `B-ST-02` | Authentication | JWT hợp lệ, định danh được user hiện tại | Thiếu, hết hạn, sai hoặc không hợp lệ | Có/không có token; valid/invalid token | FR-09 C4; SEC-02 |
| `B-ST-03` | Số lượt đã dùng | `usage_count < max_uses_per_user` cho đúng cặp user–coupon | `usage_count >= max_uses_per_user` | `limit-1`, `limit`, `limit+1` | FR-09 C5 |
| `B-CFG-01` | Coupon type | `percent` hoặc `fixed` | Giá trị khác hai loại được công bố | Tập enum, không phải miền có thứ tự | FR-09; FR-17 |
| `B-CFG-02` | Discount value | Số dương của coupon đã được tạo hợp lệ | Không dương hoặc không phải số | Min dương phụ thuộc representation; max chưa quy định | FR-17; FR-09 formula |
| `B-CFG-03` | Minimum order amount | Giá trị `>= 0` của coupon | Giá trị âm hoặc sai kiểu | Biên `0`; sau đó quan hệ với `B-IN-02` | FR-17; FR-09 C3 |
| `B-CFG-04` | Max uses per user | Số lần `>= 1` | Nhỏ hơn 1 hoặc sai kiểu | `0`, `1`, `2` ở biên cấu hình; khi áp dụng dùng quan hệ tại `B-ST-03` | FR-17; FR-09 C5 |

`B-CFG-*` là precondition dữ liệu, không mở rộng Pool B thành kiểm thử Coupon
CRUD. Domain model ở Step 2 phải tiếp tục tách input người dùng, trạng thái hệ
thống và cấu hình coupon.

## 6. Business rule và expected result

| Rule ID | Điều kiện/kích thích | Expected result dùng làm oracle | Nguồn | Trạng thái |
|---|---|---|---|---|
| `B-R01` | Code tồn tại và active | C1 đạt; coupon được phép tiếp tục qua các kiểm tra còn lại | FR-09 C1 | `CONFIRMED` |
| `B-R02` | Code không tồn tại hoặc inactive | Từ chối áp dụng; không tạo discount cho coupon đó | FR-09 C1 | `CONFIRMED`; exact status/message chưa quy định |
| `B-R03` | `now < expired_at` | C2 đạt | FR-09 C2 | `CONFIRMED` |
| `B-R04` | `now >= expired_at` | Từ chối áp dụng vì hết hạn | FR-09 C2 | `CONFIRMED`; timezone/granularity chưa quy định |
| `B-R05` | `total >= min_order_amount` | C3 đạt, gồm cả đúng bằng ngưỡng | FR-09 C3 | `CONFIRMED` |
| `B-R06` | `total < min_order_amount` | Từ chối áp dụng | FR-09 C3 | `CONFIRMED`; exact status/message chưa quy định |
| `B-R07` | Có JWT hợp lệ | C4 đạt và hệ thống xác định user dùng để kiểm tra usage | FR-09 C4; SEC-02 | `CONFIRMED` |
| `B-R08` | Thiếu hoặc JWT không hợp lệ | Từ chối áp dụng; không được bỏ qua kiểm tra theo user | FR-09 C4; SEC-02 | `CONFIRMED`; exact status/message chưa quy định |
| `B-R09` | `usage_count < max_uses_per_user` | C5 đạt | FR-09 C5 | `CONFIRMED` |
| `B-R10` | `usage_count >= max_uses_per_user` | Từ chối áp dụng | FR-09 C5 | `CONFIRMED` |
| `B-R11` | Tất cả C1–C5 cùng đạt | Áp dụng coupon và trả kết quả gồm `discount_amount`, `final_amount` | FR-09; API spec 5.1 | `CONFIRMED` |
| `B-R12` | Type `percent` | `discount_amount = total × discount_value / 100` | FR-09 | `CONFIRMED`; rounding chưa quy định |
| `B-R13` | Type `fixed` | `discount_amount = discount_value` | FR-09 | `CONFIRMED` |
| `B-R14` | Coupon được áp dụng thành công | `final_amount = total - discount_amount` | FR-09 | `CONFIRMED`; floor tại 0 chưa quy định |
| `B-R15` | Xác định tổng dùng để kiểm tra/tính coupon | Tổng được tính tự động từ giỏ; user không sửa trực tiếp; Backend tự tính lại | FR-08 | `CONFIRMED` |
| `B-R16` | Hiển thị giá trị tiền | Dùng ký hiệu `₫` và phân cách hàng nghìn nhất quán | FR-21 | `CONFIRMED` |
| `B-R17` | Render trang checkout | Có đúng một `<h1>` mô tả trang và breadcrumb của trang con | FR-21; FR-23 | `CONFIRMED` |
| `B-R18` | Nút hành động tích cực và Tab navigation | Nút tích cực màu xanh dương; Tab order trên xuống dưới, trái sang phải | FR-21 | `CONFIRMED` |
| `B-R19` | Validation coupon thất bại | Lỗi xuất hiện phía trên nút submit/apply liên quan | FR-22 | `CONFIRMED`; exact text chưa quy định |

Các rule `B-R16`–`B-R19` là rule GUI chung áp dụng cho màn hình Web checkout,
không phải công thức coupon.

## 7. API contract và mâu thuẫn tài liệu

| Hạng mục | Contract đã công bố | Điểm cần lưu ý |
|---|---|---|
| Endpoint | `POST /api/apply-coupon` | Phù hợp đường thực thi Web hiện tại |
| Request body | `code`, `total_amount`, `user_id` | API spec không ghi Authorization header cho endpoint này |
| Success response | Có `discount_amount`, `final_amount` | Không quy định đầy đủ schema, HTTP status hoặc error response |
| Authentication | SRS yêu cầu JWT hợp lệ | API spec truyền `user_id` trong body nhưng không nêu JWT; SRS được giữ làm oracle |
| Trusted total | FR-08 yêu cầu Backend tự tính lại từ giỏ | API spec lại nhận `total_amount`; giá trị client gửi không được xem là nguồn đáng tin cậy |

`POST /api/coupon-usage` tồn tại trong implementation nhưng không được mô tả
trong API specification. Việc ghi usage là cơ chế hỗ trợ C5, không làm thay đổi
oracle rằng giới hạn phải được kiểm tra cho đúng user.

## 8. Hành vi implementation quan sát được

Các mục dưới đây là candidate discrepancy từ static review, chưa phải execution
result hoặc confirmed bug. Expected result ở mục 6 không được sửa theo các hành
vi này.

| ID | Oracle liên quan | Implementation quan sát được | Source |
|---|---|---|---|
| `B-D01` | `total >= min_order_amount` hợp lệ | Backend dùng `total_amount > min_order_amount`, từ chối đúng tại ngưỡng | `server.js:379` |
| `B-D02` | Percent = `total × value / 100` | Backend dùng `total_amount * (1 - discount_value)` ở cả hai nhánh user/no-user | `server.js:397-401`, `417-421` |
| `B-D03` | C4 yêu cầu JWT hợp lệ | `/api/apply-coupon` không dùng `authenticateToken`; thiếu `user_id` vẫn được áp dụng | `server.js:363-433` |
| `B-D04` | Usage gắn với user đã xác thực | Endpoint tin `user_id` trong body; client gửi `user?.id`, có thể bị bỏ trống hoặc giả mạo | `Checkout.jsx:28-32`; `server.js:364`, `386-416` |
| `B-D05` | Tổng do hệ thống/Backend tính và không cho sửa | Web render input sửa `editableTotal`; apply và checkout gửi giá trị client; Backend không tính lại | `Checkout.jsx:14`, `91-103`; `server.js:297-306` |
| `B-D06` | Chỉ user đăng nhập được checkout/apply | Route `/checkout` không được bảo vệ; truy cập trực tiếp vẫn render trang | `App.jsx:58`; `Checkout.jsx` |
| `B-D07` | `now` phải trước expiry | Backend chỉ từ chối khi `expiry < now`, nên trường hợp bằng nhau không bị loại theo toán tử | `server.js:380-383` |
| `B-D08` | Lỗi phía trên action liên quan | `couponError` được render sau input và nút “Áp dụng” | `Checkout.jsx:105-126` |
| `B-D09` | Nút tích cực màu xanh dương | Nút “Áp dụng” màu cam; nút checkout màu xanh lá | `Checkout.jsx:116-122`, `142-148` |
| `B-D10` | Đúng một `<h1>` và có breadcrumb | Checkout dùng `<h2>`, không có `<h1>` hoặc breadcrumb | `Checkout.jsx:78-150` |
| `B-D11` | Usage phải phản ánh lượt đã dùng | Web ghi usage bằng request riêng sau checkout, không có transaction chung với checkout | `Checkout.jsx:45-59`; `server.js:443-454` |

Hành vi phù hợp đáng lưu ý: query coupon dùng parameterized query và lọc
`is_active = 1`; query usage đếm theo đúng cặp `coupon_id`–`user_id`; UI hiển thị
`discount_amount`, `final_amount` và ký hiệu `₫`. Các điểm này vẫn cần execution
test trước khi kết luận Pass.

## 9. Boundary candidate cho Step 3

Danh sách này chỉ xác định biên có căn cứ, chưa phải test case:

- Ngưỡng đơn hàng: `min-1`, `min`, `min+1`; giá trị `min` phải hợp lệ.
- Usage limit: `limit-1`, `limit`, `limit+1`; chỉ phía dưới limit hợp lệ.
- Expiry: ngay trước, tại và ngay sau `expired_at`, sau khi đã chốt đơn vị thời
  gian/timezone phù hợp với test environment.
- `min_order_amount`: biên cấu hình `0` theo FR-17, chỉ dùng để chuẩn bị dữ liệu.
- `max_uses_per_user`: `0`, `1`, `2` ở biên cấu hình; `0` là invalid data theo
  FR-17, không phải trạng thái coupon hợp lệ để suy diễn FR-09.
- `discount_value`: biên dương nhưng chưa thể chọn bước/precision khi SRS không
  quy định representation nghiệp vụ chi tiết.

Code tồn tại/không tồn tại, active/inactive, type enum và authentication là
equivalence/state partition, không phải numeric BVA.

## 10. Requirement gap và nội dung `NOT SPECIFIED`

Không tự tạo expected result cụ thể cho các mục sau:

| Gap ID | Nội dung chưa được quy định | Ảnh hưởng đến thiết kế sau |
|---|---|---|
| `B-GAP-R01` | Code có phân biệt hoa/thường, trim whitespace hay giới hạn length/charset không | Chưa đặt boundary chuỗi hoặc oracle normalization; có thể kiểm tra exact seeded code và ghi exploratory case riêng |
| `B-GAP-R02` | Quy tắc rounding khi percent tạo số lẻ theo đơn vị tiền | Chưa đặt expected integer cho tổng làm phát sinh fractional discount |
| `B-GAP-R03` | Percent tối đa và cách xử lý fixed discount lớn hơn total | Không giả định cap 100%, cap discount hoặc floor `final_amount` tại 0 |
| `B-GAP-R04` | Timezone, granularity và representation chính xác của `expired_at` | Chưa khóa test data “ngay trước/tại/ngay sau” cho tới khi fixture/environment định nghĩa rõ |
| `B-GAP-R05` | Exact HTTP status, error/success message và schema lỗi | Test oracle tập trung accept/reject và không đổi tổng; không assert text/status ngoài contract có căn cứ |
| `B-GAP-R06` | Thời điểm một coupon được tính là “đã dùng”, tính nguyên tử với checkout và hành vi khi ghi usage thất bại | Cần ghi assumption/blocked condition cho test concurrency hoặc failure recovery nếu không có xác nhận |
| `B-GAP-R07` | Hành vi submit code rỗng và việc coupon có bắt buộc cho checkout hay không | Không coi code rỗng là vi phạm coupon nếu người dùng chỉ checkout không dùng mã; chỉ kiểm tra apply khi có oracle bổ sung |

Các gap trên không chặn việc lập domain model cho năm điều kiện C1–C5 và các
công thức đã xác nhận. Chúng phải tiếp tục được mang sang Step 2–4 thay vì được
lấp bằng hành vi hiện tại của source.

## 11. Test data baseline quan sát từ database seed

| Code | Type/value | Minimum | Expiry | Active | Limit | Vai trò dự kiến |
|---|---|---:|---|---:|---:|---|
| `SAVE10` | percent 10 | 300,000 ₫ | 2099-12-31 | 1 | 1 | Nominal percent và threshold |
| `BIGBUY` | fixed 50,000 | 500,000 ₫ | 2099-12-31 | 1 | 1 | Nominal fixed |
| `VIP100` | fixed 100,000 | 300,000 ₫ | 2099-12-31 | 1 | 2 | Usage boundary |
| `EXPIRED` | percent 20 | 100,000 ₫ | 2020-01-01 | 1 | 1 | Expired partition |

Seed chỉ là test data. Giá trị `2099-12-31` không chứng minh quy tắc expiry của
implementation đúng; fixture Step 5 cần kiểm soát clock/data nếu test sát biên.
