import React, { useState } from 'react';
import { 
  Calendar, 
  Truck, 
  CheckCircle2, 
  Camera, 
  QrCode, 
  Search, 
  RefreshCw, 
  Ship, 
  Check, 
  Clock,
  ArrowRight,
  Microscope,
  Scale,
  Building2
} from 'lucide-react';
import { Language, MandiSlot } from '../types';

interface MandiOperatorTerminalProps {
  lang: Language;
  activeSlot: MandiSlot | null;
  onOpenReceipt: () => void;
  onViewFarmerPortal: () => void;
}

export const MandiOperatorTerminal: React.FC<MandiOperatorTerminalProps> = ({
  lang,
  activeSlot,
  onOpenReceipt,
  onViewFarmerPortal,
}) => {
  const isHi = lang === 'hi';

  const [searchToken, setSearchToken] = useState<string>('#MP-2409');
  const [filterTab, setFilterTab] = useState<string>('all');
  const [gateApproved, setGateApproved] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const [queueItems, setQueueItems] = useState([
    {
      token: '#MP-2409',
      farmerName: 'राम सिंह',
      farmerId: 'MP-88210',
      vehicleNo: 'MP 09 GH 4412',
      crop: 'गेहूँ (45 Qt)',
      arrivalTime: '11:15 AM (27m)',
      stage: 'गुणवत्ता जाँच',
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
      actionLabel: '✓',
    },
  ]);

  const handleAction = (token: string, actionType: string) => {
    if (actionType === 'call_scale') {
      setActionSuccess(`टोकन ${token} को कांटा #02 पर सफलतापूर्वक आमंत्रित किया गया!`);
    } else if (actionType === 'gate_call') {
      setActionSuccess(`टोकन ${token} (कमल किशोर) को मुख्य गेट पर बुलाया गया!`);
    } else if (actionType === 'record_weight') {
      setActionSuccess(`टोकन ${token} का धर्मकांटा वजन रिकॉर्ड स्क्रीन सक्रिय!`);
    } else if (actionType === 'slip_recommend') {
      setActionSuccess(`टोकन ${token} की उपार्जन पावती संस्तुत की गई!`);
    }
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleGateEntry = () => {
    setGateApproved(true);
    setActionSuccess('प्रवेश स्वीकृत! टोकन #MP-2409 (राम सिंह) यार्ड कतार में शामिल हुआ।');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl space-y-6">
      {/* Top Portal Banner */}
      <div className="bg-gradient-to-r from-[#1b4d3e] to-[#256653] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#143e31] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isHi ? 'मंडी ऑपरेटर टर्मिनल (गेट व तौल नियंत्रण)' : 'Mandi Operator Terminal (Gate & Scale Control)'}
              </h2>
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                LIVE GATE #02
              </span>
            </div>
            <p className="text-xs text-[#b8e5d3] mt-0.5">
              {isHi ? 'सांवेर उपार्जन केंद्र • टोकन प्रवेश, धर्मकांटा वजन रिकॉर्ड व ई-पावती संस्तुति' : 'Sanwer Centre • Gate Entry, Scale Weighment & e-Pauti Issuance'}
            </p>
          </div>
        </div>

        <button
          onClick={onViewFarmerPortal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#1b4d3e] border border-white/30 text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <span>← {isHi ? 'किसान पोर्टल पर लौटें' : 'Back to Farmer Portal'}</span>
        </button>
      </div>

      {/* Action toast */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span>✅ {actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-700 hover:text-black">✕</button>
        </div>
      )}

      {/* Top 3 Summary Stat Cards (Strictly Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: आज कुल स्लॉट बुक */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">
              आज कुल स्लॉट बुक
            </span>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0f3d2e] tracking-tight">
                120
              </span>
              <span className="text-sm font-bold text-gray-700">
                किसान
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: गेट पर / इन-परिसर */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">
              गेट पर / इन-परिसर
            </span>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#b45309] tracking-tight">
                42
              </span>
              <span className="text-sm font-bold text-gray-800">
                ट्रॉलीयां <span className="text-xs text-gray-500 font-normal">(कतार: 14)</span>
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#b45309] flex items-center justify-center border border-amber-100">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: गुणवत्ता स्थिति (Moisture/FAQ) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">
              गुणवत्ता स्थिति (Moisture/FAQ)
            </span>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1b5e20] tracking-tight">
                36
              </span>
              <span className="text-sm font-bold text-emerald-800">
                पास <span className="text-xs text-red-600 font-normal">/ 2 रीचेक</span>
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#1b5e20] flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Gate Entry & Barcode Scanner Panel (Strictly Image 1) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-700 font-bold">::</span>
              <h3 className="text-base font-bold text-gray-900">
                गेट प्रवेश एवं किसान सत्यापन (Gate Entry & Barcode Scanner)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              किसान के मोबाइल SMS/पर्ची का QR कोड स्कैन करें या टोकन नंबर दर्ज करें
            </p>
          </div>
          <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
            गेट #01 लाइव
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Scan Box */}
          <div className="lg:col-span-4 border border-gray-200 rounded-xl p-4 bg-[#fbfdfb] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center mb-3 text-gray-600 shadow-2xs">
              <Camera className="w-6 h-6" />
            </div>
            <button
              onClick={() => alert('कैमरा स्कैनर सक्रिय: QR कोड को कैमरे के सामने लाएं')}
              className="w-full py-2 px-3 bg-[#8b4513] hover:bg-[#6f370f] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>स्कैन करें (Scan QR / Barcode)</span>
            </button>
            <p className="text-[11px] text-gray-400 mt-2">
              अथवा RFID टैग वाहन सेंसर पर लाएं
            </p>
          </div>

          {/* Right Verification Card */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  placeholder="#MP-2409"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs font-bold font-mono text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
              <button
                onClick={() => setGateApproved(false)}
                className="px-4 py-2 bg-[#0f3d2e] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>खोजें</span>
              </button>
            </div>

            {/* Farmer Info Box */}
            <div className="border border-gray-200 rounded-xl p-3 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] text-[#14532d] font-bold flex items-center justify-center text-sm flex-shrink-0">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">राम सिंह (Ram Singh)</span>
                    <span className="text-[10px] font-bold bg-[#dcfce7] text-[#14532d] px-1.5 py-0.2 rounded">
                      ई-केवाईसी पास
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">
                    वाहन: <strong className="font-mono text-gray-900">MP 09 GH 4412</strong> | शरबती गेहूँ (~45 क्विंटल)
                  </p>
                </div>
              </div>

              <button
                onClick={handleGateEntry}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  gateApproved ? 'bg-[#14532d]' : 'bg-[#1b5e20] hover:bg-emerald-900'
                }`}
              >
                <span>🚢</span>
                <span>{gateApproved ? 'प्रवेश स्वीकृत ✓' : 'प्रवेश स्वीकृत (कतार +1)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Mandi Yard Queue Panel (Strictly Image 1) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#1b5e20] font-bold">::</span>
              <h3 className="text-base font-bold text-gray-900">
                सक्रिय कतार प्रबंधन (Real-Time Mandi Yard Queue)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              परिसर के विभिन्न चरणों में कार्यरत वाहनों की स्थिति व कॉल नियंत्रण
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="inline-flex items-center gap-1 text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              लाइव ऑटो-सिंक (5s)
            </span>
            <button
              onClick={() => alert('कतार डेटा रिफ्रेश हुआ!')}
              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filter Pills matching Image 1 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[#0f3d2e] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            सभी वाहन 42
          </button>
          <button
            onClick={() => setFilterTab('gate')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'gate'
                ? 'bg-[#0f3d2e] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            गेट पर प्रतीक्षारत 14
          </button>
          <button
            onClick={() => setFilterTab('quality')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterTab === 'quality'
                ? 'bg-[#b45309] text-white font-bold'
                : 'bg-[#fff7ed] text-[#b45309] border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>गुणवत्ता जाँच (Lab)</span>
            <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center">
              6
            </span>
          </button>
          <button
            onClick={() => setFilterTab('scale')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'scale'
                ? 'bg-[#0f3d2e] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            तौल कांटा (Scale) 4
          </button>
          <button
            onClick={() => setFilterTab('receipt')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'receipt'
                ? 'bg-[#0f3d2e] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            पावती / निकासी 18
          </button>
        </div>

        {/* Table strictly matching Image 1 */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f9faf9] text-gray-700 font-bold border-b border-gray-200">
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
            <tbody className="divide-y divide-gray-100">
              {queueItems.map((item, idx) => (
                <tr
                  key={item.token}
                  className={`hover:bg-[#f6faf7] transition-colors ${
                    item.isFirst ? 'border-l-4 border-l-[#b45309] bg-[#fffdfa]' : ''
                  }`}
                >
                  <td className="p-3 font-mono font-black text-[#b45309]">
                    {item.token}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-gray-900 block">{item.farmerName}</span>
                    <span className="text-[10px] text-gray-500 font-mono">ID: {item.farmerId}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-gray-800">
                    {item.vehicleNo}
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px] font-semibold text-gray-800">
                      {item.crop}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 font-medium">
                    {item.arrivalTime}
                  </td>
                  <td className="p-3">
                    {item.stageType === 'quality' && (
                      <span className="inline-flex items-center gap-1.5 bg-[#fff7ed] text-[#b45309] font-bold px-2.5 py-1 rounded-full text-[11px] border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'gate_wait' && (
                      <span className="inline-block bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-full text-[11px]">
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'weighment' && (
                      <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#14532d] font-bold px-2.5 py-1 rounded-full text-[11px] border border-emerald-300">
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'unloading' && (
                      <span className="inline-block bg-[#f1f5f3] text-gray-700 font-medium px-2.5 py-1 rounded-full text-[11px]">
                        {item.stage}
                      </span>
                    )}
                    {item.stageType === 'ready' && (
                      <span className="inline-flex items-center gap-1 bg-[#e0f2fe] text-[#0369a1] font-bold px-2.5 py-1 rounded-full text-[11px]">
                        {item.stage}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {item.actionType === 'call_scale' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-[#0f3d2e] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'gate_call' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'record_weight' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'slip_recommend' && (
                      <button
                        onClick={() => handleAction(item.token, item.actionType)}
                        className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                    {item.actionType === 'completed' && (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-emerald-700 font-bold border border-emerald-300 bg-emerald-50">
                        <Check className="w-4 h-4" />
                      </span>
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
