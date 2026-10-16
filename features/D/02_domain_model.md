# D-M09 — Domain model

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `D-M09` |
| Feature | Mobile Feature 9 — Discount Coupon |
| Đầu vào | `01_spec_and_oracle.md` ở trạng thái `REVIEWED — 2 OPEN CONDITIONS` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Domain modeling và Equivalence Partitioning; chưa khóa boundary value |
| Trạng thái | `REVIEWED` |
| Thời điểm tạo | 2026-10-14 16:27:24 +07:00 |
| Thời điểm review | 2026-10-14 17:16:31 +07:00 |
| Mục tiêu | Mô hình hóa object, variable, partition, dependency, trust boundary và Mobile state transition trước Step 3 |

Hai điều kiện mở của Step 1 được giữ nguyên: thiếu bằng chứng phân công chính thức
cho `D-M09` và chưa chọn môi trường thực thi Step 5. Chúng không chặn domain model
nhưng cấm tuyên bố native coverage hoặc tự đổi scope.

## 2. Nguyên tắc mô hình hóa

- `D-R01`–`D-R20` là business/UI oracle đã review; source chỉ cung cấp
  implementation behavior và testability context.
- Input Mobile, session, cart, persistent coupon state, request/response, network
  và UI state được tách để tránh xem một state client là bằng chứng cho Backend.
- Eligibility là phép hội C1–C5. Khi cô lập một invalid partition, các biến còn
  lại dùng nominal valid value nếu có thể.
- `raw_code`, `normalized_code` và coupon được ánh xạ là ba khái niệm khác nhau.
  `trim/uppercase` hiện là behavior quan sát được, không phải oracle normalization.
- Loading, disabled, double tap và reset result khi edit được mô hình hóa để test
  state transition, nhưng giữ `UNRESOLVED` khi SRS không cung cấp expected result.
- Network/backend failure không được phân loại thành business rejection hoặc SUT
  defect nếu chưa loại trừ sai host, service dừng và lỗi môi trường.
- Expo Web, Android/iOS emulator và thiết bị thật là environment partition riêng;
  evidence không được thay thế lẫn nhau.
- Storage type SQLite không tự tạo business limit, rounding, cap hoặc floor.

## 3. Các đối tượng cần thiết

| Object ID | Đối tượng | Thuộc tính chính | Trách nhiệm trong model | Nguồn |
|---|---|---|---|---|
| `D-OBJ-01` | `MobileUserSession` | JWT, authenticated user, client user object | Xác định quyền vào checkout và trusted identity cho C4/C5 | `D-R07`, `D-R08`; `D-OBS-01`, `10` |
| `D-OBJ-02` | `CartPricingContext` | cart items, price, quantity, client `cartTotal`, authoritative total | Cung cấp tổng cho threshold và phép tính; Backend phải recompute | `D-R05`, `D-R06`, `D-R15` |
| `D-OBJ-03` | `CouponCodeInput` | raw text, effective/normalized code, input state | Biểu diễn empty, whitespace, exact, normalized và code được gửi | `D-R01`, `D-R02`; `D-GAP-R02` |
| `D-OBJ-04` | `Coupon` | id, code, active, expiry, minimum, type, value, limit | Cung cấp guard C1–C3/C5 và công thức discount | `D-R01`–`D-R06`, `D-R12`, `D-R13` |
| `D-OBJ-05` | `CouponUsage` | coupon id, trusted user id, count, limit | Biểu diễn usage của đúng cặp user–coupon | `D-R09`, `D-R10` |
| `D-OBJ-06` | `ApplyCouponRequest` | code, total, identity/auth context | Request qua trust boundary Mobile → Backend | API spec; `D-R07`, `D-R15` |
| `D-OBJ-07` | `ApplyCouponResponse` | accept/reject, discount, final, error/result payload | Kết quả transport; exact status/text/schema còn gap | `D-R11`–`D-R14`; `D-GAP-R05` |
| `D-OBJ-08` | `MobileCheckoutView` | input, Apply action, loading, error, result, total display | UI quan sát được trước/trong/sau apply | `D-R16`–`D-R20`; `D-OBS-03`–`08` |
| `D-OBJ-09` | `CouponApplication` | user, total, coupon, usage, now, decision | Aggregate đánh giá C1–C5 và tạo discount result | `D-R01`–`D-R14` |
| `D-OBJ-10` | `NetworkBackendChannel` | runtime, API base URL, reachability, response parseability | Phân biệt business result với environment/transport failure | `D-GAP-R09`, `D-GAP-R10`; `D-OBS-13` |
| `D-OBJ-11` | `EvaluationClock` | now, expiry, timezone/granularity | Đánh giá C2 trong một time model nhất quán | `D-R03`, `D-R04`; `D-GAP-R07` |

