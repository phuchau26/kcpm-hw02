# Quy tắc Artifact Gate cho AI-02

Chỉ thêm một dòng AI-02 khi AI tạo mới hoặc thay đổi đáng kể artifact trực tiếp
phục vụ bài nộp HW02.

## Đạt gate

- File phân tích feature: spec, rule, domain, BVA, test case, human review, execution hoặc gap.
- Main report, chapter LaTeX, bảng tổng hợp, bug report hoặc traceability.
- Script kiểm thử, Agent Skill hoặc tài liệu demo được nộp cùng bài.
- Tài liệu tuân thủ AI được tạo/sửa nội dung: AI Audit, AI Disclosure, AI Critique hoặc prompt log có cấu trúc mới.
- Scope, environment, assumptions hoặc process document có nội dung được dùng trực tiếp trong bài.

Một artifact logic có thể gồm nhiều file. Ví dụ tạo một skill với `SKILL.md`, script
và reference vẫn chỉ ghi một dòng AI-02 nếu chúng được tạo trong cùng tương tác.

## Không đạt gate

- Chỉ trả lời câu hỏi, giải thích khái niệm hoặc đề xuất bước tiếp theo mà không tạo/sửa artifact.
- Chỉ đọc file, tìm kiếm source, báo trạng thái hoặc chẩn đoán.
- Chỉ di chuyển/đổi tên file mà không tạo nội dung liên quan đến bài.
- Chỉ chạy Git status, stage, commit, xuất Git log hoặc thao tác repository.
- Output tạm, cache, file build, bản kiểm tra hoặc dữ liệu không được dùng trong bài nộp.

## Ánh xạ cột AI-02

| Cột | Nội dung |
|---|---|
| Prompt + Tool | Artifact ID, công cụ, model, thời gian thật nếu có và prompt nguyên văn hoặc tham chiếu rõ đến interaction chứa prompt nguyên văn |
| AI Output | Đường dẫn artifact, nội dung AI tạo/sửa và interaction chứa full output |
| Verdict | `VALID`, `INVALID`, `INCOMPLETE` do sinh viên quyết định; nếu chưa review dùng `PENDING HUMAN REVIEW` |
| Reasoning (ISTQB) | Lý do review có nguồn; không bịa trích dẫn hoặc section |
| Student Fix | Nội dung sinh viên sửa; dùng `Chưa có` khi đang chờ review |

Không tính dòng `PENDING HUMAN REVIEW` vào Accuracy Summary. Trước khi nộp, mọi
dòng pending phải được sinh viên review và chuyển thành verdict hợp lệ.
