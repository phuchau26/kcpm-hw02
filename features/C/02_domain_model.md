# C-FR14 — Domain Model

## 1. Thông tin tài liệu

| Trường thông tin | Giá trị |
|---|---|
| Mã phạm vi | `C-FR14` |
| Feature | FR-14 — Quản lý Danh mục (Category CRUD) |
| Nền tảng | Admin Web |
| Đầu vào | `features/C/01_spec_and_oracle.md` `REVIEWED` |
| SUT baseline | Commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Kỹ thuật | Domain modeling, state modeling và Equivalence Partitioning; chưa chọn boundary value |
| Trạng thái | `REVIEWED` |
| Thời điểm tạo | 2026-10-13 21:42:15 +07:00 |
| Mục tiêu | Mô hình hóa object, biến, partition, dependency và state transition làm đầu vào cho Step 3 |

Những phần phụ thuộc requirement gap giữ nguyên `UNRESOLVED`.

## 2. Nguyên tắc mô hình hóa

- `C-R01`–`C-R21` là oracle hiện hành từ Step 1; source chỉ cung cấp implementation và
  testability context.
- Miền nghiệp vụ không được suy ra từ storage type. Cột SQLite `name TEXT` không chứng minh
  `NULL`, whitespace, duplicate hoặc chuỗi tùy ý là hợp lệ về nghiệp vụ.
- Trong từng negative test sau này, các biến không phải mục tiêu nên dùng nominal valid value
  để cô lập nguyên nhân.
- `VALID` và `INVALID` chỉ được dùng khi có oracle. Nội dung thiếu rule dùng `UNRESOLVED`,
  không dùng hành vi hiện tại để lấp gap.
- Read, Create và Delete là operation có business oracle. Update được mô hình hóa vì user yêu
  cầu state `updated` và source có endpoint `PUT`, nhưng không được coi là requirement đã chốt.
- API decision được quan sát bằng cả response và persistent state. Exact HTTP status/message
  không thuộc oracle hiện tại.

## 3. Các object trong domain

| Object ID | Object | Thuộc tính cần thiết | Trách nhiệm trong model | Rule/gap |
|---|---|---|---|---|
| `C-OBJ-01` | `Category` | `id`, `name`, trạng thái tồn tại | Entity được Create/Read/Delete; Update chỉ là transition unresolved | `C-R06`–`C-R15`, `C-GAP-R01` |
| `C-OBJ-02` | `AdminIdentity` | JWT state, `user_id`, `role` | Quyết định quyền truy cập Admin subsystem và API thay đổi dữ liệu | `C-R01`–`C-R03` |
| `C-OBJ-03` | `CategoryList` | tập category, số phần tử, empty/non-empty | Kết quả Read và postcondition sau Create/Delete | `C-R09`–`C-R13` |
| `C-OBJ-04` | `CategoryOperation` | operation type, payload, target ID, actor | Aggregate yêu cầu CRUD và guard tương ứng | `C-R01`–`C-R15` |
| `C-OBJ-05` | `ProductReferenceSet` | các product có `category_id = target.id`, reference count | Biểu diễn phụ thuộc khi Delete; policy xử lý vẫn unresolved | `C-GAP-R07` |
| `C-OBJ-06` | `CategoryRepository` | before/after snapshot, affected rows | Kiểm chứng đúng record được tạo/xóa và record khác không đổi | `C-R05`, `C-R09`, `C-R10`, `C-R14`, `C-R15` |
| `C-OBJ-07` | `CategoryAdminView` | input, list, buttons, heading, error, focus order | Observable UI conformance của feature | `C-R04`, `C-R16`–`C-R21` |

## 4. Quan hệ và trust boundary

```text
Admin Web
  ├─ JWT ─────────────> AdminIdentity ── auth/role guards ──┐
  ├─ operation ──────────────────────────────────────────────┤
  ├─ category name ──────────────────────────────────────────┤
  └─ target ID ──────────────────────────────────────────────┤
                                                            v
                                                   CategoryOperation
                                                            │
                    ProductReferenceSet ── delete context ───┤
                                                            v
                                                   CategoryRepository
                                                            │
                                                            v
                                                     CategoryList
                                                            │
                                                            v
                                                   CategoryAdminView
```

Trust rule:

1. Quyền thay đổi dữ liệu đến từ JWT hợp lệ và `role = 'admin'`, không từ control chỉ ẩn/hiện
   trên client.
