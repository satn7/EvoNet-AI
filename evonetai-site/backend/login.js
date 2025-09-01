// login.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // conexão knex

// Rota de login
router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await db('usuarios').where({ email, senha }).first();

    if (user) {
      res.json({ success: true, message: "Login realizado com sucesso", user });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor", details: err });
  }
});

module.exports = router;
