const express = require('express');
const { z } = require('zod');
const projectsController = require('./projects.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Zod schemas for validation
 */
const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Project name is required'),
    location: z.string().optional(),
    tenderRef: z.string().optional(),
    type: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['active', 'completed', 'paused', 'cancelled']).optional()
  }),
});

/**
 * Route Handlers (All Protected)
 */
router.use(authMiddleware);

router.get('/', projectsController.list);
router.post('/', validate(createProjectSchema), projectsController.create);
router.get('/:id', projectsController.getById);
router.put('/:id', projectsController.update);
router.delete('/:id', projectsController.remove);
router.get('/:id/summary', projectsController.getSummary);

module.exports = router;
