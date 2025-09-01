// backend/db.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
require('dotenv').config();


const client = process.env.DB_CLIENT || 'sqlite3';
let db;


if (client === 'sqlite3') {
const file = process.env.SQLITE_FILENAME || path.join(__dirname, '..', 'data', 'evonet.db');
const dir = path.dirname(file);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
db = new sqlite3.Database(file);
} else if (client === 'pg') {
// opcional: troque para pg-promise/knex/prisma conforme preferir
throw new Error('DB_CLIENT=pg não implementado neste snippet. Use knex/prisma.');
}


module.exports = db;