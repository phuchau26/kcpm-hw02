# B-FR09 — Test case design

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `B-FR09` |
| Feature | FR-09 — Discount Coupon trên Web checkout |
| Nền tảng | Web checkout; API/SQLite chỉ dùng cho setup và oracle cần thiết |
| Đầu vào | `01_spec_and_oracle.md`, `02_domain_model.md`, `03_boundary_value_analysis.md` đều `REVIEWED — HUMAN APPROVED` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Equivalence Partitioning, robust BVA, state/relational testing, trust-boundary và UI conformance |
| Test case chính | 41 (`B-TC-001`–`B-TC-041`) |
| Supporting precondition check | 9 (`B-PC-01`–`B-PC-09`), không tính là Web application test case |
| Trạng thái | `REVIEWED — EXECUTION AUTHORIZED` |
| Thời điểm tạo | 2026-10-13 11:08:02 +07:00 |
| Phạm vi bước | Thiết kế test; chưa thực thi, chưa gán Pass/Fail và chưa xác nhận bug |

## 2. Quy tắc thiết kế và verdict

- Expected result lấy từ `B-R01`–`B-R19`; không sửa theo actual implementation.
- Mỗi negative case thay đổi một partition chính khi có thể; các dimension còn
  lại dùng nominal valid state.
- `NOT RUN` chỉ là trạng thái thiết kế. Step 5 mới ghi Pass/Fail/Blocked và evidence.
- Case phụ thuộc clock dùng logical boundary `E±δ`; nếu Step 5 không kiểm soát
  timezone/granularity thì ghi `BLOCKED`, không tự chọn tick.
- Case code empty/whitespace/case, rounding và discount cap là `REQUIREMENT GAP`:
  được thiết kế để giữ traceability nhưng không có business Pass/Fail oracle đầy đủ.
- Exact HTTP status/message không được assert nếu SRS/API không quy định; tối
  thiểu kiểm tra accept/reject, discount/final và state đáng tin cậy.
- `B-PC-*` chỉ kiểm tra precondition/fixture integrity từ FR-17/schema; chúng
  không mở rộng Pool B sang Admin Coupon CRUD.
- Mọi test dùng database/fixture cô lập, không sửa source `SHOP` và không dùng
  runtime database của người dùng làm test database.

## 3. Test data và fixture

| ID | Dữ liệu/fixture | Nội dung |
|---|---|---|
| `U1` | User seed `test@eshop.com` | User chính; JWT hợp lệ khi case yêu cầu |
| `U2` | User test thứ hai | Dùng kiểm tra identity/usage binding |
| `CP10` | Percent coupon | `SAVE10`: active, value 10, minimum 300,000, future expiry, limit 1 |
| `CF50` | Fixed coupon | `BIGBUY`: active, value 50,000, minimum 500,000, future expiry, limit 1 |
| `CL2` | Limit-2 coupon | `VIP100`: active, fixed 100,000, minimum 300,000, future expiry, limit 2 |
| `CEXP` | Expired coupon | `EXPIRED`: active nhưng expiry 2020-01-01 |
| `COFF` | Inactive coupon | Fixture `INACTIVE10`, active = 0; các field còn lại valid |
| `CMIN0` | Minimum-zero coupon | Fixed 1, minimum 0, future expiry, limit 1 |
| `CMIN1` | Minimum-one coupon | Fixed 1, minimum 1, future expiry, limit 1 |
| `CPC1` | Percent lower-bound valid | Percent 1, minimum 0, future expiry, limit 1 |
| `CFC1` | Fixed lower-bound valid | Fixed 1, minimum 0, future expiry, limit 1 |
| `T400` | Trusted total 400,000 ₫ | Percent nominal: discount 40,000; final 360,000 |
| `T600` | Trusted total 600,000 ₫ | Fixed nominal: discount 50,000; final 550,000 |
| `E` | Controlled expiry instant | Chỉ dùng khi clock và timezone được fixture công bố |

### 3.1 Fixture invariants

