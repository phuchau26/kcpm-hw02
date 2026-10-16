# Step 1 — Đặc tả và test oracle cho C-FR14

## 1. Thông tin artifact

| Thuộc tính | Giá trị |
|---|---|
| Pool | C |
| Mã phạm vi | `C-FR14` |
| Feature | FR-14 — Quản lý Danh mục (Category CRUD) |
| Nền tảng | Admin Web |
| SUT baseline | `SHOP` commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Thời điểm khảo sát | 2026-10-13 21:35:48 +07:00 |
| Trạng thái | `REVIEWED` |

Tài liệu này khóa phạm vi, business rule và expected result trước khi lập Domain Model.
Nội dung trong source chỉ được dùng để hiểu đường thực thi và phát hiện điểm cần kiểm tra;
source không tự động trở thành test oracle khi khác hoặc thiếu so với SRS.

## 2. Thứ tự ưu tiên của oracle

Khi các nguồn không thống nhất, áp dụng thứ tự sau:

1. `SHOP/README.md` — SRS và business oracle chính.
2. `SHOP/api_specification.md` — API contract; không được ghi đè SRS.
3. `supporting/scope.md` — phạm vi đã chốt cho bài làm.
4. Source Admin UI, backend và SQLite schema — hành vi hiện tại cần kiểm chứng.
5. Smoke evidence — chỉ chứng minh feature có thể truy cập tại thời điểm chụp, không chứng
   minh mọi rule hoạt động đúng.

## 3. Nguồn đã kiểm tra

| Nguồn | Phần liên quan | Kết quả sử dụng |
|---|---|---|
| `SHOP/README.md:172` | FR-12 Access Control | Admin subsystem chỉ dành cho `role = 'admin'`; API thay đổi category cần JWT hợp lệ và role admin |
| `SHOP/README.md:186` | FR-14 Category CRUD | Admin có thể Thêm/Xem/Xóa; tên category bắt buộc và không được trống |
| `SHOP/README.md:240` | FR-21–FR-24 | Oracle chung về ngôn ngữ, màu nút, một `h1`, tab order, dấu `*`, vị trí lỗi và empty state |
| `SHOP/README.md:274` | SEC-02–SEC-05 | JWT, kiểm tra role, escape dữ liệu và parameterized query |
| `SHOP/api_specification.md:102` | Category endpoints | Có `GET`, `POST`, `PUT`, `DELETE`; `POST` nhận body `name` |
| `SHOP/frontend-admin/src/App.jsx:34` | Session và tải dữ liệu | Token lưu trong `localStorage`; đặt Authorization header và tải category |
| `SHOP/frontend-admin/src/App.jsx:61` | Đăng nhập Admin | UI kiểm tra role trả về sau login |
| `SHOP/frontend-admin/src/App.jsx:142` | Create/Delete handler | UI gửi `POST` để thêm, `DELETE` để xóa và tải lại dữ liệu |
| `SHOP/frontend-admin/src/App.jsx:188` | Login/Admin shell | Giao diện login, menu Admin và cơ chế hiển thị theo token |
| `SHOP/frontend-admin/src/App.jsx:294` | Category UI | Một input tạo category, nút Thêm mới, bảng danh sách và nút Xóa; không có Update UI |
| `SHOP/backend/server.js:100` | `authenticateToken` | Chỉ xác minh JWT; không kiểm tra role |
| `SHOP/backend/server.js:243` | Category routes | Hành vi hiện tại của `GET/POST/PUT/DELETE /api/categories` |
| `SHOP/backend/database.js:22` | SQLite schema | `categories(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`; `name` không có `NOT NULL`, `UNIQUE` hoặc giới hạn length |
| `SHOP/backend/database.js:63` | Quan hệ product-category | `products.category_id` chỉ là INTEGER, không khai báo foreign key |
| `evidence/C/smoke/C-FR14-SMOKE-001-category-admin.png` | Smoke evidence | Trang quản lý category đã được mở; không dùng làm execution verdict |

