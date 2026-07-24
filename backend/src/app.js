const express = require('express');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('.//routes/transactionRoutes');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req,res) => {
    res.json({message: 'API de Controle Financeiro rodando!'});
});

module.exports = app;