1. Trước mỗi case, khôi phục coupon và `coupon_usage` về state của case.
2. Trusted total phải được tạo từ cart/product fixture để Backend có thể recompute.
3. Identity oracle lấy từ JWT; `user_id` trong request body không phải nguồn tin cậy.
4. Sau mỗi case, rollback hoặc phục hồi fixture; case usage không được làm nhiễu
   case sau.
5. Clock-boundary cases dùng clock injection/fake time nếu có; không đổi đồng hồ
   hệ điều hành dùng chung.
6. Không lưu token, credential, runtime database hoặc dữ liệu bí mật vào Git.

## 4. Procedure dùng chung

### `PROC-APPLY-WEB`

1. Reset fixture theo test data.
2. Đăng nhập `U1` nếu case yêu cầu và tạo cart cho trusted total tương ứng.
3. Mở Web checkout.
4. Nhập coupon code và chọn “Áp dụng”.
5. Quan sát request, lỗi hoặc kết quả discount/final trên UI.
6. Kiểm tra authoritative data/API response khi expected result yêu cầu.

### `PROC-APPLY-API`

1. Reset fixture và tạo cart/pricing context cho user trong token.
2. Gửi `POST /api/apply-coupon` với code, body và Authorization theo case.
3. Ghi response; đối chiếu accept/reject, formula và identity/total thực.
4. Không dùng HTTP status/message làm oracle ngoài phần đã được quy định.

### `PROC-TRUST-TOTAL`

1. Tạo cart có authoritative total theo case.
2. Thử thay đổi total ở UI/DevTools hoặc request body.
3. Áp dụng coupon.
4. Xác nhận Backend dùng tổng được tính lại từ cart/product state, không dùng
   giá trị bị chỉnh để vượt threshold hoặc tăng discount.

### `PROC-UI`

1. Mở Web checkout với state nominal và viewport desktop.
2. Inspect DOM/style và thao tác keyboard-only khi cần.
3. Với error placement, tạo một invalid coupon state có oracle xác định.
4. Ghi screenshot/DOM evidence ở Step 5; không kết luận chỉ từ màu tên class.

### `PROC-CLOCK`

1. Tạo coupon có `expired_at = E` trong fixture cô lập.
2. Đặt controlled clock tại `E-δ`, `E` hoặc `E+δ` trong cùng time model.
3. Thực hiện `PROC-APPLY-WEB` hoặc API tương đương.
4. Nếu không thể kiểm soát clock/timezone, không chạy và ghi `BLOCKED` ở Step 5.

## 5. Nominal, code và active-state test cases

