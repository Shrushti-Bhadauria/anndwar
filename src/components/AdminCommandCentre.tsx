import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Truck, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Radio, 
  ShieldAlert, 
  Check, 
  ArrowRight, 
  Navigation, 
  Flame, 
  Scale, 
  MapPin, 
  RefreshCw, 
  Sparkles,
  Send,
  CloudSun
} from 'lucide-react';
import { Language } from '../types';

interface AdminCommandCentreProps {
  lang: Language;
  onNavigateToFarmer?: () => void;
}

export const AdminCommandCentre: React.FC<AdminCommandCentreProps> = ({ 
  lang 
}) => {
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState<'centers' | 'fleet' | 'anomalies'>('centers');
  const [autoDiversion, setAutoDiversion] = useState(true);
  const [smsSent, setSmsSent] = useState(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Center balancing state
  const [centers, setCenters] = useState([
    {
      id: 'c1',
      nameHi: 'सांवेर उपार्जन केंद्र (गेट #02)',
      nameEn: 'Sanwer Centre (Gate #02)',
      loadPercent: 88,
      status: 'high_load',
      waitMinutes: 45,
      activeScales: 4,
      trucksWaiting: 18,
      dailyProcuredQ: 4200,
    },
    {
      id: 'c2',
      nameHi: 'हातोद उपार्जन केंद्र (वैकल्पिक)',
      nameEn: 'Hatod Centre (Alternate)',
      loadPercent: 34,
      status: 'low_load',
      waitMinutes: 12,
      activeScales: 3,
      trucksWaiting: 5,
      dailyProcuredQ: 1850,
    },
    {
      id: 'c3',
      nameHi: 'देपालपुर मंडी परिसर',
      nameEn: 'Depalpur Mandi Complex',
      loadPercent: 42,
      status: 'low_load',
      waitMinutes: 15,
      activeScales: 4,
      trucksWaiting: 7,
      dailyProcuredQ: 2100,
    },
  ]);

  // Telemetry fleet
  const [trucks, setTrucks] = useState([
    {
      id: 'MP 09 GH 3211',
      tripId: 'TRIP-25-8891',
      driver: 'रघुवीर सिंह (98261••••)',
      route: 'सांवेर केंद्र → देवास FCI साइलो',
      quantity: '350 क्विंटल गेहूँ',
      seal: '🔒 E-SEAL #88219 (सुरक्षित)',
      location: 'मांगलिया टोल बाईपास',
      eta: '18 मिनट',
      speed: '42 किमी/घंटा',
      status: 'in_transit',
    },
    {
      id: 'MP 11 AB 9088',
      tripId: 'TRIP-25-8894',
      driver: 'सतीश वर्मा (94250••••)',
      route: 'हातोद केंद्र → मांगलिया वेयरहाउस',
      quantity: '420 क्विंटल गेहूँ',
      seal: '⚠️ तौल विसंगति जांच',
      location: 'गोदाम धर्मकांटा गेट',
      eta: 'रुका हुआ',
      speed: '0 किमी/घंटा',
      status: 'anomaly',
    },
    {
      id: 'MP 09 BC 1422',
      tripId: 'TRIP-25-8898',
      driver: 'जयसिंदर (98932••••)',
      route: 'देपालपुर मंडी → उज्जैन मॉडर्न साइलो',
      quantity: '380 क्विंटल चना',
      seal: '🔒 E-SEAL #88224',
      location: 'उज्जैन प्रवेश द्वार',
      eta: '4 मिनट',
      speed: '25 किमी/घंटा',
      status: 'in_transit',
    },
  ]);

  const handleTriggerDiversion = () => {
    setCenters((prev) =>
      prev.map((c) => {
        if (c.id === 'c1') return { ...c, loadPercent: 62, waitMinutes: 24, trucksWaiting: 9 };
        if (c.id === 'c2') return { ...c, loadPercent: 54, waitMinutes: 19, trucksWaiting: 12 };
        return c;
      })
    );
    setAdminToast('स्मार्ट AI डायवर्जन सक्रिय! 8 ट्रॉलियों को सांवेर से हातोद केंद्र डायवर्ट किया गया।');
    setTimeout(() => setAdminToast(null), 4500);
  };

  const handleBroadcastWeatherAlert = () => {
    setSmsSent(true);
    setAdminToast('मौसम चेतावनी SMS 1,420 पंजीकृत किसानों को प्रेषित: "मालवा क्षेत्र में आज शाम हल्की वर्षा की संभावना, उपज को तिरपाल से ढकें।"');
    setTimeout(() => setAdminToast(null), 5000);
  };

  const handleResolveAnomaly = (truckId: string) => {
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truckId
          ? { ...t, seal: '✓ सुरक्षा दल द्वारा पुन: सत्यापित', status: 'in_transit' }
          : t
      )
    );
    setAdminToast(`वाहन ${truckId} की तौल विसंगति जांच दल द्वारा स्वीकृत व रिलीज की गई!`);
    setTimeout(() => setAdminToast(null), 4000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] animate-pulse"></span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#143224] tracking-tight">
              {isHi ? 'प्रशासक कमांड सेंटर (Admin Command HQ)' : 'State Procurement Command Centre'}
            </h2>
            <p className="text-xs text-[#527060]">
              {isHi ? 'खाद्य एवं नागरिक आपूर्ति संचालनालय, भोपाल • लाइव उपार्जन नियंत्रण कक्ष' : 'Directorate of Food & Civil Supplies, Bhopal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#cfe0d5] text-[#29563f] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>{isHi ? '18 उपार्जन केंद्र लाइव' : '18 Centers Live'}</span>
          </div>
        </div>
      </div>

      {/* Live Toast Banner */}
      {adminToast && (
        <div className="bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#2563eb]" />
            <span>{adminToast}</span>
          </div>
          <button onClick={() => setAdminToast(null)} className="text-[#1e40af] hover:text-black font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* 4 Clean Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs">
          <span className="text-xs text-[#637d70] font-medium block">
            {isHi ? 'कुल खाद्यान्न उपार्जन' : 'Total Procured Today'}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#143224]">1,48,200</span>
            <span className="text-xs font-bold text-[#3b6750]">क्विंटल</span>
          </div>
          <span className="text-[11px] text-[#2c8352] mt-1 font-semibold block">
            {isHi ? '↑ लक्ष्य का 82% पूर्ण' : '82% of daily target'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs">
          <span className="text-xs text-[#637d70] font-medium block">
            {isHi ? 'सक्रिय धर्मकांटा लेन' : 'Active Scale Lanes'}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#143224]">48 / 52</span>
            <span className="text-xs font-semibold text-[#3b6750]">कांटे</span>
          </div>
          <span className="text-[11px] text-[#2c8352] mt-1 font-semibold block">
            {isHi ? '✓ औसत तौल गति: 6.2m' : 'Avg weigh time: 6.2m'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs">
          <span className="text-xs text-[#637d70] font-medium block">
            {isHi ? 'लॉजिस्टिक्स ट्रक इन-ट्रांजिट' : 'Fleet in Transit'}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#854d0e]">14</span>
            <span className="text-xs font-semibold text-[#854d0e]">ट्रक साइलो मार्ग पर</span>
          </div>
          <span className="text-[11px] text-[#854d0e] mt-1 font-semibold block">
            {isHi ? '🔒 100% ई-सील संरक्षित' : 'E-Seal Protected'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs">
          <span className="text-xs text-[#637d70] font-medium block">
            {isHi ? 'सुरक्षा व विसंगति अलर्ट' : 'Anomaly Alerts'}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#b91c1c]">1</span>
            <span className="text-xs font-semibold text-red-600">जांच दल तैनात</span>
          </div>
          <span className="text-[11px] text-red-700 mt-1 font-semibold block">
            {isHi ? 'तौल विसंगति (मांगलिया)' : 'Weight Discrepancy'}
          </span>
        </div>
      </div>

      {/* Clean Modular Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#cfe0d5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('centers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'centers'
              ? 'bg-[#1b4d3e] text-white shadow-xs'
              : 'text-[#506e5e] hover:bg-[#eaf1ec]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isHi ? '१. उपार्जन केंद्र व ऑटो-डायवर्जन' : '1. Center Load & Balancing'}</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'fleet'
              ? 'bg-[#1b4d3e] text-white shadow-xs'
              : 'text-[#506e5e] hover:bg-[#eaf1ec]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{isHi ? '२. लाइव ट्रक व जीपीएस ट्रैकर' : '2. Fleet GPS Tracking'}</span>
        </button>

        <button
          onClick={() => setActiveTab('anomalies')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'anomalies'
              ? 'bg-[#1b4d3e] text-white shadow-xs'
              : 'text-[#506e5e] hover:bg-[#eaf1ec]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isHi ? '३. विसंगति निवारण व मौसम अलर्ट' : '3. Alerts & Broadcast'}</span>
        </button>
      </div>

      {/* TAB 1: Center Balancing & Auto-diversion */}
      {activeTab === 'centers' && (
        <div className="space-y-4">
          {/* AI Auto-diversion Banner */}
          <div className="bg-[#edf9f2] rounded-2xl border border-[#bce3cb] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b4d3e] text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#88f0bc]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#143828]">
                  {isHi ? 'स्मार्ट क्लस्टर लोड बैलेंसिंग इंजन (AI Traffic Balancer)' : 'Smart Center Balancing Engine'}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#3b6750]">
                  {isHi
                    ? 'सांवेर में अत्यधिक भीड़ होने पर किसानों को स्वतः नजदीकी हातोद केंद्र पर सुगम स्लॉट की सिफारिश करता है।'
                    : 'Automatically routes overflow traffic from congested centers to nearest available facilities.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerDiversion}
              className="px-4 py-2 bg-[#1b4d3e] hover:bg-[#143e31] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex-shrink-0 flex items-center gap-1.5"
            >
              <span>{isHi ? 'डायवर्जन लागू करें (Balance)' : 'Trigger Balancing'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#88f0bc]" />
            </button>
          </div>

          {/* Centers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {centers.map((center) => (
              <div
                key={center.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 ${
                  center.status === 'high_load' ? 'border-amber-300' : 'border-[#d2dfd6]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#143224]">
                      {isHi ? center.nameHi : center.nameEn}
                    </h4>
                    <span className="text-[11px] text-[#597867]">
                      {center.activeScales} धर्मकांटे कार्यरत
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      center.status === 'high_load'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[#eaf5ef] text-[#14532d] border border-[#a8dec0]'
                    }`}
                  >
                    {center.status === 'high_load' ? (isHi ? 'अत्यधिक भार' : 'Heavy Load') : (isHi ? 'सुचारू' : 'Normal')}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#143224] mb-1">
                    <span>{isHi ? 'यार्ड क्षमता उपयोग' : 'Capacity Load'}</span>
                    <span>{center.loadPercent}%</span>
                  </div>
                  <div className="w-full bg-[#f0f5f2] rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        center.loadPercent > 75 ? 'bg-amber-500' : 'bg-[#1b7e45]'
                      }`}
                      style={{ width: `${center.loadPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#edf3ef] text-xs">
                  <div>
                    <span className="text-[10.5px] text-[#638472] block">{isHi ? 'कतार में वाहन' : 'Queued Trucks'}</span>
                    <span className="font-bold text-[#143224]">{center.trucksWaiting} वाहन</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-[#638472] block">{isHi ? 'अनुमानित समय' : 'Est. Wait'}</span>
                    <span className="font-bold text-[#143224]">{center.waitMinutes} मिनट</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Fleet GPS Tracking */}
      {activeTab === 'fleet' && (
        <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#143224]">
                {isHi ? 'केंद्रीय साइलो लॉजिस्टिक्स बेड़ा (GPS Fleet Tracking)' : 'Central Silo Fleet Telemetry'}
              </h3>
              <p className="text-xs text-[#597867]">
                {isHi ? 'उपार्जन केंद्रों से केंद्रीय गोदामों तक खाद्यान्न परिवहन की लाइव निगरानी' : 'Real-time monitoring of grain transit from mandis to silos'}
              </p>
            </div>
            <span className="text-xs font-semibold bg-[#eaf5ef] text-[#14532d] px-2.5 py-1 rounded-lg border border-[#a8dec0]">
              ✓ ई-सील व जिओ-फेंसिंग सक्रिय
            </span>
          </div>

          <div className="overflow-x-auto border border-[#d2dfd6] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8faf8] text-[#3d5f4e] font-bold border-b border-[#d2dfd6]">
                <tr>
                  <th className="p-3">वाहन सं. / ट्रिप</th>
                  <th className="p-3">मार्ग (Route)</th>
                  <th className="p-3">मात्रा व उपज</th>
                  <th className="p-3">वर्तमान स्थान / गति</th>
                  <th className="p-3">ई-सील स्थिति</th>
                  <th className="p-3 text-right">कार्यवाही</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf3ef]">
                {trucks.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f8faf8] transition-colors">
                    <td className="p-3">
                      <span className="font-mono font-bold text-gray-900 block">{t.id}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{t.tripId}</span>
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {t.route}
                    </td>
                    <td className="p-3 font-semibold text-[#143224]">
                      {t.quantity}
                    </td>
                    <td className="p-3">
                      <span className="block text-gray-800 font-medium">{t.location}</span>
                      <span className="text-[10px] text-gray-500">{t.speed} • ETA {t.eta}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          t.status === 'anomaly'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-[#eaf5ef] text-[#14532d] border border-[#a8dec0]'
                        }`}
                      >
                        {t.seal}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {t.status === 'anomaly' ? (
                        <button
                          onClick={() => handleResolveAnomaly(t.id)}
                          className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          जांच व रिलीज
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold">✓ सामान्य</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Anomalies & Weather Broadcast */}
      {activeTab === 'anomalies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weather Alert Broadcast Box */}
          <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#143224]">
                  {isHi ? 'किसान मौसम चेतावनी प्रसारण (SMS Broadcast)' : 'Farmer Weather Alert Broadcast'}
                </h4>
                <p className="text-xs text-[#527060]">
                  {isHi ? 'आईएमडी वर्षा पूर्वानुमान के आधार पर पंजीकृत किसानों को सलाह' : 'IMD weather alerts to registered farmers'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#fffbeb] border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium">
              "चेतावनी: इंदौर-उज्जैन संभाग में आगामी 24 घंटे में हल्की बूंदाबांदी की संभावना है। किसान भाई खलिहान में कटी उपज को तिरपाल से सुरक्षित ढकें।"
            </div>

            <button
              onClick={handleBroadcastWeatherAlert}
              disabled={smsSent}
              className="w-full py-2.5 px-4 bg-[#1b4d3e] hover:bg-[#143e31] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <Send className="w-4 h-4 text-[#88f0bc]" />
              <span>{smsSent ? (isHi ? 'SMS सफलतापूर्वक प्रेषित ✓' : 'SMS Broadcasted ✓') : (isHi ? 'सभी 1,420 किसानों को SMS भेजें' : 'Broadcast SMS Alert')}</span>
            </button>
          </div>

          {/* Weight Discrepancy & Security Resolution */}
          <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center border border-red-200">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#143224]">
                  {isHi ? 'धर्मकांटा तौल विसंगति जांच' : 'Weighment Anomaly Resolution'}
                </h4>
                <p className="text-xs text-[#527060]">
                  {isHi ? 'लोडिंग व अनलोडिंग के बीच वजन में 1% से अधिक अंतर पर स्वतः जांच' : 'Automatic inspection trigger when weight delta > 1%'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 leading-relaxed font-medium">
              वाहन: <strong className="font-mono">MP 11 AB 9088</strong> (गेहूं 420 Q)<br />
              प्रारंभिक कांटा: 42,000 किग्रा | साइलो कांटा: 40,850 किग्रा (अंतर: -1,150 किग्रा)<br />
              स्थिति: वेयरहाउस मुख्य गेट पर वाहन रोका गया।
            </div>

            <button
              onClick={() => handleResolveAnomaly('MP 11 AB 9088')}
              className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isHi ? 'जांच संस्तुति व पर्ची रिलीज करें' : 'Verify & Release Slip'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
