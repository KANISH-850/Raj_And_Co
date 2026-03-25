const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', salaryController.getSalaries);
router.post('/calculate', salaryController.calculateSalary);
router.put('/:id/pay', salaryController.markPaid);

module.exports = router;
