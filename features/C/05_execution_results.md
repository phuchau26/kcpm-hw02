# C-FR14 — Kết quả thực thi Step 5

## 1. Trạng thái

| Trường | Giá trị |
|---|---|
| Artifact | `features/C/05_execution_results.md` |
| Trạng thái | `REVIEWED` |
| Test case baseline | `features/C/04_test_cases.md` |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Bắt đầu | 2026-10-13T22:55:04+07:00 |
| Kết thúc | 2026-10-13T22:55:31+07:00 |
| Lệnh | `npm test` trong `automation/C-FR14` |
| Browser | System Chromium channel: C:\Program Files\Google\Chrome\Application\chrome.exe |
| SQLite fixture | `automation/C-FR14/runtime/c-fr14-fixture.sqlite` — runtime only, không commit |

## 2. Thống kê

| Designed | Attempted | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|---:|
| 48 | 48 | 27 | 18 | 9 | 21 | 0 |

Quy ước: `attempted = PASS + FAIL + BLOCKED`; `executed = PASS + FAIL`.

## 3. Kết quả từng test case

| Test ID | Verdict | Actual/reason tóm tắt | Evidence |
|---|---|---|---|
| `C-TC-001` | `PASS` | {"expected":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"rows":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}]} | [screenshot](../../evidence/C/execution/screenshots/C-TC-001.png) · [trace](../../evidence/C/execution/traces/C-TC-001.zip) |
| `C-TC-002` | `FAIL` | Empty list thiếu icon/hình hoặc message thân thiện. | [screenshot](../../evidence/C/execution/screenshots/C-TC-002.png) · [trace](../../evidence/C/execution/traces/C-TC-002.zip) |
| `C-TC-003` | `PASS` | {"expected":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"rows":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}]} | [screenshot](../../evidence/C/execution/screenshots/C-TC-003.png) · [trace](../../evidence/C/execution/traces/C-TC-003.zip) |
| `C-TC-004` | `PASS` | {"textVisible":1,"injected":0,"executed":false} | [screenshot](../../evidence/C/execution/screenshots/C-TC-004.png) · [trace](../../evidence/C/execution/traces/C-TC-004.zip) |
| `C-TC-005` | `PASS` | {"status":200,"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id": | [screenshot](../../evidence/C/execution/screenshots/C-TC-005.png) · [trace](../../evidence/C/execution/traces/C-TC-005.zip) |
| `C-TC-006` | `PASS` | {"response":{"status":200,"ok":true,"body":{"message":"Category created","id":5}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điệ | [screenshot](../../evidence/C/execution/screenshots/C-TC-006.png) · [trace](../../evidence/C/execution/traces/C-TC-006.zip) |
| `C-TC-007` | `FAIL` | Missing/empty name không bị reject hoặc database đã đổi. | [screenshot](../../evidence/C/execution/screenshots/C-TC-007.png) · [trace](../../evidence/C/execution/traces/C-TC-007.zip) |
| `C-TC-008` | `FAIL` | Missing/empty name không bị reject hoặc database đã đổi. | [screenshot](../../evidence/C/execution/screenshots/C-TC-008.png) · [trace](../../evidence/C/execution/traces/C-TC-008.zip) |
| `C-TC-009` | `FAIL` | Empty UI submit không được chặn với inline error phía trên nút. | [screenshot](../../evidence/C/execution/screenshots/C-TC-009.png) · [trace](../../evidence/C/execution/traces/C-TC-009.zip) |
| `C-TC-010` | `BLOCKED` | SRS chưa quy định whitespace/trim/duplicate/case semantics. | [screenshot](../../evidence/C/execution/screenshots/C-TC-010.png) · [trace](../../evidence/C/execution/traces/C-TC-010.zip) |
| `C-TC-011` | `BLOCKED` | SRS chưa quy định whitespace/trim/duplicate/case semantics. | [screenshot](../../evidence/C/execution/screenshots/C-TC-011.png) · [trace](../../evidence/C/execution/traces/C-TC-011.zip) |
| `C-TC-012` | `BLOCKED` | SRS chưa quy định whitespace/trim/duplicate/case semantics. | [screenshot](../../evidence/C/execution/screenshots/C-TC-012.png) · [trace](../../evidence/C/execution/traces/C-TC-012.zip) |
| `C-TC-013` | `BLOCKED` | SRS chưa quy định whitespace/trim/duplicate/case semantics. | [screenshot](../../evidence/C/execution/screenshots/C-TC-013.png) · [trace](../../evidence/C/execution/traces/C-TC-013.zip) |
| `C-TC-014` | `PASS` | {"name":"Phụ kiện & Cáp (USB-C)","response":{"status":200,"ok":true,"body":{"message":"Category created","id":5}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{" | [screenshot](../../evidence/C/execution/screenshots/C-TC-014.png) · [trace](../../evidence/C/execution/traces/C-TC-014.zip) |
| `C-TC-015` | `PASS` | {"name":"Điện thoại_日本語_🙂","response":{"status":200,"ok":true,"body":{"message":"Category created","id":5}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categ | [screenshot](../../evidence/C/execution/screenshots/C-TC-015.png) · [trace](../../evidence/C/execution/traces/C-TC-015.zip) |
| `C-TC-016` | `PASS` | {"response":{"status":200,"ok":true,"body":{"message":"Category created","id":5}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điệ | [screenshot](../../evidence/C/execution/screenshots/C-TC-016.png) · [trace](../../evidence/C/execution/traces/C-TC-016.zip) |
| `C-TC-017` | `BLOCKED` | Category không có maximum length oracle; đây là upper-length probe. | [screenshot](../../evidence/C/execution/screenshots/C-TC-017.png) · [trace](../../evidence/C/execution/traces/C-TC-017.zip) |
| `C-TC-018` | `BLOCKED` | Category không có maximum length oracle; đây là upper-length probe. | [screenshot](../../evidence/C/execution/screenshots/C-TC-018.png) · [trace](../../evidence/C/execution/traces/C-TC-018.zip) |
| `C-TC-019` | `BLOCKED` | Category không có maximum length oracle; đây là upper-length probe. | [screenshot](../../evidence/C/execution/screenshots/C-TC-019.png) · [trace](../../evidence/C/execution/traces/C-TC-019.zip) |
| `C-TC-020` | `BLOCKED` | SRS/API contract chưa quy định null/wrong-type representation. | [screenshot](../../evidence/C/execution/screenshots/C-TC-020.png) · [trace](../../evidence/C/execution/traces/C-TC-020.zip) |
| `C-TC-021` | `BLOCKED` | Update không có business oracle trong nội dung FR-14. | [screenshot](../../evidence/C/execution/screenshots/C-TC-021.png) · [trace](../../evidence/C/execution/traces/C-TC-021.zip) |
| `C-TC-022` | `BLOCKED` | Update không có business oracle trong nội dung FR-14. | [screenshot](../../evidence/C/execution/screenshots/C-TC-022.png) · [trace](../../evidence/C/execution/traces/C-TC-022.zip) |
| `C-TC-023` | `BLOCKED` | Update không có business oracle trong nội dung FR-14. | [screenshot](../../evidence/C/execution/screenshots/C-TC-023.png) · [trace](../../evidence/C/execution/traces/C-TC-023.zip) |
| `C-TC-024` | `BLOCKED` | Update không có business oracle trong nội dung FR-14. | [screenshot](../../evidence/C/execution/screenshots/C-TC-024.png) · [trace](../../evidence/C/execution/traces/C-TC-024.zip) |
| `C-TC-025` | `BLOCKED` | Update không có business oracle trong nội dung FR-14. | [screenshot](../../evidence/C/execution/screenshots/C-TC-025.png) · [trace](../../evidence/C/execution/traces/C-TC-025.zip) |
| `C-TC-026` | `PASS` | {"response":{"status":200,"ok":true,"body":{"message":"Category deleted"}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điện thoại | [screenshot](../../evidence/C/execution/screenshots/C-TC-026.png) · [trace](../../evidence/C/execution/traces/C-TC-026.zip) |
| `C-TC-027` | `BLOCKED` | SRS chưa quy định response/verdict cho nonexistent hoặc malformed ID. | [screenshot](../../evidence/C/execution/screenshots/C-TC-027.png) · [trace](../../evidence/C/execution/traces/C-TC-027.zip) |
| `C-TC-028` | `BLOCKED` | SRS chưa quy định response/verdict cho nonexistent hoặc malformed ID. | [screenshot](../../evidence/C/execution/screenshots/C-TC-028.png) · [trace](../../evidence/C/execution/traces/C-TC-028.zip) |
| `C-TC-029` | `BLOCKED` | SRS chưa quy định response/verdict cho nonexistent hoặc malformed ID. | [screenshot](../../evidence/C/execution/screenshots/C-TC-029.png) · [trace](../../evidence/C/execution/traces/C-TC-029.zip) |
| `C-TC-030` | `BLOCKED` | SRS chưa quy định response/verdict cho nonexistent hoặc malformed ID. | [screenshot](../../evidence/C/execution/screenshots/C-TC-030.png) · [trace](../../evidence/C/execution/traces/C-TC-030.zip) |
| `C-TC-031` | `BLOCKED` | SRS chưa quy định response/verdict cho nonexistent hoặc malformed ID. | [screenshot](../../evidence/C/execution/screenshots/C-TC-031.png) · [trace](../../evidence/C/execution/traces/C-TC-031.zip) |
| `C-TC-032` | `PASS` | {"rawId":"1 OR 1=1","response":{"status":200,"ok":true,"body":{"message":"Category deleted"}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1 | [screenshot](../../evidence/C/execution/screenshots/C-TC-032.png) · [trace](../../evidence/C/execution/traces/C-TC-032.zip) |
| `C-TC-033` | `BLOCKED` | SRS chưa quy định referential policy cho Delete category. | [screenshot](../../evidence/C/execution/screenshots/C-TC-033.png) · [trace](../../evidence/C/execution/traces/C-TC-033.zip) |
| `C-TC-034` | `BLOCKED` | SRS chưa quy định referential policy cho Delete category. | [screenshot](../../evidence/C/execution/screenshots/C-TC-034.png) · [trace](../../evidence/C/execution/traces/C-TC-034.zip) |
| `C-TC-035` | `PASS` | {"response":{"status":401,"ok":false,"body":{"error":"Unauthorized"}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điện thoại"},{" | [screenshot](../../evidence/C/execution/screenshots/C-TC-035.png) · [trace](../../evidence/C/execution/traces/C-TC-035.zip) |
| `C-TC-036` | `PASS` | {"response":{"status":403,"ok":false,"body":{"error":"Forbidden"}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điện thoại"},{"id" | [screenshot](../../evidence/C/execution/screenshots/C-TC-036.png) · [trace](../../evidence/C/execution/traces/C-TC-036.zip) |
| `C-TC-037` | `PASS` | {"response":{"status":403,"ok":false,"body":{"error":"Forbidden"}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điện thoại"},{"id" | [screenshot](../../evidence/C/execution/screenshots/C-TC-037.png) · [trace](../../evidence/C/execution/traces/C-TC-037.zip) |
| `C-TC-038` | `FAIL` | Create mutation không bị reject bởi authentication/authorization oracle. | [screenshot](../../evidence/C/execution/screenshots/C-TC-038.png) · [trace](../../evidence/C/execution/traces/C-TC-038.zip) |
| `C-TC-039` | `PASS` | {"response":{"status":401,"ok":false,"body":{"error":"Unauthorized"}},"before":{"categories":[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"},{"id":4,"name":"Âm thanh"}],"products":[{"id":1,"name":"Phone fixture 1","category_id":1},{"id":2,"name":"Phone fixture 2","category_id":1},{"id":3,"name":"Laptop fixture","category_id":2}]},"after":{"categories":[{"id":1,"name":"Điện thoại"},{" | [screenshot](../../evidence/C/execution/screenshots/C-TC-039.png) · [trace](../../evidence/C/execution/traces/C-TC-039.zip) |
| `C-TC-040` | `FAIL` | Delete mutation không bị reject bởi authentication/authorization oracle. | [screenshot](../../evidence/C/execution/screenshots/C-TC-040.png) · [trace](../../evidence/C/execution/traces/C-TC-040.zip) |
| `C-TC-041` | `PASS` | {"tokenStored":false,"loginVisible":1,"dialogs":["Bạn không phải là admin!"]} | [screenshot](../../evidence/C/execution/screenshots/C-TC-041.png) · [trace](../../evidence/C/execution/traces/C-TC-041.zip) |
| `C-TC-042` | `FAIL` | JWT user trong localStorage truy cập được Admin subsystem. | [screenshot](../../evidence/C/execution/screenshots/C-TC-042.png) · [trace](../../evidence/C/execution/traces/C-TC-042.zip) |
| `C-TC-043` | `FAIL` | Required marker/error placement hoặc request suppression không đạt. | [screenshot](../../evidence/C/execution/screenshots/C-TC-043.png) · [trace](../../evidence/C/execution/traces/C-TC-043.zip) |
| `C-TC-044` | `FAIL` | Trang không có đúng một h1 mô tả category. | [screenshot](../../evidence/C/execution/screenshots/C-TC-044.png) · [trace](../../evidence/C/execution/traces/C-TC-044.zip) |
| `C-TC-045` | `BLOCKED` | FR-23 không bắt buộc breadcrumb cho Admin category page. | [screenshot](../../evidence/C/execution/screenshots/C-TC-045.png) · [trace](../../evidence/C/execution/traces/C-TC-045.zip) |
| `C-TC-046` | `PASS` | {"create":"rgb(37, 99, 235)","delete":"rgb(239, 68, 68)"} | [screenshot](../../evidence/C/execution/screenshots/C-TC-046.png) · [trace](../../evidence/C/execution/traces/C-TC-046.zip) |
| `C-TC-047` | `PASS` | {"sequence":[{"tag":"INPUT","text":"","placeholder":"Tên danh mục mới"},{"tag":"BUTTON","text":"Thêm mới","placeholder":""},{"tag":"BUTTON","text":"Xóa","placeholder":""},{"tag":"BUTTON","text":"Xóa","placeholder":""},{"tag":"BUTTON","text":"Xóa","placeholder":""},{"tag":"BUTTON","text":"Xóa","placeholder":""},{"tag":"BODY","text":"EShop AdminDashboardDanh mụcSản phẩmMã Giảm GiáĐơn hàngNgười dùngĐăng xuấtQuản lý Danh | [screenshot](../../evidence/C/execution/screenshots/C-TC-047.png) · [trace](../../evidence/C/execution/traces/C-TC-047.zip) |
| `C-TC-048` | `PASS` | {"required":["Quản lý Danh mục","Thêm mới","Tên Danh Mục","Hành động","Xóa"],"placeholder":"Tên danh mục mới","panel":"Quản lý Danh mục\nThêm mới\nID\tTên Danh Mục\tHành động\n#1\tĐiện thoại\tXóa\n#2\tLaptop\tXóa\n#3\tPhụ kiện\tXóa\n#4\tÂm thanh\tXóa"} | [screenshot](../../evidence/C/execution/screenshots/C-TC-048.png) · [trace](../../evidence/C/execution/traces/C-TC-048.zip) |

Chi tiết expected, actual có cấu trúc, timestamp và duration nằm trong
`evidence/C/execution/results.json`.

## 4. FAIL và BLOCKED

- FAIL: `C-TC-002`, `C-TC-007`, `C-TC-008`, `C-TC-009`, `C-TC-038`, `C-TC-040`, `C-TC-042`, `C-TC-043`, `C-TC-044`.
- BLOCKED: `C-TC-010`, `C-TC-011`, `C-TC-012`, `C-TC-013`, `C-TC-017`, `C-TC-018`, `C-TC-019`, `C-TC-020`, `C-TC-021`, `C-TC-022`, `C-TC-023`, `C-TC-024`, `C-TC-025`, `C-TC-027`, `C-TC-028`, `C-TC-029`, `C-TC-030`, `C-TC-031`, `C-TC-033`, `C-TC-034`, `C-TC-045`.
- BLOCKED do requirement gap không tự động là defect. Automation/runtime error được
  ghi riêng trong từng result.

## 5. Tính cô lập và khả năng tái hiện

- Runner sao chép read-only `SHOP/backend/server.js` vào runtime và nạp database adapter
  trỏ tới SQLite fixture riêng.
- Mỗi case reset fixture; test chạy tuần tự theo `C-TC-001` → `C-TC-048`.
- Runner từ chối dùng port đã bận và chỉ dừng process do chính nó tạo.
- Source và `SHOP/backend/database.sqlite` không được runner sửa.
- Service log: `evidence/C/execution/service-logs.txt`.
- Machine-readable result: `evidence/C/execution/results.json`.
