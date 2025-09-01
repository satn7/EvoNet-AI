// Dominio.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Listar domínios
router.get('/', async (req, res) => {
  try {
    const dominios = await db('dominios');
    res.json(dominios);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar domínios" });
  }
});

// Adicionar domínio
router.post('/', async (req, res) => {
  const { nome, status } = req.body;

  try {
    const [id] = await db('dominios').insert({ nome, status });
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar domínio" });
  }
});

module.exports = router;
