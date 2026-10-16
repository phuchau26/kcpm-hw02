# Full AI Prompt Log — HW02 Domain Testing

## Session metadata

| Field | Value |
|---|---|
| AI tool | OpenAI Codex |
| Model | `gpt-5.6-sol` |
| Reasoning effort | `medium` |
| User-provided model label | `codex gpt-5.6 sol medium` |
| Session date | 2026-10-09 |
| Time zone | Asia/Saigon (`UTC+07:00`) |
| Log created | 2026-10-09T08:52:52+07:00 |
| Log scope | User task prompts and final user-visible AI responses in this HW02 session |

> Timestamp integrity: the interface did not expose exact timestamps for the first
> three interactions. Their date, chronological order, and session time zone are
> recorded, but their clock time is marked unavailable rather than reconstructed.
> Platform system/developer instructions, hidden reasoning, tool calls, and collapsed
> progress messages are not treated as student prompts or final AI outputs.

---

## S001-I001 — Review the assignment and three-day plan

| Field | Value |
|---|---|
| Date | 2026-10-09 |
| Exact time | Not available from conversation metadata |
| AI tool | OpenAI Codex |
| Model / effort | `gpt-5.6-sol` / `medium` |
| Artifact IDs | ART001 — assignment/plan review |

### User prompt — verbatim

````text
bạn hãy đọc đề bài là file [2026.HW02.Domain Testing\_En.pdf](<2026.HW02.Domain Testing_En.pdf>)  và kế hoạch của tôi là file [HW02\_Ke\_hoach\_3\_ngay.html](HW02_Ke_hoach_3_ngay.html) sau đó cho biết kế hoạch có khả thi không, và bước đầu tiên sau khi đã chia feature là làm gì
````

### Final AI response — verbatim

````markdown
Mình đã đối chiếu [đề bài](<D:/HCMUS/KCPM/HW2/2026.HW02.Domain Testing_En.pdf>) với [kế hoạch 3 ngày](D:/HCMUS/KCPM/HW2/HW02_Ke_hoach_3_ngay.html).

## Kết luận

Kế hoạch **đúng yêu cầu và có cấu trúc tốt**, nhưng mốc **10 giờ khá căng**. Nó khả thi khi:

- Cả Web và Mobile đã có hướng dẫn cài đặt rõ ràng.
- Bốn feature có đặc tả và biên đầu vào tương đối rõ.
- Bạn tái sử dụng biểu mẫu/quy trình giữa các feature.
- Không mất nhiều thời gian xử lý lỗi môi trường.

Thực tế nên dự trù khoảng **11–12 giờ**, vì 600 phút hiện được phân bổ hết hoàn toàn, chưa tính nghỉ, chuyển ngữ cảnh, upload video hoặc xử lý lỗi.

Các mốc dễ vỡ nhất:

- **30 phút dựng cả Web và Mobile**: thường không đủ nếu phải cài dependency, database, seed và emulator.
- **55–65 phút cho mỗi feature**: rất gấp vì phải phân tích Domain, BVA, review AI, chạy test, chụp evidence, báo bug và commit từng bước.
- **35 phút hoàn thiện skill và quay/upload demo**: upload YouTube hoặc quay lại video có thể vượt thời gian.
- **40 phút lắp toàn bộ báo cáo, xuất PDF và tạo ZIP**: chỉ khả thi nếu đã cập nhật báo cáo ngay trong lúc test.
- Pool D không được đề bài liệt kê chi tiết nên có nguy cơ chọn sai hoặc thiếu đặc tả.

Ngoài ra, kế hoạch dẫn thêm sáu biểu mẫu AI và một số quy định như “AI không được viết bug report”. Các nội dung đó **không xuất hiện trong PDF đề bài đang có**, nên cần kiểm tra chúng đúng là tài liệu chính thức của môn trước khi coi là yêu cầu bắt buộc.

## Bước đầu tiên sau khi chia feature

Đừng bắt đầu bằng việc nhờ AI sinh test case. Bước kiểm thử đầu tiên là:

> **Chốt đặc tả và test oracle cho từng feature.**

Trước tiên, hãy làm một feature mẫu—nên là feature Pool A có đặc tả rõ nhất:

1. Xác nhận chính xác mã và tên của cả bốn feature; đặc biệt feature D phải là Mobile hợp lệ và không trùng thành viên khác.
2. Ghi phiên bản/commit/build SUT sẽ kiểm thử.
3. Đọc README, đặc tả, slide và tài liệu Moodle liên quan.
4. Với feature A, lập bảng:

| Thành phần | Cần ghi |
|---|---|
| Input | Tên trường/tham số |
| Kiểu và đơn vị | Integer, string, ngày, tiền… |
| Điều kiện bắt buộc | Required, optional, phụ thuộc trường khác |
| Miền hợp lệ | Khoảng, độ dài, tập giá trị, định dạng |
| Biên | Min/max, đóng/mở, bước δ |
| Expected result | Hệ thống phải chấp nhận/từ chối hoặc thay đổi gì |
| Nguồn | README, requirement, slide, UI contract… |
| Chưa rõ | Câu hỏi hoặc giả định cần xác nhận |

Đầu ra nên là `01_spec.md`. Sau đó mới:

- Mô hình hóa các miền hợp lệ/không hợp lệ.
- Xác định các điểm biên.
- Chuyển chúng thành test case chạy được.

Vì bài bắt buộc ghi AI Audit, **trước khi tiếp tục dùng AI**, bạn cũng nên mở ngay `prompt_log.md` và ghi lại phiên trao đổi hiện tại: công cụ, ngày giờ, prompt và output. Đây là bước quản lý cần làm song song ngay từ đầu.

Tóm lại: **chia feature → xác nhận phạm vi/Pool D → mở AI log → phân tích spec và oracle của feature A**. Đây là trình tự an toàn nhất.
````

### Human review

- Status: Pending student review.
- Important limitation: the response inferred feasibility from the supplied assignment and plan; it did not verify Moodle, lecture slides, or the Mobile feature list.

---

## S001-I002 — Organize HW2 and reuse the HW1 LaTeX template

| Field | Value |
|---|---|
| Date | 2026-10-09 |
| Exact time | Not available from conversation metadata |
| AI tool | OpenAI Codex |
| Model / effort | `gpt-5.6-sol` / `medium` |
| Artifact IDs | ART002 — workspace structure; ART003 — LaTeX template |

### User prompt — verbatim

````text
hiện tại tôi cần bạn dựa vào file đề xuất và cấu trúc thư mục làm việc trong [HW2](HW2/) cho tôi, trong đó hiện tại đã có file đề, file kế hoạch, thư mục mã nguồn bao gồm các nền tảng mà giáo viên cung cấp. Bạn vào [HW1](HW1/) chép template báo cáo latex vào thư mục HW2 cho tôi, chỉ chép và ghi nhớ tempate chứ không cần chép toàn bộ nội dung. Bạn có thể đổi tên các file hiện tại để có cấu trúc hơn.
````

### Final AI response — verbatim

````markdown
Đã tổ chức lại workspace HW2 và tạo bộ khung LaTeX.

Cấu trúc chính:

```text
HW2/
├── README.md
├── references/
│   ├── assignment/
│   │   └── HW02_Domain_Testing_Assignment_En.pdf
│   └── planning/
│       └── HW02_Three_Day_Plan.html
├── SHOP/                         # Mã nguồn giảng viên, giữ nguyên repo
└── submission-src/
    ├── README.md
    ├── report/latex/
    │   ├── main.tex
    │   ├── preamble.tex
    │   ├── references.bib
    │   ├── chapters/
    │   ├── appendix/
    │   └── figures/logo/
    ├── features/A, B, C, D
    ├── evidence/A, B, C, D
    ├── bugs/
    ├── ai/raw/
    ├── skills/
    ├── demo/
    ├── supporting/
    └── scripts/
```

Các điểm đáng chú ý:

- Đề và kế hoạch đã được đổi tên, chuyển vào `references/`.
- Chỉ sao chép kiến trúc trình bày từ HW1: `preamble`, logo, cấu trúc `main.tex`, chapter và appendix.
- Không sao chép nội dung báo cáo, tên sinh viên, test case, defect, ảnh cá nhân hay evidence của HW1.
- Template đã được đổi sang HW02 và chia sẵn chương cho bốn feature, AI gap, bug report, audit, critique, summary và self-assessment.
- Đã biên dịch thử thành công bằng XeLaTeX; các file build thử sau đó đã được xóa để workspace sạch.
- `SHOP` vẫn giữ nguyên vị trí vì `.git` của repo lồng được bảo vệ. Các thay đổi có sẵn trong `database.sqlite` và `node_modules` không bị chỉnh sửa.

Các file bắt đầu làm việc:

- [README workspace](D:/HCMUS/KCPM/HW2/README.md)
- [Hướng dẫn submission-src](D:/HCMUS/KCPM/HW2/submission-src/README.md)
- [LaTeX main.tex](D:/HCMUS/KCPM/HW2/submission-src/report/latex/main.tex)
- [LaTeX preamble.tex](D:/HCMUS/KCPM/HW2/submission-src/report/latex/preamble.tex)
- [Hướng dẫn biên dịch](D:/HCMUS/KCPM/HW2/submission-src/report/latex/README.md)

Mình sẽ tiếp tục dùng cấu trúc và phong cách LaTeX này cho các phần báo cáo HW2 tiếp theo.
````

### Human review

- Status: Pending student review.
- Changes made: local workspace files were reorganized; a content-free HW02 LaTeX skeleton was created and compile-checked.
- Preserved state: the nested `SHOP` repository and its existing local changes were not modified.

---

## S001-I003 — Identify the first task for assigned features

| Field | Value |
|---|---|
| Date | 2026-10-09 |
| Exact time | Not available from conversation metadata |
| AI tool | OpenAI Codex |
| Model / effort | `gpt-5.6-sol` / `medium` |
| Artifact IDs | ART004 — feature-scope guidance |

### User prompt — verbatim

````text
# Context from my IDE setup:

## Open tabs:
- README.md: HW2/README.md
- README.md: HW2/submission-src/README.md

## My request:
tôi được phân công làm 3, 9, 14 và pool là làm tính năng 9 với mobile, bước đầu tiên nên làm gì theo file kế hoạch
````

### Final AI response — verbatim

````markdown
Theo kế hoạch, bước đầu tiên là **D1-01 — Khóa phạm vi và kiểm tra yêu cầu**, chưa vội viết test case.

Phân công của bạn hiện được hiểu là:

| Pool | Feature |
|---|---|
| A | FR-03 — Forgot password/password reset |
| B | FR-09 — Discount coupons |
| C | FR-14 — Category management CRUD |
| D | Mobile feature số 9 — cần xác nhận tên và đặc tả chính thức |

Việc cần làm ngay:

1. Xác nhận với nhóm bốn feature trên không trùng thành viên khác.
2. Xác nhận “Mobile 9” là feature nào, thuộc build/app nào; không nhầm với FR-09 của Web.
3. Tìm nguồn yêu cầu cho từng feature: `README.md`, `api_specification.md`, giao diện, tài liệu Mobile hoặc Moodle.
4. Ghi vào `submission-src/supporting/scope.md`:

```md
| Pool | Feature ID | Feature name | Platform | Requirement source | Confirmed |
|------|------------|--------------|----------|--------------------|-----------|
| A | FR-03 | Forgot/reset password | Web | ... | Yes/No |
| B | FR-09 | Discount coupons | Web | ... | Yes/No |
| C | FR-14 | Category CRUD | Admin Web | ... | Yes/No |
| D | Mobile-09 | [Tên chính xác] | Mobile | ... | Yes/No |
```

5. Những điểm chưa rõ—đặc biệt Mobile 9—ghi vào `submission-src/supporting/assumptions.md`, không tự đoán.
6. Trước khi tiếp tục dùng AI, mở `submission-src/ai/prompt_log.md` và ghi lại các phiên AI, bao gồm cuộc trao đổi này.

Điều kiện để hoàn thành bước đầu tiên:

- Có đủ bốn feature thuộc bốn pool.
- Không trùng phân công.
- Biết chính xác tên và phạm vi Mobile 9.
- Có nguồn yêu cầu cho từng feature.
- Biết deadline Moodle và tài liệu phải nộp.

Sau đó mới sang bước kỹ thuật đầu tiên: chọn FR-03 làm feature mẫu, lập `01_spec.md` để trích xuất input, rule, miền hợp lệ, biên và expected result. Chưa nên yêu cầu AI sinh test case trước khi hoàn tất spec và oracle.
````

### Human review

- Status: Pending student review.
- Assumption requiring confirmation: “3, 9, 14 and Mobile 9” was interpreted as FR-03, FR-09, FR-14, and the ninth feature in the Mobile pool.

---

## S001-I004 — Place AI-02/AI-03 and create the complete prompt log

| Field | Value |
|---|---|
| Date | 2026-10-09 |
| Time | Started before log creation; completion recorded at 08:52:52+07:00 or later |
| AI tool | OpenAI Codex |
| Model / effort | `gpt-5.6-sol` / `medium` |
| Artifact IDs | ART005 — AI forms organization; ART006 — prompt log |

### User prompt — verbatim

````text
# Context from my IDE setup:

## Open tabs:
- README.md: HW2/README.md
- README.md: HW2/submission-src/README.md

## My request:
vì bài làm có sử dụng AI nên phải có 2 file là AI02 và AI03, bạn di chuyển chúng vào đúng nơi đi sau đó tạo thêm file prompt log md và thêm toàn bộ các prompt từ đầu đến giờ vào đó với thông tin đầy đủ, model tôi sử dụng là codex gpt-5.6 sol medium
````

### Final AI response — recorded at completion

````markdown
Đã hoàn tất:

- AI-02 và AI-03 đã được chuyển vào `submission-src/ai/forms/` và đổi tên gọn; nội dung biểu mẫu được giữ nguyên.
- Đã tạo `submission-src/ai/prompt_log.md` với bốn tương tác từ đầu phiên, gồm prompt nguyên văn, output cuối, công cụ, model `gpt-5.6-sol`, reasoning `medium`, ngày, múi giờ, artifact ID và ghi chú human review.
- Giờ chính xác của ba lượt đầu không có trong metadata giao diện nên được ghi rõ là không khả dụng, không tự dựng timestamp.
- Đã tạo `submission-src/ai/README.md` để quy định vị trí biểu mẫu, log và raw transcript.

Hai biểu mẫu và prompt log đã được kiểm tra tồn tại đúng vị trí. Các file AI-02/AI-03 gốc ở thư mục HW2 đã được di chuyển, không để bản trùng ở thư mục gốc.
````

### Human review

- Status: Pending student review.
- Student action: verify that the verbatim prompts/responses match the visible conversation and update the official AI-02/AI-03 forms with personal/course information before submission.

---

## S001-I005 — Define the assigned feature scope

| Field | Value |
|---|---|
| Date | 2026-10-09 |
| Time | 09:00:33+07:00 or earlier; exact prompt receipt time is not exposed |
| AI tool | OpenAI Codex |
| Model / effort | `gpt-5.6-sol` / `medium` |
| Artifact IDs | ART007 — `supporting/scope.md`; ART008 — prompt-log update |

### User prompt — verbatim

````text
# Context from my IDE setup:

## Open tabs:
- prompt_log.md: HW2/submission-src/ai/prompt_log.md
- README.md: HW2/README.md
- README.md: HW2/submission-src/README.md

## My request:
&#x20;bạn tạo file scope cho tôi là tôi thực hiện các chức năng được nếu, đối với mobile tôi thực hiện feat 9 là discount coupon nhưng test trên mobile
````

### Final AI response — recorded at completion

````markdown
Đã tạo [scope.md](D:/HCMUS/KCPM/HW2/submission-src/supporting/scope.md) cho bốn phạm vi:

- Pool A: FR-03 — Forgot password/password reset.
- Pool B: FR-09 — Discount Coupon trên Web checkout.
- Pool C: FR-14 — Category Management.
- Pool D: Mobile Feature 9 — Discount Coupon, thực thi và lấy evidence riêng trên ứng dụng Mobile.

File đã ghi rõ phần bao gồm/loại trừ, nguồn yêu cầu, commit SUT, sự khác nhau giữa Web FR-09 và Mobile Feature 9, cùng các điểm cần xác nhận. Đáng chú ý: README gọi FR-14 là CRUD nhưng chỉ mô tả Add/View/Delete; Mobile có implementation coupon nhưng vẫn cần lưu bằng chứng từ danh sách phân công hoặc Moodle rằng đây là feature hợp lệ của Pool D.

Lượt yêu cầu này cũng đã được thêm vào [prompt_log.md](D:/HCMUS/KCPM/HW2/submission-src/ai/prompt_log.md) dưới mã `S001-I005`.
````

### Human review

- Status: Pending student review.
- Student-confirmed allocation: FR-03, FR-09, FR-14, and Mobile Feature 9 — Discount Coupon.
- Required follow-up: attach evidence of group non-duplication and the official Pool D feature mapping.

---

## S001-I006 — Chuyển tài liệu phạm vi sang tiếng Việt

| Trường thông tin | Giá trị |
|---|---|
| Ngày | 2026-10-09 |
| Thời gian | Không có timestamp chính xác từ giao diện |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART009 — bản tiếng Việt của `supporting/scope.md`; ART010 — cập nhật prompt log |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- scope.md: HW2/submission-src/supporting/scope.md
- prompt_log.md: HW2/submission-src/ai/prompt_log.md
- README.md: HW2/README.md
- README.md: HW2/submission-src/README.md

## My request:
viết bằng tiếng việt, chỉ giữ lại những thuật ngữ chuyên ngành là tiếng anh thôi
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Đã chuyển toàn bộ [scope.md](D:/HCMUS/KCPM/HW2/submission-src/supporting/scope.md) sang tiếng Việt.

- Giữ nguyên bốn feature, mã phạm vi, commit SUT và các cảnh báo cần xác nhận.
- Chỉ giữ tiếng Anh cho thuật ngữ chuyên ngành như `Domain Testing`, `Boundary Value Analysis`, `SUT`, `test oracle`, `expected result`, `Web`, `Mobile`, `API`, `CRUD`, `implementation`, `evidence` và `prompt log`.
- Không thay đổi nội dung phân công hoặc tự xác nhận các mục vẫn đang chờ bằng chứng.

Yêu cầu này đã được ghi tiếp vào [prompt_log.md](D:/HCMUS/KCPM/HW2/submission-src/ai/prompt_log.md) với mã `S001-I006`.
````

### Human review

- Trạng thái: Chờ sinh viên kiểm tra.
- Cần kiểm tra: cách dùng thuật ngữ tiếng Anh có phù hợp với slide và quy ước của môn học hay không.

---

## S001-I007 — Xác định phạm vi Git repository và thời điểm commit

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T09:04:33+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART011 — hướng dẫn Git commit; ART012 — cập nhật prompt log |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- scope.md: HW2/submission-src/supporting/scope.md
- prompt_log.md: HW2/submission-src/ai/prompt_log.md
- README.md: HW2/README.md
- README.md: HW2/submission-src/README.md

## My request:
đề bài yêu cầu có gitlog thì theo phạm vi này bao lâu thì commit 1 lần và commit toàn bộ thư mục làm việc hay chỉ thư mục nộp bài
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Không commit theo thời gian. Theo đề, bạn phải tạo **một commit sau mỗi bước kiểm thử của từng feature**.

Nên khởi tạo Git repository riêng tại `submission-src/`, không commit toàn bộ thư mục `HW2`:

- Commit: `features/`, `evidence/`, `bugs/`, `ai/`, `report/`, `supporting/`, `skills/`, `demo/` và `scripts/` khi có nội dung thật.
- Không commit: `SHOP/`, `node_modules/`, database chạy thử, `.env`, token, cache, file build LaTeX tạm và ZIP cuối.
- Đề và kế hoạch trong `references/` có thể giữ ngoài repo bài làm; chúng không phải kết quả kiểm thử.

Theo quy trình 7 bước, mỗi feature nên có khoảng 7 commit:

1. Chốt spec và test oracle.
2. Mô hình hóa domain.
3. Thiết kế BVA.
4. Hoàn thiện và human review test case.
5. Thực thi và thu evidence.
6. Ghi bug và AI gap.
7. Khóa báo cáo feature và traceability.

Với 4 feature, dự kiến khoảng **28 commit cho phần kiểm thử**, cộng thêm một số commit khởi tạo, skill, AI compliance và đóng gói báo cáo. Không tạo commit rỗng; mỗi commit phải chứa thay đổi thật và chỉ stage các file thuộc bước vừa hoàn thành.

Ví dụ tên commit:

```text
docs: initialize HW02 submission workspace
test(A-FR03): step 1 establish spec and oracle
test(A-FR03): step 2 model input domains
test(A-FR03): step 3 derive boundary cases
test(A-FR03): step 4 review and finalize test cases
test(A-FR03): step 5 record execution evidence
test(A-FR03): step 6 record defects and AI gaps
docs(A-FR03): step 7 finalize feature report
```

Hiện tại `submission-src` chưa được khởi tạo Git; chỉ `SHOP` là Git repository riêng của SUT. Khi bắt đầu, nên commit toàn bộ **khung bài nộp hiện tại** làm commit khởi tạo, rồi từ đó commit theo từng bước thay vì dùng `git add .` một cách tự động.
````

### Human review

- Trạng thái: Chờ sinh viên kiểm tra.
- Căn cứ: đề yêu cầu một Git commit mới cho mỗi bước trong quy trình kiểm thử của từng feature; kế hoạch cụ thể hóa thành quy trình 7 bước.
- Chưa thực hiện: chưa khởi tạo Git repository hoặc tạo commit vì người dùng mới hỏi cách tổ chức.

---

## S001-I008 — Tạo skill commit và skill ghi AI log có điều kiện

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T09:12:08+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART013 — bộ hai skill HW02 và script cập nhật AI-02 |
| AI-02 | Có — một dòng `ART013`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Active file: HW2/submission-src/ai/prompt_log.md

## Open tabs:
- prompt_log.md: HW2/submission-src/ai/prompt_log.md
- scope.md: HW2/submission-src/supporting/scope.md
- README.md: HW2/README.md
- README.md: HW2/submission-src/README.md

## My request:
tạo cho tôi file skill commit này để sau này cần commit tôi sẽ yêu cầu bạn dựa vào skill đó, ngoài ra cũng tạo skill ghi chép prompt vào file log và file AI02, đối với file AI02 chỉ thêm khi dùng AI tạo ra artifact liên quan trực tiếp đến bài nộp thì mới thêm 1 dòng bên trong đó
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Đã tạo hai skill:

