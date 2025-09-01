const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); // Garante que o .env da raiz seja lido

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      // Cria o arquivo do banco de dados na pasta raiz do projeto
      filename: path.join(__dirname, '..', 'evonet.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations' // As migrações ficarão em backend/migrations
    },
    seeds: {
      directory: './seeds' // As seeds ficarão em backend/seeds
    }
  }
};