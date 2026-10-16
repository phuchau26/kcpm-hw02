# D-M09 — Đặc tả và test oracle

## 1. Thông tin phân tích

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `D-M09` |
| Feature | Mobile Feature 9 — Discount Coupon |
| Nền tảng được phân công | React Native / Expo Mobile checkout |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật dự kiến | `Domain Testing`, sau đó `Boundary Value Analysis` |
| Trạng thái tài liệu | `REVIEWED — 2 OPEN CONDITIONS` |
| Thời điểm review | 2026-10-14 16:25:57 +07:00 |
| Phạm vi bước | Chốt business rule, input, precondition, test oracle, hành vi Mobile quan sát được và requirement gap; chưa thiết kế hoặc thực thi test case |

## 2. Kết luận về nguồn test oracle

`SHOP/README.md` là test oracle nghiệp vụ chính. Tài liệu tự xác định là
**System Requirements Specification** và mô tả yêu cầu đúng của EShop để thiết kế
test trước khi đối chiếu implementation. Thứ tự sử dụng nguồn như sau:

1. `SHOP/README.md`: oracle cho FR-08, FR-09, FR-20 và các GUI requirement có thể
   áp dụng cho Mobile.
2. `SHOP/api_specification.md`: contract công bố cho `POST /api/apply-coupon`.
3. `SHOP/setup_guide.md`: cách chạy Backend và Expo, không phải nguồn business rule.
4. `SHOP/frontend-mobile/App.js`, `backend/server.js` và `backend/database.js`:
   xác định đường thực thi, test data và hành vi hiện tại; không tự động trở thành
   expected result.
5. `supporting/scope.md` và bằng chứng phân công chính thức: xác định feature này
   có hợp lệ trong Pool D hay không.

FR-20 liệt kê Checkout trong phân hệ Mobile nhưng không nêu riêng coupon. Source
Mobile chứng minh tồn tại đường nhập và áp dụng coupon, nhưng source không đủ để
chứng minh tên “Mobile Feature 9 — Discount Coupon” là lựa chọn chính thức của
Pool D. Điểm này được giữ thành requirement/scope gap, không bị che bởi việc UI
đang chạy được.

## 3. Phạm vi và source đã review

### 3.1 Trong phạm vi

- Nhập và áp dụng coupon tại Mobile checkout.
- Năm điều kiện C1–C5, công thức `percent`, `fixed`, `discount_amount` và
  `final_amount` của FR-09.
- Quan hệ với tổng tiền checkout đáng tin cậy theo FR-08.
- Trạng thái input, nút Áp dụng, loading, error, success và số tiền hiển thị trên
  Mobile.
- Hành vi khi người dùng sửa coupon code sau một lần áp dụng hoặc bị từ chối.
- Kết nối Mobile–Backend và khác biệt giữa Expo Web với native Android/iOS trong
  phạm vi testability và evidence.

### 3.2 Ngoài phạm vi

- Coupon CRUD dành cho Admin thuộc FR-17, trừ cấu hình coupon dùng làm test data.
- Các chức năng Mobile khác như đăng ký, hồ sơ, lịch sử và hủy đơn.
- Dùng kết quả hoặc evidence Web của `B-FR09` để kết luận cho Mobile.
- Xem Chrome device emulation là bằng chứng đã kiểm thử native Android/iOS.
- Tự đặt rule cho loading, double tap, normalization, retry hoặc accessibility khi
  SRS chưa quy định.

### 3.3 Source review

| Nhóm | File/logic đã đọc | Mục đích |
|---|---|---|
| SRS | `SHOP/README.md`: FR-08, FR-09, FR-20, FR-21–FR-24 và SEC-02 | Business oracle, phạm vi Mobile và GUI/security rule |
| API contract | `SHOP/api_specification.md`: mục 5.1 | Request `code`, `total_amount`, `user_id`; success trả `discount_amount`, `final_amount` |
| Mobile UI/state | `SHOP/frontend-mobile/App.js`: state checkout, `openCheckout`, `handleApplyCoupon`, `handleConfirmCheckout`, `renderCheckout` và style | Đường nhập, normalize, loading, error/result, final total và usage request |
| Backend | `SHOP/backend/server.js`: `/api/apply-coupon`, `/api/coupon-usage`, `/api/checkout` | Validation, công thức, authentication, usage và nguồn total hiện tại |
| Database | `SHOP/backend/database.js`: `coupons`, `coupon_usage`, seed | Cấu hình, precondition và test data; không mở rộng sang Admin CRUD |
| Môi trường | `SHOP/setup_guide.md`, `frontend-mobile/package.json`, `supporting/environment.md` | Expo SDK, lệnh chạy, endpoint và phân loại Expo Web/native |