2. `Category.id`, trạng thái tồn tại và reference state phải được lấy từ persistent fixture,
   không chỉ dựa vào DOM cũ.
3. Sau mutation phải đọc lại database/list để kiểm chứng state transition và invariant.
4. Tên category là dữ liệu không đáng tin cậy khi render; UI phải hiển thị dạng text an toàn.
5. Update endpoint trong source không làm phát sinh business oracle khi SRS chưa xác nhận.

## 5. Danh mục biến domain

| Variable ID | Input/state | Type/representation | Valid domain | Invalid/non-conforming class | Dependencies | Oracle/gap |
|---|---|---|---|---|---|---|
| `C-DM-01` | `operation` | Enum logic | `READ`, `CREATE`, `DELETE` | Operation ngoài scope; `UPDATE` unresolved riêng | Requested flow | FR-14, `C-GAP-R01` |
| `C-DM-02` | `jwt_state` | Enum | `VALID` cho mutation | `MISSING`, `INVALID`, `EXPIRED` | Token/signing key | `C-R02` |
| `C-DM-03` | `actor_role` | Enum claim | `admin` | Bất kỳ role không phải admin | JWT hợp lệ | `C-R01`, `C-R03` |
| `C-DM-04` | `admin_ui_access` | Boolean decision | Cho phép khi identity là admin hợp lệ | Cho phép unauthenticated/non-admin là non-conforming | `C-DM-02`, `C-DM-03` | `C-R01` |
| `C-DM-05` | `name_presence` | Presence state | Có trường `name` | Missing | CREATE payload | `C-R07` |
| `C-DM-06` | `category_name` | Chuỗi | Non-empty string; special markup vẫn phải render an toàn | Chuỗi rỗng; whitespace/duplicate/length/type còn unresolved | `C-DM-05` | `C-R04`, `C-R08`, `C-GAP-R02`–`R04` |
| `C-DM-07` | `category_id` | SQLite integer identity/API path | ID của record tồn tại khi Delete/Read target | Non-existent/malformed chưa có business expected result | Repository state | `C-R12`, `C-R14`, `C-GAP-R06` |
| `C-DM-08` | `record_exists` | Boolean | `true` cho nominal Read/Delete; `false` là initial state trước Create | Delete/Update khi false là unresolved | `C-DM-07` | `C-R09`, `C-R14`, `C-GAP-R06` |
| `C-DM-09` | `referenced_product_count` | Số nguyên không âm | `0` cho nominal Delete | `> 0` unresolved, không gán valid/invalid | Product fixture, target ID | `C-GAP-R07` |
| `C-DM-10` | `category_list_size` | Số nguyên không âm | `0` và `> 0` đều là Read state hợp lệ | Giá trị âm/không nhất quán là non-conforming | Repository snapshot | `C-R11`, `C-R13` |
| `C-DM-11` | `affected_category_count` | Số record thay đổi | Create/Delete thành công tác động đúng một target | `0` hoặc `> 1` khi operation nominal thành công | Before/after snapshot | `C-R06`, `C-R10`, `C-R14`, `C-R15` |
| `C-DM-12` | `non_target_records_unchanged` | Boolean invariant | `true` | `false` | Before/after snapshot | `C-R10`, `C-R15` |
| `C-DM-13` | `render_mode` | UI/DOM behavior | Name được render như text, script không thực thi | HTML/script được thực thi | Category name, Admin view | `C-R04` |
| `C-DM-14` | `ui_language` | UI conformance | Tiếng Việt, trừ thuật ngữ kỹ thuật chuẩn | Nhãn/thông báo sai ngôn ngữ | Admin view | `C-R16` |
| `C-DM-15` | `action_color` | UI style | Create xanh, Delete đỏ | Màu khác quy ước | Operation button | `C-R17` |
| `C-DM-16` | `page_heading` | DOM structure | Đúng một `h1` mô tả trang category | Không có, nhiều hơn một hoặc không mô tả nội dung | Admin view | `C-R18` |
| `C-DM-17` | `tab_order` | Ordered focus sequence | Trên-xuống, trái-phải qua các control tương tác | Sai thứ tự hoặc bỏ qua control | Admin view | `C-R19` |
| `C-DM-18` | `required_marker` | Label/DOM | Label name có `*` | Thiếu label hoặc `*` | Create form | `C-R20` |
| `C-DM-19` | `validation_feedback` | UI placement/state | Lỗi nằm trên submit và invalid request không được gửi | Lỗi dưới nút, chỉ alert, không có lỗi hoặc vẫn gửi request | Invalid name | `C-R21` |
| `C-DM-20` | `operation_decision` | Enum | `ACCEPT` cho nominal valid; `REJECT` cho invalid có oracle | `UNRESOLVED` cho gap probe | Tất cả guard | `C-R01`–`C-R15`, gaps |

