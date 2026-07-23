const db = require('../config/database');

function createUser({name, email, passwordHash}){
    const stmt = db.prepare(`
        INSERT INTO users (name, email, passwordHash)
        VALUES (?, ?, ?)
    `);
    const result = stmt.run(name, email, passwordHash);
    return result.lastInsertRowid;
}

function findUserByEmail(email) {
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    return stmt.get(email);
}

module.exports = {createUser, findUserByEmail};