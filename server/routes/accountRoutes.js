const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', accountController.getTransactions);
router.post('/', accountController.createTransaction);
router.get('/summary', accountController.getAccountSummary);

module.exports = router;
