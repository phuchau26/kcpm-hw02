# D-M09 — Gap analysis
## 1. Thông tin tài liệu

| Trường | Giá trị |
|---|---|
| Feature | `D-M09` — Discount Coupon trên Mobile checkout |
| Nguồn oracle | `01_spec_and_oracle.md`–`04_test_cases.md` |
| Nguồn thực thi | `05_execution_results.md`, `evidence/D/execution/results.json`, screenshot, trace và service log |
| Source review | Read-only tại baseline `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Runtime đã kiểm | Lần chạy chuẩn: Expo Web `440 × 956`; bổ sung: thiết bị iOS thật qua Expo Go/Expo SDK 57 |
| Thống kê | 19 PASS; 11 FAIL; 20 BLOCKED; 0 NOT RUN |
| Confirmed root cause | 7: 5 shared Backend defect dẫn Pool B + 2 Mobile defect mới |
| Requirement gap | 11 (`D-GAP-R01`–`D-GAP-R11`) |
| Implementation gap/risk bổ sung | 4 (`D-IG-01`–`D-IG-04`) |
| Mobile-specific/environment gap | 2 (`D-MG-01`, `D-MG-02`) |
| Testability gap | 2 (`D-TG-01`, `D-TG-02`) |
| Blocked condition | 6 nhóm, ảnh hưởng đúng 20 case |
| Trạng thái | `PENDING HUMAN REVIEW — NATIVE iOS SUPPLEMENT` |
| Người review | Nguyễn Phúc Hậu (`23120252`) |
| Thời điểm xác nhận | 2026-10-15 20:06:05 +07:00 |

## 2. Nguyên tắc phân loại

- **Confirmed defect**: actual khác oracle có căn cứ, có execution evidence và
  root cause source phù hợp.
- **Requirement gap**: SRS/API chưa đủ để xác định expected result.
- **Implementation gap/risk**: source có điểm không nhất quán hoặc rủi ro nhưng
  chưa đủ oracle/evidence để gọi defect độc lập.
- **Mobile-specific gap**: hạn chế hoặc khác biệt chỉ phát sinh ở client/runtime
  Mobile, không quy cho Backend.
- **Testability gap**: thiếu khả năng điều khiển hoặc quan sát để verdict tin cậy.
- **Environment/connection issue**: cấu hình host/runtime làm Mobile không kết
  nối được Backend; tách khỏi business defect.
- **Blocked condition**: điều kiện cụ thể khiến case không thể nhận PASS/FAIL.

Không dùng implementation làm oracle. Không biến actual bất thường của case
BLOCKED thành bug.

## 3. Confirmed defect và quan hệ Pool B

| Canonical defect | Layer | Test D | Root cause | Quan hệ |
|---|---|---|---|---|
| `B-BUG-001` | Backend | `008`, `031`; tác động `044` | `server.js:397–401,418–420` sai công thức percent | Dùng lại canonical Backend defect; thêm evidence Mobile |
| `B-BUG-002` | Backend | `017` | `server.js:379` dùng `>` thay vì `>=` | Dùng lại canonical Backend defect |
| `B-BUG-003` | Backend | `019`, `020`, `044` | Apply/checkout tin `total_amount` client | Dùng lại canonical Backend defect |
| `B-BUG-004` | Backend | `027`, `028` | Apply route thiếu `authenticateToken` | Dùng lại canonical Backend defect |
| `B-BUG-005` | Backend | `026` | Usage query dùng body `user_id` | Dùng lại canonical Backend defect |
| `D-BUG-001` | Mobile render/style | `046` | `orangeButton`/`checkoutBtn` dùng orange/green | Defect Mobile mới; không gộp với Backend |
| `D-BUG-002` | Mobile layout | `047` | `couponError` render sau input/action row | Defect Mobile mới; không gộp với Backend |

Chi tiết reproduction, severity, priority và evidence nằm tại
`bugs/D-M09_bug_report.md`.

## 4. Requirement gap

| Gap | Nội dung chưa quy định | Case ảnh hưởng | Kết luận Step 6 |
|---|---|---|---|
| `D-GAP-R01` | Bằng chứng chính thức rằng Mobile Feature 9 là Discount Coupon | Toàn feature | Scope condition; chưa làm thay đổi oracle FR-09 |
| `D-GAP-R02` | Case sensitivity, trim, uppercase, code length/charset | `003`–`006` | Observation có thật; không verdict normalization |
| `D-GAP-R03` | Disabled/loading/double-tap/timeout trong lúc apply | `003`, `004`, `036` | Không gọi behavior hiện tại là đúng requirement |
| `D-GAP-R04` | Reset result/error khi sửa code | `037`–`039` | Actual reset được ghi; không PASS/FAIL |
| `D-GAP-R05` | Exact HTTP status/message/schema | Mọi reject, đặc biệt `040` | Business accept/reject vẫn có thể verdict |
| `D-GAP-R06` | Rounding, percent maximum, fixed cap, final floor | `018`, `033`–`035` | `018` chỉ assert threshold; `033`–`035` BLOCKED |
| `D-GAP-R07` | Timezone, granularity, representation của expiry | `013`–`015` | Kết hợp `D-TG-01`; chưa kiểm sát boundary |
| `D-GAP-R08` | Mapping `<h1>`, Tab, breadcrumb, required sang native | `050` | Không dùng Expo Web DOM thay native semantics |
| `D-GAP-R09` | Network error, retry, offline, malformed response | `041`–`043` | Chỉ ghi resilience observation |
| `D-GAP-R10` | Device/OS/orientation/keyboard/accessibility matrix | `048`–`050` | Có screenshot bổ sung trên iOS thật; chưa có device matrix, rotation, screen reader hoặc native semantic tree |
| `D-GAP-R11` | Thời điểm và tính nguyên tử của coupon usage với checkout | `021`–`026`, `044` | Eligibility đã kiểm; lifecycle/rollback chưa được xác nhận |

Đề xuất: product owner/giảng viên chốt normalization, UI state, rounding/cap,
time model, network contract, native matrix và usage lifecycle trước regression.
Không sửa expected result theo behavior hiện tại.

## 5. Implementation gap/risk chưa phải confirmed defect

| ID | Layer/source | Khoảng cách | Case | Vì sao chưa gọi defect | Đề xuất |
|---|---|---|---|---|---|
| `D-IG-01` | Mobile/API: `App.js:356–369`; `server.js:370` | Mobile trim+uppercase, Backend lookup exact | `003`–`006` | `D-GAP-R02` chưa chốt normalization contract | Chốt rule rồi normalize tại trusted boundary |
| `D-IG-02` | Mobile state: `App.js:356–377,699–713` | Client reset result/error khi edit, disable lúc loading | `036`–`039` | `D-GAP-R03/R04` chưa có expected state transition | Chốt state contract rồi regression UI |
| `D-IG-03` | Mobile/Backend: `App.js:399–406`; `server.js:443–451` | Usage được ghi bằng request riêng sau checkout, không có transaction chung | `021`–`026`, `044` | `D-GAP-R11` chưa chốt lifecycle/atomicity; Step 5 chưa tạo failure/concurrency oracle | Chốt event, idempotency và rollback trước khi test concurrency |
| `D-IG-04` | Mobile error rendering; `evidence/D/native-ios/screenshots/D-TC-042-ios-physical.jpg` | Khi mất kết nối, UI hiển thị nguyên chuỗi exception có chi tiết nội bộ `ExpoModulesCore/Promise.swift:56` | `042` | `D-GAP-R09` chưa quy định exact message/retry nên chưa đủ căn cứ gọi defect | Chuẩn hóa lỗi thành thông báo thân thiện; không lộ implementation detail |

Bốn implementation gap không được cộng vào confirmed defect.

## 6. Mobile-specific gap và environment/connection issue

| ID | Phân loại | Source/evidence | Ảnh hưởng | Trạng thái/điều kiện xử lý |
|---|---|---|---|---|
| `D-MG-01` | Mobile-specific environment/connection gap | Baseline chuẩn dùng Expo Web; lần bổ sung dùng API qua địa chỉ LAN/configurable endpoint | Kết nối iOS thật đã được chứng minh sau thay đổi cấu hình, nhưng không cùng baseline với lần chạy chuẩn | Ghi nhận baseline deviation; duy trì API base URL theo environment |
| `D-MG-02` | Mobile-specific coverage gap | Chín ảnh tại `evidence/D/native-ios/screenshots/` | Đã có quan sát layout và soft keyboard trên iOS thật; chưa chứng minh Android, rotation, screen reader hoặc native semantic tree | Bổ sung metadata thiết bị và chạy native accessibility/Android |

Trong Step 5, Backend và Expo Web đều ready, 50 record được tạo, service kết thúc
bình thường và không có runner-error BLOCKED. Vì vậy **không có active connection
incident** ảnh hưởng thống kê hiện tại. Bộ ảnh iOS ngày 2026-10-16 chứng minh kết
nối LAN sau khi nâng Expo SDK 57 và cấu hình lại API. Vì baseline khác, bộ ảnh chỉ
là evidence bổ sung, không thay đổi verdict hay thống kê chính thức.

## 7. Testability gap

| ID | Gap | Case | Evidence/ảnh hưởng | Điều kiện khắc phục |
|---|---|---|---|---|
| `D-TG-01` | Backend gọi `new Date()` tại `server.js:380`, không có injectable clock | `013`–`015` | Không đặt tin cậy `E−δ/E/E+δ`; ba case BLOCKED | Injectable clock/fake-time service cùng contract timezone/precision |
| `D-TG-02` | Playwright chỉ điều khiển Expo Web, không điều khiển native soft keyboard/accessibility tree | `049`, `050` | Có ảnh bàn phím iOS ở `D-TC-001-ios-physical.jpg`, nhưng không có interaction log/accessibility tree; hai case vẫn BLOCKED | Android/iOS emulator/device với Maestro, Appium hoặc Detox và accessibility tooling |

SQLite fixture, process orchestration và request interception hoạt động; chúng
không còn là blocked condition của lần chạy này.

## 8. Blocked condition — không phải bug

| ID | Điều kiện thiếu | Case | Số case | Vì sao không verdict | Điều kiện rerun |
|---|---|---|---:|---|---|
| `D-BC-01` | Oracle empty/whitespace/normalization | `003`–`006` | 4 | Actual có nhưng expected chưa chốt | Chốt `D-GAP-R02/R03` |
| `D-BC-02` | Controlled clock và time contract | `013`–`015` | 3 | Không kiểm đúng ba điểm sát expiry | Khắc phục `D-TG-01`, chốt `D-GAP-R07` |
| `D-BC-03` | Oracle rounding/cap/floor | `033`–`035` | 3 | Không có tiêu chí cho extreme output | Chốt `D-GAP-R06` |
| `D-BC-04` | Oracle loading/reset-on-edit | `036`–`039` | 4 | State observation không phải business oracle | Chốt `D-GAP-R03/R04` |
| `D-BC-05` | Network/resilience contract | `041`–`043` | 3 | Không có expected retry/message/fallback | Chốt `D-GAP-R09` |
| `D-BC-06` | Native runtime/matrix và semantic mapping | `048`–`050` | 3 | Ảnh iOS bổ sung giảm environment gap nhưng chưa đủ oracle/device matrix/semantic evidence | Chốt `D-GAP-R08/R10`, khắc phục `D-TG-02` |

Tổng `4 + 3 + 3 + 4 + 3 + 3 = 20` BLOCKED, khớp
`evidence/D/execution/results.json`. Không case nào trong bảng được ghi thành bug.

## 9. Layer analysis

| Layer | Khoảng cách chính | Defect/gap | Ảnh hưởng |
|---|---|---|---|
| Requirement | Thiếu normalization, state, rounding/cap, time, network, native matrix, usage lifecycle | `D-GAP-R01`–`R11` | 20 BLOCKED và residual risk |
| Mobile UI/state | Sai action color/error placement; state behavior chưa có oracle; raw transport exception lộ implementation detail | `D-BUG-001/002`, `D-IG-01/02/04` | 2 FAIL riêng Mobile; các blocked/probe case còn thiếu oracle |
| Mobile connection | Lần iOS bổ sung dùng endpoint LAN sau khi nâng Expo SDK | `D-MG-01` | Đã kết nối trên một thiết bị iOS nhưng baseline khác và chưa bao phủ Android |
| Backend | Formula/equality/auth/trusted input sai | `B-BUG-001`–`005` | 9 FAIL trực tiếp hoặc tích hợp trên D-M09 |
| Database/lifecycle | Usage insert tách khỏi checkout transaction | `D-IG-03`, `D-GAP-R11` | Atomicity/rollback chưa kiểm chứng |
| Testability/runtime | Thiếu clock injection và native automation | `D-TG-01/02`, `D-MG-02` | Ảnh iOS chỉ là manual screenshot; 5 case trực tiếp vẫn cần oracle/capability mới |

## 10. Coverage và traceability tóm tắt

| Nhóm | Test ID | Kết quả | Defect/gap chính |
|---|---|---|---|
| Access/input/code | `001`–`007` | 3 PASS, 4 BLOCKED | `D-GAP-R02/R03`, `D-BC-01` |
| Nominal/coupon state | `008`–`012` | 4 PASS, 1 FAIL | `B-BUG-001` |
| Expiry | `013`–`015` | 3 BLOCKED | `D-GAP-R07`, `D-TG-01`, `D-BC-02` |
| Threshold/trusted total | `016`–`020` | 2 PASS, 3 FAIL | `B-BUG-002/003` |
| Usage/auth/identity | `021`–`028` | 5 PASS, 3 FAIL | `B-BUG-004/005`, `D-GAP-R11` |
| Discount/extreme | `029`–`035` | 3 PASS, 1 FAIL, 3 BLOCKED | `B-BUG-001`, `D-GAP-R06`, `D-BC-03` |
| Mobile state | `036`–`039` | 4 BLOCKED | `D-GAP-R03/R04`, `D-BC-04` |
| Network | `040`–`043` | 1 PASS, 3 BLOCKED | `D-GAP-R05/R09`, `D-BC-05` |
| Checkout/output/UI | `044`–`047` | 1 PASS, 3 FAIL | `B-BUG-003`, `D-BUG-001/002` |
| Platform/native | `048`–`050` | 3 BLOCKED | `D-MG-02`, `D-TG-02`, `D-BC-06` |

Tổng theo bảng: `19 PASS + 11 FAIL + 20 BLOCKED = 50`; không có `NOT RUN`.

## 11. Evidence index

- Machine-readable result: `evidence/D/execution/results.json`.
- Screenshot: `evidence/D/execution/screenshots/D-TC-001.png`–`D-TC-050.png`.
- Playwright trace: `evidence/D/execution/traces/D-TC-001.zip`–`D-TC-050.zip`.
- Service/process log: `evidence/D/execution/service-logs.txt`.
- Physical iOS supplementary screenshots: `evidence/D/native-ios/screenshots/`.
- Execution summary: `features/D/05_execution_results.md`.
- Root-cause detail: `bugs/D-M09_bug_report.md`.
