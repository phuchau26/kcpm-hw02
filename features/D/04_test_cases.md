# D-M09 — Test-case design

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `D-M09` |
| Feature | Mobile Feature 9 — Discount Coupon |
| Baseline | Step 1–3 đã qua `REVIEWED` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Equivalence Partitioning, BVA, state transition, trust-boundary và UI conformance |
| Trạng thái | `REVIEWED` |
| Người review | Nguyễn Phúc Hậu (`23120252`) |
| Thời điểm xác nhận | 2026-10-15 19:21:58 +07:00 |
| Số test case | 50 (`D-TC-001`–`D-TC-050`) |
| Phạm vi | Thiết kế test; chưa thực thi và chưa có actual result/evidence |

Không sao chép verdict hoặc evidence từ Pool B. Các business rule dùng chung chỉ
được tái sử dụng vì cùng có nguồn từ FR-08/FR-09; mọi kết quả Pool D phải được
thực thi và lưu evidence riêng trên runtime được khai báo.

## 2. Quy ước expected result và trạng thái thiết kế

- `NOT RUN`: có oracle đủ để đưa ra PASS/FAIL sau execution.
- `DESIGNED — REQUIREMENT GAP`: test ghi behavior nhưng không gán PASS/FAIL cho
  phần thiếu oracle.
- `DESIGNED — BLOCKED UNTIL CONTROLLED CLOCK`: expected logic có căn cứ nhưng
  execution sát expiry cần clock/timezone được kiểm soát.
- `DESIGNED — BLOCKED UNTIL MOBILE ENVIRONMENT CHOSEN`: cần native runtime hoặc
  mapping platform được chốt; Expo Web không thay thế.
- Exact HTTP status, error text và schema ngoài `discount_amount/final_amount`
  không được dùng làm oracle.
- Với case có cả phần xác định và unresolved, expected result ghi rõ assertion nào
  được phép và phần nào chỉ observation.

## 3. Test data và fixture

| Data ID | Dữ liệu | Mục đích |
|---|---|---|
| `D-U1` | Test user có JWT valid | Nominal authenticated identity |
| `D-U2` | User khác có JWT valid | Identity/usage binding |
| `D-C10` | `SAVE10`: percent 10, minimum 300.000, active, future expiry, limit 1 | Percent, threshold và usage |
| `D-CF50` | `BIGBUY`: fixed 50.000, minimum 500.000, active, future expiry, limit 1 | Fixed nominal |
| `D-CL2` | `VIP100`: fixed 100.000, minimum 300.000, active, future expiry, limit 2 | Usage limit 2 |
| `D-CEXP` | `EXPIRED`: active, expiry rõ ràng trong quá khứ | Expired partition |
| `D-COFF` | Fixture inactive, field khác nominal | Inactive partition |
| `D-CPC1` | Percent value 1, minimum 0, active, future expiry | Discount lower valid point |
| `D-CFC1` | Fixed value 1 ₫, minimum 0, active, future expiry | Fixed lower valid point |
| `D-T400` | Cart authoritative total 400.000 ₫ | Percent nominal: discount 40.000, final 360.000 |
| `D-T600` | Cart authoritative total 600.000 ₫ | Fixed nominal: discount 50.000, final 550.000 |
| `D-E` | Controlled expiry instant | Chỉ dùng cho before/equal/after expiry |

Fixture invariant:

1. Mỗi case reset coupon, cart, user và `coupon_usage` về đúng precondition.
2. Total phải được tạo từ product price × quantity và được Backend recompute.
3. Trusted identity phải đến từ JWT, không lấy `user_id` client làm oracle.
4. Runtime database phải là SQLite fixture cô lập, không dùng database làm việc của `SHOP`.
5. Clock case không đổi đồng hồ hệ điều hành dùng chung.
6. Platform, OS, Expo/app version, API URL và viewport phải được ghi ở Step 5.

## 4. Procedure dùng chung

### `D-PROC-MOBILE-APPLY`

1. Reset fixture theo test data.
2. Khởi động Backend và Mobile runtime đã khai báo.
3. Đăng nhập khi case yêu cầu, tạo cart và mở Mobile checkout.
4. Nhập coupon code, chọn “Áp dụng”.
5. Ghi request, loading/button state, response, error/result và số tiền UI.
6. Đối chiếu authoritative DB/API state khi expected result yêu cầu.

