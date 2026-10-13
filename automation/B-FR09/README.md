# B-FR09 Playwright runner

Runner thực thi tuần tự 41 test case của `features/B/04_test_cases.md` và 9
supporting precondition check. Backend dùng một bản sao runtime của `server.js`
với SQLite fixture cô lập; source và `SHOP/backend/database.sqlite` không bị sửa.

## Chạy

```powershell
npm install
npm test
```

Điều kiện: port `3000` và `5173` phải trống. Runner chỉ dừng các process do chính
nó tạo. Evidence được ghi vào `evidence/B/execution/`; runtime database và
`node_modules` bị loại khỏi Git.