- [hw02-step-commit](D:/HCMUS/KCPM/HW2/submission-src/skills/hw02-step-commit/SKILL.md): kiểm tra diff, chỉ stage file của đúng bước, commit theo feature/bước và không chạm repo `SHOP` hay tự `push/amend/reset`.
- [hw02-ai-session-log](D:/HCMUS/KCPM/HW2/submission-src/skills/hw02-ai-session-log/SKILL.md): luôn ghi tương tác vào `prompt_log.md`; chỉ thêm AI-02 khi AI tạo hoặc sửa artifact trực tiếp cho bài nộp.

Skill ghi log có thêm:

- [quy tắc Artifact Gate](D:/HCMUS/KCPM/HW2/submission-src/skills/hw02-ai-session-log/references/ai02-policy.md);
- [script cập nhật AI-02](D:/HCMUS/KCPM/HW2/submission-src/skills/hw02-ai-session-log/scripts/update_ai02.ps1), hỗ trợ thêm dòng mới hoặc cập nhật đúng Artifact ID và tự tính lại thống kê các verdict đã review.

Đã tạo bản làm việc [AI-02_AI_Audit_Report_Working.docx](D:/HCMUS/KCPM/HW2/submission-src/ai/AI-02_AI_Audit_Report_Working.docx). Bản gốc trong `ai/forms/` được giữ nguyên. Vì hai skill là artifact trực tiếp của bài nộp, AI-02 đã nhận đúng một dòng `ART013` với trạng thái `PENDING HUMAN REVIEW`; bạn cần review rồi mới đổi thành `VALID`, `INVALID` hoặc `INCOMPLETE`.

Script đã được chạy thử thành công và `ART013` xuất hiện đúng một lần. Validator chính thức của `skill-creator` chưa chạy được vì môi trường thiếu `PyYAML`; mình đã kiểm tra thủ công frontmatter, không còn marker `TODO`, đồng thời kiểm tra cú pháp và hành vi script. Chưa khởi tạo Git hoặc tạo commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: ranh giới commit, Artifact Gate, cách ghi AI-02 và khả năng dùng lại của script.
- AI-02: đã thêm đúng một dòng `ART013` vì tương tác tạo Agent Skills và script được nộp cùng bài.

---

## S001-I009 — Xác định bước thực hiện tiếp theo

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T10:03:07+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tương tác chỉ tư vấn quy trình |
| AI-02 | Không áp dụng — không tạo hoặc sửa artifact trực tiếp cho bài nộp |

### Prompt của người dùng — nguyên văn

````text
bươc tiếp theo nên làm gì
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Bước tiếp theo là **D1-03 — khởi tạo Git repository cho `submission-src` và tạo commit nền đầu tiên**.

Trước khi commit, bạn cần làm một việc human review: mở dòng `ART013` trong AI-02 và đánh giá hai skill vừa tạo là `VALID`, `INVALID` hay `INCOMPLETE`. Không nên để `PENDING HUMAN REVIEW` đến cuối bài.

Sau đó thực hiện:

1. Tạo `.gitignore` để loại `*.aux`, `*.log`, `*.out`, `*.toc`, `.env`, cache, ZIP và file tạm.
2. Chạy `git init` ngay trong `submission-src`, không chạy tại `HW2` và không chạm repo `SHOP`.
3. Kiểm tra toàn bộ file chuẩn bị commit, đặc biệt không có secret hoặc dữ liệu chạy thử.
4. Tạo commit nền:

```text
docs: initialize HW02 submission workspace
```

5. Kiểm tra lại `git status` và commit vừa tạo.

Sau commit nền, chuyển sang **D1-04 — chạy smoke test Web, Admin Web và Mobile**, ghi phiên bản môi trường và xác nhận có thể truy cập FR-03, FR-09, FR-14 và Mobile Feature 9. Chỉ sau khi môi trường hoạt động mới bắt đầu `A-FR03` bước 1: lập spec và test oracle.

Bạn có thể yêu cầu: **“Dùng skill `hw02-step-commit` để khởi tạo Git và tạo commit nền.”**
````

### Human review

- Trạng thái: Chờ sinh viên kiểm tra.
- AI-02: Không thêm dòng vì phản hồi chỉ hướng dẫn quy trình, không tạo artifact bài nộp.

---

## S001-I010 — Tạo `.gitignore` và root commit

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T10:08:02+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — thao tác cấu hình và Git |
| AI-02 | Không áp dụng — tương tác Git-only theo Artifact Gate |

### Prompt của người dùng — nguyên văn

````text
tôi đã remote thư mục submission với repo, bạn hãy tạo file ignore rồi commit lần đầu cho tôi
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Đã tạo `.gitignore` và root commit đầu tiên trong `submission-src`:

- Commit: `c3effb7 docs: initialize HW02 submission workspace`
- Nhánh: `master`
- Nội dung: 45 file, gồm cấu trúc bài nộp, LaTeX template, AI forms/log, scope, hai skill và các `.gitkeep` để giữ thư mục rỗng.
- Đã loại khỏi Git: secret/`.env`, dependency, cache, database cục bộ, file trung gian LaTeX, file tạm và ZIP cuối.
- Đã kiểm tra `git diff --cached --check`, tên file có dấu hiệu chứa secret và file lớn hơn 5 MiB; không phát hiện vấn đề.
- Không push lên remote.
- AI-02 không được thêm dòng vì đây là thao tác Git-only.

Sau commit, [prompt_log.md](D:/HCMUS/KCPM/HW2/submission-src/ai/prompt_log.md) có một thay đổi chưa commit để ghi lại chính tương tác này. File đó nên được stage cùng commit công việc kế tiếp; mình không tạo thêm commit chỉ để ghi log.
````

### Human review

- Trạng thái: Chờ sinh viên kiểm tra.
- Git: root commit đã tạo; không push.
- AI-02: Không thêm dòng vì tương tác chỉ tạo cấu hình ignore và thực hiện Git commit.

---

## S001-I011 — Xác định bước sau root commit

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T10:12:39+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tương tác chỉ tư vấn quy trình |
| AI-02 | Không áp dụng — không tạo hoặc sửa artifact trực tiếp cho bài nộp |

### Prompt của người dùng — nguyên văn

````text
bước tiếp theo làm gì
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Bước tiếp theo là **D1-04 — chạy SUT và smoke test bốn feature** trước khi thiết kế test case.

Bạn cần thực hiện:

1. Đọc `SHOP/setup_guide.md`, khởi chạy backend, Web, Admin Web và Mobile.
2. Ghi vào `submission-src/supporting/environment.md`:
   - commit SUT `85af3ba...`;
   - phiên bản Node/npm, trình duyệt, thiết bị hoặc emulator, hệ điều hành và Expo;
   - URL/port của từng nền tảng;
   - test account và cách reset test data, nhưng không ghi mật khẩu/secret thật.
3. Mở thử đúng bốn luồng:
   - A-FR03: trang quên/đặt lại mật khẩu;
   - B-FR09: nhập Discount Coupon tại Web checkout;
   - C-FR14: trang quản lý danh mục của Admin;
   - D-M09: nhập Discount Coupon tại Mobile checkout.
4. Lưu screenshot smoke test riêng vào `evidence/A`, `evidence/B`, `evidence/C`, `evidence/D`.
5. Nếu nền tảng không chạy được, ghi `Blocked`, log lỗi và bước đã thử; chưa gọi đó là bug sản phẩm.

Khi cả bốn luồng truy cập được, bước kế tiếp mới là **A-FR03 — Step 1: lập spec và test oracle**. Commit tiếp theo nên dành cho `environment.md`, smoke evidence và prompt log bằng message phù hợp như:

```text
test: establish HW02 test environment and smoke paths
```

Trước khi làm tiếp, bạn cũng nên review dòng `ART013` trong AI-02 và đổi trạng thái pending theo đánh giá thật của bạn.
````

### Human review

- Trạng thái: Chờ sinh viên kiểm tra.
- AI-02: Không thêm dòng vì phản hồi chỉ hướng dẫn bước tiếp theo.

---

## S001-I012 — Tạo tài liệu môi trường trước smoke test

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T10:22:29+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART014 — `supporting/environment.md` |
| AI-02 | Có — một dòng `ART014`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- setup_guide.md: HW2/SHOP/setup_guide.md

## My request:
tôi đã chạy được hết các nền tảng, bạn tạo environtment md cho tôi bao gồm các thông tin bạn đã yêu cầu, tuy nhiên tôi chưa kiểm tra các pool A B C D do vậy bạn chỉ thêm doc đến trước các bước này. Sau đó bạn cung cấp hướng dẫn về cách lấy minh chứng và vị trí đặt của chúng
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Đã tạo [environment.md](D:/HCMUS/KCPM/HW2/submission-src/supporting/environment.md) đến đúng thời điểm trước smoke test.

Tài liệu đã ghi:

- SUT commit, nhánh và trạng thái runtime cục bộ.
- Windows, Node.js, npm, Git và PowerShell thực tế.
- Công nghệ, dependency, lệnh chạy và URL/port dự kiến của Backend, Web, Admin Web và Mobile.
- Xác nhận của bạn rằng các nền tảng đã chạy được.
- Các port hiện không còn lắng nghe tại thời điểm kiểm tra, nên không ghi là đang chạy.
- Trình duyệt, thiết bị/emulator, Mobile OS và Expo Go chưa biết được để trống có giải thích.
- Cả bốn feature đều là `Not Run`; chưa có Pass/Fail, bug hoặc smoke evidence.

## Cách lấy smoke evidence

Khởi động lại từng nền tảng, sau đó với mỗi pool:

1. Mở đúng màn hình feature nhưng chưa cần chạy test case chi tiết.
2. Chụp ảnh sao cho nhận diện được feature và nền tảng; không để lộ mật khẩu, token hoặc dữ liệu cá nhân.
3. Ghi kèm thời gian, URL/app screen, build/thiết bị và trạng thái `Accessible` hoặc `Blocked` trong `environment.md`.
4. Giữ ảnh gốc, không chỉnh sửa nội dung và không dùng ảnh do AI tạo.

Vị trí và tên file đề xuất:

```text
evidence/A/smoke/A-FR03-SMOKE-001-forgot-password.png
evidence/B/smoke/B-FR09-SMOKE-001-web-coupon.png
evidence/C/smoke/C-FR14-SMOKE-001-category-admin.png
evidence/D/smoke/D-M09-SMOKE-001-mobile-coupon.png
```

Ảnh nên thể hiện:

- A: trang quên mật khẩu hoặc bước nhập OTP.
- B: trường nhập Discount Coupon trên Web checkout.
- C: màn hình quản lý danh mục trên Admin Web.
- D: trường Discount Coupon trên Mobile checkout, kèm thông tin thiết bị/emulator trong ghi chép.

Nếu feature không mở được, chụp màn hình lỗi và lưu log đã làm sạch vào cùng thư mục `smoke/`, đánh dấu `Blocked`; chưa báo bug cho đến khi loại trừ lỗi setup.

Lượt này đã được ghi vào [prompt_log.md](D:/HCMUS/KCPM/HW2/submission-src/ai/prompt_log.md). AI-02 đã thêm đúng một dòng `ART014` ở trạng thái `PENDING HUMAN REVIEW` vì `environment.md` là artifact trực tiếp của bài nộp. Chưa tạo commit; nên hoàn tất smoke evidence rồi commit tài liệu môi trường và evidence cùng nhau.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: trình duyệt, thiết bị/emulator, URL thực tế, account/test data và việc phân biệt startup với smoke test.
- AI-02: đã thêm đúng một dòng `ART014` vì AI tạo `supporting/environment.md`.

---

## S001-I013 — Chẩn đoán Mobile không kết nối Backend

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T10:45:36+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tương tác chẩn đoán, chưa sửa source hoặc artifact bài nộp |
| AI-02 | Không áp dụng — inspection/diagnosis only |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Active file: HW2/SHOP/setup_guide.md

## Active selection of the file:
admin@eshop.com
## Open tabs:
- setup_guide.md: HW2/SHOP/setup_guide.md
- README.md: HW2/SHOP/README.md
- README.md: HW2/SHOP/frontend-web/README.md
- README.md: HW2/SHOP/frontend-admin/README.md
- environment.md: HW2/submission-src/supporting/environment.md

# Files pasted by the user:

## "nning application \"main\" with appParams: {rootTag: '#root', hydrate: undefined}…": C:\Users\DLCH\.codex/attachments/9ae97773-9a34-45c9-899d-21248e1c83e7/pasted-text.txt

## My request:
hình như cấu hình sai ip nên chưa kết nối được backend
````

### Phản hồi cuối của AI — ghi nhận khi hoàn thành

````markdown
Đúng, IP đang cấu hình sai; đồng thời backend hiện cũng chưa chạy.

Kết quả đối chiếu:

- Mobile đang dùng `http://192.168.10.13:3000/api` tại `SHOP/frontend-mobile/App.js:16`.
- IP Wi‑Fi hiện tại của máy là `10.0.243.137`.
- Log gọi `192.168.10.13` và nhận `ERR_CONNECTION_TIMED_OUT`.
- Port `3000` hiện không lắng nghe, nghĩa là backend đã dừng tại thời điểm kiểm tra.
- Backend dùng `app.listen(PORT)` và đã bật `cors()`, nên source không cho thấy nó bị giới hạn chỉ ở `localhost`.

Thực hiện theo thứ tự:

1. Khởi động backend:

```powershell
cd D:\HCMUS\KCPM\HW2\SHOP\backend
node server.js
```

2. Kiểm tra trên máy tính:

```powershell
Invoke-WebRequest http://localhost:3000/api/products
Test-NetConnection 10.0.243.137 -Port 3000
```

3. Chọn URL theo môi trường:

- Chạy Expo Web trên chính máy tính: `http://localhost:3000/api`.
- Chạy điện thoại thật cùng Wi‑Fi: `http://10.0.243.137:3000/api`.
- Android Emulator mặc định: thường dùng `http://10.0.2.2:3000/api`.

4. Nếu dùng điện thoại thật, bảo đảm điện thoại và máy tính cùng Wi‑Fi, tắt VPN nếu có và cho phép Node.js qua Windows Firewall trên Private network.

Không nên giữ `192.168.10.13` vì đó là IP cũ. IP LAN có thể thay đổi sau khi đổi mạng hoặc khởi động router; về lâu dài nên đưa API URL vào biến môi trường như `EXPO_PUBLIC_API_URL` thay vì hard-code.

Lượt này chỉ chẩn đoán, chưa sửa `App.js`, chưa cập nhật `environment.md` và không thêm AI-02. Sau khi bạn chọn đang chạy Expo Web, điện thoại thật hay emulator, URL mới có thể được sửa chính xác.
````

### Human review

- Trạng thái: Chờ sinh viên kiểm tra bằng cách khởi động backend và gọi endpoint.
- AI-02: Không thêm dòng vì chưa tạo hoặc sửa artifact trực tiếp cho bài nộp.

---

## S001-I014 — Sắp xếp và ghi nhận smoke evidence

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T10:53:13+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART015 — smoke evidence và `supporting/environment.md` |
| AI-02 | Có — một dòng `ART015`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Active file: HW2/SHOP/setup_guide.md

## Active selection of the file:
admin@eshop.com
## Open tabs:
- setup_guide.md: HW2/SHOP/setup_guide.md
- README.md: HW2/SHOP/README.md
- README.md: HW2/SHOP/frontend-web/README.md
- README.md: HW2/SHOP/frontend-admin/README.md
- environment.md: HW2/submission-src/supporting/environment.md

## My request:
tôi đã chụp trạng thái của các tính năng, 5 ảnh được đặt trong thư mục gốc với tên [categories-crud.png](HW2/categories-crud.png) [discount-coupon.png](HW2/discount-coupon.png) [forgot-password.png](HW2/forgot-password.png) [mobile-coupon.png](HW2/mobile-coupon.png) [reset-password.png](HW2/reset-password.png) bạn hãy thêm chúng vào thư mục eviden tương ứng và đổi tên file theo những gì đã thống nhất trong kế hoạch. Đọc qua từng ảnh để biết thông tin ngày giờ để trình bày vào báo cáo.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã sắp xếp đủ 5 ảnh vào đúng Pool và cập nhật [environment.md](D:/HCMUS/KCPM/HW2/submission-src/supporting/environment.md).

Thời gian đọc trực tiếp từ đồng hồ trong ảnh, cùng ngày `09/10/2026`:

- A-FR03: [forgot-password](D:/HCMUS/KCPM/HW2/submission-src/evidence/A/smoke/A-FR03-SMOKE-001-forgot-password.png) — 10:31 AM.
- A-FR03: [reset-password](D:/HCMUS/KCPM/HW2/submission-src/evidence/A/smoke/A-FR03-SMOKE-002-reset-password.png) — 10:31 AM.
- B-FR09: [web-coupon](D:/HCMUS/KCPM/HW2/submission-src/evidence/B/smoke/B-FR09-SMOKE-001-web-coupon.png) — 10:33 AM.
- C-FR14: [category-admin](D:/HCMUS/KCPM/HW2/submission-src/evidence/C/smoke/C-FR14-SMOKE-001-category-admin.png) — 10:37 AM.
- D-M09: [mobile-coupon](D:/HCMUS/KCPM/HW2/submission-src/evidence/D/smoke/D-M09-SMOKE-001-mobile-coupon.png) — 10:48 AM.

Báo cáo ghi cả bốn feature ở mức `Accessible`, chưa gán `Pass/Fail`. Các quan sát cần kiểm tra tiếp:

- Màn hình reset hiển thị OTP `7870` và nhãn OTP 4 số; cần đối chiếu requirement trước khi kết luận bug.
- Ảnh Mobile là Expo Web với Chrome device emulation `iPhone 16 Pro Max`, viewport `440 × 956`, không phải thiết bị iOS thật.
- Console trong ảnh Mobile có request login trả về `401`; cần tái hiện và điều tra riêng.
- Ảnh C-FR14 chỉ chứng minh trang/danh sách truy cập được, chưa chứng minh các thao tác CRUD.

AI-02 đã thêm đúng một dòng `ART015` ở trạng thái `PENDING HUMAN REVIEW`. Chưa tạo commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: tên và vị trí ảnh, thời gian đọc từ ảnh, cách mô tả Expo Web và các quan sát chưa được kết luận là bug.
- AI-02: Đã thêm đúng một dòng `ART015` vì evidence và `environment.md` là artifact trực tiếp của bài nộp.

---

## S001-I015 — Điền thông tin báo cáo và chèn smoke evidence

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T11:08:32+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART016 — bản nháp báo cáo LaTeX, metadata cá nhân và form AI working |
| AI-02 | Có — một dòng `ART016`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Active file: HW2/submission-src/report/latex/main.tex

## Open tabs:
- main.tex: HW2/submission-src/report/latex/main.tex
- setup_guide.md: HW2/SHOP/setup_guide.md
- README.md: HW2/SHOP/README.md
- README.md: HW2/SHOP/frontend-web/README.md
- README.md: HW2/SHOP/frontend-admin/README.md

## My request:
Bạn vào thư mục [HW1](HW1/) lấy lại các thông tin môn học sinh viên giảng viên chép vào báo cáo [HW2](HW2/). Dựa vào [scope.md](HW2/submission-src/supporting/scope.md) điền đúng các feature mà tôi đảm nhận sau đó chèn các ảnh smoke lúc nãy vào phần đầu của mỗi pool luôn. Bạn cũng mô tả ngắn gọn về ảnh nếu cần. vì prompt này có tạo ra sản phẩm nộp nên bạn ghi vào log + AI02, nhớ điền thông tin của tôi vào các file nào còn trống. Tôi là sinh viên Nguyễn Phúc Hậu mã số sinh viên là 23120252
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã cập nhật bản nháp báo cáo và điền thông tin của bạn.

Các thay đổi chính:

- [Trang bìa](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/00_cover.tex) đã có Nguyễn Phúc Hậu, MSSV 23120252, lớp CQ2023/31 và năm học 2026–2027.
- [Phần giới thiệu](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/01_introduction.tex) đã có email, môn Kiểm thử phần mềm, lớp và ba giảng viên lấy từ HW1; đồng thời tóm tắt phạm vi bốn feature.
- Bốn chương đã được đặt đúng tên theo `scope.md` và chèn đủ năm ảnh smoke ở đầu Pool A, B, C, D, kèm thời gian, trạng thái `Accessible` và mô tả ngắn. Các quan sát OTP 4 số, Console `401`, giới hạn của ảnh CRUD và Expo Web vẫn được trình bày như điểm cần kiểm tra, chưa kết luận bug.
- [scope.md](D:/HCMUS/KCPM/HW2/submission-src/supporting/scope.md) đã ghi người phụ trách là Nguyễn Phúc Hậu — MSSV 23120252.
- [AI-02 working](D:/HCMUS/KCPM/HW2/submission-src/ai/AI-02_AI_Audit_Report_Working.docx) đã được điền thông tin cá nhân và thêm đúng một dòng `ART016` ở trạng thái `PENDING HUMAN REVIEW`.
- Đã tạo [AI-03 working](D:/HCMUS/KCPM/HW2/submission-src/ai/AI-03_AI_Disclosure_Form_Working.docx), điền thông tin môn học, bài tập và sinh viên. `AI Use Category`, nội dung disclosure và chữ ký vẫn để trống để bạn tự xác nhận.

Bản PDF 18 trang đã biên dịch thành công tại [HW02_Report_Draft.pdf](D:/HCMUS/KCPM/HW2/submission-src/report/latex/HW02_Report_Draft.pdf). `main.pdf` đang bị ứng dụng khác giữ khóa nên mình xuất bằng tên draft; nội dung LaTeX đã được kiểm tra trực quan, ảnh và caption hiển thị đúng.

Prompt đã được ghi vào `S001-I015`. Chưa tạo commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: thông tin học phần/giảng viên, tên feature, nội dung caption, cách mô tả smoke evidence và metadata của AI-02/AI-03.
- AI-02: Đã thêm đúng một dòng `ART016` vì báo cáo LaTeX và các form working là artifact trực tiếp của bài nộp.

---

## S001-I016 — Quyết định checkpoint commit sau smoke test

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T14:42:44+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tương tác chỉ tư vấn quy trình commit |
| AI-02 | Không áp dụng — không tạo hoặc sửa artifact nội dung trực tiếp ngoài prompt log bắt buộc |

### Prompt của người dùng — nguyên văn

````text
bước này có nên commit không
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Có. Đây là một checkpoint hợp lý vì bạn đã hoàn thành một nhóm công việc rõ ràng: thiết lập môi trường, thu smoke evidence, xác nhận bốn feature có thể truy cập và khởi tạo nội dung báo cáo.

Nên commit:

