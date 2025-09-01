// knexfile.js
require('dotenv').config(); // Carrega o .env aqui também

module.exports = {
  development: {
    client: process.env.DB_CLIENT, // 'sqlite3'
    connection: {
      filename: process.env.SQLITE_FILENAME, // '../data/evonet.db'
    },
    useNullAsDefault: true, // Necessário para SQLite
  },

  // Aqui você poderia adicionar a configuração de produção para o PostgreSQL
  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
  }
};