`Coupon` và `CouponUsage` là fixture/precondition, không mở rộng Pool D sang
Coupon CRUD của Admin.

## 4. Quan hệ, data flow và trust boundary

```text
MobileCheckoutView
  ├─ raw_code ─> CouponCodeInput ─> ApplyCouponRequest ───────┐
  ├─ JWT ──────> MobileUserSession ─> trusted user identity ──┤
  └─ cart intent ──────────────────> Backend recomputes total ┤
                                                               v
Coupon + CouponUsage + EvaluationClock ─────────────> CouponApplication
                                                        evaluate C1–C5
                                                               │
NetworkBackendChannel <──────────────── ApplyCouponResponse <───┤
                                                               ├─ REJECT: no discount
                                                               └─ ACCEPT: discount/final
                                                                         │
                                                                         v
                                                            MobileCheckoutView
```

Trust rules:

1. Identity dùng kiểm tra usage phải suy ra từ JWT hợp lệ; `user_id` trong body
   hoặc Mobile state không phải nguồn tin cậy.
2. Total dùng cho threshold và discount phải được Backend tính lại từ cart/product
   data có thẩm quyền; `cartTotal` client chỉ là display/request data.
3. Coupon và usage đến từ persistent state theo đúng coupon và trusted user.
4. `now` và `expired_at` phải dùng cùng time model.
5. UI chỉ được hiển thị kết quả coupon như hợp lệ sau response ACCEPT thỏa oracle;
   network failure không tương đương coupon REJECT.

## 5. Danh mục biến domain