## 6. Equivalence partition — Operation và identity

### 6.1 Operation (`OP`)

| Partition ID | Variable | Class | Definition | Representative | Expected classification | Source |
|---|---|---|---|---|---|---|
| `C-OP-V1` | `operation` | `VALID` | Read category list | `GET /api/categories` + Admin table | Cho phép quan sát list | `C-R11`–`C-R13` |
| `C-OP-V2` | `operation` | `VALID` | Create category | `POST /api/categories` | Đánh giá auth + name guards | `C-R06`–`C-R10` |
| `C-OP-V3` | `operation` | `VALID` | Delete category | `DELETE /api/categories/:id` | Đánh giá auth + target/reference state | `C-R14`, `C-R15` |
| `C-OP-U1` | `operation` | `UNRESOLVED` | Update category | `PUT /api/categories/:id` | Chỉ ghi observed transition, không gán business verdict | `C-GAP-R01` |

### 6.2 JWT (`AU`) và role (`RL`)

| Partition ID | Variable | Class | Definition | Representative | Expected classification | Source |
|---|---|---|---|---|---|---|
| `C-AU-V1` | `jwt_state` | `VALID` | JWT hợp lệ | Token ký đúng, còn hiệu lực | Tiếp tục kiểm tra role | `C-R02` |
| `C-AU-I1` | `jwt_state` | `INVALID` | Thiếu token | Không có Authorization header | Reject mutation; database không đổi | `C-R02` |
| `C-AU-I2` | `jwt_state` | `INVALID` | Token sai | Chuỗi không verify được | Reject mutation; database không đổi | `C-R02` |
| `C-AU-I3` | `jwt_state` | `INVALID` | Token hết hạn | JWT có `exp` trong quá khứ | Reject mutation; database không đổi | `C-R02` |
| `C-RL-V1` | `actor_role` | `VALID` | Role admin | `role = 'admin'` | Được phép tiếp tục mutation | `C-R01`, `C-R03` |
| `C-RL-I1` | `actor_role` | `INVALID` | Role không phải admin | `role = 'user'` | Reject mutation; database không đổi | `C-R01`, `C-R03` |

JWT và role là hai characteristic riêng: token valid không đồng nghĩa actor có quyền admin.

## 7. Equivalence partition — Category name

| Partition ID | Variable(s) | Class | Definition | Representative | Expected classification | Source/gap |
|---|---|---|---|---|---|---|
| `C-NM-V1` | presence + name | `VALID` | Có trường và chuỗi non-empty nominal | `"Thiết bị đeo"` | Có thể Create khi auth hợp lệ | `C-R06`–`C-R09` |
| `C-NM-V2` | name + render | `VALID` input / secure-render oracle | Non-empty chứa markup | `"<img src=x onerror=alert(1)>"` | Không thực thi; render như text | `C-R04` |
| `C-NM-I1` | presence | `INVALID` | Thiếu field `name` | `{}` | Reject; database không đổi | `C-R07` |
| `C-NM-I2` | name | `INVALID` | Chuỗi rỗng | `{"name":""}` | Reject; database không đổi | `C-R08` |
| `C-NM-U1` | name | `UNRESOLVED` | Chỉ có whitespace | `"   "` | Không có business verdict | `C-GAP-R02` |
| `C-NM-U2` | name | `UNRESOLVED` | Có whitespace đầu/cuối | `"  Laptop  "` | Chưa rõ preserve/trim/reject | `C-GAP-R02` |
| `C-NM-U3` | name | `UNRESOLVED` | Trùng chính xác tên có sẵn | Tạo `"Laptop"` khi đã tồn tại | Chưa rõ accept/reject | `C-GAP-R03` |
| `C-NM-U4` | name | `UNRESOLVED` | Chỉ khác case | `"laptop"` so với `"Laptop"` | Chưa rõ duplicate semantics | `C-GAP-R03` |
| `C-NM-U5` | name | `UNRESOLVED` | Upper/extreme length vượt xa nominal | Chuỗi dài có kiểm soát, ví dụ 255/256/1024 ký tự | Không có maximum length boundary | `C-GAP-R04` |
| `C-NM-U6` | name | `UNRESOLVED` | Wrong type/null | `null`, number, object | SRS không quy định representation API | `C-GAP-R04`, `C-GAP-R05` |

