---
name: hw02-ai-session-log
description: Record an HW02 AI interaction in the chronological Markdown prompt log and conditionally update the working AI-02 audit form only when AI creates or materially changes a direct submission artifact. Use for HW02 prompt logging, AI audit recording, or artifact-producing AI work; do not add AI-02 rows for advice-only, status-only, inspection-only, or Git-only interactions.
---

# HW02 AI Session Log

Giữ hai lớp bằng chứng riêng:

1. `ai/prompt_log.md` ghi mọi tương tác AI dùng trong quá trình làm HW02.
2. `ai/AI-02_AI_Audit_Report_Working.docx` chỉ ghi tương tác đủ điều kiện tạo
   artifact trực tiếp cho bài nộp.

## Ghi prompt log

- Ghi công cụ, model, reasoning effort, ngày giờ và múi giờ nếu có thật. Không tự dựng timestamp.
- Model mặc định của phiên hiện tại là `gpt-5.6-sol`, reasoning effort `medium`; cập nhật nếu người dùng cho biết model đã đổi.
- Ghi prompt nguyên văn và final AI response nguyên văn. Không đưa system/developer instructions, hidden reasoning hoặc tool trace vào prompt của sinh viên.
- Dùng mã tương tác kế tiếp `S001-Ixxx` và Artifact ID kế tiếp nếu có artifact.
- Để ghi final response nguyên văn, soạn phản hồi cuối, chèn chính phản hồi đó vào log, rồi gửi cùng nội dung cho người dùng.
- Không sửa các prompt/output cũ trừ khi đang sửa lỗi chép sai và phải ghi chú việc sửa.

## Quyết định có cập nhật AI-02 hay không

Khi tương tác tạo hoặc thay đổi file, đọc
[references/ai02-policy.md](references/ai02-policy.md) và áp dụng artifact gate.

- Nếu không đạt gate: chỉ cập nhật `prompt_log.md`; ghi `AI-02: Không áp dụng` trong metadata hoặc human review.
- Nếu đạt gate: bảo đảm có bản working AI-02 rồi thêm đúng một dòng cho artifact. Không thêm nhiều dòng chỉ vì một artifact có nhiều file phụ trợ.
- Không chỉnh bản gốc `ai/forms/AI-02_AI_Audit_Report_En.docx`.
- Nếu chưa có verdict của sinh viên, ghi `PENDING HUMAN REVIEW`; không tự gán `VALID`, `INVALID` hoặc `INCOMPLETE`.
- Khi sinh viên đã review, cập nhật chính dòng có Artifact ID đó thay vì thêm dòng trùng.

## Làm việc với AI-02

Bản working mặc định:

```text
ai/AI-02_AI_Audit_Report_Working.docx
```

Nếu chưa tồn tại, sao chép từ:

```text
ai/forms/AI-02_AI_Audit_Report_En.docx
```

Dùng script sau để thêm hoặc cập nhật dòng:

```powershell
powershell -ExecutionPolicy Bypass -File skills/hw02-ai-session-log/scripts/update_ai02.ps1 `
  -AuditDocx ai/AI-02_AI_Audit_Report_Working.docx `
  -ArtifactId ART013 `
  -PromptTool "Tool: OpenAI Codex; Time: ...; Prompt: ..." `
  -AiOutput "Artifact/path và tóm tắt output; full output: S001-Ixxx" `
  -Verdict "PENDING HUMAN REVIEW" `
  -Reasoning "Chờ sinh viên đối chiếu yêu cầu/ISTQB" `
  -StudentFix "Chưa có"
```

Script cập nhật dòng có cùng Artifact ID nếu đã tồn tại, nếu không sẽ dùng dòng
artifact trống tiếp theo. Script tự cập nhật thống kê chỉ với các verdict đã review.

## Kiểm tra trước khi kết thúc

- Xác nhận prompt log chỉ có một entry mới và không làm hỏng Markdown fence.
- Nếu cập nhật AI-02, xác nhận file `.docx` mở được và Artifact ID xuất hiện đúng một lần.
- Báo rõ interaction có vào AI-02 hay không, lý do, Artifact ID và trạng thái human review.