| Test ID | Kỹ thuật | Input/state chính | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-001` | EP nominal + formula | `CP10`, `T400`, usage 0, JWT `U1` | `PROC-APPLY-WEB` | Accept; discount `40,000 ₫`; final `360,000 ₫`; UI hiển thị hai giá trị | `CA-V1`, `EX-V1`, `TH-V1`, `AU-V1`, `UL-V1`, `CT-V1`, `DA-V1`, `FA-V1`, `B-R11`, `B-R12`, `B-R14` | `NOT RUN` |
| `B-TC-002` | EP nominal + formula | `CF50`, `T600`, usage 0, JWT `U1` | `PROC-APPLY-WEB` | Accept; discount `50,000 ₫`; final `550,000 ₫` | `CT-V2`, `DA-V2`, `FA-V1`, `B-R11`, `B-R13`, `B-R14` | `NOT RUN` |
| `B-TC-003` | EP invalid membership | Code `NOTEXIST`; các state khác nominal | `PROC-APPLY-WEB` | Reject; không tạo coupon discount; tổng không đổi bởi code này | `CA-I1`, `EL-I1`, `B-R02` | `NOT RUN` |
| `B-TC-004` | EP inactive state | `COFF`; các state khác nominal | `PROC-APPLY-WEB` | Reject; không tạo coupon discount | `CA-I2`, `EL-I1`, `B-R02` | `NOT RUN` |
| `B-TC-005` | Requirement-gap probe | Code `""` | Thử UI apply nếu control cho phép; không bypass UI | Không có business verdict cho thao tác apply-empty; ghi actual và không công nhận discount không gắn coupon active | `CODE-U1`, `B-GAP-R07` | `DESIGNED — REQUIREMENT GAP` |
| `B-TC-006` | Requirement-gap probe | Code `"   "` | `PROC-APPLY-WEB` nếu có thể submit | Trim/empty response chưa được quy định; chỉ ghi actual, không đổi thành Pass/Fail business rule | `CODE-U2`, `B-GAP-R01`, `B-GAP-R07` | `DESIGNED — REQUIREMENT GAP` |
| `B-TC-007` | Requirement-gap probe | `save10` | `PROC-APPLY-WEB` | Case-folding chưa được quy định; ghi actual, không dùng UI uppercase behavior làm oracle | `CODE-U3`, `B-GAP-R01` | `DESIGNED — REQUIREMENT GAP` |
| `B-TC-008` | Requirement-gap probe | ` SAVE10 ` | `PROC-APPLY-WEB` | Surrounding-whitespace normalization chưa được quy định; ghi actual only | `CODE-U3`, `B-GAP-R01` | `DESIGNED — REQUIREMENT GAP` |

## 6. Expiry test cases

| Test ID | Kỹ thuật | Time/coupon state | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-009` | EP expired | `CEXP`, thời điểm hiện tại rõ ràng sau expiry | `PROC-APPLY-WEB` | Reject vì hết hạn; không discount | `EX-I1`, `B-R04` | `NOT RUN` |
| `B-TC-010` | BVA `E-δ` | `now = E-δ` | `PROC-CLOCK` | Coupon còn hạn; có thể accept khi C1/C3/C4/C5 valid | `B-B03-BEFORE`, `EX-V1`, `B-R03` | `DESIGNED — BLOCKED UNTIL CONTROLLED CLOCK` |
| `B-TC-011` | BVA `E` | `now = E` | `PROC-CLOCK` | Reject vì điều kiện yêu cầu current time phải trước expiry | `B-B03-ON`, `EX-I1`, `B-R04` | `DESIGNED — BLOCKED UNTIL CONTROLLED CLOCK` |
| `B-TC-012` | BVA `E+δ` | `now = E+δ` | `PROC-CLOCK` | Reject vì hết hạn | `B-B03-AFTER`, `EX-I1`, `B-R04` | `DESIGNED — BLOCKED UNTIL CONTROLLED CLOCK` |

## 7. Order threshold và trusted total

Các case `B-TC-013`–`B-TC-015` dùng `CP10`; C1, C2, C4, C5 giữ valid.