- Năm ảnh trong `evidence/A-D/smoke/`.
- `supporting/environment.md` và `supporting/scope.md`.
- Các chương LaTeX đã cập nhật.
- `AI-02_AI_Audit_Report_Working.docx`, `AI-03_AI_Disclosure_Form_Working.docx`, `ai/README.md` và `prompt_log.md`.

Không nên commit lúc này:

- `report/latex/main.synctex(busy)`.
- `main.pdf` cũ và `HW02_Report_Draft.pdf`, vì báo cáo còn đang hoàn thiện; PDF cuối sẽ được tạo và commit ở bước đóng gói.
- Bất kỳ file runtime nào trong repo `SHOP`.

Trước khi commit, bạn chỉ cần xem nhanh PDF và xác nhận tên, MSSV, lớp, giảng viên và tên bốn feature. `ART016` có thể tiếp tục để `PENDING HUMAN REVIEW` trong checkpoint này, nhưng phải được review trước khi nộp bài.

Commit message phù hợp:

```text
docs: add smoke evidence and initialize feature report
```

Sau commit này, bước tiếp theo là bắt đầu `A-FR03` — phân tích spec và xác lập test oracle. Mình chưa tạo commit vì bạn mới hỏi có nên commit hay không.
````

### Human review

- Trạng thái: Chờ sinh viên quyết định thực hiện commit.
- AI-02: Không thêm dòng vì đây là tư vấn quy trình, không tạo artifact nội dung trực tiếp cho bài nộp.

---

## S001-I017 — Xác định bước tiếp theo sau smoke-test commit

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T14:49:10+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tương tác chỉ tư vấn bước tiếp theo |
| AI-02 | Không áp dụng — chưa tạo hoặc sửa artifact trực tiếp cho bài nộp |

### Prompt của người dùng — nguyên văn

````text
bước tiếp theo là gì
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Bước tiếp theo là **A-FR03 — Step 1: phân tích đặc tả và xác lập test oracle**.

Bạn nên tạo `features/A/01_spec_and_oracle.md` với bốn nhóm input:

- Email yêu cầu đặt lại mật khẩu.
- OTP.
- Mật khẩu mới.
- Xác nhận mật khẩu.

Trong file này, mỗi quy tắc cần ghi rõ:

| Nội dung | Cần xác định |
|---|---|
| Kiểu dữ liệu | String, số hay định dạng khác |
| Miền hợp lệ | Giá trị nào được chấp nhận |
| Miền không hợp lệ | Rỗng, sai định dạng, không tồn tại, hết hạn… |
| Boundary | Độ dài tối thiểu/tối đa và các giá trị sát biên |
| Quan hệ phụ thuộc | OTP gắn với email, hai mật khẩu phải khớp… |
| Expected result | Chấp nhận, từ chối và thông báo tương ứng |
| Nguồn | `SHOP/README.md`, `api_specification.md`, đề bài hoặc tài liệu chính thức |
| Trạng thái | Đã xác nhận, giả định hoặc đang mâu thuẫn |

Điểm cần xử lý đầu tiên là mâu thuẫn OTP: `scope.md` đang ghi OTP 6 chữ số nhưng UI smoke test hiển thị OTP 4 số. Chưa chọn implementation làm đáp án đúng; hãy ghi đây là **requirement conflict** và truy tìm nguồn chính thức trước khi lập expected result.

Ở bước này chưa cần sinh test case. Đầu ra chỉ cần là đặc tả đã truy vết được nguồn và danh sách câu hỏi chưa rõ. Sau khi bạn review file này, commit phù hợp là:

```text
test(A-FR03): step 1 establish spec and oracle
```

Bạn có thể yêu cầu tiếp: **“Thực hiện A-FR03 Step 1, đọc README và API specification để tạo `01_spec_and_oracle.md`; không tự giải quyết các yêu cầu mâu thuẫn.”**
````

### Human review

- Trạng thái: Chờ sinh viên bắt đầu Step 1 của A-FR03.
- AI-02: Không thêm dòng vì phản hồi chỉ hướng dẫn quy trình, chưa tạo artifact kiểm thử.

---

## S001-I018 — Tạo và commit đặc tả/test oracle A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T15:21:00+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART017 — `features/A/01_spec_and_oracle.md` |
| AI-02 | Có — một dòng `ART017`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
tạo file đó và commit theo skill
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo và commit [01_spec_and_oracle.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/01_spec_and_oracle.md).

File đã ghi:

- Thứ tự ưu tiên nguồn làm test oracle.
- Bốn nhóm input: email, OTP, mật khẩu mới và xác nhận mật khẩu.
- Chín business rule cùng expected result và mức chắc chắn.
- API contract của hai endpoint.
- Các boundary candidate để dùng ở bước BVA sau này.
- Bảy discrepancy quan sát từ source/UI, gồm OTP 6 số so với 4 số, thiếu `confirmPassword`, password regex sai, chưa có OTP expiry và lưu mật khẩu plaintext.
- Bảy câu hỏi chưa có requirement rõ ràng và human review gate.

Đã tạo commit:

```text
d944dac test(A-FR03): step 1 establish spec and oracle
```

Kiểm tra đã thực hiện:

- `git diff --cached --check`: đạt, không còn lỗi whitespace.
- AI-02 có đúng một dòng `ART017`, trạng thái `PENDING HUMAN REVIEW`.
- Chỉ commit ba file: đặc tả A-FR03, AI-02 working và prompt log đã có trước commit.
- Ba file build PDF/Synctex vẫn không được commit.

Lượt hiện tại đã được ghi thành `S001-I018` sau khi có commit hash, nên `prompt_log.md` hiện có một thay đổi chưa commit; thay đổi này sẽ đi cùng commit của bước kế tiếp. Trước Step 2, bạn cần review các rule và đánh dấu checklist ở cuối file.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: hierarchy nguồn, rule/oracle, các discrepancy và câu hỏi chưa rõ trước khi dùng cho Domain Testing.
- AI-02: Đã thêm đúng một dòng `ART017` vì file spec/oracle là artifact trực tiếp của bài nộp.

---

## S001-I019 — Giải thích mục đích file spec và oracle

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T17:11:11+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tương tác chỉ giải thích artifact đã tạo |
| AI-02 | Không áp dụng — không tạo hoặc sửa artifact nội dung mới ngoài prompt log bắt buộc |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- 01_spec_and_oracle.md: HW2/submission-src/features/A/01_spec_and_oracle.md

## My request:
tạo file đó để làm gì vậy
````

### Phản hồi cuối của AI — nguyên văn

````markdown
File `01_spec_and_oracle.md` là **nền móng để thiết kế test**, chưa phải danh sách test case.

Nó giải quyết bốn việc:

1. **Chốt hệ thống phải làm gì**
   Ghi requirement và expected result từ README/API specification. Đây chính là test oracle để sau này quyết định một test là `Pass` hay `Fail`.

2. **Tách requirement khỏi implementation hiện tại**
   Ví dụ requirement yêu cầu OTP 6 số nhưng chương trình đang sinh 4 số. Nếu không lập oracle trước, ta có thể nhầm rằng “chương trình đang chạy như vậy” nghĩa là hành vi đúng.

3. **Làm đầu vào cho các bước kế tiếp**

   - Step 2: chia valid/invalid domain.
   - Step 3: chọn boundary bằng BVA.
   - Step 4: tạo test case cụ thể.
   - Step 5: chạy test và so actual result với oracle.
   - Báo cáo cuối: truy vết từ requirement → domain → boundary → test case → kết quả/bug.

4. **Ghi rõ phần chưa biết thay vì tự suy đoán**
   Chẳng hạn thời gian hết hạn OTP, độ dài tối đa của mật khẩu và response lỗi chưa được đặc tả. Các điểm này được giữ thành câu hỏi cần xác nhận.

Vì vậy, file này giúp test case sau đó có căn cứ và giải thích được vì sao chọn từng miền/biên. Việc bạn cần làm trước mắt là đọc các rule `A-R01` đến `A-R09` và checklist cuối file. Nếu đồng ý với nguồn và cách diễn giải, mới chuyển sang tạo `02_domain_model.md`.
````

### Human review

- Trạng thái: Chờ sinh viên review Step 1 trước khi tạo domain model.
- AI-02: Không thêm dòng vì phản hồi chỉ giải thích mục đích của artifact đã có.

---

## S001-I020 — Đánh giá độ tin cậy của spec A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T17:14:08+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tương tác chỉ đánh giá độ tin cậy của artifact đã có |
| AI-02 | Không áp dụng — không tạo hoặc sửa artifact nội dung mới ngoài prompt log bắt buộc |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- 01_spec_and_oracle.md: HW2/submission-src/features/A/01_spec_and_oracle.md

## My request:
vậy bạn làm cách nào để chắc rằng file spec bạn đưa ra là đúng hoàn toàn theo nghiệp vụ của dự án này
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Không thể khẳng định file spec **đúng hoàn toàn** với tài liệu hiện có. Nó đang là working specification có truy vết nguồn và được đánh dấu `PENDING HUMAN REVIEW`, không phải đặc tả đã được business owner phê duyệt.

Mình kiểm soát độ đúng bằng bốn lớp:

1. **Requirement chính thức trước**: các rule về OTP 6 số, mật khẩu, xác nhận mật khẩu, OTP gắn với email và dùng một lần đều dẫn về dòng cụ thể trong `SHOP/README.md`.
2. **Đối chiếu API contract**: `api_specification.md` được dùng để xác nhận request/response, nhưng không tự bổ sung các rule mà tài liệu không nói.
3. **Không lấy source làm đáp án đúng**: Backend/UI chỉ giúp phát hiện khác biệt như OTP 4 số hoặc thiếu `confirmPassword`.
4. **Đánh dấu mức chắc chắn**: rule nào là requirement rõ ràng, rule nào là suy luận và rule nào còn thiếu đều được ghi riêng.

Hiện vẫn chưa thể xác nhận hoàn toàn các điểm sau:

- OTP hết hạn sau bao lâu và xử lý đúng tại thời điểm hết hạn thế nào.
- Yêu cầu OTP mới có vô hiệu hóa OTP cũ hay không.
- Giới hạn độ dài tối đa của email và mật khẩu.
- Status code, nội dung thông báo lỗi và điều hướng sau khi reset thành công.
- `confirmPassword` phải được kiểm tra ở client, backend hay cả hai.
- FR-03 kế thừa quy tắc định dạng email nào.

Muốn nâng file này thành spec đáng tin cậy để làm oracle chính thức, cần:

1. Đối chiếu thêm Moodle, slide, bảng mô tả feature hoặc tài liệu do giảng viên cung cấp.
2. Gửi các câu hỏi ở mục 9 cho giảng viên/TA hoặc người đóng vai trò business owner.
3. Ghi câu trả lời và nguồn xác nhận vào file, không chỉ sửa kết luận.
4. Bạn review từng rule `A-R01`–`A-R09`; rule chưa đủ nguồn phải tiếp tục mang nhãn assumption/unresolved.
5. Chỉ sau đó mới đổi `PENDING HUMAN REVIEW` và dùng rule làm expected result cho test case.

Việc chạy thử hệ thống chỉ xác nhận **actual behavior**, không chứng minh **business requirement**. Vì vậy câu trả lời trung thực là: phần có dẫn nguồn đang có độ tin cậy cao; phần còn thiếu nguồn chưa thể được gọi là đúng hoàn toàn. Nếu chưa thể hỏi giảng viên, ta vẫn tiếp tục được nhưng các test phụ thuộc vào điểm chưa rõ phải ghi `Assumption` hoặc `Blocked`, không tự đặt expected result.
````

### Human review

- Trạng thái: Chờ nguồn chính thức hoặc xác nhận của sinh viên/giảng viên cho các câu hỏi mở.
- AI-02: Không thêm dòng vì phản hồi chỉ đánh giá độ tin cậy của artifact đã có.

---

## S001-I021 — Tạo domain model cho A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-09T17:50:56+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART018 — `features/A/02_domain_model.md` |
| AI-02 | Có — một dòng `ART018`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- 01_spec_and_oracle.md: HW2/submission-src/features/A/01_spec_and_oracle.md

## My request:
bạn hãy dựa vào file spec đã được tôi review và triển khai phần domain model cho tính năng ở pool A
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [02_domain_model.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/02_domain_model.md) cho `A-FR03`.

Domain model gồm:

- Email syntax và email membership.
- OTP format, value, quan hệ OTP–email và lifecycle.
- Password length cùng bốn nhóm ký tự bắt buộc.
- Quan hệ mật khẩu–xác nhận mật khẩu.
- Composite predicate cho Bước 1 và Bước 2.
- State model của OTP: chưa phát hành, active, expired và consumed.
- Các conformance domain của UI/output.
- Nominal baseline để cô lập một invalid characteristic khi thiết kế test.
- Traceability đầy đủ từ `A-R01` đến `A-R14`.

File cố ý chưa làm hai việc thuộc bước sau:

- Chưa chọn bộ giá trị ngay dưới/tại/ngay trên boundary — dành cho Step 3 BVA.
- Chưa chuyển partition thành test case — dành cho Step 4.

Đã kiểm tra:

- Có đủ 13 phần tài liệu.
- Không thiếu rule nào từ `A-R01`–`A-R14` trong traceability.
- `STEP1_VALID` và `STEP2_VALID` đã được biểu diễn rõ.
- `git diff --check` riêng cho file mới không có lỗi.

AI-02 đã thêm đúng một dòng `ART018` ở trạng thái `PENDING HUMAN REVIEW`; prompt được ghi thành `S001-I021`. Chưa tạo commit. Trước khi làm BVA, bạn cần kiểm tra checklist tại mục 13 và xác nhận các partition không chồng lấn.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: tính loại trừ/đầy đủ của partition, composite predicates, nominal baseline và traceability.
- AI-02: Đã thêm đúng một dòng `ART018` vì domain model là artifact trực tiếp của bài nộp.

---

## S001-I022 — Đánh giá giai đoạn và tiến độ sau hai ngày

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T20:42:03.2091395+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — chỉ đánh giá trạng thái hiện tại |
| AI-02 | Không — không tạo artifact trực tiếp cho bài nộp |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/features/A/02_domain_model.md

## Open tabs:
- 02_domain_model.md: submission-src/features/A/02_domain_model.md
- 01_spec_and_oracle.md: submission-src/features/A/01_spec_and_oracle.md

## My request:
tôi đang quay lại sau 2 ngày, cho biết giai đoạn hiện tại và phần trăm đã làm được
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Hiện tại bạn đang ở **giai đoạn phân tích domain của Pool A (A-FR03 — Forgot/Reset Password)**, cụ thể là cuối **Step 2**, chưa chuyển sang thiết kế test case.

- **Step 1 — Spec & oracle:** đã hoàn thành và đã review theo source của dự án.
- **Step 2 — Domain model:** đã soạn xong nhưng còn `PENDING HUMAN REVIEW` và chưa commit.
- **Step 3 — Boundary Value Analysis (BVA):** chưa làm.
- Pool B, C, D mới có smoke evidence; chưa bắt đầu phân tích domain hay thiết kế test.

Có hai cách nhìn tiến độ:

- **Riêng quy trình kiểm thử 4 feature:** khoảng **5%**. Kế hoạch có 28 bước feature (4 pool × 7 bước); hiện hoàn thành 1 bước và Step 2 của Pool A mới ở mức bản nháp, tương đương khoảng 1,5/28. Nếu chỉ tính bước đã review hoàn toàn thì là **3,6%**.
- **Toàn bộ bài nộp, gồm cả phần chuẩn bị:** khoảng **20%**. Workspace, Git, scope, environment, smoke evidence, khung báo cáo, AI-02/AI-03 và prompt log đã có; tuy nhiên BVA, test case, thực thi test, bug/AI gap, phần báo cáo nội dung, demo và đóng gói cuối vẫn chưa hoàn thành.

Đây là **ước lượng theo artifact hiện có**, không phải phần trăm điểm chính thức của rubric.

Bước tiếp theo đúng kế hoạch là:

1. Review checklist ở mục cuối của `02_domain_model.md`.
2. Nếu các partition, predicate và traceability đều đúng, chuyển trạng thái sang `REVIEWED` rồi commit Step 2.
3. Tạo `features/A/03_boundary_value_analysis.md` để chọn các giá trị ngay dưới, tại và ngay trên từng boundary.

Lưu ý: hiện thay đổi của spec, domain model, prompt log và AI-02 vẫn chưa được commit; các file PDF tạm cũng đang untracked. Chưa nên bắt đầu BVA trước khi chốt domain model.
````

### Human review

- Trạng thái: Không áp dụng — phản hồi tư vấn tiến độ, không tạo artifact bài nộp.
- AI-02: Không thêm dòng.

---

## S001-I025 — Commit Step 1–3 và tạo test case Step 4 cho A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T21:09:33.9870448+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART020 — `features/A/04_test_cases.md` |
| AI-02 | Có — một dòng `ART020`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- 03_boundary_value_analysis.md: submission-src/features/A/03_boundary_value_analysis.md
- 02_domain_model.md: submission-src/features/A/02_domain_model.md
- 01_spec_and_oracle.md: submission-src/features/A/01_spec_and_oracle.md

## My request:
bạn commit đi rồi mới thực hiện tạo file 04
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã hoàn tất đúng thứ tự: commit Step 1–3 trước, sau đó mới tạo Step 4.

Các commit đã tạo:

- `ff0b089` — `test(A-FR03): refine step 1 oracle from project source`
- `439577c` — `test(A-FR03): step 2 model input domains`
- `978e433` — `test(A-FR03): step 3 derive boundary cases`

Các PDF và file Synctex tạm không được đưa vào commit.

Đã tạo [04_test_cases.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/04_test_cases.md), gồm 38 test case:

- Email và phát hành OTP.
- OTP format/value/binding/lifecycle.
- BVA cho OTP length và password policy.
- Confirm password và kiểm tra password không lưu plaintext.
- UI conformance, Tab order và traceability.
- Fixture token 6 chữ số để cô lập Step 2 khỏi lỗi SUT đang sinh OTP 4 số.

Đã kiểm tra:

- 38/38 test ID liên tục và không trùng.
- Bao phủ toàn bộ invalid partition.
- Có đầy đủ `A-R01`–`A-R14` và `A-B01`–`A-B10`.
- Password test data đúng length và composition.
- Không có lỗi whitespace trong file mới.

File đang ở `PENDING HUMAN REVIEW`; chưa thực thi và chưa gán Pass/Fail. Prompt được ghi thành `S001-I025`, còn AI-02 có đúng một dòng `ART020` ở trạng thái pending. Step 4 cùng hai file AI đang để chưa commit để bạn review trước checkpoint tiếp theo.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: test data/fixture, expected result, coverage, traceability và khả năng thực thi.
- AI-02: Đã thêm đúng một dòng `ART020` vì test case design là artifact trực tiếp của bài nộp.

---

## S001-I026 — Báo trạng thái A-FR03 sau thiết kế test case

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T21:17:58.7219263+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — báo trạng thái và đề xuất bước tiếp theo |
| AI-02 | Không — không tạo artifact trực tiếp mới |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- prompt_log.md: submission-src/ai/prompt_log.md
- 04_test_cases.md: submission-src/features/A/04_test_cases.md
- 03_boundary_value_analysis.md: submission-src/features/A/03_boundary_value_analysis.md
- 02_domain_model.md: submission-src/features/A/02_domain_model.md
- 01_spec_and_oracle.md: submission-src/features/A/01_spec_and_oracle.md

## My request:
bước tiếp theo làm gì, đã xong feature này chưa
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Chưa xong toàn bộ feature `A-FR03`; hiện đã hoàn thành **giai đoạn phân tích và thiết kế test**.

Tiến độ theo workflow 7 bước:

- Step 1 — Spec và oracle: xong, đã commit.
- Step 2 — Domain model: xong, đã commit.
- Step 3 — BVA: xong, đã commit.
- Step 4 — Test case và review: xong nội dung, **chưa commit**.
- Step 5 — Thực thi và evidence: chưa làm.
- Step 6 — Bug report và AI gap: chưa làm.
- Step 7 — Hoàn thiện báo cáo và traceability: chưa làm.

Như vậy, nếu tính bảy bước ngang nhau thì feature đang ở khoảng **57% (4/7)**. Đây là tiến độ công việc, không phải phần trăm điểm.

Bước tiếp theo ngay lúc này là **commit Step 4** với message:

`test(A-FR03): step 4 review and finalize test cases`

Các file phù hợp cho checkpoint này:

- `features/A/04_test_cases.md`
- `ai/AI-02_AI_Audit_Report_Working.docx`
- `ai/prompt_log.md`

Sau commit mới sang Step 5: thực thi 38 test case, chụp evidence có Test ID, ghi actual result và tạo `features/A/05_execution_results.md`. Hiện thống kê là **38 designed, 0 executed, 0 passed, 0 failed**; trong đó `A-TC-014` đã được nhận diện là chưa thể chạy nếu chưa có expiry fixture hoặc lifetime chính thức.

Feature chỉ được xem là hoàn tất sau Step 7, khi kết quả thực thi, bug/AI gap, báo cáo và traceability đều đã khóa.
````

### Human review

- Trạng thái: Không áp dụng — chỉ báo tiến độ và workflow.
- AI-02: Không thêm dòng.

---

## S001-I023 — Tạo Boundary Value Analysis cho A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T20:53:00.1137768+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | ART019 — `features/A/03_boundary_value_analysis.md` |
| AI-02 | Có — một dòng `ART019`, trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- 02_domain_model.md: submission-src/features/A/02_domain_model.md
- 01_spec_and_oracle.md: submission-src/features/A/01_spec_and_oracle.md

## My request:
Hãy tiến hành tạo file BVA cho tính năng ở pool A dựa vào 2 file trước đó và những BR bạn đã tìm hiểu
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [03_boundary_value_analysis.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/03_boundary_value_analysis.md) cho Pool A.

File gồm:

- 10 boundary ID `A-B01`–`A-B10`.
- Bộ giá trị `B-1/B/B+1` cho OTP length `5/6/7` và password length `7/8/9`.
- Boundary `0/1/2` cho số chữ hoa, chữ thường, chữ số và allowed special.
- Relational boundary cho password–confirm.
- Phân loại rõ OTP expiry, email length và password max length là chưa thể định lượng hoặc không được SRS quy định.
- Traceability giải thích đủ `A-R01`–`A-R14` và quy tắc chuyển dữ liệu BVA sang Step 4.

Mình đã kiểm tra tự động length và số nhóm ký tự của toàn bộ password candidate; tất cả đều khớp bảng. File không tự đặt OTP lifetime, max length hay exact error message.

