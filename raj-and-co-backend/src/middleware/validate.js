const { error } = require('../utils/response');

/**
 * Zod validation middleware
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.').replace('body.', ''),
      message: e.message,
    }));
    return error(res, 'Validation Failed', 400, details);
  }
};

module.exports = validate;
