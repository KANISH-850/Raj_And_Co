const { error } = require('../utils/response');

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return error(res, 'Access denied. Administrator privileges required.', 403);
};

module.exports = adminMiddleware;
