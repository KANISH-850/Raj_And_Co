const express = require('express');
const dashboardController = require('./dashboard.controller');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Route Handlers (All Protected)
 */
router.use(authMiddleware);

router.get('/overview', dashboardController.getOverview);
router.post('/seed', dashboardController.seedData);

module.exports = router;
