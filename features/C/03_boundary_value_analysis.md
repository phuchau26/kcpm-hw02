# C-FR14 — Equivalence Partitioning và Boundary Value Analysis

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `C-FR14` |
| Feature | FR-14 — Quản lý Danh mục (Category CRUD) |
| Đầu vào | `01_spec_and_oracle.md`, `02_domain_model.md` — đều `REVIEWED` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Equivalence Partitioning, two-value structural BVA, state-boundary analysis và robustness probe |
| Trạng thái | `REVIEWED` |
| Thời điểm tạo | 2026-10-13 21:48:04 +07:00 |
| Mục tiêu | Chọn partition, boundary và test data có căn cứ để chuyển sang Step 4 |

File này không thay đổi oracle của Step 1. `UNRESOLVED` nghĩa là có thể ghi actual result
trong execution nhưng chưa được gán PASS/FAIL nghiệp vụ cho tới khi requirement gap được giải
quyết.

## 2. Kết quả kiểm tra giới hạn trong SRS và source

| Nguồn | Quan sát | Hệ quả BVA |
|---|---|---|
| `SHOP/README.md:186` | Chỉ yêu cầu name bắt buộc và không để trống | Có biên missing/present và empty/non-empty; không có upper length hoặc duplicate rule |
| `SHOP/api_specification.md:102` | Body Create chỉ mô tả `{"name":"Tên DM"}` | Không bổ sung length, charset, trim, uniqueness hay error representation |
| `SHOP/frontend-admin/src/App.jsx:298` | Input `type="text"`, không có `required`, `minLength`, `maxLength`, `pattern` | Không được dùng UI source để tự đặt giới hạn; là candidate discrepancy chờ execution |
| `SHOP/backend/server.js:249` | POST lấy `name` rồi bind trực tiếp vào INSERT; không có validation | Hành vi hiện tại không thay thế business rule |
| `SHOP/backend/server.js:257` | PUT tồn tại nhưng SRS không chốt Update | Mọi Update data/transition giữ `UNRESOLVED` |
| `SHOP/backend/server.js:269` | DELETE bind `req.params.id`; không kiểm tra affected rows/reference | Missing-ID và reference policy chưa có oracle |
| `SHOP/backend/database.js:23` | `id INTEGER PRIMARY KEY AUTOINCREMENT`, `name TEXT`; không `NOT NULL`, `UNIQUE`, `CHECK` | ID implementation bắt đầu ở miền dương, nhưng business response cho 0/âm/sai kiểu vẫn unresolved; không có schema length/duplicate boundary |
| `SHOP/backend/database.js:64` | `products.category_id INTEGER`, không khai báo foreign key | Không có căn cứ chọn reject/cascade/set null/orphan khi Delete referenced category |

Kết luận: không tồn tại maximum name length hoặc duplicate rule có căn cứ. Không dùng giới
hạn của Product (`255`) cho Category vì hai field thuộc hai requirement khác nhau.

## 3. Lựa chọn kỹ thuật

1. Dùng **two-value structural BVA** tại biên rõ ràng `length 0 ↔ 1`. Giá trị 1 ký tự là
   representative nhỏ nhất của “non-empty”, không được diễn giải thành business rule
   `minLength = 1` được khai báo riêng.
2. Dùng **state-boundary analysis** cho record `nonexistent ↔ existing`, list `empty ↔
   non-empty` và mutation state transition.
3. Dùng **robustness probe** cho ID âm, 0, không tồn tại, sai kiểu và upper/extreme name
   length. Probe không tự có invalid verdict nếu requirement chưa quy định.
4. Không áp dụng worst-case BVA toàn tổ hợp. Interaction có rủi ro được chọn riêng để tránh
   số case tăng nhưng không thêm coverage có ý nghĩa.
5. Authentication, role, duplicate, charset và operation type là categorical partition;
   không gọi chúng là numeric BVA.

## 4. Equivalence partition — Category name

