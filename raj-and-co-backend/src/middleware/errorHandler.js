const { error } = require('../utils/response');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred on the server.';
  const details = err.errors || [];

  return error(res, message, statusCode, details);
};

module.exports = errorHandler;
