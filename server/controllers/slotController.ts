import { Request, Response } from 'express';
import { db, getActiveSlot as getActiveSlotFromDb } from '../db.js';

// Get active confirmed slot
export const getActiveSlot = async (req: Request, res: Response) => {
  try {
    const slot = await getActiveSlotFromDb();
    res.json(slot);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Book a new slot
export const bookSlot = async (req: Request, res: Response) => {
  try {
    const { date, timeSlot, mandiCenterName, cropName, quantityQuintal, vehicleNumber } = req.body;
    const tokenNumber = 'MP-' + Math.floor(1000 + Math.random() * 9000);
    const newSlot = {
      id: 'slot_' + Date.now(),
      tokenNumber,
      farmerId: 'farmer_001',
      farmerName: 'राम सिंह',
      date: date || '27 अक्टूबर 2025',
      timeSlot: timeSlot || '11:00 AM – 12:30 PM',
      gateArrivalExpected: '10:45 AM',
      mandiCenterName: mandiCenterName || 'सांवेर उपार्जन केंद्र',
      gateNumber: 'गेट क्र. 02',
      laneNumber: 'लेन #02 (ट्रॉली लेन)',
      cropName: cropName || 'शरबती गेहूँ (ग्रेड-A)',
      cropGrade: 'ग्रेड-A',
      quantityQuintal: Number(quantityQuintal) || 45,
      mspRatePerQuintal: 2400,
      totalEstimatedValue: (Number(quantityQuintal) || 45) * 2400,
      vehicleNumber: vehicleNumber || 'MP-09-EA-3142',
      vehicleType: 'ट्रैक्टर ट्रॉली',
      status: 'confirmed' as const,
      bookingTimestamp: new Date().toISOString(),
      qrCodeData: `ANNDWAR|${tokenNumber}|RAM_SINGH|${quantityQuintal || 45}Q|${mandiCenterName || 'SANWER'}`,
    };

    await db.slots.create(newSlot);
    res.json({ success: true, slot: newSlot });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Reschedule slot
export const rescheduleSlot = async (req: Request, res: Response) => {
  try {
    const { newDate, newTimeSlot, newMandi } = req.body;
    const active = await db.slots.findOne();
    if (active) {
      const updated = await db.slots.updateOne(active.id, {
        date: newDate || '28 अक्टूबर 2025',
        timeSlot: newTimeSlot || '09:00 AM – 10:30 AM',
        mandiCenterName: newMandi || active.mandiCenterName,
        status: 'confirmed',
      });
      return res.json({ success: true, slot: updated });
    }
    res.status(404).json({ error: 'No active slot found to reschedule' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