| Analysis ID | Domain partition | Class | Input | Expected classification | Rule/gap |
|---|---|---|---|---|---|
| `C-NA-01` | `C-NM-I1` | `INVALID` | Field `name` missing | Reject Create; database/list không đổi | `C-R07` |
| `C-NA-02` | `C-NM-I2` | `INVALID` | `name = ""`, length 0 | Reject Create; lỗi UI đúng vị trí; database/list không đổi | `C-R08`, `C-R21` |
| `C-NA-03` | `C-NM-V1` | `VALID` | `name = "A"`, length 1 | Accept theo rule non-empty; tạo đúng một record | `C-R06`, `C-R08`–`C-R10` |
| `C-NA-04` | `C-NM-V1` | `VALID` | `"Thiết bị đeo"` | Nominal valid name | `C-R06`, `C-R08`–`C-R10` |
| `C-NA-05` | `C-NM-U1` | `UNRESOLVED` | `" "` | Chưa rõ blank có được trim/reject/preserve | `C-GAP-R02` |
| `C-NA-06` | `C-NM-U1` | `UNRESOLVED` | `"   "` | Cùng whitespace-only partition; không tạo thêm rule theo số space | `C-GAP-R02` |
| `C-NA-07` | `C-NM-U2` | `UNRESOLVED` | `"  Laptop  "` | Chưa rõ trim/preserve/reject | `C-GAP-R02` |
| `C-NA-08` | `C-NM-U3` | `UNRESOLVED` | Tạo `"Laptop"` khi đã tồn tại đúng tên | Chưa rõ accept/reject; không gán unique oracle | `C-GAP-R03` |
| `C-NA-09` | `C-NM-U4` | `UNRESOLVED` | Tạo `"laptop"` khi `"Laptop"` tồn tại | Chưa rõ case-sensitive duplicate semantics | `C-GAP-R03` |
| `C-NA-10` | `C-NM-V1` | `VALID` theo rule đã biết | `"Phụ kiện & Cáp (USB-C)"` | Non-empty; tạo và đọc lại đúng text nếu không có rule khác | `C-R06`, `C-R08`, `C-R09` |
| `C-NA-11` | `C-NM-V2` | `VALID` input / security oracle | `"<img src=x onerror=alert(1)>"` | Nếu hiển thị phải là text, không thực thi script; state change vẫn kiểm tra riêng | `C-R04`, SEC-04 |
| `C-NA-12` | `C-NM-V1` | `VALID` theo rule đã biết | `"Điện thoại_日本語_🙂"` | Non-empty Unicode; không có charset exclusion trong SRS | `C-R06`, `C-R08`, `C-GAP-R04` |
| `C-NA-13` | `C-NM-U5` | `UNRESOLVED` upper length | Chuỗi 255 ký tự | Data probe; không gọi là max hoặc boundary | `C-GAP-R04` |
| `C-NA-14` | `C-NM-U5` | `UNRESOLVED` upper length | Chuỗi 256 ký tự | Pair với 255 để phát hiện threshold ẩn; không gán verdict | `C-GAP-R04` |
| `C-NA-15` | `C-NM-U5` | `UNRESOLVED` upper length | Chuỗi 1024 ký tự | Robustness probe, không phải `max+1` | `C-GAP-R04` |
| `C-NA-16` | `C-NM-U6` | `UNRESOLVED` representation | `null`, number hoặc object qua API | Không có API type/error oracle | `C-GAP-R04`, `C-GAP-R05` |

Ký tự đặc biệt không được mặc định là invalid. `C-NA-10` kiểm tra round-trip text thông
thường; `C-NA-11` kiểm tra security output. Với markup, security oracle luôn áp dụng nếu dữ
liệu được render, bất kể implementation accept hay reject Create.

## 5. Boundary của name

