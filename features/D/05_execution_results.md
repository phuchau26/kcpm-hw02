# D-M09 — Kết quả thực thi Step 5

## 1. Trạng thái và baseline

| Trường | Giá trị |
|---|---|
| Trạng thái | `PENDING HUMAN REVIEW — NATIVE iOS SUPPLEMENT` |
| Người review | Nguyễn Phúc Hậu (`23120252`) |
| Thời điểm xác nhận | 2026-10-15 20:06:05 +07:00 |
| Test design | `features/D/04_test_cases.md` — `REVIEWED` |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Runtime chính | Expo Web, Chromium, viewport `440 × 956` |
| Runtime bổ sung | Thiết bị iOS thật qua Expo Go/SDK 57; model và iOS version chưa được ghi nhận |
| Bắt đầu | 2026-10-15T19:32:01+07:00 |
| Kết thúc | 2026-10-15T19:32:59+07:00 |
| Lệnh | `npm test` trong `automation/D-M09` |
| SQLite fixture | `automation/D-M09/runtime/d-m09-fixture.sqlite` — runtime only |

Expo Web là runtime của lần chạy này, không phải bằng chứng native Android/iOS.
Ngày 16/10/2026, chín screenshot bổ sung được thu trên thiết bị iOS thật. Lượt
này dùng Expo SDK 57 và cấu hình API LAN sau canonical baseline, nên được giữ
thành native supplement, không ghi đè machine result của lần chạy chính.

## 2. Thống kê

| Designed | Attempted | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|---:|
| 50 | 50 | 30 | 19 | 11 | 20 | 0 |

Quy ước: `attempted = PASS + FAIL + BLOCKED`; `executed = PASS + FAIL`.

### 2.1. Native iOS supplementary execution

| Nhóm evidence | Số lượng |
|---|---:|
| Screenshot nhận được | 9 |
| Khớp đầy đủ procedure/precondition thiết kế | 5 |
| Dùng test data khác thiết kế | 2 |
| Observation-only do thiếu oracle | 2 |
| Thay đổi canonical verdict | 0 |

| Test ID | Phân loại native evidence | Actual trên thiết bị iOS thật | Evidence |
|---|---|---|---|
| `D-TC-001` | Exact — hỗ trợ `PASS` | Checkout, coupon input, Apply, total và payment action hiển thị; cùng ảnh ghi nhận soft keyboard cho observation `D-TC-049`. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-001-ios-physical.jpg) |
| `D-TC-002` | Exact — hỗ trợ `PASS` | Người chưa đăng nhập bị chặn bằng alert yêu cầu đăng nhập. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-002-ios-physical.jpg) |
| `D-TC-003` | Observation — vẫn `BLOCKED` | Input rỗng và Apply có trạng thái visually muted; thiếu oracle disabled/dispatch nên không gán PASS/FAIL. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-003-ios-physical.jpg) |
| `D-TC-008` | Modified data — củng cố `FAIL` | Với total 4.000.000 ₫, SAVE10 hiển thị discount `-36.000.000 ₫` và final `40.000.000 ₫`; cùng root cause percent formula, nhưng không dùng đúng `D-T400`. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-008-ios-physical.jpg) |
| `D-TC-009` | Modified data — hỗ trợ fixed formula | Với total 4.000.000 ₫, BIGBUY trừ 50.000 ₫ và final 3.950.000 ₫; không thay thế canonical exact-data PASS dùng `D-T600`. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-009-ios-physical.jpg) |
| `D-TC-010` | Exact — hỗ trợ `PASS` | Code không tồn tại bị reject và total 4.000.000 ₫ không đổi. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-010-ios-physical.jpg) |
| `D-TC-012` | Exact — hỗ trợ `PASS` | Coupon hết hạn bị reject và total không đổi. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-012-ios-physical.jpg) |
| `D-TC-022` | Exact — hỗ trợ `PASS` | SAVE10 bị reject khi đã đạt usage limit 1/1. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-022-ios-physical.jpg) |
| `D-TC-042` | Observation — vẫn `BLOCKED` | Khi mất kết nối, iOS báo offline; app hiển thị raw `fetch failed`/`ExpoModulesCore/Promise.swift:56`. Thiếu network-message oracle nên chưa gọi là defect. | [iOS screenshot](../../evidence/D/native-ios/screenshots/D-TC-042-ios-physical.jpg) |

