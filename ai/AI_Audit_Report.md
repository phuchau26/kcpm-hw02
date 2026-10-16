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
| Phạm vi log | `S001-I001`–`S001-I061` |

## 2. Phạm vi sử dụng AI

AI được dùng để hỗ trợ đọc và hệ thống hóa đặc tả, lập Domain Model, chia
Equivalence Partition, xác định boundary, thiết kế test case, tạo Playwright
automation, tổng hợp execution result, nhóm defect theo root cause, lập
traceability matrix và soạn báo cáo. Trong canonical analysis/execution, source
baseline được giữ read-only. Sau đó AI hỗ trợ nâng Expo SDK và cấu hình API
endpoint cho evidence iOS bổ sung; thay đổi này không sửa verdict baseline. AI
không được dùng để sửa expected result nhằm ép test PASS hoặc tạo evidence giả.

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
| `S001-I045`–`S001-I061` | Workflow D-M09 và hoàn thiện hồ sơ nộp | 50 test case, Expo Web execution, native iOS supplement, closure Pool D, Git log, README, biểu mẫu AI, consistency/citation và demo video |

Nhật ký nguyên văn nằm tại `ai/prompt_log.md`, gồm 61 interaction. AI-02 ghi nhận
34 artifact: 32 `VALID`, 0 `INVALID`, 1 `INCOMPLETE` và 1 `PENDING HUMAN REVIEW`.
`ART044` đã chuyển thành `VALID` sau khi bổ sung YouTube demo URL. Artifact chưa
hoàn chỉnh còn lại là `ART045` (AI-03 cần xác nhận category và chữ ký cá nhân).
Một artifact còn trạng thái `PENDING HUMAN REVIEW`; chi tiết nằm trong AI-02.

## 4. Cách kiểm chứng

- Kiểm tra Test ID liên tục và duy nhất cho cả bốn Pool.
- Đối chiếu từng result với test design và traceability matrix.
- Kiểm tra sự tồn tại của screenshot, Playwright trace, `results.json` và service log.
- Nhóm FAIL theo root cause; không mặc định một FAIL là một bug.
- Giữ BLOCKED tách khỏi confirmed defect.
- Kiểm tra source baseline ở chế độ read-only trong quá trình phân tích/execution;
  cấu hình Mobile chỉ được thay đổi sau đó để nâng Expo SDK và dùng API endpoint
  LAN cho evidence iOS bổ sung, không thay verdict canonical.
- Render báo cáo bằng XeLaTeX và kiểm tra bảng, ảnh, caption cùng đường dẫn.

## 5. Kết quả audit

| Chỉ số | Kết quả |
|---|---:|
| AI interaction | 61 |
| Artifact được audit | 34 |
| VALID | 32 |
| INVALID | 0 |
| INCOMPLETE | 1 |
| PENDING | 1 |

Verdict `VALID` xác nhận artifact phản ánh đúng nguồn và evidence trong phạm vi
đã kiểm tra; verdict này không có nghĩa SUT hoạt động đúng. Kết quả chất lượng
vẫn giữ 42 FAIL, 80 BLOCKED và các residual risk đã nêu trong báo cáo.