| Boundary ID | Partition liên quan | Edge | Selected values | Expected classification | Rationale/source |
|---|---|---|---|---|---|
| `C-B01` | `C-NM-I1` ↔ present name | Presence boundary | Missing field `{}` ↔ present `{"name":"A"}` | Missing `INVALID`; present non-empty `VALID` | `C-R07` |
| `C-B02` | `C-NM-I2` ↔ `C-NM-V1` | Structural length edge | `length = 0: ""` ↔ `length = 1: "A"` | 0 `INVALID`; 1 `VALID` theo non-empty rule | `C-R08` |
| `C-B03` | `C-NM-U1` ↔ `C-NM-V1` | Semantic blank/non-blank probe | `" "` ↔ `" A"` | Whitespace-only `UNRESOLVED`; non-empty visible char valid theo rule đã biết, trim unresolved | `C-GAP-R02` |
| `C-B04` | `C-NM-U5` | Candidate upper-threshold probe | length 255 ↔ 256 | Cả hai `UNRESOLVED`; không gọi 255 là max | `C-GAP-R04` |

Không có boundary ID cho duplicate vì duplicate là state/category partition, không phải miền
có thứ tự. Không có upper-length BVA chính thức; `C-B04` chỉ giúp phát hiện validation ẩn.

## 6. Phân tích độ dài

| Length | Vai trò | Verdict được phép |
|---:|---|---|
| Missing | Presence partition | `INVALID` theo `C-R07` |
| 0 | Empty boundary | `INVALID` theo `C-R08` |
| 1 | Adjacent representable non-empty value | `VALID` đối với rule non-empty; không khẳng định SRS khai báo `minLength=1` |
| Nominal 12–30 | Representative phổ biến | `VALID` nếu non-empty và guard khác hợp lệ |
| 255 | Probe vì Product có limit 255 nhưng Category không có | `UNRESOLVED`; không copy rule Product |
| 256 | Paired probe | `UNRESOLVED` |
| 1024 | Robustness probe | `UNRESOLVED` |

Source không có `maxlength` hoặc database constraint. Vì vậy không tạo `max-1`, `max`,
`max+1` chính thức và không ghi một chuỗi dài là invalid chỉ vì kích thước.

## 7. Category ID và record existence

ID có hai khía cạnh độc lập:

- **Representation**: route parameter có thể trông giống integer/string.
- **Existence**: chỉ ID ánh xạ đúng một record fixture mới là nominal valid target.

| Analysis ID | Input/state | Class | Selected value | Expected classification | Source/gap |
|---|---|---|---|---|---|
| `C-ID-A01` | Existing generated ID | `VALID` | `existing_category_id` lấy từ fixture | Read/Delete nominal được phép khi auth/reference guard hợp lệ | `C-R12`, `C-R14` |
| `C-ID-A02` | Positive but nonexistent | `UNRESOLVED` | `max_existing_id + 1` sau khi khóa fixture | Chưa rõ reject/status/body; state không được giả định | `C-GAP-R06` |
| `C-ID-A03` | Zero | `UNRESOLVED` | `0` | Không thể là generated ID trong schema hiện tại, nhưng business response chưa quy định | `C-GAP-R06` |
| `C-ID-A04` | Negative | `UNRESOLVED` | `-1` | Robustness probe; không tự gọi invalid business input | `C-GAP-R06` |
| `C-ID-A05` | Non-integer numeric | `UNRESOLVED` | `1.5` | Route representation/error behavior chưa quy định | `C-GAP-R06` |
| `C-ID-A06` | Alphabetic string | `UNRESOLVED` | `abc` | Sai kiểu so với schema identity; exact response chưa quy định | `C-GAP-R05`, `C-GAP-R06` |
| `C-ID-A07` | SQL-like text | `UNRESOLVED` response / security oracle | `1 OR 1=1` URL-encoded | Không được tác động nhiều record; query phải parameterized | `C-R05`, `C-GAP-R06` |
| `C-ID-A08` | Missing route segment | `UNRESOLVED` | `/api/categories/` với method Delete/Put | Có thể không match route; không có business response contract | `C-GAP-R06` |

### 7.1 Boundary/state points của ID

