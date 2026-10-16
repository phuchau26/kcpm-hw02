# B-FR09 — Equivalence Partitioning và Boundary Value Analysis

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `B-FR09` |
| Feature | FR-09 — Discount Coupon trên Web checkout |
| Đầu vào | `01_spec_and_oracle.md`; `02_domain_model.md` đều `REVIEWED — HUMAN APPROVED` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Equivalence Partitioning (EP), robust three-point BVA và relational/state boundary |
| Trạng thái | `REVIEWED — HUMAN APPROVED` |
| Thời điểm tạo | 2026-10-13 10:58:21 +07:00 |
| Người review | Nguyễn Phúc Hậu (`23120252`) |
| Thời điểm review | 2026-10-13 11:04:43 +07:00 |
| Mục tiêu | Chốt partition và candidate boundary data; chưa viết test case hoặc ghi actual result |

## 2. Cơ sở và quy ước

Boundary chỉ được lấy từ rule đã review:

- Order hợp lệ tại `order_total >= min_order_amount`; equality thuộc valid domain.
- Coupon còn hạn khi `now < expired_at`; equality đã hết hạn.
- User còn lượt khi `usage_count < max_uses_per_user`; equality đã hết lượt.
- `discount_value > 0`, `min_order_amount >= 0` và
  `max_uses_per_user >= 1` là data-integrity precondition từ FR-17.
- Công thức percent/fixed/final giữ nguyên theo FR-09.

Với đại lượng rời rạc có đơn vị xác định, dùng robust BVA ba điểm:

```text
B-1 = ngay dưới boundary
B   = tại boundary
B+1 = ngay trên boundary
```

Tiền hiển thị theo VND và seed/schema hiện tại dùng integer, nên boundary của
`order_total`, `min_order_amount` và usage dùng bước `1 ₫` hoặc `1 lần`. Đây là
bước kiểm thử phù hợp representation hiện tại, không phải một giới hạn tối đa
nghiệp vụ mới.

Với thời gian và `discount_value`, dùng ký hiệu `δ`/`ε` khi SRS chưa quy định
granularity hoặc precision. Giá trị concrete chỉ được khóa khi fixture/environment
ghi rõ representation; không tự coi một giây, một ngày hoặc một phần trăm là
bước nghiệp vụ bắt buộc.

Nguyên tắc cô lập:

- Khi thay đổi một boundary, giữ C1–C5 và cấu hình còn lại ở nominal valid state.
- Invalid configuration được dùng để kiểm tra defensive behavior/testability,
  không mở rộng phạm vi thành Coupon CRUD.
- Exact HTTP status/message không phải oracle trừ khi contract quy định.
- Candidate discrepancy trong Step 1 không được dùng để đổi expected class.

## 3. Nominal baseline

| Dimension | Nominal valid state |
|---|---|
| User | `test@eshop.com`, JWT hợp lệ; identity lấy từ token |
| Coupon percent | `SAVE10`: tồn tại, active, 10%, minimum `300,000 ₫`, future expiry, limit 1 |
| Coupon fixed | `BIGBUY`: tồn tại, active, fixed `50,000 ₫`, minimum `500,000 ₫`, future expiry, limit 1 |
| Trusted total | Backend recompute từ fixture cart; chọn theo boundary đang xét |
| Usage | `0` cho đúng user–coupon nếu không xét usage boundary |
| Clock | Trước expiry rõ ràng nếu không xét expiry boundary |
| UI | Web checkout, error/result quan sát được, không dùng Mobile/Admin evidence |

Baseline percent dùng tổng `400,000 ₫` để có discount `40,000 ₫` và final
`360,000 ₫`, tránh rounding gap. Baseline fixed dùng tổng `600,000 ₫`, discount
`50,000 ₫` và final `550,000 ₫`.

## 4. Equivalence Partitioning inventory

Giữ nguyên Partition ID đã review ở Step 2; bảng này chỉ bổ sung representative
data và quyết định đưa sang test design.