| Variable ID | Biến | Loại/đơn vị | Valid/conforming domain | Invalid/non-conforming domain | Dependency | Rule/gap |
|---|---|---|---|---|---|---|
| `D-DM-01` | `raw_code` | Chuỗi Mobile input | Chuỗi có thể ánh xạ coupon sau xử lý đã được oracle cho phép | Không ánh xạ coupon; empty/whitespace dispatch chưa có oracle riêng | Input/UI | `D-R01`, `D-R02`, `D-GAP-R02` |
| `D-DM-02` | `effective_code` | Chuỗi gửi Backend | Code ánh xạ đúng coupon cần test | Normalization làm đổi sai ý nghĩa hoặc code không tồn tại | `raw_code` | `D-GAP-R02`; `D-OBS-02` |
| `D-DM-03` | `jwt_state` | Enum | JWT valid và nhận diện được user | Missing, invalid, expired | Auth service | `D-R07`, `D-R08` |
| `D-DM-04` | `trusted_user_id` | Identity | Suy ra từ JWT valid | Không có hoặc khác JWT identity | `jwt_state` | `D-R07`, `D-R08` |
| `D-DM-05` | `client_user_id` | Request field | Không được dùng thay trusted identity | Bị tin để bypass/đổi user | Mobile user object | `D-R07`, `D-OBS-10` |
| `D-DM-06` | `cart_items` | Tập item/quantity | Item hợp lệ để Backend recompute | Thiếu, sai hoặc bị client thao túng | Cart/product DB | `D-R15` |
| `D-DM-07` | `client_cart_total` | VND | Giá trị display phù hợp cart; không phải trust source | Bị Backend tin trực tiếp | `cart_items` | `D-R15` |
| `D-DM-08` | `trusted_order_total` | VND | Backend recompute; `>= 0` theo dữ liệu cart hợp lệ | Không recompute hoặc không khớp authoritative data | `cart_items` | `D-R15` |
| `D-DM-09` | `coupon_exists_active` | Boolean predicate | Coupon tồn tại và `is_active = 1` | Không tồn tại hoặc inactive | `effective_code`, DB | `D-R01`, `D-R02` |
| `D-DM-10` | `expired_at` / `now` | Date-time | `now < expired_at` | `now >= expired_at` | Coupon/clock | `D-R03`, `D-R04`, `D-GAP-R07` |
| `D-DM-11` | `min_order_amount` | VND | Config `>= 0`; apply hợp lệ khi total `>= min` | Config âm hoặc total `< min` | Coupon/total | `D-R05`, `D-R06` |
| `D-DM-12` | `coupon_type` | Enum | `percent`, `fixed` | Type khác | Coupon | `D-R12`, `D-R13` |
| `D-DM-13` | `discount_value` | `%` hoặc VND | Số dương phù hợp type | `<= 0`, sai kiểu; maximum unresolved | Type | `D-R12`, `D-R13`, `D-GAP-R06` |
| `D-DM-14` | `usage_count` | Số lần, integer | `0 <= count < limit` | `count >= limit`; count sai binding | User/coupon | `D-R09`, `D-R10` |
| `D-DM-15` | `max_uses_per_user` | Số lần, integer | Config `>= 1` | `< 1` hoặc sai kiểu | Coupon | FR-17; `D-R09`, `D-R10` |
| `D-DM-16` | `network_backend` | Enum/state | Reachable và trả response parseable | Unreachable, timeout, non-JSON/malformed | Runtime/API URL | `D-GAP-R09`, `D-GAP-R10` |
| `D-DM-17` | `apply_request_state` | State | `idle`, `ready`, `loading`, terminal success/error | Transition/re-entry/double tap unresolved | Input/network | `D-GAP-R03` |
| `D-DM-18` | `business_decision` | Enum | ACCEPT khi C1–C5 đạt; REJECT khi có guard sai | Không được suy từ transport failure | Eligibility | `D-R01`–`D-R11` |
| `D-DM-19` | `discount_amount` | VND | Đúng công thức theo type | Khác công thức; rounding unresolved | Total/type/value | `D-R12`, `D-R13`, `D-GAP-R06` |
| `D-DM-20` | `final_amount` | VND | `total - discount` | Khác phép tính; cap/floor unresolved | Total/discount | `D-R14`, `D-GAP-R06` |
| `D-DM-21` | `ui_result_state` | Enum | None, accepted result hoặc rejected feedback nhất quán với response | Stale/mâu thuẫn state; reset-on-edit unresolved | Response/input | `D-R16`, `D-GAP-R04` |
| `D-DM-22` | `money_display` | UI string | Separator và `₫` nhất quán | Sai/missing format hoặc unit | Amount output | `D-R17` |
| `D-DM-23` | `language` | UI text set | Tiếng Việt, trừ thuật ngữ chuẩn | Không nhất quán | View | `D-R18` |
| `D-DM-24` | `positive_action_color` | UI style | Xanh dương | Màu khác | View | `D-R19` |
| `D-DM-25` | `validation_feedback_position` | UI layout | Lỗi phía trên action liên quan | Lỗi dưới action/chỉ alert/không hiện | Reject response | `D-R20`, `D-GAP-R08` |
| `D-DM-26` | `runtime_platform` | Environment enum | Platform được khai báo và evidence đúng platform | Trộn Expo Web với native claim | Test environment | `D-GAP-R10` |

