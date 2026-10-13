# B-FR09 — Domain model

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `B-FR09` |
| Feature | FR-09 — Discount Coupon trên Web checkout |
| Đầu vào | `01_spec_and_oracle.md` ở trạng thái `REVIEWED — HUMAN APPROVED` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Domain modeling và Equivalence Partitioning; chưa chọn boundary value |
| Trạng thái | `REVIEWED — HUMAN APPROVED` |
| Thời điểm tạo | 2026-10-13 10:49:12 +07:00 |
| Người review | Nguyễn Phúc Hậu (`23120252`) |
| Thời điểm review | 2026-10-13 10:56:56 +07:00 |
| Mục tiêu | Mô hình hóa đối tượng, input, trạng thái, ràng buộc và output cần thiết để chuyển sang BVA |

## 2. Nguyên tắc mô hình hóa

- Business oracle là `B-R01`–`B-R19` trong Step 1; source chỉ cung cấp actual
  implementation và testability context.
- Input người dùng, trạng thái hệ thống, cấu hình coupon và output được giữ thành
  các characteristic độc lập để tránh partition chồng lấn.
- Một lần áp dụng coupon hợp lệ là phép hội của năm điều kiện C1–C5; không giả
  định thứ tự Backend phải kiểm tra các điều kiện.
- Khi kiểm thử một invalid partition, các characteristic khác dùng nominal valid
  value nếu có thể để cô lập nguyên nhân.
- Domain ngữ nghĩa không được suy ra chỉ từ storage type. Ví dụ cột SQLite
  `INTEGER` không tự xác định rounding rule của tiền.
- `B-GAP-R01`–`B-GAP-R07` tiếp tục là gap; file này không đặt thêm case
  normalization, rounding, cap discount, timezone hoặc exact HTTP response.
- `B-D01`–`B-D11` là candidate discrepancy chờ execution, không phải oracle.

## 3. Các đối tượng nghiệp vụ cần thiết

| Object ID | Đối tượng | Thuộc tính cần cho FR-09 | Trách nhiệm trong model | Nguồn |
|---|---|---|---|---|
| `B-OBJ-01` | `AuthenticatedUser` | `user_id`, trạng thái JWT | Xác định user hiện tại và khóa tra cứu usage; identity phải đến từ JWT hợp lệ | `B-R07`, `B-R08` |
| `B-OBJ-02` | `Cart/OrderPricingContext` | cart items, unit price, quantity, trusted `order_total` | Cung cấp tổng do hệ thống tính, read-only đối với user và được Backend tính lại | `B-R15` |
| `B-OBJ-03` | `Coupon` | `code`, `is_active`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user` | Cung cấp cấu hình và các guard C1–C3/C5 cùng công thức discount | `B-R01`–`B-R06`, `B-R12`, `B-R13` |
| `B-OBJ-04` | `CouponUsage` | `coupon_id`, `user_id`, `usage_count` | Biểu diễn số lượt đã dùng của đúng cặp user–coupon | `B-R09`, `B-R10` |
| `B-OBJ-05` | `CouponApplication` | code nhập, user, trusted total, thời điểm đánh giá, quyết định | Aggregate đánh giá đồng thời C1–C5 | `B-R11` |
| `B-OBJ-06` | `DiscountResult` | `discount_amount`, `final_amount`, accept/reject | Output quan sát được; chỉ tồn tại như kết quả discount hợp lệ khi mọi guard đạt | `B-R11`–`B-R14` |
| `B-OBJ-07` | `CheckoutCouponView` | input, apply action, error/result, amount display, heading, breadcrumb, focus order | Observable UI conformance của Pool B | `B-R16`–`B-R19` |
| `B-OBJ-08` | `EvaluationClock` | `now`, timezone/granularity được kiểm soát | So sánh với `expired_at`; chi tiết representation vẫn là gap | `B-R03`, `B-R04`, `B-GAP-R04` |

`Coupon CRUD` không phải đối tượng kiểm thử của Pool B. `Coupon` ở đây là dữ
liệu precondition đã tồn tại, không phải yêu cầu mở rộng sang FR-17.

## 4. Quan hệ và trust boundary

Mô hình nghiệp vụ mong đợi:

```text
Browser/Web checkout
  ├─ coupon code ───────────────────────────────┐
  ├─ JWT ──> AuthenticatedUser(user_id) ────────┤
  └─ cart intent ─> Backend recomputes total ───┤
                                                 v
