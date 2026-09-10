import { Router } from 'express';
import {
  getFarmerProfile,
  updateFarmerProfile,
  getFarmerDocuments,
  getFarmerPayments,
} from '../controllers/farmerController.js';

const router = Router();

router.get('/profile', getFarmerProfile);
router.put('/profile', updateFarmerProfile);
router.get('/documents', getFarmerDocuments);
router.get('/payments', getFarmerPayments);

export default router;