## 6. Equivalence partition — input, identity và eligibility

### 6.1 Coupon code input và mapping (`CD`)

| Partition ID | Class | Definition | Expected/model use | Rule/gap |
|---|---|---|---|---|
| `D-CD-V1` | `VALID` | Effective code ánh xạ coupon active | C1 đạt | `D-R01` |
| `D-CD-I1` | `INVALID` | Effective code không ánh xạ coupon | REJECT nếu request được đánh giá | `D-R02` |
| `D-CD-I2` | `INVALID` | Ánh xạ coupon inactive | REJECT | `D-R02` |
| `D-CD-U1` | `UNRESOLVED` | Raw input empty | UI dispatch/feedback chưa quy định; không tự lấy disabled behavior làm oracle | `D-GAP-R02`, `R03` |
| `D-CD-U2` | `UNRESOLVED` | Raw input whitespace-only | Trim/reject/dispatch chưa quy định | `D-GAP-R02` |
| `D-CD-U3` | `UNRESOLVED` | Raw input có leading/trailing whitespace hoặc khác case nhưng normalized code tồn tại | Chưa biết preserve/normalize/reject là đúng | `D-GAP-R02` |

`D-CD-U1/U2` không phủ nhận rằng một empty effective code không thể đạt C1; trạng
thái unresolved nằm ở expected UI/action và normalization trước khi Backend đánh
giá.

### 6.2 Authentication và identity (`AU`)

| Partition ID | Class | Definition | Expected/model use | Rule |
|---|---|---|---|---|
| `D-AU-V1` | `VALID` | JWT valid, trusted user id xác định được | C4 đạt; dùng cho C5 | `D-R07` |
| `D-AU-I1` | `INVALID` | Không có JWT | REJECT/không được apply | `D-R08` |
| `D-AU-I2` | `INVALID` | JWT invalid hoặc expired | REJECT | `D-R08` |
| `D-AU-I3` | `NON-CONFORMING` | Backend tin `client_user_id` thay identity từ JWT | Không được bypass/bind sang user khác | `D-R07`, `D-R08` |

### 6.3 Existence/active (`CA`) và expiry (`EX`)

| Partition ID | Class | Predicate | Expected/model use | Rule |
|---|---|---|---|---|
| `D-CA-V1` | `VALID` | Coupon tồn tại và active | C1 đạt | `D-R01` |
| `D-CA-I1` | `INVALID` | Không tồn tại | REJECT | `D-R02` |
| `D-CA-I2` | `INVALID` | Tồn tại nhưng inactive | REJECT | `D-R02` |
| `D-EX-V1` | `VALID` | `now < expired_at` | C2 đạt | `D-R03` |
| `D-EX-I1` | `INVALID` | `now >= expired_at` | REJECT | `D-R04` |

### 6.4 Order threshold và trusted total (`TH`)

| Partition ID | Class | Predicate | Expected/model use | Rule |
|---|---|---|---|---|
| `D-TH-V1` | `VALID` | Trusted total `>= minimum` | C3 đạt, equality hợp lệ | `D-R05` |
| `D-TH-I1` | `INVALID` | Trusted total `< minimum` | REJECT | `D-R06` |
| `D-TH-I2` | `NON-CONFORMING` | Backend dùng total client gửi thay vì recompute | Không dùng total đó để quyết định/tính | `D-R15` |

### 6.5 Usage (`UL`)

| Partition ID | Class | Predicate | Expected/model use | Rule |
|---|---|---|---|---|
| `D-UL-V1` | `VALID` | `0 <= usage_count < limit`, đúng user–coupon | C5 đạt | `D-R09` |
| `D-UL-I1` | `INVALID` | `usage_count >= limit` | REJECT | `D-R10` |
| `D-UL-I2` | `NON-CONFORMING` | Count lấy từ user/coupon khác | Không được dùng để ACCEPT | `D-R07`, `D-R10` |