Các thay đổi cục bộ hiện có trong `SHOP` không được sửa ở bước này. Oracle được neo vào commit
trên; fixture ở Step 5 phải dùng bản sao cô lập thay vì database runtime của `SHOP`.

## 4. Phạm vi thao tác CRUD

| Thao tác | Trạng thái trong SRS | Trạng thái trong API/source | Quyết định phạm vi |
|---|---|---|---|
| Create | Có: “Thêm” | Có `POST` và Admin UI | Trong phạm vi |
| Read | Có: “Xem” | Có `GET` và bảng Admin UI | Trong phạm vi |
| Update | Không được nêu trong nội dung FR-14 | Có `PUT`, nhưng Admin UI không có thao tác sửa | `UNRESOLVED`; chỉ thiết kế probe khi cần, không đặt business expected result |
| Delete | Có: “Xóa” | Có `DELETE` và Admin UI | Trong phạm vi |

Tên mục FR-14 có chữ “CRUD” nhưng danh sách hành vi chính thức chỉ ghi Thêm/Xem/Xóa. Vì
vậy không được suy từ tiêu đề hoặc endpoint `PUT` rằng Update là business requirement đã chốt.

## 5. Business rule và oracle đã có căn cứ

### 5.1 Access control và security

| Rule ID | Quy tắc | Expected result | Căn cứ |
|---|---|---|---|
| `C-R01` | Admin subsystem chỉ dành cho tài khoản có `role = 'admin'` | Người chưa đăng nhập hoặc tài khoản không phải admin không được truy cập chức năng quản lý category | FR-12 |
| `C-R02` | `POST/PUT/DELETE /api/categories` phải có JWT hợp lệ | Thiếu, sai hoặc hết hiệu lực token thì request bị từ chối và database không đổi | FR-12, SEC-02 |
| `C-R03` | JWT của API thay đổi category phải chứa `role = 'admin'` | Token hợp lệ của user thường vẫn bị từ chối và database không đổi | FR-12, SEC-03 |
| `C-R04` | Dữ liệu nhập phải được render an toàn | Tên category hiển thị như text, không thực thi HTML/script | SEC-04 |
| `C-R05` | Truy vấn database phải parameterized | Giá trị `name` và `id` được bind bằng tham số, không nối trực tiếp vào SQL | SEC-05 |

`C-R02` và `C-R03` áp dụng cho các API thay đổi dữ liệu. SRS không yêu cầu `GET
/api/categories` phải có JWT vì endpoint này còn phục vụ danh sách sản phẩm công khai; quyền
truy cập Admin UI vẫn chịu `C-R01`.

### 5.2 Create

| Rule ID | Quy tắc | Expected result | Căn cứ |
|---|---|---|---|
| `C-R06` | Admin có thể thêm category | Với precondition hợp lệ và tên hợp lệ, tạo đúng một category mới | FR-14 |
| `C-R07` | `name` là trường bắt buộc | Thiếu trường `name` phải bị từ chối; database không đổi | FR-14 |
| `C-R08` | `name` không được để trống | Chuỗi rỗng `""` phải bị từ chối; database không đổi | FR-14 |
| `C-R09` | Create thành công phải quan sát được qua Read | Category mới có ID xác định được và tên đã gửi xuất hiện trong danh sách | Ngữ nghĩa Thêm/Xem của FR-14 |
| `C-R10` | Create không làm thay đổi record có sẵn | Các category đã tồn tại giữ nguyên ID và tên | Tính toàn vẹn tối thiểu của thao tác Create |

Whitespace-only, trim, duplicate, case sensitivity, maximum length và charset chưa được SRS
quy định. Các giá trị đó không được tự gán PASS/FAIL oracle ở Step 1.

### 5.3 Read

| Rule ID | Quy tắc | Expected result | Căn cứ |
|---|---|---|---|
| `C-R11` | Admin có thể xem category | Danh sách trả về phản ánh các record category hiện có trong baseline test | FR-14 |
| `C-R12` | Mỗi category đọc được phải phân biệt được | Tối thiểu quan sát được `id` và `name` của từng record như API/UI contract hiện có | API specification và Category UI |
| `C-R13` | Không có category là một trạng thái đọc hợp lệ | Không phát sinh record giả; UI phải có icon/hình minh họa và message thân thiện cho empty state | FR-14, FR-24 |