Database Coupon ───────────────────────> CouponApplication
CouponUsage(user_id, coupon_id) ───────>   evaluate C1–C5
EvaluationClock(now) ──────────────────>          │
                                                  ├─ reject: no discount
                                                  └─ accept: DiscountResult
```

Các trust rule bắt buộc:

1. `user_id` dùng kiểm tra usage phải được suy ra từ JWT, không tin body client.
2. `order_total` dùng kiểm tra threshold và tính discount phải được Backend tính
   lại từ dữ liệu giỏ/sản phẩm có thẩm quyền, không tin giá trị user sửa.
3. `Coupon` và `CouponUsage` đến từ persistent state theo đúng coupon/user.
4. `now` và `expired_at` phải so sánh trong cùng một time model; model cụ thể
   chưa được SRS quy định.

## 5. Danh mục biến domain

| Variable ID | Biến | Loại/đơn vị logic | Miền hợp lệ hoặc conforming | Miền invalid/non-conforming | Phụ thuộc | Rule/gap |
|---|---|---|---|---|---|---|
| `B-DM-01` | `raw_code` | Chuỗi nhập Web | Code nhận diện được coupon active sau xử lý được đặc tả cho phép | Không tồn tại hoặc ánh xạ coupon inactive | `Coupon` | `B-R01`, `B-R02`, `B-GAP-R01` |
| `B-DM-02` | `authenticated_user` | User identity + JWT state | JWT hợp lệ và suy ra được `user_id` | Thiếu, invalid, expired hoặc không suy ra user | Authentication service | `B-R07`, `B-R08` |
| `B-DM-03` | `order_total` | Tiền VND; giá trị hệ thống tính | Trusted, read-only ở UI, Backend recompute; đồng thời so sánh được với minimum | Giá trị client-controlled hoặc không do Backend recompute | Cart/products | `B-R15` |
| `B-DM-04` | `coupon_exists_active` | Boolean predicate | Tồn tại và `is_active = 1` | Không tồn tại hoặc inactive | `raw_code`, `Coupon` | `B-R01`, `B-R02` |
| `B-DM-05` | `expired_at`/`now` | Thời gian | `now < expired_at` | `now >= expired_at` | `EvaluationClock`, `Coupon` | `B-R03`, `B-R04`, `B-GAP-R04` |
| `B-DM-06` | `min_order_amount` | Tiền VND | Cấu hình `>= 0`; application hợp lệ khi `order_total >= min` | Config âm hoặc application có `order_total < min` | `Coupon`, `order_total` | `B-R05`, `B-R06` |
| `B-DM-07` | `usage_count` | Số lần; số nguyên không âm | `usage_count < max_uses_per_user` | `usage_count >= max_uses_per_user` | `user_id`, `coupon_id` | `B-R09`, `B-R10` |
| `B-DM-08` | `max_uses_per_user` | Số lần; số nguyên | Cấu hình `>= 1` | Cấu hình `< 1` hoặc không biểu diễn được như số lần | `Coupon` | FR-17; `B-R09`, `B-R10` |
| `B-DM-09` | `coupon_type` | Enum | `percent` hoặc `fixed` | Ngoài tập enum | `Coupon` | `B-R12`, `B-R13` |
| `B-DM-10` | `discount_value` | Giá trị số dương; `%` hoặc VND theo type | `> 0` và phù hợp type | `<= 0`, sai kiểu hoặc type không xác định | `coupon_type` | FR-17; `B-GAP-R03` |
| `B-DM-11` | `discount_amount` | Tiền VND | Bằng công thức tương ứng type | Khác công thức; rounding case unresolved | total, type, value | `B-R12`, `B-R13`, `B-GAP-R02` |
| `B-DM-12` | `final_amount` | Tiền VND | `order_total - discount_amount` | Khác phép tính; floor/cap unresolved | total, discount | `B-R14`, `B-GAP-R03` |
| `B-DM-13` | `decision` | Enum | `ACCEPT` khi mọi C1–C5 đạt; nếu không `REJECT` | Không có trạng thái thứ ba được SRS quy định | Toàn bộ guard | `B-R01`–`B-R11` |
| `B-DM-14` | `money_display` | Chuỗi UI | Có phân cách hàng nghìn và ký hiệu `₫` | Thiếu/sai separator hoặc đơn vị | result/total | `B-R16` |
| `B-DM-15` | `page_structure` | UI structure | Đúng một `<h1>` và có breadcrumb | Thiếu/sai số lượng heading hoặc breadcrumb | Checkout view | `B-R17` |
| `B-DM-16` | `positive_action/tab_order` | UI behavior | Nút tích cực xanh dương; focus trên-xuống, trái-phải | Sai màu hoặc sai focus order | Checkout view | `B-R18` |
| `B-DM-17` | `validation_feedback` | UI placement | Lỗi nằm trên nút apply/submit liên quan | Lỗi nằm dưới, chỉ alert hoặc không hiển thị | Reject result | `B-R19` |

`raw_code` không được chia theo empty/whitespace/case/length ở Step 2 vì
`B-GAP-R01` và `B-GAP-R07` chưa cho phép xác định expected result tương ứng.

## 6. Equivalence partition của năm điều kiện eligibility

### 6.1 Coupon existence và active state (`CA` — C1)

| Partition ID | Phân loại | Mô tả | Expected class | Rule |
|---|---|---|---|---|
| `CA-V1` | Valid | Code ánh xạ coupon tồn tại và active | Tiếp tục C2–C5 | `B-R01` |
| `CA-I1` | Invalid | Code không ánh xạ coupon nào | Reject, không discount | `B-R02` |
| `CA-I2` | Invalid | Coupon tồn tại nhưng inactive | Reject, không discount | `B-R02` |

`CA-I1` và `CA-I2` có cùng expected class nhưng là hai trạng thái dữ liệu khác
nhau cần giữ riêng để bao phủ cả hai vế của C1.

### 6.2 Expiry (`EX` — C2)

Characteristic này chỉ có ý nghĩa khi coupon thuộc `CA-V1`.

| Partition ID | Phân loại | Predicate | Expected class | Rule |
|---|---|---|---|---|
| `EX-V1` | Valid | `now < expired_at` | Tiếp tục C3–C5 | `B-R03` |
| `EX-I1` | Invalid | `now >= expired_at` | Reject vì hết hạn | `B-R04` |

### 6.3 Order threshold (`TH` — C3)

| Partition ID | Phân loại | Predicate | Expected class | Rule |
|---|---|---|---|---|
| `TH-V1` | Valid | Trusted `order_total >= min_order_amount` | Tiếp tục C4–C5; equality hợp lệ | `B-R05`, `B-R15` |
| `TH-I1` | Invalid | Trusted `order_total < min_order_amount` | Reject | `B-R06` |
| `TH-I2` | Non-conforming trust | Total bị user chỉnh hoặc Backend không recompute | Không dùng giá trị đó làm căn cứ áp dụng/tính discount | `B-R15` |

`TH-I2` là trust-domain conformance, không phải một numeric interval cạnh
`TH-V1/TH-I1`.

### 6.4 Authentication (`AU` — C4)

| Partition ID | Phân loại | Mô tả | Expected class | Rule |
|---|---|---|---|---|
| `AU-V1` | Valid | JWT hợp lệ và suy ra đúng user identity | Tiếp tục C5 | `B-R07` |
| `AU-I1` | Invalid | Không có JWT | Reject | `B-R08` |
| `AU-I2` | Invalid | JWT có mặt nhưng invalid/expired | Reject | `B-R08` |
| `AU-I3` | Non-conforming trust | Hệ thống dùng `user_id` client cung cấp thay identity từ JWT | Không được dùng để bypass/đổi user kiểm tra usage | `B-R07`, `B-R08` |

### 6.5 Per-user usage (`UL` — C5)

Characteristic này chỉ được đánh giá bằng identity thuộc `AU-V1` và coupon
thuộc `CA-V1`.

| Partition ID | Phân loại | Predicate | Expected class | Rule |
|---|---|---|---|---|
| `UL-V1` | Valid | `0 <= usage_count < max_uses_per_user` | Coupon đủ điều kiện C5 | `B-R09` |
| `UL-I1` | Invalid | `usage_count >= max_uses_per_user` | Reject vì đạt/hết lượt | `B-R10` |
| `UL-I2` | Non-conforming binding | Usage được đếm cho user hoặc coupon khác | Không được dùng kết quả đếm đó để accept | `B-R07`, `B-R10` |

## 7. Domain cấu hình và phép tính

### 7.1 Coupon type (`CT`)

| Partition ID | Phân loại | Mô tả | Expected class | Rule |
|---|---|---|---|---|
| `CT-V1` | Valid | Type `percent` | Dùng công thức percent | `B-R12` |
| `CT-V2` | Valid | Type `fixed` | Dùng công thức fixed | `B-R13` |
| `CT-I1` | Invalid configuration | Type ngoài `percent/fixed` | Không có công thức hợp lệ theo SRS | FR-17 |

### 7.2 Discount value (`DV`)

| Partition ID | Phân loại | Mô tả | Expected class | Rule/gap |
|---|---|---|---|---|
| `DV-V1` | Valid configuration | Giá trị số dương | Có thể tính theo type | FR-17 |
| `DV-I1` | Invalid configuration | Giá trị bằng 0 hoặc âm | Dữ liệu coupon không hợp lệ | FR-17 |
| `DV-I2` | Invalid configuration | Không phải giá trị số phù hợp | Dữ liệu coupon không hợp lệ | FR-17 |
| `DV-U1` | Unresolved | Percent lớn hơn 100 hoặc fixed lớn hơn total | Không tự đặt cap/floor | `B-GAP-R03` |

### 7.3 Output arithmetic (`DA`, `FA`)

```text
PERCENT_DISCOUNT = order_total × discount_value / 100
FIXED_DISCOUNT   = discount_value
FINAL_AMOUNT     = order_total - discount_amount
```

| Partition ID | Phân loại | Mô tả | Expected class | Rule/gap |
|---|---|---|---|---|
| `DA-V1` | Valid | Percent result đúng công thức và không cần rounding chưa được quy định | Accept arithmetic | `B-R12` |
| `DA-V2` | Valid | Fixed result bằng đúng `discount_value` | Accept arithmetic | `B-R13` |
| `DA-I1` | Invalid | `discount_amount` khác công thức áp dụng | Fail oracle | `B-R12`, `B-R13` |
| `DA-U1` | Unresolved | Percent result phát sinh phần lẻ VND | Chưa assert rounded integer | `B-GAP-R02` |
| `FA-V1` | Valid | `final_amount = order_total - discount_amount` | Accept arithmetic | `B-R14` |
| `FA-I1` | Invalid | `final_amount` khác phép trừ | Fail oracle | `B-R14` |
| `FA-U1` | Unresolved | Kết quả âm khi discount lớn hơn total | Không tự floor/cap | `B-GAP-R03` |

Các partition `*-U1` không được biến thành Pass/Fail oracle cho tới khi có rule
bổ sung. Step 3 phải chọn nominal arithmetic không phụ thuộc rounding/cap cho bộ
test chính.

## 8. Composite eligibility và decision model

Định nghĩa predicate:

```text
C1 = CA-V1
C2 = EX-V1
C3 = TH-V1 và trusted total (không thuộc TH-I2)
C4 = AU-V1 và trusted identity (không thuộc AU-I3)
C5 = UL-V1 và đúng user–coupon binding (không thuộc UL-I2)