## 7. Equivalence partition — configuration và arithmetic

| Partition ID | Class | Definition | Expected/model use | Rule/gap |
|---|---|---|---|---|
| `D-CT-V1` | `VALID` | Type `percent` | Dùng công thức percent | `D-R12` |
| `D-CT-V2` | `VALID` | Type `fixed` | Dùng công thức fixed | `D-R13` |
| `D-CT-I1` | `INVALID CONFIG` | Type ngoài enum | Không có công thức SRS hợp lệ | FR-17 |
| `D-DV-V1` | `VALID CONFIG` | Discount value dương | Có thể tính theo type | FR-17 |
| `D-DV-I1` | `INVALID CONFIG` | Value `<= 0` hoặc sai kiểu | Coupon config invalid | FR-17 |
| `D-DV-U1` | `UNRESOLVED` | Percent >100 hoặc fixed > total | Không tự đặt cap/floor | `D-GAP-R06` |
| `D-DA-V1` | `VALID` | Percent result đúng `total × value / 100` và không cần rounding mơ hồ | ACCEPT arithmetic | `D-R12` |
| `D-DA-V2` | `VALID` | Fixed result bằng value | ACCEPT arithmetic | `D-R13` |
| `D-DA-I1` | `INVALID` | Discount khác công thức | FAIL oracle | `D-R12`, `D-R13` |
| `D-DA-U1` | `UNRESOLVED` | Percent tạo phần lẻ VND | Rounding chưa có oracle | `D-GAP-R06` |
| `D-FA-V1` | `VALID` | `final = total - discount` | ACCEPT arithmetic | `D-R14` |
| `D-FA-I1` | `INVALID` | Final khác phép trừ | FAIL oracle | `D-R14` |
| `D-FA-U1` | `UNRESOLVED` | Final âm do discount > total | Cap/floor chưa có oracle | `D-GAP-R06` |

## 8. Composite eligibility và request/response model

```text
C1 = D-CA-V1
C2 = D-EX-V1
C3 = D-TH-V1 và total không thuộc D-TH-I2
C4 = D-AU-V1 và identity không thuộc D-AU-I3
C5 = D-UL-V1 và binding không thuộc D-UL-I2

COUPON_ELIGIBLE = C1 ∧ C2 ∧ C3 ∧ C4 ∧ C5
```

| Composite ID | Condition | Business decision | Expected output |
|---|---|---|---|
| `D-EL-V1` | C1–C5 cùng đạt và config có nghĩa | `ACCEPT` | Discount/final đúng công thức; response có hai amount |
| `D-EL-I1` | C1 sai | `REJECT` | Không tạo discount |
| `D-EL-I2` | C2 sai | `REJECT` | Không tạo discount |
| `D-EL-I3` | C3 sai | `REJECT` | Không tạo discount |
| `D-EL-I4` | C4 sai | `REJECT` | Không tạo discount |
| `D-EL-I5` | C5 sai | `REJECT` | Không tạo discount |
| `D-EL-I6` | Total/identity/usage trust violation | `REJECT` dữ liệu không tin cậy | Không được bypass eligibility |
| `D-EL-U1` | Network/Backend unavailable trước khi có business response | `UNRESOLVED TRANSPORT` | Không gán coupon ACCEPT/REJECT |

Thứ tự `I1`–`I5` phục vụ one-fault-at-a-time, không đặt validation precedence hay
exact error text khi nhiều guard cùng sai.

## 9. Mobile request và UI state transition

### 9.1 Request state

