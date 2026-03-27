const express = require('express');
const { z } = require('zod');
const tendersController = require('./tenders.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Zod schemas for validation
 */
const createTenderSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    title: z.string().min(2),
    tenderValue: z.number().positive().optional(),
    status: z.enum(['submitted', 'approved', 'rejected']).optional(),
    submittedDate: z.string().optional(),
  }),
});

/**
 * Route Handlers (All Protected)
 */
router.use(authMiddleware);

router.get('/', tendersController.list);
router.post('/', validate(createTenderSchema), tendersController.create);
router.put('/:id', tendersController.update);
router.delete('/:id', tendersController.remove);

module.exports = router;
