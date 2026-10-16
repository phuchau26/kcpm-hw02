# AI Disclosure

Tôi sử dụng OpenAI Codex, model `codex gpt-5.6 sol` với reasoning effort
`medium`, trong HW02 cho các công việc sau:

- Hỗ trợ đọc và hệ thống hóa SRS, API contract và source code.
- Hỗ trợ lập Domain Model, Equivalence Partitioning và Boundary Value Analysis.
- Hỗ trợ thiết kế test case, Playwright automation và SQLite fixture cô lập.
- Hỗ trợ tổng hợp execution result, defect, gap, traceability và báo cáo.
- Hỗ trợ xây dựng các Agent Skills dùng lại cho quy trình Domain Testing.

Mọi output trực tiếp dùng trong bài nộp được ghi trong AI-02 và toàn bộ tương
tác được lưu nguyên văn tại `ai/prompt_log.md`. Tôi đã đối chiếu artifact với
SRS, API contract, source, `results.json`, screenshot, trace và service log.
Các test không đủ oracle hoặc điều kiện thực thi được giữ là BLOCKED; expected
result không bị thay đổi để hợp thức hóa hành vi của SUT.

AI không thay đổi source `SHOP`, không tạo evidence giả và không thay thế quyết
định cuối cùng của sinh viên. Các hạn chế còn lại, đặc biệt native Android/iOS
chưa được kiểm chứng, được công bố trong feature closure và Conclusion.
