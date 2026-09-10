import { Request, Response } from 'express';
import { db } from '../db.js';

// Live Queue & Token Tracker stats
export const getLiveQueue = async (req: Request, res: Response) => {
  try {
    const activeSlot = await db.slots.findOne();
    res.json({
      tokenNumber: activeSlot?.tokenNumber || 'MP-2409',
      vehicleNumber: activeSlot?.vehicleNumber || 'MP-09-GE-4102',
      cropName: activeSlot?.cropName || 'गेहूं (Sharbati)',
      mandiPremise: 'इंदौर कृषि उपज मंडी यार्ड परिसर - गेहूं उपार्जन सत्र 2025-26',
      yardDirective:
        'कृपया अपना वाहन वे-ब्रिज लेन #02 की ओर ले जाएं। आपका टोकन #MP-2409 गेट पर सफलतापूर्वक सत्यापित हो चुका है एवं नमी परीक्षण दल आपके वाहन की प्रतीक्षा कर रहा है।',
      queueOrder: 14,
      totalVehiclesInYard: 42,
      estimatedWaitMinutes: 38,
      avgProcessingRateMin: 2.7,
      yardLoadPercent: 64,
      yardLoadLevel: 'मध्यम भार',
      activeScalesCount: 4,
      scalesStatusNote: 'सभी 4 इलेक्ट्रॉनिक वे-स्केल सुचारू कार्यरत',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 7-Stage Procurement Lifecycle stages
export const getStages = async (req: Request, res: Response) => {
  try {
    const stages = await db.stages.find();
    stages.sort((a, b) => a.step - b.step);
    res.json(stages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Advance lifecycle stage (for operator terminal or simulation)
export const advanceStage = async (req: Request, res: Response) => {
  try {
    const { stepNumber, moistureVal, grossWeight } = req.body;
    const stages = await db.stages.find();
    for (const stage of stages) {
      if (stage.step < stepNumber) {
        stage.status = 'completed';
      } else if (stage.step === stepNumber) {
        stage.status = 'in_progress';
        if (moistureVal && stage.step === 4) {
          stage.subHi = `नमी: ${moistureVal}% (मानक योग्य पास)`;
          stage.subEn = `Moisture: ${moistureVal}% (Standard Pass)`;
        }
        if (grossWeight && stage.step === 5) {
          stage.subHi = `सकल तौल: ${grossWeight} क्विंटल (कांटा #02)`;
        }
      } else {
        stage.status = 'upcoming';
      }
      await db.stages.updateOne(stage.id, stage);
    }
    const updatedStages = await db.stages.find();
    res.json(updatedStages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
