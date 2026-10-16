import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

export function createDatabaseFixture(shopRoot, databasePath, credentials) {
  const sqlite3 = require(path.join(shopRoot, "backend", "node_modules", "sqlite3")).verbose();

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

  function all(sql, params = []) {
    return new Promise((resolve, reject) => {
      const db = open();
      db.all(sql, params, (error, rows) => {
        db.close();
        if (error) reject(error);
        else resolve(rows);
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
      [1, "Admin Fixture", "admin.c-fr14@example.test", credentials.adminPassword, "admin"],
    );
    await run(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [2, "User Fixture", "user.c-fr14@example.test", credentials.userPassword, "user"],
    );
    const categories = [
      [1, "Điện thoại"],
      [2, "Laptop"],
      [3, "Phụ kiện"],
      [4, "Âm thanh"],
    ];
    for (const [id, name] of categories) {
      await run("INSERT INTO categories (id, name) VALUES (?, ?)", [id, name]);
    }
    const products = [
      [1, "Phone fixture 1", 1000, 1],
      [2, "Phone fixture 2", 2000, 1],
      [3, "Laptop fixture", 3000, 2],
    ];
    for (const [id, name, price, categoryId] of products) {
      await run(
        "INSERT INTO products (id, name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, price, "C-FR14", "", categoryId],
      );
    }
  }

  function categories() {
    return all("SELECT id, name FROM categories ORDER BY id");
  }

  function category(id) {
    return get("SELECT id, name FROM categories WHERE id = ?", [id]);
  }

  function countCategories() {
    return get("SELECT COUNT(*) AS count FROM categories");
  }

  function maxCategoryId() {
    return get("SELECT COALESCE(MAX(id), 0) AS id FROM categories");
  }

  function referenceCount(id) {
    return get("SELECT COUNT(*) AS count FROM products WHERE category_id = ?", [id]);
  }

  function products() {
    return all("SELECT id, name, category_id FROM products ORDER BY id");
  }

  return {
    databasePath,
    initialize,
    reset,
    exec,
    run,
    get,
    all,
    categories,
    category,
    countCategories,
    maxCategoryId,
    referenceCount,
    products,
  };
}
