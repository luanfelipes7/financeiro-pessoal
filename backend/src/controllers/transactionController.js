const{
    createTransaction,
    findTransactionsByUser,
    findTransactionById,
    uptateTransaction,
    deleteTransaction,
    getSummary
} = require('../models/transactionModel');

const VALID_TYPES = ['income', 'expense'];

function validateTransactionData({type, amount, category, description, date}){
    if (!type || !VALID_TYPES.includes(type)){
        return 'O campo "type" deve ser "income" ou "expense".';
    }
    if (amount === undefined || isNaN(amount) || Number(amount) <= 0){
        return 'O campo "amount" deve ser um número positivo.';
    }
    if (!category){
        return 'O campo"category" é obrigatório.';
    }
    if (!date){
        return 'O campo "date" é obrigatório (formato YYYY-MM-DD).';
    }
    return null;
}

function create(rep, res){
    try{
        const {type, amount, category, description, date} = rep.body;

        const errorMessage = validateTransactionData({type, amount, category, date});
        if (errorMessage){
            return res.status(400).json({error: errorMessage});
        }

        const transactionId = createTransaction({
            userId: rep.userId,
            type,
            amount: Number(amount),
            category,
            description: description || null,
            date
        });

        return res.status(201).json({
            message: 'Transação criada com sucesso.',
            transaction:{ id: transactionId, type, amount, category, description, date}
        });
    }catch (error){
        console.error(error);
        return res.status(500).json({error: 'Erro ao criar a transação.'});
    }
}

function list(req,res){
    try {
        const {month, category, type} = req.query;
        const transactions = findTransactionsByUser(req.userId, {month, category,type});
        return res.status(200).json({transactions});
    }catch (error){
        console.error(error);
        return res.status(500).json({error: 'Erro interno ao listar transações.'});
    }
}

function update(req, res){
    try{
        const {id} = req.params;
        const{type, amount, category, description, date} = req.body;

        const errorMessage = validateTransactionData({type, amount, category, date});
        if (errorMessage){
            return res.status(400).json({error: errorMessage});
        }

        const existing = findTransactionById(id, req.userId);
        if (!existing){
            return res.status(404).json({error: 'Transação não encontrada.'});
        }

        updateTransaction(id, req.userId, {
            type,
            amount: Number(amount),
            category,
            description: description || null,
            date
        });

        return res.status(200).json({message: 'Transação atualizada com sucesso.'});
    } catch (error){
        console.error(error);
        return res.status(500).json({error: 'Erro interno ao atualizar a transação.'});
    }
}

function remove(req, res){
    try{
        const {id}= req.params;

        const existing = findTransactionById(id, req.userId);
        if (!existing){
            return res.status(404).json({error: 'Transação não encontrada.'});
        }

        deleteTransaction(id, req.userId);

        return res.status(200).json({message: 'Transação removida com sucesso.'});
    }catch (error){
        console.error(error);
        return res.status(500).json({error: 'Erro interno ao remover a transação.'});
    }
}

function summary(req, res){
    try{
        const {month} = req.query;
        const result = getSummary(req.userId,{month});

        const totalIncome = result.totalIncome || 0;
        const totalExpense = result.totalExpense || 0;

        return res.status(200).json({
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({error: 'Erro interno ao obter o resumo.'});
    }
}

module.exports = {
    create, list, update, remove, summary
};