const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sync', authController.syncUser);
router.get('/me', authController.getCurrentUser);

module.exports = router;
