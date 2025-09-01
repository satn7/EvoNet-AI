// backend/db.migrate.js
const db = require('./db');


const stmts = [
`CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE NOT NULL,
name TEXT NOT NULL,
password_hash TEXT NOT NULL,
role TEXT NOT NULL DEFAULT 'user',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS contact_messages (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT NOT NULL,
message TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
];


(function run() {
db.serialize(() => {
stmts.forEach(sql => db.run(sql));
});
})();