COUPON_ELIGIBLE = C1 ∧ C2 ∧ C3 ∧ C4 ∧ C5
```

| Composite ID | Điều kiện | Decision | Output |
|---|---|---|---|
| `EL-V1` | `COUPON_ELIGIBLE` và config/formula có nghĩa | `ACCEPT` | Tính `discount_amount`, `final_amount`; hiển thị result |
| `EL-I1` | C1 sai | `REJECT` | Không tạo discount |
| `EL-I2` | C1 đúng, C2 sai | `REJECT` | Không tạo discount |
| `EL-I3` | C1–C2 đúng, C3 sai | `REJECT` | Không tạo discount |
| `EL-I4` | C1–C3 đúng, C4 sai | `REJECT` | Không tạo discount |
| `EL-I5` | C1–C4 đúng, C5 sai | `REJECT` | Không tạo discount |
| `EL-I6` | Trust violation ở total, identity hoặc usage binding | `REJECT` giá trị không đáng tin cậy | Không được bypass eligibility |

Thứ tự trình bày `EL-I1`–`EL-I5` chỉ phục vụ thiết kế test one-fault-at-a-time,
không quy định validation precedence hoặc error message khi nhiều điều kiện cùng
sai. Exact response thuộc `B-GAP-R05`.

## 9. State model của coupon application và usage

| State ID | Trạng thái | Event/guard | Transition hoặc expected behavior | Rule/gap |
|---|---|---|---|---|
| `AS-0` | Ready | Có context checkout, chưa apply | Submit code → `AS-1` | Scope FR-09 |
| `AS-1` | Evaluating | Đánh giá C1–C5 bằng trusted state | Eligible → `AS-2`; bất kỳ guard sai → `AS-3` | `B-R01`–`B-R11` |
| `AS-2` | Applied | Discount/result đúng công thức | Checkout tiếp tục với kết quả; thời điểm ghi usage chưa được khóa | `B-R11`–`B-R14`, `B-GAP-R06` |
| `AS-3` | Rejected | Có ít nhất một điều kiện không đạt | Giữ tổng không discount; transition tiếp theo không được SRS quy định | `B-R02`, `B-R04`, `B-R06`, `B-R08`, `B-R10` |

Với coupon có limit `L`, usage state được mô hình hóa bằng `k = usage_count`:

```text
0 <= k < L  : còn lượt, có thể đạt C5
k >= L      : hết lượt, phải reject
```

SRS không quy định chính xác event nào chuyển `k → k+1`, transaction boundary
hoặc recovery khi ghi usage lỗi. Vì vậy không tạo transition bắt buộc cho phần
này; giữ `B-GAP-R06` sang test design/gap analysis.

## 10. UI và output conformance domain

| Dimension ID | Conforming partition | Non-conforming partition | Rule |
|---|---|---|---|
| `UI-MONEY` | `UI-MONEY-V1`: mọi giá trị tiền có separator và `₫` | `UI-MONEY-I1`: thiếu/sai separator hoặc đơn vị | `B-R16` |
| `UI-H1` | `UI-H1-V1`: đúng một `<h1>` mô tả checkout | `UI-H1-I1`: không có hoặc có nhiều `<h1>` | `B-R17` |
| `UI-BREAD` | `UI-BREAD-V1`: có breadcrumb của trang checkout | `UI-BREAD-I1`: thiếu breadcrumb | `B-R17` |
| `UI-COLOR` | `UI-COLOR-V1`: action tích cực màu xanh dương | `UI-COLOR-I1`: màu khác | `B-R18` |
| `UI-TAB` | `UI-TAB-V1`: focus trên-xuống, trái-phải | `UI-TAB-I1`: thứ tự khác | `B-R18` |
| `UI-ERROR` | `UI-ERROR-V1`: lỗi nằm trên nút apply/submit liên quan | `UI-ERROR-I1`: lỗi dưới nút, chỉ alert hoặc không hiển thị | `B-R19` |

Các dimension UI là observable conformance domain, không trộn vào eligibility
predicate C1–C5.

## 11. Nominal baseline cho Step 3–4

Baseline dưới đây giữ các characteristic không phải mục tiêu ở trạng thái hợp lệ;
chưa phải test case và không dùng actual bug làm expected result.

| Biến/đối tượng | Nominal valid data hoặc cách thiết lập |
|---|---|
| User | `test@eshop.com` với JWT hợp lệ; identity lấy từ token |
| Cart/total | Fixture để Backend recompute `400,000 ₫` từ item/quantity/price |
| Percent coupon | `SAVE10`: active, value 10, minimum `300,000 ₫`, future expiry, limit 1 |
| Percent arithmetic | Discount `40,000 ₫`; final `360,000 ₫` |
| Fixed coupon | `BIGBUY`: active, value `50,000 ₫`, minimum `500,000 ₫`, future expiry, limit 1 |
| Fixed total/result | Trusted total `600,000 ₫`; discount `50,000 ₫`; final `550,000 ₫` |
| Usage | `usage_count = 0` cho đúng user–coupon |
| Clock | Thời điểm kiểm thử trước rõ ràng so với expiry; không dùng test sát biên khi timezone chưa khóa |

Seed coupon là test data quan sát được, không chứng minh implementation đúng.
Fixture ở Step 5 phải reset usage và giữ database cô lập.

## 12. Traceability từ business rule tới domain

| Rule | Object/variable/partition bao phủ |
|---|---|
| `B-R01` | `B-OBJ-03`, `B-DM-04`, `CA-V1` |
| `B-R02` | `CA-I1`, `CA-I2`, `EL-I1` |
| `B-R03` | `B-OBJ-08`, `B-DM-05`, `EX-V1` |
| `B-R04` | `EX-I1`, `EL-I2` |
| `B-R05` | `B-DM-06`, `TH-V1` |
| `B-R06` | `TH-I1`, `EL-I3` |
| `B-R07` | `B-OBJ-01`, `B-DM-02`, `AU-V1` |
| `B-R08` | `AU-I1`, `AU-I2`, `AU-I3`, `EL-I4` |
| `B-R09` | `B-OBJ-04`, `B-DM-07`, `UL-V1` |
| `B-R10` | `UL-I1`, `UL-I2`, `EL-I5` |
| `B-R11` | `B-OBJ-05`, `B-OBJ-06`, `EL-V1`, `AS-2` |
| `B-R12` | `CT-V1`, `DA-V1`, `DA-I1` |
| `B-R13` | `CT-V2`, `DA-V2`, `DA-I1` |
| `B-R14` | `B-DM-12`, `FA-V1`, `FA-I1` |
| `B-R15` | `B-OBJ-02`, `B-DM-03`, `TH-I2`, `EL-I6` |
| `B-R16` | `B-DM-14`, `UI-MONEY` |
| `B-R17` | `B-DM-15`, `UI-H1`, `UI-BREAD` |
| `B-R18` | `B-DM-16`, `UI-COLOR`, `UI-TAB` |
| `B-R19` | `B-DM-17`, `UI-ERROR` |

Coverage ở cấp domain: `19/19` rule có ít nhất một object, variable hoặc partition
truy vết. Đây không phải execution coverage.

## 13. Requirement gap được mang sang bước sau

| Gap ID | Domain bị ảnh hưởng | Quyết định mô hình |
|---|---|---|
| `B-GAP-R01` | `raw_code`, `CA` | Không chia case/trim/length/charset thành valid-invalid oracle |
| `B-GAP-R02` | `DA-U1` | Chỉ dùng arithmetic không phát sinh phần lẻ cho baseline; rounding test chờ rule |
| `B-GAP-R03` | `DV-U1`, `FA-U1` | Không đặt maximum percent, cap discount hoặc floor final |
| `B-GAP-R04` | `EX`, `EvaluationClock` | Giữ predicate `now < expiry`; chưa chọn tick/timezone cho boundary |
| `B-GAP-R05` | Reject/output response | Không assert exact status, schema lỗi hoặc message ngoài contract |
| `B-GAP-R06` | `AS-2`, usage transition | Không mô hình hóa bắt buộc event/transaction làm tăng usage |
| `B-GAP-R07` | Empty code/application optionality | Không tạo partition empty-code có expected result chính thức |

Không gap nào ngăn mô hình hóa C1–C5 hoặc nominal percent/fixed arithmetic. Các
test phụ thuộc gap phải được đánh dấu assumption, unresolved hoặc blocked phù hợp
ở Step 4–5.

## 14. Quy tắc chuyển sang BVA

- Step 3 chọn giá trị dưới/tại/trên cho threshold, usage limit, expiry và các
  config boundary có căn cứ; file này mới xác định vị trí biên.
- `CA`, `AU`, `CT` và các UI dimension dùng equivalence/state partition, không
  gắn nhãn BVA nếu không có thứ tự có nghĩa.
- Với threshold, equality tại `min_order_amount` phải thuộc valid partition.
- Với usage, equality tại `max_uses_per_user` phải thuộc invalid partition.
- Expiry cần clock/fixture có granularity và timezone được ghi rõ trước khi chọn
  predecessor/successor.
- Percent/final arithmetic dùng giá trị nominal không cần rounding/cap, trừ khi
  requirement gap được giải quyết.
- Negative case nên thay đổi một characteristic chính so với nominal baseline;
  multi-condition case chỉ thêm khi có lý do interaction/risk.

## 15. Human review gate

- [x] Xác nhận 8 đối tượng nghiệp vụ đủ cho FR-09 và không mở rộng sang Admin CRUD/Mobile.
- [x] Xác nhận 17 biến domain tách input, state, config và output đúng cách.
- [x] Xác nhận các partition của C1–C5 loại trừ nhau trong từng characteristic.
- [x] Xác nhận `COUPON_ELIGIBLE = C1 ∧ C2 ∧ C3 ∧ C4 ∧ C5`.
- [x] Xác nhận trusted total và trusted identity không bị thay bằng dữ liệu client.
- [x] Xác nhận công thức percent/fixed/final giữ nguyên theo SRS.
- [x] Xác nhận `19/19` rule có traceability ở cấp domain.
- [x] Xác nhận 7 requirement gap vẫn là unresolved, không bị nâng thành oracle.
- [x] Xác nhận nominal baseline không dựa trên hành vi sai đã quan sát.
- [x] Chỉ chuyển trạng thái sang `REVIEWED` sau khi hoàn tất các mục trên.

**Kết luận review:** Sinh viên đã kiểm tra và xác nhận toàn bộ Domain Model.
Step 2 đã qua human review gate; có thể tạo `03_boundary_value_analysis.md`.
Việc review không biến requirement gap hoặc candidate discrepancy thành oracle
hay confirmed defect.