| State ID | State | Event/guard | Transition | Oracle status |
|---|---|---|---|---|
| `D-AS-0` | `IDLE_EMPTY` | Mở checkout/chưa có code | Nhập text → `D-AS-1` | Empty dispatch behavior unresolved (`D-GAP-R03`) |
| `D-AS-1` | `READY` | Có raw input | Apply → `D-AS-2` nếu client dispatch | Dispatch/normalization partly unresolved |
| `D-AS-2` | `LOADING` | Request in flight | Business ACCEPT → `D-AS-3`; REJECT → `D-AS-4`; transport failure → `D-AS-5` | Loading/disabled/double tap unresolved |
| `D-AS-3` | `SUCCESS` | Response ACCEPT | UI hiển thị discount/final đúng response/oracle | Confirmed phần amount; reset-on-edit unresolved |
| `D-AS-4` | `BUSINESS_ERROR` | Response REJECT | Không áp dụng discount; feedback placement theo D-R20 | Exact text/status unresolved |
| `D-AS-5` | `TRANSPORT_ERROR` | Timeout/unreachable/malformed response | Không tạo business verdict; ghi environment/transport evidence | Resilience/retry unresolved |

### 9.2 UI state trước và sau apply

| UI Partition ID | Class | UI state | Expected classification |
|---|---|---|---|
| `D-UI-V1` | `VALID` | Success hiển thị `discount_amount`, `final_amount`, tiền đúng format | Conforming với `D-R16`, `D-R17` |
| `D-UI-I1` | `INVALID` | Success nhưng amount thiếu/sai hoặc total UI không dùng final hợp lệ | Non-conforming |
| `D-UI-V2` | `VALID` | Business reject không thay total bởi coupon | Conforming với reject oracle |
| `D-UI-I2` | `INVALID` | Reject nhưng vẫn giữ/applied discount như hợp lệ | Non-conforming |
| `D-UI-V3` | `VALID` | Tiếng Việt và positive action xanh dương | Conforming `D-R18`, `D-R19` |
| `D-UI-I3` | `INVALID` | Sai ngôn ngữ hoặc positive action không xanh dương | Non-conforming |
| `D-UI-V4` | `VALID` | Validation feedback nằm phía trên Apply action liên quan | Conforming `D-R20` |
| `D-UI-I4` | `INVALID` | Feedback dưới action/chỉ alert/không hiển thị | Non-conforming `D-R20` |
| `D-UI-U1` | `UNRESOLVED` | Nút disabled với empty/loading và chống double tap | Chỉ observation/probe (`D-GAP-R03`) |
| `D-UI-U2` | `UNRESOLVED` | Edit code sau success/error xóa state cũ | Chỉ observation/probe (`D-GAP-R04`) |
| `D-UI-U3` | `UNRESOLVED` | Native heading/focus/breadcrumb/required semantics | Platform mapping chưa chốt (`D-GAP-R08`) |

Implementation hiện chuyển `SUCCESS/ERROR → READY` khi edit bằng cách xóa result
và error; đây là đường testable nhưng expected transition vẫn unresolved.

## 10. Network, Backend availability và platform domain

| Partition ID | Class | Definition | Test interpretation | Gap |
|---|---|---|---|---|
| `D-NET-V1` | `VALID ENV` | API URL đúng, Backend reachable, response parseable | Có thể đánh giá business verdict | — |
| `D-NET-I1` | `ENVIRONMENT` | Sai host/port hoặc Backend dừng | BLOCKED/environment nếu setup sai; không gọi business bug | `D-GAP-R09`, `R10` |
| `D-NET-I2` | `TRANSPORT` | Timeout/mất mạng | Ghi actual; retry/offline expected chưa quy định | `D-GAP-R09` |
| `D-NET-I3` | `TRANSPORT` | HTTP body không parse được JSON | Ghi resilience observation; chưa có exact contract | `D-GAP-R09` |
| `D-PLAT-V1` | `OBSERVED` | Expo Web + Chrome device emulation | Chỉ tạo Expo Web evidence | `D-GAP-R10` |
| `D-PLAT-U1` | `UNVERIFIED` | Android emulator/Expo Go | Không tuyên bố coverage trước khi chạy | `D-GAP-R10` |
| `D-PLAT-U2` | `UNVERIFIED` | iOS simulator/device hoặc thiết bị thật | Không tuyên bố coverage trước khi chạy | `D-GAP-R10` |