| Boundary ID | Partition/state | Edge | Selected values | Expected classification | Rationale |
|---|---|---|---|---|---|
| `C-B05` | Schema-generated ID region | Implementation floor probe | `0` ↔ `1` | `0` unresolved; `1` chỉ valid nếu fixture thật sự có ID 1 | AUTOINCREMENT là implementation, không phải business range |
| `C-B06` | `C-ID-V1` ↔ `C-ID-U1` | Existence state boundary | `existing_category_id` ↔ `max_existing_id+1` | Existing valid target; nonexistent response unresolved | Existence không phải numeric adjacency chung |

Không dùng `min-1/min/min+1` cho ID như một business BVA: ID là identifier, không phải đại
lượng mà mọi số dương đều hợp lệ. Fixture phải xác minh existence trước request.

## 8. Category list size

| Boundary ID | Partition | Edge | Selected values | Expected classification | Rule |
|---|---|---|---|---|---|
| `C-B07` | `C-LS-V2` ↔ `C-LS-V1` | Empty/non-empty state boundary | `N = 0` ↔ `N = 1` | Cả hai valid Read state; UI empty state chỉ áp dụng ở 0 | `C-R11`–`C-R13` |

`N = 0` không phải invalid. Đây là state boundary để kiểm tra cả empty state và record đầu
tiên, không phải robust numeric BVA.

## 9. Referenced products và Update/Delete

### 9.1 Reference-count boundary

| Boundary ID | Partition | Edge | Selected values | Expected classification | Rule/gap |
|---|---|---|---|---|---|
| `C-B08` | `C-RF-V1` ↔ `C-RF-U1` | No-reference/has-reference state | `reference_count = 0` ↔ `1` | 0 dùng cho nominal Delete; 1 `UNRESOLVED` | `C-R14`, `C-GAP-R07` |

Không mở rộng `1` thành invalid: SRS không quy định referential policy, còn schema không có
foreign key. Các giá trị `1` và `>1` cùng một unresolved partition trừ khi execution cho thấy
behavior phụ thuộc số lượng.

### 9.2 Operation × existence × reference matrix

| Matrix ID | Operation | Target | References | Classification | Điều được phép assert |
|---|---|---|---:|---|---|
| `C-RM-01` | Delete | Existing | 0 | `VALID` nominal | Target biến mất; non-target giữ nguyên; `N → N-1` |
| `C-RM-02` | Delete | Existing | 1 | `UNRESOLVED` | Ghi actual: reject/delete/orphan; không đặt business verdict |
| `C-RM-03` | Delete | Existing | >1 | `UNRESOLVED` | Cùng partition reference; chỉ thêm nếu cần robustness |
| `C-RM-04` | Delete | Nonexistent | N/A | `UNRESOLVED` | Ghi response/state; không đặt exact status/message |
| `C-RM-05` | Update | Existing | 0 | `UNRESOLVED` | Update chưa có business oracle; ghi actual transition |
| `C-RM-06` | Update | Existing | 1 | `UNRESOLVED` | Không suy rằng reference phải/không được ảnh hưởng Update |
| `C-RM-07` | Update | Nonexistent | N/A | `UNRESOLVED` | Kết hợp `C-GAP-R01` và `C-GAP-R06` |

Nếu Delete referenced category được implementation cho phép, Step 5 phải chụp cả bảng
`categories` và `products`; Step 6 phân loại là requirement gap/implementation risk, không tự
ghi confirmed defect nếu chưa có oracle.

## 10. Authentication và persistent-state interaction

Các partition auth/role đã có ở Domain Model, không có numeric boundary. Step 4 cần tối thiểu
các interaction sau để tránh chỉ test input name với admin hợp lệ:

