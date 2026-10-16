# D-M09 — Equivalence Partitioning và Boundary Value Analysis

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `D-M09` |
| Feature | Mobile Feature 9 — Discount Coupon |
| Baseline | `01_spec_and_oracle.md` và `02_domain_model.md` đã qua `REVIEWED` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Equivalence Partitioning, three-value/robust BVA và state-transition probe |
| Trạng thái | `REVIEWED` |
| Thời điểm tạo | 2026-10-14 17:16:45 +07:00 |
| Thời điểm review | 2026-10-14 17:41:13 +07:00 |
| Phạm vi | Chọn partition, boundary và representative data; chưa thiết kế test case hoàn chỉnh |

Hai điều kiện mở vẫn được giữ: bằng chứng phân công chính thức cho D-M09 và môi
trường thực thi Mobile ở Step 5. Không dùng Expo Web evidence để tuyên bố native
coverage.

## 2. Phương pháp và đơn vị kế cận

- Dùng three-value BVA tại boundary có giá trị biên thuộc một phía rõ ràng:
  `b-Δ`, `b`, `b+Δ`.
- Dùng robust BVA khi giá trị ngoài miền cấu hình hợp lệ cần kiểm tra fixture hoặc
  defensive behavior.
- Với tiền integer-compatible trong fixture, `Δ = 1 ₫`.
- Với usage count, `Δ = 1 lần`.
- Với expiry, predecessor/equal/successor logic là `T-Δt`, `T`, `T+Δt`; đề xuất
  `Δt = 1 giây` chỉ khi fixture, timezone và clock được kiểm soát. Nếu không, case
  sát biên phải `BLOCKED`, không tự gán expected theo clock không ổn định.
- Với `discount_value`, fixture SQLite dùng integer nên chọn `-1, 0, 1` để kiểm
  tra lower boundary quanh 0. Điều này không tuyên bố precision nghiệp vụ chỉ hỗ
  trợ integer.
- Coupon code, active state, type, authentication, network outcome và UI state là
  categorical/state partition. Không gọi chúng là numeric BVA.
- Không dùng worst-case Cartesian product; ưu tiên one-fault-at-a-time và targeted
  interaction dựa trên `D-IC-01`–`D-IC-08`.

## 3. Coupon code và trạng thái coupon

### 3.1 Equivalence partition

| Analysis ID | Domain partition | Class | Representative | Expected/oracle |
|---|---|---|---|---|
| `D-EP-01` | Code exact ánh xạ coupon active | `VALID` | `SAVE10` | C1 đạt; tiếp tục C2–C5 (`D-R01`) |
| `D-EP-02` | Code không tồn tại | `INVALID` | `NO_SUCH_COUPON` | REJECT, không discount (`D-R02`) |
| `D-EP-03` | Coupon tồn tại nhưng inactive | `INVALID` | Fixture `INACTIVE`, `is_active=0` | REJECT (`D-R02`) |
| `D-EP-04` | Raw code empty | `UNRESOLVED UI/ACTION` | `""` | Effective code không đạt C1 nếu gửi; UI dispatch/feedback chưa có oracle |
| `D-EP-05` | Raw code whitespace-only | `UNRESOLVED NORMALIZATION` | `"   "` | Chưa biết trim/reject/dispatch là đúng (`D-GAP-R02`) |
| `D-EP-06` | Lowercase của code tồn tại | `UNRESOLVED NORMALIZATION` | `save10` | Không dùng `toUpperCase()` hiện tại làm oracle |
| `D-EP-07` | Uppercase exact | `VALID BASELINE` | `SAVE10` | Ánh xạ coupon active |
| `D-EP-08` | Leading/trailing whitespace | `UNRESOLVED NORMALIZATION` | `"  SAVE10  "` | Chưa biết preserve/trim/reject là đúng |

