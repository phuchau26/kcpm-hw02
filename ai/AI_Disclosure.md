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

AI đã hỗ trợ thay đổi phần cấu hình Mobile trong source `SHOP`: nâng Expo SDK
từ baseline 54 lên 57 và chuyển API endpoint sang cấu hình phù hợp mạng LAN để
chạy bổ sung trên thiết bị iOS thật. Các thay đổi này diễn ra sau lần thực thi
canonical bằng Expo Web; vì vậy chúng không được dùng để sửa hoặc thay thế các
verdict PASS/FAIL/BLOCKED của baseline. Chín ảnh iOS thật chỉ là evidence bổ
sung. AI không tạo evidence giả và không thay thế quyết định cuối cùng của sinh
viên; Android, native automation và native accessibility vẫn chưa được kiểm chứng.