`C-NM-V2` không nói markup là tên category mong muốn về mặt nội dung; nó dùng để kiểm chứng
security rule rằng mọi dữ liệu user nhập phải được render an toàn.

## 8. Equivalence partition — Record, ID và reference state

| Partition ID | Variable(s) | Class | Definition | Representative | Expected classification | Source/gap |
|---|---|---|---|---|---|---|
| `C-ID-V1` | ID + existence | `VALID` | ID trỏ đúng một category tồn tại | ID fixture của category độc lập | Cho phép nominal Read/Delete khi guard khác valid | `C-R12`, `C-R14` |
| `C-ID-U1` | ID + existence | `UNRESOLVED` | ID hợp dạng nhưng không tồn tại | `max(id)+1` | Missing-target behavior chưa có oracle | `C-GAP-R06` |
| `C-ID-U2` | ID | `UNRESOLVED` | ID sai định dạng | `abc`, empty path segment | Không tự đặt status/response | `C-GAP-R06` |
| `C-RF-V1` | reference count | `VALID` nominal fixture | Category không được product tham chiếu | `referenced_product_count = 0` | Có thể kiểm tra Delete nominal | `C-AS04`, `C-R14` |
| `C-RF-U1` | reference count | `UNRESOLVED` | Có ít nhất một product tham chiếu | `referenced_product_count = 1` | Chưa rõ reject/cascade/set null/orphan | `C-GAP-R07` |

`C-RF-V1` là nominal fixture để cô lập Delete, không phải khẳng định policy nghiệp vụ rằng
chỉ category không có reference mới được xóa.

## 9. Equivalence partition — Category list và persistence outcome

| Partition ID | Variable(s) | Class | Definition | Expected classification | Rule |
|---|---|---|---|---|---|
| `C-LS-V1` | list size | `VALID` | Danh sách có ít nhất một record đúng snapshot | Hiển thị từng ID/name | `C-R11`, `C-R12` |
| `C-LS-V2` | list size | `VALID` | Danh sách rỗng | Không tạo record giả; có empty state phù hợp | `C-R13` |
| `C-LS-I1` | list/snapshot | `INVALID` | Thiếu/thừa/sai record so với fixture | Read không phản ánh persistent state | `C-R11`, `C-R12` |
| `C-PS-V1` | affected count/invariant | `VALID` | Create làm `N → N+1`, thêm đúng record mới, record cũ giữ nguyên | Accept Create outcome | `C-R06`, `C-R09`, `C-R10` |
| `C-PS-I1` | affected count/invariant | `INVALID` | Create nominal không thêm đúng một record hoặc đổi record cũ | Fail Create oracle | `C-R06`, `C-R09`, `C-R10` |
| `C-PS-V2` | affected count/invariant | `VALID` | Delete làm `N → N-1`, chỉ target biến mất | Accept Delete outcome | `C-R14`, `C-R15` |
| `C-PS-I2` | affected count/invariant | `INVALID` | Delete nominal không xóa target hoặc đổi/xóa record khác | Fail Delete oracle | `C-R14`, `C-R15` |
| `C-PS-V3` | rejected mutation | `VALID` expected rejection | Request invalid bị reject và state giữ nguyên `N → N` | Accept rejection behavior | `C-R02`, `C-R03`, `C-R07`, `C-R08` |
| `C-PS-I3` | rejected mutation | `INVALID` | Request invalid vẫn làm database đổi | Fail rejection oracle | `C-R02`, `C-R03`, `C-R07`, `C-R08` |

## 10. Equivalence partition — UI conformance

