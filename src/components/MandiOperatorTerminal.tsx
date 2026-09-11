import React, { useState } from 'react';
import { 
  Calendar, 
  Truck, 
  CheckCircle2, 
  Camera, 
  QrCode, 
  Search, 
  RefreshCw, 
  Check, 
  Clock,
  ArrowRight,
  Scale,
  Building2,
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { Language, MandiSlot } from '../types';

interface MandiOperatorTerminalProps {
  lang: Language;
  activeSlot: MandiSlot | null;
  onOpenReceipt: () => void;
  onViewFarmerPortal?: () => void;
}

export const MandiOperatorTerminal: React.FC<MandiOperatorTerminalProps> = ({
  lang,
  activeSlot,
  onOpenReceipt,
}) => {
  const isHi = lang === 'hi';

  const [searchToken, setSearchToken] = useState<string>('#MP-2409');
  const [filterTab, setFilterTab] = useState<string>('all');
  const [gateApproved, setGateApproved] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');
  const [todaySlotsCount, setTodaySlotsCount] = useState<number>(120);
  const [yardQueueCount, setYardQueueCount] = useState<number>(14);

  const [queueItems, setQueueItems] = useState([
    {
      token: '#MP-2409',
      farmerName: 'राम सिंह (Ram Singh)',
      farmerId: 'MP-88210',
      vehicleNo: 'MP 09 GH 4412',
      crop: 'शरबती गेहूँ (45 Qt)',
      arrivalTime: '11:15 AM (27m)',
      stage: 'गुणवत्ता जाँच (Lab)',
      stageType: 'quality',
      actionType: 'call_scale',
      actionLabel: 'कांटा #02 पर बुलाएं',
      isFirst: true,
    },
    {
      token: '#MP-2410',
      farmerName: 'कमल किशोर मालवीय',
      farmerId: 'MP-88211',
      vehicleNo: 'MP 13 EA 8831',
      crop: 'चना (30 Qt)',
      arrivalTime: '11:22 AM (20m)',
      stage: 'गेट प्रतीक्षारत',
      stageType: 'gate_wait',
      actionType: 'gate_call',
      actionLabel: 'गेट कॉल',
    },
    {
      token: '#MP-2408',
      farmerName: 'दिनेश चंद्र पाटीदार',
      farmerId: 'MP-88199',
      vehicleNo: 'MP 09 BC 1102',
      crop: 'गेहूँ (52 Qt)',
      arrivalTime: '11:05 AM (37m)',
      stage: '✓ तौल कांटा #01',
      stageType: 'weighment',
      actionType: 'record_weight',
      actionLabel: 'वजन रिकॉर्ड',
    },
    {
      token: '#MP-2407',
      farmerName: 'भंवरलाल जाट',
      farmerId: 'MP-88185',
      vehicleNo: 'MP 09 DA 9011',
      crop: 'सरसों (22 Qt)',
      arrivalTime: '10:50 AM (52m)',
      stage: 'वेयरहाउस अनलोडिंग',
      stageType: 'unloading',
      actionType: 'slip_recommend',
      actionLabel: 'पर्ची संस्तुति',
    },
    {
      token: '#MP-2406',
      farmerName: 'सुरेश सिंह सोलंकी',
      farmerId: 'MP-88172',
      vehicleNo: 'MP 11 AA 5541',
      crop: 'गेहूँ (48 Qt)',
      arrivalTime: '10:35 AM (1h 7m)',
      stage: 'पावती जारी (Ready)',
      stageType: 'ready',
      actionType: 'completed',
      actionLabel: '✓ पूर्ण',
    },
  ]);

  const handleAction = (token: string, actionType: string) => {
    if (actionType === 'call_scale') {
      setActionSuccess(`टोकन ${token} को कांटा #02 पर सफलतापूर्वक आमंत्रित किया गया!`);
      setQueueItems((prev) =>
        prev.map((it) =>
          it.token === token
            ? { ...it, stage: '✓ तौल कांटा #02 (चालू)', stageType: 'weighment', actionType: 'record_weight', actionLabel: 'वजन रिकॉर्ड' }
            : it
        )
      );
    } else if (actionType === 'gate_call') {
      setActionSuccess(`टोकन ${token} (कमल किशोर) को मुख्य गेट पर बुलाया गया!`);
      setQueueItems((prev) =>
        prev.map((it) =>
          it.token === token
            ? { ...it, stage: 'गुणवत्ता जाँच', stageType: 'quality', actionType: 'call_scale', actionLabel: 'कांटा पर बुलाएं' }
            : it
        )
      );
    } else if (actionType === 'record_weight') {
      setActionSuccess(`टोकन ${token} का वजन (45.2 क्विंटल) सफलतापूर्वक दर्ज हुआ!`);
      setQueueItems((prev) =>
        prev.map((it) =>
          it.token === token
            ? { ...it, stage: 'वेयरहाउस अनलोडिंग', stageType: 'unloading', actionType: 'slip_recommend', actionLabel: 'पर्ची संस्तुति' }
            : it
        )
      );
    } else if (actionType === 'slip_recommend') {
      setActionSuccess(`टोकन ${token} की उपार्जन पावती संस्तुत की गई!`);
      setQueueItems((prev) =>
        prev.map((it) =>
          it.token === token
            ? { ...it, stage: 'पावती जारी (Ready)', stageType: 'ready', actionType: 'completed', actionLabel: '✓ पूर्ण' }
            : it
        )
      );
    }
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleGateEntry = () => {
    setGateApproved(true);
    setYardQueueCount((prev) => prev + 1);
    setActionSuccess('प्रवेश स्वीकृत! टोकन #MP-2409 (राम सिंह) यार्ड कतार में शामिल हुआ।');
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const filteredQueue = queueItems.filter((item) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'gate') return item.stageType === 'gate_wait';
    if (filterTab === 'quality') return item.stageType === 'quality';
    if (filterTab === 'scale') return item.stageType === 'weighment';
    if (filterTab === 'receipt') return item.stageType === 'ready' || item.stageType === 'unloading';
    return true;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Greeting & Center Info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1b7e45] animate-pulse"></span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#143224] tracking-tight">
            {isHi ? 'मंडी ऑपरेटर टर्मिनल (सांवेर उपार्जन केंद्र)' : 'Mandi Operator Terminal (Sanwer Centre)'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#cfe0d5] text-[#29563f] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#1b7e45]" />
            <span>24 अक्टूबर 2025</span>
          </div>
          <span className="text-[11px] font-bold bg-[#fffae6] text-[#854d0e] border border-amber-300 px-2.5 py-1 rounded-xl">
            गेट #02 लाइव
          </span>
        </div>
      </div>

      {/* Action Toast / Live Banner */}
      {actionSuccess && (
        <div className="bg-[#edf9f2] border border-[#a6e2bf] text-[#14532d] px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1b7e45]" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-[#14532d] hover:text-black font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* 3 Summary Stat Cards (Clean, calm, matching Farmer Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1: Total Slots */}
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#637d70] block">
              {isHi ? 'आज कुल स्लॉट बुक' : 'Today Total Booked Slots'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#143224] tracking-tight">
                {todaySlotsCount}
              </span>
              <span className="text-xs font-semibold text-[#3b6750]">
                {isHi ? 'पंजीकृत किसान' : 'Registered Farmers'}
              </span>
            </div>
            <p className="text-[11px] text-[#2c8352] mt-1 font-medium">
              {isHi ? '✓ सभी स्लॉट प्रमाणित' : 'All slots verified'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#eef7f1] text-[#1b7e45] flex items-center justify-center border border-[#d5e8dc]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: In-Yard Queued Vehicles */}
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#637d70] block">
              {isHi ? 'परिसर में सक्रिय वाहन' : 'Vehicles in Mandi Yard'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#854d0e] tracking-tight">
                42
              </span>
              <span className="text-xs font-semibold text-[#854d0e]">
                {isHi ? `(कतार: ${yardQueueCount})` : `(Queue: ${yardQueueCount})`}
              </span>
            </div>
            <p className="text-[11px] text-[#854d0e] mt-1 font-medium">
              {isHi ? 'मध्यम यातायात • सुचारू तौल' : 'Smooth movement'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#fffbeb] text-[#b45309] flex items-center justify-center border border-[#fef3c7]">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Quality Lab Pass */}
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#637d70] block">
              {isHi ? 'गुणवत्ता स्थिति (नमी परीक्षण)' : 'Quality Moisture Status'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#1b7e45] tracking-tight">
                36
              </span>
              <span className="text-xs font-semibold text-[#2c8352]">
                {isHi ? 'पास / 2 रीचेक' : 'Passed / 2 Recheck'}
              </span>
            </div>
            <p className="text-[11px] text-[#2c8352] mt-1 font-medium">
              {isHi ? 'औसत नमी: 11.2% (<12% FAQ)' : 'Avg Moisture 11.2%'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#eef7f1] text-[#1b7e45] flex items-center justify-center border border-[#d5e8dc]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Gate Entry & Barcode Scanner Panel */}
      <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#143224]">
              {isHi ? 'गेट प्रवेश एवं किसान सत्यापन (Gate Entry Scanner)' : 'Gate Entry & Farmer Verification'}
            </h3>
            <p className="text-xs text-[#597867] mt-0.5">
              {isHi ? 'मोबाइल SMS/पर्ची का QR कोड स्कैन करें या टोकन नंबर खोजें' : 'Scan QR code or search token to approve entry'}
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-[#eef7f1] text-[#1b7e45] px-2.5 py-1 rounded-lg border border-[#c4e3d1]">
            गेट लेन #01 चालू
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Scan Camera Box */}
          <div className="lg:col-span-4 border border-[#d2dfd6] rounded-xl p-4 bg-[#fbfdfb] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full border border-[#d2dfd6] bg-white flex items-center justify-center mb-2.5 text-[#1b4d3e] shadow-xs">
              <Camera className="w-6 h-6" />
            </div>
            <button
              onClick={() => {
                setActionSuccess('कैमरा स्कैनर सक्रिय: QR कोड सफलतापूर्वक स्कैन हुआ (#MP-2409)!');
                setSearchToken('#MP-2409');
                setTimeout(() => setActionSuccess(''), 3000);
              }}
              className="w-full py-2.5 px-3 bg-[#1b4d3e] hover:bg-[#143e31] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#88f0bc]" />
              <span>{isHi ? 'QR स्कैन करें (Scan QR)' : 'Scan Barcode / QR'}</span>
            </button>
            <p className="text-[10.5px] text-[#718b7c] mt-2">
              {isHi ? 'वाहन RFID टैग स्वतः स्कैन समर्थित' : 'RFID Sensor auto-detect enabled'}
            </p>
          </div>

          {/* Farmer Verification Box */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  placeholder="#MP-2409"
                  className="w-full border border-[#cfe0d5] rounded-xl pl-9 pr-3 py-2 text-xs font-bold font-mono text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7e45]"
                />
              </div>
              <button
                onClick={() => {
                  setActionSuccess('टोकन #MP-2409 सत्यापित हुआ: राम सिंह (सांवेर)');
                  setTimeout(() => setActionSuccess(''), 3000);
                }}
                className="px-4 py-2 bg-[#1b4d3e] hover:bg-[#153e32] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-[#88f0bc]" />
                <span>{isHi ? 'सत्यापित करें' : 'Verify'}</span>
              </button>
            </div>

            {/* Farmer Info preview */}
            <div className="border border-[#cfe0d5] rounded-xl p-3.5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#eef7f1] text-[#14532d] font-bold flex items-center justify-center text-sm border border-[#bce3cb]">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#143224]">राम सिंह (Ram Singh)</span>
                    <span className="text-[10px] font-bold bg-[#e3f7ec] text-[#147437] border border-[#a8e3c1] px-1.5 py-0.2 rounded">
                      e-KYC पास
                    </span>
                  </div>
                  <p className="text-xs text-[#527060] mt-0.5">
                    वाहन: <strong className="font-mono text-[#143224]">MP 09 GH 4412</strong> | शरबती गेहूँ (45 क्विंटल)
                  </p>
                </div>
              </div>

              <button
                onClick={handleGateEntry}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  gateApproved ? 'bg-[#14532d]' : 'bg-[#1b7e45] hover:bg-[#156337]'
                }`}
              >
                <span>🚢</span>
                <span>{gateApproved ? 'प्रवेश स्वीकृत ✓' : 'प्रवेश स्वीकृत (कतार +1)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Yard Queue Table */}
      <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#edf3ef] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#143224]">
              {isHi ? 'सक्रिय कतार प्रबंधन (Real-Time Mandi Yard Queue)' : 'Active Yard Queue'}
            </h3>
            <p className="text-xs text-[#597867] mt-0.5">
              {isHi ? 'परिसर के विभिन्न चरणों में वाहनों की स्थिति एवं तौल कांटा नियंत्रण' : 'Manage vehicles across testing, weighbridge, and slip generation'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#597867]">
            <span className="inline-flex items-center gap-1 text-[#2c8352]">
              <span className="w-2 h-2 rounded-full bg-[#1b7e45] animate-ping"></span>
              {isHi ? 'लाइव सिंक' : 'Live Sync'}
            </span>
            <button
              onClick={() => {
                setActionSuccess('कतार डेटा रिफ्रेश हुआ!');
                setTimeout(() => setActionSuccess(''), 2000);
              }}
              className="p-1 hover:bg-[#f0f5f2] rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#2c8352]" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[#1b4d3e] text-white shadow-xs'
                : 'bg-[#f0f5f2] text-[#3d5f4e] hover:bg-[#e4eee7]'
            }`}
          >
            {isHi ? 'सभी वाहन (42)' : 'All Vehicles (42)'}
          </button>
          <button
            onClick={() => setFilterTab('gate')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filterTab === 'gate'
                ? 'bg-[#1b4d3e] text-white shadow-xs'
                : 'bg-[#f0f5f2] text-[#3d5f4e] hover:bg-[#e4eee7]'
            }`}
          >
            {isHi ? 'गेट प्रतीक्षारत (14)' : 'Gate Wait (14)'}
          </button>
          <button
            onClick={() => setFilterTab('quality')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filterTab === 'quality'
                ? 'bg-[#b45309] text-white shadow-xs'
                : 'bg-[#fffbeb] text-[#b45309] border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isHi ? 'गुणवत्ता लैब (6)' : 'Quality Lab (6)'}
          </button>
          <button
            onClick={() => setFilterTab('scale')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filterTab === 'scale'
                ? 'bg-[#1b4d3e] text-white shadow-xs'
                : 'bg-[#f0f5f2] text-[#3d5f4e] hover:bg-[#e4eee7]'
            }`}
          >
            {isHi ? 'तौल कांटा (4)' : 'Weighbridge (4)'}
          </button>
          <button
            onClick={() => setFilterTab('receipt')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filterTab === 'receipt'
                ? 'bg-[#1b4d3e] text-white shadow-xs'
                : 'bg-[#f0f5f2] text-[#3d5f4e] hover:bg-[#e4eee7]'
            }`}
          >
            {isHi ? 'पावती / निकासी (18)' : 'Receipt Issued (18)'}
          </button>
        </div>

        {/* Clean Queue Table */}
        <div className="overflow-x-auto border border-[#d2dfd6] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8faf8] text-[#3d5f4e] font-bold border-b border-[#d2dfd6]">
              <tr>
                <th className="p-3">टोकन #</th>
                <th className="p-3">किसान नाम</th>
                <th className="p-3">वाहन सं.</th>
                <th className="p-3">फसल / मात्रा</th>
                <th className="p-3">आगमन समय</th>
                <th className="p-3">वर्तमान चरण</th>
                <th className="p-3 text-right">त्वरित कार्यवाही</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf3ef]">
              {filteredQueue.map((item) => (
                <tr
                  key={item.token}
                  className={`hover:bg-[#f4f9f5] transition-colors ${
                    item.isFirst ? 'bg-[#fcfefa] border-l-4 border-l-[#1b7e45]' : ''
                  }`}
                >
                  <td className="p-3 font-mono font-bold text-[#854d0e]">
                    {item.token}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#143224] block">{item.farmerName}</span>
                    <span className="text-[10px] text-[#638472] font-mono">ID: {item.farmerId}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-gray-800">
                    {item.vehicleNo}
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-[#f0f5f2] border border-[#d2dfd6] px-2 py-0.5 rounded text-[11px] font-semibold text-[#183525]">
                      {item.crop}
                    </span>
                  </td>
                  <td className="p-3 text-[#527060] font-medium">
                    {item.arrivalTime}
                  </td>
                  <td className="p-3">
                    {item.stageType === 'quality' && (
                      <span className="inline-flex items-center gap-1.5 bg-[#fffbeb] text-[#854d0e] font-bold px-2.5 py-1 rounded-full text-[11px] border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'gate_wait' && (
                      <span className="inline-block bg-[#f0f5f2] text-gray-600 font-medium px-2.5 py-1 rounded-full text-[11px]">
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'weighment' && (
                      <span className="inline-flex items-center gap-1 bg-[#eaf5ef] text-[#14532d] font-bold px-2.5 py-1 rounded-full text-[11px] border border-[#a8dec0]">
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'unloading' && (
                      <span className="inline-block bg-[#f0f5f2] text-gray-700 font-medium px-2.5 py-1 rounded-full text-[11px]">
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'ready' && (
                      <span className="inline-flex items-center gap-1 bg-[#eff6ff] text-[#1e40af] font-bold px-2.5 py-1 rounded-full text-[11px]">
                        {item.stage}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {item.actionType === 'call_scale' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-[#1b4d3e] hover:bg-[#143e31] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'gate_call' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-white border border-[#cfe0d5] hover:bg-[#f0f5f2] text-[#183525] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'record_weight' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-[#1b7e45] hover:bg-[#156337] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'slip_recommend' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-white border border-[#cfe0d5] hover:bg-[#f0f5f2] text-[#183525] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'completed' && (
                      <button
                        onClick={onOpenReceipt}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-emerald-700 font-bold border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>पावती पर्ची</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
