# C-FR14 — Bug report

## 1. Thông tin chung

| Trường | Giá trị |
|---|---|
| Feature | `C-FR14` — Quản lý Danh mục (Category CRUD) |
| Nền tảng | Admin Web |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Lần chạy | 2026-10-13T22:55:04+07:00 đến 2026-10-13T22:55:31+07:00 |
| Môi trường | Chrome hệ thống; Admin Web `127.0.0.1:5174`; API `127.0.0.1:3000`; SQLite fixture cô lập |
| Nguồn kết quả | `features/C/05_execution_results.md`; `evidence/C/execution/results.json` |
| Trạng thái tài liệu | `REVIEWED` |

Quy ước severity: `Critical` cho lỗi authorization có thể cho phép user thường
thay đổi dữ liệu Admin; `Major` cho lỗi phá vỡ business rule hoặc tính toàn vẹn
dữ liệu; `Minor` cho lỗi GUI/semantic không chặn luồng chính. Priority thể hiện
thứ tự đề nghị sửa và không thay thế severity.

## 2. Tổng hợp defect đã xác nhận

| Bug ID | Root cause được nhóm | Test case FAIL | Severity | Priority | Trạng thái |
|---|---|---|---|---|---|
| `C-BUG-001` | Category list rỗng không có empty-state component | `C-TC-002` | Minor | P2 | `CONFIRMED — REVIEWED` |
| `C-BUG-002` | Không validate/constraint tên category bắt buộc trước khi ghi DB | `C-TC-007`, `C-TC-008`, `C-TC-009`, phần mutation của `C-TC-043` | Major | P1 | `CONFIRMED — REVIEWED` |
| `C-BUG-003` | Form Create thiếu label `*`, inline validation và error placement | `C-TC-009`, `C-TC-043` | Minor | P2 | `CONFIRMED — REVIEWED` |
| `C-BUG-004` | Role admin chỉ được kiểm tra khi login, không được cưỡng chế tại API và restored session | `C-TC-038`, `C-TC-040`, `C-TC-042` | Critical | P1 | `CONFIRMED — REVIEWED` |
| `C-BUG-005` | `h1` của Admin shell không mô tả trang Category | `C-TC-044` | Minor | P3 | `CONFIRMED — REVIEWED` |

`C-TC-009` và `C-TC-043` cùng quan sát cả hai lớp: form không chặn input rỗng
(`C-BUG-003`) và backend/database vẫn chấp nhận mutation (`C-BUG-002`). Vì vậy
hai case có thể liên kết nhiều defect nhưng không được đếm thành defect mới.

## 3. Chi tiết defect

### C-BUG-001 — Category list rỗng thiếu empty state thân thiện

| Trường | Nội dung |
|---|---|
| Requirement | `C-R13`; FR-24 |
| Test case | `C-TC-002` |
| Precondition | Admin hợp lệ; fixture không có category/product; mở tab **Danh mục** |
| Bước tái hiện | 1. Reset fixture rỗng. 2. Đăng nhập Admin. 3. Mở tab **Danh mục**. 4. Quan sát vùng list. |
| Expected | Không có record giả; có icon/hình minh họa và message empty state thân thiện. |
| Actual | Bảng chỉ còn header; `rows=[]`, `iconCount=0`; không có message empty state. |
| Root cause | `SHOP/frontend-admin/src/App.jsx:309–325` luôn render table và chỉ `map(categories)`; không có nhánh render khi `categories.length === 0`. |
| Severity / Priority | Minor / P2 |
| Evidence | `evidence/C/execution/results.json`; `evidence/C/execution/screenshots/C-TC-002.png`; `evidence/C/execution/traces/C-TC-002.zip` |
| Trạng thái | `CONFIRMED — REVIEWED` |

### C-BUG-002 — API và database chấp nhận tên category thiếu/rỗng

| Trường | Nội dung |
|---|---|
| Requirement | `C-R07`, `C-R08`, `C-R21`; FR-14 |
| Test case | `C-TC-007`, `C-TC-008`, `C-TC-009`; phần request/database của `C-TC-043` |
| Precondition | JWT admin hợp lệ; fixture ban đầu có 4 category |
| Bước tái hiện | Gửi `POST /api/categories` lần lượt không có `name`, có `name=""`, hoặc submit form với input rỗng; đọc lại SQLite/list. |
| Expected | Request bị từ chối và số/giá trị category không đổi. |
| Actual | Cả missing và empty đều trả 200, tạo ID 5; SQLite lưu lần lượt `NULL` hoặc chuỗi rỗng. UI submit rỗng cũng tạo record. |
| Root cause | `SHOP/backend/server.js:249–253` lấy `name` rồi insert trực tiếp, không validation; `SHOP/backend/database.js:23–26` khai báo `name TEXT` không có `NOT NULL`/`CHECK`. |
| Severity / Priority | Major / P1 — vi phạm business rule bắt buộc và tạo dữ liệu không hợp lệ. |
| Evidence | `evidence/C/execution/results.json`; screenshots/traces `C-TC-007`, `C-TC-008`, `C-TC-009`, `C-TC-043` trong `evidence/C/execution/` |
| Trạng thái | `CONFIRMED — REVIEWED` |

