import { Router } from 'express';
import { getActiveSlot, bookSlot, rescheduleSlot } from '../controllers/slotController.js';

const router = Router();

router.get('/active', getActiveSlot);
router.post('/book', bookSlot);
router.post('/reschedule', rescheduleSlot);

export default router;