Repo `SHOP` hiện có local change do chạy/cấu hình môi trường: database runtime,
dependency Mobile và `API_URL` trong `App.js` đã được đổi từ IP LAN ở baseline
sang `localhost` để chạy Expo Web. Các thay đổi này không sửa business oracle;
Step 5 phải ghi chính xác cấu hình thực tế và không đưa runtime của `SHOP` vào bài
nộp.

## 4. Qualification của smoke evidence hiện tại

Evidence `evidence/D/smoke/D-M09-SMOKE-001-mobile-coupon.png` cho thấy lúc 10:48
ngày 2026-10-09:

- UI Mobile checkout được render bằng **Expo Web** tại `localhost:8081`.
- Chrome dùng device emulation profile `iPhone 16 Pro Max`, viewport `440 × 956`.
- Coupon `BIGBUY` hiển thị trạng thái áp dụng thành công trên UI.
- Console đồng thời có một request login trả `401`; ảnh không đủ để xác định request
  đó có liên quan đến phiên coupon hiện tại hay không.

Ảnh chỉ chứng minh feature accessible và có đường hiển thị. Nó không chứng minh
behavior native, không thay test case có fixture/precondition và chưa tạo verdict
PASS/FAIL cho bất kỳ rule nào.

## 5. Luồng chức năng chuẩn theo SRS

### 5.1 Precondition

1. Người dùng có JWT hợp lệ và đã đi từ giỏ hàng đến Mobile checkout.
2. Giỏ hàng có ít nhất một sản phẩm; tổng tiền được hệ thống tính từ `price ×
   quantity`, không cho người dùng sửa và Backend phải tính lại.
3. Coupon fixture có trạng thái xác định: `code`, `type`, `discount_value`,
   `min_order_amount`, `expired_at`, `is_active`, `max_uses_per_user`.
4. Số lượt dùng được xác định cho đúng cặp user–coupon.
5. Mobile client kết nối được Backend phù hợp với môi trường đang chạy; lỗi kết nối
   phải được tách khỏi defect nghiệp vụ.

### 5.2 Áp dụng coupon

1. Người dùng nhập coupon code và kích hoạt thao tác Áp dụng.
2. Hệ thống kiểm tra đồng thời C1–C5: tồn tại/active, còn hạn, đủ ngưỡng, JWT hợp
   lệ và chưa hết lượt dùng.
3. Nếu một điều kiện không đạt, coupon bị từ chối và tổng thanh toán không được
   thay đổi bởi coupon đó.
4. Nếu tất cả điều kiện đạt, hệ thống tính `discount_amount`, sau đó tính
   `final_amount`, trả hai giá trị và Mobile hiển thị kết quả.
5. Khi checkout sử dụng coupon đã áp dụng, số tiền sử dụng phải phù hợp với kết
   quả hợp lệ và usage phải được gắn với user đã xác thực.

## 6. Input, trạng thái và miền dữ liệu ở mức đặc tả

