const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const user = await db('users').where({ email }).first();

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: payload.user
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

module.exports = router;