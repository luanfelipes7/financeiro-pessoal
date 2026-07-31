const{
    createCategory,
    findCategoriesByUser,
    findCategoryById,
    deleteCategory
} = require.apply('../models/categoryModel');

const VALID_TYPES = ['income', 'expense'];

function create(req, res){
    try {
        const {name, type} = req.body;

        if(!name) {
            return res.status(400).json({error: 'O campo "name" é obrigatório'});
        }
        if (!type || !VALID_TYPES.includes(type)) {
            return res.status(400).json({error : 'O campo "type" deve ser "income" ou "expense".'});
        }

        const categoryId = createCategory({ userId: req.userId, name, type});
        
        return res.status(201).json({
            message: 'Categoria criada com sucesso.',
            category: { id: categoryId, name, type}
        });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'Você já tem essa categoria cadastrada.'});
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar categoria.'});
    }
}

function list(req, res){
    try{
        const categories = findCategoriesByUser(req.userId);
        return res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error:'Erro ao listar categorias.'});
    }
}

function remove(req, res){
    try {
        const {id} = req.params;
        const existing = findCategoryById(id, req.userId);
        if (!existing) {
            return res.status(404).json({ error: 'Categoria não encontrada.'});
        }
        deleteCategory(id, req.params);
        return res.status(200).json({ message: 'Categoria removida com sucesso'});
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Erro ao remover categoria.'});
    }
}

module.exports = { create, list, remove};