### `D-PROC-API`

1. Reset fixture và tạo authoritative cart/pricing context cho user trong token.
2. Gửi apply request với code, body và authentication context theo case.
3. Ghi accept/reject, amount, identity và total thực được dùng.
4. Không assert exact HTTP status/text ngoài contract đã xác nhận.

### `D-PROC-CLOCK`

1. Tạo coupon có expiry `D-E` trong fixture cô lập.
2. Đặt controlled clock tại `E-Δt`, `E` hoặc `E+Δt` trong cùng timezone/granularity.
3. Thực hiện apply với C1/C3/C4/C5 nominal.
4. Nếu không thể kiểm soát clock, không chạy và ghi `BLOCKED`.

### `D-PROC-NETWORK`

1. Giữ business data nominal.
2. Kiểm soát response hoặc network theo case: 4xx, 5xx, timeout, unreachable,
   malformed body.
3. Ghi UI state, request count, log và recovery observation.
4. Không biến transport failure thành business REJECT.

### `D-PROC-CHECKOUT`

1. Apply coupon nominal và xác nhận result hợp lệ.
2. Chọn “Xác Nhận Thanh Toán”.
3. Kiểm tra order total authoritative và coupon/usage data có thể quan sát.
4. Không assert atomic usage lifecycle ngoài phần đã có oracle.

### `D-PROC-UI`

1. Chạy trên runtime/viewport được khai báo.
2. Ghi screenshot và accessibility/element state nếu runtime hỗ trợ.
3. Kiểm tra amount format, ngôn ngữ, màu action và error placement theo rule.
4. Với native-only behavior, không dùng Expo Web DOM để kết luận.

## 5. Checkout access và coupon input

| Test ID | Kỹ thuật | Precondition/input | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-001` | UI nominal | `D-U1`, cart có item | Mở checkout | Checkout mở được; coupon input và action Áp dụng hiển thị; total read-only trên UI | FR-08, `D-R15`, `D-OBJ-08` | `NOT RUN` |
| `D-TC-002` | Access/auth | Chưa đăng nhập | Thử đi từ cart tới checkout | Không cho người chưa đăng nhập tiến hành checkout/apply; chuyển tới login hoặc chặn tương đương | `D-AU-I1`, `D-R08` | `NOT RUN` |
| `D-TC-003` | Gap probe | Code `""` | Quan sát/nhấn Apply nếu có thể | Ghi disabled/dispatch/feedback; không gán PASS/FAIL cho disabled behavior | `D-EP-04`, `D-PC-01`, `D-TR-01`, `D-GAP-R03` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-004` | Gap probe | Code `"   "` | Nhập whitespace và thử Apply | Ghi trim/disabled/request; normalization và UI action chưa có oracle | `D-EP-05`, `D-PC-02`, `D-GAP-R02`, `D-GAP-R03` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-005` | Gap probe | Code `save10` | Apply và capture request body | Ghi raw/effective code; không dùng uppercase implementation làm normalization oracle | `D-EP-06`, `D-PC-03`, `D-GAP-R02` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-006` | Gap probe | Code `"  SAVE10  "` | Apply và capture request body | Ghi preserve/trim/reject; không tự đặt expected normalization | `D-EP-08`, `D-PC-05`, `D-GAP-R02` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-007` | EP baseline | Code `SAVE10`; state khác nominal | `D-PROC-MOBILE-APPLY` | Effective code ánh xạ coupon active và tiếp tục C2–C5 | `D-EP-01`, `D-EP-07`, `D-R01` | `NOT RUN` |

## 6. Nominal percent/fixed và coupon state

| Test ID | Kỹ thuật | Data | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-008` | EP nominal/formula | `D-C10`, `D-T400`, usage 0, JWT `D-U1` | `D-PROC-MOBILE-APPLY` | ACCEPT; discount 40.000 ₫; final 360.000 ₫; UI hiển thị hai amount | `D-EP-09`, `D-R11`, `D-R12`, `D-R14`, `D-R16` | `NOT RUN` |
| `D-TC-009` | EP nominal/formula | `D-CF50`, `D-T600`, usage 0, JWT `D-U1` | `D-PROC-MOBILE-APPLY` | ACCEPT; discount 50.000 ₫; final 550.000 ₫ | `D-EP-10`, `D-R11`, `R13`, `R14`, `R16` | `NOT RUN` |
| `D-TC-010` | EP nonexistent | `NO_SUCH_COUPON`; state khác nominal | Apply | REJECT; không tạo discount; total không đổi bởi coupon | `D-EP-02`, `D-PC-06`, `D-R02` | `NOT RUN` |
| `D-TC-011` | EP inactive | `D-COFF`; state khác nominal | Apply | REJECT; không tạo discount | `D-EP-03`, `D-PC-07`, `D-R02` | `NOT RUN` |
| `D-TC-012` | EP expired | `D-CEXP`; now rõ ràng sau expiry | Apply | REJECT vì hết hạn; không discount | `D-EX-I1`, `D-R04` | `NOT RUN` |

