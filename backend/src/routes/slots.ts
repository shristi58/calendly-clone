import { Router } from 'express';
import { SlotController } from '../controllers/slot.controller.js';

const router = Router();

router.get('/', SlotController.getSlots);

export default router;
