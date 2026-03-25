const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', workerController.getAllWorkers);
router.post('/', workerController.createWorker);
router.delete('/:id', workerController.deleteWorker);

module.exports = router;
