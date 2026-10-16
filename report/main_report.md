# HW02 — Domain Testing on EShop

**Sinh viên:** Nguyễn Phúc Hậu<br>
**MSSV:** 23120252<br>
**Lớp:** CQ2023/31<br>
**Môn học:** Kiểm thử phần mềm<br>
**SUT baseline:** `85af3ba875c88283615e22cb108f13e2fccaf0e9`

## 1. Phạm vi và phương pháp

Bài làm áp dụng Domain Testing, Equivalence Partitioning và Boundary Value
Analysis theo ISTQB CTFL v4.0.1, mục 4.2.1–4.2.2, cho bốn phạm vi:

| Pool | Feature | Nền tảng |
|---|---|---|
| A | `A-FR03` — Quên mật khẩu và đặt lại mật khẩu | Web |
| B | `B-FR09` — Discount Coupon | Web checkout |
| C | `C-FR14` — Quản lý danh mục | Admin Web |
| D | `D-M09` — Discount Coupon | Expo Web; bổ sung giới hạn trên thiết bị iOS thật |

Mỗi feature đi qua cùng một chuỗi: xác lập oracle → Domain Model → EP/BVA → test
case → automation/execution → defect/gap analysis → traceability và closure.
Source `SHOP` tại baseline canonical được kiểm tra read-only trong lúc phân tích
và thực thi. Sau đó cấu hình Mobile được nâng Expo SDK và đổi API endpoint để
thu evidence iOS bổ sung; thay đổi này không sửa các verdict baseline. Test
automation dùng Playwright và SQLite fixture cô lập; expected result không được
sửa theo hành vi hiện tại của SUT.

## 2. Pool A — A-FR03

Oracle chính gồm OTP sáu chữ số, form reset hai bước, password policy và các GUI
rule liên quan. Domain Model bao phủ email, OTP, password, confirm password,
token state và output state. BVA tập trung vào OTP length/value, password length,
character composition và quan hệ password/confirmation.

| Designed | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|
| 38 | 9 | 1 | 8 | 29 | 0 |

Tám FAIL được nhóm thành `A-BUG-001`–`A-BUG-008`. Hai rủi ro chính là OTP chỉ có
bốn chữ số và UI thiếu confirm password, làm 29 case không thể chạy đúng procedure.
Residual risk ở mức cao; feature chưa được xác nhận end-to-end.

Tài liệu chi tiết: `features/A/`; evidence: `evidence/A/`; bug report:
`bugs/A-FR03_bug_report.md`.

## 3. Pool B — B-FR09

Phân tích bao phủ năm điều kiện coupon C1–C5, percent/fixed formula, order
minimum, expiry, usage limit, trusted total, authentication và identity. Tám
boundary được dùng cho threshold, expiry, usage và discount value; các miền
thiếu rounding/cap/floor hoặc normalization oracle được giữ là gap.

| Designed | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|
| 41 | 31 | 17 | 14 | 10 | 0 |

Mười bốn FAIL được nhóm thành chín defect `B-BUG-001`–`B-BUG-009`. Các lỗi quan
trọng gồm sai percent formula, tin `total_amount` từ client, thiếu authentication
và tin `user_id` trong request body. Residual risk ở mức rất cao.

Tài liệu chi tiết: `features/B/`; evidence: `evidence/B/`; bug report:
`bugs/B-FR09_bug_report.md`.

## 4. Pool C — C-FR14

Domain Model mô hình hóa Category, Admin identity, category list, CRUD operation,
record existence và referenced products. BVA kiểm tra empty name, structural
length edge, category ID và referenced-category interaction mà không tự đặt
maximum length hoặc duplicate rule.

| Designed | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|
| 48 | 27 | 18 | 9 | 21 | 0 |

Chín FAIL được nhóm thành năm defect `C-BUG-001`–`C-BUG-005`. Rủi ro nghiêm trọng
nhất là authorization chỉ được kiểm tra ở login/UI, không được cưỡng chế đầy đủ
tại API và restored session. Update, invalid-ID response và delete referenced
category còn thiếu business oracle. Residual risk ở mức cao.

Tài liệu chi tiết: `features/C/`; evidence: `evidence/C/`; bug report:
`bugs/C-FR14_bug_report.md`.

## 5. Pool D — D-M09

Pool D tái sử dụng business oracle FR-09 nhưng thiết kế test riêng cho Mobile UI,
request state, loading/error/success, discount/final amount và network state.
Lần chạy chính thức dùng Expo Web, Chromium, viewport `440 × 956`. Ngoài baseline
này, 9 screenshot được chụp trên thiết bị iOS thật qua Expo Go/Expo SDK 57. Do
khác dependency và API config, bộ ảnh chỉ là evidence bổ sung và không đổi verdict.