| Interaction ID | Operation/data | JWT | Role | Expected state |
|---|---|---|---|---|
| `C-IX-01` | Create nominal name | Valid | Admin | `N → N+1` |
| `C-IX-02` | Create nominal name | Missing/invalid/expired | N/A | Reject, `N → N` |
| `C-IX-03` | Create nominal name | Valid | User | Reject, `N → N` |
| `C-IX-04` | Create empty/missing name | Valid | Admin | Reject, `N → N` |
| `C-IX-05` | Delete existing unreferenced | Valid | Admin | `N → N-1` |
| `C-IX-06` | Delete existing unreferenced | Missing/invalid/expired | N/A | Reject, `N → N` |
| `C-IX-07` | Delete existing unreferenced | Valid | User | Reject, `N → N` |
| `C-IX-08` | Update probe | Valid | Admin | `UNRESOLVED`; chỉ ghi actual |

Mỗi mutation test phải snapshot target, non-target và list size trước/sau. Response success
mà persistent state sai không được tính là PASS.

## 11. Test data catalog cho Step 4

| Data ID | Giá trị/setup | Partition/boundary | Verdict basis |
|---|---|---|---|
| `C-DATA-01` | Body `{}` | `C-NM-I1`, `C-B01` | Invalid có oracle |
| `C-DATA-02` | `name = ""` | `C-NM-I2`, `C-B02` | Invalid có oracle |
| `C-DATA-03` | `name = "A"` | `C-NM-V1`, `C-B01`, `C-B02` | Valid theo non-empty rule |
| `C-DATA-04` | `name = "Thiết bị đeo C-FR14"` | `C-NM-V1` | Nominal valid |
| `C-DATA-05` | `name = " "` | `C-NM-U1`, `C-B03` | Unresolved whitespace |
| `C-DATA-06` | `name = "  Laptop  "` | `C-NM-U2` | Unresolved trim |
| `C-DATA-07` | Duplicate exact fixture name | `C-NM-U3` | Unresolved duplicate |
| `C-DATA-08` | Case variant of fixture name | `C-NM-U4` | Unresolved case/duplicate |
| `C-DATA-09` | `"Phụ kiện & Cáp (USB-C)"` | `C-NA-10` | Valid relative to known rule |
| `C-DATA-10` | Markup payload | `C-NM-V2`, `C-UI-SAFE` | Security output oracle |
| `C-DATA-11` | Unicode payload | `C-NA-12` | Non-empty/round-trip check |
| `C-DATA-12` | 255-character string | `C-NM-U5`, `C-B04` | Unresolved upper probe |
| `C-DATA-13` | 256-character string | `C-NM-U5`, `C-B04` | Unresolved upper probe |
| `C-DATA-14` | 1024-character string | `C-NM-U5` | Robustness probe |
| `C-DATA-15` | Existing fixture ID | `C-ID-V1`, `C-B06` | Valid target |
| `C-DATA-16` | `max_existing_id + 1` | `C-ID-U1`, `C-B06` | Unresolved nonexistent |
| `C-DATA-17` | ID `0` | `C-ID-A03`, `C-B05` | Unresolved representation/existence |
| `C-DATA-18` | ID `-1` | `C-ID-A04` | Unresolved robustness |
| `C-DATA-19` | ID `1.5` | `C-ID-A05` | Unresolved wrong numeric type |
| `C-DATA-20` | ID `abc` | `C-ID-A06` | Unresolved wrong type |
| `C-DATA-21` | Reference count 0 | `C-RF-V1`, `C-B08` | Nominal Delete fixture |
| `C-DATA-22` | Reference count 1 | `C-RF-U1`, `C-B08` | Unresolved reference policy |
| `C-DATA-23` | Empty list | `C-LS-V2`, `C-B07` | Valid empty state |
| `C-DATA-24` | One-record list | `C-LS-V1`, `C-B07` | Valid non-empty state |

Các chuỗi dài phải được sinh xác định và ghi length thật trong test case/evidence; không chèn
toàn bộ payload dài vào screenshot nếu làm mất khả năng đọc.

## 12. Traceability boundary/partition