## 7. Expiry boundary

| Test ID | Kỹ thuật | Time | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-013` | BVA before | `now = E-Δt` | `D-PROC-CLOCK` | C2 đạt; ACCEPT nếu C1/C3/C4/C5 valid | `D-B03`, `D-R03` | `DESIGNED — BLOCKED UNTIL CONTROLLED CLOCK` |
| `D-TC-014` | BVA equal | `now = E` | `D-PROC-CLOCK` | REJECT vì current time không trước expiry | `D-B03`, `D-R04` | `DESIGNED — BLOCKED UNTIL CONTROLLED CLOCK` |
| `D-TC-015` | BVA after | `now = E+Δt` | `D-PROC-CLOCK` | REJECT vì hết hạn | `D-B03`, `D-R04` | `DESIGNED — BLOCKED UNTIL CONTROLLED CLOCK` |

## 8. Order threshold và trusted total

Các case `016`–`018` dùng `D-C10`, state khác nominal.

| Test ID | Kỹ thuật | Trusted total | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---:|---|---|---|---|
| `D-TC-016` | BVA `M-1` | 299.999 ₫ | Apply | REJECT vì dưới minimum 300.000 ₫ | `D-B01`, `D-R06` | `NOT RUN` |
| `D-TC-017` | BVA `M` | 300.000 ₫ | Apply | ACCEPT; equality hợp lệ; discount 30.000 ₫; final 270.000 ₫ | `D-B01`, `D-R05`, `D-R12`, `D-R14` | `NOT RUN` |
| `D-TC-018` | BVA `M+1` | 300.001 ₫ | Apply | Threshold hợp lệ; chỉ assert acceptance, không assert rounding của fractional percent | `D-B01`, `D-R05`, `D-GAP-R06` | `NOT RUN — PARTIAL ORACLE` |
| `D-TC-019` | Trust boundary | Cart thật 400.000; body thử sửa 299.999 | `D-PROC-API`/network interception | Backend dùng total recompute 400.000; discount 40.000; final 360.000 | `D-TH-I2`, `D-R15` | `NOT RUN` |
| `D-TC-020` | Trust boundary | Cart thật 299.999; body giả 400.000 | `D-PROC-API` | Backend recompute 299.999 và REJECT; client total không bypass threshold | `D-TH-I2`, `D-R06`, `D-R15` | `NOT RUN` |

## 9. Usage limit và identity binding

| Test ID | Kỹ thuật | Usage/auth state | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-021` | BVA `L-1` | `D-C10`, `0/1`, `D-U1` | Apply | C5 đạt; ACCEPT nếu C1–C4 valid | `D-B04`, `D-UL-V1`, `D-R09` | `NOT RUN` |
| `D-TC-022` | BVA `L` | `D-C10`, `1/1`, `D-U1` | Apply | REJECT vì đạt limit | `D-B04`, `D-UL-I1`, `D-R10` | `NOT RUN` |
| `D-TC-023` | BVA `L+1` | `D-C10`, `2/1`, `D-U1` | Apply | REJECT vì vượt limit | `D-B04`, `D-UL-I1`, `D-R10` | `NOT RUN` |
| `D-TC-024` | BVA limit 2 | `D-CL2`, `1/2`, `D-U1` | Apply | Còn một lượt; ACCEPT nếu C1–C4 valid | `D-B04`, `D-R09` | `NOT RUN` |
| `D-TC-025` | BVA limit 2 | `D-CL2`, `2/2`, `D-U1` | Apply | REJECT vì đạt limit | `D-B04`, `D-R10` | `NOT RUN` |
| `D-TC-026` | Identity binding | Token `D-U1`; U1 hết lượt; body `user_id=D-U2` còn lượt | `D-PROC-API` | Identity lấy từ JWT U1; REJECT; body không đổi user kiểm tra usage | `D-AU-I3`, `D-UL-I1`, `D-R07`, `D-R10` | `NOT RUN` |
| `D-TC-027` | Missing auth | Không JWT; coupon/total nominal | `D-PROC-API` | REJECT; không áp dụng coupon | `D-EP-13`, `D-R08` | `NOT RUN` |
| `D-TC-028` | Invalid auth | JWT sai hoặc hết hạn | `D-PROC-API` | REJECT; không áp dụng coupon | `D-EP-14`, `D-R08` | `NOT RUN` |