Trạng thái hiện tại là `PENDING HUMAN REVIEW`. Prompt đã được ghi thành `S001-I023`; AI-02 có đúng một dòng mới `ART019` cùng trạng thái. Chưa commit và chưa tạo test case. Bạn cần kiểm tra checklist ở mục 12 trước khi chuyển sang Step 4.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: nguồn boundary, dữ liệu cô lập từng characteristic, relational boundary và traceability.
- AI-02: Đã thêm đúng một dòng `ART019` vì BVA là artifact trực tiếp của bài nộp.

---

## S001-I024 — Xác nhận checkpoint commit sau BVA

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T21:03:11.1528426+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | Không có — tư vấn workflow và Git |
| AI-02 | Không — không tạo artifact trực tiếp mới |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- 03_boundary_value_analysis.md: submission-src/features/A/03_boundary_value_analysis.md
- 02_domain_model.md: submission-src/features/A/02_domain_model.md
- 01_spec_and_oracle.md: submission-src/features/A/01_spec_and_oracle.md

## My request:
bước tiếp theo làm gì, commit được chưa
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã đủ điều kiện commit và **nên commit trước khi sang Step 4**.

Tuy nhiên, working tree hiện chứa thay đổi của nhiều bước nên không nên gom thành một commit. Theo quy ước của skill commit, nên tạo lần lượt:

1. `test(A-FR03): refine step 1 oracle from project source`
   - `features/A/01_spec_and_oracle.md`
2. `test(A-FR03): step 2 model input domains`
   - `features/A/02_domain_model.md`
3. `test(A-FR03): step 3 derive boundary cases`
   - `features/A/03_boundary_value_analysis.md`
   - `ai/AI-02_AI_Audit_Report_Working.docx`
   - `ai/prompt_log.md`

Không đưa các file build tạm sau vào commit:

- `report/latex/HW02_Report_Draft.pdf`
- `report/latex/main.pdf`
- `report/latex/main.synctex(busy)`

Bước tiếp theo sau checkpoint là **Step 4 — thiết kế và review test case**, tạo file:

`features/A/04_test_cases.md`

File đó sẽ chuyển các partition và boundary đã duyệt thành test case có ID, precondition, input, procedure, expected result và traceability. Chưa ghi actual result ở Step 4; actual result và evidence thuộc Step 5.

Mình chưa thực hiện commit vì bạn mới hỏi mức độ sẵn sàng, chưa yêu cầu commit trực tiếp.
````

### Human review

- Trạng thái: Không áp dụng — tư vấn checkpoint và bước tiếp theo.
- AI-02: Không thêm dòng.

---

## S001-I027 — Triển khai và thực thi Step 5 cho A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T21:35:42.1737651+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | `ART021` |
| AI-02 | Có — tạo artifact trực tiếp cho bài nộp; trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- prompt_log.md: submission-src/ai/prompt_log.md
- 04_test_cases.md: submission-src/features/A/04_test_cases.md
- 03_boundary_value_analysis.md: submission-src/features/A/03_boundary_value_analysis.md
- 02_domain_model.md: submission-src/features/A/02_domain_model.md
- 01_spec_and_oracle.md: submission-src/features/A/01_spec_and_oracle.md

## My request:
Hãy triển khai toàn bộ Step 5 cho A-FR03. Tạo Playwright automation trong
submission-src/automation/A-FR03, không sửa source SHOP. Tạo fixture SQLite,
chạy tuần tự toàn bộ 38 test case trong 04\_test\_cases.md, tự khởi động backend
và frontend, lưu screenshot/trace vào evidence/A/execution, xuất results.json
và tạo features/A/05\_execution\_results.md. Case không thể chạy phải ghi BLOCKED
và giải thích, không thay đổi expected result để ép test pass. Cập nhật prompt
log và AI-02 theo skill. Chưa commit sau khi chạy để tôi review kết quả.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã hoàn tất toàn bộ Step 5 cho `A-FR03` và **chưa commit**.

Kết quả chạy tuần tự 38 test case:

- `PASS`: 1 — `A-TC-002`
- `FAIL`: 8 — `A-TC-001`, `A-TC-003`, `A-TC-004`, `A-TC-034`–`A-TC-038`
- `BLOCKED`: 29 — `A-TC-005`–`A-TC-033`
- `NOT RUN`: 0

Blocker chính là UI Bước 2 không có trường `confirmPassword`, nên 29 case không thể thiết lập đúng precondition/procedure đã review mà không sửa SUT. Riêng `A-TC-014` còn thiếu quy tắc thời hạn OTP và trạng thái expiry trong schema. Tôi không đổi expected result và không gọi API để thay thế luồng Web end-to-end.

Các artifact chính:

- [05_execution_results.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/05_execution_results.md)
- [results.json](D:/HCMUS/KCPM/HW2/submission-src/evidence/A/execution/results.json)
- [runner.mjs](D:/HCMUS/KCPM/HW2/submission-src/automation/A-FR03/runner.mjs)
- [README automation](D:/HCMUS/KCPM/HW2/submission-src/automation/A-FR03/README.md)
- [thư mục evidence](D:/HCMUS/KCPM/HW2/submission-src/evidence/A/execution)

Đã xác minh đủ 38 ID duy nhất, mọi đường dẫn evidence đều tồn tại, trace ZIP hợp lệ với 158 mục, cleanup đã khôi phục password và xóa reset token, backend/frontend do runner mở đã dừng. Không sửa source SHOP; quá trình khởi động backend của SUT có tái tạo file SQLite runtime, sau đó fixture đã khôi phục dữ liệu seed liên quan.

`prompt_log.md` đã thêm `S001-I027`; AI-02 đã thêm đúng một dòng `ART021` với trạng thái `PENDING HUMAN REVIEW`. Bước tiếp theo là bạn review checklist ở cuối `05_execution_results.md`, đặc biệt là phân loại 29 case `BLOCKED`, trước khi chuyển sang Step 6.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: automation, actual result, screenshot/trace, phân loại `PASS`/`FAIL`/`BLOCKED`, blocker dùng chung và cleanup fixture.
- AI-02: Đã thêm đúng một dòng `ART021` cho toàn bộ artifact Step 5 của A-FR03.

---

## S001-I028 — Review Step 5 và triển khai Step 6 cho A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T21:43:58.4274342+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | `ART022` |
| AI-02 | Có — tạo/thay đổi artifact trực tiếp cho bài nộp; trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- runner.mjs: submission-src/automation/A-FR03/runner.mjs
- database.mjs: submission-src/automation/A-FR03/fixtures/database.mjs
- prompt_log.md: submission-src/ai/prompt_log.md
- 04_test_cases.md: submission-src/features/A/04_test_cases.md
- 03_boundary_value_analysis.md: submission-src/features/A/03_boundary_value_analysis.md

## My request:
Hãy triển khai toàn bộ Step 6 cho feature A-FR03 dựa trên các tài liệu đã review và kết quả thực thi hiện tại:

- features/A/01\_spec\_and\_oracle.md
- features/A/02\_domain\_model.md
- features/A/03\_boundary\_value\_analysis.md
- features/A/04\_test\_cases.md
- features/A/05\_execution\_results.md
- evidence/A/execution/results.json
- toàn bộ screenshot và trace trong evidence/A/execution
- source code liên quan trong SHOP

Yêu cầu:

1. Trước tiên kiểm tra tính nhất quán giữa expected result, actual result và evidence của Step 5. Không thay đổi expected result để hợp thức hóa hành vi hiện tại của SUT.

2. Chuyển trạng thái Step 5 thành REVIEWED nếu kết quả và evidence nhất quán. Nếu phát hiện sai lệch, hãy báo rõ và chỉ sửa tài liệu/kết quả bị sai sau khi có căn cứ.

3. Tạo tài liệu bug report cho A-FR03 theo đúng cấu trúc và quy ước trong kế hoạch. Không mặc định mỗi test FAIL là một bug riêng:

   - Nhóm các test case có cùng root cause thành một defect.
   - Mỗi defect phải có ID, tiêu đề, test case liên quan, requirement liên quan, môi trường, precondition, bước tái hiện, expected result, actual result, severity, priority, evidence và trạng thái.
   - Phân biệt rõ defect của SUT với hạn chế của test environment hoặc thiếu requirement.
   - Không ghi các case BLOCKED thành bug nếu chưa có bằng chứng về defect.
   - Dẫn đúng đường dẫn screenshot, trace và results.json.

4. Tạo tài liệu AI gap analysis cho A-FR03:

   - So sánh đặc tả/oracle đã review với hành vi thực tế của SUT.
   - Phân tích các khoảng cách giữa requirement, UI, backend, database và testability.
   - Phân biệt confirmed defect, requirement gap, implementation gap, testability gap và blocked condition.
   - Trình bày ảnh hưởng của từng gap đến các test case.
   - Không tự đặt thêm business rule chưa có căn cứ.
   - Đề xuất cách xử lý nhưng không sửa source SHOP.

5. Kiểm tra source SHOP ở chế độ read-only để xác định root cause có căn cứ cho từng defect. Ghi rõ file và đoạn logic liên quan nếu xác định được, nhưng không chỉnh sửa source code.

6. Cập nhật traceability để liên kết:
   requirement → boundary/partition → test case → execution result → defect/gap → evidence.

7. Cập nhật phần tương ứng của báo cáo LaTeX nếu Step 6 theo kế hoạch yêu cầu. Không thay đổi template hoặc các phần ngoài phạm vi Pool A.

8. Cập nhật prompt\_log.md và thêm đúng một dòng vào AI-02 theo skill vì thao tác này tạo artifact trực tiếp cho bài nộp. Giữ trạng thái các artifact mới là PENDING HUMAN REVIEW.

9. Không commit sau khi hoàn thành để tôi review.

Cuối cùng, hãy báo:

- Danh sách file đã tạo hoặc sửa.
- Số defect được xác nhận và test case liên quan.
- Số requirement/implementation/testability gap.
- Những nội dung vẫn còn BLOCKED hoặc cần tôi xác nhận.
- Checklist cụ thể để tôi review Step 6.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã hoàn tất Step 6 cho `A-FR03` và **chưa commit**. Trong Step 6 tôi chỉ đọc source SHOP, không chỉnh sửa file nào trong đó.

Kết quả chính:

- 8 confirmed defect từ 8 test case FAIL; các observation cùng root cause đã được gom lại.
- 1 requirement gap: SRS thiếu duration và quy tắc inclusive/exclusive của OTP expiry.
- 4 implementation gap bổ sung: sai password regex, thiếu expiry state/check, lưu password plaintext và backend không kiểm tra password policy.
- 1 testability gap: thiếu `confirmPassword`, làm `A-TC-005`–`A-TC-033` không thể chạy đúng procedure Web.
- 2 blocked condition: thiếu confirm control; riêng `A-TC-014` còn thiếu expiry rule/state/fixture.

Các file đã tạo hoặc sửa:

- [05_execution_results.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/05_execution_results.md) — đã chuyển thành `REVIEWED — EVIDENCE/SOURCE CROSS-CHECKED`.
- [A-FR03_bug_report.md](D:/HCMUS/KCPM/HW2/submission-src/bugs/A-FR03_bug_report.md) — 8 defect đầy đủ field, source root cause và evidence.
- [06_ai_gap_analysis.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/06_ai_gap_analysis.md) — gap analysis và traceability `requirement → boundary/partition → test → result → defect/gap → evidence`.
- [06_ai_gap_analysis.tex](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/06_ai_gap_analysis.tex) và [07_bug_report.tex](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/07_bug_report.tex) — phần báo cáo Pool A.
- `prompt_log.md` đã thêm `S001-I028`; AI-02 đã thêm đúng một dòng `ART022` ở trạng thái `PENDING HUMAN REVIEW`.

Ánh xạ defect nổi bật: `A-BUG-001` ↔ `A-TC-001`; `A-BUG-002` ↔ `003/035`; `A-BUG-003` ↔ `004/036`; `A-BUG-004` ↔ `034`; `A-BUG-005` ↔ `035`; `A-BUG-006` ↔ `035/038`; `A-BUG-007` và `008` ↔ `037`. Các case `BLOCKED` không bị biến thành defect hoặc FAIL.

Đã kiểm tra đủ 8 Bug ID duy nhất, đủ field bắt buộc, đủ ánh xạ cho tám case FAIL và đủ `A-R01`–`A-R14`. Báo cáo XeLaTeX biên dịch thành công 18 trang; `main.pdf` chỉ là build kiểm tra và chưa được commit.

Checklist bạn cần review:

- Xác nhận cách nhóm 8 root cause và severity/priority.
- Mở evidence/trace, ưu tiên hai defect Major: `A-BUG-001` và `A-BUG-006`.
- Xác nhận 4 implementation gap chỉ là static finding, chưa phải execution FAIL.
- Xác nhận 29 case vẫn `BLOCKED` và không đổi expected result.
- Xác nhận traceability và requirement gap OTP expiry.
- Sau khi đồng ý, đổi `ART022` sang verdict phù hợp rồi commit Step 5–6 trước khi sang Step 7.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: defect grouping, severity/priority, static implementation gap, blocked classification, traceability và nội dung hai chapter LaTeX.
- AI-02: Đã thêm đúng một dòng `ART022` cho artifact logic Step 6.

---

## S001-I029 — Hoàn thiện Step 7 và chốt kỹ thuật A-FR03

| Trường thông tin | Giá trị |
|---|---|
| Ngày giờ | 2026-10-12T21:51:19.7242164+07:00 |
| Công cụ AI | OpenAI Codex |
| Model / mức reasoning | `gpt-5.6-sol` / `medium` |
| Artifact ID | `ART023` |
| AI-02 | Có — tạo/thay đổi artifact trực tiếp cho bài nộp; trạng thái `PENDING HUMAN REVIEW` |

### Prompt của người dùng — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- runner.mjs: submission-src/automation/A-FR03/runner.mjs
- database.mjs: submission-src/automation/A-FR03/fixtures/database.mjs
- prompt_log.md: submission-src/ai/prompt_log.md
- 04_test_cases.md: submission-src/features/A/04_test_cases.md
- 03_boundary_value_analysis.md: submission-src/features/A/03_boundary_value_analysis.md

## My request:
Hãy triển khai toàn bộ Step 7 và chốt nội dung kỹ thuật của feature A-FR03 dựa trên các artifact hiện có:

- features/A/01\_spec\_and\_oracle.md
- features/A/02\_domain\_model.md
- features/A/03\_boundary\_value\_analysis.md
- features/A/04\_test\_cases.md
- features/A/05\_execution\_results.md
- features/A/06\_ai\_gap\_analysis.md
- bugs/A-FR03\_bug\_report.md
- evidence/A/execution/results.json
- toàn bộ screenshot, trace và service log trong evidence/A/execution
- automation/A-FR03
- supporting/scope.md
- supporting/environment.md
- report/latex

Yêu cầu:

1. Kiểm tra tính nhất quán cuối cùng giữa:
   requirement/oracle → partition/boundary → test case → execution result → defect/gap → evidence.

2. Không thay đổi expected result, actual result hoặc trạng thái PASS/FAIL/BLOCKED để làm kết quả đẹp hơn. Giữ nguyên thống kê đã xác nhận:

   - Designed: 38
   - Executed: 9
   - Passed: 1
   - Failed: 8
   - Blocked: 29
   - Not Run: 0

3. Kiểm tra tài liệu Step 6:

   - 8 confirmed defect đã được nhóm theo root cause.
   - 1 requirement gap.
   - 4 implementation gap bổ sung.
   - 1 testability gap.
   - 2 blocked condition.
     Nếu phát hiện sai lệch, báo rõ và chỉ sửa khi có bằng chứng từ requirement, source hoặc evidence.

4. Tạo hoặc cập nhật traceability matrix tổng thể cho Pool A. Ma trận phải liên kết đầy đủ:
   requirement ID → partition ID → boundary ID → test case ID → execution status → defect/gap ID → evidence path.

5. Ma trận phải bao phủ:

   - `A-R01`–`A-R14`
   - `A-B01`–`A-B10`
   - `A-TC-001`–`A-TC-038`
   - `A-BUG-001`–`A-BUG-008`
   - các requirement, implementation và testability gap của Step 6.

6. Tạo `features/A/07_feature_closure.md`, gồm:

   - Phạm vi feature.
   - Baseline và môi trường.
   - Các kỹ thuật Domain Testing/BVA đã sử dụng.
   - Thống kê test cuối cùng.
   - Danh sách defect và gap.
   - Danh sách case BLOCKED và điều kiện để chạy lại.
   - Coverage summary.
   - Residual risk.
   - Những nội dung không được kiểm chứng.
   - Danh sách artifact/evidence.
   - Kết luận mức độ hoàn thành feature.
   - Checklist human sign-off.

7. Không tuyên bố feature hoạt động đúng hoặc test coverage đạt 100% khi còn 29 case BLOCKED. Kết luận phù hợp phải phân biệt:

   - Hoàn thành workflow kiểm thử theo phạm vi hiện tại.
   - Chưa xác nhận đầy đủ chất lượng SUT do các blocked condition.
   - Cần regression sau khi SUT bổ sung confirm password và OTP expiry.

8. Hoàn thiện chương Pool A trong báo cáo LaTeX:

   - Đặc tả và oracle chính.
   - Domain model và boundary quan trọng.
   - Thiết kế 38 test case.
   - Phương pháp automation và SQLite fixture.
   - Thống kê execution.
   - Các defect chính.
   - AI gap analysis.
   - Traceability và residual risk.
   - Dẫn các screenshot evidence phù hợp.
     Không sửa nội dung Pool B, C hoặc D và không thay đổi template chung ngoài phần cần thiết.

9. Cập nhật phần Test Summary/Self-assessment và Conclusion chỉ với dữ liệu Pool A đã có thật. Không suy diễn kết quả cho các Pool chưa thực hiện.

10. Kiểm tra mọi đường dẫn evidence và artifact. Không đưa `node_modules`, database runtime, file Synctex hoặc build tạm vào danh sách file cần commit.

11. Render báo cáo bằng XeLaTeX và kiểm tra:

    - Không có lỗi biên dịch.
    - Bảng/ảnh không tràn trang nghiêm trọng.
    - Không có placeholder còn sót trong phần Pool A.
    - Các caption và đường dẫn evidence đúng.
      File PDF chỉ dùng để review, chưa commit nếu quy ước repository không yêu cầu.

12. Không sửa source SHOP và không chạy lại test nếu dữ liệu Step 5 vẫn nhất quán.

13. Cập nhật prompt\_log.md và thêm đúng một dòng AI-02 cho toàn bộ artifact logic của Step 7 theo skill. Artifact mới giữ trạng thái `PENDING HUMAN REVIEW`.
    Không tự đổi verdict của `ART021` hoặc `ART022`; việc chuyển chúng thành `VALID`, `INVALID` hoặc `INCOMPLETE` cần quyết định rõ ràng của tôi.

14. Không commit sau khi hoàn thành để tôi review.

Cuối cùng hãy báo:

- Danh sách file đã tạo hoặc sửa.
- Trạng thái coverage và traceability.
- Kết luận chính xác feature A đã hoàn thành ở mức nào.
- Residual risk và những nội dung vẫn chưa kiểm chứng.
- Kết quả render báo cáo.
- Danh sách file nên commit sau khi tôi review.
- Checklist human sign-off cuối cùng.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã hoàn tất Step 7 về mặt kỹ thuật và **chưa commit**. Feature A hiện ở trạng thái `TECHNICALLY COMPLETE — PENDING HUMAN SIGN-OFF`, không phải “SUT đã Pass”.

Các file chính đã tạo hoặc sửa:

- [07_traceability_matrix.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/07_traceability_matrix.md)
- [07_feature_closure.md](D:/HCMUS/KCPM/HW2/submission-src/features/A/07_feature_closure.md)
- [02_feature_a.tex](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/02_feature_a.tex)
- [10_test_summary_self_assessment.tex](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/10_test_summary_self_assessment.tex)
- [11_conclusion.tex](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/11_conclusion.tex)
- Các artifact Step 5–6 đang chờ commit: automation, evidence, `05_execution_results.md`, `06_ai_gap_analysis.md`, bug report và hai chapter AI gap/Bug Report.
- `prompt_log.md` đã thêm `S001-I029`; AI-02 có đúng một dòng mới `ART023` ở trạng thái `PENDING HUMAN REVIEW`. `ART021` và `ART022` không bị đổi verdict.

Coverage và traceability đã kiểm tra:

- Đúng 38/38 Test ID duy nhất; không có status lệch `results.json`.
- Bao phủ thiết kế `14/14` rule `A-R01`–`A-R14`.
- Ghi đủ trạng thái `A-B01`–`A-B10`; `A-B09/10` không tạo BVA case vì SRS không quy định boundary.
- Truy vết đủ `A-BUG-001`–`A-BUG-008` và toàn bộ gap Step 6.
- Execution coverage chỉ `9/38 = 23.68%`: `1 PASS / 8 FAIL / 29 BLOCKED / 0 NOT RUN`.

Residual risk vẫn **cao**. Chưa kiểm chứng end-to-end reset nominal, OTP format/value/binding/lifecycle, password boundaries, confirm equality, one-time use và password storage. `A-TC-014` còn thiếu OTP lifetime cùng expiry state/fixture. Cần regression đủ 29 case sau khi bổ sung confirm password và OTP expiry.

Báo cáo XeLaTeX render thành công [main.pdf](D:/HCMUS/KCPM/HW2/submission-src/report/latex/main.pdf), 20 trang. Không có lỗi hoặc overfull box; chỉ còn một cảnh báo underfull nhỏ trong bảng domain, không gây tràn trang. Tôi đã kiểm tra trực quan bốn trang Pool A; ảnh, bảng và caption hiển thị đúng. PDF và Synctex là build review, không đưa vào commit.

Sau khi bạn review, các nhóm file nên commit là:

1. Step 5: `automation/A-FR03/`, `evidence/A/execution/`, `features/A/05_execution_results.md`.
2. Step 6: `bugs/A-FR03_bug_report.md`, `features/A/06_ai_gap_analysis.md`, chapter `06_ai_gap_analysis.tex` và `07_bug_report.tex`.
3. Step 7: hai file `features/A/07_*`, chapter `02_feature_a.tex`, `10_test_summary_self_assessment.tex`, `11_conclusion.tex`, cùng `ai/prompt_log.md` và working AI-02.

Không commit `report/latex/main.pdf`, `HW02_Report_Draft.pdf`, `main.synctex(busy)`, `node_modules` hay `SHOP/backend/database.sqlite`.

Checklist human sign-off cuối:

