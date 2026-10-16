# AI Audit Report — HW02 Domain Testing

## 1. Thông tin chung

| Trường | Giá trị |
|---|---|
| Sinh viên | Nguyễn Phúc Hậu |
| MSSV | 23120252 |
| Bài tập | HW02 — Domain Testing trên EShop |
| AI tool | OpenAI Codex |
| Model | `codex gpt-5.6 sol` |
| Reasoning effort | `medium` |
| Múi giờ | Asia/Saigon (`UTC+07:00`) |
| Phạm vi log | `S001-I001`–`S001-I055` |

## 2. Phạm vi sử dụng AI

AI được dùng để hỗ trợ đọc và hệ thống hóa đặc tả, lập Domain Model, chia
Equivalence Partition, xác định boundary, thiết kế test case, tạo Playwright
automation, tổng hợp execution result, nhóm defect theo root cause, lập
traceability matrix và soạn báo cáo. AI không được dùng để thay đổi source
`SHOP`, sửa expected result nhằm ép test PASS hoặc tạo evidence giả.

Sinh viên chịu trách nhiệm đối chiếu output với SRS, API contract, source code,
`results.json`, screenshot, trace và service log. Các miền thiếu oracle được giữ
ở trạng thái requirement gap hoặc BLOCKED.

## 3. Nhật ký và artifact

| Nhóm tương tác | Nội dung chính | Artifact |
|---|---|---|
| `S001-I001`–`S001-I017` | Đọc đề, lập cấu trúc, scope, environment, smoke evidence và quy trình Git/AI | Supporting documents, report baseline, smoke evidence và skills |
| `S001-I018`–`S001-I029` | Workflow A-FR03 | Spec, Domain Model, BVA, 38 test case, execution, defect/gap và closure |
| `S001-I030`–`S001-I036` | Reusable skills và workflow B-FR09 | Ba skills; 41 test case, execution, 9 defect và closure Pool B |
| `S001-I037`–`S001-I044` | Workflow C-FR14 | 48 test case, execution, 5 defect và closure Pool C |
| `S001-I045`–`S001-I055` | Workflow D-M09 và hoàn thiện Git | 50 test case, Expo Web execution, native iOS supplement, closure Pool D và Git log |

Nhật ký nguyên văn nằm tại `ai/prompt_log.md`, gồm 55 interaction và 3.454 dòng.
AI-02 ghi nhận 31 artifact: 30 `VALID`, 0 `INVALID`, 0 `INCOMPLETE` và
1 `PENDING HUMAN REVIEW` (`ART043`).

## 4. Cách kiểm chứng

- Kiểm tra Test ID liên tục và duy nhất cho cả bốn Pool.
- Đối chiếu từng result với test design và traceability matrix.
- Kiểm tra sự tồn tại của screenshot, Playwright trace, `results.json` và service log.
- Nhóm FAIL theo root cause; không mặc định một FAIL là một bug.
- Giữ BLOCKED tách khỏi confirmed defect.
- Kiểm tra source ở chế độ read-only và xác nhận thư mục `SHOP` không bị thay đổi.
- Render báo cáo bằng XeLaTeX và kiểm tra bảng, ảnh, caption cùng đường dẫn.

## 5. Kết quả audit

| Chỉ số | Kết quả |
|---|---:|
| AI interaction | 55 |
| Artifact được audit | 31 |
| VALID | 30 |
| INVALID | 0 |
| INCOMPLETE | 0 |
| PENDING | 1 |

Verdict `VALID` xác nhận artifact phản ánh đúng nguồn và evidence trong phạm vi
đã kiểm tra; verdict này không có nghĩa SUT hoạt động đúng. Kết quả chất lượng
vẫn giữ 42 FAIL, 80 BLOCKED và các residual risk đã nêu trong báo cáo.
