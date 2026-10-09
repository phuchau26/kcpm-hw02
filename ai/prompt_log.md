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
