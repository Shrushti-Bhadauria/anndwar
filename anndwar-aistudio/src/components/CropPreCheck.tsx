import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  CloudSun, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  FileText,
  HelpCircle,
  Camera,
  Check
} from 'lucide-react';
import { Language, CropPreCheckResult } from '../types';

interface CropPreCheckProps {
  lang: Language;
  onNavigateToBooking: () => void;
}

export const CropPreCheck: React.FC<CropPreCheckProps> = ({
  lang,
  onNavigateToBooking,
}) => {
  const isHi = lang === 'hi';

  const [selectedCrop, setSelectedCrop] = useState<string>('शरबती गेहूँ');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('खलिहान में 2 दिन तिरपाल पर धूप में सुखाया गया है।');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CropPreCheckResult | null>(null);

  // Sample presets for quick testing
  const presets = [
    {
      id: 'sample_wheat_good',
      labelHi: 'नमूना 1: उत्कृष्ट शरबती गेहूँ (पास)',
      labelEn: 'Sample 1: Grade-A Wheat (Pass)',
      crop: 'शरबती गेहूँ',
      notes: 'खलिहान में 2 दिन तिरपाल पर धूप में सुखाया गया है।',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sample_wheat_moist',
      labelHi: 'नमूना 2: अधिक नमी वाला गेहूँ (धूप सुखाने की सलाह)',
      labelEn: 'Sample 2: High Moisture Wheat (Drying Needed)',
      crop: 'शरबती गेहूँ',
      notes: 'हल्की बारिश के बाद काटा गया, नमी ज्यादा लग रही है।',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sample_chana',
      labelHi: 'नमूना 3: देसी चना (सामान्य कचरा)',
      labelEn: 'Sample 3: Desi Chana (Fine husk)',
      crop: 'देसी चना',
      notes: 'थ्रेशर से निकाला गया, हल्का छिलका है।',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setSelectedCrop(preset.crop);
    setNotes(preset.notes);
    setImagePreview(preset.image);
    setAnalysisResult(null);
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/crop-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: selectedCrop,
          imageBase64: imagePreview || undefined,
          additionalNotes: notes,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Crop pre-check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🌾</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#143425] tracking-tight">
            {isHi
              ? 'AI फसल पूर्व-जांच एवं मौसम अलर्ट'
              : 'AI Crop Pre-Check & Weather Alerts'}
          </h2>
          <span className="text-[10px] font-bold bg-[#e3f7ec] text-[#147437] border border-[#a8e3c1] px-2 py-0.5 rounded-full">
            Gemini 3.8 AI
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#4f705f] max-w-3xl leading-relaxed">
          {isHi
            ? 'मंडी जाने से पूर्व अपनी फसल की गुणवत्ता, नमी एवं विदेशी कणों की जांच घर बैठे करें। इससे मंडी में लाइन में लगने के बाद रिजेक्शन या अवांछित कटौतियों से बचा जा सकता है।'
            : 'Check moisture, grade, and foreign matter percentage before loading your tractor to avoid unnecessary rejection or long queues at the mandi.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#153a28] mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#1b7e45]" />
              <span>{isHi ? '१. फसल का चयन व फोटो' : '1. Select Crop & Photo'}</span>
            </h3>

            {/* Crop Selector */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[#5c7a6b] block mb-1">
                {isHi ? 'फसल की किस्म' : 'Crop Variety'}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-[#f9faf9] border border-[#cbdcd0] rounded-xl px-3 py-2 text-xs font-semibold text-[#183a29] focus:outline-none focus:ring-2 focus:ring-[#1b7e45]"
              >
                <option value="शरबती गेहूँ">शरबती गेहूँ (Sharbati Wheat - MSP ₹2,400)</option>
                <option value="लोकवन गेहूँ">लोकवन गेहूँ (Lokwan Wheat)</option>
                <option value="सोयाबीन (पीला)">सोयाबीन (Yellow Soybean)</option>
                <option value="देसी चना">देसी चना (Desi Chana - MSP ₹5,440)</option>
                <option value="सरसों / राई">सरसों / राई (Mustard)</option>
              </select>
            </div>

            {/* Quick Sample Presets */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[#5c7a6b] block mb-1.5">
                {isHi ? 'त्वरित परीक्षण नमूने (Presets):' : 'Quick Presets:'}
              </label>
              <div className="flex flex-col gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-[#f3f8f5] hover:bg-[#e6f2eb] text-[#1b4d3e] font-medium border border-[#cfe2d7] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{isHi ? p.labelHi : p.labelEn}</span>
                    <span className="text-[10px] text-[#2c8352] font-bold">चुनें →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload Zone */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[#5c7a6b] block mb-1">
                {isHi ? 'अनाज की हथेली पर स्पष्ट फोटो:' : 'Grain Sample Photo:'}
              </label>
              <div className="relative border-2 border-dashed border-[#b8d6c4] hover:border-[#1b7e45] rounded-xl p-4 text-center bg-[#fafcfa] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Crop Sample"
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-lg shadow-2xs border border-[#c5ddd0]"
                    />
                    <span className="text-[10px] bg-black/65 text-white px-2 py-0.5 rounded absolute bottom-1.5 right-1.5">
                      {isHi ? 'फोटो लोड हुई (बदलने हेतु क्लिक करें)' : 'Click to change'}
                    </span>
                  </div>
                ) : (
                  <div className="py-3 flex flex-col items-center">
                    <Upload className="w-7 h-7 text-[#1b7e45] mb-1.5" />
                    <span className="text-xs font-semibold text-[#183a29] block">
                      {isHi ? 'अनाज की फोटो यहां खींचें या अपलोड करें' : 'Upload or snap grain photo'}
                    </span>
                    <span className="text-[10px] text-[#638072] mt-0.5">
                      JPG, PNG • मोबाइल से सीधे फोटो ले सकते हैं
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Farmer's Drying / Storage Notes */}
            <div className="mb-5">
              <label className="text-[11px] font-semibold text-[#5c7a6b] block mb-1">
                {isHi ? 'कटाई एवं भंडारण टिप्पणी:' : 'Harvest & Storage Notes:'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="उदा. खलिहान में 2 दिन सुखाया है"
                className="w-full bg-[#f9faf9] border border-[#cbdcd0] rounded-xl px-3 py-2 text-xs text-[#183a29] focus:outline-none focus:ring-2 focus:ring-[#1b7e45]"
              />
            </div>

            {/* Submit Action */}
            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="w-full bg-[#1b4d3e] hover:bg-[#153f33] disabled:bg-[#7a9d8d] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#88f0bc]" />
              <span>
                {isLoading
                  ? (isHi ? 'AI द्वारा गुणवत्ता व नमी परीक्षण जारी...' : 'AI Analyzing Grain Quality...')
                  : (isHi ? 'AI द्वारा पूर्व-जांच प्रारंभ करें' : 'Run AI Quality Pre-Check')}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Results & Advisory (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {analysisResult ? (
            <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-6 shadow-xs flex flex-col gap-5">
              {/* Top Result Banner */}
              <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-[#e8efe9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#147437] bg-[#e3f7ec] border border-[#a8e3c1] px-2 py-0.5 rounded-full">
                      ✓ {analysisResult.grade}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#618070]">
                      #{analysisResult.id}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#113222] mt-1">
                    {analysisResult.cropType} • {isHi ? 'उपार्जन मानक परीक्षण रिपोर्ट' : 'Procurement Quality Report'}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#638072] block">
                    {isHi ? 'समग्र गुणवत्ता स्कोर' : 'Quality Score'}
                  </span>
                  <span className="text-3xl font-black text-[#1b7e45]">
                    {analysisResult.qualityScore}
                    <span className="text-sm font-bold text-[#638072]">/100</span>
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* Moisture */}
                <div className="bg-[#f7faf8] border border-[#cfe2d6] rounded-xl p-3 text-center">
                  <span className="text-[10.5px] text-[#557766] block font-medium">
                    {isHi ? 'नमी (Moisture)' : 'Moisture %'}
                  </span>
                  <span className={`text-xl font-black mt-0.5 block ${
                    analysisResult.moisturePercent <= 12.0 ? 'text-[#1b7e45]' : 'text-[#c62828]'
                  }`}>
                    {analysisResult.moisturePercent}%
                  </span>
                  <span className="text-[9.5px] text-[#2c8352] font-semibold mt-0.5 block">
                    {analysisResult.moisturePercent <= 12.0 
                      ? (isHi ? 'मानक ≤12% (पास)' : 'Standard ≤12% (Pass)')
                      : (isHi ? 'धूप में सुखाएं' : 'Needs Sun Drying')}
                  </span>
                </div>

                {/* Foreign matter */}
                <div className="bg-[#f7faf8] border border-[#cfe2d6] rounded-xl p-3 text-center">
                  <span className="text-[10.5px] text-[#557766] block font-medium">
                    {isHi ? 'विदेशी तत्व (Dust/Weed)' : 'Foreign Matter'}
                  </span>
                  <span className="text-xl font-black text-[#113222] mt-0.5 block">
                    {analysisResult.foreignMatterPercent}%
                  </span>
                  <span className="text-[9.5px] text-[#2c8352] font-semibold mt-0.5 block">
                    {isHi ? 'मानक ≤0.75% (स्वीकृत)' : 'Permissible ≤0.75%'}
                  </span>
                </div>

                {/* Rejection risk */}
                <div className="bg-[#f7faf8] border border-[#cfe2d6] rounded-xl p-3 text-center">
                  <span className="text-[10.5px] text-[#557766] block font-medium">
                    {isHi ? 'रिजेक्शन जोखिम' : 'Rejection Risk'}
                  </span>
                  <span className={`text-base font-black mt-1 block uppercase ${
                    analysisResult.rejectionRiskLevel === 'Low' ? 'text-[#1b7e45]' : 'text-[#c62828]'
                  }`}>
                    {isHi ? (analysisResult.rejectionRiskLevel === 'Low' ? 'न्यूनतम (Safe)' : 'मध्यम') : analysisResult.rejectionRiskLevel}
                  </span>
                  <span className="text-[9.5px] text-[#638072] mt-0.5 block">
                    {isHi ? 'MSP पात्र' : 'MSP Eligible'}
                  </span>
                </div>
              </div>

              {/* Weather Advisory Card */}
              <div className="bg-[#fef9f2] border border-[#f5d8af] rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c96c21] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CloudSun className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8c4815]">
                    {isHi ? '🌤️ मौसम चेतावनी एवं परिवहन परामर्श' : '🌤️ Weather Alert & Transit Advisory'}
                  </h4>
                  <p className="text-xs text-[#5c3717] mt-0.5 font-medium leading-relaxed">
                    {isHi ? analysisResult.weatherAlertHi : analysisResult.weatherAlertEn}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-[#143626] mb-2">
                  {isHi ? '💡 किसान बंधु हेतु एआई सुझाव (Actionable Guidance):' : '💡 Actionable Guidance for Farmer:'}
                </h4>
                <ul className="space-y-1.5">
                  {(isHi ? analysisResult.recommendationsHi : analysisResult.recommendationsEn).map((rec, idx) => (
                    <li key={idx} className="text-xs text-[#305542] flex items-start gap-2 bg-[#f4f9f6] p-2 rounded-lg border border-[#d6e8dc]">
                      <Check className="w-3.5 h-3.5 text-[#1b7e45] shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Slot Booking CTA */}
              <div className="pt-3 border-t border-[#e8efe9] flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs text-[#527262]">
                  {isHi ? 'फसल उपार्जन हेतु पूरी तरह तैयार है!' : 'Crop is ready for procurement!'}
                </div>
                <button
                  onClick={onNavigateToBooking}
                  className="bg-[#1b7e45] hover:bg-[#156738] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isHi ? 'सीधे मंडी स्लॉट बुक करें' : 'Book Mandi Slot Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#d2dfd6] p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-14 h-14 rounded-full bg-[#f0f7f3] border border-[#c4ded0] flex items-center justify-center text-[#1b4d3e] mb-3">
                <Sparkles className="w-7 h-7 text-[#1b7e45]" />
              </div>
              <h3 className="text-base font-bold text-[#143626]">
                {isHi ? 'फसल की फोटो व विवरण दर्ज करें' : 'Upload or Select a Sample'}
              </h3>
              <p className="text-xs text-[#5a7b6a] max-w-md mt-1 leading-relaxed">
                {isHi
                  ? 'बाईं ओर दी गई सूची से अपनी फसल चुनें या फोटो अपलोड करके "AI द्वारा पूर्व-जांच प्रारंभ करें" पर क्लिक करें।'
                  : 'Select your grain from the left panel or click one of the quick presets to test moisture, purity, and grade.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
