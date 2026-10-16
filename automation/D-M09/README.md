# D-M09 Playwright automation

Runner thực thi tuần tự 50 test case của Pool D trên Expo Web tại viewport
`440 × 956`, kết hợp API checks và SQLite fixture cô lập.

```powershell
npm install
npm test
```

Runner yêu cầu port `3000` và `8081` đang trống. Source SHOP và
`SHOP/backend/database.sqlite` không bị sửa. Thư mục `runtime/` chỉ chứa dữ liệu
tạm, bị `.gitignore` loại khỏi submission.

Playwright không được dùng để thay thế native evidence. Các case cần controlled
clock hoặc Android/iOS runtime được ghi `BLOCKED` cùng điều kiện chạy lại.
