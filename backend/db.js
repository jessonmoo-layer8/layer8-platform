const path = require('path');
const config = require('./config');
let pgPool = null;
let sqliteDb = null;

const usePg = config.DATABASE_URL && config.DATABASE_URL.startsWith('postgres');

if (usePg) {
  const { Pool } = require('pg');
  pgPool = new Pool({ connectionString: config.DATABASE_URL });
  (async () => {
    await pgPool.query(`CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      userContext TEXT NOT NULL,
      result TEXT,
      status TEXT DEFAULT 'pending',
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  })().catch((e) => console.error('[DB] init error', e));
} else {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = config.DB_PATH || path.join(__dirname, 'layer8.db');
  sqliteDb = new sqlite3.Database(dbPath);
  sqliteDb.serialize(() => {
    sqliteDb.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      userContext TEXT NOT NULL,
      result TEXT,
      status TEXT DEFAULT 'pending',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

async function insertTask(task, userContext, status, result) {
  const taskStr = JSON.stringify(task);
  const ctxStr = JSON.stringify(userContext);
  const resStr = result ? JSON.stringify(result) : null;
  if (usePg) {
    const { rows } = await pgPool.query(
      'INSERT INTO tasks (task, userContext, status, result) VALUES ($1,$2,$3,$4) RETURNING id',
      [taskStr, ctxStr, status, resStr]
    );
    return { id: rows[0].id };
  }
  return new Promise((resolve, reject) => {
    sqliteDb.run(
      `INSERT INTO tasks (task, userContext, status, result) VALUES (?, ?, ?, ?)`,
      [taskStr, ctxStr, status, resStr],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

async function getTasks() {
  if (usePg) {
    const { rows } = await pgPool.query('SELECT * FROM tasks ORDER BY id DESC');
    return rows.map((row) => ({
      id: row.id,
      task: JSON.parse(row.task),
      userContext: JSON.parse(row.usercontext),
      result: row.result ? JSON.parse(row.result) : null,
      status: row.status,
      timestamp: row.timestamp,
    }));
  }
  return new Promise((resolve, reject) => {
    sqliteDb.all(`SELECT * FROM tasks ORDER BY id DESC`, [], (err, rows) => {
      if (err) return reject(err);
      const tasks = rows.map((row) => ({
        id: row.id,
        task: JSON.parse(row.task),
        userContext: JSON.parse(row.userContext),
        result: row.result ? JSON.parse(row.result) : null,
        status: row.status,
        timestamp: row.timestamp,
      }));
      resolve(tasks);
    });
  });
}

module.exports = { insertTask, getTasks };