Hard-coded `API_URL` là testability dependency. `localhost` hoạt động cho Expo Web
trên cùng máy nhưng không đồng nghĩa hoạt động từ thiết bị thật.

## 11. Interaction constraint cần combination testing

| Constraint ID | Dependency | Vì sao cần kết hợp | Bước sau |
|---|---|---|---|
| `D-IC-01` | Code × existence × active | Raw/normalized code quyết định coupon được tra cứu | Pair exact/nonexistent/inactive; normalization để unresolved probe |
| `D-IC-02` | Total × minimum × trusted source | Numeric threshold chỉ có nghĩa với total authoritative | BVA quanh minimum và trust-negative case |
| `D-IC-03` | JWT × client user id × usage | C5 phải dùng identity từ JWT | Valid/missing/invalid/mismatched identity |
| `D-IC-04` | Usage count × limit × coupon/user binding | Cùng count có verdict khác theo limit/binding | BVA quanh limit và binding negative |
| `D-IC-05` | Type × value × total | Công thức và unit phụ thuộc type | Percent/fixed nominal; rounding/cap unresolved |
| `D-IC-06` | Request state × network × response | UI terminal state phụ thuộc transport/business outcome | Success, reject, timeout/unreachable |
| `D-IC-07` | UI result × edit event | Stale result risk khi code thay đổi | Exploratory state-transition test |
| `D-IC-08` | Runtime platform × API URL | Reachability khác giữa Expo Web và native device | Tách test environment/evidence |

Không dùng worst-case Cartesian product toàn bộ biến. Step 3 chọn one-fault,
targeted pair/composite và các boundary có rủi ro cao.

## 12. Nominal baseline cho Step 3–4

| Biến/đối tượng | Nominal valid data/cách thiết lập |
|---|---|
| Session | Test user có JWT valid; trusted identity lấy từ token |
| Cart | Fixture items để Backend recompute total `400.000 ₫` hoặc `600.000 ₫` tùy coupon |
| Percent coupon | `SAVE10`: active, value 10, minimum `300.000 ₫`, future expiry, limit 1 |
| Percent result | Total `400.000 ₫`; discount `40.000 ₫`; final `360.000 ₫` |
| Fixed coupon | `BIGBUY`: active, value `50.000 ₫`, minimum `500.000 ₫`, future expiry, limit 1 |
| Fixed result | Total `600.000 ₫`; discount `50.000 ₫`; final `550.000 ₫` |
| Usage | Count `0` cho đúng user–coupon |
| Clock | Rõ ràng trước expiry; chưa dùng sát biên nếu clock/timezone chưa kiểm soát |
| Network | Backend reachable qua API URL phù hợp runtime đã khai báo |
| UI | Trạng thái `READY`, chưa có stale result/error từ lần apply trước |

Baseline là test data, không phải bằng chứng implementation đúng.

## 13. Traceability từ rule tới domain

