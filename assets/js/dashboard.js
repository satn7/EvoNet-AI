// dashboard.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Informações gerais do sistema
router.get('/', async (req, res) => {
  try {
    const usersCount = await db('usuarios').count('id as total').first();
    const dominiosCount = await db('dominios').count('id as total').first();

    res.json({
      status: "online",
      usuarios: usersCount.total,
      dominios: dominiosCount.total
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar dados do dashboard" });
  }
});

module.exports = router;