### 4.1 Coupon code, existence và active state

| Partition | Class | Definition | Representative data/state | Expected class | Rule/gap |
|---|---|---|---|---|---|
| `CA-V1` | `VALID` | Code ánh xạ đúng một coupon active | `SAVE10`, active | Tiếp tục C2–C5 | `B-R01` |
| `CA-I1` | `INVALID` | Code không tồn tại | `NOTEXIST` | Reject, không discount | `B-R02` |
| `CA-I2` | `INVALID` | Coupon tồn tại nhưng inactive | Fixture `INACTIVE10`, `is_active = 0` | Reject, không discount | `B-R02` |
| `CODE-U1` | `UNRESOLVED` | Chuỗi rỗng | `""` | SRS không quy định apply-empty; không tự gán Pass/Fail | `B-GAP-R07` |
| `CODE-U2` | `UNRESOLVED` | Chỉ whitespace | `"   "` | Trim/empty behavior chưa được quy định | `B-GAP-R01`, `B-GAP-R07` |
| `CODE-U3` | `UNRESOLVED` | Khác case hoặc có surrounding whitespace | `save10`, ` SAVE10 ` | Case/normalization chưa được quy định | `B-GAP-R01` |
| `CODE-I4` | `INVALID CONFIGURATION` | Hai coupon có cùng code | Hai row `DUP10` | Vi phạm `code` unique; không phải application state hợp lệ | FR-17; schema `UNIQUE` |

`CODE-I4` được xử lý bằng fixture sanity/schema check. Database hiện tại ngăn
duplicate code; không phá constraint chỉ để tạo một application test không có
oracle chọn coupon nào.

### 4.2 Eligibility C2–C5 và trust boundary

| Partition | Class | Definition | Representative data/state | Expected class | Rule |
|---|---|---|---|---|---|
| `EX-V1` | `VALID` | `now < expired_at` | `SAVE10` trước 2099-12-31 | Tiếp tục | `B-R03` |
| `EX-I1` | `INVALID` | `now >= expired_at` | `EXPIRED` hoặc controlled clock tại/sau expiry | Reject hết hạn | `B-R04` |
| `TH-V1` | `VALID` | Trusted total `>= minimum` | `300,000 ₫` với `SAVE10` | Tiếp tục; equality hợp lệ | `B-R05`, `B-R15` |
| `TH-I1` | `INVALID` | Trusted total `< minimum` | `299,999 ₫` với `SAVE10` | Reject | `B-R06` |
| `TH-I2` | `NON-CONFORMING` | Total client-controlled hoặc Backend không recompute | Sửa request/UI total | Không được dùng để bypass threshold/formula | `B-R15` |
| `AU-V1` | `VALID` | JWT hợp lệ, đúng user identity | Token của user seed | Tiếp tục | `B-R07` |
| `AU-I1` | `INVALID` | Thiếu JWT | Không Authorization header | Reject | `B-R08` |
| `AU-I2` | `INVALID` | JWT invalid/expired | Token sai chữ ký/hết hạn | Reject | `B-R08` |
| `AU-I3` | `NON-CONFORMING` | Identity lấy từ body thay vì JWT | Body chứa `user_id` khác | Không được bypass usage | `B-R07`, `B-R08` |
| `UL-V1` | `VALID` | `0 <= usage_count < limit` | `0/1` hoặc `1/2` | C5 đạt | `B-R09` |
| `UL-I1` | `INVALID` | `usage_count >= limit` | `1/1`, `2/2` | Reject hết lượt | `B-R10` |
| `UL-I2` | `NON-CONFORMING` | Đếm usage sai user/coupon | Usage thuộc user khác | Không được dùng để accept | `B-R07`, `B-R10` |

### 4.3 Configuration, arithmetic và output

