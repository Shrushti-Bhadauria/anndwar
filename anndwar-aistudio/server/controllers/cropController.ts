import { Request, Response } from 'express';
import { db } from '../db.js';
import { analyzeCropQuality } from '../gemini.js';

// AI Crop Pre-Check endpoint (Gemini Powered)
export const cropCheck = async (req: Request, res: Response) => {
  try {
    const { cropType, imageBase64, additionalNotes } = req.body;
    const result = await analyzeCropQuality(
      cropType || 'शरबती गेहूँ',
      imageBase64,
      additionalNotes
    );
    await db.cropChecks.create(result);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/ai/crop-check:', err);
    res.status(500).json({ error: 'Crop check analysis failed', details: err.message });
  }
};
