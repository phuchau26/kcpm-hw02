# C-FR14 — Thiết kế test case

## 1. Thông tin tài liệu

| Trường | Giá trị |
|---|---|
| Feature | `C-FR14` — Quản lý Danh mục trên Admin Web |
| Đầu vào | `01_spec_and_oracle.md`, `02_domain_model.md`, `03_boundary_value_analysis.md` |
| SUT baseline | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Tổng test case | 48 (`C-TC-001`–`C-TC-048`) |
| Trạng thái | `REVIEWED` |

Expected result không được sửa để khớp implementation.

## 2. Quy ước

- Fixture được reset trước từng test; `N` là số category trước operation.
- Mutation nominal dùng JWT admin hợp lệ, target tồn tại và category không được product tham
  chiếu, trừ khi test ghi khác.
- `PASS/FAIL` chỉ áp dụng khi có oracle. Probe thuộc requirement gap có expected result là
  ghi actual và verdict `BLOCKED`.
- Mỗi mutation kiểm tra database trước/sau, target, non-target và list-size delta.
- Exact HTTP status/message không được assert nếu SRS không quy định; runner dùng acceptance,
  rejection và persistent state làm oracle.

## 3. Baseline fixture

| Fixture | Trạng thái |
|---|---|
| Admin | JWT hợp lệ, `role = admin` |
| User thường | JWT hợp lệ, `role = user` |
| Category 1 | Tồn tại, được hai product tham chiếu |
| Category 2 | Tồn tại, được một product tham chiếu |
| Category 3–4 | Tồn tại, không có product tham chiếu |
| Frontend | Admin Web `http://127.0.0.1:5174` |
| Backend | API `http://127.0.0.1:3000`, dùng SQLite fixture cô lập |

## 4. Test case