| Test ID | Kỹ thuật | Trusted total/input | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-013` | BVA `M-1` | `299,999 ₫` | `PROC-APPLY-WEB` | Reject vì dưới minimum `300,000 ₫` | `B-B01-LOW`, `TH-I1`, `B-R06` | `NOT RUN` |
| `B-TC-014` | BVA `M` | `300,000 ₫` | `PROC-APPLY-WEB` | Threshold hợp lệ; accept; discount `30,000 ₫`; final `270,000 ₫` | `B-B01-ON`, `TH-V1`, `B-R05`, `B-R12`, `B-R14` | `NOT RUN` |
| `B-TC-015` | BVA `M+1` | `300,001 ₫` | `PROC-APPLY-WEB` | Threshold hợp lệ và coupon được accept; không assert integer rounding của discount/final trong case này | `B-B01-HIGH`, `TH-V1`, `DA-U1`, `B-R05`, `B-GAP-R02` | `NOT RUN — PARTIAL ORACLE` |
| `B-TC-016` | Trust-boundary | Cart thật `400,000 ₫`; thử sửa UI/body xuống `299,999 ₫` | `PROC-TRUST-TOTAL` | UI không cho sửa trực tiếp; Backend vẫn dùng `400,000 ₫`, discount `40,000 ₫`, final `360,000 ₫` | `TH-I2`, `EL-I6`, `B-R15` | `NOT RUN` |
| `B-TC-017` | Trust-boundary | Cart thật `299,999 ₫`; body giả `400,000 ₫` | `PROC-TRUST-TOTAL` | Backend recompute `299,999 ₫` và reject; giá trị client không bypass threshold | `TH-I2`, `EL-I6`, `B-R06`, `B-R15` | `NOT RUN` |

## 8. Authentication và identity binding

| Test ID | Kỹ thuật | Auth/identity state | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-018` | EP missing auth | Không Authorization; coupon/total/usage nominal | `PROC-APPLY-API` | Reject; không áp dụng coupon | `AU-I1`, `EL-I4`, `B-R08` | `NOT RUN` |
| `B-TC-019` | EP invalid auth | JWT sai chữ ký | `PROC-APPLY-API` | Reject; không áp dụng coupon | `AU-I2`, `EL-I4`, `B-R08` | `NOT RUN` |
| `B-TC-020` | EP expired auth | JWT đã hết hạn | `PROC-APPLY-API` | Reject; không áp dụng coupon | `AU-I2`, `EL-I4`, `B-R08` | `NOT RUN` |
| `B-TC-021` | Relational trust | Token `U1`; `U1` đã dùng `CP10` 1/1; body giả `user_id = U2` chưa dùng | `PROC-APPLY-API` | Identity lấy từ JWT `U1`; reject vì `U1` đã đạt limit | `AU-I3`, `UL-I1`, `EL-I6`, `B-R07`, `B-R10` | `NOT RUN` |
| `B-TC-022` | Access/state | Chưa đăng nhập, truy cập trực tiếp `/checkout` | Mở URL trực tiếp rồi thử thao tác coupon/checkout | Không cho người chưa đăng nhập tiến hành checkout hoặc áp dụng coupon | `AU-I1`, `B-R08`; FR-08 | `NOT RUN` |

## 9. Usage-limit và binding test cases

| Test ID | Kỹ thuật | Coupon; `usage_count/limit` | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-023` | BVA `L-1` | `CP10`; `0/1` | `PROC-APPLY-WEB` | Còn lượt; accept nếu C1–C4 valid | `B-B02-L1-LOW`, `UL-V1`, `B-R09` | `NOT RUN` |
| `B-TC-024` | BVA `L` | `CP10`; `1/1` | `PROC-APPLY-WEB` | Reject vì đạt limit | `B-B02-L1-ON`, `UL-I1`, `B-R10` | `NOT RUN` |
| `B-TC-025` | BVA `L+1` | `CP10`; `2/1` | `PROC-APPLY-WEB` | Reject vì vượt limit | `B-B02-L1-HIGH`, `UL-I1`, `B-R10` | `NOT RUN` |
| `B-TC-026` | BVA `L-1` | `CL2`; `1/2` | `PROC-APPLY-WEB` | Còn đúng một lượt; accept nếu C1–C4 valid | `B-B02-L2-LOW`, `UL-V1`, `B-R09` | `NOT RUN` |
| `B-TC-027` | BVA `L` | `CL2`; `2/2` | `PROC-APPLY-WEB` | Reject vì đạt limit | `B-B02-L2-ON`, `UL-I1`, `B-R10` | `NOT RUN` |
| `B-TC-028` | BVA `L+1` | `CL2`; `3/2` | `PROC-APPLY-WEB` | Reject vì vượt limit | `B-B02-L2-HIGH`, `UL-I1`, `B-R10` | `NOT RUN` |
| `B-TC-029` | Relational binding | `U1` có usage 1 cho `CF50`, usage 0 cho `CP10`; apply `CP10` | `PROC-APPLY-WEB` | Chỉ đếm đúng cặp user–coupon; `CP10` vẫn eligible | `UL-I2`, `UL-V1`, `B-R09`, `B-R10` | `NOT RUN` |

## 10. Discount boundary, arithmetic và requirement-gap probes

| Test ID | Kỹ thuật | Coupon/total | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-030` | BVA `D=+ε`, percent | `CPC1`, value 1%; total `400,000 ₫` | `PROC-APPLY-WEB` | Accept; discount `4,000 ₫`; final `396,000 ₫` | `B-B04-ABOVE`, `DV-V1`, `DA-V1`, `FA-V1`, `B-R12`, `B-R14` | `NOT RUN` |
| `B-TC-031` | BVA `D=+ε`, fixed | `CFC1`, value `1 ₫`; total `600,000 ₫` | `PROC-APPLY-WEB` | Accept; discount `1 ₫`; final `599,999 ₫` | `B-B04-ABOVE`, `DV-V1`, `DA-V2`, `FA-V1`, `B-R13`, `B-R14` | `NOT RUN` |
| `B-TC-032` | Requirement-gap probe | Percent coupon tạo fractional VND | Apply bằng isolated fixture | Formula toán học áp dụng, nhưng integer rounding verdict chưa xác định; ghi actual, không gán Pass/Fail rounding | `DA-U1`, `B-GAP-R02` | `DESIGNED — REQUIREMENT GAP` |
| `B-TC-033` | Requirement-gap probe | Percent value 101, các state khác valid | Apply bằng isolated fixture nếu fixture cho phép | Maximum/cap/reject chưa được quy định; không dùng behavior hiện tại làm oracle | `DV-U1`, `B-B07`, `B-GAP-R03` | `DESIGNED — REQUIREMENT GAP` |
| `B-TC-034` | Requirement-gap probe | Fixed discount lớn hơn trusted total | Apply bằng isolated fixture nếu fixture cho phép | Cap/floor/negative-final behavior chưa được quy định; ghi actual only | `FA-U1`, `B-B07`, `B-GAP-R03` | `DESIGNED — REQUIREMENT GAP` |

