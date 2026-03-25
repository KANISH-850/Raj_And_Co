const express = require('express');
const router = express.Router();
const contractorController = require('../controllers/contractorController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', contractorController.getAllContractors);
router.get('/suggest', contractorController.getSuggestions);

module.exports = router;