Không có maximum code length, charset hay case-sensitivity rule. Vì vậy không tạo
`length max-1/max/max+1`, không dùng chuỗi dài tùy ý làm boundary và không biến
`D-EP-04`–`08` thành verdict dựa trên behavior Mobile hiện tại.

### 3.2 Probe có kiểm soát

| Probe ID | Input | Observation cần ghi | Verdict rule |
|---|---|---|---|
| `D-PC-01` | `""` | Nút có disabled không, request có được gửi không, feedback có xuất hiện không | `UNRESOLVED` nếu chỉ dựa source |
| `D-PC-02` | `"   "` | Trim/dispatch/request body | `UNRESOLVED` |
| `D-PC-03` | `save10` | Raw input, effective request code, kết quả mapping | `UNRESOLVED normalization`; C1 đánh giá trên effective code |
| `D-PC-04` | `SAVE10` | Nominal active mapping | Có thể PASS/FAIL C1 |
| `D-PC-05` | `"  SAVE10  "` | Preserve/trim/reject | `UNRESOLVED` |
| `D-PC-06` | `NO_SUCH_COUPON` | Business reject và total không đổi | Có oracle `D-R02` |
| `D-PC-07` | Fixture inactive | Business reject và total không đổi | Có oracle `D-R02` |

## 4. Order total và minimum order amount

### 4.1 Application boundary `D-B01`

Với minimum `M` và trusted total integer VND:

| Boundary ID | Point | Test value | Expected classification | Rule |
|---|---|---:|---|---|
| `D-B01` | Just below | `M - 1 ₫` | `INVALID`: REJECT | `D-R06` |
| `D-B01` | On boundary | `M` | `VALID`: C3 đạt | `D-R05` |
| `D-B01` | Just above | `M + 1 ₫` | `VALID`: C3 đạt | `D-R05` |

Fixture cụ thể với `SAVE10`, `M = 300.000 ₫`: `299.999`, `300.000`, `300.001`.
Mọi điểm phải dùng total được Backend recompute. Một request body mang đúng số
nhưng không được recompute vẫn thuộc `D-TH-I2`, không phải valid C3.

### 4.2 Configuration lower boundary `D-B02`

`min_order_amount >= 0` chỉ dùng để chuẩn bị fixture, không mở rộng sang Admin CRUD.

| Boundary ID | Value | Classification |
|---|---:|---|
| `D-B02` | `-1 ₫` | Invalid configuration |
| `D-B02` | `0 ₫` | Valid lower boundary |
| `D-B02` | `1 ₫` | Valid just above |

## 5. Expiry boundary

### `D-B03` — before/equal/after expiry

Với expiry instant `T`:

| Boundary ID | Logical point | Selected value | Expected classification | Rule |
|---|---|---|---|---|
| `D-B03` | Immediately before | `T - Δt` | `VALID`: C2 đạt | `D-R03` |
| `D-B03` | Exactly at | `T` | `INVALID`: REJECT | `D-R04` |
| `D-B03` | Immediately after | `T + Δt` | `INVALID`: REJECT | `D-R04` |

`Δt = 1 giây` chỉ là test representation khi controlled clock và DB value cùng
timezone/granularity. Nếu runner không kiểm soát được clock hoặc equality instant,
giữ case exact-boundary `BLOCKED` theo `D-GAP-R07`; chỉ dùng clearly-future và
clearly-expired data cho nominal partitions.

## 6. Usage count và limit

### 6.1 Application boundary `D-B04`

Với `L = max_uses_per_user`:

| Boundary ID | Point | Value | Expected classification | Rule |
|---|---|---:|---|---|
| `D-B04` | Just below | `L - 1` | `VALID`: C5 đạt | `D-R09` |
| `D-B04` | At limit | `L` | `INVALID`: REJECT | `D-R10` |
| `D-B04` | Above limit | `L + 1` | `INVALID`: REJECT | `D-R10` |

