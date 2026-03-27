const express = require('express');
const { z } = require('zod');
const contractorsController = require('./contractors.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

/**
 * Zod schemas for validation
 */
const createContractorSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    specialty: z.enum(['civil', 'electrical', 'plumbing', 'automation', 'misc']),
    rating: z.number().min(0).max(5).optional(),
    contact: z.string().optional(),
    available: z.boolean().optional(),
  }),
});

/**
 * Route Handlers (All Protected)
 */
router.use(authMiddleware);

router.get('/', contractorsController.list);
router.post('/', validate(createContractorSchema), contractorsController.create);
router.get('/suggest', contractorsController.suggest);
router.put('/:id', contractorsController.update);
router.delete('/:id', contractorsController.remove);

module.exports = router;