| Test ID | Nhóm | Tiêu đề | Bước/Input chính | Expected result | Traceability |
|---|---|---|---|---|---|
| `C-TC-001` | Read | Hiển thị list có dữ liệu | Đăng nhập admin; mở tab Danh mục | Hiển thị đúng toàn bộ ID/name của fixture | `C-R11,C-R12; C-LS-V1; N/A-state` |
| `C-TC-002` | Read | Empty category list | Fixture không có category/product; mở tab Danh mục | Không có record giả; có icon/hình và message empty state thân thiện | `C-R13; C-LS-V2; C-B07,C-DATA-23` |
| `C-TC-003` | Read | ID/name fidelity | So sánh từng row UI với database snapshot | Mỗi row có đúng ID/name, không thiếu/thừa record | `C-R11,C-R12; C-LS-V1; C-DATA-24` |
| `C-TC-004` | Read/Security | Render category markup an toàn | Seed name chứa `<img onerror>`; mở list | Markup hiển thị như text, không tạo element/execute script | `C-R04; C-NM-V2,C-UI-SAFE; C-DATA-10` |
| `C-TC-005` | Create | Create nominal hợp lệ | UI nhập `Thiết bị đeo C-FR14`; submit | `N→N+1`; đúng một record mới; record cũ giữ nguyên và UI đọc lại được | `C-R06,C-R09,C-R10; C-NM-V1,C-PS-V1; C-DATA-04` |
| `C-TC-006` | Create/BVA | Name một ký tự | API Create name `A` | Accept theo non-empty oracle; tạo đúng một record | `C-R06,C-R08,C-R09; C-NM-V1; C-B01,C-B02,C-DATA-03` |
| `C-TC-007` | Create | Missing name | API body `{}` | Reject; database/list giữ `N→N` | `C-R07; C-NM-I1,C-PS-V3; C-B01,C-DATA-01` |
| `C-TC-008` | Create/BVA | Empty name qua API | API body `name=""` | Reject; database/list giữ `N→N` | `C-R08; C-NM-I2,C-PS-V3; C-B02,C-DATA-02` |
| `C-TC-009` | Create/UI | Empty name và error placement | UI để trống rồi submit | Request không gửi; lỗi trong trang phía trên submit; database không đổi | `C-R08,C-R20,C-R21; C-NM-I2,C-UI-REQ,C-UI-ERR; C-B02` |
| `C-TC-010` | Create/Gap | Whitespace-only | API Create `name=" "` | `BLOCKED`: ghi accept/reject/persist; chưa có trim/blank oracle | `C-GAP-R02; C-NM-U1; C-B03,C-DATA-05` |
| `C-TC-011` | Create/Gap | Whitespace đầu/cuối | API Create `name="  Laptop  "` | `BLOCKED`: ghi preserve/trim/reject; không đặt verdict normalization | `C-GAP-R02; C-NM-U2; C-DATA-06` |
| `C-TC-012` | Create/Gap | Duplicate exact | Tạo `Laptop` khi đã có `Laptop` | `BLOCKED`: ghi actual; không tự đặt uniqueness rule | `C-GAP-R03; C-NM-U3; C-DATA-07` |
| `C-TC-013` | Create/Gap | Duplicate khác case | Tạo `laptop` khi có `Laptop` | `BLOCKED`: ghi actual; chưa có case/duplicate oracle | `C-GAP-R03; C-NM-U4; C-DATA-08` |
| `C-TC-014` | Create | Ký tự đặc biệt thông thường | Create `Phụ kiện & Cáp (USB-C)` | Accept theo rule non-empty; round-trip đúng text | `C-R06,C-R08,C-R09; C-NM-V1; C-DATA-09` |
| `C-TC-015` | Create | Unicode | Create `Điện thoại_日本語_🙂` | Accept theo rule non-empty và đọc lại đúng text; ghi chú charset gap nếu reject | `C-R06,C-R08,C-R09,C-GAP-R04; C-NM-V1; C-DATA-11` |
| `C-TC-016` | Create/Security | Markup payload | Create markup rồi mở list | Nếu render, hiển thị text và không thực thi script; mutation chỉ tác động một record | `C-R04,C-R06,C-R10; C-NM-V2,C-UI-SAFE; C-DATA-10` |
| `C-TC-017` | Create/Gap | Name length 255 | API Create chuỗi 255 ký tự | `BLOCKED`: ghi actual; 255 không phải max của Category | `C-GAP-R04; C-NM-U5; C-B04,C-DATA-12` |
| `C-TC-018` | Create/Gap | Name length 256 | API Create chuỗi 256 ký tự | `BLOCKED`: ghi actual; không gán max+1 verdict | `C-GAP-R04; C-NM-U5; C-B04,C-DATA-13` |
| `C-TC-019` | Create/Gap | Name length 1024 | API Create chuỗi 1024 ký tự | `BLOCKED`: robustness observation; không có upper limit oracle | `C-GAP-R04; C-NM-U5; C-DATA-14` |
| `C-TC-020` | Create/Gap | Name null | API Create `name=null` | `BLOCKED`: representation/error contract chưa quy định | `C-GAP-R04,C-GAP-R05; C-NM-U6; N/A-no-boundary` |
| `C-TC-021` | Update/Gap | Update existing nominal | PUT target tồn tại với name mới | `BLOCKED`: ghi actual transition; Update chưa được FR-14 chốt | `C-GAP-R01; C-OP-U1,C-TR-04; N/A-state-probe` |
| `C-TC-022` | Update/Gap | Update empty name | PUT target tồn tại với `name=""` | `BLOCKED`: Update scope và validation oracle chưa chốt | `C-GAP-R01,C-R08; C-OP-U1,C-NM-I2; C-B02` |
| `C-TC-023` | Update/Gap | Update missing name | PUT target tồn tại body `{}` | `BLOCKED`: ghi actual; Update chưa có business oracle | `C-GAP-R01; C-OP-U1,C-NM-I1; C-B01` |
| `C-TC-024` | Update/Gap | Update target không tồn tại | PUT `max(id)+1` | `BLOCKED`: missing-target và Update đều chưa có oracle | `C-GAP-R01,C-GAP-R06; C-ID-U1,C-TR-09; C-B06,C-DATA-16` |
| `C-TC-025` | Update/Gap | Update category được product tham chiếu | PUT category có reference count 1 | `BLOCKED`: ghi actual; chưa có Update/reference policy | `C-GAP-R01,C-GAP-R07; C-RF-U1,C-RM-06; C-B08,C-DATA-22` |
| `C-TC-026` | Delete | Delete existing unreferenced | DELETE target tồn tại, reference count 0 | `N→N-1`; chỉ target biến mất; non-target giữ nguyên | `C-R14,C-R15; C-ID-V1,C-RF-V1,C-PS-V2; C-B06,C-B08,C-DATA-15,C-DATA-21` |
| `C-TC-027` | Delete/Gap | Delete nonexistent positive ID | DELETE `max(id)+1` | `BLOCKED`: ghi response/state; missing-target oracle chưa có | `C-GAP-R06; C-ID-U1,C-TR-09; C-B06,C-DATA-16` |
| `C-TC-028` | Delete/Gap | Delete ID 0 | DELETE ID `0` | `BLOCKED`: ghi actual; không tự đặt numeric range | `C-GAP-R06; C-ID-A03; C-B05,C-DATA-17` |
| `C-TC-029` | Delete/Gap | Delete ID âm | DELETE ID `-1` | `BLOCKED`: robustness observation | `C-GAP-R06; C-ID-A04; C-DATA-18` |
| `C-TC-030` | Delete/Gap | Delete ID decimal | DELETE ID `1.5` | `BLOCKED`: route/type behavior chưa quy định | `C-GAP-R06; C-ID-A05; C-DATA-19` |
| `C-TC-031` | Delete/Gap | Delete ID text | DELETE ID `abc` | `BLOCKED`: exact response chưa quy định | `C-GAP-R05,C-GAP-R06; C-ID-A06; C-DATA-20` |
| `C-TC-032` | Delete/Security | SQL-like ID | DELETE URL-encoded `1 OR 1=1` | Không được xóa nhiều record; query được parameterized; non-target giữ nguyên | `C-R05,C-R15; C-ID-A07; N/A-security-partition` |
| `C-TC-033` | Delete/Gap | Delete category có một product reference | DELETE target reference count 1 | `BLOCKED`: ghi reject/delete/orphan; policy chưa có | `C-GAP-R07; C-RF-U1,C-RM-02; C-B08,C-DATA-22` |
| `C-TC-034` | Delete/Gap | Delete category có nhiều product reference | DELETE target reference count 2 | `BLOCKED`: cùng reference partition; ghi actual | `C-GAP-R07; C-RF-U1,C-RM-03; C-B08` |
| `C-TC-035` | Authentication | Create thiếu JWT | POST nominal không Authorization | Reject; database giữ `N→N` | `C-R02; C-AU-I1,C-PS-V3; N/A-categorical` |
| `C-TC-036` | Authentication | Create JWT sai | POST nominal với token sai | Reject; database giữ `N→N` | `C-R02; C-AU-I2,C-PS-V3; N/A-categorical` |
| `C-TC-037` | Authentication | Create JWT hết hạn | POST nominal với JWT hết hạn hợp chữ ký | Reject; database giữ `N→N` | `C-R02; C-AU-I3,C-PS-V3; N/A-categorical` |
| `C-TC-038` | Authorization | Create bằng user token | POST nominal với JWT `role=user` | Reject; database giữ `N→N` | `C-R03; C-RL-I1,C-EL-I2; N/A-categorical` |
| `C-TC-039` | Authentication | Delete thiếu JWT | DELETE existing unreferenced không token | Reject; target và non-target giữ nguyên | `C-R02,C-R15; C-AU-I1,C-TR-08; N/A-categorical` |
| `C-TC-040` | Authorization | Delete bằng user token | DELETE existing unreferenced với `role=user` | Reject; target và non-target giữ nguyên | `C-R03,C-R15; C-RL-I1,C-EL-I5; N/A-categorical` |
| `C-TC-041` | Authorization/UI | User login vào Admin | Login Admin Web bằng account user | UI từ chối và không hiển thị Admin subsystem | `C-R01; C-RL-I1; N/A-categorical` |
| `C-TC-042` | Authorization/UI | User token trong localStorage | Inject JWT user vào `adminToken`, reload | Không được truy cập/hiển thị chức năng quản lý category | `C-R01,C-R03; C-DM-04,C-RL-I1; N/A-categorical` |
| `C-TC-043` | UI | Required marker và error placement | Mở form; submit empty | Có label `*`; lỗi trong trang nằm trên submit; không chỉ alert | `C-R20,C-R21; C-UI-REQ,C-UI-ERR; C-B02` |
| `C-TC-044` | UI | Heading | Mở trang category; đếm/đọc `h1` | Đúng một `h1` mô tả nội dung trang category | `C-R18; C-UI-H1; N/A-conformance` |
| `C-TC-045` | UI/N/A | Breadcrumb | Kiểm tra breadcrumb trang category | `BLOCKED`: FR-23 không bắt buộc breadcrumb cho Admin category; chỉ ghi observation | `FR-23-non-applicable; N/A-no-applicable-partition; N/A-no-boundary` |
| `C-TC-046` | UI | Màu button | Kiểm tra computed color của Thêm/Xóa | Thêm màu xanh, Xóa màu đỏ | `C-R17; C-UI-COLOR; N/A-conformance` |
| `C-TC-047` | UI | Tab order | Tab qua input, Thêm và các nút Xóa | Focus theo trên-xuống, trái-phải; không bỏ qua control | `C-R19; C-UI-TAB; N/A-ordered-conformance` |
| `C-TC-048` | UI | Ngôn ngữ | Kiểm tra nhãn/nút/thông báo category | Dùng tiếng Việt, trừ thuật ngữ kỹ thuật chuẩn | `C-R16; C-UI-LANG; N/A-conformance` |

## 5. Coverage matrix

| Nhóm | Test case |
|---|---|
| Read/list | `C-TC-001`–`C-TC-004` |
| Create/name/BVA | `C-TC-005`–`C-TC-020` |
| Update probes | `C-TC-021`–`C-TC-025` |
| Delete/ID/reference | `C-TC-026`–`C-TC-034` |
| Authentication/authorization | `C-TC-035`–`C-TC-042` |
| UI conformance | `C-TC-043`–`C-TC-048` |

Tất cả `C-R01`–`C-R21`, `C-B01`–`C-B08` và `C-GAP-R01`–`C-GAP-R08` có ít
nhất một test/probe liên kết. `C-GAP-R09` về dialog xác nhận Delete được giữ là documented
exclusion vì không có requirement áp dụng; không tạo expected result. `N/A` luôn kèm lý do
vì không phải rule nào cũng có numeric boundary.

## 6. Execution order

Runner chạy tuần tự theo ID `C-TC-001` → `C-TC-048`, reset fixture trước mỗi case. Các test
UI tạo dữ liệu riêng trong fixture; không phụ thuộc side effect của case trước.
