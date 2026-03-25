const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', tenderController.getAllTenders);
router.post('/', tenderController.createTender);
router.put('/:id', tenderController.updateTender);

module.exports = router;
