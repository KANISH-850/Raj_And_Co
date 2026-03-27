/**
 * Standardized success response
 */
const success = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

/**
 * Standardized error response
 */
const error = (res, message, errorCode = 400, details = []) => {
  return res.status(errorCode).json({
    success: false,
    error: message,
    details,
  });
};

/**
 * Standardized paginated response
 */
const paginated = (res, data, page, limit, total, message = 'Retrieved items') => {
  return res.status(200).json({
    success: true,
    data,
    message,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

module.exports = { success, error, paginated };