- Xác nhận thống kê `38/9/1/8/29/0` và 8 defect.
- Kiểm tra ma trận đủ 38 case, 14 rule, 10 boundary và mọi evidence path.
- Xác nhận residual risk cùng các nội dung chưa kiểm chứng.
- Review nội dung và bố cục PDF, đặc biệt bốn trang Pool A.
- Quyết định verdict cho `ART021`, `ART022`, `ART023`.
- Sau khi chấp nhận, đổi closure sang `HUMAN APPROVED` rồi commit ba checkpoint Step 5–7.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: traceability, coverage wording, residual risk, report render, closure conclusion và phạm vi file commit.
- AI-02: Đã thêm đúng một dòng `ART023` cho artifact logic Step 7; không đổi `ART021`/`ART022`.

## S001-I030 — Tạo ba skill tái sử dụng cho Domain Testing

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 10:31:43 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART024`, `ART025`, `ART026` |
| AI-02 | Có — ba skill là ba artifact logic trực tiếp của bài nộp; đều `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
tạo cho tôi các skill `domain-testing-feature-workflow`  , `domain-model-and-bva`  , `playwright-domain-test-runner`
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo xong ba skill trong `submission-src/skills/`:

- [domain-testing-feature-workflow](D:/HCMUS/KCPM/HW2/submission-src/skills/domain-testing-feature-workflow/SKILL.md): điều phối quy trình 7 bước, review gate, trạng thái artifact, traceability và closure.
- [domain-model-and-bva](D:/HCMUS/KCPM/HW2/submission-src/skills/domain-model-and-bva/SKILL.md): xây dựng domain model, equivalence partition, BVA và kiểm soát requirement gap.
- [playwright-domain-test-runner](D:/HCMUS/KCPM/HW2/submission-src/skills/playwright-domain-test-runner/SKILL.md): triển khai Playwright, fixture cô lập, quản lý service, verdict và evidence có thể kiểm toán.

Mỗi skill gồm `SKILL.md`, `agents/openai.yaml` và một reference chuyên biệt. Tổng cộng có 9 file mới.

Kiểm tra đã thực hiện:

- Cả ba skill đều đạt kiểm tra thủ công về frontmatter, tên skill, description, metadata, default prompt, reference link và placeholder.
- `git diff --check` không phát hiện lỗi whitespace.
- Validator chuẩn `quick_validate.py` chưa chạy được vì môi trường thiếu `PyYAML`; tôi không tự cài thêm dependency. Việc này không làm thay đổi kết quả kiểm tra cấu trúc thủ công.
- Không sửa source `SHOP` và chưa commit.

Đã ghi tương tác thành `S001-I030`. AI-02 có ba dòng mới:

- `ART024`: `domain-testing-feature-workflow`
- `ART025`: `domain-model-and-bva`
- `ART026`: `playwright-domain-test-runner`

Cả ba đang ở trạng thái `PENDING HUMAN REVIEW`. Các PDF/build file đang có từ trước vẫn được giữ ngoài phạm vi thay đổi.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: workflow gate, quy tắc domain/BVA, fixture/service lifecycle, verdict và evidence contract.
- AI-02: Đã thêm đúng ba dòng `ART024`–`ART026`, mỗi dòng tương ứng một skill.

## S001-I031 — Tạo đặc tả và test oracle cho B-FR09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 10:39:56 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART027` — `features/B/01_spec_and_oracle.md` |
| AI-02 | Có — artifact đặc tả trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
Dựa vào những skill đang có và bối cảnh dự án hãy&#x20;

Tạo features/B/01\_spec\_and\_oracle.md.

- Đọc source SHOP liên quan đến coupon: UI, API, controller, validation và database.
- Xác định business rule, input, precondition, expected result.
- Phân biệt rule có căn cứ, hành vi hiện tại và requirement gap.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [01_spec_and_oracle.md](D:/HCMUS/KCPM/HW2/submission-src/features/B/01_spec_and_oracle.md) cho `B-FR09`. Trạng thái hiện tại là `PENDING HUMAN REVIEW`, nên chưa qua gate để tạo Domain Model.

Nội dung chính:

- Xác định đúng phạm vi Web checkout; loại Coupon CRUD của Admin và Mobile coupon khỏi Pool B.
- Đối chiếu SRS, API contract, toàn bộ Web UI liên quan, authentication/cart state, Backend và database.
- Mô hình sơ bộ 9 input/state/configuration domain.
- Xác lập `B-R01`–`B-R19`, bao phủ năm điều kiện C1–C5, công thức percent/fixed, tổng tiền đáng tin cậy và GUI rule liên quan.
- Ghi `B-GAP-R01`–`B-GAP-R07` cho case sensitivity/length của code, rounding, giới hạn discount, expiry timezone, HTTP response, thời điểm ghi usage và code rỗng.
- Ghi 11 candidate discrepancy của implementation, chưa coi là confirmed bug.

Các sai lệch đáng chú ý chờ execution gồm:

- Backend dùng `>` thay vì `>=` tại minimum order.
- Công thức percent hiện dùng `total × (1 - discount_value)`.
- `/api/apply-coupon` không xác thực JWT và tin `user_id` từ body.
- Web cho sửa tổng tiền; Backend không tính lại tổng từ giỏ.
- Checkout route có thể truy cập trực tiếp khi chưa đăng nhập.

Kiểm tra cấu trúc đã đạt: 19 Rule ID và 7 Gap ID đều duy nhất, mọi source path được dẫn đều tồn tại và `git diff --check` không phát hiện lỗi. Không sửa source `SHOP` và chưa commit.

Tương tác được ghi thành `S001-I031`; AI-02 có một dòng mới `ART027` ở trạng thái `PENDING HUMAN REVIEW`. Bước tiếp theo là bạn kiểm tra checklist mục 12, sau đó mới chuyển tài liệu sang `REVIEWED` và tạo `features/B/02_domain_model.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: phạm vi Web checkout, `B-R01`–`B-R19`, `B-GAP-R01`–`B-GAP-R07` và 11 candidate discrepancy.
- AI-02: Đã thêm đúng một dòng `ART027` cho artifact Step 1 của B-FR09.

## S001-I032 — Xác nhận human review cho các artifact mới

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 10:45:36 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact được review | `ART024`, `ART025`, `ART026`, `ART027` |
| AI-02 | Cập nhật bốn dòng hiện có sang `VALID`; không thêm Artifact ID mới |

### Prompt của sinh viên — nguyên văn

````text
tôi đã review qua, hãy tick xác nhận các file đã tạo
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã ghi nhận human review và xác nhận toàn bộ artifact mới:

- [01_spec_and_oracle.md](D:/HCMUS/KCPM/HW2/submission-src/features/B/01_spec_and_oracle.md) đã chuyển sang `REVIEWED — HUMAN APPROVED`.
- Cả 8 mục trong checklist Step 1 đã được tick `[x]`.
- Không thay đổi `B-R01`–`B-R19`, các expected result, gap hoặc candidate discrepancy.
- `ART024`, `ART025`, `ART026` và `ART027` trong AI-02 đã chuyển từ `PENDING HUMAN REVIEW` sang `VALID`; mỗi Artifact ID vẫn xuất hiện đúng một lần.
- Không tạo dòng AI-02 mới cho thao tác review này.

Step 1 của `B-FR09` đã qua review gate. Bước tiếp theo hợp lệ là tạo `features/B/02_domain_model.md` dựa trên 19 rule và 7 requirement gap đã được chấp nhận. Chưa commit các thay đổi.
````

### Human review

- Trạng thái: Đã xác nhận.
- AI-02: `ART024`–`ART027` đều `VALID`; không có Artifact ID mới.

## S001-I033 — Tạo Domain Model cho B-FR09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 10:51:18 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART028` — `features/B/02_domain_model.md` |
| AI-02 | Có — artifact Domain Model trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
Tạo features/B/02\_domain\_model.md. và mô hình hóa những đối tượng cần thiết cho BR này
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [02_domain_model.md](D:/HCMUS/KCPM/HW2/submission-src/features/B/02_domain_model.md) cho `B-FR09`.

Mô hình gồm:

- 8 đối tượng nghiệp vụ: authenticated user, cart/pricing context, coupon, coupon usage, coupon application, discount result, Web view và evaluation clock.
- 17 biến domain, tách rõ input, authentication/state, cấu hình coupon, phép tính và UI output.
- 36 partition cốt lõi cho eligibility, configuration, arithmetic và composite decision; thêm 12 UI conformance partition.
- Predicate trung tâm: `COUPON_ELIGIBLE = C1 ∧ C2 ∧ C3 ∧ C4 ∧ C5`.
- Trust boundary bắt buộc: user identity lấy từ JWT và tổng tiền phải do Backend tính lại, không tin dữ liệu client.
- State model cho quá trình apply/reject và usage limit.
- Traceability đủ `19/19` business rule.
- Giữ nguyên cả 7 requirement gap; không tự đặt rounding, discount cap, timezone, code normalization hoặc thời điểm tăng usage.

File chưa chọn giá trị BVA và chưa sinh test case. Kiểm tra cấu trúc xác nhận các Object ID, Variable ID, Rule ID, Gap ID và 36 Partition ID cốt lõi đều duy nhất; `git diff --check` không phát hiện lỗi.

Trạng thái là `PENDING HUMAN REVIEW`. Tương tác được ghi thành `S001-I033`; AI-02 có một dòng mới `ART028` cùng trạng thái. Chưa commit. Sau khi bạn kiểm tra 10 mục tại phần 15 và chuyển tài liệu sang `REVIEWED`, bước tiếp theo mới là `features/B/03_boundary_value_analysis.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: 8 object, 17 variable, partition C1–C5, trust boundary, formula, traceability và 7 requirement gap.
- AI-02: Đã thêm đúng một dòng `ART028` cho Domain Model của B-FR09.

## S001-I034 — Tạo Equivalence Partitioning và BVA cho B-FR09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 11:00:09 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART029` — `features/B/03_boundary_value_analysis.md` |
| AI-02 | Có — artifact EP/BVA trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
dựa vào skill đã có hãy&#x20;

3. Equivalence Partitioning và BVA
   Tạo features/B/03\_boundary\_value\_analysis.md.
   - Chia valid/invalid partition.
   - Tìm boundary cho discount value, order value, ngày hiệu lực và usage limit.
   - Xử lý code rỗng, whitespace, trùng code, coupon hết hạn.
   - Không tự đặt giới hạn nếu source và tài liệu không quy định.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [03_boundary_value_analysis.md](D:/HCMUS/KCPM/HW2/submission-src/features/B/03_boundary_value_analysis.md) cho `B-FR09`.

Kết quả thiết kế:

- 33 partition cốt lõi và 12 UI conformance partition.
- 8 Boundary ID `B-B01`–`B-B08`.
- 21 candidate data row không trùng ID.
- Order threshold dùng `M-1/M/M+1`; tại `M` là hợp lệ.
- Usage dùng `L-1/L/L+1`; tại `L` là hết lượt và phải bị từ chối.
- Expiry dùng `E-δ/E/E+δ`; `δ` giữ symbolic đến khi fixture xác định timezone và granularity.
- Discount value dùng `-ε/0/+ε`; có fixture integer-compatible `-1/0/1` nhưng không suy diễn precision nghiệp vụ.
- Không tự đặt percent maximum, fixed-discount cap, final floor hoặc code-length boundary.

Code rỗng, whitespace và case/trim được phân loại `UNRESOLVED` vì SRS chưa quy định expected result. Duplicate code được xác định là `INVALID CONFIGURATION` theo FR-17 và schema `UNIQUE`; không phá constraint để đoán coupon nào được chọn. Coupon hết hạn có cả clear expired partition và ba logical point sát expiry.

Traceability bao phủ `19/19` business rule. Kiểm tra cấu trúc xác nhận 8 Boundary ID, 21 Data ID và 33 core Partition ID đều duy nhất; `git diff --check` không phát hiện lỗi.

Trạng thái hiện tại là `PENDING HUMAN REVIEW`. Tương tác được ghi thành `S001-I034`; AI-02 có một dòng mới `ART029` cùng trạng thái. Chưa commit. Sau khi bạn kiểm tra 10 mục ở phần 15 và chuyển file sang `REVIEWED`, bước tiếp theo mới là `features/B/04_test_cases.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: partition classification, 8 boundary, 21 data row, symbolic `δ/ε`, code gap và traceability.
- AI-02: Đã thêm đúng một dòng `ART029` cho EP/BVA của B-FR09.

## S001-I035 — Thiết kế test case Step 4 cho B-FR09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 11:10:18 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART030` — `features/B/04_test_cases.md` |
| AI-02 | Có — artifact thiết kế test case trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
dựa vào các skill và ngữ cảnh dự án hãy tạo file thiết kế testcase ứng với step 4
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [04_test_cases.md](D:/HCMUS/KCPM/HW2/submission-src/features/B/04_test_cases.md) cho Step 4 của `B-FR09`.

Nội dung gồm 41 test case chính (`B-TC-001`–`B-TC-041`) và 9 supporting precondition check (`B-PC-01`–`B-PC-09`). Traceability đã bao phủ `19/19` business rule, `8/8` boundary và `7/7` requirement gap.

Ba case sát thời điểm hết hạn được đánh dấu cần controlled clock; bảy requirement-gap probe không bị gán expected result giả. File chỉ thiết kế test, chưa chạy test, chưa sửa source `SHOP` và chưa commit.

Trạng thái hiện tại là `PENDING HUMAN REVIEW`. Tương tác đã được ghi thành `S001-I035`; AI-02 có đúng một dòng mới `ART030`. Sau khi bạn review checklist ở cuối file và xác nhận, tài liệu mới nên chuyển sang `REVIEWED` rồi thực hiện Step 5 automation/execution.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: expected result, fixture, 41 test case, 9 precondition check, clock/gap handling và traceability.
- AI-02: Đã thêm đúng một dòng `ART030` cho thiết kế test case Step 4 của B-FR09.

## S001-I036 — Automation, execution, defect và gap analysis cho B-FR09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 21:22:03 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART031` — Step 5–6 của `B-FR09` |
| AI-02 | Có — automation, execution evidence, bug report và gap analysis là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
tạo&#x20;

Automation và Execution
Tạo:
automation/B-FR09/
evidence/B/execution/
features/B/05\_execution\_results.md

- Dùng Playwright.
- Tạo fixture SQLite cô lập.
- Không sửa source SHOP.
- Chạy đủ test theo thứ tự cần thiết.
- Ghi PASS, FAIL, BLOCKED hoặc NOT RUN.
- Lưu results.json, screenshot, trace và service log.

6. Defect và Gap Analysis
   Tạo:
   bugs/B-FR09\_bug\_report.md
   features/B/06\_ai\_gap\_analysis.md
   - Nhóm các case FAIL có cùng root cause.
   - Không mặc định một FAIL là một bug.
   - Phân biệt confirmed defect, requirement gap, implementation gap, testability gap và blocked condition.
   - Kiểm tra source read-only để tìm root cause.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thành Step 5 và Step 6 cho `B-FR09`.

Kết quả thực thi:

- 41 test case: `17 PASS`, `14 FAIL`, `10 BLOCKED`, `0 NOT RUN`.
- 9 supporting precondition check đều `PASS`, không tính vào 41 test case.
- Đã tạo đủ 41 screenshot, 41 Playwright trace, `results.json` và service log; mọi đường dẫn evidence tồn tại và trace ZIP mở được.
- 14 case FAIL được nhóm thành 9 confirmed defect theo root cause, không tính một FAIL thành một bug riêng.
- Gap analysis ghi nhận 7 requirement gap, 2 additional implementation risk chưa nâng thành defect, 1 testability gap và 3 blocked condition.

Artifact chính:

- [Automation B-FR09](D:/HCMUS/KCPM/HW2/submission-src/automation/B-FR09/README.md)
- [Kết quả Step 5](D:/HCMUS/KCPM/HW2/submission-src/features/B/05_execution_results.md)
- [results.json](D:/HCMUS/KCPM/HW2/submission-src/evidence/B/execution/results.json)
- [Bug report](D:/HCMUS/KCPM/HW2/submission-src/bugs/B-FR09_bug_report.md)
- [AI gap analysis](D:/HCMUS/KCPM/HW2/submission-src/features/B/06_ai_gap_analysis.md)

Các defect nghiêm trọng nhất là sai công thức percent, tin `total_amount` do client gửi, thiếu authentication ở apply-coupon và tin `user_id` trong body thay vì JWT. Ba nhóm BLOCKED liên quan code normalization/empty behavior, controlled clock và rounding/cap/floor oracle.

Source `SHOP` không được sửa; backend dùng bản sao runtime và SQLite fixture riêng. Port 3000/5173 đã được dừng sau execution. Do npm đang cache-only, lượt chạy này dùng junction tới Playwright đã cài ở Pool A; junction và runtime database đều bị ignore, còn manifest/lockfile tái hiện đã được lưu.

`04_test_cases.md` và Step 5 được ghi đúng là `REVIEWED — AI-DELEGATED`, không giả là human review. Bug report và gap analysis vẫn `PENDING HUMAN REVIEW`. Prompt được ghi thành `S001-I036`; AI-02 có đúng một dòng mới `ART031`. Chưa commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW` cho artifact Step 5–6.
- Cần kiểm tra: 9 defect, severity/priority, 7 requirement gap, 2 implementation risk, 1 testability gap, 3 blocked condition và evidence Critical/High.
- AI-02: Đã thêm đúng một dòng `ART031` cho toàn bộ artifact logic Step 5–6 của B-FR09.

## S001-I037 — Đặc tả và test oracle cho C-FR14

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 21:37:36 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART032` — `features/C/01_spec_and_oracle.md` |
| AI-02 | Có — artifact đặc tả trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
Tạo features/C/01\_spec\_and\_oracle.md.

- Đọc SRS và source SHOP liên quan đến Category CRUD.
- Kiểm tra Admin UI, API, controller, authentication và SQLite schema.
- Xác định rule cho Create, Read, Update, Delete.
- Phân biệt business rule, hành vi hiện tại và requirement gap.
- Chốt precondition, input và expected result.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [01_spec_and_oracle.md](D:/HCMUS/KCPM/HW2/submission-src/features/C/01_spec_and_oracle.md) cho `C-FR14`.

Nội dung đã chốt:

- Create, Read và Delete nằm trong phạm vi theo FR-14; Update giữ `UNRESOLVED` vì chỉ có trong tiêu đề/API/source, không có trong danh sách hành vi của SRS.
- 21 business/UI/security rule (`C-R01`–`C-R21`), 7 precondition và expected result cho các luồng chính.
- 12 quan sát implementation được tách riêng, chỉ là candidate discrepancy chờ execution, chưa ghi thành bug.
- 9 requirement gap (`C-GAP-R01`–`C-GAP-R09`), gồm whitespace/trim, duplicate, length, HTTP response, missing ID và xóa category đang được product tham chiếu.
- Source `SHOP` không bị sửa; `git diff --check` không phát hiện lỗi.

Tương tác được ghi thành `S001-I037`; AI-02 có đúng một dòng mới `ART032` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit. Bạn cần kiểm tra checklist mục 13 trước khi chuyển tài liệu sang `REVIEWED` và tạo `features/C/02_domain_model.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: phạm vi CRUD, 21 rule, 9 requirement gap, precondition, expected result và cách phân loại candidate discrepancy.
- AI-02: Đã thêm đúng một dòng `ART032` cho artifact Step 1 của C-FR14.

## S001-I038 — Domain Model cho C-FR14

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 21:44:37 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART033` — `features/C/02_domain_model.md` |
| AI-02 | Có — Domain Model là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
Tạo features/C/02\_domain\_model.md.

- Mô hình hóa Category, Admin identity, Category list và CRUD operation.
- Xác định các biến như category name, category ID, authentication, record existence và referenced products.
- Chia valid/invalid partition.
- Mô hình hóa state transition: nonexistent → created → updated → deleted.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [02_domain_model.md](D:/HCMUS/KCPM/HW2/submission-src/features/C/02_domain_model.md) cho `C-FR14`.

Nội dung gồm:

- 7 domain object và 20 biến cho Category, Admin identity, list, CRUD operation, repository, referenced products và Admin UI.
- 56 equivalence/composite partition thuộc các lớp `VALID`, `INVALID` và `UNRESOLVED`.
- 4 entity state và 10 transition, gồm cả `NONEXISTENT → CREATED → UPDATED → DELETED`.
- Update/`UPDATED` vẫn là `UNRESOLVED`; luồng có business oracle chính thức là `NONEXISTENT → CREATED → DELETED`.
- Traceability cấp domain bao phủ `21/21` rule và giữ nguyên 9 requirement gap.

`git diff --check` không phát hiện lỗi; source `SHOP` không bị sửa. Tương tác được ghi thành `S001-I038`; AI-02 có đúng một dòng mới `ART033` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit.

Lưu ý: Step 1 cũng vẫn đang `PENDING HUMAN REVIEW`. Bạn cần review cả hai checklist trước khi chuyển chúng sang `REVIEWED` và tạo `features/C/03_boundary_value_analysis.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: 7 object, 20 biến, 56 partition, 10 transition, Update unresolved, 21/21 traceability và 9 gap.
- AI-02: Đã thêm đúng một dòng `ART033` cho Domain Model của C-FR14.

## S001-I039 — Equivalence Partitioning và BVA cho C-FR14

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 21:48:18 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART034` — `features/C/03_boundary_value_analysis.md` |
| AI-02 | Có — EP/BVA là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
Tạo features/C/03\_boundary\_value\_analysis.md.

- Phân tích tên rỗng, whitespace, tên hợp lệ, tên trùng và ký tự đặc biệt.
- Phân tích độ dài tên nếu SRS hoặc source có giới hạn.
- Kiểm tra category ID hợp lệ, không tồn tại, âm, 0 và sai kiểu.
- Phân tích update/delete với category đang được product tham chiếu.
- Không tự đặt giới hạn độ dài hoặc duplicate rule nếu không có căn cứ.
````

### Phản hồi cuối của AI — nguyên văn

````markdown
Đã tạo [03_boundary_value_analysis.md](D:/HCMUS/KCPM/HW2/submission-src/features/C/03_boundary_value_analysis.md) cho `C-FR14`.

Kết quả phân tích gồm:

- 8 boundary (`C-B01`–`C-B08`) và 24 test-data candidate.
- 16 partition cho category name: missing/empty có oracle invalid; non-empty nominal hợp lệ; whitespace, duplicate và upper length giữ `UNRESOLVED`.
- 8 partition/probe cho ID: existing, nonexistent, `0`, âm, decimal, text, SQL-like và missing route segment.
- 7 tổ hợp Update/Delete × record existence × referenced products; Update và Delete referenced category không bị gán verdict giả.
- Không phát hiện `maxlength`, `UNIQUE`, backend length validation hoặc foreign key cho Category; không sao chép giới hạn 255 của Product sang Category.

