import React from 'react';
import { 
  Calendar, 
  Clock, 
  Banknote, 
  Tractor, 
  FileCheck2, 
  Radio, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import { Language, FarmerProfile, MandiSlot } from '../types';

interface FarmerDashboardProps {
  lang: Language;
  farmer: FarmerProfile | null;
  slot: MandiSlot | null;
  onNavigate: (tab: string) => void;
  onOpenDocuments: () => void;
  onOpenPayments: () => void;
  onOpenReschedule: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  lang,
  farmer,
  slot,
  onNavigate,
  onOpenDocuments,
  onOpenPayments,
  onOpenReschedule,
}) => {
  const isHi = lang === 'hi';

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl">
      {/* Top Greeting & Date (Matches Screenshot 6) */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1b7e45] animate-pulse"></span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#143224] tracking-tight">
            {isHi ? `नमस्ते, ${farmer?.nameHi || 'राम सिंह'} जी` : `Welcome, ${farmer?.nameEn || 'Ram Singh'}`}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#cfe0d5] text-[#29563f] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#1b7e45]" />
          <span>{isHi ? (slot?.date || '24 अक्टूबर 2025') : (slot?.date || '24 October 2025')}</span>
        </div>
      </div>


      {/* AI Pre-Check Quick Banner (innovation from prompt)
      <div className="mb-6 bg-gradient-to-r from-[#eef9f2] via-[#e8f6ed] to-[#edf7f1] border border-[#bce3cb] rounded-2xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b4d3e] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-[#88f0bc]" />
          </div> */}
          {/* <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#143828]">
                {isHi ? '🌾 AI फसल पूर्व-जांच (AI Crop Pre-Check + मौसम चेतावनी)' : '🌾 AI Crop Pre-Check + Weather Alert'}
              </h4>
              <span className="text-[10px] font-bold bg-[#1b7e45] text-white px-1.5 py-0.2 rounded">
                NEW
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#3b6750]">
              {isHi
                ? 'मंडी प्रस्थान पूर्व उपज की फोटो लेकर नमी व गुणवत्ता जांचें ताकि व्यर्थ यात्रा न हो।'
                : 'Check moisture & quality before travelling to mandi to avoid unnecessary trips.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('crop_check')}
          className="bg-[#1b4d3e] hover:bg-[#153f33] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isHi ? 'फसल की फोटो जांचें' : 'Test Grain Quality'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#88f0bc]" />
        </button>
      </div> */}

      {/* Section 1: चयनित: आज का स्लॉट एवं समय विवरण (Exact match to Screenshot 6) */}
      {/* <div className="mb-8"> */}
        <div className="pt-3 md:pt-0 md:pl-6 flex flex-col justify-center">

        <h3 className="text-sm font-bold text-[#1a3828] mb-3">
          {isHi ? 'चयनित: आज का स्लॉट एवं समय विवरण' : 'Selected: Today Slot & Time Details'}
        </h3>

        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#e6ede7]">
            {/* Column 1: Allocated Time */}
            <div className="flex flex-col justify-center">
              <span className="text-[11px] text-[#637d70] font-medium">
                {isHi ? 'आवंटित समय' : 'Allocated Time'}
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#113222] mt-0.5">
                {slot?.timeSlot || '11:00 AM – 12:30 PM'}
              </div>
              <p className="text-[11px] text-[#2c8352] font-medium mt-1 flex items-center gap-1">
                <span>{isHi ? '15 मिनट पूर्व पहुंचना सुनिश्चित करें' : 'Ensure arrival 15 min prior'}</span>
              </p>
            </div>

            {/* Column 2: Procurement Center & Gate */}
            <div className="pt-3 md:pt-0 md:pl-6 flex flex-col justify-center">
              <span className="text-[11px] text-[#637d70] font-medium">
                {isHi ? 'उपार्जन केंद्र व गेट' : 'Procurement Centre & Gate'}
              </span>
              <div className="text-base sm:text-lg font-bold text-[#143525] mt-0.5">
                {slot?.mandiCenterName || 'सांवेर उपार्जन केंद्र'}
              </div>
              <p className="text-[11px] text-[#4f6e5e] font-medium mt-0.5">
                {slot?.gateNumber || 'गेट क्र. 02'} ({slot?.laneNumber || 'ट्रॉली लेन'})
              </p>
            </div>

            {/* Column 3: Token ID */}
            <div className="pt-3 md:pt-0 md:pl-6 flex flex-col justify-center">
              <span className="text-[11px] text-[#637d70] font-medium">
                {isHi ? 'टोकन पहचान' : 'Token Identification'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold bg-[#e3f7ec] text-[#147437] border border-[#a8e3c1] px-1.5 py-0.5 rounded">
                  {isHi ? 'सत्यापित' : 'Verified'}
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-[#113222]">
                  {slot?.tokenNumber ? `MP-SVR-2025-${slot.tokenNumber.replace('MP-', '')}` : 'MP-SVR-2025-88210'}
                </span>
              </div>
              <button
                onClick={() => onNavigate('live_queue')}
                className="text-[11px] text-[#1b7e45] hover:underline font-semibold mt-1 flex items-center gap-1 cursor-pointer"
              >
                <span>{isHi ? 'लाइव कतार में अपनी स्थिति देखें' : 'View live queue position'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: उपार्जन सेवाएं व विवरण (Exact match to Screenshot 6 grid) */}
      <div>
        <h3 className="text-sm font-bold text-[#1a3828] mb-3">
          {isHi ? 'उपार्जन सेवाएं व विवरण' : 'Procurement Services & Details'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 1: आज का स्लॉट एवं समय */}
          <div 
            onClick={() => onNavigate('slot_booking')}
            className="bg-white rounded-xl p-4  border-[#d5e2d9] hover:border-[#1b7e45] shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#eaf4ee] text-[#1b4d3e] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#1b7e45]" />
              </div>
              <span className="text-[10px] font-bold bg-[#e3f7ec] text-[#147437] border border-[#a8e3c1] px-2 py-0.5 rounded-full">
                {isHi ? 'सक्रिय' : 'Active'}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#183626] block">
                {isHi ? '१. आज का स्लॉट एवं समय' : '1. Today Slot & Time'}
              </span>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#edf3ee]">
                <span className="text-xs font-bold text-[#183626]">
                  {slot?.timeSlot || '11:00 AM – 12:30 PM'}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#1b7e45]" />
              </div>
            </div>
          </div>

          {/* Card 2: मूल्य एवं अनुमानित भुगतान */}
          <div 
            onClick={onOpenPayments}
            className="bg-white rounded-xl p-4 border border-[#d5e2d9] hover:border-[#1b7e45] shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#eef7f1] text-[#1b4d3e] flex items-center justify-center">
                <Banknote className="w-5 h-5 text-[#1b7e45]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#7b9887] group-hover:text-[#1b7e45] transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#183626] block">
                {isHi ? '२. मूल्य एवं अनुमानित भुगतान' : '2. MSP Rate & Estimated Value'}
              </span>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#edf3ee]">
                <span className="text-xs text-[#597566] font-medium">₹2,400 / क्विंटल</span>
                <span className="text-xs font-bold text-[#113524]">₹1,08,000</span>
              </div>
            </div>
          </div>

          {/* Card 3: फसल एवं वाहन विवरण */}
          <div 
            onClick={() => onNavigate('slot_booking')}
            className="bg-white rounded-xl p-4 border border-[#d5e2d9] hover:border-[#1b7e45] shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#eef7f1] text-[#1b4d3e] flex items-center justify-center">
                <Tractor className="w-5 h-5 text-[#1b7e45]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#7b9887] group-hover:text-[#1b7e45] transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#183626] block">
                {isHi ? '३. फसल एवं वाहन विवरण' : '3. Crop & Vehicle Details'}
              </span>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#edf3ee]">
                <span className="text-xs font-bold text-[#183626]">
                  {slot?.cropName || 'शरबती गेहूँ'} (45 क्विंटल)
                </span>
                <span className="text-xs font-mono text-[#526f60]">
                  {slot?.vehicleNumber || 'MP 09 GH 4412'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: दस्तावेज व चेकलिस्ट */}
          <div 
            onClick={onOpenDocuments}
            className="bg-white rounded-xl p-4 border border-[#d5e2d9] hover:border-[#1b7e45] shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#eef7f1] text-[#1b4d3e] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5 text-[#1b7e45]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#7b9887] group-hover:text-[#1b7e45] transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#183626] block">
                {isHi ? '४. दस्तावेज व चेकलिस्ट' : '4. Documents & Checklist'}
              </span>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#edf3ee]">
                <span className="text-xs font-bold text-[#1b7e45]">4/4 पूर्ण (सत्यापित)</span>
                <span className="text-xs text-[#526f60]">आधार व RC</span>
              </div>
            </div>
          </div>

          {/* Card 5: नजदीकी मंडी लाइव */}
          <div 
            onClick={() => onNavigate('live_queue')}
            className="bg-white rounded-xl p-4 border border-[#d5e2d9] hover:border-[#1b7e45] shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#eef7f1] text-[#1b4d3e] flex items-center justify-center">
                <Radio className="w-5 h-5 text-[#1b7e45]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#7b9887] group-hover:text-[#1b7e45] transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#183626] block">
                {isHi ? '५. नजदीकी मंडी लाइव' : '5. Nearest Mandi Live'}
              </span>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#edf3ee]">
                <span className="text-xs font-bold text-[#183626]">
                  {isHi ? '14 वाहन कतार में' : '14 vehicles in queue'}
                </span>
                <span className="text-[10px] font-bold text-[#1b7e45] bg-[#e3f7ec] px-1.5 py-0.5 rounded">
                  {isHi ? 'सुचारू' : 'Smooth'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 6: त्वरित सहायता / री-शेड्यूल */}
          <div 
            onClick={onOpenReschedule}
            className="bg-linear-to-br from-[#fbfdfb] to-[#f2f7f3] rounded-xl p-4 border border-[#d2ded5] hover:border-[#1b7e45] shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#e3efe6] text-[#1b4d3e] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#1b4d3e]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#7b9887] group-hover:text-[#1b7e45] transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#183626] block">
                {isHi ? '६. स्मार्ट री-शेड्यूल इंजन' : '6. Smart Auto-Rescheduling'}
              </span>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e2ece5]">
                <span className="text-xs text-[#486b59]">
                  {isHi ? 'मौसम या स्लॉट परिवर्तन' : 'Weather or slot change'}
                </span>
                <span className="text-xs font-semibold text-[#1b7e45]">
                  {isHi ? 'विकल्प देखें' : 'Options'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