| Partition | Class | Definition | Representative data/state | Expected class | Rule/gap |
|---|---|---|---|---|---|
| `CT-V1` | `VALID` | Type `percent` | `SAVE10` | Dùng percent formula | `B-R12` |
| `CT-V2` | `VALID` | Type `fixed` | `BIGBUY` | Dùng fixed formula | `B-R13` |
| `CT-I1` | `INVALID CONFIGURATION` | Type ngoài enum | `tiered` | Không có formula hợp lệ | FR-17 |
| `DV-V1` | `VALID CONFIGURATION` | `discount_value > 0` | 10% hoặc `50,000 ₫` | Có thể tính | FR-17 |
| `DV-I1` | `INVALID CONFIGURATION` | `discount_value <= 0` | 0, -1 | Coupon data không hợp lệ | FR-17 |
| `DV-I2` | `INVALID CONFIGURATION` | Không phải số phù hợp | `"ten"` | Coupon data không hợp lệ | FR-17 |
| `DV-U1` | `UNRESOLVED` | Percent >100 hoặc fixed >total | 101%; fixed `> total` | Không tự cap/floor | `B-GAP-R03` |
| `DA-V1` | `VALID` | Percent result đúng formula, không cần rounding | `400,000 × 10 / 100 = 40,000` | Accept arithmetic | `B-R12` |
| `DA-V2` | `VALID` | Fixed result đúng value | `50,000` | Accept arithmetic | `B-R13` |
| `DA-I1` | `INVALID OUTPUT` | Discount khác formula | Giá trị khác `40,000`/`50,000` trong baseline | Fail oracle | `B-R12`, `B-R13` |
| `DA-U1` | `UNRESOLVED` | Percent formula có phần lẻ VND | total/value tạo fractional result | Chưa assert rounding | `B-GAP-R02` |
| `FA-V1` | `VALID` | Final đúng `total - discount` | `360,000` hoặc `550,000` | Accept arithmetic | `B-R14` |
| `FA-I1` | `INVALID OUTPUT` | Final khác phép trừ | Bất kỳ giá trị khác expected exact | Fail oracle | `B-R14` |
| `FA-U1` | `UNRESOLVED` | Final âm khi discount > total | fixed `> total` | Không tự floor/cap | `B-GAP-R03` |

### 4.4 UI conformance partition

| Dimension | Conforming | Non-conforming | Rule |
|---|---|---|---|
| Money | `UI-MONEY-V1`: separator + `₫` | `UI-MONEY-I1`: thiếu/sai format | `B-R16` |
| Heading | `UI-H1-V1`: đúng một `<h1>` | `UI-H1-I1`: 0 hoặc >1 | `B-R17` |
| Breadcrumb | `UI-BREAD-V1`: có breadcrumb | `UI-BREAD-I1`: thiếu | `B-R17` |
| Positive action | `UI-COLOR-V1`: xanh dương | `UI-COLOR-I1`: màu khác | `B-R18` |
| Focus | `UI-TAB-V1`: đúng thứ tự | `UI-TAB-I1`: sai thứ tự | `B-R18` |
| Error placement | `UI-ERROR-V1`: trên action | `UI-ERROR-I1`: dưới/alert/không có | `B-R19` |

UI dimension dùng EP/inspection, không có numeric boundary.

## 5. Boundary inventory

| Boundary ID | Characteristic | Boundary có căn cứ | Điểm chọn | Trạng thái thiết kế |
|---|---|---|---|---|
| `B-B01` | Order total so với minimum | `T >= M` | `M-1`, `M`, `M+1` VND | Concrete |
| `B-B02` | Usage count so với limit | `k < L` | `L-1`, `L`, `L+1` lần | Concrete |
| `B-B03` | Expiry | `now < E` | `E-δ`, `E`, `E+δ` | Logical; concrete `δ` chờ clock contract |
| `B-B04` | Discount value dương | `D > 0` | `-ε`, `0`, `+ε` | Logical; có integer-compatible fixture `-1,0,1` |
| `B-B05` | Minimum configuration | `M >= 0` | `-1`, `0`, `1` VND | Concrete, configuration boundary |
| `B-B06` | Usage-limit configuration | `L >= 1` | `0`, `1`, `2` lần | Concrete, configuration boundary |
| `B-B07` | Percent maximum/fixed cap | Không được quy định | Không chọn `max-1/max/max+1` | `NO SPECIFIED BOUNDARY` |
| `B-B08` | Coupon code length/case/trim | Không được quy định | Không chọn length/case boundary | `NO SPECIFIED BOUNDARY` |