| Rule | Object/variable/partition bao phủ |
|---|---|
| `D-R01` | `D-OBJ-03`, `D-OBJ-04`, `D-DM-09`, `D-CD-V1`, `D-CA-V1` |
| `D-R02` | `D-CD-I1`, `D-CD-I2`, `D-CA-I1`, `D-CA-I2`, `D-EL-I1` |
| `D-R03` | `D-OBJ-11`, `D-DM-10`, `D-EX-V1` |
| `D-R04` | `D-EX-I1`, `D-EL-I2` |
| `D-R05` | `D-DM-11`, `D-TH-V1` |
| `D-R06` | `D-TH-I1`, `D-EL-I3` |
| `D-R07` | `D-OBJ-01`, `D-DM-03`–`05`, `D-AU-V1`, `D-AU-I3` |
| `D-R08` | `D-AU-I1`, `D-AU-I2`, `D-EL-I4` |
| `D-R09` | `D-OBJ-05`, `D-DM-14`, `D-UL-V1` |
| `D-R10` | `D-UL-I1`, `D-UL-I2`, `D-EL-I5` |
| `D-R11` | `D-OBJ-06`–`09`, `D-EL-V1`, `D-AS-3` |
| `D-R12` | `D-DM-12`, `D-DM-13`, `D-CT-V1`, `D-DA-V1` |
| `D-R13` | `D-CT-V2`, `D-DA-V2` |
| `D-R14` | `D-DM-20`, `D-FA-V1`, `D-FA-I1` |
| `D-R15` | `D-OBJ-02`, `D-DM-06`–`08`, `D-TH-I2`, `D-EL-I6` |
| `D-R16` | `D-OBJ-07`, `D-OBJ-08`, `D-DM-19`–`21`, `D-UI-V1`, `D-UI-I1` |
| `D-R17` | `D-DM-22`, `D-UI-V1` |
| `D-R18` | `D-DM-23`, `D-UI-V3`, `D-UI-I3` |
| `D-R19` | `D-DM-24`, `D-UI-V3`, `D-UI-I3` |
| `D-R20` | `D-DM-25`, `D-UI-V4`, `D-UI-I4` |

Domain coverage: `20/20` rule có object, variable hoặc partition truy vết. Đây là
design coverage, không phải execution coverage.

## 14. Requirement gap được mang sang Step 3

| Gap ID | Domain/partition ảnh hưởng | Quyết định mô hình |
|---|---|---|
| `D-GAP-R01` | Scope D-M09 | Giữ open condition; không ảnh hưởng phép tính/eligibility model |
| `D-GAP-R02` | `D-DM-01`, `02`; `D-CD-U1`–`U3` | Không phân loại normalize/dispatch thành PASS/FAIL |
| `D-GAP-R03` | `D-DM-17`; `D-AS-0`–`2`; `D-UI-U1` | State test là probe nếu chưa có rule bổ sung |
| `D-GAP-R04` | `D-DM-21`; `D-UI-U2` | Edit/reset transition unresolved |
| `D-GAP-R05` | Request/response; `D-AS-3`, `4` | Không assert exact status/text/schema ngoài amount contract |
| `D-GAP-R06` | `D-DV-U1`, `D-DA-U1`, `D-FA-U1` | Không đặt rounding/cap/floor |
| `D-GAP-R07` | `D-DM-10`, `D-EX-*` | Chỉ chọn sát biên khi clock/timezone được kiểm soát |
| `D-GAP-R08` | `D-DM-25`, `D-UI-U3` | Tách Expo Web semantic khỏi native accessibility |
| `D-GAP-R09` | `D-DM-16`, `D-AS-5`, `D-NET-I2/I3` | Không gọi transport observation là business defect |
| `D-GAP-R10` | `D-DM-26`, `D-PLAT-*`, `D-NET-I1` | Chưa tuyên bố native coverage; chốt trước Step 5 |
| `D-GAP-R11` | CouponUsage lifecycle | Không tạo transition bắt buộc `count → count+1`; giữ atomicity/recovery unresolved |

## 15. Coverage, count và giới hạn Step 2

- Object: 11.
- Domain variable: 26.
- Equivalence/composite/UI/network/platform partition: 60.
- Request state: 6.
- Interaction constraint: 8.
- Business rule mapped: `20/20`.
- Requirement/testability gap preserved: `11/11`.
- Boundary value chưa khóa: minimum, usage limit, expiry và discount value được
  chuyển sang `03_boundary_value_analysis.md`.

File này không khẳng định behavior Mobile đã chạy hoặc native device đã được test.
Các source observation chỉ giúp xác định đường test, không thay thế oracle.
