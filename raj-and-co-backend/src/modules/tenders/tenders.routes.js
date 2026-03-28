const express = require('express');
const { z } = require('zod');
const tendersController = require('./tenders.controller');
const selectedTendersController = require('./selectedTenders.controller');
const validate = require('../../middleware/validate');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

const createTenderSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    title: z.string().min(2),
    tenderValue: z.number().positive().optional(),
    status: z.enum(['submitted', 'approved', 'rejected']).optional(),
    submittedDate: z.string().optional(),
  }),
});

router.use(authMiddleware);

// ─── Standard Tenders ────────────────────────────────────────
router.get('/', tendersController.list);
router.post('/', validate(createTenderSchema), tendersController.create);
router.put('/:id', tendersController.update);
router.delete('/:id', tendersController.remove);

// ─── Selected Tenders (Tender Register) ──────────────────────
router.get('/selected', selectedTendersController.list);
router.post('/selected', selectedTendersController.create);
router.put('/selected/:id/status', selectedTendersController.updateStatus);
router.delete('/selected/:id', selectedTendersController.remove);

module.exports = router;
