import { Router } from 'express';
import { getLiveQueue, getStages, advanceStage } from '../controllers/queueController.js';

const router = Router();

router.get('/live', getLiveQueue);
router.post('/advance-stage', advanceStage);

export default router;
