import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

export function createDatabaseFixture(shopRoot, databasePath, credentials) {
  const sqlite3 = require(
    path.join(shopRoot, "backend", "node_modules", "sqlite3"),
  ).verbose();

  function open() {
    return new sqlite3.Database(databasePath);
  }

  function exec(sql) {
    return new Promise((resolve, reject) => {
      const db = open();
      db.exec(sql, (error) => {
        db.close();
        if (error) reject(error);
        else resolve();
      });
    });
  }

  function run(sql, params = []) {
    return new Promise((resolve, reject) => {
      const db = open();
      db.run(sql, params, function onRun(error) {
        db.close();
        if (error) reject(error);
        else resolve({ changes: this.changes, lastID: this.lastID });
      });
    });
  }

  function get(sql, params = []) {
    return new Promise((resolve, reject) => {
      const db = open();
      db.get(sql, params, (error, row) => {
        db.close();
        if (error) reject(error);
        else resolve(row ?? null);
      });
    });
  }

  async function initialize() {
    await exec(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS coupon_usage;
      DROP TABLE IF EXISTS coupons;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS orders;
      CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
      CREATE TABLE coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        type TEXT DEFAULT 'percent',
        discount_value INTEGER,
        min_order_amount INTEGER DEFAULT 0,
        expired_at DATETIME,
        is_active INTEGER DEFAULT 1,
        max_uses_per_user INTEGER DEFAULT 1
      );
      CREATE TABLE coupon_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coupon_id INTEGER,
        user_id INTEGER,
        used_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT,
        role TEXT DEFAULT 'user',
        login_attempts INTEGER DEFAULT 0,
        locked_until DATETIME,
        reset_token TEXT,
        shipping_address TEXT,
        phone TEXT
      );
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER,
        description TEXT,
        imageUrl TEXT,
        category_id INTEGER
      );
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total_amount INTEGER,
        status TEXT DEFAULT 'pending',
        shipping_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await reset();
  }

  async function reset() {
    await exec(`
      DELETE FROM coupon_usage;
      DELETE FROM coupons;
      DELETE FROM users;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM orders;
      DELETE FROM sqlite_sequence;
    `);
    await run(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [1, "Test User", "test@eshop.com", credentials.userPassword, "user"],
    );
    await run(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [2, "Second Test User", "test2@eshop.com", credentials.userPassword, "user"],
    );
    await run(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [3, "Admin User", "admin@eshop.com", credentials.adminPassword, "admin"],
    );
    await run(
      "INSERT INTO products (id, name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?, ?)",
      [1, "Fixture product", 400000, "B-FR09", "", 1],
    );
    await insertCoupon({ id: 1, code: "SAVE10", type: "percent", discountValue: 10, minimum: 300000, expiry: "2099-12-31", active: 1, limit: 1 });
    await insertCoupon({ id: 2, code: "BIGBUY", type: "fixed", discountValue: 50000, minimum: 500000, expiry: "2099-12-31", active: 1, limit: 1 });
    await insertCoupon({ id: 3, code: "VIP100", type: "fixed", discountValue: 100000, minimum: 300000, expiry: "2099-12-31", active: 1, limit: 2 });
    await insertCoupon({ id: 4, code: "EXPIRED", type: "percent", discountValue: 20, minimum: 100000, expiry: "2020-01-01", active: 1, limit: 1 });
    await insertCoupon({ id: 5, code: "INACTIVE10", type: "percent", discountValue: 10, minimum: 300000, expiry: "2099-12-31", active: 0, limit: 1 });
    await insertCoupon({ id: 6, code: "MINZERO", type: "fixed", discountValue: 1, minimum: 0, expiry: "2099-12-31", active: 1, limit: 1 });
    await insertCoupon({ id: 7, code: "MINONE", type: "fixed", discountValue: 1, minimum: 1, expiry: "2099-12-31", active: 1, limit: 1 });
    await insertCoupon({ id: 8, code: "PERCENT1", type: "percent", discountValue: 1, minimum: 0, expiry: "2099-12-31", active: 1, limit: 1 });
    await insertCoupon({ id: 9, code: "FIXED1", type: "fixed", discountValue: 1, minimum: 0, expiry: "2099-12-31", active: 1, limit: 1 });
  }

  function insertCoupon({ id, code, type, discountValue, minimum, expiry, active = 1, limit = 1 }) {
    return run(
      `INSERT INTO coupons
       (id, code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, code, type, discountValue, minimum, expiry, active, limit],
    );
  }

  async function addUsage(couponId, userId, count) {
    for (let index = 0; index < count; index += 1) {
      await run(
        "INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)",
        [couponId, userId],
      );
    }
  }

  function countUsage(couponId, userId) {
    return get(
      "SELECT COUNT(*) AS count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?",
      [couponId, userId],
    );
  }

  function validateCouponForNominalFixture(candidate) {
    if (typeof candidate.code !== "string" || candidate.code.trim() === "") return false;
    if (!["percent", "fixed"].includes(candidate.type)) return false;
    if (!Number.isFinite(candidate.discountValue) || candidate.discountValue <= 0) return false;
    if (!Number.isFinite(candidate.minimum) || candidate.minimum < 0) return false;
    if (!Number.isInteger(candidate.limit) || candidate.limit < 1) return false;
    return true;
  }

  return {
    databasePath,
    initialize,
    reset,
    run,
    get,
    insertCoupon,
    addUsage,
    countUsage,
    validateCouponForNominalFixture,
  };
}
