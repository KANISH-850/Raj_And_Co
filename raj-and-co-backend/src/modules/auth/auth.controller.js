const authService = require('./auth.service');
const { success, error } = require('../../utils/response');

/**
 * Register Controller
 */
const register = async (req, res, next) => {
  return error(res, 'New registrations are disabled', 403);
};

/**
 * Login Controller
 */
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body.email, req.body.password);
    return success(res, { user, token }, 'Login successful');
  } catch (err) {
    return error(res, err.message, 401);
  }
};

/**
 * Me Controller (Current Profile)
 */
const me = async (req, res, next) => {
  try {
    const userSnapshot = await authService.getUserById(req.user.id);
    return success(res, userSnapshot, 'Retrieved user profile');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