Với `SAVE10`, `L=1`: `0`, `1`, `2`. Mỗi count phải thuộc đúng cặp trusted
user–coupon. Count giống nhau nhưng thuộc user khác là binding partition
`D-UL-I2`, không phải một boundary point hợp lệ.

### 6.2 Configuration lower boundary `D-B05`

| Boundary ID | Value | Classification |
|---|---:|---|
| `D-B05` | `0` | Invalid configuration |
| `D-B05` | `1` | Valid lower boundary |
| `D-B05` | `2` | Valid just above |

## 7. Discount value, type và arithmetic

### 7.1 Positive-value boundary `D-B06`

| Boundary ID | Value | Classification | Rationale |
|---|---:|---|---|
| `D-B06` | `-1` | Invalid configuration | Discount value phải dương |
| `D-B06` | `0` | Invalid configuration | Không đạt `> 0` |
| `D-B06` | `1` | Valid lower representative | Integer-compatible fixture |

Không suy diễn maximum percent, maximum fixed value hoặc decimal precision từ
schema `INTEGER`.

### 7.2 Type partition và nominal arithmetic

| Analysis ID | Type/data | Expected discount | Expected final | Rule |
|---|---|---:|---:|---|
| `D-EP-09` | Percent 10; total `400.000 ₫` | `40.000 ₫` | `360.000 ₫` | `D-R12`, `D-R14` |
| `D-EP-10` | Fixed `50.000 ₫`; total `600.000 ₫` | `50.000 ₫` | `550.000 ₫` | `D-R13`, `D-R14` |
| `D-EP-11` | Type ngoài `percent/fixed` | Không có công thức hợp lệ | Không xác định | Invalid fixture/config |

Percent và fixed là enum partition, không có thứ tự nên không áp dụng BVA cho type.

### 7.3 Rounding, cap và floor

| Probe ID | Data | Mathematical observation | Verdict |
|---|---|---|---|
| `D-PC-08` | Percent 10; total `333.333 ₫` | Formula tạo `33.333,3 ₫` | `UNRESOLVED`: không assert floor/ceil/round |
| `D-PC-09` | Percent >100 | Có thể discount lớn hơn total | `UNRESOLVED`: maximum/cap chưa có oracle |
| `D-PC-10` | Fixed value > total | Formula có thể tạo final âm | `UNRESOLVED`: cap/floor chưa có oracle |

Không thay expected result bằng `Math.floor()` của implementation. Với bộ test có
verdict rõ, chọn total/value tạo kết quả nguyên và kiểm tra đúng công thức SRS.

## 8. Authentication và identity partition

| Analysis ID | Partition | Class | Expected |
|---|---|---|---|
| `D-EP-12` | JWT valid, identity lấy từ token | `VALID` | C4 đạt; dùng identity đó cho usage |
| `D-EP-13` | Missing JWT | `INVALID` | REJECT |
| `D-EP-14` | Invalid/expired JWT | `INVALID` | REJECT |
| `D-EP-15` | Body `user_id` khác JWT identity | `NON-CONFORMING TRUST` | Không được bind usage theo body |

Authentication là state/category partition, không có numeric boundary.

## 9. Network, HTTP và request failure

| Analysis ID | Condition | Class | Expected classification |
|---|---|---|---|
| `D-EP-16` | Backend reachable, 2xx parseable và payload hợp oracle | `VALID TRANSPORT` | Đánh giá ACCEPT và UI success |
| `D-EP-17` | Backend reachable, expected 4xx cho guard sai | `VALID TRANSPORT + BUSINESS REJECT` | UI không áp dụng discount; exact code/text chưa assert |
| `D-EP-18` | Unexpected 5xx | `SUT/ENV INVESTIGATION` | Ghi actual/log; không tự đổi thành coupon reject |
| `D-EP-19` | Timeout/mất mạng/connection refused | `TRANSPORT FAILURE` | Không có business verdict; retry/message chưa có oracle |
| `D-EP-20` | Response non-JSON/malformed | `TRANSPORT/PARSE FAILURE` | Ghi actual; resilience behavior unresolved |
| `D-EP-21` | Sai API host cho runtime | `ENVIRONMENT` | BLOCKED/setup issue cho tới khi endpoint đúng |