## 6. Order threshold — `B-B01`

Dùng `SAVE10`, `M = 300,000 ₫`; mọi C1, C2, C4, C5 giữ valid. Tổng phải được
Backend recompute từ fixture cart, không chỉ sửa request body.

| Data ID | Vị trí | Trusted order total | Partition | Expected class | Rule |
|---|---|---:|---|---|---|
| `B-B01-LOW` | `B-1` | `299,999 ₫` | `TH-I1` | Reject vì chưa đủ minimum | `B-R06` |
| `B-B01-ON` | `B` | `300,000 ₫` | `TH-V1` | Threshold hợp lệ; có thể apply nếu C1–C5 đạt | `B-R05` |
| `B-B01-HIGH` | `B+1` | `300,001 ₫` | `TH-V1` | Threshold hợp lệ | `B-R05` |

Candidate riêng cho `TH-I2` phải kiểm tra tamper/client-controlled total và
Backend recomputation ở Step 4; đây là trust-partition, không phải BVA point.

## 7. Usage count — `B-B02`

### 7.1 Limit 1 (`SAVE10`)

| Data ID | Vị trí | `usage_count / limit` | Partition | Expected class | Rule |
|---|---|---|---|---|---|
| `B-B02-L1-LOW` | `L-1` | `0/1` | `UL-V1` | Còn lượt | `B-R09` |
| `B-B02-L1-ON` | `L` | `1/1` | `UL-I1` | Reject vì đạt limit | `B-R10` |
| `B-B02-L1-HIGH` | `L+1` | `2/1` | `UL-I1` | Reject vì vượt limit | `B-R10` |

### 7.2 Limit 2 (`VIP100`)

| Data ID | Vị trí | `usage_count / limit` | Partition | Expected class | Rule |
|---|---|---|---|---|---|
| `B-B02-L2-LOW` | `L-1` | `1/2` | `UL-V1` | Còn đúng một lượt | `B-R09` |
| `B-B02-L2-ON` | `L` | `2/2` | `UL-I1` | Reject vì đạt limit | `B-R10` |
| `B-B02-L2-HIGH` | `L+1` | `3/2` | `UL-I1` | Reject vì vượt limit | `B-R10` |

`UL-I2` (usage của sai user/coupon) cần relational test riêng, không phải điểm
numeric quanh `L`.

## 8. Expiry — `B-B03`

Ký hiệu `E = expired_at`; `δ` là tick nhỏ nhất mà fixture/clock đã công bố trong
cùng timezone và representation. SRS xác định strict inequality nên expected
class rõ ràng dù độ lớn concrete của `δ` chưa được quy định.

| Data ID | Vị trí | Quan hệ thời gian | Partition | Expected class | Rule |
|---|---|---|---|---|---|
| `B-B03-BEFORE` | `B-1` | `now = E - δ` | `EX-V1` | Còn hạn | `B-R03` |
| `B-B03-ON` | `B` | `now = E` | `EX-I1` | Reject vì hết hạn | `B-R04` |
| `B-B03-AFTER` | `B+1` | `now = E + δ` | `EX-I1` | Reject vì hết hạn | `B-R04` |

Step 4 có thể thiết kế ba logical case. Step 5 chỉ chạy exact-boundary cases nếu
automation kiểm soát clock và ghi rõ timezone/granularity; nếu không, ghi
`BLOCKED` thay vì tự chọn một ngày/giây. Coupon seed `EXPIRED` vẫn dùng được cho
EP “rõ ràng đã hết hạn”, nhưng không thay ba điểm sát boundary.

## 9. Discount value dương — `B-B04`