Tôi cũng sửa một dòng trong [02_domain_model.md](D:/HCMUS/KCPM/HW2/submission-src/features/C/02_domain_model.md): một ký tự nằm phía non-empty có căn cứ, còn gap độ dài chỉ áp dụng cho upper/extreme length chưa được quy định.

`git diff --check` không phát hiện lỗi; source `SHOP` không bị sửa. Tương tác được ghi thành `S001-I039`; AI-02 có đúng một dòng mới `ART034` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit.

Step 1–3 hiện vẫn `PENDING HUMAN REVIEW`. Sau khi bạn kiểm tra checklist mục 15, có thể chuyển cả ba file sang `REVIEWED` rồi tạo `features/C/04_test_cases.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: 8 boundary, 24 data row, name/ID classification, referenced-product matrix và các gap không bị biến thành rule.
- AI-02: Đã thêm đúng một dòng `ART034` cho EP/BVA của C-FR14.

## S001-I040 — Thiết kế test case và thực thi C-FR14

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-13 22:55:47 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART035` — Step 4–5 của C-FR14 |
| AI-02 | Có — test design, automation, kết quả và evidence là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
Tạo features/C/04\_test\_cases.md.
Test case cần bao phủ:

- Hiển thị danh sách category.
- Create category hợp lệ và không hợp lệ.
- Update category hợp lệ và không hợp lệ.
- Delete category tồn tại và không tồn tại.
- Authentication và authorization của Admin.
- Category được product tham chiếu.
- Error placement, heading, breadcrumb, màu button và tab order.
- Traceability: rule → partition/boundary → test case.

5. Automation và Execution
   Tạo:
   - automation/C-FR14/
   - evidence/C/execution/
   - features/C/05\_execution\_results.md
     Thực hiện:
   - Dùng Playwright trên Admin Web.
   - Tạo SQLite fixture cô lập.
   - Tự khởi động Backend và Admin frontend.
   - Chạy tuần tự toàn bộ test case.
   - Ghi PASS, FAIL, BLOCKED hoặc NOT RUN.
   - Lưu results.json, screenshot, trace và service log.
   - Không sửa source SHOP.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thành Step 4 và Step 5 cho `C-FR14`; các artifact đang ở trạng thái `PENDING HUMAN REVIEW` và chưa commit.

Kết quả thực thi 48 test case:

- PASS: 18
- FAIL: 9
- BLOCKED: 21
- NOT RUN: 0

Các FAIL tập trung vào: empty state; backend/UI chấp nhận tên category thiếu hoặc rỗng; authorization theo role chưa được cưỡng chế ở API/Admin shell; thiếu required marker và inline error; heading chưa mô tả trang Category. Đây chưa được mặc định xem là 9 bug riêng — việc nhóm theo root cause thuộc Step 6.

Các BLOCKED chủ yếu do requirement chưa chốt cho whitespace/duplicate/case sensitivity/độ dài, chức năng Update không tồn tại, chính sách ID không tồn tại hoặc sai kiểu, chính sách xóa category đang được product tham chiếu, và breadcrumb không áp dụng theo requirement hiện có.

Đã tạo hoặc cập nhật:

- `features/C/04_test_cases.md`
- `automation/C-FR14/` (runner, SQLite fixture, cấu hình và hướng dẫn)
- `features/C/05_execution_results.md`
- `evidence/C/execution/results.json`
- `evidence/C/execution/service-logs.txt`
- 48 screenshot và 48 Playwright trace trong `evidence/C/execution/`
- `ai/prompt_log.md` và một dòng AI-02 `ART035`

Kiểm tra cuối: 48 ID duy nhất, đủ 48 screenshot/48 trace, toàn bộ trace ZIP mở được, không có runner error, backend và Admin frontend đã dừng. Fixture SQLite nằm riêng trong runtime bị ignore; source `SHOP` không bị sửa bởi automation. Không có file runtime, `node_modules` hoặc database fixture được đưa vào danh sách commit.

Tương tác được ghi thành `S001-I040`; `ART035` giữ `PENDING HUMAN REVIEW`. Bước tiếp theo sau khi bạn review là Step 6: nhóm FAIL theo root cause và lập defect/gap analysis.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: phạm vi 48 test case, expected result, phân loại 18 PASS/9 FAIL/21 BLOCKED và evidence đại diện.
- AI-02: thêm đúng một dòng `ART035` cho toàn bộ artifact logic của Step 4–5 C-FR14.

## S001-I041 — Defect và Gap Analysis cho C-FR14

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 15:51:57 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART036` — Step 6 của C-FR14 |
| AI-02 | Có — bug report và gap analysis là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
6. Defect và Gap Analysis
   Tạo:
   - bugs/C-FR14\_bug\_report.md
   - features/C/06\_ai\_gap\_analysis.md
     Trong đó:
   - Nhóm các FAIL có cùng root cause.
   - Phân biệt confirmed defect, requirement gap, implementation gap, testability gap và blocked condition.
   - Kiểm tra source read-only để tìm root cause.
   - Không biến case BLOCKED thành bug.
   - Dẫn đúng test case và evidence.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thành Step 6 cho `C-FR14`; hai tài liệu đang ở trạng thái `PENDING HUMAN REVIEW` và chưa commit.

Kết quả phân tích:

- 9 case FAIL được nhóm thành 5 confirmed defect.
- 9 requirement gap được giữ nguyên từ đặc tả.
- 3 implementation risk từ source read-only, chưa nâng thành defect.
- 1 testability gap đã được runner giảm thiểu.
- 6 blocked-condition group bao phủ đúng 21 case BLOCKED; không case BLOCKED nào bị ghi thành bug.

Năm defect gồm: thiếu empty state; thiếu validation/constraint tên category; form thiếu required marker và inline error; thiếu cưỡng chế role admin tại API/restored session; và `h1` không mô tả trang Category. Defect authorization được xếp `Critical/P1`; defect validation dữ liệu là `Major/P1`.

Đã tạo:

- `bugs/C-FR14_bug_report.md`
- `features/C/06_ai_gap_analysis.md`

Đã kiểm tra đủ 9 FAIL trong bug report, các đường dẫn evidence cụ thể đều tồn tại, tổng blocked group là `4 + 4 + 5 + 5 + 2 + 1 = 21`, và `git diff --check` không có lỗi mới. Source `SHOP` chỉ được đọc, không bị sửa; test không được chạy lại; chưa commit.

Tương tác được ghi thành `S001-I041`; AI-02 có đúng một dòng `ART036` ở trạng thái `PENDING HUMAN REVIEW`.

Checklist bạn cần review:

- Xác nhận cách nhóm 9 FAIL thành 5 root cause.
- Mở evidence của `C-BUG-002` và `C-BUG-004` trước vì liên quan data integrity và authorization.
- Xác nhận severity/priority.
- Xác nhận 9 requirement gap không bị biến thành business rule.
- Xác nhận 3 implementation risk chưa bị gọi nhầm là defect.
- Xác nhận 21 BLOCKED vẫn giữ nguyên verdict.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: mapping 9 FAIL → 5 defect, severity/priority, 9 requirement gap, 3 implementation risk, 1 testability gap và 6 blocked condition.
- AI-02: thêm đúng một dòng `ART036` cho Step 6 C-FR14.

## S001-I042 — Traceability, Report và Feature Closure cho C-FR14

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 16:02:30 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART037` — Step 7 của C-FR14 |
| AI-02 | Có — traceability, closure và nội dung báo cáo là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
7. Traceability, Report và Feature Closure
   Tạo:
   - features/C/07\_traceability\_matrix.md
   - features/C/07\_feature\_closure.md
     Sau đó:
   - Liên kết requirement → partition → boundary → test case → result → defect/gap → evidence.
   - Cập nhật chương Pool C trong báo cáo LaTeX.
   - Ghi coverage, residual risk và nội dung chưa kiểm chứng.
   - Render PDF để kiểm tra bảng, ảnh và đường dẫn.
   - Chỉ chốt workflow; không kết luận feature hoạt động đúng nếu còn FAIL hoặc BLOCKED.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thành Step 7 cho `C-FR14`. Workflow được chốt ở mức `TECHNICALLY COMPLETE — PENDING HUMAN SIGN-OFF`; chất lượng SUT là `NOT ACCEPTED — 9 FAIL, 21 BLOCKED`.

Đã tạo:

- `features/C/07_traceability_matrix.md`
- `features/C/07_feature_closure.md`

Đã cập nhật báo cáo:

- `report/latex/chapters/04_feature_c.tex`
- `report/latex/chapters/06_ai_gap_analysis.tex`
- `report/latex/chapters/07_bug_report.tex`
- `report/latex/chapters/10_test_summary_self_assessment.tex`
- `report/latex/chapters/11_conclusion.tex`

Coverage và traceability:

- 48/48 test case có dòng traceability duy nhất và khớp `results.json`.
- Design coverage: 21/21 rule.
- Boundary catalog: 8/8 boundary có test/probe.
- Execution coverage: 27/48 = 56.25%.
- 5/5 defect có FAIL và evidence; 9 requirement gap, 3 implementation risk, 1 testability gap và 6 blocked-condition group được liên kết.
- Đủ 48 screenshot và 48 trace; không thiếu evidence path.

Residual risk vẫn cao: role-user authorization bypass và dữ liệu name rỗng/NULL chưa được sửa; Update, normalization, upper length, invalid-ID response và referenced-category policy chưa được kiểm chứng đầy đủ. Vì vậy closure không tuyên bố feature hoạt động đúng hoặc coverage đạt 100%.

PDF đã render thành công bằng XeLaTeX: `report/latex/main.pdf`, 25 trang. Chương Pool C ở trang báo cáo 6–10 đã được kiểm tra trực quan; bảng và ba ảnh không tràn/méo, cross-reference ổn định, không có lỗi biên dịch, undefined reference hoặc overfull box. Log chỉ còn một underfull box có sẵn trong chương Pool A và warning MiKTeX không ghi được log hệ thống; chúng không ảnh hưởng PDF.

Tương tác được ghi thành `S001-I042`; AI-02 có đúng một dòng `ART037` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit.

Checklist human sign-off:

- Xác nhận ma trận đủ 48 case, 21 rule, 8 boundary và 5 defect.
- Xác nhận thống kê `48/27/18/9/21/0`.
- Xác nhận 21 BLOCKED không bị biến thành bug.
- Xác nhận residual risk và các nội dung chưa kiểm chứng.
- Xem trang 6–10 của PDF, đặc biệt hai ảnh execution và bảng defect.
- Nếu đồng ý, chuyển hai artifact Step 7 sang `REVIEWED` rồi mới commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: ma trận 48 dòng, coverage, closure verdict, chương Pool C trang 6–10 và residual risk.
- AI-02: thêm đúng một dòng `ART037` cho Step 7 C-FR14.

## S001-I043 — Traceability, Report và Feature Closure cho B-FR09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 16:10:04 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART038` — Step 7 của B-FR09 |
| AI-02 | Có — traceability, closure và nội dung báo cáo là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
tạo tài liệu step 7 tương đương cho feature B
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thành Step 7 cho `B-FR09`. Workflow được chốt ở mức `TECHNICALLY COMPLETE — PENDING HUMAN SIGN-OFF`; chất lượng SUT là `NOT ACCEPTED — 14 FAIL, 10 BLOCKED`.

Đã tạo:

- `features/B/07_traceability_matrix.md`
- `features/B/07_feature_closure.md`

Đã cập nhật chương Pool B và các phần tổng hợp của báo cáo LaTeX:

- `report/latex/chapters/03_feature_b.tex`
- `report/latex/chapters/06_ai_gap_analysis.tex`
- `report/latex/chapters/07_bug_report.tex`
- `report/latex/chapters/10_test_summary_self_assessment.tex`
- `report/latex/chapters/11_conclusion.tex`

Coverage và traceability:

- 41/41 test case có dòng traceability duy nhất và khớp `results.json`.
- Design coverage: 19/19 rule.
- Boundary catalog: 8/8 boundary được liên kết với test hoặc probe.
- Execution coverage: 31/41 = 75,61%.
- 9/9 confirmed defect có FAIL và evidence; 7 requirement gap, 2 implementation risk, 1 testability gap và 3 blocked-condition group đã được liên kết.

Residual risk ở mức rất cao vì còn lỗi Critical về công thức percent discount, total do client kiểm soát và identity binding; các miền expiry, normalization, rounding và cap/floor chưa được kiểm chứng đầy đủ. Vì vậy closure không tuyên bố feature hoạt động đúng hoặc coverage đạt 100%.

PDF đã render thành công bằng XeLaTeX: `report/latex/main.pdf`, 30 trang. Chương Pool B ở trang báo cáo 5–9 đã được kiểm tra trực quan; bảng và ảnh không tràn trang nghiêm trọng, không có lỗi biên dịch, undefined reference hoặc overfull box. Log chỉ còn một underfull box có sẵn trong Pool A và cảnh báo MiKTeX không ghi được log hệ thống; chúng không ảnh hưởng PDF.

Tương tác được ghi thành `S001-I043`; AI-02 có đúng một dòng `ART038` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit.

Checklist human sign-off:

- Xác nhận ma trận đủ 41 case, 19 rule, 8 boundary và 9 defect.
- Xác nhận thống kê `41/31/17/14/10/0`.
- Xác nhận 10 case BLOCKED không bị biến thành bug.
- Xác nhận residual risk và các nội dung chưa kiểm chứng.
- Xem trang 5–9 của PDF, đặc biệt hai ảnh execution và bảng defect.
- Nếu đồng ý, chuyển hai artifact Step 7 sang `REVIEWED` rồi mới commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: ma trận 41 dòng, coverage, closure verdict, chương Pool B trang 5–9 và residual risk.
- AI-02: thêm đúng một dòng `ART038` cho Step 7 B-FR09.

## S001-I044 — Giải thích các test case BLOCKED của feature C

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 16:11:45 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không áp dụng — chỉ phân tích và tư vấn |
| AI-02 | Không — không tạo hoặc thay đổi artifact trực tiếp của bài nộp |

### Prompt của sinh viên — nguyên văn

````text
ở feature C tôi thấy có một số tc bị blocked giải thích nguyên do và có cần manual lại ko
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Không cần chạy manual lại toàn bộ 21 case ngay bây giờ. Các case này đã được automation gọi API hoặc quan sát UI và đã có actual result, screenshot, trace; chúng bị `BLOCKED` vì **thiếu oracle/business rule để quyết định PASS hay FAIL**, không phải vì Playwright không thực thi được.

Sáu nhóm nguyên nhân:

| Test case | Vì sao BLOCKED | Cần làm gì |
|---|---|---|
| `C-TC-010`–`013` | Chưa có rule về whitespace, trim, duplicate và phân biệt hoa/thường. Hệ thống hiện chấp nhận tất cả. | Chốt rule với giảng viên/SRS rồi chạy lại automation. Manual không giải quyết được thiếu oracle. |
| `C-TC-017`–`020` | Không có maximum length hoặc contract cho `null`/sai kiểu. Các probe 255, 256, 1024 ký tự và `null` đều được lưu. | Chốt giới hạn và kiểu dữ liệu trước, sau đó tự động hóa lại. |
| `C-TC-021`–`025` | API có Update nhưng FR-14 không chốt Update trong danh sách hành vi và Admin UI không có chức năng này. | Trước tiên xác nhận Update có thuộc phạm vi không. Nếu có, bổ sung oracle rồi regression; nếu không, đánh dấu ngoài phạm vi thay vì manual. |
| `C-TC-027`–`031` | Chưa quy định response cho ID không tồn tại, `0`, số âm, số thập phân hoặc chuỗi. API hiện trả success dù không đổi record. | Chốt accept/reject và response contract rồi chạy lại automation. |
| `C-TC-033`, `034` | Chưa có referential policy khi xóa Category đang được Product tham chiếu. Hiện Category bị xóa và Product giữ `category_id` mồ côi. | Đây là nhóm cần ưu tiên chốt chính sách `reject/cascade/set-null`; sau đó regression trên SQLite fixture cô lập. |
| `C-TC-045` | FR-23 không yêu cầu breadcrumb cho Admin Category nên không có oracle áp dụng. | Nên ghi `N/A` hoặc giữ observation; chỉ chạy lại nếu phạm vi requirement được mở rộng. |

Danh sách và điều kiện chạy lại đã được ghi tại [07_feature_closure.md](D:/HCMUS/KCPM/HW2/submission-src/features/C/07_feature_closure.md:66); căn cứ chi tiết của sáu blocked condition nằm tại [06_ai_gap_analysis.md](D:/HCMUS/KCPM/HW2/submission-src/features/C/06_ai_gap_analysis.md:87). Kết quả từng case và evidence nằm tại [05_execution_results.md](D:/HCMUS/KCPM/HW2/submission-src/features/C/05_execution_results.md:38).

Kết luận:

- **Không manual rerun lúc này** vì thao tác thủ công chỉ lặp lại behavior đã được ghi nhận, không tạo ra expected result hợp lệ.
- Bạn chỉ cần **human review evidence**, nhất là `C-TC-020`, `C-TC-033` và `C-TC-034`, để xác nhận observation đúng.
- Sau khi rule được chốt, cập nhật oracle/expected result theo rule mới rồi chạy lại automation. Có thể manual thêm một lượt smoke test trên UI sau khi sửa SUT, nhưng đó là regression bổ sung, không phải cách gỡ trạng thái BLOCKED hiện tại.
- Riêng `C-TC-045` nên cân nhắc chuyển thành `N/A` khi review, không cần chạy lại nếu requirement không đổi.

Tương tác này được ghi vào `prompt_log.md` dưới mã `S001-I044`; không thêm AI-02 vì chỉ phân tích, không tạo artifact nộp mới.
````

### Human review

- Trạng thái: Không áp dụng; đây là giải thích dựa trên artifact hiện có.
- AI-02: Không áp dụng vì không tạo hoặc thay đổi artifact trực tiếp của bài nộp.

## S001-I045 — Đặc tả và test oracle cho D-M09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 16:21:54 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART039` — Step 1 của D-M09 |
| AI-02 | Có — đặc tả và test oracle là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
1. Đặc tả và test oracle
   Tạo:
   features/D/01\_spec\_and\_oracle.md
   Thực hiện:

- Đọc SRS, SHOP/README.md, api\_specification.md, Backend và frontend-mobile/App.js.
- Xác định các business rule dùng chung với FR-09.
- Xác định hành vi riêng của Mobile:
  - Nhập và chuẩn hóa coupon code.
  - Trạng thái enable/disabled của nút Áp dụng.
  - Loading khi gửi request.
  - Hiển thị lỗi, discount amount và final amount.
  - Cập nhật lại giao diện khi thay đổi coupon code.
- Phân biệt:
  - Rule có căn cứ.
  - Hành vi hiện tại của Mobile.
  - Requirement gap.
- Ghi rõ smoke evidence hiện tại là Expo Web với device emulation, chưa phải native Mobile.
- Giữ trạng thái PENDING HUMAN REVIEW.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã tạo [01_spec_and_oracle.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/01_spec_and_oracle.md) cho `D-M09`; trạng thái hiện tại là `PENDING HUMAN REVIEW`.

Tài liệu đã:

- Xác định `SHOP/README.md` là SRS/business oracle chính và giữ thứ tự ưu tiên SRS → API contract → source.
- Chốt `D-R01`–`D-R20`, gồm năm điều kiện C1–C5, công thức percent/fixed/final, trusted total và các GUI rule có căn cứ.
- Tách 13 hành vi Mobile quan sát từ source thành `D-OBS-01`–`D-OBS-13`; các behavior như `trim().toUpperCase()`, disabled, loading và reset result khi sửa code không bị tự nâng thành business rule.
- Ghi 11 requirement/testability gap `D-GAP-R01`–`D-GAP-R11`, gồm bằng chứng phân công Pool D, normalization, state khi apply, rounding, expiry, native semantics, network và environment matrix.
- Phân biệt candidate discrepancy của Mobile/shared Backend với confirmed defect; chưa sử dụng kết quả Pool B để kết luận cho Pool D.
- Ghi rõ smoke evidence hiện tại là Expo Web trên Chrome device emulation `iPhone 16 Pro Max`, viewport `440 × 956`, không phải native Android/iOS và chưa tạo verdict PASS/FAIL.
- Ghi nhận local `API_URL` hiện dùng `localhost` khác baseline IP LAN; đây là cấu hình môi trường, không phải thay đổi oracle.

Kiểm tra cấu trúc xác nhận đủ 20 Rule ID, 13 Observation ID và 11 Gap ID duy nhất; `git diff --check` không phát hiện lỗi. Source `SHOP` chỉ được đọc, không bị chỉnh sửa trong lượt này. Chưa commit.

Tương tác được ghi thành `S001-I045`; AI-02 có đúng một dòng `ART039` ở trạng thái `PENDING HUMAN REVIEW`.

Bước tiếp theo: bạn review checklist cuối file, đặc biệt xác nhận phạm vi Mobile Feature 9 và mức áp dụng FR-21/FR-22 cho React Native. Chỉ sau khi xác nhận mới chuyển Step 1 sang `REVIEWED` và tạo `features/D/02_domain_model.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: `D-R01`–`D-R20`, các behavior Mobile chỉ là observation, 11 gap và qualification của Expo Web smoke evidence.
- AI-02: thêm đúng một dòng `ART039` cho Step 1 D-M09.

## S001-I046 — Yêu cầu tạo domain model D-M09 khi Step 1 chưa qua review gate

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 16:24:22 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không áp dụng — chưa tạo Step 2 do review gate chưa đạt |
| AI-02 | Không — chưa tạo hoặc thay đổi artifact nội dung của bài nộp |

### Prompt của sinh viên — nguyên văn

````text
features/D/02\_domain\_model.md
Mô hình hóa:

- Mobile user/session.
- Cart và cart total.
- Coupon code input.
- Coupon và CouponUsage.
- Apply Coupon request/response.
- Mobile checkout state.
- Loading, error và success state.
- Discount amount và final amount.
- Network/backend availability.
  Các biến chính:
- Coupon code: empty, whitespace, normalized, existing, nonexistent.
- Authentication và user identity.
- Cart total và minimum order value.
- Coupon active/expired.
- Discount type/value.
- Usage count/limit.
- Request state: idle → loading → success/error.
- UI state trước và sau khi áp dụng coupon.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Chưa thể tạo Step 2 đúng quy trình vì [01_spec_and_oracle.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/01_spec_and_oracle.md:12) vẫn là `PENDING HUMAN REVIEW`; toàn bộ checklist review còn chưa được xác nhận. Nếu tạo domain model ngay, các rule đang chờ duyệt có thể bị dùng nhầm làm baseline.

Bạn chỉ cần xác nhận: **“Tôi đã review Step 1 của feature D; giữ các gap như hiện tại và cho phép chuyển sang REVIEWED.”** Sau đó tôi sẽ:

- Chuyển Step 1 sang `REVIEWED — HUMAN APPROVED`.
- Tạo `features/D/02_domain_model.md` với đầy đủ các đối tượng, biến, partition, constraint, dependency và state transition bạn vừa liệt kê.
- Giữ các behavior `trim/uppercase`, loading, disabled và reset UI ở dạng implementation state/gap, không tự biến thành business rule.
- Cập nhật prompt log và thêm đúng một dòng AI-02 cho artifact Step 2.

Tương tác này đã được ghi thành `S001-I046`; không thêm AI-02 vì chưa tạo artifact Step 2.
````

### Human review

- Trạng thái: Chờ sinh viên xác nhận Step 1 D-M09.
- AI-02: Không áp dụng vì chưa tạo artifact Step 2.

## S001-I047 — Domain model cho D-M09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 16:30:18 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART040` — Step 2 của D-M09 |
| AI-02 | Có — domain model là artifact trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
features/D/02\_domain\_model.md
Mô hình hóa:

