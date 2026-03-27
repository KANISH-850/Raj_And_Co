const express = require('express');
const { z } = require('zod');
const expensesController = require('./expenses.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Zod schemas for validation
 */
const createExpenseSchema = z.object({
  body: z.object({
    date: z.string().min(1, 'Date is required'),
    category: z.enum(['material', 'labour', 'equipment', 'misc']),
    description: z.string().optional(),
    amount: z.number().positive('Amount must be positive'),
  }),
});

/**
 * Route Handlers (All Protected)
 */
router.use(authMiddleware);

// Global endpoints
router.get('/summary', expensesController.getGlobalSummary);
router.put('/:id', expensesController.update);
router.delete('/:id', expensesController.remove);

// Nested endpoints under projects
// (Mounted in app.js as /api/projects/:projectId/expenses)
router.get('/:projectId/expenses', expensesController.list);
router.post('/:projectId/expenses', validate(createExpenseSchema), expensesController.create);

module.exports = router;
