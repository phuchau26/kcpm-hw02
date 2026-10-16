# C-FR14 Playwright runner

Runner thực thi tuần tự 48 test case trong `features/C/04_test_cases.md` trên Admin Web.
Backend dùng bản sao runtime của `SHOP/backend/server.js` với SQLite fixture cô lập; source
và `SHOP/backend/database.sqlite` không bị sửa.

## Chạy

```powershell
npm install
npm test
```

Điều kiện: port `3000` và `5174` phải trống. Runner từ chối tái sử dụng service có sẵn để bảo
toàn fixture, chỉ dừng process do chính runner tạo. Evidence được ghi vào
`evidence/C/execution/`; runtime database và `node_modules` bị loại khỏi Git.

Nếu môi trường không có network, có thể tạo junction `node_modules` tới dependency Playwright
đã cài ở runner Pool A/B; junction là runtime-only và không được commit.