### C-BUG-003 — Form Create thiếu required marker và inline error

| Trường | Nội dung |
|---|---|
| Requirement | `C-R20`, `C-R21`; FR-22 |
| Test case | `C-TC-009`, `C-TC-043` |
| Precondition | Admin hợp lệ; tab **Danh mục** đang mở; input tên rỗng |
| Bước tái hiện | Kiểm tra label/required attribute; bấm **Thêm mới** với input rỗng; quan sát request và vùng phía trên nút submit. |
| Expected | Có label kèm `*`; client chặn request; lỗi trong trang nằm phía trên nút submit. |
| Actual | `hasRequired=false`, form không có label/`*`, `postRequests=1`, `errorCount=0`; không có inline error. |
| Root cause | `SHOP/frontend-admin/src/App.jsx:297–305` chỉ render input placeholder và button; không có label, `required`, error state hoặc error element. `handleCategorySubmit` tại dòng 142–150 gửi request ngay và chỉ dùng `alert()` khi request lỗi. |
| Severity / Priority | Minor / P2 |
| Evidence | `evidence/C/execution/results.json`; `evidence/C/execution/screenshots/C-TC-009.png`; `evidence/C/execution/screenshots/C-TC-043.png`; trace cùng ID |
| Trạng thái | `CONFIRMED — REVIEWED` |

### C-BUG-004 — User thường có thể truy cập và thay đổi Category Admin

| Trường | Nội dung |
|---|---|
| Requirement | `C-R01`, `C-R03`; FR-12, SEC-03 |
| Test case | `C-TC-038`, `C-TC-040`, `C-TC-042` |
| Precondition | Có JWT hợp lệ với `role='user'`; fixture ban đầu có 4 category |
| Bước tái hiện | 1. Gọi POST/DELETE category bằng JWT user. 2. Ở browser mới, ghi JWT user vào `localStorage.adminToken` rồi reload Admin Web. |
| Expected | API từ chối mutation; Admin shell không hiển thị và token user bị loại bỏ. |
| Actual | POST tạo category và DELETE xóa target, đều trả 200. JWT user trong localStorage vẫn hiển thị Admin shell (`adminShell=1`, `tokenStillStored=true`). |
| Root cause | `SHOP/backend/server.js:100–109` chỉ verify JWT, không kiểm tra `req.user.role`; category mutations ở dòng 249 và 269 chỉ dùng middleware này. `SHOP/frontend-admin/src/App.jsx:7,34–39` tin mọi token được restore; role chỉ được kiểm tra trong interactive login ở dòng 61–70. |
| Severity / Priority | Critical / P1 — vi phạm authorization và cho phép user thường thay đổi dữ liệu Admin. |
| Evidence | `evidence/C/execution/results.json`; screenshots/traces `C-TC-038`, `C-TC-040`, `C-TC-042` trong `evidence/C/execution/` |
| Trạng thái | `CONFIRMED — REVIEWED` |

### C-BUG-005 — Heading cấp một không mô tả trang Category

| Trường | Nội dung |
|---|---|
| Requirement | `C-R18`; FR-21 |
| Test case | `C-TC-044` |
| Precondition | Admin hợp lệ; tab **Danh mục** đang mở |
| Bước tái hiện | Đếm `h1` và đọc nội dung heading sau khi mở Category. |
| Expected | Đúng một `h1` mô tả nội dung trang Category. |
| Actual | Có một `h1` nhưng nội dung chỉ là `EShop Admin`; `Quản lý Danh mục` dùng `h2`. |
| Root cause | `SHOP/frontend-admin/src/App.jsx:225` đặt `h1` cố định cho shell; heading Category ở dòng 296 dùng `h2`. |
| Severity / Priority | Minor / P3 |
| Evidence | `evidence/C/execution/results.json`; `evidence/C/execution/screenshots/C-TC-044.png`; `evidence/C/execution/traces/C-TC-044.zip` |
| Trạng thái | `CONFIRMED — REVIEWED` |

## 4. Reconciliation

Ánh xạ toàn bộ 9 FAIL:

- `002 → BUG-001`.
- `007, 008 → BUG-002`.
- `009 → BUG-002 + BUG-003`.
- `038, 040, 042 → BUG-004`.
- `043 → BUG-002 + BUG-003`.
- `044 → BUG-005`.

Tổng cộng có 5 root-cause defect, bao phủ đủ 9 case FAIL. Không case PASS hoặc
BLOCKED nào được dùng để tăng số defect. Đặc biệt `C-TC-010`–`013`, `017`–`025`,
`027`–`031`, `033`–`034` và `045` vẫn là `BLOCKED`, không phải bug.