## 10. Discount lower boundary, rounding, cap và floor

| Test ID | Kỹ thuật | Data | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-029` | Precondition BVA | Discount value `-1` | Validate fixture trước suite | Invalid configuration; không dùng làm nominal coupon | `D-B06`, `D-DV-I1` | `NOT RUN — PRECONDITION CHECK` |
| `D-TC-030` | Precondition BVA | Discount value `0` | Validate fixture | Invalid configuration | `D-B06`, `D-DV-I1` | `NOT RUN — PRECONDITION CHECK` |
| `D-TC-031` | BVA `+1`, percent | `D-CPC1`, total 400.000 | Apply | ACCEPT; discount 4.000; final 396.000 | `D-B06`, `D-DA-V1`, `D-FA-V1`, `D-R12`, `D-R14` | `NOT RUN` |
| `D-TC-032` | BVA `+1`, fixed | `D-CFC1`, total 600.000 | Apply | ACCEPT; discount 1; final 599.999 | `D-B06`, `D-DA-V2`, `D-FA-V1`, `D-R13`, `D-R14` | `NOT RUN` |
| `D-TC-033` | Gap probe | Percent 10; total 333.333 | Apply isolated fixture | Ghi actual; không gán PASS/FAIL cho floor/ceil/round | `D-PC-08`, `D-DA-U1`, `D-GAP-R06` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-034` | Gap probe | Percent value 101 | Apply isolated fixture | Maximum/cap/reject chưa quy định; ghi actual only | `D-PC-09`, `D-DV-U1`, `D-GAP-R06` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-035` | Gap probe | Fixed discount lớn hơn total | Apply isolated fixture | Cap/floor/negative-final chưa quy định; ghi actual only | `D-PC-10`, `D-FA-U1`, `D-GAP-R06` | `DESIGNED — REQUIREMENT GAP` |

## 11. Request/button state và edit sau apply

| Test ID | Kỹ thuật | State/event | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-036` | State probe | READY → nhấn Apply; delayed response | Quan sát button và request count; thử nhấn nhiều lần | Ghi loading/disabled/double request; chưa có oracle để PASS/FAIL behavior này | `D-TR-02`, `D-UI-U1`, `D-GAP-R03` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-037` | State probe | SUCCESS → xóa toàn bộ code | Apply nominal rồi clear input | Ghi result/total có được reset; chưa có oracle reset-on-edit | `D-TR-06`, `D-UI-U2`, `D-GAP-R04` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-038` | State probe | SUCCESS → đổi sang code khác | Apply `SAVE10`, đổi sang `BIGBUY` chưa apply | Ghi stale result/final behavior; không tự đặt expected transition | `D-TR-06`, `D-GAP-R04` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-039` | State probe | BUSINESS_ERROR → sửa code | Gây nonexistent error rồi edit | Ghi error được giữ/xóa; chưa có oracle | `D-TR-07`, `D-GAP-R04` | `DESIGNED — REQUIREMENT GAP` |

## 12. Network và API error

| Test ID | Kỹ thuật | Failure/response | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-040` | Business HTTP error | Expected 4xx do nonexistent coupon | `D-PROC-NETWORK` | Business REJECT; không discount; không assert exact status/text | `D-EP-17`, `D-R02`, `D-GAP-R05` | `NOT RUN` |
| `D-TC-041` | API 5xx | Controlled 500 response | `D-PROC-NETWORK` | Ghi UI/log; không phân loại thành coupon reject; resilience expected chưa quy định | `D-EP-18`, `D-TR-05`, `D-GAP-R09` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-042` | Transport | Timeout/connection refused | `D-PROC-NETWORK` | Không có business verdict; ghi transport/environment evidence | `D-EP-19`, `D-TR-05`, `D-GAP-R09` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-043` | Parse failure | 2xx/5xx body non-JSON | `D-PROC-NETWORK` | Ghi actual; retry/message chưa có oracle | `D-EP-20`, `D-GAP-R09` | `DESIGNED — REQUIREMENT GAP` |

