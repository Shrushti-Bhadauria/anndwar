import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Hourglass, 
  QrCode, 
  Megaphone, 
  Check, 
  Microscope, 
  Scale, 
  FileText, 
  CreditCard, 
  CheckCircle,
  Building2,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Language, MandiSlot, ProcurementStage } from '../types';

interface LiveQueueTrackerProps {
  lang: Language;
  activeSlot: MandiSlot | null;
  onNavigateToMandiTerminal: () => void;
  onOpenReceipt: () => void;
}

export const LiveQueueTracker: React.FC<LiveQueueTrackerProps> = ({
  lang,
  activeSlot,
  onNavigateToMandiTerminal,
  onOpenReceipt,
}) => {
  const isHi = lang === 'hi';

  const [stages, setStages] = useState<ProcurementStage[]>([]);
  const [queueData, setQueueData] = useState({
    tokenNumber: activeSlot?.tokenNumber || 'MP-2409',
    vehicleNumber: activeSlot?.vehicleNumber || 'MP-09-GE-4102',
    cropName: activeSlot?.cropName || 'गेहूं (Sharbati)',
    queueOrder: 14,
    totalVehicles: 42,
    waitMinutes: 38,
    rateMin: 2.7,
    yardLoadPercent: 64,
    yardLoadLevelHi: 'मध्यम भार',
    yardLoadLevelEn: 'Moderate Congestion',
    activeScales: 4,
    directiveHi: 'कृपया अपना वाहन वे-ब्रिज लेन #02 की ओर ले जाएं। आपका टोकन #MP-2409 गेट पर सफलतापूर्वक सत्यापित हो चुका है एवं नमी परीक्षण दल आपके वाहन की प्रतीक्षा कर रहा है।',
    directiveEn: 'Please proceed with your vehicle towards Weigh-Bridge Lane #02. Token #MP-2409 has been verified at the main gate and the moisture testing unit awaits your sample.'
  });

  const fetchStages = async () => {
    try {
      const res = await fetch('/api/stages');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStages(data);
      }
    } catch (err) {
      console.error('Failed to fetch stages:', err);
    }
  };

  useEffect(() => {
    fetchStages();
    // Periodic refresh
    const interval = setInterval(fetchStages, 10000);
    return () => clearInterval(interval);
  }, []);

  const advanceStageSimulation = async (targetStep: number) => {
    try {
      const res = await fetch('/api/queue/advance-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber: targetStep, moistureVal: 11.4, grossWeight: 45.2 })
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStages(data);
      }
      if (targetStep > 4) {
        setQueueData(prev => ({
          ...prev,
          queueOrder: Math.max(1, prev.queueOrder - 4),
          waitMinutes: Math.max(5, prev.waitMinutes - 12)
        }));
      }
    } catch (err) {
      console.error('Error advancing stage:', err);
    }
  };

  const activeStage = stages.find(s => s.status === 'in_progress') || stages[3];

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl">
      {/* Top Header & Token Card (Exact match to Screenshot 5) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#143425] tracking-tight">
            {isHi ? 'लाइव कतार एवं टोकन ट्रैकर' : 'Live Queue & Token Tracker'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4f705f] mt-1 max-w-2xl leading-relaxed">
            {isHi
              ? 'इंदौर कृषि उपज मंडी यार्ड परिसर - गेहूं उपार्जन सत्र 2025-26। आपका वाहन भौतिक सत्यापन उपरांत यार्ड में प्रवेश कर चुका है।'
              : 'Indore Mandi Yard Premise - Wheat Procurement Season 2025-26. Your vehicle has entered the yard post physical security validation.'}
          </p>
        </div>

        {/* Top Right Token Badge (Exact match to Screenshot 5) */}
        <div className="bg-white border-2 border-[#1b4d3e]/30 rounded-2xl p-3 sm:px-4 sm:py-3 shadow-xs flex items-center gap-3 shrink-0">
          <div className="w-14 h-14 bg-[#f2f8f4] border border-[#bcdcc9] rounded-xl flex items-center justify-center p-1 relative">
            <QrCode className="w-11 h-11 text-[#1b4d3e]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-2.5 h-2.5 bg-[#1b4d3e] rounded-xs opacity-70"></span>
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black font-mono text-[#103222] tracking-wide">
              #{activeSlot?.tokenNumber || queueData.tokenNumber}
            </div>
            <div className="text-[11px] text-[#4d6d5d] font-semibold mt-0.5">
              <span>{isHi ? 'वाहन: ' : 'Vehicle: '}</span>
              <span className="font-mono text-[#183a29]">{activeSlot?.vehicleNumber || queueData.vehicleNumber}</span>
            </div>
            <div className="text-[11px] text-[#4d6d5d] font-semibold">
              <span>{isHi ? 'फसल: ' : 'Crop: '}</span>
              <span className="text-[#1b7e45]">{activeSlot?.cropName || queueData.cropName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Yard Marshal Directive Alert Banner (Exact match to Screenshot 5 brown megaphone banner) */}
      <div className="bg-[#fef9f2] border border-[#f5d6a8] rounded-2xl p-4 sm:p-4.5 mb-6 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c96c21] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-[#8c4815] flex items-center gap-1.5">
                <span>{isHi ? 'यार्ड मार्शल निर्देश (Direct Yard Directive)' : 'Yard Marshal Directive'}</span>
              </span>
              <span className="text-[10px] font-extrabold bg-[#faeedd] text-[#b85b14] border border-[#ebcb9c] px-2 py-0.5 rounded-md uppercase tracking-wider">
                {isHi ? 'तत्काल अनुपालन' : 'Immediate Compliance'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5d3615] font-medium mt-1 leading-relaxed">
              {isHi ? (
                <>
                  कृपया अपना वाहन <span className="font-bold border border-[#b85b14] px-1.5 py-0.2 rounded bg-white text-[#914207]">वे-ब्रिज लेन #02</span> की ओर ले जाएं। आपका टोकन <span className="font-bold text-[#914207]">#{activeSlot?.tokenNumber || queueData.tokenNumber}</span> गेट पर सफलतापूर्वक सत्यापित हो चुका है एवं नमी परीक्षण दल आपके वाहन की प्रतीक्षा कर रहा है।
                </>
              ) : (
                queueData.directiveEn
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Metric Stats Cards (Exact match to Screenshot 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Stat 1: कतार क्रम (Queue Order) */}
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5a7767]">
              {isHi ? 'कतार क्रम (Queue Order)' : 'Queue Order'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#e8f5e9] text-[#1b7e45] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#113222]">
                {queueData.queueOrder}
              </span>
              <span className="text-sm font-bold text-[#355f4a]">
                {isHi ? 'किसान आगे' : 'Farmers Ahead'}
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#edf3ee] text-[11px] text-[#617e6e] flex items-center gap-1.5">
              <span>🚚</span>
              <span>
                {isHi
                  ? `कुल ${queueData.totalVehicles} वाहन वर्तमान में मंडी परिसर में`
                  : `Total ${queueData.totalVehicles} vehicles in yard`}
              </span>
            </div>
          </div>
        </div>

        {/* Stat 2: अनुमानित प्रतीक्षा समय */}
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5a7767]">
              {isHi ? 'अनुमानित प्रतीक्षा समय' : 'Estimated Waiting Time'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#fff3e0] text-[#e65100] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#c96c21]">
                {queueData.waitMinutes}
              </span>
              <span className="text-sm font-bold text-[#8c4915]">
                {isHi ? 'मिनट शेष' : 'Minutes Left'}
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#edf3ee] text-[11px] text-[#617e6e] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c96c21]" />
              <span>
                {isHi
                  ? `औसत प्रक्रमण दर: ${queueData.rateMin} मिनट / ट्रॉली`
                  : `Avg clearance: ${queueData.rateMin} min / trolley`}
              </span>
            </div>
          </div>
        </div>

        {/* Stat 3: वे-ब्रिज व यार्ड भार */}
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5a7767]">
              {isHi ? 'वे-ब्रिज व यार्ड भार' : 'Weigh-Bridge & Yard Load'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#e8f5e9] text-[#1b7e45] flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1b7e45]">
                {queueData.yardLoadPercent}%
              </span>
              <span className="text-sm font-bold text-[#1b7e45]">
                {isHi ? queueData.yardLoadLevelHi : queueData.yardLoadLevelEn}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#e8eee9] h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#1b7e45] h-full rounded-full transition-all duration-500"
                style={{ width: `${queueData.yardLoadPercent}%` }}
              ></div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#edf3ee] text-[11px] text-[#617e6e]">
              {isHi
                ? `सभी ${queueData.activeScales} इलेक्ट्रॉनिक वे-स्केल सुचारू कार्यरत`
                : `All ${queueData.activeScales} electronic weigh-scales operational`}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Stage Procurement Lifecycle Tracker (Exact match to Screenshot 4 & 3) */}
      <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-6 shadow-xs mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#133726] flex items-center gap-2">
              <span>〰️</span>
              <span>
                {isHi
                  ? '7-चरणीय पारदर्शी उपार्जन प्रगति (Procurement Lifecycle Tracker)'
                  : '7-Stage Transparent Procurement Lifecycle Tracker'}
              </span>
            </h3>
            <p className="text-[11px] text-[#557666]">
              {isHi
                ? 'गेट आमद से लेकर DBT बैंक खाते में राशि ट्रांसफर तक की लाइव स्थिति'
                : 'Live status from gate arrival to DBT bank transfer'}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#147437] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1b7e45]"></span>
              <span>{isHi ? 'सम्पन्न (Completed)' : 'Completed'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#b35912] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c96c21]"></span>
              <span>{isHi ? 'प्रक्रियाधीन (In-Progress)' : 'In-Progress'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#7f998c] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cbd9d1]"></span>
              <span>{isHi ? 'प्रतीक्षारत (Upcoming)' : 'Upcoming'}</span>
            </span>
          </div>
        </div>

        {/* Horizontal Card Row (Matching Screenshot 4 and 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {stages.map((st) => {
            const isCompleted = st.status === 'completed';
            const isInProgress = st.status === 'in_progress';
            const isUpcoming = st.status === 'upcoming';

            return (
              <div
                key={st.id}
                className={`rounded-xl p-3 border transition-all relative flex flex-col justify-between ${
                  isInProgress
                    ? 'bg-[#fef9f2] border-2 border-[#c96c21] shadow-xs'
                    : isCompleted
                    ? 'bg-[#f8fbf9] border-[#c5ddd0]'
                    : 'bg-[#fafbfa] border-[#e2eae4] opacity-75'
                }`}
              >
                {isInProgress && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#8c4815] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs whitespace-nowrap">
                    {isHi ? 'वर्तमान चरण' : 'Current Step'}
                  </div>
                )}

                <div>
                  {/* Step icon circle */}
                  <div className="flex justify-center mb-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ${
                        isCompleted
                          ? 'bg-[#1b7e45] text-white'
                          : isInProgress
                          ? 'bg-[#c96c21] text-white ring-2 ring-[#faeedf]'
                          : 'bg-[#edf3ef] text-[#7b9888] border border-[#d2ded6]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isInProgress ? (
                        st.step === 4 ? <Microscope className="w-4 h-4" /> : st.step
                      ) : (
                        st.step
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-[#143626] text-center leading-snug">
                    {st.step}. {isHi ? st.titleHi : st.titleEn}
                  </div>
                  <div className="text-[10px] text-[#557666] text-center mt-0.5">
                    {st.details}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#e8f0ea] text-center">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block ${
                      isCompleted
                        ? 'bg-[#e2f7eb] text-[#137333]'
                        : isInProgress
                        ? 'bg-[#faeedd] text-[#b85b14]'
                        : 'bg-[#f1f5f2] text-[#7a9687]'
                    }`}
                  >
                    {isHi ? st.subHi : st.subEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Simulation Controls for User / Demo */}
        <div className="mt-6 pt-4 border-t border-[#e8efe9] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-[#4e705f]">
            <span className="font-semibold text-[#183a29]">
              {isHi ? 'मंडी यार्ड ऑपरेटर नियंत्रण: ' : 'Mandi Yard Operator Control: '}
            </span>
            <span>
              {isHi
                ? 'लाइव परीक्षण हेतु चरण आगे बढ़ाएं'
                : 'Simulate workflow progression through the 7 stages'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => advanceStageSimulation(4)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#faeedd] text-[#914207] hover:bg-[#f5e2ca] border border-[#ebd0ad] cursor-pointer"
            >
              {isHi ? 'चरण 4: गुणवत्ता जांच' : 'Step 4: Quality'}
            </button>
            <button
              onClick={() => advanceStageSimulation(5)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#eef6f0] text-[#1b7e45] hover:bg-[#e0f0e4] border border-[#c3decb] cursor-pointer"
            >
              {isHi ? 'चरण 5: तौल कांटा #02' : 'Step 5: Weighment'}
            </button>
            <button
              onClick={() => advanceStageSimulation(6)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#eef6f0] text-[#1b7e45] hover:bg-[#e0f0e4] border border-[#c3decb] cursor-pointer"
            >
              {isHi ? 'चरण 6: ई-पावती' : 'Step 6: Digital MSP Slip'}
            </button>
            <button
              onClick={() => advanceStageSimulation(7)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#eef6f0] text-[#1b7e45] hover:bg-[#e0f0e4] border border-[#c3decb] cursor-pointer"
            >
              {isHi ? 'चरण 7: DBT भुगतान' : 'Step 7: DBT Transfer'}
            </button>
            <button
              onClick={onNavigateToMandiTerminal}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1b4d3e] text-white hover:bg-[#153f33] shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>{isHi ? 'ऑपरेटर टर्मिनल खोलें' : 'Open Operator Terminal'}</span>
              <ExternalLink className="w-3 h-3 text-[#88f0bc]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
