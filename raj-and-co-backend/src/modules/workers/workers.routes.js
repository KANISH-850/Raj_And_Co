const express = require('express');
const { z } = require('zod');
const workersController = require('./workers.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Zod schemas for validation
 */
const createWorkerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    role: z.string().optional(),
    dailyWage: z.number().positive().optional(),
    joinedDate: z.string().optional()
  }),
});

/**
 * Route Handlers (All Protected)
 */
router.use(authMiddleware);

// Standard endpoints
router.put('/:id', workersController.update);
router.delete('/:id', workersController.remove);

// Nested endpoints under projects
// (These are typically mounted in app.js as /api/projects/:projectId/workers)
router.get('/:projectId/workers', workersController.list);
router.post('/:projectId/workers', validate(createWorkerSchema), workersController.create);

module.exports = router;
