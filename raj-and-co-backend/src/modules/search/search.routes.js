const express = require('express');
const { search } = require('./search.controller');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', search);

module.exports = router;
