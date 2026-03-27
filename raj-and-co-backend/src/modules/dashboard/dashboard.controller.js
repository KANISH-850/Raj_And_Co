const dashboardService = require('./dashboard.service');
const { success } = require('../../utils/response');

/**
 * Get Dashboard Overview
 */
const getOverview = async (req, res, next) => {
  try {
    const data = await dashboardService.getOverview(req.user.id);
    return success(res, data, 'Dashboard overview retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Seed User Data Controller
 */
const seedData = async (req, res, next) => {
  try {
    const data = await dashboardService.seedDataForUser(req.user.id);
    return success(res, data, 'User demonstration environment created');
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, seedData };