`HTTP error` không đồng nghĩa một loại duy nhất: expected 4xx có thể là business
reject đúng, 5xx là lỗi cần điều tra, còn connection failure là transport/environment.

## 10. Button và request-state analysis

Đây là state-transition analysis, không phải numeric BVA.

| Transition ID | Trước event | Event | Sau event quan sát/cần kiểm tra | Oracle |
|---|---|---|---|---|
| `D-TR-01` | `IDLE_EMPTY` | Chưa nhập/empty | Apply disabled hoặc không dispatch | `UNRESOLVED` (`D-GAP-R03`) |
| `D-TR-02` | `READY` | Nhấn Apply | Vào `LOADING`; có tối đa một request | Loading/double tap `UNRESOLVED` |
| `D-TR-03` | `LOADING` | ACCEPT | `SUCCESS`; hiển thị discount/final | Amount/display có oracle `D-R16`, `R17` |
| `D-TR-04` | `LOADING` | Business REJECT | `BUSINESS_ERROR`; không đổi total bởi coupon | Reject có oracle; exact feedback chưa đủ |
| `D-TR-05` | `LOADING` | Transport failure | `TRANSPORT_ERROR` | Không gán business verdict |
| `D-TR-06` | `SUCCESS` | Edit code | Result cũ được giữ/xóa/thay | `UNRESOLVED` (`D-GAP-R04`) |
| `D-TR-07` | `BUSINESS_ERROR` | Edit code | Error cũ được giữ/xóa/thay | `UNRESOLVED` (`D-GAP-R04`) |
| `D-TR-08` | Terminal state | Apply lại | Re-entry/loading/new result | Retry behavior chưa quy định |

Source hiện disabled Apply với empty/loading, dùng `...` khi loading và xóa
result/error khi edit. Các behavior này là probe target, không phải expected result
được SRS xác nhận.

## 11. UI/output conformance partition

| Analysis ID | Dimension | Conforming | Non-conforming | Rule |
|---|---|---|---|---|
| `D-EP-22` | Money | Separator + `₫` | Thiếu/sai format/unit | `D-R17` |
| `D-EP-23` | Language | Tiếng Việt nhất quán | Nhãn/message không nhất quán | `D-R18` |
| `D-EP-24` | Positive action color | Xanh dương | Màu khác | `D-R19` |
| `D-EP-25` | Error placement | Trên Apply action liên quan | Dưới/chỉ alert/không hiện | `D-R20` |
| `D-EP-26` | Native semantic/navigation | Phụ thuộc mapping được chốt | Expo Web DOM không đại diện native | `D-GAP-R08`, `D-GAP-R10` |

## 12. Boundary catalog cho Step 4

| Boundary ID | Domain | Values | Expected classes | Status |
|---|---|---|---|---|
| `D-B01` | Total so với minimum | `M-1`, `M`, `M+1` | Invalid, Valid, Valid | Ready |
| `D-B02` | Minimum config quanh 0 | `-1`, `0`, `1` | Invalid config, Valid, Valid | Fixture robustness |
| `D-B03` | Expiry | `T-Δt`, `T`, `T+Δt` | Valid, Invalid, Invalid | Controlled clock required |
| `D-B04` | Usage so với limit | `L-1`, `L`, `L+1` | Valid, Invalid, Invalid | Ready |
| `D-B05` | Limit config quanh 1 | `0`, `1`, `2` | Invalid config, Valid, Valid | Fixture robustness |
| `D-B06` | Discount value quanh 0 | `-1`, `0`, `1` | Invalid, Invalid, Valid | Integer-compatible fixture |

Không có boundary ID cho code length, type enum, network category hoặc button
state vì các miền đó không có ordered numeric boundary được oracle xác nhận.

