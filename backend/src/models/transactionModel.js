const db = require ('../config/database');

function createTransaction({userId, type, amount,category, description,date}){
    const stmt = db.prepare(
        `INSERT INTO transactions (user_id, type, amount, category, description,date)
        VALUES (?, ?, ?, ?, ?, ?)
        `);
    const result = stmt.run(userId, type, amount, category, description, date);
    return result.lastInsertRowid;
}

function findTransactionsByUser(userId,filters = {}){
    let query = `SELECT * FROM transactions WHERE user_id = ?`;
    const params = [userId];

    if (filters.month) {
        query += ` AND strftime('%Y-%m', date) =?`;
        params.push(filters.month);
    }

    if (filters.category){
        query += ` AND category = ?`;
        params.push(filters.category);
    }

    if (filters.type){
        query += ` AND type = ?`;
        params.push(filters.type);
    }

    query += ` ORDER BY date DESC`;

    const stmt = db.prepare(query);
    return stmt.all(...params);
}

function findTransactionById(id, userId) {
    const stmt = db.prepare(`SELECT * FROM transactions WHERE id = ? AND user_id = ?`);
    return stmt.get(id, userId);
}

function updateTransaction(id, userId,{type, amount, category, description, date}){
    const stmt = db.prepare(`
        UPDATE transactions
        SET type = ?, amount = ?, categoty = ?, description = ?, date = ?
        WHERE id = ? AND user_id = ?
        `);
    const result = stmt.run(type, amount, category, description, date, id, userId);
    return result.changes > 0;
}

function deleteTransaction(id, userId) {
    const stmt = db.prepare(`DELETE FROM transactions WHERE id = ? AND user_id = ?`);
    const result = stmt.run(id, userId);
    return result.changes;
}

function getSummary(userId, filters = {}) {
    let query = `SELECT
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
    FROM transactions WHERE user_id = ?
    `;
    const params = [userId];

    if (filters.month) {
        query += ` AND strftime('%Y-%m',date) = ?`;
        params.push(filters.month);
    }

    const stmt = db.prepare(query);
    return stmt.get(...params);
}

module.exports ={
    createTransaction,
    findTransactionsByUser,
    findTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary
};