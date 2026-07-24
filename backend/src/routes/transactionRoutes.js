const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    create,
    list,
    update,
    remove,
    summary
} = require('../controllers/transactionController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', list);
router.get('/summary', summary);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;