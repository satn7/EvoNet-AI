// backend/db.seed.js
const db = require('./db');
const bcrypt = require('bcryptjs');


const users = [
{ email: 'admin@evonetai.com.br', name: 'Admin EvoNet', password: 'evonetai123', role: 'admin' },
{ email: 'senac@evonetai.com', name: 'Prof SENAC', password: 'evonetai123', role: 'partner' }
];


(function seed() {
const insert = db.prepare('INSERT OR IGNORE INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)');
users.forEach(u => insert.run(u.email, u.name, bcrypt.hashSync(u.password, 10), u.role));
insert.finalize();
})();