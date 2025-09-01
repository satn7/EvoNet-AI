// index.js

// 1. Carrega as variáveis de ambiente do arquivo .env
// É crucial que esta seja a PRIMEIRA linha de código a ser executada.
require('dotenv').config();

// 2. Importa a biblioteca Express
const express = require('express');

// 3. Cria uma instância do aplicativo Express
const app = express();

// 4. Lê a porta do arquivo .env. Se não estiver definida, usa a 3000 como padrão.
const PORT = process.env.PORT || 3000;

// 5. Cria uma rota de teste para a raiz do servidor
app.get('/', (req, res) => {
  res.send('🎉 Servidor EvoNet AI está no ar!');
});

// 6. Inicia o servidor para "escutar" na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});