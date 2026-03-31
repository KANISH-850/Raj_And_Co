const { error } = require('../utils/response');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  
  res.status(statusCode).json({
    error: message,
    details: err.errors || []
  });
};

module.exports = errorHandler;