FR-17 chỉ quy định `discount_value` dương; không quy định precision hay maximum.
Ký hiệu `ε` là bước dương nhỏ nhất của representation đã công bố.

| Data ID | Vị trí | Giá trị logic | Integer-compatible fixture | Partition | Expected class |
|---|---|---|---:|---|---|
| `B-B04-BELOW` | `B-1` | `-ε` | `-1` | `DV-I1` | Invalid coupon configuration |
| `B-B04-ON` | `B` | `0` | `0` | `DV-I1` | Invalid coupon configuration |
| `B-B04-ABOVE` | `B+1` | `+ε` | `1` | `DV-V1` | Valid positive configuration |

Áp dụng cùng lower boundary cho type `percent` và `fixed`, nhưng giữ đúng đơn
vị khi tính output. Giá trị `1` là fixture phù hợp schema integer hiện tại, không
chứng minh SRS cấm mọi fractional value.

Không tạo boundary 99/100/101% vì SRS không cho maximum percent. Trường hợp
101% thuộc `DV-U1`, không được ép expected cap/reject. Tương tự, fixed discount
lớn hơn total thuộc `FA-U1`, không có floor-at-zero oracle.

## 10. Minimum-order configuration — `B-B05`

Boundary này kiểm tra data precondition từ FR-17, không thay thế `B-B01` là
boundary hành vi chính của FR-09.

| Data ID | Vị trí | `min_order_amount` | Classification | Expected class |
|---|---|---:|---|---|
| `B-B05-LOW` | `B-1` | `-1 ₫` | Invalid configuration | Không dùng làm coupon hợp lệ |
| `B-B05-ON` | `B` | `0 ₫` | Valid configuration | Minimum hợp lệ |
| `B-B05-HIGH` | `B+1` | `1 ₫` | Valid configuration | Minimum hợp lệ |

## 11. Usage-limit configuration — `B-B06`

| Data ID | Vị trí | `max_uses_per_user` | Classification | Expected class |
|---|---|---:|---|---|
| `B-B06-LOW` | `B-1` | `0` | Invalid configuration | Không dùng làm coupon hợp lệ |
| `B-B06-ON` | `B` | `1` | Valid configuration | Limit thấp nhất có căn cứ |
| `B-B06-HIGH` | `B+1` | `2` | Valid configuration | Limit hợp lệ |

`B-B06` kiểm tra integrity của `L`; `B-B02` kiểm tra hành vi `usage_count` quanh
một `L` hợp lệ. Hai boundary không được gộp thành một expected result mơ hồ.

## 12. Characteristic không có boundary được phép tự đặt

| Boundary/characteristic | Quyết định | Cách xử lý ở Step 4 |
|---|---|---|
| `B-B07` percent maximum | `NO SPECIFIED BOUNDARY` | Không tạo 99/100/101 như Pass/Fail oracle; giữ `DV-U1` unresolved |
| `B-B07` fixed discount so với total | `NO SPECIFIED CAP/FLOOR` | Không khẳng định phải cap discount hoặc final tại 0 |
| `B-B08` code length | `NO SPECIFIED BOUNDARY` | Không tạo min/max length; dùng membership EP |
| Code case/trim | `CATEGORICAL — UNRESOLVED` | Có thể ghi exploratory/requirement-gap case, không gán expected normalization |
| Code rỗng/whitespace | `UNRESOLVED` | Không biến implementation disabled/error thành business oracle |
| Duplicate code | `INVALID CONFIGURATION` | Schema/fixture sanity check; không tạo hai coupon trùng để đoán row được chọn |
| Type | `ENUM MEMBERSHIP` | EP `percent/fixed/other`, không BVA |
| Authentication | `STATE/CATEGORICAL` | EP token valid/missing/invalid và identity binding |
| UI rule | `CONFORMANCE` | Inspection/interaction test, không BVA |
| Rounding | `NOT SPECIFIED` | Chọn nominal arithmetic integral; fractional case mang gap |
| Usage increment event | `NOT SPECIFIED` | Không đặt boundary transaction/lifecycle ngoài `k` so với `L` |

