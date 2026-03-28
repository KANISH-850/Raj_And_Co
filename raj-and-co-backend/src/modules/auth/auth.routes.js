const express = require('express');
const { z } = require('zod');
const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Zod schemas for validation
 */
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

/**
 * Route Handlers
 */
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
