const express = require('express');
const { z } = require('zod');
const salaryController = require('./salary.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Zod schemas for validation
 */
const createSalarySchema = z.object({
  body: z.object({
    projectId: z.string().min(1, 'Project ID is required'),
    workerId: z.string().min(1, 'Worker ID is required'),
    month: z.string().min(1, 'Month (YYYY-MM) is required'),
    amount: z.number().positive(),
    isPaid: z.boolean().optional(),
    paidOn: z.string().optional(),
  }),
});

/**
 * Route Handlers (All Protected)
 */
router.use(authMiddleware);

router.get('/', salaryController.list);
router.post('/', validate(createSalarySchema), salaryController.create);
router.put('/:id', salaryController.update);
router.patch('/:id/mark-paid', salaryController.markPaid);
router.delete('/:id', salaryController.remove);

module.exports = router;