## 13. Traceability rule → partition/boundary/probe

| Rule/gap | Analysis coverage |
|---|---|
| `D-R01`, `D-R02` | `D-EP-01`–`03`, `D-PC-04`, `06`, `07` |
| `D-R03`, `D-R04` | `D-B03` |
| `D-R05`, `D-R06` | `D-B01`; config support `D-B02` |
| `D-R07`, `D-R08` | `D-EP-12`–`15` |
| `D-R09`, `D-R10` | `D-B04`; config support `D-B05` |
| `D-R11` | Composite nominal bằng `D-EP-01`, `D-B01`, `D-B03`, `D-EP-12`, `D-B04` |
| `D-R12`, `D-R13` | `D-EP-09`, `D-EP-10`; value `D-B06` |
| `D-R14` | `D-EP-09`, `D-EP-10`, `D-PC-08`–`10` |
| `D-R15` | `D-B01` với trusted total và trust-negative `D-TH-I2` từ Step 2 |
| `D-R16` | `D-TR-03`, `D-TR-04`, success/error UI |
| `D-R17`–`D-R20` | `D-EP-22`–`25` |
| `D-GAP-R01` | Provenance phạm vi đã xác nhận tại `S001-I003`; không tạo data boundary |
| `D-GAP-R02` | `D-EP-04`–`08`, `D-PC-01`–`05` |
| `D-GAP-R03`, `D-GAP-R04` | `D-TR-01`–`08` |
| `D-GAP-R05` | `D-EP-16`–`20`; không assert exact status/text |
| `D-GAP-R06` | `D-PC-08`–`10` |
| `D-GAP-R07` | Điều kiện controlled clock của `D-B03` |
| `D-GAP-R08` | `D-EP-26` |
| `D-GAP-R09`, `D-GAP-R10` | `D-EP-18`–`21`, platform evidence tách riêng |
| `D-GAP-R11` | Usage lifecycle chưa có atomic transition oracle |

Coverage phân tích: `20/20` rule và `11/11` gap có partition, boundary, probe hoặc
lý do N/A. Đây là design coverage, không phải test execution.

## 14. Unresolved và điều kiện để thiết kế verdict

| Nội dung | Trạng thái Step 3 | Điều kiện mở khóa |
|---|---|---|
| Code length/charset | Không tạo boundary | Requirement chính thức |
| Empty/whitespace/case/trim | Probe `UNRESOLVED` | Normalization và UI action rule |
| Percent rounding | Probe `UNRESOLVED` | Rounding/precision rule |
| Percent maximum, fixed cap, final floor | Probe `UNRESOLVED` | Cap/floor/config policy |
| Exact expiry equality | Logical oracle có, execution sát biên có thể BLOCKED | Controlled clock/timezone/granularity |
| Exact status/message/schema | Không assert ngoài amount contract | API response contract đầy đủ |
| Loading/disabled/double tap/retry | State probe `UNRESOLVED` | Feedback/state requirement |
| Network/offline/malformed response | Không tạo business verdict | Resilience contract và môi trường kiểm soát |
| Native semantics/device matrix | Chưa tuyên bố coverage | Chọn runtime và mapping accessibility/navigation |
| Usage atomicity | Chưa thiết kế count increment transition bắt buộc | Chốt thời điểm ghi usage/recovery |

## 15. Thống kê phân tích

- Equivalence/UI/network analysis ID: 26 (`D-EP-01`–`D-EP-26`).
- Boundary ID: 6 (`D-B01`–`D-B06`).
- Controlled probe ID: 10 (`D-PC-01`–`D-PC-10`).
- State transition ID: 8 (`D-TR-01`–`D-TR-08`).
- Rule coverage: `20/20`.
- Gap coverage: `11/11`.

Mọi miền `UNRESOLVED` được giữ ở trạng thái gap/blocked trong test design.
