import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Truck, 
  Clock, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Radio, 
  ShieldAlert, 
  Check, 
  ArrowRight, 
  FileText, 
  Navigation,
  Download,
  Flame,
  Scale,
  X,
  MapPin,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';

interface AdminCommandCentreProps {
  lang: Language;
  onNavigateToFarmer?: () => void;
}

export const AdminCommandCentre: React.FC<AdminCommandCentreProps> = ({ 
  lang,
  onNavigateToFarmer 
}) => {
  const isHi = lang === 'hi';
  const [autoDiversion, setAutoDiversion] = useState(true);
  const [smsSent, setSmsSent] = useState(false);
  const [diversionActive, setDiversionActive] = useState(false);
  const [investigationSent, setInvestigationSent] = useState(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [liveTelemetryActive, setLiveTelemetryActive] = useState(true);
  const [selectedGisTruck, setSelectedGisTruck] = useState<any>(null);

  const [trucks, setTrucks] = useState([
    {
      id: 'MP 09 GH 3211',
      tripId: 'TRIP-25-8891',
      driver: 'रघुवीर (98261••••)',
      route: 'सांवेर उपार्जन केंद्र → देवास FCI मॉडर्न साइलो',
      quantity: '350 क्विंटल',
      bags: '700 कट्टे (गेहूं FAQ)',
      seal: '🔒 E-SEAL #88219',
      location: 'मांगलिया टोल क्रॉस',
      etaMinutes: 18,
      distanceKm: 14.2,
      speedKm: 42,
      status: 'normal',
      coords: '22.8412° N, 75.9102° E',
    },
    {
      id: 'MP 11 AB 9088',
      tripId: 'TRIP-25-8894',
      driver: 'सतीश वर्मा (94250••••)',
      route: 'हातोद उपार्जन केंद्र → मांगलिया वेयरहाउसिंग',
      quantity: '420 क्विंटल',
      bags: '840 कट्टे (गेहूं)',
      seal: '⚠️ तौल विसंगति जांच',
      location: 'गोदाम धर्मकांटा पर रुका',
      etaMinutes: 0,
      distanceKm: 0,
      speedKm: 0,
      discrepancyKg: -1150,
      waitMins: 32,
      status: 'anomaly',
      coords: '22.8120° N, 75.8940° E',
    },
    {
      id: 'MP 09 BC 1422',
      tripId: 'TRIP-25-8898',
      driver: 'जयसिंदर (98932••••)',
      route: 'देपालपुर मंडी → उज्जैन सेंट्रल साइलो',
      quantity: '380 क्विंटल',
      bags: '760 कट्टे (चना)',
      seal: '🔒 E-SEAL #88224',
      location: 'प्रवेश द्वार पर उपस्थित',
      etaMinutes: 4,
      distanceKm: 2.1,
      speedKm: 18,
      status: 'gate',
      coords: '23.1765° N, 75.7885° E',
    },
    {
      id: 'MP 43 EA 5570',
      tripId: 'TRIP-25-8902',
      driver: 'मुनेश (97551••••)',
      route: 'बेटमा उपार्जन केंद्र → धार स्टेट वेयरहाउस',
      quantity: '310 क्विंटल',
      bags: '620 कट्टे (गेहूं)',
      seal: '🔒 E-SEAL #88231',
      location: 'घाटाबिल्लोद हाईवे',
      etaMinutes: 42,
      distanceKm: 28.0,
      speedKm: 54,
      status: 'in_transit',
      coords: '22.6841° N, 75.5210° E',
    },
  ]);

  // Live real-time GPS & ETA countdown interval
  useEffect(() => {
    if (!liveTelemetryActive) return;
    const interval = setInterval(() => {
      setTrucks((prev) =>
        prev.map((t) => {
          if (t.status === 'normal' || t.status === 'in_transit' || t.status === 'gate') {
            const nextEta = t.etaMinutes > 1 ? t.etaMinutes - 1 : 16;
            const nextDist = t.distanceKm > 0.3 ? Number((t.distanceKm - 0.2).toFixed(1)) : 12.8;
            const nextSpeed = Math.floor(38 + Math.random() * 16);
            return {
              ...t,
              etaMinutes: nextEta,
              distanceKm: nextDist,
              speedKm: nextSpeed,
            };
          }
          return t;
        })
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [liveTelemetryActive]);

  const handleSendSms = () => {
    setSmsSent(true);
    setAdminToast(isHi ? '✅ SMS एडवाइजरी 2,400 किसानों को प्रेषित की गई!' : '✅ SMS advisory sent to 2,400 farmers!');
    setTimeout(() => {
      setSmsSent(false);
      setAdminToast(null);
    }, 3500);
  };

  const handleToggleDiversion = () => {
    setDiversionActive(!diversionActive);
    setAdminToast(
      !diversionActive 
        ? (isHi ? '⚡ डायवर्जन रूट सक्रिय! देपालपुर से 40% लोड सांवेर व बेटमा डायवर्ट हुआ।' : '⚡ Diversion active! 40% load diverted.') 
        : (isHi ? 'डायवर्जन रूट सामान्य स्थिति पर लौटा।' : 'Diversion route normalized.')
    );
    setTimeout(() => setAdminToast(null), 3500);
  };

  const handleDispatchInvestigation = () => {
    setInvestigationSent(true);
    setAdminToast(
      isHi 
        ? '🚨 नोडल जांच दल रवाना! SDM दल वाहन MP-09-POL-11 मांगलिया वेयरहाउस पहुंचा। री-वेइंग व सील जांच प्रारंभ।'
        : '🚨 Nodal Inspection Team Dispatched! SDM team en route with portable scale check.'
    );
    setTimeout(() => setAdminToast(null), 5000);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl space-y-6">
      {/* Toast Alert */}
      {adminToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{adminToast}</span>
          </div>
          <button onClick={() => setAdminToast(null)} className="text-emerald-700 hover:text-black">✕</button>
        </div>
      )}

      {/* Top Admin Portal Command Banner */}
      <div className="bg-gradient-to-r from-[#0f291e] via-[#163e2f] to-[#1c4d3b] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#143e31] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-400/20 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isHi ? 'राज्य उपार्जन कमांड सेंटर (एडमिन पोर्टल)' : 'State Procurement Command Centre (Admin Portal)'}
              </h2>
              <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                LIVE MONITORING
              </span>
            </div>
            <p className="text-xs text-[#b8e5d3] mt-0.5">
              {isHi ? 'इंदौर संभाग • 5 सक्रिय उपार्जन केंद्र, AI लोड बैलेंसिंग, GPS फ्लीट ट्रैकिंग व DBT नियंत्रण' : 'Indore Division • 5 Active Centers, AI Load Balancing, Fleet GPS & DBT Oversight'}
            </p>
          </div>
        </div>

        {onNavigateToFarmer && (
          <button
            onClick={onNavigateToFarmer}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#1b4d3e] border border-white/30 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <span>← {isHi ? 'किसान पोर्टल पर लौटें' : 'Back to Farmer Portal'}</span>
          </button>
        )}
      </div>

      {/* Top 4 KPI Summary Cards (Strictly Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 4,820 क्विंटल */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>दैनिक उपार्जन मात्रा</span>
            <Scale className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0f3d2e]">
              4,820 <span className="text-xs font-semibold text-gray-500">क्विंटल (MT 1,482)</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              42 किसान / 620 ट्रॉली
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-100 text-[11px] font-bold text-emerald-800">
            दैनिक लक्ष्य का 78%
          </div>
        </div>

        {/* Card 2: 24 मिनट */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>औसत यार्ड प्रतीक्षा समय</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#b45309]">
              24 <span className="text-xs font-semibold text-gray-500">मिनट (गेट से तौल तक)</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
              📉 पिछले वर्ष 3.8 घंटे की तुलना में -89% की कमी
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-100 text-[10.5px] text-gray-500">
            न्यूनतम: देपालपुर (14m) | अधिकतम: छावनी (2.5h)
          </div>
        </div>

        {/* Card 3: 36 ट्रक */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>फ्लीट व इन-ट्रांजिट स्टॉक</span>
            <Truck className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0f3d2e]">
              36 <span className="text-xs font-semibold text-gray-500">ट्रक रूट पर (1,240 MT)</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              24 ऑन-रूट GPS | 12 अनलोडिंग
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-100 text-[10.5px] text-emerald-700 font-semibold">
            100% डिजिटल ई-सील सुरक्षित | 0 मार्ग अटकाव
          </div>
        </div>

        {/* Card 4: 18.42 करोड़ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>संवितरित प्रत्यक्ष लाभ (DBT)</span>
            <CreditCard className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1b5e20]">
              ₹18.42 <span className="text-xs font-semibold text-gray-500">करोड़ (आज तक)</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
              ✓ 99.2% संवितरण 48 घंटे के भीतर संपन्न
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-100 text-[10.5px] text-gray-500">
            सफल: 4,921 किसान | 14 त्रुटि पुनः प्रयास
          </div>
        </div>
      </div>

      {/* Mandi Network Load Balancing Grid (Strictly Image 3) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-800" />
              <h3 className="text-base font-bold text-gray-900">
                मंडी नेटवर्क लोड संतुलन एवं लाइव डायवर्जन ग्रिड
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-Time Mandi Load Heatmap, Bottleneck Detection & Automated Farmer Queue Re-Routing
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-gray-600 font-medium">स्वचालित AI लोड डाइवर्जन</span>
              <button
                onClick={() => setAutoDiversion(!autoDiversion)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  autoDiversion ? 'bg-[#0f3d2e]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoDiversion ? 'translate-x-4' : ''
                  }`}
                />
              </button>
              <span className="text-[10px] text-gray-400">(थ्रेशोल्ड सीमा: 75% क्षमता)</span>
            </div>

            <button
              onClick={handleSendSms}
              className="px-3.5 py-1.5 bg-[#8b4513] hover:bg-[#6f370f] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>📢</span>
              <span>{smsSent ? 'SMS भेजा गया ✓' : 'तत्काल किसान SMS प्रसारण भेजें'}</span>
            </button>
          </div>
        </div>

        {/* 4 Center Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Center 1: सांवेर उपार्जन केंद्र */}
          <div className="border border-gray-200 rounded-xl p-4 bg-[#fafcfb] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span>उपार्जन केंद्र कोड: MP-IND-04</span>
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                  64% भार (मध्यम)
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900">सांवेर उपार्जन केंद्र</h4>
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>कतार स्थिति:</span>
                  <span className="font-bold text-gray-900">42 ट्रॉलीयां प्रांगण में</span>
                </div>
                <div className="flex justify-between">
                  <span>औसत तौल समय:</span>
                  <span className="font-bold text-gray-900">38 मिनट प्रति स्लॉट</span>
                </div>
                <div className="flex justify-between">
                  <span>सक्रिय तौल कांटे:</span>
                  <span className="font-bold text-gray-900">3 में से 3 चालू</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-gray-200 rounded-lg text-[11px] text-emerald-800 font-medium">
              <div className="flex items-center gap-1 font-bold text-emerald-900">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>प्रवाह स्थिर - सामान्य प्रक्रिया जारी</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                गोदाम ट्रक रवानगी नियमित (हर 20 मिनट पर प्रेषण)
              </p>
            </div>
          </div>

          {/* Center 2: देपालपुर कृषि उपज मंडी (ACTIVE ABSORBER) */}
          <div className="border-2 border-emerald-600 rounded-xl p-4 bg-[#f0fdf4] flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bg-emerald-700 text-white text-[10px] font-bold py-0.5 text-center uppercase tracking-wider">
              डायवर्जन गंतव्य केंद्र (ACTIVE ABSORBER)
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                <span>उपार्जन केंद्र कोड: MP-IND-07</span>
                <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  32% भार (न्यूनतम)
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900">देपालपुर कृषि उपज मंडी</h4>
              <div className="mt-2 space-y-1 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>कतार स्थिति:</span>
                  <span className="font-bold text-gray-900">16 ट्रॉलीयां (अतिरिक्त स्लॉट उपलब्ध)</span>
                </div>
                <div className="flex justify-between">
                  <span>औसत तौल समय:</span>
                  <span className="font-bold text-emerald-900">14 मिनट (त्वरित)</span>
                </div>
                <div className="flex justify-between">
                  <span>सक्रिय तौल कांटे:</span>
                  <span className="font-bold text-gray-900">4 में से 4 चालू</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-emerald-300 rounded-lg text-[11px] text-emerald-950 font-medium shadow-2xs">
              <div className="flex items-center gap-1 font-bold text-emerald-900">
                <span>📢</span>
                <span>AI डायवर्जन सक्रिय: +18 किसान पुनर्निर्देशित</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-0.5">
                सांवेर और हातोद बेल्ट के किसानों को ₹30/क्विंटल अतिरिक्त परिवहन प्रोत्साहन SMS भेजा गया।
              </p>
            </div>
          </div>

          {/* Center 3: इंदौर मुख्य मंडी (छावनी) (RED ALERT) */}
          <div className="border border-red-300 rounded-xl p-4 bg-[#fff5f5] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span className="text-red-700 font-bold">उपार्जन केंद्र कोड: MP-IND-01</span>
                <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                  88% भार (अत्यधिक जाम)
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900">इंदौर मुख्य मंडी (छावनी)</h4>
              <div className="mt-2 space-y-1 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>कतार स्थिति:</span>
                  <span className="font-bold text-red-700">94 ट्रॉलीयां बाहर हाईवे तक</span>
                </div>
                <div className="w-full bg-red-200 h-1.5 rounded-full overflow-hidden my-1">
                  <div className="bg-red-600 h-1.5 w-[88%]"></div>
                </div>
                <div className="flex justify-between">
                  <span>प्रतीक्षा समय:</span>
                  <span className="font-bold text-red-700">2 घंटे 30 मिनट</span>
                </div>
                <div className="flex justify-between">
                  <span>सक्रिय तौल कांटे:</span>
                  <span className="font-medium text-gray-800">5 में से 4 (कांटा #2 तकनीकी जांच)</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-red-200 rounded-lg text-[11px] text-red-950 font-medium">
              <div className="flex items-center gap-1 font-bold text-red-700">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>आपातकालीन गेट डायवर्जन लागू</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-0.5">
                छावनी हेतु नए स्लॉट अस्थायी निलंबित। आने वाले किसानों को मांगलिया साइलो भेजा जा रहा है।
              </p>
            </div>
          </div>

          {/* Center 4: बेटमा उपार्जन केंद्र */}
          <div className="border border-gray-200 rounded-xl p-4 bg-[#fafcfb] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span>उपार्जन केंद्र कोड: MP-IND-11</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  45% भार (संतुलित)
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900">बेटमा उपार्जन केंद्र</h4>
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>कतार स्थिति:</span>
                  <span className="font-bold text-gray-900">22 ट्रॉलीयां</span>
                </div>
                <div className="flex justify-between">
                  <span>औसत तौल समय:</span>
                  <span className="font-bold text-gray-900">22 मिनट</span>
                </div>
                <div className="flex justify-between">
                  <span>सक्रिय तौल कांटे:</span>
                  <span className="font-bold text-gray-900">2 में से 2 चालू</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-gray-200 rounded-lg text-[11px] text-emerald-800 font-medium">
              <div className="flex items-center gap-1 font-bold text-emerald-900">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>नमी जांच गति मानक (3m / प्रति किसान)</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                गोदाम बफर स्टॉक क्षमता 60% उपलब्ध।
              </p>
            </div>
          </div>
        </div>

        {/* Bottom cluster summary bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <span>📊</span>
            <span>मंडी क्लस्टर भार अंतर: <strong className="text-red-700">56%</strong> (छावनी 88% vs देपालपुर 32%)</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => alert('लोड सिमुलेशन रिपोर्ट डाउनलोड की जा रही है...')}
              className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              लोड सिमुलेशन रिपोर्ट डाउनलोड करें (PDF)
            </button>
            <button
              onClick={handleToggleDiversion}
              className={`px-4 py-1.5 font-bold rounded-lg text-white transition-colors cursor-pointer shadow-xs ${
                diversionActive ? 'bg-[#14532d]' : 'bg-[#0f3d2e] hover:bg-black'
              }`}
            >
              {diversionActive ? 'डायवर्जन रूट सक्रिय ✓' : 'डायवर्जन रूट सक्रिय करें'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 2 Big Panels (Strictly Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: परिवहन ट्रैकिंग एवं फ्लीट मॉनिटरिंग (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-800" />
                <h4 className="text-sm font-bold text-gray-900">
                  परिवहन ट्रैकिंग एवं फ्लीट मॉनिटरिंग (In-Transit Pipeline)
                </h4>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                उपार्जन केंद्र से FCI साइलो/गोदाम मार्ग पर इलेक्ट्रॉनिक ई-सील सुरक्षित फ्लीट
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiveTelemetryActive(!liveTelemetryActive)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 cursor-pointer ${
                  liveTelemetryActive 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${liveTelemetryActive ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`}></span>
                <span>{liveTelemetryActive ? (isHi ? '● 36 सक्रिय ट्रक (लाइव GPS 3s)' : '● 36 Trucks (Live GPS)') : (isHi ? 'टेलीमेट्री रुकी' : 'Telemetry Paused')}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-2.5">वाहन व ट्रिप ID</th>
                  <th className="p-2.5">रूट (स्रोत → गंतव्य)</th>
                  <th className="p-2.5">मात्रा (बोरे / MT)</th>
                  <th className="p-2.5">ई-गेट पास व सील</th>
                  <th className="p-2.5">GPS स्थिति व ETA</th>
                  <th className="p-2.5 text-center">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trucks.map((t) => {
                  const isAnomaly = t.status === 'anomaly';
                  return (
                    <tr
                      key={t.id}
                      className={`transition-colors ${
                        isAnomaly ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-2.5">
                        <span className="font-bold text-gray-900 block">{t.id}</span>
                        <span className="text-[10px] text-gray-500">{t.tripId} | {t.driver}</span>
                      </td>
                      <td className="p-2.5 text-gray-700 font-medium">{t.route}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-gray-900">{t.quantity}</span>
                        <span className="text-[10px] text-gray-500 block">{t.bags}</span>
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isAnomaly
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-mono'
                          }`}
                        >
                          {t.seal}
                        </span>
                      </td>
                      <td className="p-2.5">
                        {isAnomaly ? (
                          <div className="text-red-900">
                            <span className="font-bold block">{t.location}</span>
                            <span className="text-[10px] text-red-700">
                              {investigationSent ? (
                                <strong className="text-emerald-700 font-bold">● जांच दल ऑन-रूट (ETA 7m)</strong>
                              ) : (
                                `प्रतीक्षारत ${t.waitMins}m (${t.discrepancyKg} kg)`
                              )}
                            </span>
                          </div>
                        ) : (
                          <div className="text-gray-700">
                            <span className="font-bold block">{t.location}</span>
                            <span className="text-[10px] text-gray-500">
                              ETA: {t.etaMinutes} मिनट ({t.distanceKm} km • {t.speedKm} km/h)
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setSelectedGisTruck(t)}
                          title={isHi ? 'लाइव GIS टेलीमेट्री देखें' : 'View Live GIS Telemetry'}
                          className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-700 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>सुरक्षा: <strong className="text-emerald-800">🛡️ जियो-फेंसिंग 100% एक्टिव</strong></span>
            <button
              onClick={() => alert('GIS लाइव मैप स्क्रीन लोड हो रही है...')}
              className="text-[#1b5e20] hover:underline font-bold"
            >
              सभी 36 ट्रकों की लाइव GIS मैप स्क्रीन देखें →
            </button>
          </div>
        </div>

        {/* Right Panel: गोदाम आवक व तौल मिलान (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="text-sm font-bold text-gray-900">
              गोदाम आवक व तौल मिलान
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Weight Reconciliation & In-Transit Grain Pilferage Detection
            </p>
          </div>

          {/* Box 1: Red Alert Box */}
          <div className="border border-red-200 bg-red-50/50 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                गंभीर तौल विसंगति अलर्ट (Truck MP 11 AB 9088)
              </span>
              <span className="text-[10px] font-bold bg-red-700 text-white px-2 py-0.2 rounded">
                रोकें गया
              </span>
            </div>
            <p className="text-[10px] text-gray-600">
              हातोद मंडी → मांगलिया वेयरहाउसिंग (गेट #2)
            </p>

            <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-red-100 text-center">
              <div>
                <span className="text-[10px] text-gray-400 block">प्रेषित भार (Mandi)</span>
                <span className="text-xs font-bold text-gray-800">420.00 Q</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">प्राप्त भार (Godown)</span>
                <span className="text-xs font-bold text-gray-800">408.50 Q</span>
              </div>
              <div>
                <span className="text-[10px] text-red-600 font-bold block">अनाज कमी (Loss)</span>
                <span className="text-xs font-black text-red-700">-1,150 kg</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="text-gray-500">अनुमेय वाष्पीकरण: ≤0.2% (-84 kg) | विचलन: <strong className="text-red-700">-2.73%</strong></span>
              <button
                onClick={handleDispatchInvestigation}
                className={`px-3 py-1.5 font-bold rounded text-[10px] transition-all cursor-pointer shadow-xs ${
                  investigationSent 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-red-700 text-white hover:bg-red-800'
                }`}
              >
                {investigationSent ? 'जांच दल रवाना (ETA 7m) ✓' : 'नोडल जांच दल भेजें'}
              </button>
            </div>
          </div>

          {/* Box 2: Green Box */}
          <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                सामान्य मिलान स्वीकृत (Truck MP 09 GH 3211)
              </span>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded">
                स्वीकृत
              </span>
            </div>
            <p className="text-[10px] text-gray-600">
              सांवेर उपार्जन → देवास FCI साइलो
            </p>
            <div className="flex justify-between text-[11px] text-gray-700 pt-1">
              <span>प्रेषित: <strong>350.00 Q</strong></span>
              <span>प्राप्त: <strong>349.60 Q</strong></span>
              <span>अंतर: <strong className="text-emerald-800">-40 kg (0.11%)</strong></span>
            </div>
          </div>

          {/* Silo Capacity Utilization */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-800 block">
              साइलो एवं वेयरहाउस क्षमता उपयोग (Capacity Utilization)
            </span>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-gray-700">देवास FCI मॉडर्न साइलो (क्षमता 50,000 MT)</span>
                  <span className="font-bold text-gray-900">37,000 MT (74%)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gray-800 h-2" style={{ width: '74%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-gray-700">मांगलिया स्टेट वेयरहाउसिंग (क्षमता 35,000 MT)</span>
                  <span className="font-bold text-amber-800">20,300 MT (58%)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#b45309] h-2" style={{ width: '58%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-gray-700">उज्जैन सेंट्रल गोदाम (क्षमता 40,000 MT)</span>
                  <span className="font-bold text-red-700">32,800 MT (82% - भरा हुआ)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-2" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>तौल अंतर ऑटो-डिटेक्शन: <strong className="text-emerald-800">सक्रिय (सटीकता 99.8%)</strong></span>
            <button
              onClick={() => setAdminToast(isHi ? '📑 36 ट्रकों की वजन व ई-सील डिजिटल ऑडिट रिपोर्ट तैयार है!' : '📑 Fleet Audit Report ready!')}
              className="text-[#1b5e20] hover:underline font-bold cursor-pointer"
            >
              ऑडिट रिपोर्ट देखें
            </button>
          </div>
        </div>
      </div>

      {/* Interactive GIS GPS Telemetry Live Modal */}
      {selectedGisTruck && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <span>{isHi ? 'वाहन GPS लाइव टेलीमेट्री' : 'Vehicle GPS Live Telemetry'}</span>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {selectedGisTruck.id}
                    </span>
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono">
                    {selectedGisTruck.tripId} • चालक: {selectedGisTruck.driver}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGisTruck(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Schematic Route & Telemetry Cards */}
            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">{isHi ? 'वर्तमान GPS निर्देशांक:' : 'Current GPS Coords:'}</span>
                  <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-300">
                    {selectedGisTruck.coords}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">{isHi ? 'रूट:' : 'Route:'}</span>
                  <span className="font-bold text-gray-800 text-right">{selectedGisTruck.route}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 text-center">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-400 block">{isHi ? 'गति' : 'Speed'}</span>
                    <span className="font-black text-gray-900 text-sm">{selectedGisTruck.speedKm} km/h</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-400 block">{isHi ? 'दूरी शेष' : 'Remaining'}</span>
                    <span className="font-black text-gray-900 text-sm">{selectedGisTruck.distanceKm} km</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-400 block">ETA</span>
                    <span className="font-black text-emerald-800 text-sm">~{selectedGisTruck.etaMinutes} {isHi ? 'मिनट' : 'mins'}</span>
                  </div>
                </div>
              </div>

              {/* Security & e-Seal Status */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="font-bold text-xs">{selectedGisTruck.seal}</span>
                </div>
                <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  {isHi ? 'डिजिटल सील सुरक्षित (100% OK)' : 'Seal Intact (100% OK)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedGisTruck(null)}
                className="px-4 py-2 bg-[#0f3d2e] hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {isHi ? 'बंद करें (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
