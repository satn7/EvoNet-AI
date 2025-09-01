require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importa as rotas
const loginRouter = require('./login');
// Adicione outras rotas aqui conforme for criando (ex: dashboardRouter)

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais
app.use(cors()); // Permite requisições de outros domínios (seu front-end)
app.use(express.json()); // Permite que o servidor entenda JSON

// --- ROTAS DA API ---
app.use('/api/login', loginRouter);
// app.use('/api/dashboard', dashboardRouter);

// --- SERVIR ARQUIVOS DO FRONT-END ---
// Aponta para a pasta onde estão seus arquivos HTML, CSS, JS do front-end
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Rota principal que serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor EvoNet AI rodando em http://localhost:${PORT}`);
});