| Dimension ID | Conforming partition | Non-conforming partition | Rule |
|---|---|---|---|
| `C-UI-LANG` | `C-UI-LANG-V1`: nhãn/nút/thông báo tiếng Việt | `C-UI-LANG-I1`: có text người dùng không phải tiếng Việt ngoài ngoại lệ kỹ thuật | `C-R16` |
| `C-UI-COLOR` | `C-UI-COLOR-V1`: Create xanh, Delete đỏ | `C-UI-COLOR-I1`: action dùng màu sai loại | `C-R17` |
| `C-UI-H1` | `C-UI-H1-V1`: đúng một `h1` mô tả trang category | `C-UI-H1-I1`: 0/nhiều hơn 1 hoặc heading không mô tả trang | `C-R18` |
| `C-UI-TAB` | `C-UI-TAB-V1`: focus trên-xuống, trái-phải | `C-UI-TAB-I1`: sai thứ tự hoặc bỏ qua control | `C-R19` |
| `C-UI-REQ` | `C-UI-REQ-V1`: name có label và `*` | `C-UI-REQ-I1`: thiếu label hoặc dấu `*` | `C-R20` |
| `C-UI-ERR` | `C-UI-ERR-V1`: lỗi trên submit, invalid request không gửi | `C-UI-ERR-I1`: lỗi sai vị trí/chỉ alert/không có hoặc vẫn gửi request | `C-R21` |
| `C-UI-SAFE` | `C-UI-SAFE-V1`: markup hiển thị như text, không chạy script | `C-UI-SAFE-I1`: HTML/script được thực thi | `C-R04` |

Các UI partition là output/conformance domain, không được trộn vào điều kiện hợp lệ của
Category entity.

## 11. Composite decision model

Đặt các predicate cho mutation có oracle:

```text
A1 = JWT thuộc C-AU-V1
A2 = role thuộc C-RL-V1
N1 = name thuộc C-NM-V1 hoặc C-NM-V2       (chỉ áp dụng CREATE)
T1 = target thuộc C-ID-V1                   (chỉ áp dụng DELETE nominal)
R1 = reference fixture thuộc C-RF-V1        (chỉ để cô lập DELETE nominal)

CREATE_ACCEPT = C-OP-V2 ∧ A1 ∧ A2 ∧ N1
DELETE_ACCEPT = C-OP-V3 ∧ A1 ∧ A2 ∧ T1 ∧ R1
```

| Composite ID | Điều kiện | Decision | Persistent outcome |
|---|---|---|---|
| `C-EL-V1` | `CREATE_ACCEPT` | `ACCEPT` | `N → N+1`, record mới đọc lại được, record cũ không đổi |
| `C-EL-I1` | Create với A1 sai | `REJECT` | `N → N` |
| `C-EL-I2` | Create với A1 đúng, A2 sai | `REJECT` | `N → N` |
| `C-EL-I3` | Create với A1–A2 đúng, N1 sai do missing/empty | `REJECT` | `N → N` |
| `C-EL-V2` | `DELETE_ACCEPT` | `ACCEPT` | `N → N-1`, chỉ target biến mất |
| `C-EL-I4` | Delete với A1 sai | `REJECT` | `N → N` |
| `C-EL-I5` | Delete với A1 đúng, A2 sai | `REJECT` | `N → N` |
| `C-EL-U1` | Update hoặc Delete với target/reference unresolved | `UNRESOLVED` | Chỉ ghi actual state, không đặt business verdict |

Thứ tự `C-EL-I1`–`C-EL-I5` phục vụ one-fault-at-a-time. SRS không quy định validation
precedence khi nhiều guard cùng sai.

## 12. State transition model của Category

### 12.1 Trạng thái entity

| State ID | Trạng thái | Predicate |
|---|---|---|
| `C-ST-0` | `NONEXISTENT` | Không có record mang identity/name fixture mục tiêu |
| `C-ST-1` | `CREATED` | Record mới tồn tại với ID xác định được và name đã gửi |
| `C-ST-2` | `UPDATED` | Cùng target ID tồn tại với name mới; trạng thái này chỉ là model cho gap probe |
| `C-ST-3` | `DELETED` | Target từng tồn tại nay không còn; non-target giữ nguyên |

### 12.2 Transition table