| Designed | Executed | PASS | FAIL | BLOCKED | NOT RUN |
|---:|---:|---:|---:|---:|---:|
| 50 | 30 | 19 | 11 | 20 | 0 |

Mười một FAIL thuộc bảy root-cause group. Năm root cause Backend dẫn chiếu defect
Pool B; hai defect riêng Mobile là `D-BUG-001` và `D-BUG-002`. Ảnh iOS chứng minh
kết nối LAN và một số trạng thái UI/keyboard, nhưng chưa kiểm chứng Android,
rotation, accessibility, semantic/focus hoặc native automation. Residual risk rất cao.

Tài liệu chi tiết: `features/D/`; evidence: `evidence/D/`; bug report:
`bugs/D-M09_bug_report.md`.

## 6. Test summary

| Pool | Designed | Executed | PASS | FAIL | BLOCKED | NOT RUN | Defect mới |
|---|---:|---:|---:|---:|---:|---:|---:|
| A | 38 | 9 | 1 | 8 | 29 | 0 | 8 |
| B | 41 | 31 | 17 | 14 | 10 | 0 | 9 |
| C | 48 | 27 | 18 | 9 | 21 | 0 | 5 |
| D | 50 | 30 | 19 | 11 | 20 | 0 | 2 |
| **Tổng** | **177** | **97** | **55** | **42** | **80** | **0** | **24** |

Execution coverage là `97/177 = 54,80%`; tỷ lệ PASS trong case đã thực thi là
`55/97 = 56,70%`. Hai mươi bốn defect mới không đếm trùng năm Backend defect mà
Pool D dẫn chiếu từ Pool B.

## 7. Traceability và evidence

Mỗi Pool có ma trận liên kết requirement → partition → boundary → test case →
execution result → defect/gap → evidence. Các thư mục execution gồm 149
screenshot, 140 Playwright trace, bốn `results.json` và bốn service log; Pool D
có thêm 9 screenshot iOS thật. Smoke/native supplement nằm riêng và không được
dùng để thay đổi PASS/FAIL/BLOCKED của baseline.

## 8. AI Audit, Disclosure và Critique

- AI Audit Report: `ai/AI_Audit_Report.md`.
- AI Critique: `ai/AI_Critique.md`.
- AI Disclosure: `ai/AI_Disclosure.md`.
- Full prompt log: `ai/prompt_log.md`.
- Bản PDF của full prompt log: `ai/Full_AI_Prompt_Log.pdf`.
- Biểu mẫu audit: `ai/AI-02_AI_Audit_Report_Working.docx`.
- Biểu mẫu disclosure: `ai/AI-03_AI_Disclosure_Form_Working.docx`.

AI-02 có 34 artifact: 32 `VALID`, 0 `INVALID`, 1 `INCOMPLETE` và 1 `PENDING`.
`ART044` đã chuyển thành `VALID` sau khi bổ sung YouTube demo URL. Artifact chưa
hoàn chỉnh còn lại là AI-03 chưa có chữ ký cá nhân; chi tiết verdict nằm trong
AI-02. Verdict đánh giá artifact so với nguồn và evidence, không phải verdict
chất lượng SUT.

## 9. Self-assessment

| Tiêu chí | Điểm tối đa | Tự đánh giá |
|---|---:|---:|
| Feature A — Domain + Boundary | 25 | 20 |
| Feature B — Domain + Boundary | 25 | 22 |
| Feature C — Domain + Boundary | 25 | 21 |
| Feature D — Mobile Domain + Boundary | 15 | 11 |
| Agent Skills | 10 | 6 |
| **Tổng** | **100** | **80** |

Điểm tự đánh giá bị giới hạn bởi 80 case BLOCKED, 42 FAIL và native evidence mới
chỉ giới hạn ở 9 ảnh iOS.

Demo video: [KTPM - CQ2023/31 Demo AI skill đã dùng trong bài tập tuần
2](https://youtu.be/i2ECLTh1AEU). Thông tin liên kết được lưu tại
`demo/README.md`.

## 10. Kết luận

Workflow kiểm thử của bốn feature đã hoàn thành và có thể truy vết, nhưng không
feature nào được tuyên bố hoạt động đúng toàn bộ. Cần sửa defect, chốt các
requirement gap và chạy regression. Pool D đã có evidence trên một thiết bị iOS,
nhưng vẫn cần native test có kiểm soát trên iOS/Android và accessibility trước khi
đưa ra kết luận về chất lượng Mobile.

## 11. Tài liệu tham khảo

- International Software Testing Qualifications Board, *Certified Tester
  Foundation Level Syllabus v4.0.1*, 2024, mục 4.2.1–4.2.2:
  <https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf>.
- HCMUS Software Testing Course, *HW02 — Domain Testing Assignment*, 2026:
  `references/assignment/HW02_Domain_Testing_Assignment_En.pdf`.
