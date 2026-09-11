import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  Download, 
  RefreshCw, 
  Eye, 
  Tractor, 
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  Radio,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, MandiSlot } from '../types';
import { generateQrDataUrl } from '../utils/qrGenerator';

interface SlotBookingProps {
  lang: Language;
  activeSlot: MandiSlot | null;
  onSlotBooked: (newSlot: MandiSlot) => void;
  onOpenReceipt: () => void;
  onOpenReschedule: () => void;
  onViewLiveQueue: () => void;
}

export const SlotBooking: React.FC<SlotBookingProps> = ({
  lang,
  activeSlot,
  onSlotBooked,
  onOpenReceipt,
  onOpenReschedule,
  onViewLiveQueue,
}) => {
  const isHi = lang === 'hi';
  const [gateQrUrl, setGateQrUrl] = useState<string>('');

  useEffect(() => {
    if (activeSlot) {
      const qrData = activeSlot.qrCodeData || `ANNDWAR|TOKEN:${activeSlot.tokenNumber}|FARMER:${activeSlot.farmerId}|CROP:${activeSlot.cropName}|QTY:${activeSlot.quantityQuintal}Q|MANDI:${activeSlot.mandiCenterName}`;
      generateQrDataUrl(qrData).then((url) => setGateQrUrl(url));
    }
  }, [activeSlot]);

  const [selectedDate, setSelectedDate] = useState<string>(
    activeSlot ? activeSlot.date.replace(' 2025', '') : '27 Oct'
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    activeSlot ? activeSlot.timeSlot : '11:00 AM - 12:30 PM'
  );
  const [cropType, setCropType] = useState<string>('शरबती गेहूँ (ग्रेड-A)');
  const [quantity, setQuantity] = useState<number>(45);
  const [vehicleNo, setVehicleNo] = useState<string>('MP-09-EA-3142');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const handleSelectDate = (dateId: string) => {
    setSelectedDate(dateId);
    const updatedDate = isHi ? `${dateId.replace('Oct', 'अक्टूबर')} 2025` : `${dateId} 2025`;
    if (activeSlot) {
      const updated = { ...activeSlot, date: updatedDate, timeSlot: selectedTimeSlot };
      onSlotBooked(updated);
      fetch('/api/slots/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate: updatedDate, newTimeSlot: selectedTimeSlot }),
      }).catch(() => {});
    }
    setBookingSuccessMsg(
      isHi 
        ? `दिनांक रियल-टाइम में बदलकर '${updatedDate}' की गई!`
        : `Date updated in real-time to '${updatedDate}'!`
    );
  };

  const handleSelectTime = (timeRange: string) => {
    setSelectedTimeSlot(timeRange);
    const currentDate = isHi ? `${selectedDate.replace('Oct', 'अक्टूबर')} 2025` : `${selectedDate} 2025`;
    if (activeSlot) {
      const updated = { ...activeSlot, date: currentDate, timeSlot: timeRange };
      onSlotBooked(updated);
      fetch('/api/slots/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate: currentDate, newTimeSlot: timeRange }),
      }).catch(() => {});
    }
    setBookingSuccessMsg(
      isHi 
        ? `समय स्लॉट रियल-टाइम में बदलकर '${timeRange}' किया गया!`
        : `Time slot updated in real-time to '${timeRange}'!`
    );
  };

  const dates = [
    {
      id: '26 Oct',
      titleHi: 'आज (Today)',
      titleEn: 'Today',
      dayHi: 'शनिवार (Sat)',
      dayEn: 'Saturday',
      dateStr: '26 Oct',
      statusHi: 'पूर्ण (Full)',
      statusEn: 'Full',
      statusBadgeColor: 'bg-[#fbe9e7] text-[#c62828] border-[#ffcdd2]',
      subHi: 'कोई स्लॉट रिक्त नहीं',
      subEn: 'No slots vacant',
      isFull: true,
    },
    {
      id: '27 Oct',
      titleHi: 'कल (Tomorrow)',
      titleEn: 'Tomorrow',
      dayHi: 'सोमवार (Mon)',
      dayEn: 'Monday',
      dateStr: '27 Oct',
      recommendedBadge: isHi ? 'अनुशंसित (Best)' : 'Recommended',
      statusHi: 'सुगम',
      statusEn: 'Clear',
      statusBadgeColor: 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]',
      subHi: '42 स्लॉट उपलब्ध',
      subEn: '42 Slots Available',
      isFull: false,
    },
    {
      id: '28 Oct',
      titleHi: 'दिवस 3',
      titleEn: 'Day 3',
      dayHi: 'मंगलवार (Tue)',
      dayEn: 'Tuesday',
      dateStr: '28 Oct',
      statusHi: 'उपलब्ध',
      statusEn: 'Available',
      statusBadgeColor: 'bg-[#e0f2f1] text-[#00695c] border-[#b2dfdb]',
      subHi: '85 स्लॉट उपलब्ध',
      subEn: '85 Slots Available',
      isFull: false,
    },
    {
      id: '29 Oct',
      titleHi: 'दिवस 4',
      titleEn: 'Day 4',
      dayHi: 'बुधवार (Wed)',
      dayEn: 'Wednesday',
      dateStr: '29 Oct',
      statusHi: 'सीमित (Fast)',
      statusEn: 'Filling Fast',
      statusBadgeColor: 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]',
      subHi: '12 स्लॉट शेष',
      subEn: '12 Slots Left',
      isFull: false,
    },
    {
      id: '30 Oct',
      titleHi: 'दिवस 5',
      titleEn: 'Day 5',
      dayHi: 'गुरुवार (Thu)',
      dayEn: 'Thursday',
      dateStr: '30 Oct',
      statusHi: 'उपलब्ध',
      statusEn: 'Available',
      statusBadgeColor: 'bg-[#e0f2f1] text-[#00695c] border-[#b2dfdb]',
      subHi: '80 स्लॉट उपलब्ध',
      subEn: '80 Slots Available',
      isFull: false,
    },
  ];

  const timeSlots = [
    {
      id: '09:00 AM - 10:30 AM',
      sessionHi: 'प्रातः सत्र',
      sessionEn: 'Morning Session',
      range: '09:00 AM - 10:30 AM',
      entryHi: 'गेट एंट्री प्रारंभ: 08:45 AM',
      entryEn: 'Gate Entry: 08:45 AM',
      waitHi: 'प्रतीक्षा: ~15 मिनट',
      waitEn: 'Wait: ~15 min',
      vacantHi: '08 स्थान शेष',
      vacantEn: '08 spots left',
    },
    {
      id: '11:00 AM - 12:30 PM',
      sessionHi: 'मध्याह्न',
      sessionEn: 'Noon Session',
      range: '11:00 AM - 12:30 PM',
      entryHi: 'गेट एंट्री प्रारंभ: 10:45 AM',
      entryEn: 'Gate Entry: 10:45 AM',
      waitHi: 'प्रतीक्षा: ~20 मिनट',
      waitEn: 'Wait: ~20 min',
      vacantHi: '18 स्थान शेष',
      vacantEn: '18 spots left',
    },
    {
      id: '02:00 PM - 03:30 PM',
      sessionHi: 'अपराह्न',
      sessionEn: 'Afternoon Session',
      range: '02:00 PM - 03:30 PM',
      entryHi: 'गेट एंट्री प्रारंभ: 01:45 PM',
      entryEn: 'Gate Entry: 01:45 PM',
      waitHi: 'प्रतीक्षा: ~25 मिनट',
      waitEn: 'Wait: ~25 min',
      vacantHi: '11 स्थान शेष',
      vacantEn: '11 spots left',
    },
    {
      id: '04:00 PM - 05:30 PM',
      sessionHi: 'सायं सत्र',
      sessionEn: 'Evening Session',
      range: '04:00 PM - 05:30 PM',
      entryHi: 'गेट एंट्री प्रारंभ: 03:45 PM',
      entryEn: 'Gate Entry: 03:45 PM',
      waitHi: 'प्रतीक्षा: ~10 मिनट',
      waitEn: 'Wait: ~10 min',
      vacantHi: '05 स्थान शेष',
      vacantEn: '05 spots left',
    },
  ];

  const handleBookSlot = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/slots/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: `${selectedDate} 2025`,
          timeSlot: selectedTimeSlot,
          mandiCenterName: 'सांवेर उपार्जन केंद्र',
          cropName: cropType,
          quantityQuintal: quantity,
          vehicleNumber: vehicleNo,
        }),
      });
      const data = await response.json();
      if (data.success && data.slot) {
        onSlotBooked(data.slot);
        setBookingSuccessMsg(
          isHi
            ? `स्लॉट सफलतापूर्वक बुक हुआ! टोकन: ${data.slot.tokenNumber}`
            : `Slot booked successfully! Token: ${data.slot.tokenNumber}`
        );
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Slot booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl">
      {/* Header & Server Time (Exact match to Screenshot 7) */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#143425] tracking-tight">
            {isHi ? 'मंडी स्लॉट बुकिंग एवं ई-टोकन' : 'Mandi Slot Booking & E-Token'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4f705f] mt-0.5">
            {isHi
              ? 'अपनी उपज विक्रय हेतु तिथि, मंडी केंद्र एवं समय स्लॉट चुनें।'
              : 'Select date, procurement centre, and time slot for selling your grain.'}
          </p>
        </div>

        <div className="bg-white border border-[#d2dfd6] rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-[#2b513d] shadow-xs">
          <Clock className="w-4 h-4 text-[#1b7e45]" />
          <div>
            <span className="text-[10px] text-[#6b8b7a] block leading-none">
              {isHi ? 'आज का सर्वर समय' : 'Server Time'}
            </span>
            <span className="font-bold text-xs text-[#133827]">10:45 AM, 26 Oct</span>
          </div>
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="mb-5 bg-[#eaf7ee] border border-[#a3e0ba] text-[#135d30] px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1b7e45]" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setBookingSuccessMsg(null)}
            className="text-xs underline hover:text-[#0b4221] cursor-pointer"
          >
            {isHi ? 'हटाएं' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Confirmed Active Slot Banner (Exact match to Screenshot 7 top green bordered card) */}
      {activeSlot && (
        <div className="bg-white rounded-2xl border border-[#cfe2d5] p-4 sm:p-5 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b7e45] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold bg-[#e3f7ec] text-[#147437] border border-[#a8e3c1] px-2 py-0.5 rounded-full">
                    {isHi ? 'सत्यापित स्लॉट (Confirmed Active Slot)' : 'Confirmed Active Slot'}
                  </span>
                  <span className="text-[10.5px] font-bold bg-[#edf7f1] text-[#147437] border border-[#a8e3c1] px-2 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1b7e45] animate-pulse"></span>
                    {isHi ? 'रियल-टाइम लाइव सिंक' : 'Live Real-Time Synced'}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#5a7969]">
                    {isHi ? `टोकन: ${activeSlot.tokenNumber}` : `Token: ${activeSlot.tokenNumber}`}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#113222] mt-1">
                  {activeSlot.date} • {activeSlot.timeSlot}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#4b6d5c] mt-1 flex-wrap">
                  <span>🏬 {activeSlot.mandiCenterName} ({activeSlot.gateNumber}, {activeSlot.laneNumber})</span>
                  <span>•</span>
                  <span>🌾 {activeSlot.cropName} • {activeSlot.quantityQuintal} क्विंटल</span>
                  <span>•</span>
                  <span>🚛 वाहन क्र. {activeSlot.vehicleNumber}</span>
                </div>
              </div>
            </div>

            {/* Actions for Confirmed Slot & Mandi Gate QR Display */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap sm:flex-nowrap">
              {/* Gate Entry QR Card */}
              <div 
                onClick={onOpenReceipt}
                className="bg-[#f2f8f4] border border-[#a8dbc0] rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-[#e6f4ec] transition-colors"
                title={isHi ? 'गेट पर दिखाने हेतु QR कोड' : 'Gate Entry QR'}
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-[#bfe2cc] flex items-center justify-center p-0.5 overflow-hidden shadow-2xs">
                  {gateQrUrl ? (
                    <img src={gateQrUrl} alt="QR" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-base font-bold">📱</span>
                  )}
                </div>
                <div className="text-left pr-1">
                  <span className="text-[10px] font-bold text-[#14532d] block uppercase tracking-wider">
                    {isHi ? 'गेट प्रवेश QR' : 'Gate Pass QR'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#1b4d3e]">
                    #{activeSlot.tokenNumber}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenReceipt}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#1b4d3e] hover:bg-[#143e31] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#88f0bc]" />
                <span>{isHi ? 'स्लॉट रसीद (PDF)' : 'Receipt (PDF)'}</span>
              </button>

              <button
                onClick={onOpenReschedule}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white hover:bg-[#f2f7f4] text-[#183928] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#cbdcd0] shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#246146]" />
                <span>{isHi ? 'री-शेड्यूल' : 'Reschedule'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Flow Progress (Exact match to Screenshot 7 stepper) */}
      <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#e0e9e2] -z-0"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#1b7e45] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-semibold text-[#183a29] mt-1.5 text-center">
              {isHi ? '१. मंडी व केंद्र चयन' : '1. Center Selection'}
            </span>
            <span className="text-[10.5px] text-[#1b7e45] font-medium text-center">
              {isHi ? 'सांवेर केंद्र चयनित' : 'Sanwer Centre Chosen'}
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#c96c21] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-4 ring-[#faeedf]">
              2
            </div>
            <span className="text-xs font-bold text-[#8f4a13] mt-1.5 text-center">
              {isHi ? '२. दिनांक एवं समय स्लॉट' : '2. Date & Time Slot'}
            </span>
            <span className="text-[10.5px] text-[#c96c21] font-semibold text-center">
              {isHi ? 'सक्रिय चयन चरण' : 'Active Selection'}
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#edf2ee] text-[#718b7c] flex items-center justify-center font-bold text-xs border border-[#cfdcd3]">
              3
            </div>
            <span className="text-xs font-medium text-[#718b7c] mt-1.5 text-center">
              {isHi ? '३. उपज विवरण व पुष्टि' : '3. Details & Confirm'}
            </span>
            <span className="text-[10.5px] text-[#93ab9e] text-center">
              {isHi ? 'अंतिम चरण' : 'Final Step'}
            </span>
          </div>
        </div>
      </div>


      {/* Date Selection Grid (Exact match to Screenshot 7 5 cards) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1a3828] flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#1b7e45]" />
            <span>{isHi ? 'दिनांक का चयन करें' : 'Select Date'}</span>
          </h3>
          <span className="text-[11px] text-[#618070]">
            {isHi ? 'आगामी 5 दिनों के लिए अग्रिम बुकिंग खुली है' : 'Advance booking open for next 5 days'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {dates.map((d) => {
            const isSelected = selectedDate === d.id;
            return (
              <div
                key={d.id}
                onClick={() => {
                  if (!d.isFull) handleSelectDate(d.id);
                }}
                className={`rounded-2xl p-3 sm:p-4 border transition-all relative flex flex-col justify-between ${
                  d.isFull
                    ? 'bg-[#fcfdfc] border-[#e8eee9] opacity-65 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#f4fcf6] border-2 border-[#1b7e45] shadow-xs cursor-pointer ring-2 ring-[#1b7e45]/15'
                    : 'bg-white border-[#d5e2d9] hover:border-[#96c9aa] cursor-pointer shadow-2xs'
                }`}
              >
                {d.recommendedBadge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1b7e45] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs whitespace-nowrap">
                    {d.recommendedBadge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-semibold text-[#516e60]">
                      {isHi ? d.titleHi : d.titleEn}
                    </span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${d.statusBadgeColor}`}>
                      {isHi ? d.statusHi : d.statusEn}
                    </span>
                  </div>

                  <div className="text-xl sm:text-2xl font-extrabold text-[#143425] my-0.5">
                    {d.dateStr}
                  </div>
                  <div className="text-[11px] text-[#637f71]">
                    {isHi ? d.dayHi : d.dayEn}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#edf4ef] text-[10.5px] font-semibold">
                  <span className={d.isFull ? 'text-[#b71c1c]' : 'text-[#1b7e45]'}>
                    {isHi ? d.subHi : d.subEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection (Exact match to Screenshot 7 4 slots) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1a3828] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1b7e45]" />
            <span>{isHi ? 'समय स्लॉट चुनें' : 'Select Time Slot'}</span>
          </h3>
          <span className="text-[11px] text-[#618070]">
            {isHi ? 'प्रति स्लॉट क्षमता: 25 वाहन' : 'Capacity: 25 Vehicles per slot'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {timeSlots.map((ts) => {
            const isSelected = selectedTimeSlot === ts.range;
            return (
              <div
                key={ts.id}
                onClick={() => handleSelectTime(ts.range)}
                className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#f4fcf6] border-2 border-[#1b7e45] shadow-xs ring-2 ring-[#1b7e45]/15'
                    : 'bg-white border-[#d5e2d9] hover:border-[#96c9aa] shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10.5px] font-bold bg-[#edf5f0] text-[#335d48] px-2 py-0.5 rounded-md">
                      {isHi ? ts.sessionHi : ts.sessionEn}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#1b7e45] bg-[#1b7e45]' : 'border-[#b5cdc0] bg-white'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="text-sm sm:text-base font-extrabold text-[#143425] mt-1">
                    {ts.range}
                  </div>
                  <div className="text-[10.5px] text-[#638072] mt-1">
                    {isHi ? ts.entryHi : ts.entryEn}
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#edf4ef] flex items-center justify-between text-[11px]">
                  <span className="text-[#597869]">{isHi ? ts.waitHi : ts.waitEn}</span>
                  <span className="font-bold text-[#1b7e45]">{isHi ? ts.vacantHi : ts.vacantEn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Booking Form Bar (Exact match to Screenshot 7 bottom inputs and button) */}
      <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {/* Crop details */}
          <div>
            <label className="text-[11px] font-semibold text-[#5c7a6b] block mb-1">
              {isHi ? 'उपज का नाम व किस्म' : 'Crop & Variety'}
            </label>
            <div className="bg-[#f9faf9] border border-[#d5e2d9] rounded-xl px-3 py-2 text-xs font-bold text-[#153a28] flex items-center gap-2">
              <span>🌾</span>
              <span>{cropType}</span>
            </div>
            <span className="text-[10px] text-[#1b7e45] font-semibold mt-1 block">
              {isHi ? 'समर्थन मूल्य: ₹2,400 / क्विंटल' : 'MSP Rate: ₹2,400 / Quintal'}
            </span>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-[11px] font-semibold text-[#5c7a6b] block mb-1">
              {isHi ? 'अनुमानित मात्रा (क्विंटल)' : 'Estimated Quantity (Quintal)'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="120"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-white border border-[#cadcd1] rounded-xl px-3 py-2 text-sm font-bold text-[#133726] focus:outline-none focus:ring-2 focus:ring-[#1b7e45]"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#638072] font-semibold pointer-events-none">
                {isHi ? 'क्विंटल' : 'Quintal'}
              </span>
            </div>
            <span className="text-[10px] text-[#6b8b7a] mt-1 block">
              {isHi ? 'पंजीकृत सीमा: अधिकतम 120 क्विंटल' : 'Registered Cap: Max 120 Q'}
            </span>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="text-[11px] font-semibold text-[#5c7a6b] block mb-1">
              {isHi ? 'ट्रैक्टर / वाहन क्रमांक' : 'Tractor / Vehicle Plate #'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                className="w-full bg-white border border-[#cadcd1] rounded-xl px-3 py-2 text-sm font-bold text-[#133726] uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#1b7e45]"
              />
              <Tractor className="w-4 h-4 text-[#638072] absolute right-3 top-2.5" />
            </div>
            <span className="text-[10px] text-[#1b7e45] font-semibold mt-1 block">
              {isHi ? 'ई-परमिट अधिकृत' : 'E-Permit Authorized'}
            </span>
          </div>

          {/* Primary Action Button (Screenshot 7) */}
          <div>
            <button
              onClick={handleBookSlot}
              disabled={isSubmitting}
              className="w-full bg-[#1b4d3e] hover:bg-[#153f33] disabled:bg-[#7b9c8d] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-[#88f0bc]" />
              <span>
                {isSubmitting
                  ? (isHi ? 'स्लॉट बुक हो रहा है...' : 'Booking Slot...')
                  : (isHi ? 'स्लॉट बुक करें एवं टोकन प्राप्त करें' : 'Book Slot & Get E-Token')}
              </span>
            </button>
            <span className="text-[9.5px] text-[#688577] text-center block mt-1">
              {isHi ? 'OTP सत्यापन युक्त आधार लिंक्ड मोबाइल पर प्रेषित होगा' : 'Sent via SMS to Aadhaar-linked mobile'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