## 13. Checkout integration và output UI

| Test ID | Kỹ thuật | Check | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-044` | Integration | Checkout sau percent nominal | `D-PROC-CHECKOUT` với `D-TC-008` data | Order authoritative pricing nhất quán final 360.000; Backend không chỉ tin client final | `D-R12`, `D-R14`, `D-R15` | `NOT RUN` |
| `D-TC-045` | UI/output | Amount format và language | `D-PROC-UI`, apply percent/fixed | Total, discount, final có separator + `₫`; UI dùng tiếng Việt | `D-EP-22`, `D-EP-23`, `D-R17`, `D-R18` | `NOT RUN` |
| `D-TC-046` | UI/style | Apply và checkout action | `D-PROC-UI`; inspect style trên runtime | Positive action dùng màu xanh dương | `D-EP-24`, `D-R19` | `NOT RUN` |
| `D-TC-047` | UI/error placement | Gây nonexistent error | `D-PROC-UI` | Validation feedback nằm phía trên action Apply liên quan | `D-EP-25`, `D-R20` | `NOT RUN` |

## 14. Mobile viewport, keyboard và accessibility

| Test ID | Kỹ thuật | Runtime/check | Procedure | Expected result | Coverage | Thiết kế |
|---|---|---|---|---|---|---|
| `D-TC-048` | Visual probe | Viewport 440×956 Expo Web | Mở checkout, focus input, apply nominal | Ghi overflow/visibility; viewport matrix không có pass/fail oracle ngoài control phải dùng được cho case nghiệp vụ | `D-PLAT-V1`, `D-GAP-R10` | `DESIGNED — REQUIREMENT GAP` |
| `D-TC-049` | Native interaction | Soft keyboard trên Android/iOS runtime | Focus code, nhập và Apply | Keyboard obstruction/dismiss behavior chưa có requirement; ghi actual riêng theo platform | `D-PLAT-U1/U2`, `D-GAP-R10` | `DESIGNED — BLOCKED UNTIL MOBILE ENVIRONMENT CHOSEN` |
| `D-TC-050` | Accessibility/native semantic | Label, role, focus order, screen-reader exposure | `D-PROC-UI` trên native runtime | Mapping `<h1>`/Tab/breadcrumb/required sang native chưa chốt; chỉ ghi observation, không dùng Expo Web thay native | `D-EP-26`, `D-UI-U3`, `D-GAP-R08`, `D-GAP-R10` | `DESIGNED — BLOCKED UNTIL MOBILE ENVIRONMENT CHOSEN` |

## 15. Traceability business rule → test case

| Rule | Test case |
|---|---|
| `D-R01` | `D-TC-007`–`009`, `D-TC-011` |
| `D-R02` | `D-TC-010`, `D-TC-011`, `D-TC-040` |
| `D-R03` | `D-TC-013` |
| `D-R04` | `D-TC-012`, `D-TC-014`, `D-TC-015` |
| `D-R05` | `D-TC-017`, `D-TC-018` |
| `D-R06` | `D-TC-016`, `D-TC-020` |
| `D-R07` | `D-TC-021`, `D-TC-026` |
| `D-R08` | `D-TC-002`, `D-TC-027`, `D-TC-028` |
| `D-R09` | `D-TC-021`, `D-TC-024` |
| `D-R10` | `D-TC-022`, `D-TC-023`, `D-TC-025`, `D-TC-026` |
| `D-R11` | `D-TC-008`, `D-TC-009` |
| `D-R12` | `D-TC-008`, `D-TC-017`, `D-TC-031`, `D-TC-044` |
| `D-R13` | `D-TC-009`, `D-TC-032` |
| `D-R14` | `D-TC-008`, `D-TC-009`, `D-TC-017`, `D-TC-031`, `D-TC-032`, `D-TC-044` |
| `D-R15` | `D-TC-001`, `D-TC-019`, `D-TC-020`, `D-TC-044` |
| `D-R16` | `D-TC-008`, `D-TC-009`, `D-TC-045` |
| `D-R17` | `D-TC-045` |
| `D-R18` | `D-TC-045` |
| `D-R19` | `D-TC-046` |
| `D-R20` | `D-TC-047` |

## 16. Traceability boundary → test case/check

| Boundary | Below | At boundary | Above | Ghi chú |
|---|---|---|---|---|
| `D-B01` total/minimum | `D-TC-016` | `D-TC-017` | `D-TC-018` | Above chỉ assert threshold do rounding gap |
| `D-B02` minimum config | Fixture precheck | Dùng minimum 0 trong `D-CPC1/D-CFC1` | Minimum 1 có thể thêm fixture | Không kiểm thử Admin CRUD |
| `D-B03` expiry | `D-TC-013` | `D-TC-014` | `D-TC-015` | Cần controlled clock |
| `D-B04` usage/limit | `D-TC-021`, `D-TC-024` | `D-TC-022`, `D-TC-025` | `D-TC-023` | Bao phủ limit 1 và 2 |
| `D-B05` limit config | Fixture precheck limit 0 | `D-TC-021`–`023` dùng limit 1 | `D-TC-024`, `025` dùng limit 2 | Precondition/config coverage |
| `D-B06` discount value | `D-TC-029` | `D-TC-030` | `D-TC-031`, `D-TC-032` | Invalid side là fixture check |

## 17. Requirement gap → designed case

| Gap | Test case | Hạn chế oracle |
|---|---|---|
| `D-GAP-R01` | Toàn suite | Phạm vi được xác nhận tại `S001-I003`; không ảnh hưởng expected nghiệp vụ đã có nguồn |
| `D-GAP-R02` | `D-TC-003`–`006` | Không assert normalization/dispatch |
| `D-GAP-R03` | `D-TC-003`, `004`, `036` | Không assert disabled/loading/double tap |
| `D-GAP-R04` | `D-TC-037`–`039` | Không assert reset-on-edit |
| `D-GAP-R05` | Mọi reject; đặc biệt `D-TC-040` | Không assert exact status/text/schema |
| `D-GAP-R06` | `D-TC-018`, `033`–`035` | Không assert rounding/cap/floor |
| `D-GAP-R07` | `D-TC-013`–`015` | Execution sát biên cần controlled clock |
| `D-GAP-R08` | `D-TC-050` | Native semantic mapping chưa chốt |
| `D-GAP-R09` | `D-TC-041`–`043` | Resilience/retry chưa có oracle |
| `D-GAP-R10` | `D-TC-048`–`050` | Chưa chọn device/OS/runtime matrix |
| `D-GAP-R11` | `D-TC-021`–`026`, `044` | Không assert atomic usage increment/recovery |

## 18. Thứ tự execution đề xuất

1. Kiểm tra fixture/precondition `D-TC-029`, `030` và data config.
2. Chạy access/input/UI existence `D-TC-001`–`007`.
3. Chạy nominal, invalid coupon và clear-expired `D-TC-008`–`012`.
4. Chạy threshold/trusted-total và authentication/identity.
5. Reset usage trước từng case `D-TC-021`–`026`.
6. Chạy arithmetic rõ oracle rồi gap probe rounding/cap/floor.
7. Chạy state/network cases bằng response/network control.
8. Chạy checkout integration và UI conformance.
9. Chạy clock cases khi có controlled clock; nếu không ghi `BLOCKED`.
10. Chạy native-only cases khi đã chọn runtime; không thay bằng Expo Web.
