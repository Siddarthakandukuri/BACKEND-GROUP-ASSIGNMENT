// SQLite connection (Part 2: Database)
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// DB_FILE=':memory:' is used by the automated tests
const file = process.env.DB_FILE || path.join(__dirname, 'freshmart.db');
const db = new Database(file);

db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

module.exports = db;
