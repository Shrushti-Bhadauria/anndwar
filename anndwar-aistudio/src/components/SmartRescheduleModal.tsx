import React, { useState } from 'react';
import { X, Calendar, RefreshCw, Sparkles, CheckCircle2, Clock, CloudSun, ArrowRight } from 'lucide-react';
import { Language, MandiSlot } from '../types';

interface SmartRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentSlot: MandiSlot | null;
  onRescheduleSuccess: (updatedSlot: MandiSlot) => void;
}

export const SmartRescheduleModal: React.FC<SmartRescheduleModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentSlot,
  onRescheduleSuccess,
}) => {
  if (!isOpen) return null;
  const isHi = lang === 'hi';

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(1);

  const options = [
    {
      id: 1,
      isBest: true,
      date: '27 अक्टूबर 2025',
      dateEn: '27 October 2025',
      timeSlot: '09:00 AM – 10:30 AM',
      mandi: 'सांवेर उपार्जन केंद्र',
      mandiEn: 'Sanwer Procurement Centre',
      weather: 'खिली धूप (0% वर्षा संभावना)',
      weatherEn: 'Clear Sunny (0% Rain Risk)',
      wait: 'मात्र 15 मिनट',
      waitEn: 'Only 15 min wait',
      vacant: '42 रिक्त स्थान',
      vacantEn: '42 vacant slots',
    },
    {
      id: 2,
      isBest: false,
      date: '28 अक्टूबर 2025',
      dateEn: '28 October 2025',
      timeSlot: '11:00 AM – 12:30 PM',
      mandi: 'सांवेर उपार्जन केंद्र',
      mandiEn: 'Sanwer Procurement Centre',
      weather: 'साफ मौसम',
      weatherEn: 'Clear Weather',
      wait: '~20 मिनट',
      waitEn: '~20 min wait',
      vacant: '85 रिक्त स्थान',
      vacantEn: '85 vacant slots',
    },
    {
      id: 3,
      isBest: false,
      date: '27 अक्टूबर 2025',
      dateEn: '27 October 2025',
      timeSlot: '02:00 PM – 03:30 PM',
      mandi: 'धार नाका उपार्जन केंद्र (नजदीकी केंद्र)',
      mandiEn: 'Dhar Naka Centre (Nearby alternate)',
      weather: 'धूप खिली रहेगी',
      weatherEn: 'Sunny Day',
      wait: '~10 मिनट (तत्काल खाली)',
      waitEn: '~10 min wait',
      vacant: '19 रिक्त स्थान',
      vacantEn: '19 vacant slots',
    },
  ];

  const handleConfirmReschedule = async () => {
    setIsProcessing(true);
    const chosen = options.find((o) => o.id === selectedOption) || options[0];
    try {
      const res = await fetch('/api/slots/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newDate: chosen.date,
          newTimeSlot: chosen.timeSlot,
          newMandi: chosen.mandi,
        }),
      });
      const data = await res.json();
      if (data.success && data.slot) {
        onRescheduleSuccess(data.slot);
        onClose();
      }
    } catch (err) {
      console.error('Failed to reschedule:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#cbdcd0] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#88f0bc]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {isHi ? 'स्मार्ट री-शेड्यूलिंग एवं रिक्त स्लॉट' : 'Smart Rescheduling & Vacancy Engine'}
                </h3>
                <span className="text-[10px] font-bold bg-[#296b54] text-[#d4f6e3] px-2 py-0.5 rounded">
                  AI Auto-Suggest
                </span>
              </div>
              <p className="text-xs text-[#b7ded0]">
                {isHi
                  ? 'मौसम, यार्ड में कतार व रिक्तियों के आधार पर सर्वश्रेष्ठ वैकल्पिक स्लॉट'
                  : 'Automatically suggest best alternative slots based on weather and queue congestion'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Slot Reference */}
        <div className="p-4 bg-[#f4f8f5] border-b border-[#dbe6df] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10.5px] text-[#557766] block font-medium">
              {isHi ? 'वर्तमान में बुक स्लॉट:' : 'Currently Booked Slot:'}
            </span>
            <span className="font-bold text-[#143525]">
              {currentSlot?.date} • {currentSlot?.timeSlot}
            </span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#1b7e45] bg-[#e3f7ec] px-2 py-0.5 rounded border border-[#a8e3c1]">
            टोकन: {currentSlot?.tokenNumber}
          </span>
        </div>

        {/* Recommended Slots List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <label className="text-xs font-bold text-[#153b28] block">
            {isHi ? 'सुझाये गए अनुकूल विकल्प (चयन करें):' : 'Suggested Alternate Slots (Select one):'}
          </label>

          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`rounded-xl p-3.5 border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#f4fcf6] border-2 border-[#1b7e45] shadow-xs ring-2 ring-[#1b7e45]/15'
                    : 'bg-white border-[#d5e2d9] hover:border-[#a0cbaf]'
                }`}
              >
                {opt.isBest && (
                  <span className="absolute -top-2.5 right-3 bg-[#1b7e45] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                    {isHi ? '⭐ सर्वाधिक अनुशंसित (न्यूनतम प्रतीक्षा)' : '⭐ Best Match'}
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                      isSelected ? 'border-[#1b7e45] bg-[#1b7e45]' : 'border-[#b6cec1]'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    <div>
                      <div className="font-bold text-sm text-[#143425]">
                        {isHi ? opt.date : opt.dateEn} • {opt.timeSlot}
                      </div>
                      <div className="text-xs text-[#4f6f5f] mt-0.5">
                        {isHi ? opt.mandi : opt.mandiEn}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-[#b35912]">
                          <CloudSun className="w-3.5 h-3.5" />
                          <span>{isHi ? opt.weather : opt.weatherEn}</span>
                        </span>
                        <span>•</span>
                        <span className="text-[#1b7e45] font-semibold">
                          {isHi ? opt.wait : opt.waitEn}
                        </span>
                        <span>•</span>
                        <span className="text-[#557766]">
                          {isHi ? opt.vacant : opt.vacantEn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8faf8] border-t border-[#e3ece6] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-[#527764] hover:underline font-semibold cursor-pointer"
          >
            {isHi ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            onClick={handleConfirmReschedule}
            disabled={isProcessing}
            className="bg-[#1b4d3e] hover:bg-[#153f33] disabled:bg-[#7b9c8d] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#88f0bc]" />
            <span>
              {isProcessing
                ? (isHi ? 'पुष्टि हो रही है...' : 'Updating...')
                : (isHi ? 'स्लॉट बदलें (Confirm Reschedule)' : 'Confirm Reschedule')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