SRS không quy định thứ tự sắp xếp, phân trang, lọc hoặc tìm kiếm category. Không dùng các yếu
tố này làm expected result bắt buộc.

### 5.4 Delete

| Rule ID | Quy tắc | Expected result | Căn cứ |
|---|---|---|---|
| `C-R14` | Admin có thể xóa category | Với target tồn tại và quyền hợp lệ, category đích không còn trong database/danh sách | FR-14 |
| `C-R15` | Delete chỉ tác động target đã chọn | Các category khác giữ nguyên | Ngữ nghĩa tối thiểu của Xóa trong FR-14 |

SRS chưa quy định cách xử lý category đang được product tham chiếu, ID không tồn tại, ID sai
định dạng hoặc việc có cần dialog xác nhận hay không. Không suy diễn các expected result này.

### 5.5 UI áp dụng cho feature

| Rule ID | Quy tắc | Expected result | Căn cứ |
|---|---|---|---|
| `C-R16` | Giao diện phải dùng tiếng Việt | Nhãn, nút và thông báo người dùng của luồng category dùng tiếng Việt, trừ thuật ngữ kỹ thuật chuẩn | FR-21 |
| `C-R17` | Màu nút phản ánh loại hành động | Nút Thêm dùng màu xanh; nút Xóa dùng màu đỏ | FR-21 |
| `C-R18` | Mỗi trang có đúng một `h1` mô tả nội dung | Trang quản lý category có đúng một `h1` mô tả trang | FR-21 |
| `C-R19` | Tab order đi trên-xuống, trái-phải | Focus tới control theo thứ tự trực quan, không bỏ qua control tương tác | FR-21 |
| `C-R20` | Trường bắt buộc có dấu `*` bên cạnh label | Input tên category có label và dấu `*` | FR-22 |
| `C-R21` | Lỗi form nằm trên nút submit | Khi tên thiếu/rỗng, lỗi được hiển thị phía trên nút Thêm và request không được gửi | FR-22 và FR-14 |

## 6. Precondition đã chốt

| Precondition ID | Nội dung |
|---|---|
| `C-PC01` | Backend và Admin frontend chạy đúng baseline; API base URL trỏ tới backend test |
| `C-PC02` | SQLite fixture là bản sao cô lập, có snapshot trước từng test và có thể reset an toàn |
| `C-PC03` | Có một tài khoản admin, một tài khoản user thường và có thể tạo token thiếu/sai/hợp lệ cho từng partition authentication |
| `C-PC04` | Fixture biết chính xác tập category ban đầu và ID của target cần đọc/xóa |
| `C-PC05` | Các test thay đổi dữ liệu chạy tuần tự hoặc reset state để không phụ thuộc lẫn nhau |
| `C-PC06` | Test Delete có cả target đang không được product tham chiếu; target có tham chiếu chỉ là requirement-gap probe |
| `C-PC07` | Không dùng `SHOP/backend/database.sqlite` đang chạy làm fixture và không sửa source `SHOP` |

## 7. Input và biến trạng thái

| Input/state | Miền đã biết | Ghi chú oracle |
|---|---|---|
| Operation | `READ`, `CREATE`, `DELETE`; `UPDATE` unresolved | Update chưa có business oracle |
| Authentication | thiếu token, token sai/hết hạn, token hợp lệ | `C-R02` |
| Role | `admin`, không phải admin | `C-R01`, `C-R03` |
| Category name presence | có trường, thiếu trường | Thiếu là invalid theo `C-R07` |
| Category name value | `""`, non-empty; whitespace/duplicate/length/charset unresolved | Chỉ chuỗi rỗng có oracle invalid rõ ràng |
| Target ID | tồn tại; không tồn tại/sai định dạng unresolved | Không tự đặt HTTP status |
| Reference state | không có product tham chiếu; có product tham chiếu unresolved | Schema hiện không có foreign key |
| Database state | danh sách rỗng hoặc có record | Dùng cho Read và postcondition |

