# C-FR14 — Gap analysis
## 1. Thông tin tài liệu

| Trường | Giá trị |
|---|---|
| Feature | `C-FR14` — Quản lý Danh mục (Category CRUD) |
| Nguồn oracle | `features/C/01_spec_and_oracle.md`–`04_test_cases.md` |
| Nguồn thực thi | `features/C/05_execution_results.md`, `evidence/C/execution/results.json`, screenshot, trace và service log |
| Source review | Read-only tại baseline `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Thống kê | 18 PASS; 9 FAIL; 21 BLOCKED; 0 NOT RUN |
| Confirmed defect | 5 root cause, bao phủ đủ 9 FAIL |
| Requirement gap | 9 (`C-GAP-R01`–`C-GAP-R09`) |
| Additional implementation risk | 3, chưa nâng thành defect |
| Testability gap | 1, đã được runner giảm thiểu |
| Blocked condition | 6 nhóm, ảnh hưởng 21 case |
| Trạng thái | `REVIEWED` |

## 2. Nguyên tắc phân loại

- **Confirmed defect**: actual khác oracle có căn cứ và có execution evidence.
- **Requirement gap**: SRS/API chưa đủ để đặt expected result cụ thể.
- **Implementation gap/risk**: source có hành vi đáng chú ý nhưng thiếu oracle
  hoặc execution verdict để kết luận defect độc lập.
- **Testability gap**: kiến trúc/configuration làm khó việc cô lập hoặc quan sát
  test, nhưng không tự động là defect nghiệp vụ.
- **Blocked condition**: điều kiện cụ thể khiến case không thể nhận PASS/FAIL.

Không dùng behavior hiện tại làm oracle, không sửa expected result để hợp thức
hóa SUT và không biến case `BLOCKED` thành bug.

## 3. Confirmed defect — implementation khác oracle

| Defect | Oracle | Root cause có căn cứ | Test case FAIL | Ảnh hưởng |
|---|---|---|---|---|
| `C-BUG-001` | `C-R13`, FR-24 | Category table không có nhánh empty state | `C-TC-002` | Trang rỗng thiếu hướng dẫn/phản hồi thân thiện |
| `C-BUG-002` | `C-R07`, `C-R08`, FR-14 | API không validate; schema cho phép `NULL`/empty | `C-TC-007`–`009`, phần mutation `043` | Dữ liệu category không hợp lệ được lưu |
| `C-BUG-003` | `C-R20`, `C-R21`, FR-22 | Form thiếu label/`*`/required/error state | `C-TC-009`, `043` | Không chặn lỗi tại client và không có error placement đúng |
| `C-BUG-004` | `C-R01`, `C-R03`, FR-12, SEC-03 | Middleware chỉ verify JWT; restored token không check role | `C-TC-038`, `040`, `042` | User thường truy cập và mutation Category Admin |
| `C-BUG-005` | `C-R18`, FR-21 | Shell dùng `h1` chung; Category title là `h2` | `C-TC-044` | Heading không mô tả nội dung trang |

Chi tiết reproduction, severity, priority và đường dẫn evidence nằm tại
`bugs/C-FR14_bug_report.md`.

## 4. Requirement gap

| Gap | Nội dung chưa được quy định | Case bị ảnh hưởng | Actual đã quan sát | Kết luận |
|---|---|---|---|---|
| `C-GAP-R01` | Update có trong tiêu đề/API nhưng không có trong danh sách hành vi FR-14 | `C-TC-021`–`025` | API PUT update được existing record, kể cả empty/NULL; UI không có Update | Chưa có business oracle; không gọi defect |
| `C-GAP-R02` | Whitespace-only và trim | `C-TC-010`, `011` | API preserve và lưu nguyên whitespace | Chỉ observation; cần normalization rule |
| `C-GAP-R03` | Duplicate và case sensitivity | `C-TC-012`, `013` | `Laptop` và `laptop` đều được thêm | Chưa có uniqueness/case oracle |
| `C-GAP-R04` | Maximum length, charset và Unicode normalization | `C-TC-017`–`020` | 255/256/1024 ký tự và `null` đều được lưu | Không tự đặt max/type contract |
| `C-GAP-R05` | Exact HTTP status, response schema/message | Mọi reject/probe | API thường trả 200 với message generic | Business verdict dùng state transition; không ép exact code/text |
| `C-GAP-R06` | Nonexistent/malformed ID cho Update/Delete | `C-TC-024`, `027`–`031` | API trả success dù không đổi record | Chưa đủ oracle để gọi defect |
| `C-GAP-R07` | Delete category đang được product tham chiếu | `C-TC-033`, `034` | Category bị xóa, product giữ orphan `category_id` | Cần chốt reject/cascade/set-null/orphan policy |
| `C-GAP-R08` | Ordering, pagination, filter/search | Không tạo negative verdict riêng | GET trả record theo behavior SQLite hiện tại | Ngoài oracle Read hiện có |
| `C-GAP-R09` | Dialog xác nhận khi xóa category | Không có case defect; `C-TC-045` là probe navigation khác phạm vi | UI xóa trực tiếp | FR-24 chỉ bắt buộc dialog cho cart item; không mở rộng sang Category |

### Đề xuất chốt requirement

1. Xác nhận Update có thuộc FR-14 hay không; nếu có, bổ sung UI và validation oracle.
2. Chốt trim/whitespace, duplicate/case và length/type contract cho `name`.
3. Chốt response tối thiểu cho nonexistent/malformed ID.
4. Chốt referential action khi Category đang được Product tham chiếu.
5. Chỉ yêu cầu confirmation dialog hoặc breadcrumb nếu SRS được mở rộng rõ ràng.

## 5. Additional implementation gap/risk chưa phải confirmed defect

| ID | Source/observation | Case liên quan | Vì sao chưa gọi defect | Đề xuất |
|---|---|---|---|---|
| `C-IG-01` | `PUT /api/categories/:id` tại `server.js:257–266` update trực tiếp, chấp nhận empty/NULL và không kiểm tra `this.changes` | `C-TC-021`–`025` | Update chưa được chốt trong hành vi FR-14 | Chốt `C-GAP-R01`, sau đó áp dụng cùng validation/authorization với Create |
| `C-IG-02` | DELETE tại `server.js:269–276` luôn trả success nếu SQL không lỗi, không phân biệt target không tồn tại/sai kiểu | `C-TC-027`–`031` | `C-GAP-R06` chưa có response/verdict oracle | Chốt missing-ID contract rồi bổ sung affected-row check |
| `C-IG-03` | Schema `products.category_id` không có foreign key; Delete để lại orphan reference | `C-TC-033`, `034` | `C-GAP-R07` chưa chốt referential policy | Chốt policy trước khi thay đổi schema/service |

Ba risk này không được cộng vào 5 confirmed defect và không thay đổi verdict
`BLOCKED` của các case liên quan.

## 6. Testability gap

| ID | Gap | Ảnh hưởng | Cách Step 5 đã giảm thiểu | Residual condition |
|---|---|---|---|---|
| `C-TG-01` | Backend cố định port `3000` và DB path `backend/database.sqlite`; Admin Web cố định API URL `localhost:3000` | Khó chạy fixture cô lập hoặc song song mà không đụng runtime database/service | Runner tạo runtime copy của server và database adapter trỏ tới SQLite fixture riêng; kiểm tra port trước khi chạy | Cần cấu hình `PORT`, DB path và API base URL bằng environment để test trực tiếp, không cần adapter |

Gap này không làm case nào của lần chạy hiện tại `BLOCKED`, vì automation đã có
biện pháp cô lập. Nó vẫn là rủi ro bảo trì/reproducibility của test harness.

## 7. Blocked condition

| ID | Điều kiện thiếu | Test case | Lý do chưa thể verdict | Điều kiện rerun |
|---|---|---|---|---|
| `C-BC-01` | Oracle normalization/duplicate/case | `C-TC-010`–`013` | Actual có nhưng không có expected business behavior | Chốt `C-GAP-R02`, `R03` |
| `C-BC-02` | Oracle upper length và null/wrong-type representation | `C-TC-017`–`020` | Không có maximum/type contract | Chốt `C-GAP-R04`, `R05` |
| `C-BC-03` | Update scope và expected result | `C-TC-021`–`025` | FR-14 chỉ liệt kê Thêm/Xem/Xóa | Chốt `C-GAP-R01`, `R05`, `R06`, `R07` |
| `C-BC-04` | Nonexistent/malformed ID contract | `C-TC-027`–`031` | Không có tiêu chí accept/reject/status | Chốt `C-GAP-R05`, `R06` |
| `C-BC-05` | Referential policy | `C-TC-033`, `034` | Không biết orphan/reject/cascade/set-null là đúng | Chốt `C-GAP-R07` |
| `C-BC-06` | Breadcrumb không áp dụng cho Admin Category theo FR-23 | `C-TC-045` | Case chỉ ghi observation, không có applicable oracle | Giữ N/A hoặc chỉ rerun nếu requirement mở rộng |

Tổng `4 + 4 + 5 + 5 + 2 + 1 = 21` case BLOCKED. Không case nào trong
sáu nhóm được ghi thành confirmed defect.

## 8. Layer gap: requirement → UI → backend → database → testability

| Layer | Khoảng cách chính | Defect/gap | Ảnh hưởng |
|---|---|---|---|
| Requirement | Thiếu Update, normalization, length/type, ID response và reference policy | `C-GAP-R01`–`R09` | 21 case không thể nhận business verdict |
| Admin UI | Thiếu empty state, form validation/marker/error, role check khi restore token và heading theo trang | `C-BUG-001`, `003`–`005` | Feedback, validation, authorization và semantic GUI không đạt |
| Backend | Không validate category name; không check role; PUT/DELETE không check affected rows | `C-BUG-002`, `004`; `C-IG-01`, `02` | Dữ liệu invalid, privilege bypass và response mơ hồ |
| Database | `name` nullable; không có FK cho `products.category_id` | `C-BUG-002`; `C-IG-03` | Cho phép invalid category/orphan reference |
| Testability | Port, DB path và API URL hard-coded | `C-TG-01` | Runner cần runtime adapter để cô lập |

## 9. Traceability result → defect/gap → evidence

| Requirement/Gap | Partition/boundary | Test case | Result | Defect/gap/condition | Evidence |
|---|---|---|---|---|---|
| `C-R13` | `C-LS-V2`, `C-B07` | `C-TC-002` | FAIL | `C-BUG-001` | `screenshots/C-TC-002.png`, `traces/C-TC-002.zip` |
| `C-R07`, `C-R08` | missing/empty; `C-B01`, `C-B02` | `C-TC-007`, `008` | FAIL | `C-BUG-002` | screenshots/traces cùng ID |
| `C-R20`, `C-R21` | `C-UI-REQ`, `C-UI-ERROR` | `C-TC-009`, `043` | FAIL | `C-BUG-002`, `C-BUG-003` | screenshots/traces cùng ID |
| `C-R03` | role=user mutation | `C-TC-038`, `040` | FAIL | `C-BUG-004` | screenshots/traces cùng ID |
| `C-R01` | restored user JWT | `C-TC-042` | FAIL | `C-BUG-004` | `screenshots/C-TC-042.png`, `traces/C-TC-042.zip` |
| `C-R18` | `C-UI-H1` | `C-TC-044` | FAIL | `C-BUG-005` | `screenshots/C-TC-044.png`, `traces/C-TC-044.zip` |
| `C-GAP-R02`, `R03` | whitespace/trim/duplicate/case | `C-TC-010`–`013` | BLOCKED | `C-BC-01` | screenshots/traces cùng ID |
| `C-GAP-R04`, `R05` | upper length/null | `C-TC-017`–`020` | BLOCKED | `C-BC-02` | screenshots/traces cùng ID |
| `C-GAP-R01` | Update composites | `C-TC-021`–`025` | BLOCKED | `C-IG-01`, `C-BC-03` | screenshots/traces cùng ID |
| `C-GAP-R06` | nonexistent/0/negative/decimal/text ID | `C-TC-027`–`031` | BLOCKED | `C-IG-02`, `C-BC-04` | screenshots/traces cùng ID |
| `C-GAP-R07` | referenced category | `C-TC-033`, `034` | BLOCKED | `C-IG-03`, `C-BC-05` | screenshots/traces cùng ID |
| FR-23 non-applicable | breadcrumb observation | `C-TC-045` | BLOCKED | `C-BC-06` | `screenshots/C-TC-045.png`, `traces/C-TC-045.zip` |

Mọi đường dẫn ngắn trong bảng có prefix `evidence/C/execution/`. Actual có cấu
trúc và timestamp nằm trong `evidence/C/execution/results.json`; service lifecycle
nằm trong `evidence/C/execution/service-logs.txt`.

## 10. Coverage và residual risk

| Nhóm | Test ID | Kết quả | Defect/gap chính |
|---|---|---|---|
| Read/list | `001`–`004` | 3 PASS, 1 FAIL | `C-BUG-001` |
| Create/name | `005`–`020` | 5 PASS, 3 FAIL, 8 BLOCKED | `C-BUG-002`, `003`; `C-BC-01`, `02` |
| Update | `021`–`025` | 5 BLOCKED | `C-GAP-R01`, `C-IG-01`, `C-BC-03` |
| Delete/ID/reference | `026`–`034` | 2 PASS, 7 BLOCKED | `C-IG-02`, `03`; `C-BC-04`, `05` |
| Authentication/authorization | `035`–`042` | 5 PASS, 3 FAIL | `C-BUG-004` |
| UI conformance | `043`–`048` | 3 PASS, 2 FAIL, 1 BLOCKED | `C-BUG-002`, `003`, `005`; `C-BC-06` |

Các tổng theo nhóm: `18 PASS + 9 FAIL + 21 BLOCKED = 48`.

- Chưa xác nhận Update, name normalization/upper limit, invalid-ID response và
  referenced-category policy.
- Authorization defect là residual risk nghiêm trọng nhất vì user thường có thể
  mutation dữ liệu Category.
- PASS ở nominal Create/Delete không bù cho validation và role enforcement thiếu.
- Chỉ 27/48 case có verdict PASS/FAIL; không tuyên bố quality coverage 100%.
- Sau khi sửa defect và chốt requirement gap, cần regression toàn bộ 48 case.