| ID | Input/trạng thái | Miền hợp lệ theo oracle | Miền không hợp lệ/không đạt | Boundary/quan hệ chính | Nguồn |
|---|---|---|---|---|---|
| `D-IN-01` | Coupon code | Ánh xạ đúng một coupon tồn tại, active | Không tồn tại hoặc inactive | Membership; normalization/length chưa quy định | FR-09 C1 |
| `D-IN-02` | Tổng đơn hàng | Tổng hệ thống tính và `total >= minimum` | Tổng dưới minimum hoặc total client không đáng tin cậy | `min-1`, `min`, `min+1` | FR-08; FR-09 C3 |
| `D-ST-01` | Expiry | `now < expired_at` | `now >= expired_at` | Trước, tại, sau expiry | FR-09 C2 |
| `D-ST-02` | Authentication | JWT hợp lệ, định danh user hiện tại | Thiếu/hết hạn/sai token | Valid/invalid/missing token | FR-09 C4; SEC-02 |
| `D-ST-03` | Usage | `usage_count < limit` | `usage_count >= limit` | `limit-1`, `limit`, `limit+1` | FR-09 C5 |
| `D-CFG-01` | Coupon type | `percent` hoặc `fixed` | Type khác | Enum partition | FR-09; FR-17 |
| `D-CFG-02` | Discount value | Số dương của coupon hợp lệ | Không dương hoặc sai kiểu | Min dương; maximum chưa quy định | FR-17 |
| `D-UI-01` | Apply state | Có thể khởi phát một request hợp lệ | Rỗng/loading/double action chưa có oracle riêng | `idle → loading → success/error` là state model candidate | Implementation; `D-GAP-R03` |
| `D-UI-02` | Result state | Success hiển thị discount/final; reject không áp dụng discount | Exact message và cách reset chưa quy định | `none/error/success`; transition khi edit | FR-09; API contract; `D-GAP-R04`, `R05` |
| `D-ENV-01` | Mobile runtime | Môi trường ghi rõ và gọi được Backend | Sai host, mất mạng, Backend dừng | Expo Web khác native Android/iOS | Setup; `D-GAP-R10` |

Các state `D-UI-*` dùng để lập domain model và exploratory test. Chỉ phần được
FR-09/API contract xác nhận mới được dùng để đưa ra verdict nghiệp vụ.

## 7. Business rule và expected result

| Rule ID | Điều kiện/kích thích | Expected result dùng làm oracle | Nguồn | Trạng thái |
|---|---|---|---|---|
| `D-R01` | Coupon tồn tại và active | C1 đạt; tiếp tục kiểm tra các điều kiện khác | FR-09 C1 | `CONFIRMED` |
| `D-R02` | Coupon không tồn tại hoặc inactive | Từ chối; không tạo discount | FR-09 C1 | `CONFIRMED`; exact message/status chưa quy định |
| `D-R03` | `now < expired_at` | C2 đạt | FR-09 C2 | `CONFIRMED` |
| `D-R04` | `now >= expired_at` | Từ chối vì hết hạn | FR-09 C2 | `CONFIRMED`; timezone/granularity chưa quy định |
| `D-R05` | `total >= min_order_amount` | C3 đạt, gồm đúng bằng ngưỡng | FR-09 C3 | `CONFIRMED` |
| `D-R06` | `total < min_order_amount` | Từ chối coupon | FR-09 C3 | `CONFIRMED` |
| `D-R07` | JWT hợp lệ | C4 đạt; identity dùng cho usage lấy từ user đã xác thực | FR-09 C4; SEC-02 | `CONFIRMED` |
| `D-R08` | Thiếu hoặc JWT không hợp lệ | Từ chối; không được bỏ qua kiểm tra theo user | FR-09 C4; SEC-02 | `CONFIRMED` |
| `D-R09` | `usage_count < limit` | C5 đạt | FR-09 C5 | `CONFIRMED` |
| `D-R10` | `usage_count >= limit` | Từ chối coupon | FR-09 C5 | `CONFIRMED` |
| `D-R11` | C1–C5 cùng đạt | Áp dụng và trả `discount_amount`, `final_amount` | FR-09; API spec 5.1 | `CONFIRMED` |
| `D-R12` | Type `percent` | `discount_amount = total × discount_value / 100` | FR-09 | `CONFIRMED`; rounding chưa quy định |
| `D-R13` | Type `fixed` | `discount_amount = discount_value` | FR-09 | `CONFIRMED` |
| `D-R14` | Coupon áp dụng thành công | `final_amount = total - discount_amount` | FR-09 | `CONFIRMED`; floor tại 0 chưa quy định |
| `D-R15` | Xác định total | UI không cho sửa; Backend tính lại từ cart/items | FR-08 | `CONFIRMED` |
| `D-R16` | Hiển thị kết quả coupon | Mobile hiển thị discount amount và final amount của kết quả hợp lệ | FR-09; API spec 5.1 | `CONFIRMED`; bố cục/text chưa quy định |
| `D-R17` | Hiển thị tiền | Dùng ký hiệu `₫` và phân cách hàng nghìn nhất quán | FR-21 | `CONFIRMED` |
| `D-R18` | Ngôn ngữ giao diện | Nội dung UI dùng tiếng Việt, trừ thuật ngữ kỹ thuật chuẩn | FR-21 | `CONFIRMED` |
| `D-R19` | Nút hành động tích cực | Dùng màu xanh dương | FR-21 | `CONFIRMED`; áp dụng cho Mobile theo wording chung |
| `D-R20` | Validation coupon thất bại | Lỗi xuất hiện phía trên nút action/submit liên quan | FR-22 | `CONFIRMED`; ánh xạ native form cần human review |