## 8. Expected result theo luồng

| Flow | Điều kiện | Expected result nghiệp vụ |
|---|---|---|
| Read danh sách | Admin UI được truy cập hợp lệ | Hiển thị đúng các category hiện có; mỗi record có thể phân biệt bằng ID/name |
| Read empty state | Fixture không có category | Không có record giả; hiển thị empty state theo FR-24 |
| Create hợp lệ | Admin + JWT hợp lệ + role admin + `name` non-empty | Tạo đúng một record; record mới đọc lại được; record cũ không đổi |
| Create thiếu/rỗng | Thiếu `name` hoặc `name = ""` | Từ chối; hiển thị lỗi đúng vị trí trên UI; database không đổi |
| Create không xác thực | Thiếu/sai/hết hạn token | Từ chối; database không đổi |
| Create sai quyền | JWT hợp lệ nhưng role không phải admin | Từ chối; database không đổi |
| Delete hợp lệ | Admin + JWT hợp lệ + target tồn tại, không có tham chiếu | Chỉ target biến mất; record khác giữ nguyên |
| Delete không xác thực/sai quyền | Token invalid hoặc role không phải admin | Từ chối; database không đổi |
| Update | Bất kỳ | Chưa có business expected result; chỉ ghi observed result nếu chạy probe |

Exact HTTP status, response body và message chưa được SRS/API contract quy định cho category.
Các test về business acceptance phải ưu tiên “accepted/rejected + database unchanged/changed”;
không tự đặt status code hoặc text cụ thể.

## 9. Hành vi hiện tại quan sát từ implementation

Đây là mô tả source read-only, không phải expected result:

| Observation ID | Hành vi hiện tại | So với oracle | Cách xử lý sau |
|---|---|---|---|
| `C-OBS01` | Admin UI từ chối user thường ngay sau login dựa trên `res.data.user.role` | Phù hợp một phần `C-R01` | Cần kiểm tra bypass bằng token user có sẵn trong `localStorage` |
| `C-OBS02` | Middleware `authenticateToken` chỉ verify JWT, không kiểm tra `req.user.role` | Không đủ cho `C-R03` | Candidate implementation discrepancy; xác nhận bằng execution |
| `C-OBS03` | `POST/PUT/DELETE` category đều dùng `authenticateToken` | Phù hợp phần JWT của `C-R02` | Test thiếu/sai/hết hạn token |
| `C-OBS04` | `POST` chèn trực tiếp `name` bằng parameterized query, không validation | Parameterized query phù hợp `C-R05`; validation có nguy cơ vi phạm `C-R07`–`C-R08` | Test API và UI với missing/empty |
| `C-OBS05` | Schema cho phép `name NULL`, trùng và không giới hạn length | Chỉ `NULL`/empty xung đột rule bắt buộc; duplicate/length chưa có oracle | Không biến mọi acceptance thành bug |
| `C-OBS06` | UI input không có `required`, label, dấu `*` hoặc vùng lỗi; lỗi dùng `alert` sau request | Có nguy cơ vi phạm `C-R20`–`C-R21` | Xác nhận bằng browser evidence |
| `C-OBS07` | UI chỉ có Create, Read và Delete; không có Update control | Phù hợp danh sách hành vi FR-14, nhưng khác tên CRUD/API contract | Giữ Update là requirement gap |
| `C-OBS08` | `PUT` và `DELETE` luôn trả success nếu SQL không lỗi, không kiểm tra `this.changes` | Missing-ID behavior chưa được đặc tả | Ghi actual ở gap probe, không gán defect nếu chưa có oracle |
| `C-OBS09` | Products chỉ có `category_id INTEGER`, không có foreign key | Delete referenced category có thể tạo orphan reference | Requirement gap; chưa phải confirmed defect |
| `C-OBS10` | Category UI có nút Thêm màu xanh và Xóa màu đỏ | Có dấu hiệu phù hợp `C-R17` | Xác nhận màu render và trạng thái tương tác khi execution |
| `C-OBS11` | Login có nhãn tiếng Anh; một số source text hiển thị dấu hiệu encoding sai trong terminal | Có nguy cơ vi phạm `C-R16`; terminal decoding không đủ làm evidence UI | Chỉ kết luận sau khi quan sát browser |
| `C-OBS12` | Admin shell có một `h1` “EShop Admin”, category title là `h2` | Có nguy cơ `h1` không mô tả đúng nội dung category theo `C-R18` | Xác nhận DOM và ngữ nghĩa trang khi execution |

