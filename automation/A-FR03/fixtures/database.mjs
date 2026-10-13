import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export function createDatabaseFixture(shopRoot) {
  const sqliteModule = path.join(
    shopRoot,
    "backend",
    "node_modules",
    "sqlite3",
  );
  const sqlite3 = require(sqliteModule).verbose();
  const databasePath = path.join(shopRoot, "backend", "database.sqlite");

  function open() {
    return new sqlite3.Database(databasePath);
  }

  function run(sql, params = []) {
    return new Promise((resolve, reject) => {
      const database = open();
      database.run(sql, params, function onRun(error) {
        database.close();
        if (error) reject(error);
        else resolve({ changes: this.changes, lastID: this.lastID });
      });
    });
  }

  function get(sql, params = []) {
    return new Promise((resolve, reject) => {
      const database = open();
      database.get(sql, params, (error, row) => {
        database.close();
        if (error) reject(error);
        else resolve(row ?? null);
      });
    });
  }

  async function restoreSeedUsers() {
    await run(
      `UPDATE users
       SET password = ?, reset_token = NULL, login_attempts = 0, locked_until = NULL
       WHERE email = ?`,
      ["Test1234!", "test@eshop.com"],
    );
    await run(
      `UPDATE users
       SET password = ?, reset_token = NULL, login_attempts = 0, locked_until = NULL
       WHERE email = ?`,
      ["Admin123!", "admin@eshop.com"],
    );
  }

  async function setToken(email, token) {
    return run("UPDATE users SET reset_token = ? WHERE email = ?", [token, email]);
  }

  async function readUser(email) {
    return get(
      `SELECT email, password, reset_token, login_attempts, locked_until
       FROM users WHERE email = ?`,
      [email],
    );
  }

  async function userExists(email) {
    const row = await get("SELECT id FROM users WHERE email = ?", [email]);
    return row !== null;
  }

  return {
    databasePath,
    readUser,
    restoreSeedUsers,
    setToken,
    userExists,
  };
}