Không tạo rule xác nhận cho disabled khi code rỗng, loading indicator, chống double
tap, `trim/uppercase`, hay reset result khi edit vì SRS chưa mô tả các behavior đó.

## 8. API contract và điểm không khớp tài liệu

| Hạng mục | Contract/oracle | Điểm cần lưu ý cho Mobile |
|---|---|---|
| Endpoint | `POST /api/apply-coupon` | Mobile gọi đúng endpoint này |
| Request body | API spec nêu `code`, `total_amount`, `user_id` | Không nêu Authorization header dù SRS yêu cầu JWT hợp lệ |
| Success | Trả `discount_amount`, `final_amount` | Mobile còn dùng `coupon_id` và `message`, nhưng hai field này không được API spec bảo đảm |
| Authentication | JWT hợp lệ theo FR-09/SEC-02 | Mobile apply request không gửi JWT, chỉ gửi `user?.id` |
| Trusted total | Backend phải tính lại | Mobile gửi `cartTotal`; Backend hiện tin request body |
| Usage | Phải đếm theo đúng user–coupon | Mobile ghi usage bằng request riêng sau checkout; API này không có trong API spec |

Khi API specification và SRS mâu thuẫn, SRS giữ vai trò business oracle; khác biệt
được mang sang test và gap analysis.

## 9. Hành vi Mobile implementation quan sát được

Các mục sau là observation/candidate discrepancy từ static review, chưa phải
execution result hoặc confirmed bug.

| ID | Hành vi quan sát được | Phân loại hiện tại | Source |
|---|---|---|---|
| `D-OBS-01` | Khi mở checkout, yêu cầu có `user`; code/result/error được reset | Implementation behavior; guard phù hợp một phần FR-08 | `App.js:339–353` |
| `D-OBS-02` | Apply bỏ qua code rỗng, gửi `couponCode.trim().toUpperCase()` | Normalization behavior, chưa có oracle | `App.js:356–369` |
| `D-OBS-03` | Trước request xóa error/result, bật loading; sau request hiển thị success hoặc error rồi tắt loading | State behavior, chưa có SRS cụ thể | `App.js:356–377` |
| `D-OBS-04` | Nút Áp dụng disabled khi code sau trim rỗng hoặc đang request; text loading là `...` | Implementation behavior, chưa có usability oracle | `App.js:706–717` |
| `D-OBS-05` | Khi sửa code, client xóa result và error cũ | Implementation behavior, chưa có oracle | `App.js:698–703` |
| `D-OBS-06` | Success hiển thị message, “Tiết kiệm”, “Thành tiền” và cập nhật “Tổng thanh toán” | Phù hợp đường hiển thị D-R16/D-R17; cần execution | `App.js:723–740` |
| `D-OBS-07` | `couponError` nằm dưới hàng chứa input và nút Áp dụng | Candidate discrepancy với D-R20 | `App.js:692–722` |
| `D-OBS-08` | Nút Áp dụng dùng `orangeButton`, nút checkout màu xanh lá | Candidate discrepancy với D-R19 | `App.js:706–718`, `1173–1178` |
| `D-OBS-09` | Total input không editable và lấy từ `cartTotal` | UI phù hợp một phần D-R15; Backend vẫn phải recompute | `App.js:684–690` |
| `D-OBS-10` | Apply request không gửi JWT và gửi `user?.id`; endpoint Backend cũng không authenticate | Candidate discrepancy với D-R07/D-R08 | `App.js:362–369`; `server.js:363–433` |
| `D-OBS-11` | Backend dùng `>` ở minimum và sai công thức percent giống đường dùng chung của Web/Mobile | Candidate shared-backend discrepancy; chưa phải D execution result | `server.js:379`, `397–421` |
| `D-OBS-12` | Usage được ghi bằng request riêng sau checkout, không có transaction chung | Implementation risk/gap | `App.js:383–407`; `server.js:443–454` |
| `D-OBS-13` | API base URL hard-code; working tree hiện dùng `localhost`, baseline dùng IP LAN | Testability/environment condition | `App.js:16`; local diff so với baseline |

