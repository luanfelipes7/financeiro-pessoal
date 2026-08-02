const db = require('../config/database');

function createCategory({userId, name, type}){
    const stmt = db.prepare(`
        INSERT INTO categories (user_id, name, type)
        VALUES(?,?,?)
    `);
    const result = stmt.run(userId, name, type);
    return result.lastInsertRowid;
}

function findCategoriesByUser(userId){
    const stmt = db.prepare(`SELECT * FROM categories WHERE user_id = ? ORDER BY name`);
    return stmt.all(userId);
}

function findCategoryById(id, userId) {
    const stmt = db.prepare(`SELECT * FROM categories WHERE id = ? AND user_id = ?`);
    return stmt.get(id, userId);
}

function deleteCategory(id, userId){
    const stmt = db.prepare(`DELETE FROM categories WHERE id = ? AND user_id = ?`);
    const result = stmt.run(id, userId);
    return result.changes;
}

module.exports ={ createCategory, findCategoriesByUser, findCategoryById, deleteCategory};