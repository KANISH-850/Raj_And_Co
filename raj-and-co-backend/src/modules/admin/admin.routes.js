const express = require('express');
const { listUsers, updateUser } = require('./admin.controller');
const authMiddleware = require('../../middleware/auth');
const adminMiddleware = require('../../middleware/admin');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', listUsers);
router.patch('/users/:id', updateUser);

module.exports = router;