- Mobile user/session.
- Cart và cart total.
- Coupon code input.
- Coupon và CouponUsage.
- Apply Coupon request/response.
- Mobile checkout state.
- Loading, error và success state.
- Discount amount và final amount.
- Network/backend availability.
  Các biến chính:
- Coupon code: empty, whitespace, normalized, existing, nonexistent.
- Authentication và user identity.
- Cart total và minimum order value.
- Coupon active/expired.
- Discount type/value.
- Usage count/limit.
- Request state: idle → loading → success/error.
- UI state trước và sau khi áp dụng coupon.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã tạo [02_domain_model.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/02_domain_model.md) cho `D-M09`; trạng thái `PENDING HUMAN REVIEW`.

Domain model gồm:

- 11 object: Mobile session, cart/pricing, coupon input, Coupon, CouponUsage, request, response, Mobile view, application aggregate, network/backend và clock.
- 26 domain variable, tách rõ raw/effective code, client/trusted identity và client/trusted total.
- 60 equivalence/composite/UI/network/platform partition.
- 6 request state: `IDLE_EMPTY → READY → LOADING → SUCCESS/BUSINESS_ERROR/TRANSPORT_ERROR`.
- 8 interaction constraint cho code mapping, threshold, identity/usage, arithmetic, network, UI edit và runtime/API URL.
- Traceability domain bao phủ `20/20` rule và giữ nguyên `11/11` requirement/testability gap.

Các điểm quan trọng:

- Empty, whitespace, trim/uppercase, disabled/loading và reset result khi edit vẫn là `UNRESOLVED` ở những tầng chưa có oracle.
- Business rejection được tách khỏi network/Backend failure; transport failure không bị gán thành coupon reject hay defect nghiệp vụ.
- Expo Web, Android emulator và iOS/thiết bị thật là các environment partition riêng, không thay thế evidence cho nhau.
- Hai điều kiện mở của Step 1 tiếp tục được giữ: bằng chứng phân công chính thức và lựa chọn môi trường thực thi Step 5.

Đã kiểm tra đủ 11 Object ID, 26 Variable ID, 60 Partition ID, 6 State ID, 8 Constraint ID, 20 Rule ID và 11 Gap ID; `git diff --check` không phát hiện lỗi. Source `SHOP` không bị sửa và chưa commit.

Tương tác được ghi thành `S001-I047`; AI-02 có đúng một dòng `ART040` ở trạng thái `PENDING HUMAN REVIEW`.

Bước tiếp theo: review checklist cuối file. Sau khi domain model được xác nhận mới tạo `features/D/03_boundary_value_analysis.md`.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: object/variable, 60 partition, state transition, trust boundary, network classification và traceability 20 rule.
- AI-02: thêm đúng một dòng `ART040` cho Step 2 D-M09.

## S001-I048 — Yêu cầu tạo BVA D-M09 khi Step 2 chưa qua review gate

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 17:11:12 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không áp dụng — chưa tạo Step 3 do review gate chưa đạt |
| AI-02 | Không — chưa tạo hoặc thay đổi artifact nội dung của bài nộp |

### Prompt của sinh viên — nguyên văn

````text
3. Equivalence Partitioning và BVA
   Tạo:
   features/D/03\_boundary\_value\_analysis.md
   Phân tích:

- Coupon hợp lệ/không hợp lệ.
- Empty và whitespace.
- Lowercase, uppercase và khoảng trắng đầu/cuối.
- Order total: dưới, bằng và trên minimum.
- Coupon active/inactive.
- Trước, đúng và sau expiry.
- Usage count: dưới, bằng và vượt limit.
- Discount value: âm, 0, dương.
- Percent và fixed discount.
- Final amount, rounding, cap và floor nếu có oracle.
- Network success, HTTP error và request thất bại.
- Trạng thái button trước/trong/sau request.
  Không tự đặt maximum code length, rounding, cap/floor hoặc normalization rule khi chưa có căn cứ.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Chưa thể tạo Step 3 đúng workflow vì [02_domain_model.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/02_domain_model.md:12) vẫn là `PENDING HUMAN REVIEW`; chín mục checklist chưa được xác nhận.

Bạn chỉ cần yêu cầu: **“Không chép; kiểm tra và review Step 2 theo hình thức USER-DELEGATED AI REVIEW, sau đó tạo Step 3.”** Tôi sẽ thực hiện liền mạch:

1. Đối chiếu lại 11 object, 26 variable, 60 partition, state transition và traceability của Step 2.
2. Đánh dấu review trung thực theo hình thức được ủy quyền, không ghi là independent human review.
3. Tạo `features/D/03_boundary_value_analysis.md` với các partition/boundary bạn đã liệt kê.
4. Giữ code length, normalization, rounding, cap/floor, network behavior và button state là `UNRESOLVED` khi chưa có oracle.

Tương tác được ghi thành `S001-I048`; không thêm AI-02 vì chưa tạo artifact Step 3.
````

### Human review

- Trạng thái: Chờ review gate Step 2 D-M09.
- AI-02: Không áp dụng vì chưa tạo artifact Step 3.

## S001-I049 — Yêu cầu tạo test case D-M09 khi Step 3 chưa qua review gate

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-14 17:40:10 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không áp dụng — chưa tạo Step 4 do review gate chưa đạt |
| AI-02 | Không — chưa tạo hoặc thay đổi artifact nội dung của bài nộp |

### Prompt của sinh viên — nguyên văn

````text
Tạo:
features/D/04\_test\_cases.md
Test case cần bao phủ:

- Mở Mobile checkout và hiển thị coupon input.
- Nút Áp dụng disabled với input rỗng/whitespace.
- Chuẩn hóa trim() và uppercase trước request.
- Coupon hợp lệ loại percent và fixed.
- Coupon không tồn tại, inactive và expired.
- Order total dưới, bằng và trên minimum.
- Usage limit.
- Người dùng chưa đăng nhập hoặc identity không hợp lệ.
- Loading state và chống nhấn nút nhiều lần.
- Network/API error.
- Xóa hoặc sửa code sau khi đã áp dụng coupon.
- Discount amount và final amount hiển thị đúng.
- Checkout sử dụng đúng final amount.
- Khả năng hiển thị trên viewport Mobile, keyboard và accessibility nếu có requirement.
- Traceability: rule → partition/boundary → test case.
  Không sao chép verdict của Pool B sang Pool D; chỉ tái sử dụng business oracle đã có căn cứ.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Chưa thể tạo Step 4 đúng workflow vì [03_boundary_value_analysis.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/03_boundary_value_analysis.md:12) vẫn là `PENDING HUMAN REVIEW`; chín mục checklist chưa được xác nhận.

Điểm cần review quan trọng nhất là các case empty/whitespace, trim/uppercase, loading/double tap, network resilience và native accessibility chỉ có thể mang expected result `UNRESOLVED`/`BLOCKED` khi chưa có oracle; không được viết thành PASS/FAIL expectation theo source hiện tại.

Bạn có thể yêu cầu: **“Không chép; review Step 3 theo hình thức USER-DELEGATED AI REVIEW rồi tạo Step 4, giữ nguyên mọi miền UNRESOLVED.”** Khi đó tôi sẽ:

- Kiểm tra và đóng review gate Step 3 trung thực.
- Tạo `features/D/04_test_cases.md` với ID, precondition, dữ liệu, bước chạy, expected result và traceability đầy đủ.
- Không sao chép actual result/verdict từ Pool B.
- Giữ các test thiếu oracle ở trạng thái thiết kế `BLOCKED/UNRESOLVED`, kèm điều kiện mở khóa.

Tương tác được ghi thành `S001-I049`; không thêm AI-02 vì chưa tạo artifact Step 4.
````

### Human review

- Trạng thái: Chờ review gate Step 3 D-M09.
- AI-02: Không áp dụng vì chưa tạo artifact Step 4.

## S001-I050 — Step 6 defect và gap analysis cho D-M09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-15 19:39:00 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART041` — Step 6 của D-M09 |
| AI-02 | Có — bug report và gap analysis là một artifact logic trực tiếp của bài nộp; `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
6. Defect và Gap Analysis
   Tạo:
   bugs/D-M09\_bug\_report.md
   features/D/06\_ai\_gap\_analysis.md
   Thực hiện:

- Nhóm các FAIL theo root cause.
- Phân biệt:
  - Confirmed defect.
  - Requirement gap.
  - Implementation gap.
  - Mobile-specific gap.
  - Testability gap.
  - Environment/connection issue.
  - Blocked condition.
- Không biến case BLOCKED thành bug.
- Kiểm tra source read-only để xác định root cause.
- Nếu lỗi Mobile và Web có cùng root cause ở Backend, dẫn chiếu defect Pool B thay vì mô tả như hai lỗi Backend độc lập.
- Tách lỗi Backend khỏi lỗi render/state management của Mobile client.
- Dẫn đúng screenshot, video/trace, results.json và service log.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thành Step 6 cho `D-M09`.

Các file được tạo:

- [D-M09_bug_report.md](D:/HCMUS/KCPM/HW2/submission-src/bugs/D-M09_bug_report.md)
- [06_ai_gap_analysis.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/06_ai_gap_analysis.md)

Kết quả phân tích:

- 11 FAIL được ánh xạ đủ vào 7 root-cause group.
- 5 root cause Backend dẫn chiếu canonical defect `B-BUG-001`–`B-BUG-005`; không tạo defect Backend trùng cho Pool D.
- 2 defect mới riêng Mobile:
  - `D-BUG-001`: positive action không dùng màu xanh dương.
  - `D-BUG-002`: validation error nằm dưới action Apply.
- `D-TC-044` được ánh xạ chính vào `B-BUG-003` và ghi nhận tác động phụ của `B-BUG-001`, không double-count.
- 20 BLOCKED được giữ nguyên, nhóm thành 6 blocked condition và không case nào bị biến thành bug.

Gap analysis ghi nhận:

- 11 requirement gap.
- 3 implementation gap/risk chưa phải defect.
- 2 Mobile-specific/environment gap.
- 2 testability gap.
- Không có active environment/connection incident trong lần chạy Expo Web; rủi ro `localhost` chỉ được ghi cho native runtime.

Đã kiểm tra source SHOP ở chế độ read-only, đối chiếu đủ 11 FAIL, đúng thống kê `19 PASS + 11 FAIL + 20 BLOCKED = 50`, và dẫn đầy đủ `results.json`, screenshot, Playwright trace cùng service log. Không có video được tạo nên tài liệu nêu rõ trace là evidence động.

Hai artifact đang ở trạng thái `PENDING HUMAN REVIEW`. Tương tác được ghi thành `S001-I050`; AI-02 có đúng một dòng `ART041` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit và không sửa source SHOP.

Checklist review chính: xác nhận năm defect Backend dùng đúng canonical record Pool B, hai `D-BUG-*` thuộc Mobile client, `D-TC-044` không bị double-count, và sáu nhóm BLOCKED không bị diễn giải thành defect.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: root-cause grouping, cross-reference Pool B, severity/priority, phân loại gap và evidence path.
- AI-02: thêm đúng một dòng `ART041` cho Step 6 D-M09.

## S001-I051 — Yêu cầu Step 7 D-M09 khi Step 6 chưa qua review gate

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-15 19:43:00 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không áp dụng — chưa tạo Step 7 do review gate chưa đạt |
| AI-02 | Không — chưa tạo hoặc thay đổi artifact Step 7/báo cáo |

### Prompt của sinh viên — nguyên văn

````text
Tạo:
features/D/07\_traceability\_matrix.md
features/D/07\_feature\_closure.md
Sau đó:

- Liên kết:
  requirement
  → partition
  → boundary
  → test case
  → execution result
  → defect/gap
  → Mobile evidence
- Cập nhật chương Pool D trong báo cáo LaTeX.
- Cập nhật Test Summary, Self-assessment và Conclusion bằng số liệu thật.
- Ghi rõ:
  - Thiết bị/nền tảng thực thi.
  - Designed, Executed, PASS, FAIL, BLOCKED, NOT RUN.
  - Coverage.
  - Defect và gap.
  - Residual risk.
  - Nội dung chưa kiểm chứng trên native Android/iOS.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Chưa tạo Step 7 vì review gate của Step 6 chưa đạt.

Hiện các artifact sau vẫn là `PENDING HUMAN REVIEW` và checklist chưa được xác nhận:

- `features/D/05_execution_results.md`
- `bugs/D-M09_bug_report.md`
- `features/D/06_ai_gap_analysis.md`

Theo skill `domain-testing-feature-workflow`, Step 7 chỉ được thực hiện sau khi defect/gap đã được review. Tôi chưa tạo traceability matrix, feature closure hoặc sửa báo cáo LaTeX để tránh trình bày dữ liệu chưa được bạn chấp nhận như kết luận cuối.

Bạn chỉ cần trả lời một trong hai câu:

- **“Tôi đã review Step 5 và Step 6; xác nhận nội dung hợp lệ, hãy thực hiện Step 7.”**
- **“Kiểm tra và review Step 5–6 theo hình thức USER-DELEGATED AI REVIEW, sau đó thực hiện Step 7.”**

Sau xác nhận đó, tôi có thể tạo đồng thời hai file Step 7, cập nhật chương Pool D, Test Summary, Self-assessment, Conclusion và render PDF để kiểm tra.

Tương tác này được ghi thành `S001-I051`; không thêm AI-02 vì chưa tạo artifact Step 7. Chưa commit và không sửa source SHOP.
````

### Human review

- Trạng thái: Chờ review gate Step 5–6 của D-M09.
- AI-02: Không áp dụng vì chưa tạo artifact Step 7.

## S001-I052 — Hoàn thành Step 7 và chốt workflow D-M09

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-15 20:20:10 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART042` |
| AI-02 | Có — một dòng cho toàn bộ artifact logic Step 7 D-M09 |

### Prompt của sinh viên — nguyên văn

````text
&#x20;

Tạo:
features/D/07\_traceability\_matrix.md
features/D/07\_feature\_closure.md
Sau đó:

- Liên kết:
  requirement
  → partition
  → boundary
  → test case
  → execution result
  → defect/gap
  → Mobile evidence
- Cập nhật chương Pool D trong báo cáo LaTeX.
- Cập nhật Test Summary, Self-assessment và Conclusion bằng số liệu thật.
- Ghi rõ:
  - Thiết bị/nền tảng thực thi.
  - Designed, Executed, PASS, FAIL, BLOCKED, NOT RUN.
  - Coverage.
  - Defect và gap.
  - Residual risk.
  - Nội dung chưa kiểm chứng trên native Android/iOS.
- Render PDF và kiểm tra bảng, ảnh, caption và đường dẫn.
- Chỉ chốt workflow; không kết luận Mobile feature hoạt động đúng nếu còn FAIL/BLOCKED hoặc mới chỉ chạy Expo Web.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thành Step 7 và chốt workflow kỹ thuật cho D-M09, chưa chấp nhận chất lượng feature.

Các artifact chính:

- Tạo [07_traceability_matrix.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/07_traceability_matrix.md) và [07_feature_closure.md](D:/HCMUS/KCPM/HW2/submission-src/features/D/07_feature_closure.md).
- Cập nhật [Pool D](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/05_feature_d.tex), [AI gap analysis](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/06_ai_gap_analysis.tex), [bug report](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/07_bug_report.tex), [Test Summary/Self-assessment](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/10_test_summary_self_assessment.tex) và [Conclusion](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/11_conclusion.tex).
- Render [main.pdf](D:/HCMUS/KCPM/HW2/submission-src/report/latex/main.pdf) để review; PDF là build output và không nằm trong danh sách commit.

Kết quả D-M09: Designed 50, Executed 30, PASS 19, FAIL 11, BLOCKED 20, NOT RUN 0. Execution coverage là 60.00%; tỷ lệ PASS trong case đã thực thi là 63.33%. Ma trận bao phủ 50/50 test case, 20/20 rule và 6/6 boundary; toàn bộ 101 tham chiếu screenshot/trace/results trong ma trận đều tồn tại. 11 FAIL được truy vết đến bảy root-cause group; 20 BLOCKED vẫn là blocked condition, không bị đổi thành bug.

Trạng thái đúng của feature là `TECHNICALLY COMPLETE — PENDING HUMAN SIGN-OFF`, còn chất lượng SUT là `NOT ACCEPTED — 11 FAIL, 20 BLOCKED; EXPO WEB ONLY`. Kết quả chỉ thu trên Expo Web/Chromium với viewport 440 × 956; chưa kiểm chứng native Android/iOS, soft keyboard, orientation, accessibility/native semantic, hiệu năng hoặc kết nối thiết bị thật. Residual risk vẫn rất cao.

Báo cáo tổng hợp đúng số liệu bốn pool: 177 designed, 97 executed, 55 PASS, 42 FAIL, 80 BLOCKED, 0 NOT RUN và 24 defect mới không đếm trùng các Backend defect dùng chung. XeLaTeX render thành công 37 trang A4; không có lỗi biên dịch, file/ảnh thiếu hoặc tràn dọc. Ba ảnh Pool D và caption hiển thị đúng; chỉ còn các cảnh báo dàn dòng nhỏ dưới 3 pt và bibliography rỗng, không làm mất nội dung.

Đã ghi tương tác `S001-I052` và thêm đúng một dòng AI-02 `ART042` ở trạng thái `PENDING HUMAN REVIEW`. Không sửa source SHOP và chưa commit.

Checklist human sign-off: đối chiếu ngẫu nhiên các dòng PASS/FAIL/BLOCKED với `results.json`; kiểm tra bảy root-cause group và các gap; xem ba ảnh/caption Pool D trong PDF; xác nhận giới hạn Expo Web và native Android/iOS chưa kiểm chứng; sau đó mới chuyển hai artifact Step 7 và `ART042` sang verdict phù hợp.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: ma trận 50 case, thống kê D và tổng bốn pool, root-cause/gap, ba ảnh/caption trong PDF và giới hạn Expo Web.
- AI-02: thêm đúng một dòng `ART042` cho toàn bộ artifact logic Step 7 D-M09.

## S001-I053 — Sửa kết nối API cho Expo trên thiết bị iOS thật

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 09:21:25 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không áp dụng |
| AI-02 | Không — chỉ sửa cấu hình/source chạy thử trong `SHOP` |

### Prompt của sinh viên — nguyên văn

````text
chạy được app trên ios nhưng ko fetch được data
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã sửa đúng nguyên nhân: Mobile trước đó gọi `http://localhost:3000/api`, nên trên iPhone request quay về chính iPhone thay vì máy tính.

Thay đổi tại [App.js](D:/HCMUS/KCPM/HW2/SHOP/frontend-mobile/App.js:16):

- Expo Web tiếp tục dùng `http://localhost:3000/api`.
- iOS/Android mặc định dùng `http://10.0.210.191:3000/api`.
- Có thể ghi đè bằng biến `EXPO_PUBLIC_API_URL` khi IP Wi-Fi thay đổi.

Đã cập nhật thêm [setup_guide.md](D:/HCMUS/KCPM/HW2/SHOP/setup_guide.md) với hướng dẫn thiết bị thật.

Kiểm tra thực tế:

- Backend đang listen trên `0.0.0.0:3000`.
- `http://localhost:3000/api/products`: HTTP 200.
- `http://10.0.210.191:3000/api/products`: HTTP 200.
- iOS bundle SDK 57 build thành công, 582 modules.

Hãy đóng Metro hiện tại và chạy lại bằng PowerShell:

```powershell
cd D:\HCMUS\KCPM\HW2\SHOP\frontend-mobile
$env:EXPO_PUBLIC_API_URL="http://10.0.210.191:3000/api"
npx expo start --clear --lan
```

Trên iPhone:

1. Kết nối cùng Wi-Fi với máy tính.
2. Cho phép Expo Go truy cập **Local Network** trong iOS Settings.
3. Mở Safari và thử `http://10.0.210.191:3000/api/products`.
4. Nếu Safari thấy JSON, quét lại QR và app sẽ fetch được dữ liệu.
5. Nếu Safari không mở được, cho phép `node.exe` qua Windows Firewall ở mạng Private.

IP `10.0.210.191` có thể đổi khi kết nối Wi-Fi khác; khi đó chạy `ipconfig` và thay giá trị `EXPO_PUBLIC_API_URL`. Chưa commit. Tương tác này được ghi vào `S001-I053`; không thêm AI-02 vì không tạo artifact trực tiếp cho bài nộp.
````

### Human review

- Trạng thái: Chờ sinh viên xác nhận fetch sản phẩm thành công trên iOS thật.
- AI-02: Không áp dụng vì thay đổi chỉ thuộc source/cấu hình chạy thử `SHOP`.

## S001-I054 — Bổ sung evidence iOS thật và đồng bộ Pool D

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 09:42:18 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART043` |
| AI-02 | Có — `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Open tabs:
- README.md: SHOP/README.md
- 04_test_cases.md: submission-src/features/D/04_test_cases.md
- setup_guide.md: SHOP/setup_guide.md
- 07_feature_closure.md: submission-src/features/A/07_feature_closure.md

## My request:
tôi đã chụp màn hình các tc được bạn đề xuất nhưng không thể chụp hết, bạn dựa vào các tên ảnh được tôi đổi theo đúng bảng mô tả [tc1.jpg](SHOP/tc1.jpg) ... [tc44.jpg](SHOP/tc44.jpg). Bạn được quyền đổi tên, di chuyển chúng, và cập nhật tất cả tài liệu feature D có liên quan đến những phần này, được quyền cập nhật báo cáo chính luôn
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn tất đồng bộ 9 ảnh chụp trên iOS thật vào Pool D và báo cáo chính.

