// 1. Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// 2. Importação de Módulos
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const db = require('./db'); // Conexão com o banco de dados
const { authenticateToken, requireRole } = require('./auth'); // Middlewares de autenticação

// 3. Inicialização do App Express
const app = express();
const PORT = process.env.PORT || 3000;

// 4. Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// --- UTILIDADES ---
const sendError = (res, status = 500, message = 'Ocorreu um erro interno') => res.status(status).json({ success: false, message });

// --- LOGIN ---
app.post('/api/login', 
    body('email').isEmail(),
    body('password').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

        const { email, password } = req.body;

        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) return sendError(res);
            if (!user) return res.status(401).json({ success: false, message: 'Email ou senha inválidos.' });

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Email ou senha inválidos.' });

            const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

            res.json({ success: true, message: 'Login bem-sucedido!', token, user: payload });
        });
    }
);

// --- DASHBOARD ---
app.get('/api/dashboard', authenticateToken, (req, res) => {
    let labs = [];
    const role = req.user.role;

    if (role === 'student') {
        labs = [
            { id: 'lab01', title: 'Lab 01 — VLANs e Router-on-a-Stick', status: 'available' },
            { id: 'lab02', title: 'Lab 02 — Configuração de OSPF', status: 'locked' }
        ];
    } else if (role === 'teacher') {
        labs = [
            { id: 'review01', title: 'Correção Lab 01 — VLANs', status: 'pending' },
            { id: 'review02', title: 'Correção Lab 02 — OSPF', status: 'in-progress' }
        ];
    } else if (role === 'admin') {
        labs = [
            { id: 'admin01', title: 'Gerenciar Usuários', status: 'active' },
            { id: 'admin02', title: 'Configurações da Plataforma', status: 'active' }
        ];
    }

    res.json({ success: true, message: `Bem-vindo ao Dashboard, ${req.user.name}!`, role, labs });
});

// --- CRUD DE USUÁRIOS (Admin) ---
app.get('/api/users', authenticateToken, requireRole('admin'), (req, res) => {
    db.all('SELECT id, email, name, role FROM users', [], (err, rows) => {
        if (err) return sendError(res);
        res.json({ success: true, users: rows });
    });
});

// --- FORMULÁRIO DE CONTATO ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
});

app.post('/api/contact', 
    body('name').notEmpty().withMessage('O nome é obrigatório.'),
    body('email').isEmail().withMessage('O e-mail é inválido.'),
    body('message').isLength({ min: 5 }).withMessage('A mensagem é muito curta.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

        const { name, email, message } = req.body;
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `Nova mensagem do site EvoNet AI`,
            text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
        } catch (err) {
            console.error(err);
            sendError(res, 500, 'Não foi possível enviar a mensagem.');
        }
    }
);

// --- SERVIR PÁGINAS HTML ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.get('/html/:page', (req, res) => {
    const filePath = path.join(__dirname, `../html/${req.params.page}`);
    res.sendFile(filePath, err => {
        if (err) sendError(res, 404, 'Página não encontrada.');
    });
});

// --- ERRO 404 PARA API ---
app.use('/api/*', (req, res) => res.status(404).json({ success: false, message: 'Rota API não encontrada.' }));

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => console.log(`🚀 Servidor EvoNet AI rodando em http://localhost:${5500}`));
