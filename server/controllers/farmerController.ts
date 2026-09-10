import { Request, Response } from 'express';
import { db } from '../db.js';

// Get farmer profile
export const getFarmerProfile = async (req: Request, res: Response) => {
  try {
    const farmer = await db.farmers.findById('farmer_001');
    res.json(farmer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update farmer profile
export const updateFarmerProfile = async (req: Request, res: Response) => {
  try {
    const updated = await db.farmers.updateOne('farmer_001', req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get farmer KYC digital documents
export const getFarmerDocuments = async (req: Request, res: Response) => {
  try {
    const docs = await db.documents.find();
    res.json(docs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get farmer payment history
export const getFarmerPayments = async (req: Request, res: Response) => {
  try {
    const payments = await db.payments.find();
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
