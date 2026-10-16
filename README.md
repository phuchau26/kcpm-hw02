# HW02 — Domain Testing

## Thông tin bài làm

| Thuộc tính | Nội dung |
|---|---|
| Sinh viên | Nguyễn Phúc Hậu |
| MSSV | 23120252 |
| Phạm vi | FR-03 Forgot/Reset Password; FR-09 Discount Coupon trên Web; FR-14 Category CRUD; FR-09 Discount Coupon trên Mobile |
| Kỹ thuật chính | Domain Testing, Equivalence Partitioning, Boundary Value Analysis, Playwright automation và SQLite fixture |

Repository này chứa toàn bộ source tài liệu, automation và evidence dùng để tạo gói nộp HW02. Source của hệ thống `SHOP` không nằm trong gói nộp này.

## Test summary

| Pool | Feature | Designed | Executed | PASS | FAIL | BLOCKED | NOT RUN | Bug mới |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| A | FR-03 — Forgot/Reset Password (Web) | 38 | 9 | 1 | 8 | 29 | 0 | 8 |
| B | FR-09 — Discount Coupon (Web) | 41 | 31 | 17 | 14 | 10 | 0 | 9 |
| C | FR-14 — Category CRUD (Admin Web) | 48 | 27 | 18 | 9 | 21 | 0 | 5 |
| D | FR-09 — Discount Coupon (Mobile) | 50 | 30 | 19 | 11 | 20 | 0 | 2 |
| **Tổng** |  | **177** | **97** | **55** | **42** | **80** | **0** | **24** |

- Execution coverage: `97/177 = 54,80%`.
- Tỷ lệ PASS trên các test case đã thực thi: `55/97 = 56,70%`.
- `Executed = PASS + FAIL`; `BLOCKED` được tách riêng khỏi test case đã có verdict.
- Cột “Bug mới” chỉ đếm defect duy nhất. Pool D còn dẫn chiếu 5 defect Backend đã được ghi nhận tại Pool B nên không đếm lại.
- Cả bốn workflow kiểm thử đã hoàn thành, nhưng chưa feature nào được kết luận hoạt động đúng toàn bộ vì vẫn còn FAIL hoặc BLOCKED.

## Self-assessment

| Tiêu chí | Điểm tối đa | Tự đánh giá |
|---|---:|---:|
| Feature A — Domain + Boundary | 25 | 20 |
| Feature B — Domain + Boundary | 25 | 22 |
| Feature C — Domain + Boundary | 25 | 21 |
| Feature D — Mobile Domain + Boundary | 15 | 11 |
| Agent Skills | 10 | 6 |
| **Tổng** | **100** | **80** |

Điểm tự đánh giá bị giới hạn bởi 80 test case BLOCKED, 42 test case FAIL và native evidence mới giới hạn ở 9 ảnh trên một thiết bị iOS.

## Demo video

**Trạng thái: đã cung cấp.**

- [KTPM - CQ2023/31 Demo AI skill đã dùng trong bài tập tuần 2](https://youtu.be/i2ECLTh1AEU)
- [Thông tin demo trong gói nộp](demo/README.md)

## Báo cáo và tài liệu quan trọng

- [Báo cáo chính — Markdown](report/main_report.md)
- [Báo cáo chính — PDF](report/latex/main.pdf)
- [Phạm vi kiểm thử](supporting/scope.md)
- [Môi trường kiểm thử](supporting/environment.md)
- [Git commit log](git_log.txt)
- [AI Audit Report](ai/AI_Audit_Report.md)
- [AI Critique](ai/AI_Critique.md)
- [AI Disclosure](ai/AI_Disclosure.md)
- [Full AI Prompt Log](ai/prompt_log.md)
- [Demo video](demo/README.md)
- [AI-02 Working Form](ai/AI-02_AI_Audit_Report_Working.docx)
- [AI-03 Working Form](ai/AI-03_AI_Disclosure_Form_Working.docx)

## Tài liệu theo feature

| Pool | Feature artifacts | Execution result | Traceability | Feature closure | Bug report |
|---|---|---|---|---|---|
| A | [features/A](features/A/) | [Step 5](features/A/05_execution_results.md) | [Matrix](features/A/07_traceability_matrix.md) | [Closure](features/A/07_feature_closure.md) | [A-FR03](bugs/A-FR03_bug_report.md) |
| B | [features/B](features/B/) | [Step 5](features/B/05_execution_results.md) | [Matrix](features/B/07_traceability_matrix.md) | [Closure](features/B/07_feature_closure.md) | [B-FR09](bugs/B-FR09_bug_report.md) |
| C | [features/C](features/C/) | [Step 5](features/C/05_execution_results.md) | [Matrix](features/C/07_traceability_matrix.md) | [Closure](features/C/07_feature_closure.md) | [C-FR14](bugs/C-FR14_bug_report.md) |
| D | [features/D](features/D/) | [Step 5](features/D/05_execution_results.md) | [Matrix](features/D/07_traceability_matrix.md) | [Closure](features/D/07_feature_closure.md) | [D-M09](bugs/D-M09_bug_report.md) |

## Cấu trúc thư mục

- `features/A`–`features/D`: đặc tả, Domain Model, BVA, test case, execution result, gap analysis, traceability và feature closure.
- `automation/`: Playwright runner và SQLite fixture cho từng feature.
- `evidence/A`–`evidence/D`: screenshot, trace, service log, `results.json` và native evidence.
- `bugs/`: bug report được nhóm theo root cause.
- `report/`: báo cáo Markdown và source LaTeX.
- `ai/`: AI audit, critique, disclosure, prompt log và biểu mẫu bắt buộc.
- `skills/`: các Agent Skills được xây dựng và sử dụng trong bài.
- `demo/`: tài liệu và liên kết demo video.
- `supporting/`: scope, environment và tài liệu hỗ trợ.

Không đưa secret, token, file `.env`, runtime database, dependency, build tạm, evidence giả hoặc toàn bộ source `SHOP` vào gói nộp.
