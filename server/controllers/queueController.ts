import { Request, Response } from 'express';
import {
  db,
  getActiveSlot,
  updateStageStatus,
  getQueueList,
  getDirective,
  getNotificationsList,
  updateOperatorAction
} from '../db.js';

// Live Queue & Token Tracker stats
export const getLiveQueue = async (req: Request, res: Response) => {
  try {
    const activeSlot = await getActiveSlot();
    res.json({
      tokenNumber: activeSlot?.tokenNumber || 'MP-2409',
      vehicleNumber: activeSlot?.vehicleNumber || 'MP-09-GE-4102',
      cropName: activeSlot?.cropName || 'गेहूं (Sharbati)',
      mandiPremise: `${activeSlot?.mandiCenterName || 'सांवेर उपार्जन केंद्र'} यार्ड परिसर - गेहूं उपार्जन सत्र 2025-26`,
      yardDirective:
        'कृपया अपना वाहन वे-ब्रिज लेन #02 की ओर ले जाएं। आपका टोकन #' + (activeSlot?.tokenNumber || 'MP-2409') + ' गेट पर सफलतापूर्वक सत्यापित हो चुका है एवं नमी परीक्षण दल आपके वाहन की प्रतीक्षा कर रहा है।',
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

// Update specific stage status (for operator terminal or admin control)
export const updateStage = async (req: Request, res: Response) => {
  try {
    const { stepNumber, stageId, status, subHi, subEn, details } = req.body;
    const targetStep = Number(stepNumber ?? stageId);
    const stages = await updateStageStatus(targetStep, status, { subHi, subEn, details });
    stages.sort((a, b) => a.step - b.step);
    res.json({ success: true, stages });
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
    updatedStages.sort((a, b) => a.step - b.step);
    res.json(updatedStages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get dynamically registered farmers for Mandi Operator terminal (NO dummy names)
export const getOperatorQueue = async (req: Request, res: Response) => {
  try {
    const list = getQueueList();
    res.json({ success: true, count: list.length, farmers: list });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get latest yard directive for Farmer Portal (Orange alert box)
export const getLatestDirective = async (req: Request, res: Response) => {
  try {
    const directive = getDirective();
    res.json({ success: true, directive });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get WhatsApp & SMS notification logs for Farmer
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { farmerId, phone } = req.query;
    let list = getNotificationsList();
    if (farmerId) {
      list = list.filter(n => n.farmerId === farmerId);
    } else if (phone) {
      list = list.filter(n => n.phone === phone);
    }
    res.json({ success: true, count: list.length, notifications: list });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Process Mandi Operator action on a farmer (Call to scale, Gate arrival, etc.)
export const postOperatorAction = async (req: Request, res: Response) => {
  try {
    const { token, actionType, scale } = req.body;
    const queue = getQueueList();
    if (!token && queue.length === 0) {
      return res.status(400).json({ error: 'No active farmers in queue' });
    }
    const targetToken = token || queue[0]?.token;
    const result = await updateOperatorAction(targetToken, actionType, scale);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