- Ảnh đã được đổi tên, chuyển vào [native-ios/screenshots](D:/HCMUS/KCPM/HW2/submission-src/evidence/D/native-ios/screenshots/) và liên kết với các case `001`, `002`, `003`, `008`, `009`, `010`, `012`, `022`, `042`.
- `tc44.jpg` được ánh xạ thành `D-TC-042-ios-physical.jpg` vì nội dung thực tế là lỗi mất kết nối, không phải checkout integration `D-TC-044`.
- Giữ nguyên kết quả chuẩn: 50 designed, 30 executed, 19 PASS, 11 FAIL, 20 BLOCKED, 0 NOT RUN. Chín ảnh được ghi là evidence bổ sung: 5 exact, 2 modified-data và 2 observation-only.
- Đã cập nhật execution result/JSON, bug report, gap analysis, traceability, feature closure, environment, báo cáo Markdown và các chương LaTeX liên quan. `D-TC-042` vẫn BLOCKED; raw transport exception được ghi thành `D-IG-04`, không tự nâng thành defect.
- Báo cáo PDF render thành công, không có lỗi biên dịch hoặc file ảnh thiếu. Chỉ còn cảnh báo dàn dòng nhỏ, không làm mất nội dung.
- Đã ghi `S001-I054` và thêm một dòng AI-02 `ART043` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit.

Nội dung báo cáo được giữ theo phong cách hiện tại: tiếng Việt, trực tiếp và dựa trên evidence. Bạn chỉ cần review mapping 9 ảnh, phần baseline deviation và ba hình iOS trong chương Pool D; sau đó có thể chuyển `ART043` sang verdict phù hợp.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: mapping 9 ảnh, phân loại exact/modified-data/observation, baseline deviation và phần Pool D trong PDF.
- AI-02: `ART043` — `PENDING HUMAN REVIEW`.

## S001-I055 — Hoàn thiện Git history và xuất Git log

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 10:08:08 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không áp dụng |
| AI-02 | Không — thao tác Git và xuất commit log |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/features/A/07_feature_closure.md

## Open tabs:
- 07_feature_closure.md: submission-src/features/A/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/B/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/C/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/D/07_feature_closure.md
- README.md: SHOP/README.md

## My request:
1. Hoàn thiện Git history và xuất Git log
   Hiện repository có 62 thay đổi chưa commit. Git history mới có Step 1–7 của Pool A và Step 1–6 của Pool B; còn thiếu:

- Step 7 Pool B.
- Toàn bộ 7 step Pool C.
- Toàn bộ 7 step Pool D.
- Commit hoàn thiện báo cáo và hồ sơ AI.
- File Git log dạng text theo yêu cầu đề bài.
  Ngoài ra, .gitignore đang bỏ qua \*.zip, khiến 48 trace Pool C và 50 trace Pool D không được Git theo dõi. Cần thêm ngoại lệ hoặc chủ động đưa chúng vào gói nộp.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thiện Git history và xuất Git log.

- Đã tạo 15 commit theo step còn thiếu: Step 7 Pool B, Step 1–7 Pool C và Step 1–7 Pool D.
- Đã tạo thêm commit hoàn thiện báo cáo/hồ sơ AI và commit chứa `git_log.txt`; tổng cộng 17 commit mới trong lượt này.
- `.gitignore` vẫn bỏ qua ZIP đóng gói cuối nhưng cho phép theo dõi Playwright trace. Git hiện quản lý đủ 48 trace Pool C và 50 trace Pool D.
- [git_log.txt](D:/HCMUS/KCPM/HW2/submission-src/git_log.txt) chứa toàn bộ lịch sử chức năng và báo cáo đến commit ngay trước commit thêm chính file log; đây là giới hạn tuần hoàn bình thường của commit-log artifact.
- Đã kiểm tra JSON, cú pháp runner, số lượng screenshot/trace, `git diff --cached --check` cho từng commit và trạng thái repository sau cùng.
- Tương tác được ghi tại `S001-I055`; không thêm AI-02 vì đây là thao tác Git. Chưa push lên remote.

Working tree hiện sạch đối với file được theo dõi; chỉ còn các dependency, runtime database và LaTeX build output đã được ignore đúng quy ước.
````

### Human review

- Trạng thái: Không áp dụng; thao tác Git theo yêu cầu trực tiếp.
- AI-02: Không áp dụng.

## S001-I056 — Hoàn thiện README bắt buộc

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 10:16:42 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART044` |
| AI-02 | Có — `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/features/A/07_feature_closure.md

## Open tabs:
- 07_feature_closure.md: submission-src/features/A/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/B/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/C/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/D/07_feature_closure.md
- README.md: SHOP/README.md

## My request:
3. Hoàn thiện README bắt buộc
   [README hiện tại](D:/HCMUS/KCPM/HW2/submission-src/README.md) mới chỉ mô tả cấu trúc. Theo đề, README phải có:

- Bảng self-assessment.
- Test summary của bốn feature.
- Designed, Executed, PASS, FAIL, Not Executed/BLOCKED.
- Số bug.
- Demo video.
- Link report và tài liệu quan trọng.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thiện [README.md](D:/HCMUS/KCPM/HW2/submission-src/README.md) với:

- Bảng self-assessment `80/100`.
- Test summary của bốn feature và tổng số liệu: 177 Designed, 97 Executed, 55 PASS, 42 FAIL, 80 BLOCKED, 0 NOT RUN.
- 24 bug mới, không đếm trùng 5 lỗi Backend mà Pool D dẫn chiếu từ Pool B.
- Liên kết đến báo cáo Markdown/PDF, tài liệu từng feature, bug report, evidence hỗ trợ và hồ sơ AI.
- Mô tả cấu trúc repository và nguyên tắc đóng gói.

Mục duy nhất chưa thể chốt là demo video: repository hiện không có video hoặc URL thật, nên README ghi rõ `CHƯA CUNG CẤP` thay vì tạo link giả. Bạn cần gửi URL có quyền truy cập cho giảng viên trước khi nộp; tôi có thể cập nhật ngay khi có link.

Đã kiểm tra toàn bộ link nội bộ trong README đều trỏ tới file hiện có. Lưu ý `report/latex/main.pdf` đang bị `.gitignore` bỏ qua, vì vậy cần chủ động đưa PDF này vào gói ZIP cuối.

Tương tác đã được ghi tại `S001-I056`; AI-02 có artifact `ART044` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: bảng số liệu, self-assessment, liên kết tài liệu và nội dung Demo video.
- AI-02: `ART044` — `PENDING HUMAN REVIEW`.

## S001-I057 — Hoàn thiện biểu mẫu AI-03

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 10:23:56 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART045` |
| AI-02 | Có — `PENDING HUMAN REVIEW` |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/features/A/07_feature_closure.md

## Open tabs:
- 07_feature_closure.md: submission-src/features/A/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/B/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/C/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/D/07_feature_closure.md
- README.md: SHOP/README.md

## My request:
4. Hoàn thiện AI-03
   [AI-03](D:/HCMUS/KCPM/HW2/submission-src/ai/AI-03_AI_Disclosure_Form_Working.docx) gần như còn trống:

- Chưa chọn AI Use Category.
- Chưa tick stage sử dụng AI.
- Chưa điền công cụ, prompt chính, phần AI đóng góp và cách kiểm chứng.
- Còn 22 vùng gạch trống.
- Chưa có chữ ký/ngày chốt cuối.
  Đây là biểu mẫu disclosure bắt buộc.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã hoàn thiện [AI-03_AI_Disclosure_Form_Working.docx](D:/HCMUS/KCPM/HW2/submission-src/ai/AI-03_AI_Disclosure_Form_Working.docx):

- Chọn `Category 4 — AI-assisted task completion with human evaluation` theo mức sử dụng thực tế.
- Tick các stage: brainstorming, outlining, drafting, feedback, revision, coding, data analysis và các công việc hỗ trợ khác; không tick visual design.
- Điền OpenAI Codex, model, reasoning effort, ba prompt tiêu biểu nguyên văn và tham chiếu tới full prompt log.
- Mô tả đầy đủ phần AI đóng góp, gồm Domain/BVA, test case, automation, execution, defect/gap, traceability, báo cáo, Agent Skills và cấu hình Mobile/Expo.
- Điền cách kiểm chứng bằng SRS, source, API contract, schema, `results.json`, screenshot, trace, service log, Git history và PDF render.
- Điền citation, ngày chốt `2026-10-16` và xóa toàn bộ 22 vùng gạch trống; kiểm tra còn `0` placeholder dạng gạch dưới.

Tôi không ký thay phần Statement of Honesty. Ô chữ ký hiện ghi `PENDING — student must sign after final review`; bạn cần mở file, đọc lại disclosure và tự ký trước khi nộp.

Lưu ý: đề HW02 ghi AI Policy là `Open` nhưng không ánh xạ trực tiếp sang số Category 1–5. Category 4 được chọn theo cách sử dụng thực tế và căn cứ kế hoạch hiện có; nếu Moodle/giảng viên công bố category khác thì phải ưu tiên thông báo đó.

Đã kiểm tra DOCX mở và đọc được bằng `python-docx`, các trường course/student vẫn nguyên vẹn. Tương tác được ghi tại `S001-I057`; AI-02 có artifact `ART045` ở trạng thái `PENDING HUMAN REVIEW`. Chưa commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: Category 4, phạm vi AI đóng góp, ba prompt tiêu biểu, phương pháp verification và chữ ký cá nhân.
- AI-02: `ART045` — `PENDING HUMAN REVIEW`.

## S001-I058 — Chốt AI-02 và bổ sung nguồn reasoning

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 14:15:00 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | Không tạo ID mới — hoàn thiện chính audit artifact hiện có |
| AI-02 | Không thêm dòng mới để tránh audit tự tham chiếu và tự mở lại trạng thái `PENDING` |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/features/A/07_feature_closure.md

## Open tabs:
- 07_feature_closure.md: submission-src/features/A/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/B/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/C/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/D/07_feature_closure.md
- README.md: SHOP/README.md

## My request:
5. Chốt AI-02
   [AI-02](D:/HCMUS/KCPM/HW2/submission-src/ai/AI-02_AI_Audit_Report_Working.docx) còn:

- ART043 ở trạng thái PENDING HUMAN REVIEW.
- Sample row của template chưa được xóa.
- Reasoning của các artifact thực tế hầu như không dẫn section ISTQB/course slide/RFC, trong khi template yêu cầu nguồn cho cột này.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã chốt [AI-02_AI_Audit_Report_Working.docx](D:/HCMUS/KCPM/HW2/submission-src/ai/AI-02_AI_Audit_Report_Working.docx):

- Xóa hoàn toàn 2 sample row của template.
- Bổ sung nguồn reasoning cho đủ 33 artifact, chủ yếu từ ISTQB CTFL v4.0.1 §1.4.1, §1.4.4, §4.2.1, §4.2.2, §4.2.4, §5.3, §5.5, §6.1 và các mục tương ứng của đề HW02.
- Chuyển `ART043` sang `VALID` sau khi đối chiếu 9 ảnh iOS, mapping exact/modified/observation, baseline deviation và thống kê chuẩn.
- Chốt thống kê AI-02: 33 artifact, 31 `VALID` (93,94%), 0 `INVALID`, 2 `INCOMPLETE` (6,06%), 0 `PENDING`.
- `ART044` là `INCOMPLETE` vì README chưa có YouTube demo URL.
- `ART045` là `INCOMPLETE` vì AI-03 cần xác nhận numeric category và chữ ký của bạn.
- Điền Conclusion 134 từ, thay Mandatory Disclosure mẫu bằng nội dung đúng với lịch sử sử dụng AI, hoàn thiện metadata xác nhận và ngày `2026-10-16`.

Đã đồng bộ thống kê vào [AI_Audit_Report.md](D:/HCMUS/KCPM/HW2/submission-src/ai/AI_Audit_Report.md), [main_report.md](D:/HCMUS/KCPM/HW2/submission-src/report/main_report.md) và chương LaTeX AI Audit. Full Prompt Log PDF và báo cáo chính đã được render lại sau khi thêm `S001-I058`.

Tôi không ký thay bạn. Ô chữ ký AI-02 vẫn ghi `PENDING — student must sign after final review`; đây là thao tác cá nhân cuối cùng. Tương tác `S001-I058` chỉ được ghi vào prompt log, không tạo thêm Artifact ID trong AI-02 vì audit chính lần chốt AI-02 sẽ tạo vòng lặp tự tham chiếu và làm xuất hiện một dòng `PENDING` mới.

Nhóm file tạm `ai/raw/*.txt` xuất hiện từ một tiến trình khác trong lúc làm việc và không được tôi sửa hoặc xóa. Chưa commit.
````

### Human review

- Trạng thái: AI-02 không còn verdict `PENDING`; còn hai artifact `INCOMPLETE` được ghi rõ điều kiện hoàn tất.
- Cần sinh viên thực hiện: thêm YouTube demo URL, xác nhận Category 4 và tự ký AI-02/AI-03.
- AI-02: Không thêm dòng artifact mới vì đây là thao tác closure của chính biểu mẫu audit.

## S001-I059 — Sửa lỗi nội dung, đồng bộ native evidence và bổ sung citation

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 14:22:13 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART046` |
| AI-02 | Có — `PENDING HUMAN REVIEW`; `ART043` giữ `VALID` |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/features/A/07_feature_closure.md

## Open tabs:
- 07_feature_closure.md: submission-src/features/A/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/B/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/C/07_feature_closure.md
- 07_feature_closure.md: submission-src/features/D/07_feature_closure.md
- README.md: SHOP/README.md

## My request:
Các lỗi nội dung cần sửa

- [AI Disclosure (line 18)](D:/HCMUS/KCPM/HW2/submission-src/ai/AI_Disclosure.md:18) ghi “AI không thay đổi source SHOP”, nhưng AI đã hỗ trợ nâng Expo SDK và sửa API endpoint. Cần khai báo chính xác rằng source thay đổi phục vụ cấu hình native, còn canonical execution dùng baseline cũ.
- [Phụ lục Disclosure (line 13)](D:/HCMUS/KCPM/HW2/submission-src/report/latex/appendix/disclosure.tex:13) vẫn ghi Pool D chưa có native evidence, trái với 9 ảnh iOS thật.
- [Bug Report LaTeX (line 121)](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/07_bug_report.tex:121) bị mất dấu \ trước bốn lệnh texttt, nên PDF hiện hiển thị extttB-BUG-001.
- [AI Gap Analysis LaTeX (line 18)](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/06_ai_gap_analysis.tex:18) và [Bug Report LaTeX (line 30)](D:/HCMUS/KCPM/HW2/submission-src/report/latex/chapters/07_bug_report.tex:30) còn câu “sinh viên ủy quyền AI quyết định/review”. Nên thay bằng mô tả đối chiếu evidence và xác nhận của sinh viên.
- Pool D và ART043 vẫn còn trạng thái PENDING HUMAN REVIEW.
- Các checklist traceability của Pool B, C, D vẫn chưa tick dù các kiểm tra tương ứng đã hoàn thành.
- [environment.md (line 141)](D:/HCMUS/KCPM/HW2/submission-src/supporting/environment.md:141) còn checklist “trước khi thực thi” chưa hoàn tất dù execution đã xong.
- [scope.md (line 27)](D:/HCMUS/KCPM/HW2/submission-src/supporting/scope.md:27) vẫn ghi thiếu bằng chứng chính thức rằng Mobile Feature 9 là Discount Coupon. Nên thêm ảnh hoặc nguồn phân công từ Moodle/nhóm.
- references.bib đang trống và toàn báo cáo không có citation ISTQB/course material. Với mục tiêu 85+, nên dẫn nguồn cho EP, BVA và cách phân loại test result.
- [AI Critique](D:/HCMUS/KCPM/HW2/submission-src/ai/AI_Critique.md) đạt 294 từ, đúng giới hạn 200–300, nhưng nội dung vẫn nói theo bối cảnh chưa có native evidence; nên cập nhật mà vẫn giữ dưới 300 từ.
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã sửa xong toàn bộ nhóm lỗi nội dung.

- AI Disclosure và phụ lục LaTeX đã khai báo đúng việc nâng Expo SDK/sửa API endpoint cho native supplement; canonical verdict vẫn thuộc baseline Expo Web cũ.
- Pool D đã chuyển sang `REVIEWED — NATIVE iOS SUPPLEMENT VERIFIED`; 9 ảnh iOS vẫn chỉ là evidence bổ sung, không được mô tả thành native automation/full coverage.
- `ART043` được kiểm tra trong AI-02 và vẫn là `VALID`.
- Đã sửa đủ bốn lệnh `\texttt`, bỏ cách diễn đạt “ủy quyền AI quyết định/review”, và thay bằng đối chiếu requirement/source/evidence cùng xác nhận của sinh viên.
- Checklist traceability B/C/D và checklist môi trường đã được chốt; không bịa phiên bản Chrome còn thiếu.
- Scope Pool D dẫn đúng xác nhận phân công nhóm tại `prompt_log.md`, interaction `S001-I003`; không dựng ảnh Moodle không tồn tại.
- Đã thêm bibliography và citation cho EP/BVA cùng quy ước báo cáo kết quả, dựa trên [ISTQB CTFL v4.0.1 chính thức](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) và đề HW02.
- AI Critique đã cập nhật 9 ảnh iOS thật và còn 288 từ, đúng giới hạn 200–300.

Kiểm tra cuối: XeLaTeX + BibTeX render thành công [main.pdf](D:/HCMUS/KCPM/HW2/submission-src/report/latex/main.pdf) 108 trang; không còn citation undefined, lỗi LaTeX hay checklist chưa tick trong các file được nêu. `git diff --check` sạch.

Theo skill ghi nhận AI, lượt sửa artifact này tạo `ART046` ở trạng thái `PENDING HUMAN REVIEW`; sau khi bạn xem PDF và nội dung sửa, cần đổi nó sang verdict cuối. Chưa commit.
````

### Human review

- Trạng thái: `PENDING HUMAN REVIEW`.
- Cần kiểm tra: disclosure về source change/native supplement, scope provenance, citation/bibliography, trạng thái Pool D và bản PDF 108 trang.
- AI-02: `ART046` — `PENDING HUMAN REVIEW`; `ART043` — `VALID`.

## S001-I060 — Bổ sung demo video vào gói nộp

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 15:09:35 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART044` — cập nhật artifact hiện có |
| AI-02 | Có — chuyển từ `INCOMPLETE` sang `VALID` |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/skills/domain-model-and-bva/SKILL.md

## Open tabs:
- SKILL.md: submission-src/skills/domain-model-and-bva/SKILL.md
- execution-contract.md: submission-src/skills/playwright-domain-test-runner/references/execution-contract.md
- SKILL.md: submission-src/skills/playwright-domain-test-runner/SKILL.md
- scope.md: submission-src/supporting/scope.md
- environment.md: submission-src/supporting/environment.md

## My request:
tôi đã quay xong video, bạn hãy tạo file và gắn link này vào phần nộp bài: [https://youtu.be/i2ECLTh1AEU](https://youtu.be/i2ECLTh1AEU)
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã thêm demo video vào gói nộp:

- Tạo [demo/README.md](D:/HCMUS/KCPM/HW2/submission-src/demo/README.md) chứa thông tin sinh viên và link YouTube.
- Gắn link trực tiếp vào [README.md](D:/HCMUS/KCPM/HW2/submission-src/README.md), báo cáo Markdown và phần Self-assessment trong LaTeX.
- Xóa các câu nói rằng chưa có demo video.
- Chuyển `ART044` từ `INCOMPLETE` sang `VALID`. AI-02 hiện có 32 `VALID`, 1 `INCOMPLETE` (`ART045`) và 1 `PENDING` (`ART046`).
- Ghi tương tác `S001-I060`, tái tạo Full AI Prompt Log PDF và render lại báo cáo thành công, không có lỗi LaTeX/citation.

Công cụ kiểm tra web không đọc được metadata/quyền riêng tư của video. Trước khi nộp, bạn nên mở [video](https://youtu.be/i2ECLTh1AEU) bằng cửa sổ ẩn danh để chắc rằng giảng viên xem được mà không cần đăng nhập hoặc xin quyền.

Chưa commit.
````

### Human review

- Trạng thái: `VALID` cho điều kiện thiếu YouTube demo URL của `ART044`.
- Cần sinh viên tự kiểm tra: quyền xem video bằng cửa sổ ẩn danh.
- AI-02: cập nhật dòng `ART044`, không tạo Artifact ID mới.

## S001-I061 — Đồng bộ tiêu đề video demo

| Thuộc tính | Giá trị |
|---|---|
| Thời gian | 2026-10-16 15:11:21 +07:00 |
| Công cụ | OpenAI Codex |
| Model | codex gpt-5.6 sol |
| Reasoning effort | medium |
| Artifact ID | `ART044` — cập nhật artifact hiện có |
| AI-02 | Có — giữ `VALID` |

### Prompt của sinh viên — nguyên văn

````text
# Context from my IDE setup:

## Active file: submission-src/skills/domain-model-and-bva/SKILL.md

## Open tabs:
- SKILL.md: submission-src/skills/domain-model-and-bva/SKILL.md
- execution-contract.md: submission-src/skills/playwright-domain-test-runner/references/execution-contract.md
- SKILL.md: submission-src/skills/playwright-domain-test-runner/SKILL.md
- scope.md: submission-src/supporting/scope.md
- environment.md: submission-src/supporting/environment.md

## My request:
tiêu đề của video là \
**KTPM - CQ2023/31 Demo AI skill đã dùng trong bài tập tuần 2**
````

### Phần hồi cuối của AI — nguyên văn

````markdown
Đã đồng bộ tiêu đề **“KTPM - CQ2023/31 Demo AI skill đã dùng trong bài tập tuần 2”** vào:

- [demo/README.md](D:/HCMUS/KCPM/HW2/submission-src/demo/README.md)
- [README.md](D:/HCMUS/KCPM/HW2/submission-src/README.md)
- [report/main_report.md](D:/HCMUS/KCPM/HW2/submission-src/report/main_report.md)
- Chương Test Summary/Self-assessment của báo cáo LaTeX

`ART044` vẫn giữ `VALID`; không tạo Artifact ID mới. Prompt log và PDF báo cáo đã được cập nhật, render không có lỗi LaTeX/citation. Chưa commit.
````

### Human review

- Trạng thái: `VALID`.
- AI-02: cập nhật chính dòng `ART044`; không tạo dòng mới.
