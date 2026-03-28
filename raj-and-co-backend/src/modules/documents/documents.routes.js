const express = require('express');
const { list, create, remove } = require('./documents.controller');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', list);
router.post('/', create);
router.delete('/:id', remove);

module.exports = router;
