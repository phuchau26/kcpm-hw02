# A-FR03 Playwright automation

Automation cho Step 5 của feature quên/đặt lại mật khẩu trên Web. Harness không
sửa source `SHOP`; nó chỉ khởi động SUT, thao tác UI và cập nhật test data trong
SQLite cục bộ.

## Chạy

```powershell
npm install
npm test
```

Runner dùng Chrome đã cài trên Windows, chạy tuần tự 38 test case và ghi output:

```text
../../evidence/A/execution/results.json
../../evidence/A/execution/screenshots/
../../evidence/A/execution/traces/
```

Backend và frontend được tự khởi động nếu port 3000/5173 chưa có service. Khi
runner tự khởi động service, nó cũng tự dừng các process đó sau khi hoàn tất.

## Quy tắc an toàn dữ liệu

- Chỉ dùng database test ở `SHOP/backend/database.sqlite`.
- Chạy tuần tự; không mở hai runner cùng lúc.
- Fixture khôi phục user seed trước mỗi nhóm case.
- Không commit database, `node_modules` hoặc token runtime.
- `BLOCKED` không được chuyển thành `PASS` bằng cách thay đổi expected result.
