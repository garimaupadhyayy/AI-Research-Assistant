import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

let queryFn;
let runFn;

if (isProd) {
  console.log('[DB] Running in PRODUCTION mode (Connecting to MySQL)...');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test MySQL Connection
  (async () => {
    try {
      const conn = await pool.getConnection();
      console.log('[DB] Successfully connected to cloud MySQL database.');
      conn.release();
    } catch (err) {
      console.error('[DB Error] Failed to connect to cloud MySQL database:', err.message);
    }
  })();

  queryFn = async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  };

  runFn = async (sql, params = []) => {
    const [result] = await pool.query(sql, params);
    return {
      lastID: result.insertId,
      changes: result.affectedRows
    };
  };
} else {
  console.log('[DB] Running in DEVELOPMENT mode (Connecting to local SQLite)...');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dbPath = join(__dirname, '../../database.sqlite');

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('Successfully connected to the SQLite database at:', dbPath);
      db.run('PRAGMA foreign_keys = ON');

      // Initialize tables
      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS research_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            summary TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        db.run(`
          CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            title TEXT,
            url TEXT NOT NULL,
            snippet TEXT,
            FOREIGN KEY (session_id) REFERENCES research_sessions(id) ON DELETE CASCADE
          )
        `);
      });
    }
  });

  queryFn = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  runFn = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };
}

export const query = queryFn;
export const run = runFn;

export default { query, run };
