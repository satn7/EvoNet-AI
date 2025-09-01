// Exemplo de configuração do Nodemailer
const nodemailer = require('nodemailer'); // Instale com: npm install nodemailer

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // Converte string para booleano
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});