---
name: hw02-step-commit
description: Review, stage, and commit exactly one completed HW02 testing step inside the submission-src Git repository. Use when the user asks to commit current HW02 work or create the required per-step Git history; do not use for the instructor-provided SHOP repository or for push, amend, squash, reset, or history rewriting.
---

# HW02 Step Commit

Tạo một commit có phạm vi hẹp, có thể giải thích được và tương ứng với một thay
đổi thật trong quy trình HW02.

## Ranh giới repository

- Git repository của bài làm phải là thư mục chứa skill này ở cấp `submission-src/`.
- Không khởi tạo hoặc commit tại thư mục `HW2/` nếu việc đó làm `SHOP/` trở thành một phần của repo bài làm.
- Không sửa, stage hoặc commit repo lồng `SHOP/`.
- Không `push`, `amend`, `rebase`, `squash`, `reset` hoặc xóa lịch sử nếu người dùng không yêu cầu rõ.

## Trình tự

1. Xác định Git root bằng `git rev-parse --show-toplevel`. Nếu chưa có repo, thông báo và chỉ chạy `git init` khi yêu cầu hiện tại cho phép tạo repo.
2. Kiểm tra `git status --short`, diff chưa stage và diff đã stage. Giữ nguyên thay đổi không liên quan của người dùng.
3. Xác định đúng feature và bước đang hoàn thành. Quy trình chuẩn gồm:
   - bước 1: spec và test oracle;
   - bước 2: mô hình domain;
   - bước 3: Boundary Value Analysis;
   - bước 4: test case và human review;
   - bước 5: thực thi và evidence;
   - bước 6: bug và AI gap;
   - bước 7: khóa báo cáo feature và traceability.
4. Nếu có skill `hw02-ai-session-log`, dùng nó để ghi tương tác hiện tại trước khi stage, nhưng không thêm AI-02 chỉ vì thực hiện thao tác Git.
5. Chạy kiểm tra phù hợp với file thay đổi. Không tuyên bố test đã chạy nếu chỉ kiểm tra nội dung hoặc diff.
6. Stage bằng đường dẫn tường minh chỉ các file thuộc bước hiện tại. Không dùng `git add .` hoặc `git add -A`.
7. Xem lại `git diff --cached --check` và `git diff --cached --stat`. Dừng nếu có secret, `.env`, token, cache, `node_modules`, database chạy thử, file build LaTeX tạm hoặc ZIP cuối.
8. Tạo commit, sau đó kiểm tra `git status --short` và `git show --stat --oneline -1`.

## Quy tắc commit

- Commit theo bước hoàn thành, không theo số phút.
- Không tạo empty commit. Nếu một bước không tìm thấy bug, tài liệu review/gap thật vẫn có thể là thay đổi của bước 6.
- Không gom nhiều bước độc lập của nhiều feature vào một commit chỉ để giảm số commit.
- Có thể commit file dùng chung cùng bước khi thay đổi đó trực tiếp phục vụ bước đang làm, ví dụ `prompt_log.md`, report chapter hoặc traceability.

Mẫu commit message:

```text
test(A-FR03): step 1 establish spec and oracle
test(A-FR03): step 2 model input domains
test(A-FR03): step 3 derive boundary cases
test(A-FR03): step 4 review and finalize test cases
test(A-FR03): step 5 record execution evidence
test(A-FR03): step 6 record defects and AI gaps
docs(A-FR03): step 7 finalize feature report
```

Đổi scope thành `B-FR09`, `C-FR14` hoặc `D-M09` tương ứng. Với thay đổi chung,
dùng prefix phù hợp như `docs`, `chore` hoặc `skill` và mô tả đúng nội dung.

## Kết quả trả về

Báo cáo commit hash, commit message, danh sách file đã commit, kiểm tra đã chạy và
các thay đổi còn lại chưa commit. Không nói working tree sạch nếu vẫn còn file khác.