Các candidate shared-backend discrepancy có thể trùng root cause với Pool B, nhưng
Pool D chỉ xác nhận defect khi có execution/evidence riêng trên nền tảng đã khai báo.

## 10. Requirement gap và nội dung `NOT SPECIFIED`

| Gap ID | Nội dung chưa được quy định | Ảnh hưởng đến bước sau |
|---|---|---|
| `D-GAP-R01` | Chưa có bằng chứng chính thức rằng “Mobile Feature 9” là Discount Coupon | Giữ scope pending; cần bảng phân công/Moodle/xác nhận giảng viên |
| `D-GAP-R02` | Case sensitivity, trim, uppercase, code length/charset | Không dùng behavior `trim().toUpperCase()` làm oracle; thiết kế exploratory partition riêng |
| `D-GAP-R03` | Disabled/loading/double-tap và timeout trong lúc apply | Chỉ mô hình hóa state/probe, chưa PASS/FAIL nếu không có oracle bổ sung |
| `D-GAP-R04` | Khi sửa code có bắt buộc xóa result/error cũ hay không | Không đặt expected reset chỉ từ source |
| `D-GAP-R05` | Exact HTTP status, error/success text và đầy đủ response schema | Assert accept/reject, discount/final và state; không ép exact text/status |
| `D-GAP-R06` | Rounding, percent maximum, fixed cap và final floor | Không tự đặt expected cho fractional/over-total case |
| `D-GAP-R07` | Timezone, granularity và exact representation của expiry | Chưa khóa biên sát thời điểm nếu fixture/clock chưa được kiểm soát |
| `D-GAP-R08` | Cách áp dụng HTML-oriented rule như `<h1>`, Tab order, breadcrumb và required marker lên native React Native | Tách Expo Web conformance khỏi native accessibility; không suy diễn tương đương |
| `D-GAP-R09` | Network error, retry, offline và malformed/non-JSON response | Chỉ ghi resilience observation nếu chưa có contract |
| `D-GAP-R10` | Device/OS/orientation/soft keyboard/accessibility matrix bắt buộc | Phải chốt môi trường Step 5; không khẳng định native từ device emulation |
| `D-GAP-R11` | Thời điểm coupon được tính là đã dùng và tính nguyên tử với checkout | Concurrency/failure recovery có thể BLOCKED tới khi rule được chốt |

Các gap không chặn Step 2 đối với năm điều kiện C1–C5 và công thức đã xác nhận.
Chúng phải được mang nguyên trạng qua domain model, BVA và test design.

## 11. Boundary candidate cho Step 3

- Order threshold: `min-1`, `min`, `min+1`; đúng bằng minimum phải hợp lệ.
- Usage: `limit-1`, `limit`, `limit+1`; chỉ phía dưới limit hợp lệ.
- Expiry: ngay trước, tại và ngay sau expiry sau khi chốt clock/timezone.
- Discount value: quanh `0` theo representation của fixture; maximum chưa có oracle.
- Apply state: trước request, trong request và sau success/error; đây là state
  transition, không phải numeric BVA.
- Coupon code empty/whitespace/normalized là partition/probe chưa có oracle đầy đủ,
  không tự dựng length boundary.
- Runtime: Expo Web, native emulator và thiết bị thật là environment partition,
  không được trộn evidence.

## 12. Test data baseline quan sát từ seed

| Code | Type/value | Minimum | Expiry | Active | Limit | Vai trò dự kiến |
|---|---|---:|---|---:|---:|---|
| `SAVE10` | percent 10 | 300.000 ₫ | 2099-12-31 | 1 | 1 | Nominal percent và threshold |
| `BIGBUY` | fixed 50.000 | 500.000 ₫ | 2099-12-31 | 1 | 1 | Nominal fixed |
| `VIP100` | fixed 100.000 | 300.000 ₫ | 2099-12-31 | 1 | 2 | Usage boundary |
| `EXPIRED` | percent 20 | 100.000 ₫ | 2020-01-01 | 1 | 1 | Expired partition |

Seed là test data, không chứng minh implementation đúng. Step 5 cần fixture SQLite
cô lập và không dùng database runtime của `SHOP` làm bằng chứng tái lập.
