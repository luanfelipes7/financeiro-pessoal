const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {create, list, remove} = require('../controllers/categoryController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/',list);
router.delete('/:id', remove);

module.exports = router;