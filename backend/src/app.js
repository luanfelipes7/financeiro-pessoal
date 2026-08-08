const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('.//routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : '*';

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req,res) => {
    res.json({message: 'API de Controle Financeiro rodando!'});
});

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;