| Transition ID | From | Event/guard | To | Expected classification | Rule/gap |
|---|---|---|---|---|---|
| `C-TR-01` | `C-ST-0` | Create với `CREATE_ACCEPT` | `C-ST-1` | `VALID` | `C-R06`, `C-R09`, `C-R10` |
| `C-TR-02` | `C-ST-0` | Create với missing/empty name hoặc auth/role invalid | `C-ST-0` | `VALID` rejection; state không đổi | `C-R02`, `C-R03`, `C-R07`, `C-R08` |
| `C-TR-03` | `C-ST-1` | Read | `C-ST-1` | `VALID` self-loop; record quan sát được | `C-R11`, `C-R12` |
| `C-TR-04` | `C-ST-1` | Update với auth/role hợp lệ và name mới | `C-ST-2` | `UNRESOLVED` business transition | `C-GAP-R01` |
| `C-TR-05` | `C-ST-1` | Delete với `DELETE_ACCEPT` | `C-ST-3` | `VALID` | `C-R14`, `C-R15` |
| `C-TR-06` | `C-ST-2` | Read | `C-ST-2` | `UNRESOLVED` vì phụ thuộc Update | `C-GAP-R01` |
| `C-TR-07` | `C-ST-2` | Delete nominal | `C-ST-3` | Delete oracle áp dụng nếu target tồn tại; provenance Update vẫn unresolved | `C-R14`, `C-R15`, `C-GAP-R01` |
| `C-TR-08` | `C-ST-1` | Delete với auth/role invalid | `C-ST-1` | `VALID` rejection; state không đổi | `C-R02`, `C-R03` |
| `C-TR-09` | `C-ST-0` hoặc `C-ST-3` | Delete/Update target không tồn tại | Không chốt | `UNRESOLVED` | `C-GAP-R06` |
| `C-TR-10` | `C-ST-1` | Delete khi có referenced product | Không chốt | `UNRESOLVED` | `C-GAP-R07` |

Luồng đầy đủ được user yêu cầu được biểu diễn như sau; đường Update là gap, không phải
business flow đã xác nhận:

```text
C-ST-0 NONEXISTENT
   │ CREATE — valid oracle
   v
C-ST-1 CREATED
   │ UPDATE — UNRESOLVED (API/source only)
   v
C-ST-2 UPDATED
   │ DELETE — valid Delete oracle nếu target/reference fixture phù hợp
   v
C-ST-3 DELETED
```

Luồng business được SRS xác nhận không cần đi qua `UPDATED`:

```text
C-ST-0 NONEXISTENT ──CREATE──> C-ST-1 CREATED ──DELETE──> C-ST-3 DELETED
```

## 13. State transition của Category list

Với `N = category_list_size` trước operation:

| Operation/result | List transition | Invariant |
|---|---|---|
| Read | `N → N` | Tập record bằng snapshot |
| Create accepted | `N → N+1` | Có đúng một ID mới; mọi record cũ giữ nguyên |
| Create rejected | `N → N` | Không có record mới |
| Update probe | `N → N` | Count không đổi theo observed transition; name oracle vẫn unresolved |
| Delete accepted | `N → N-1` | Chỉ target biến mất |
| Delete rejected do auth/role | `N → N` | Target và non-target giữ nguyên |
| Delete target/reference gap | Chưa chốt | Chỉ ghi actual và đánh dấu `UNRESOLVED` |

## 14. Nominal baseline cho Step 3–4

| Biến/object | Nominal setup |
|---|---|
| Identity | JWT hợp lệ của `admin@eshop.com`, claim `role = 'admin'` |
| Category list | Ít nhất hai category kiểm soát được để kiểm tra target và non-target |
| Create name | `"Thiết bị đeo C-FR14"`, non-empty và khác rõ seed |
| Create initial state | Không có record mang tên fixture mục tiêu |
| Delete target | Một category fixture tồn tại, không có product tham chiếu |
| Non-target | Một category khác được snapshot trước mutation |
| Reference probe | Fixture riêng có đúng một product tham chiếu; verdict `UNRESOLVED` |
| Update probe | Target tồn tại, name mới khác rõ; chỉ ghi observed result |
| Reset | Khôi phục SQLite fixture trước test hoặc chạy tuần tự có cleanup |

Không dùng trực tiếp `SHOP/backend/database.sqlite` đang chạy. Tên seed trong source chỉ là
testability context, không phải bằng chứng implementation đúng.

## 15. Traceability từ rule tới domain