## 13. Traceability từ rule tới EP/BVA

| Rule | EP/BVA coverage | Ghi chú |
|---|---|---|
| `B-R01` | `CA-V1` | Existence/active là state membership, không numeric BVA |
| `B-R02` | `CA-I1`, `CA-I2` | Empty/whitespace không bị gán vào rule này do gap |
| `B-R03` | `EX-V1`, `B-B03-BEFORE` | Concrete tick cần clock contract |
| `B-R04` | `EX-I1`, `B-B03-ON/AFTER` | Seed `EXPIRED` bao phủ clear expired EP |
| `B-R05` | `TH-V1`, `B-B01-ON/HIGH` | Equality tại minimum hợp lệ |
| `B-R06` | `TH-I1`, `B-B01-LOW` | Reject below minimum |
| `B-R07` | `AU-V1`, `AU-I3`, `UL-I2` | Identity/binding EP |
| `B-R08` | `AU-I1`, `AU-I2`, `AU-I3` | Authentication EP, không BVA |
| `B-R09` | `UL-V1`, `B-B02-*-LOW` | Count ngay dưới limit hợp lệ |
| `B-R10` | `UL-I1`, `B-B02-*-ON/HIGH` | Equality/vượt limit invalid |
| `B-R11` | Composite nominal của C1–C5 | Success chỉ khi mọi partition bắt buộc valid |
| `B-R12` | `CT-V1`, `DV-V1`, `DA-V1/I1`, `B-B04` | Formula và lower positivity boundary |
| `B-R13` | `CT-V2`, `DV-V1`, `DA-V2/I1`, `B-B04` | Formula và lower positivity boundary |
| `B-R14` | `FA-V1/I1`; `FA-U1` giữ unresolved | Không tự đặt floor/cap |
| `B-R15` | `TH-I2`; `B-B01` phải dùng trusted total | Tamper/recompute là trust test riêng |
| `B-R16` | `UI-MONEY-V1/I1` | UI conformance |
| `B-R17` | `UI-H1`, `UI-BREAD` | Structural conformance |
| `B-R18` | `UI-COLOR`, `UI-TAB` | UI/sequence conformance |
| `B-R19` | `UI-ERROR` | Placement conformance |

Coverage thiết kế: `19/19` rule được giải thích bằng EP, BVA, composite hoặc UI
conformance. Đây chưa phải test-case coverage hay execution coverage.

## 14. Quy tắc chuyển sang Step 4 test case

1. Tạo case cho từng data row concrete của `B-B01`, `B-B02`, `B-B05`, `B-B06`.
2. Tạo logical cases `B-B03`; gắn precondition controlled clock. Nếu execution
   không kiểm soát được clock/timezone, giữ thiết kế nhưng kết quả phải `BLOCKED`.
3. Với `B-B04`, tách percent/fixed khi cần kiểm tra formula; invalid config có
   thể cần database fixture thay vì UI Admin và không mở rộng scope sang CRUD.
4. Bao phủ `CA-I1`, `CA-I2`, `AU-I1`, `AU-I2`, `AU-I3`, `TH-I2`, `UL-I2`,
   `CT-V1/V2` và UI partition bằng EP case riêng.
5. Code empty, whitespace và case/trim chỉ được ghi requirement-gap/exploratory
   case với expected result giới hạn; không lấy source behavior làm oracle.
6. Duplicate code chỉ là data-integrity/schema case nếu bài cần; không tạo
   application expected result cho trạng thái database bị cấm.
7. Mỗi negative case giữ các dimension còn lại nominal valid để cô lập nguyên
   nhân; case nhiều invalid condition cần lý do interaction/risk.
8. Percent arithmetic dùng total/value cho kết quả nguyên; fractional rounding
   và discount vượt total giữ unresolved.
9. Exact message/status không được assert ngoài phần API contract có căn cứ.
10. Mọi case phải truy vết `rule → partition → boundary (nếu có) → test case`.