Ảnh gốc mang tên `tc44.jpg` được đổi thành evidence của `D-TC-042` vì nội dung
thực tế là transport/offline failure, không phải checkout integration của
`D-TC-044`. Screenshot không có request log, database check hoặc video nên không
được dùng để xác nhận behavior ngoài phần nhìn thấy.

## 3. Kết quả từng test case

| Test ID | Verdict | Actual/reason tóm tắt | Evidence |
|---|---|---|---|
| `D-TC-001` | `PASS` | Quan sát khớp oracle | [screenshot](../../evidence/D/execution/screenshots/D-TC-001.png) · [trace](../../evidence/D/execution/traces/D-TC-001.zip) |
| `D-TC-002` | `PASS` | Quan sát khớp oracle | [screenshot](../../evidence/D/execution/screenshots/D-TC-002.png) · [trace](../../evidence/D/execution/traces/D-TC-002.zip) |
| `D-TC-003` | `BLOCKED` | SRS chưa quy định disabled/dispatch cho empty hoặc whitespace; automation chỉ ghi observation. | [screenshot](../../evidence/D/execution/screenshots/D-TC-003.png) · [trace](../../evidence/D/execution/traces/D-TC-003.zip) |
| `D-TC-004` | `BLOCKED` | SRS chưa quy định disabled/dispatch cho empty hoặc whitespace; automation chỉ ghi observation. | [screenshot](../../evidence/D/execution/screenshots/D-TC-004.png) · [trace](../../evidence/D/execution/traces/D-TC-004.zip) |
| `D-TC-005` | `BLOCKED` | Thiếu oracle cho case normalization; request thực tế được lưu trong `results.json` | [screenshot](../../evidence/D/execution/screenshots/D-TC-005.png) · [trace](../../evidence/D/execution/traces/D-TC-005.zip) |
| `D-TC-006` | `BLOCKED` | Thiếu oracle cho trim; request thực tế được lưu trong `results.json` | [screenshot](../../evidence/D/execution/screenshots/D-TC-006.png) · [trace](../../evidence/D/execution/traces/D-TC-006.zip) |
| `D-TC-007` | `PASS` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/D/execution/screenshots/D-TC-007.png) · [trace](../../evidence/D/execution/traces/D-TC-007.zip) |
| `D-TC-008` | `FAIL` | Percent discount/final khác công thức FR-09 | [screenshot](../../evidence/D/execution/screenshots/D-TC-008.png) · [trace](../../evidence/D/execution/traces/D-TC-008.zip) |
| `D-TC-009` | `PASS` | Áp dụng thành công! Giảm 50,000 ₫ | [screenshot](../../evidence/D/execution/screenshots/D-TC-009.png) · [trace](../../evidence/D/execution/traces/D-TC-009.zip) |
| `D-TC-010` | `PASS` | Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa | [screenshot](../../evidence/D/execution/screenshots/D-TC-010.png) · [trace](../../evidence/D/execution/traces/D-TC-010.zip) |
| `D-TC-011` | `PASS` | Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa | [screenshot](../../evidence/D/execution/screenshots/D-TC-011.png) · [trace](../../evidence/D/execution/traces/D-TC-011.zip) |
| `D-TC-012` | `PASS` | Mã giảm giá đã hết hạn | [screenshot](../../evidence/D/execution/screenshots/D-TC-012.png) · [trace](../../evidence/D/execution/traces/D-TC-012.zip) |
| `D-TC-013` | `BLOCKED` | SUT không có clock injection; không thể so sánh tin cậy E−δ/E/E+δ. Cần controlled server clock trước khi chạy lại. | [screenshot](../../evidence/D/execution/screenshots/D-TC-013.png) · [trace](../../evidence/D/execution/traces/D-TC-013.zip) |
| `D-TC-014` | `BLOCKED` | SUT không có clock injection; không thể so sánh tin cậy E−δ/E/E+δ. Cần controlled server clock trước khi chạy lại. | [screenshot](../../evidence/D/execution/screenshots/D-TC-014.png) · [trace](../../evidence/D/execution/traces/D-TC-014.zip) |
| `D-TC-015` | `BLOCKED` | SUT không có clock injection; không thể so sánh tin cậy E−δ/E/E+δ. Cần controlled server clock trước khi chạy lại. | [screenshot](../../evidence/D/execution/screenshots/D-TC-015.png) · [trace](../../evidence/D/execution/traces/D-TC-015.zip) |
| `D-TC-016` | `PASS` | Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này | [screenshot](../../evidence/D/execution/screenshots/D-TC-016.png) · [trace](../../evidence/D/execution/traces/D-TC-016.zip) |
| `D-TC-017` | `FAIL` | Total đúng bằng minimum bị từ chối dù boundary phải inclusive | [screenshot](../../evidence/D/execution/screenshots/D-TC-017.png) · [trace](../../evidence/D/execution/traces/D-TC-017.zip) |
| `D-TC-018` | `PASS` | Quan sát khớp oracle giới hạn của case | [screenshot](../../evidence/D/execution/screenshots/D-TC-018.png) · [trace](../../evidence/D/execution/traces/D-TC-018.zip) |
| `D-TC-019` | `FAIL` | Backend tin total client thấp thay vì recompute cart | [screenshot](../../evidence/D/execution/screenshots/D-TC-019.png) · [trace](../../evidence/D/execution/traces/D-TC-019.zip) |
| `D-TC-020` | `FAIL` | Backend tin total client cao và cho bypass minimum | [screenshot](../../evidence/D/execution/screenshots/D-TC-020.png) · [trace](../../evidence/D/execution/traces/D-TC-020.zip) |
| `D-TC-021` | `PASS` | Áp dụng thành công! Giảm 10% | [screenshot](../../evidence/D/execution/screenshots/D-TC-021.png) · [trace](../../evidence/D/execution/traces/D-TC-021.zip) |
| `D-TC-022` | `PASS` | Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn) | [screenshot](../../evidence/D/execution/screenshots/D-TC-022.png) · [trace](../../evidence/D/execution/traces/D-TC-022.zip) |
| `D-TC-023` | `PASS` | Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn) | [screenshot](../../evidence/D/execution/screenshots/D-TC-023.png) · [trace](../../evidence/D/execution/traces/D-TC-023.zip) |
| `D-TC-024` | `PASS` | Áp dụng thành công! Giảm 100,000 ₫ | [screenshot](../../evidence/D/execution/screenshots/D-TC-024.png) · [trace](../../evidence/D/execution/traces/D-TC-024.zip) |
| `D-TC-025` | `PASS` | Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn) | [screenshot](../../evidence/D/execution/screenshots/D-TC-025.png) · [trace](../../evidence/D/execution/traces/D-TC-025.zip) |
| `D-TC-026` | `FAIL` | Backend dùng `user_id` từ body thay vì JWT identity | [screenshot](../../evidence/D/execution/screenshots/D-TC-026.png) · [trace](../../evidence/D/execution/traces/D-TC-026.zip) |
| `D-TC-027` | `FAIL` | Apply-coupon chấp nhận request thiếu hoặc sai JWT. | [screenshot](../../evidence/D/execution/screenshots/D-TC-027.png) · [trace](../../evidence/D/execution/traces/D-TC-027.zip) |
| `D-TC-028` | `FAIL` | Apply-coupon chấp nhận request thiếu hoặc sai JWT. | [screenshot](../../evidence/D/execution/screenshots/D-TC-028.png) · [trace](../../evidence/D/execution/traces/D-TC-028.zip) |
| `D-TC-029` | `PASS` | Fixture gate từ chối discount value âm | [screenshot](../../evidence/D/execution/screenshots/D-TC-029.png) · [trace](../../evidence/D/execution/traces/D-TC-029.zip) |
| `D-TC-030` | `PASS` | Fixture gate từ chối discount value bằng 0 | [screenshot](../../evidence/D/execution/screenshots/D-TC-030.png) · [trace](../../evidence/D/execution/traces/D-TC-030.zip) |
| `D-TC-031` | `FAIL` | Discount lower-bound formula khác oracle. | [screenshot](../../evidence/D/execution/screenshots/D-TC-031.png) · [trace](../../evidence/D/execution/traces/D-TC-031.zip) |
| `D-TC-032` | `PASS` | Fixed discount lower-bound khớp oracle | [screenshot](../../evidence/D/execution/screenshots/D-TC-032.png) · [trace](../../evidence/D/execution/traces/D-TC-032.zip) |
| `D-TC-033` | `BLOCKED` | Thiếu oracle rounding/maximum/cap/floor; automation chỉ ghi actual. | [screenshot](../../evidence/D/execution/screenshots/D-TC-033.png) · [trace](../../evidence/D/execution/traces/D-TC-033.zip) |
| `D-TC-034` | `BLOCKED` | Thiếu oracle rounding/maximum/cap/floor; automation chỉ ghi actual. | [screenshot](../../evidence/D/execution/screenshots/D-TC-034.png) · [trace](../../evidence/D/execution/traces/D-TC-034.zip) |
| `D-TC-035` | `BLOCKED` | Thiếu oracle rounding/maximum/cap/floor; automation chỉ ghi actual. | [screenshot](../../evidence/D/execution/screenshots/D-TC-035.png) · [trace](../../evidence/D/execution/traces/D-TC-035.zip) |
| `D-TC-036` | `BLOCKED` | Loading/double-tap behavior chưa có oracle; actual được ghi nhận. | [screenshot](../../evidence/D/execution/screenshots/D-TC-036.png) · [trace](../../evidence/D/execution/traces/D-TC-036.zip) |
| `D-TC-037` | `BLOCKED` | Reset-on-edit chưa có oracle; actual được ghi nhận. | [screenshot](../../evidence/D/execution/screenshots/D-TC-037.png) · [trace](../../evidence/D/execution/traces/D-TC-037.zip) |
| `D-TC-038` | `BLOCKED` | Reset-on-edit chưa có oracle; actual được ghi nhận. | [screenshot](../../evidence/D/execution/screenshots/D-TC-038.png) · [trace](../../evidence/D/execution/traces/D-TC-038.zip) |
| `D-TC-039` | `BLOCKED` | Error reset-on-edit chưa có oracle; actual được ghi nhận. | [screenshot](../../evidence/D/execution/screenshots/D-TC-039.png) · [trace](../../evidence/D/execution/traces/D-TC-039.zip) |
| `D-TC-040` | `PASS` | Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa | [screenshot](../../evidence/D/execution/screenshots/D-TC-040.png) · [trace](../../evidence/D/execution/traces/D-TC-040.zip) |
| `D-TC-041` | `BLOCKED` | SRS chưa quy định resilience/message cho HTTP 5xx, transport hoặc parse failure. | [screenshot](../../evidence/D/execution/screenshots/D-TC-041.png) · [trace](../../evidence/D/execution/traces/D-TC-041.zip) |
| `D-TC-042` | `BLOCKED` | SRS chưa quy định resilience/message cho HTTP 5xx, transport hoặc parse failure. | [screenshot](../../evidence/D/execution/screenshots/D-TC-042.png) · [trace](../../evidence/D/execution/traces/D-TC-042.zip) |
| `D-TC-043` | `BLOCKED` | SRS chưa quy định resilience/message cho HTTP 5xx, transport hoặc parse failure. | [screenshot](../../evidence/D/execution/screenshots/D-TC-043.png) · [trace](../../evidence/D/execution/traces/D-TC-043.zip) |
| `D-TC-044` | `FAIL` | Checkout không dùng authoritative final 360000 hoặc tin client total sai. | [screenshot](../../evidence/D/execution/screenshots/D-TC-044.png) · [trace](../../evidence/D/execution/traces/D-TC-044.zip) |
| `D-TC-045` | `PASS` | Áp dụng thành công! Giảm 50,000 ₫ | [screenshot](../../evidence/D/execution/screenshots/D-TC-045.png) · [trace](../../evidence/D/execution/traces/D-TC-045.zip) |
| `D-TC-046` | `FAIL` | Positive action không dùng màu xanh dương. | [screenshot](../../evidence/D/execution/screenshots/D-TC-046.png) · [trace](../../evidence/D/execution/traces/D-TC-046.zip) |
| `D-TC-047` | `FAIL` | Validation feedback nằm dưới action Apply | [screenshot](../../evidence/D/execution/screenshots/D-TC-047.png) · [trace](../../evidence/D/execution/traces/D-TC-047.zip) |
| `D-TC-048` | `BLOCKED` | Viewport observation không có pass/fail oracle và không đại diện native Mobile. | [screenshot](../../evidence/D/execution/screenshots/D-TC-048.png) · [trace](../../evidence/D/execution/traces/D-TC-048.zip) |
| `D-TC-049` | `BLOCKED` | Playwright Expo Web không điều khiển soft keyboard Android/iOS; cần native runtime và Maestro/Appium/Detox. | [screenshot](../../evidence/D/execution/screenshots/D-TC-049.png) · [trace](../../evidence/D/execution/traces/D-TC-049.zip) |
| `D-TC-050` | `BLOCKED` | DOM/accessibility tree Expo Web không đại diện React Native; cần native runtime và accessibility tooling. | [screenshot](../../evidence/D/execution/screenshots/D-TC-050.png) · [trace](../../evidence/D/execution/traces/D-TC-050.zip) |