Không observation nào trong bảng này được ghi là confirmed bug trước khi có test case, actual
result và evidence tại Step 5–6.

## 10. Requirement gap và nội dung chưa được quy định

| Gap ID | Nội dung chưa được chốt | Hệ quả với thiết kế test |
|---|---|---|
| `C-GAP-R01` | Update xuất hiện trong tiêu đề/API/source nhưng không có trong danh sách hành vi FR-14 | Không đặt business verdict cho Update cho đến khi giảng viên/TA xác nhận |
| `C-GAP-R02` | Whitespace-only, trim đầu/cuối và tên sau normalization | Ghi probe/observed result; không coi acceptance/rejection là đúng hoặc sai ngoài empty string rõ ràng |
| `C-GAP-R03` | Duplicate name và case sensitivity | Không đặt unique oracle vì SRS và schema không quy định |
| `C-GAP-R04` | Minimum/maximum length, charset và Unicode normalization | Không tự đặt numeric/string boundary; chỉ dùng symbolic boundary khi có rule bổ sung |
| `C-GAP-R05` | Exact HTTP status, response schema và message cho success/error | Assert state transition và accept/reject thay vì tự đặt status/text |
| `C-GAP-R06` | Xử lý malformed/non-existent ID cho Update/Delete | Có thể chạy robustness probe nhưng verdict nghiệp vụ là `UNRESOLVED` |
| `C-GAP-R07` | Delete category đang được product tham chiếu: reject, cascade, set null hay cho phép orphan | Chuẩn bị fixture riêng; chưa đặt expected result |
| `C-GAP-R08` | Thứ tự, pagination, filter/search của danh sách category | Không dùng làm oracle cho Read |
| `C-GAP-R09` | Delete có cần dialog xác nhận hay không | FR-24 chỉ bắt buộc dialog khi xóa item khỏi cart, không mở rộng sang category |

## 11. Giả định làm việc

| Assumption ID | Giả định tạm thời | Điều kiện hủy giả định |
|---|---|---|
| `C-AS01` | FR-14 trong `SHOP/README.md` là oracle cao nhất của feature | Có SRS/clarification chính thức mới hơn |
| `C-AS02` | Read được kiểm chứng qua cả API và bảng Admin, còn `GET /api/categories` có thể công khai | Giảng viên xác nhận GET category cũng bắt buộc admin |
| `C-AS03` | “Không được để trống” chắc chắn bao gồm missing và chuỗi `""`, nhưng chưa tự mở rộng sang whitespace-only | Có clarification về trim/blank semantics |
| `C-AS04` | Delete nominal dùng category không được product tham chiếu để tránh phụ thuộc policy chưa có | Policy referential integrity được bổ sung |

## 12. Traceability ban đầu

| Nhóm | Rule liên quan | Nguồn |
|---|---|---|
| Access control/security | `C-R01`–`C-R05` | FR-12, SEC-02–SEC-05 |
| Create | `C-R06`–`C-R10` | FR-14, API contract |
| Read | `C-R11`–`C-R13` | FR-14, FR-24, API/UI contract |
| Delete | `C-R14`–`C-R15` | FR-14 |
| UI | `C-R16`–`C-R21` | FR-21, FR-22 |
| Chưa có oracle | `C-GAP-R01`–`C-GAP-R09` | Xung đột hoặc thiếu trong SRS/API/schema |

Step 2 phải ánh xạ toàn bộ `C-R01`–`C-R21` và giữ nguyên các gap, không lấp gap bằng
hành vi hiện tại. Step 3 mới chọn partition/boundary; Step 4 mới đặt test case ID.
