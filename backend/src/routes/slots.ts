import { Router } from 'express';
import { SlotController } from '../controllers/slot.controller.js';

const router = Router();

// GET /api/slots?eventTypeId=...&date=... (original query-param style)
router.get('/', SlotController.getSlots);

// GET /api/slots/:eventTypeId?date=...&timezone=... (path-param style used by frontend)
router.get('/:eventTypeId', SlotController.getSlotsByPath);

export default router;