Các điểm `D=-ε` và `D=0` không phải Web application state hợp lệ; chúng được
giữ ở `B-PC-02`–`B-PC-05` thay vì tạo expected behavior giả cho FR-09.

## 11. UI conformance test cases

| Test ID | Kỹ thuật | Kiểm tra | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-035` | UI/output | Format total, discount và final | `PROC-UI`, apply nominal percent/fixed | Mọi giá trị tiền dùng separator hàng nghìn và ký hiệu `₫` | `UI-MONEY-V1/I1`, `B-R16` | `NOT RUN` |
| `B-TC-036` | Structural/UI | Heading và breadcrumb | `PROC-UI`; inspect DOM | Checkout có đúng một `<h1>` mô tả trang và có breadcrumb | `UI-H1`, `UI-BREAD`, `B-R17` | `NOT RUN` |
| `B-TC-037` | UI/style | Màu nút “Áp dụng” và checkout | `PROC-UI`; inspect computed style/design token | Các positive action dùng màu xanh dương | `UI-COLOR`, `B-R18` | `NOT RUN` |
| `B-TC-038` | Sequence/UI | Tab order | Tải lại checkout; dùng keyboard-only Tab | Focus đi trên-xuống, trái-phải và tới mọi control tương tác | `UI-TAB`, `B-R18` | `NOT RUN` |
| `B-TC-039` | UI/error placement | Gây lỗi bằng `NOTEXIST` | `PROC-UI` | Error hiển thị trong trang phía trên action apply/submit liên quan | `UI-ERROR`, `B-R19` | `NOT RUN` |

## 12. Valid lower-bound configuration used by FR-09

Hai case này kiểm tra hành vi áp dụng với configuration hợp lệ tại/sát lower
boundary của `min_order_amount`; chúng không kiểm thử form Admin.

| Test ID | Kỹ thuật | Coupon/total | Procedure | Expected result | Coverage | Trạng thái |
|---|---|---|---|---|---|---|
| `B-TC-040` | BVA `M=0` | `CMIN0`, total `100 ₫`, usage 0 | `PROC-APPLY-WEB` | Minimum config 0 hợp lệ; accept; fixed discount `1 ₫`; final `99 ₫` | `B-B05-ON`, `DV-V1`, `B-R05`, `B-R13`, `B-R14` | `NOT RUN` |
| `B-TC-041` | BVA `M=1`, equality | `CMIN1`, trusted total `1 ₫`, usage 0 | `PROC-APPLY-WEB` | Config 1 hợp lệ và total bằng minimum; accept; discount `1 ₫`; final `0 ₫` | `B-B05-HIGH`, `TH-V1`, `B-R05`, `B-R13`, `B-R14` | `NOT RUN` |

## 13. Supporting precondition/data-integrity checks

Các check này bảo đảm test fixture không đưa invalid configuration vào nominal
suite. Chúng không được tính vào 41 Web application test case và không dùng để
kết luận FR-09 application behavior với corrupted data.

| Check ID | Boundary/partition | Data | Expected precondition result | Phạm vi |
|---|---|---|---|---|
| `B-PC-01` | `CODE-I4` | Insert code trùng `DUP10` | Unique constraint/valid creation path không cho hai coupon cùng code | FR-17/schema integrity |
| `B-PC-02` | `B-B04-BELOW`, `DV-I1` | Percent value `-1` | Không đưa vào nominal FR-09 fixture | FR-17 precondition |
| `B-PC-03` | `B-B04-ON`, `DV-I1` | Percent value `0` | Không đưa vào nominal FR-09 fixture | FR-17 precondition |
| `B-PC-04` | `B-B04-BELOW`, `DV-I1` | Fixed value `-1` | Không đưa vào nominal FR-09 fixture | FR-17 precondition |
| `B-PC-05` | `B-B04-ON`, `DV-I1` | Fixed value `0` | Không đưa vào nominal FR-09 fixture | FR-17 precondition |
| `B-PC-06` | `B-B05-LOW` | `min_order_amount = -1` | Không dùng làm valid coupon fixture | FR-17 precondition |
| `B-PC-07` | `B-B06-LOW` | `max_uses_per_user = 0` | Không dùng làm valid coupon fixture | FR-17 precondition |
| `B-PC-08` | `DV-I2` | Nonnumeric discount value | Không dùng làm valid coupon fixture | FR-17 precondition |
| `B-PC-09` | `CT-I1` | Type `tiered` | Không dùng làm valid coupon fixture; không có FR-09 formula | FR-17 precondition |

`B-B06-ON` (limit 1) được dùng ở `B-TC-023`–`B-TC-025`; `B-B06-HIGH`
(limit 2) được dùng ở `B-TC-026`–`B-TC-028`.

## 14. Traceability business rule → test case

| Rule | Test case bao phủ |
|---|---|
| `B-R01` | `B-TC-001`, `B-TC-002`, `B-TC-004` |
| `B-R02` | `B-TC-003`, `B-TC-004` |
| `B-R03` | `B-TC-001`, `B-TC-010` |
| `B-R04` | `B-TC-009`, `B-TC-011`, `B-TC-012` |
| `B-R05` | `B-TC-014`, `B-TC-015`, `B-TC-040`, `B-TC-041` |
| `B-R06` | `B-TC-013`, `B-TC-017` |
| `B-R07` | `B-TC-021`, `B-TC-029` |
| `B-R08` | `B-TC-018`–`B-TC-022` |
| `B-R09` | `B-TC-023`, `B-TC-026`, `B-TC-029` |
| `B-R10` | `B-TC-021`, `B-TC-024`, `B-TC-025`, `B-TC-027`, `B-TC-028` |
| `B-R11` | `B-TC-001`, `B-TC-002` |
| `B-R12` | `B-TC-001`, `B-TC-014`, `B-TC-030` |
| `B-R13` | `B-TC-002`, `B-TC-031`, `B-TC-040`, `B-TC-041` |
| `B-R14` | `B-TC-001`, `B-TC-002`, `B-TC-014`, `B-TC-030`, `B-TC-031`, `B-TC-040`, `B-TC-041` |
| `B-R15` | `B-TC-016`, `B-TC-017` |
| `B-R16` | `B-TC-035` |
| `B-R17` | `B-TC-036` |
| `B-R18` | `B-TC-037`, `B-TC-038` |
| `B-R19` | `B-TC-039` |

## 15. Traceability boundary → test case/check

| Boundary | Below | At boundary | Above | Ghi chú |
|---|---|---|---|---|
| `B-B01` order threshold | `B-TC-013` | `B-TC-014` | `B-TC-015` | High point có rounding gap nên chỉ assert threshold/acceptance |
| `B-B02` usage count | `B-TC-023`, `B-TC-026` | `B-TC-024`, `B-TC-027` | `B-TC-025`, `B-TC-028` | Bao phủ limit 1 và 2 |
| `B-B03` expiry | `B-TC-010` | `B-TC-011` | `B-TC-012` | Cần controlled clock |
| `B-B04` discount positive | `B-PC-02`, `B-PC-04` | `B-PC-03`, `B-PC-05` | `B-TC-030`, `B-TC-031` | Invalid side là precondition check |
| `B-B05` minimum config | `B-PC-06` | `B-TC-040` | `B-TC-041` | Không kiểm thử Admin UI |
| `B-B06` usage-limit config | `B-PC-07` | `B-TC-023`–`B-TC-025` | `B-TC-026`–`B-TC-028` | L=1 và L=2 |
| `B-B07` cap/max | `B-TC-033`, `B-TC-034` | Không có specified boundary | Không có | Requirement gap probe |
| `B-B08` code length/case | `B-TC-005`–`B-TC-008` | Không có specified boundary | Không có | Requirement gap probe, không gọi là BVA |

## 16. Requirement gap → designed case

| Gap | Test case | Hạn chế oracle |
|---|---|---|
| `B-GAP-R01` | `B-TC-006`–`B-TC-008` | Không assert trim/case/length normalization |
| `B-GAP-R02` | `B-TC-015`, `B-TC-032` | Threshold vẫn assert được; rounding thì không |
| `B-GAP-R03` | `B-TC-033`, `B-TC-034` | Không assert cap/reject/floor |
| `B-GAP-R04` | `B-TC-010`–`B-TC-012` | Concrete execution cần clock contract |
| `B-GAP-R05` | Mọi reject case | Không assert exact status/message ngoài contract |
| `B-GAP-R06` | Usage setup/cleanup của `B-TC-023`–`B-TC-029` | Không assert event/transaction tăng usage ngoài phạm vi case |
| `B-GAP-R07` | `B-TC-005`, `B-TC-006` | Empty/apply behavior không có business verdict đầy đủ |

## 17. Thứ tự execution đề xuất

1. Validate isolated fixture bằng `B-PC-01`–`B-PC-09`; loại invalid data khỏi
   nominal suite.
2. Chạy `B-TC-035`–`B-TC-039` để ghi nhận UI/control hiện hữu.
3. Chạy nominal `B-TC-001`–`B-TC-004` và clear-expired `B-TC-009`.
4. Chạy threshold, trusted-total và authentication cases.
5. Reset `coupon_usage` trước từng usage-boundary/binding case.
6. Chạy valid lower-bound arithmetic/config cases.
7. Chạy clock cases nếu có controlled clock; nếu không ghi `BLOCKED`.
8. Chạy requirement-gap probes cuối, ghi actual nhưng không ép business verdict.

## 18. Review gate

Gate đã được kiểm tra trước khi triển khai Step 5. Expected result vẫn giữ nguyên;
mọi case thiếu oracle được giữ dưới dạng requirement gap/blocked condition.

- [x] Xác nhận 41 Test ID duy nhất, liên tục và 9 precondition check tách riêng.
- [x] Xác nhận expected result không dùng candidate implementation bug làm oracle.
- [x] Xác nhận `B-TC-005`–`008`, `032`–`034` giữ đúng giới hạn requirement gap.
- [x] Xác nhận clock cases không tự đặt timezone/granularity.
- [x] Xác nhận trusted total và JWT identity được kiểm tra end-to-end/API phù hợp.
- [x] Xác nhận mọi data row của `B-B01`–`B-B06` được map tới test/check.
- [x] Xác nhận `B-B07/B-B08` không bị trình bày như specified numeric boundary.
- [x] Xác nhận traceability bao phủ `B-R01`–`B-R19` và `B-GAP-R01`–`B-GAP-R07`.
- [x] Xác nhận fixture/cleanup giữ các case độc lập và không dùng runtime database.
- [x] Cho phép chuyển sang Step 5 theo yêu cầu execution trực tiếp của sinh viên.
