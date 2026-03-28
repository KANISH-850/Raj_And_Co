const authService = require('./auth.service');
const { success, error } = require('../../utils/response');

/**
 * Register Controller
 */
const register = async (req, res, next) => {
  try {
    const userSnapshot = await authService.register(req.body);
    return success(res, userSnapshot, 'User registered successfully', 201);
  } catch (err) {
    if (err.code === 'P2002') { // Unique constraint failed
      return error(res, 'Email already in use', 409);
    }
    next(err);
  }
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

const status = async (req, res, next) => {
  try {
    const prisma = require('../../config/db');
    const count = await prisma.user.count();
    return success(res, { userCount: count }, 'System status retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me, status };