| Rule | Object/variable/partition/transition bao phủ |
|---|---|
| `C-R01` | `C-OBJ-02`, `C-DM-03`, `C-DM-04`, `C-RL-V1`, `C-RL-I1` |
| `C-R02` | `C-DM-02`, `C-AU-V1`, `C-AU-I1`–`I3`, `C-TR-02`, `C-TR-08` |
| `C-R03` | `C-DM-03`, `C-RL-V1`, `C-RL-I1`, `C-EL-I2`, `C-EL-I5` |
| `C-R04` | `C-OBJ-07`, `C-DM-13`, `C-NM-V2`, `C-UI-SAFE` |
| `C-R05` | `C-OBJ-06`, trust boundary; source conformance kiểm tra ở Step 5–6 |
| `C-R06` | `C-OBJ-01`, `C-OP-V2`, `C-PS-V1`, `C-TR-01` |
| `C-R07` | `C-DM-05`, `C-NM-I1`, `C-EL-I3` |
| `C-R08` | `C-DM-06`, `C-NM-I2`, `C-EL-I3` |
| `C-R09` | `C-OBJ-03`, `C-OBJ-06`, `C-PS-V1`, `C-TR-01` |
| `C-R10` | `C-DM-12`, `C-PS-V1`, `C-PS-I1` |
| `C-R11` | `C-OBJ-03`, `C-OP-V1`, `C-LS-V1`, `C-LS-V2` |
| `C-R12` | `C-DM-07`, `C-ID-V1`, `C-LS-V1`, `C-LS-I1` |
| `C-R13` | `C-DM-10`, `C-LS-V2` |
| `C-R14` | `C-OP-V3`, `C-ID-V1`, `C-PS-V2`, `C-TR-05` |
| `C-R15` | `C-DM-12`, `C-PS-V2`, `C-PS-I2`, `C-TR-05` |
| `C-R16` | `C-DM-14`, `C-UI-LANG` |
| `C-R17` | `C-DM-15`, `C-UI-COLOR` |
| `C-R18` | `C-DM-16`, `C-UI-H1` |
| `C-R19` | `C-DM-17`, `C-UI-TAB` |
| `C-R20` | `C-DM-18`, `C-UI-REQ` |
| `C-R21` | `C-DM-19`, `C-UI-ERR` |

Coverage cấp domain: `21/21` rule có ít nhất một object, variable, partition hoặc transition.
Đây không phải test-case coverage hay execution coverage.

## 16. Requirement gap được mang sang Step 3

| Gap ID | Domain bị ảnh hưởng | Quyết định mô hình |
|---|---|---|
| `C-GAP-R01` | `C-OP-U1`, `C-ST-2`, `C-TR-04`, `C-TR-06` | Update là transition unresolved, không có business PASS/FAIL oracle |
| `C-GAP-R02` | `C-NM-U1`, `C-NM-U2` | Không chia whitespace/trim thành valid-invalid |
| `C-GAP-R03` | `C-NM-U3`, `C-NM-U4` | Không đặt uniqueness/case rule |
| `C-GAP-R04` | `C-NM-U5`, `C-NM-U6` | Không đặt min/max length, charset hoặc type boundary |
| `C-GAP-R05` | `C-DM-20` | Không assert exact HTTP status/message ngoài accept/reject và state change có căn cứ |
| `C-GAP-R06` | `C-ID-U1`, `C-ID-U2`, `C-TR-09` | Missing/malformed ID chỉ là robustness probe |
| `C-GAP-R07` | `C-RF-U1`, `C-TR-10` | Referenced category chưa có Delete policy |
| `C-GAP-R08` | `CategoryList` | Không đặt oracle về order/pagination/filter |
| `C-GAP-R09` | Delete UI | Không mặc định cần confirmation dialog |

## 17. Quy tắc chuyển sang BVA

- Name chỉ có hai biên có căn cứ hiện tại: missing/present và empty/non-empty. Biên length
  cụ thể không tồn tại vì không có min/max.
- Với empty/non-empty string, Step 3 có thể dùng structural boundary `length = 0` và một
  representative non-empty; không gọi `length = 1` là minimum business length.
- Authentication, role, operation, record existence và UI conformance là categorical/state
  partition, không phải numeric BVA.
- `category_list_size` có state boundary `0 ↔ 1` phục vụ empty/non-empty Read, nhưng cả hai
  đều valid states.
- Reference count `0 ↔ 1` không có valid/invalid oracle cho phía `1`; phía có reference phải
  tiếp tục là unresolved probe.
- ID không tồn tại, duplicate, whitespace và Update không được biến thành BVA có verdict nếu
  gap chưa được giải quyết.
- Interaction ưu tiên cho Step 3–4: JWT × role × operation; name × Create; existence ×
  Delete; reference state × Delete; invalid input × persistent-state invariant.