| Rule/gap | Partition/analysis | Boundary/data |
|---|---|---|
| `C-R04` | `C-NM-V2`, `C-UI-SAFE` | `C-DATA-10` |
| `C-R06`, `C-R09`, `C-R10` | `C-NM-V1`, `C-PS-V1` | `C-B02`, `C-DATA-03`, `C-DATA-04` |
| `C-R07` | `C-NM-I1` | `C-B01`, `C-DATA-01` |
| `C-R08` | `C-NM-I2`, `C-NM-V1` | `C-B02`, `C-DATA-02`, `C-DATA-03` |
| `C-R11`–`C-R13` | `C-LS-V1`, `C-LS-V2` | `C-B07`, `C-DATA-23`, `C-DATA-24` |
| `C-R14`, `C-R15` | `C-ID-V1`, `C-RF-V1`, `C-PS-V2` | `C-B06`, `C-B08`, `C-DATA-15`, `C-DATA-21` |
| `C-GAP-R01` | `C-OP-U1`, `C-RM-05`–`C-RM-07` | Update probes only |
| `C-GAP-R02` | `C-NM-U1`, `C-NM-U2` | `C-B03`, `C-DATA-05`, `C-DATA-06` |
| `C-GAP-R03` | `C-NM-U3`, `C-NM-U4` | `C-DATA-07`, `C-DATA-08` |
| `C-GAP-R04` | `C-NM-U5`, `C-NM-U6` | `C-B04`, `C-DATA-12`–`C-DATA-14` |
| `C-GAP-R05`, `C-GAP-R06` | `C-ID-U1`, `C-ID-U2`, `C-ID-A02`–`C-ID-A08` | `C-B05`, `C-B06`, `C-DATA-16`–`C-DATA-20` |
| `C-GAP-R07` | `C-RF-U1`, `C-RM-02`, `C-RM-03`, `C-RM-06` | `C-B08`, `C-DATA-22` |

Access-control and UI rules not shown in this boundary table remain covered by categorical
partitions from Step 2 and must be included in Step 4. BVA coverage is not equivalent to full
rule coverage.

## 13. Coverage summary

| Loại | Số lượng | Ghi chú |
|---|---:|---|
| Boundary ID | 8 | `C-B01`–`C-B08`; gồm structural/state boundary và probe được ghi rõ |
| Name analysis partition | 16 | Valid, invalid và unresolved được tách theo oracle |
| ID analysis partition | 8 | Chỉ existing target có nominal valid oracle; security query vẫn áp dụng |
| Reference/operation matrix row | 7 | Update và referenced Delete giữ unresolved |
| Interaction row | 8 | Bao phủ JWT × role × operation × data state |
| Test data row | 24 | Dùng làm đầu vào Step 4, chưa phải test case |
| Requirement gap giữ nguyên | 9 | Không gap nào bị biến thành business rule |

### Không áp dụng numeric BVA

- JWT state và role: categorical partition.
- Duplicate và case sensitivity: data-state partition; không có order.
- Operation type: categorical; Update là scope gap.
- Record existence: state partition, không phải mọi integer dương đều valid.
- UI language/color/heading/tab/error: conformance partition.
- Exact HTTP status/message: chưa có contract.

## 14. Quy tắc chuyển sang test case

- Mỗi test invalid có oracle phải assert cả response/feedback và database/list không đổi.
- Mỗi mutation nominal phải kiểm tra target, non-target và list-size delta.
- Với `UNRESOLVED` probe, expected result phải ghi “record actual; no business verdict”, không
  dùng hành vi source làm PASS.
- Không gộp whitespace-only, duplicate, upper length và referenced Delete thành “invalid”.
- Không dùng ID 0/âm/sai kiểu để chứng minh BVA numeric range của business ID.
- Update test chỉ là requirement-gap probe cho tới khi có clarification chính thức.
- Special-character security test phải kiểm tra DOM/script execution, không chỉ API response.
- Step 4 nên giữ one-fault-at-a-time cho core cases; chỉ thêm multi-condition case theo bảng
  interaction ở mục 10.