Expected, actual có cấu trúc, timestamp, duration và environment đầy đủ nằm trong
`evidence/D/execution/results.json`.

## 4. Blocked condition

- `D-TC-003`–`006`: thiếu oracle cho empty/whitespace và normalization.
- `D-TC-013`–`015`: không có controlled clock để kiểm tra sát expiry.
- `D-TC-033`–`039`: thiếu oracle rounding/cap/floor hoặc UI state transition.
- `D-TC-041`–`043`: thiếu resilience/message oracle.
- `D-TC-048`: chỉ là viewport observation trên Expo Web.
- `D-TC-049`: đã có supplementary observation về soft keyboard trên iOS thật,
  nhưng vẫn thiếu acceptance oracle và interaction recording đầy đủ.
- `D-TC-050`: chưa có screen-reader/accessibility-tree evidence trên native.

BLOCKED không được xem là defect khi chưa có oracle và evidence độc lập.

## 5. Tính cô lập và source integrity

- Backend được copy read-only vào `automation/D-M09/runtime` và trỏ tới SQLite fixture riêng.
- Fixture reset trước mỗi test case; không dùng `SHOP/backend/database.sqlite`.
- Runner chỉ dùng port trống và chỉ dừng process do chính runner tạo.
- Hash trước/sau của ba file được bảo vệ: `UNCHANGED`.
- Service log: `evidence/D/execution/service-logs.txt`.
- Native evidence supplement: `evidence/D/native-ios/screenshots/`.
