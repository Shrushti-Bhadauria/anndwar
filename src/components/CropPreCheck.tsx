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
  Check,
  XCircle,
  Image as ImageIcon
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

  const [selectedCrop, setSelectedCrop] = useState<string>('गेहूँ (Wheat)');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  );
  const [notes, setNotes] = useState<string>('अनाज को 2 दिन धूप में सुखाया गया है, दाना साफ है।');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CropPreCheckResult | null>(null);
  const [hasRunCheck, setHasRunCheck] = useState<boolean>(false);

  // Common crops in MP and Indian mandis
  const cropOptions = [
    'गेहूँ (Wheat)',
    'चना (Gram / Chana)',
    'सोयाबीन (Soybean)',
    'धान (Paddy / Rice)',
    'सरसों (Mustard)',
    'मक्का (Maize)',
  ];

  // Presets for quick real-time testing
  const presets = [
    {
      id: 'sample_wheat_good',
      labelHi: 'नमूना 1: ग्रेड-A गेहूँ (मानक पास)',
      labelEn: 'Sample 1: Grade-A Wheat (Pass)',
      crop: 'गेहूँ (Wheat)',
      notes: 'अनाज को 2 दिन धूप में सुखाया गया है, दाना साफ है।',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sample_wheat_moist',
      labelHi: 'नमूना 2: उच्च नमी गेहूँ (सुखाने की जरूरत)',
      labelEn: 'Sample 2: High Moisture Wheat (Drying Needed)',
      crop: 'गेहूँ (Wheat)',
      notes: 'कल रात हल्की बारिश हुई थी, अनाज में नमी अधिक महसूस हो रही है।',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sample_chana',
      labelHi: 'नमूना 3: देसी चना (उत्तम दाना)',
      labelEn: 'Sample 3: Desi Chana (Fine husk)',
      crop: 'चना (Gram / Chana)',
      notes: 'बारीक छलनी से छना हुआ, दाना ठोस व सूखा है।',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sample_invalid',
      labelHi: '⚠️ टेस्ट: गलत तस्वीर (अमान्य जाँच)',
      labelEn: '⚠️ Test: Invalid Picture (Rejection Check)',
      crop: 'गेहूँ (Wheat)',
      notes: 'गलत तस्वीर (non-crop image) परीक्षण',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80', // Car photo
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysisResult(null);
        setHasRunCheck(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setSelectedCrop(preset.crop);
    setNotes(preset.notes);
    setImagePreview(preset.image);
    setAnalysisResult(null);
    setHasRunCheck(false);
  };

  const runAnalysis = async () => {
    if (!imagePreview) {
      alert(isHi ? 'कृपया पहले अनाज की तस्वीर अपलोड करें।' : 'Please upload a crop picture first.');
      return;
    }

    setIsLoading(true);
    setHasRunCheck(true);

    try {
      const res = await fetch('/api/ai/crop-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: selectedCrop,
          imageBase64: imagePreview,
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

  const isInvalidImage = analysisResult && (analysisResult.isValidCropImage === false || analysisResult.errorMessage);

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-[#1b4d3e] text-white rounded-3xl p-5 sm:p-7 shadow-sm border border-[#143e31] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#245e4b] text-[#88f0bc] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#3b7d67]">
              🌾 AnnDwar AI Vision 2.5
            </span>
            <span className="text-xs text-emerald-200">
              {isHi ? 'मंडी पूर्व गुणवत्ता जाँच' : 'Pre-Procurement Grain Quality'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {isHi ? '🌾 AI फसल पूर्व-जाँच (स्मार्ट गुणवत्ता विश्लेषक)' : '🌾 AI Pre-Crop Quality Check'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            {isHi
              ? 'मंडी जाने से पहले अपने अनाज की फोटो खींचकर जाँचें। AI तकनीक नमी (Moisture), विजातीय तत्व (Foreign Matter) और ग्रेड का वास्तविक विश्लेषण कर सटीक परामर्श देती है।'
              : 'Analyze your grain photo in real time before booking a mandi slot to ensure full MSP eligibility and eliminate rejection at the weighbridge.'}
          </p>
        </div>

        <button
          onClick={onNavigateToBooking}
          className="self-start md:self-center bg-white text-[#1b4d3e] hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>{isHi ? 'सीधे स्लॉट बुक करें' : 'Go to Slot Booking'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Upload & Controls on Left, Analysis Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Crop Configuration */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#d2dfd6] p-4 sm:p-5 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#143626] flex items-center gap-2 border-b border-[#e2ece5] pb-2.5">
              <Upload className="w-4 h-4 text-[#1b7e45]" />
              <span>{isHi ? '1. फसल चुनें व तस्वीर अपलोड करें' : '1. Select Crop & Upload Picture'}</span>
            </h3>

            {/* Crop Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#224433] mb-1.5">
                {isHi ? 'फसल का नाम (Crop Name):' : 'Crop Name:'}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  setAnalysisResult(null);
                }}
                className="w-full bg-[#f8faf8] border border-[#cfe0d5] text-xs font-semibold rounded-xl px-3 py-2.5 text-[#143626] focus:outline-none focus:border-[#1b7e45]"
              >
                {cropOptions.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Preview & Upload Box */}
            <div>
              <label className="block text-xs font-bold text-[#224433] mb-1.5">
                {isHi ? 'अनाज की तस्वीर (Grain Photo):' : 'Grain Photo:'}
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#b9d9c6] bg-black/5 aspect-video flex items-center justify-center group">
                  <img
                    src={imagePreview}
                    alt="Uploaded Crop"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="bg-white text-[#1b4d3e] text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center gap-1.5 shadow-md">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isHi ? 'बदलें' : 'Change'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setAnalysisResult(null);
                      }}
                      className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-red-700 shadow-md"
                    >
                      {isHi ? 'हटाएँ' : 'Remove'}
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#a3cbb5] hover:border-[#1b7e45] bg-[#f8faf8] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5ed] flex items-center justify-center text-[#1b7e45]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#1b4d3e]">
                    {isHi ? 'कैमरे से फोटो लें या फाइल चुनें' : 'Take Photo or Choose File'}
                  </span>
                  <span className="text-[11px] text-[#638072]">JPG, PNG या WEBP (अनाज की साफ तस्वीर)</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Quick Test Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#224433]">
                  {isHi ? 'तुरंत परीक्षण हेतु नमूने (Sample Presets):' : 'Quick Test Presets:'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`text-left p-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      preset.id === 'sample_invalid'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-900 hover:bg-amber-100'
                        : imagePreview === preset.image
                        ? 'bg-[#eaf5ef] border-[#1b7e45] text-[#143e2b]'
                        : 'bg-[#fcfdfc] border-[#d8e5dd] text-[#335544] hover:bg-[#f2f7f4]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 shrink-0 text-[#1b7e45]" />
                      <span className="truncate">{isHi ? preset.labelHi : preset.labelEn}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button: Run AI Analysis */}
            <button
              type="button"
              disabled={isLoading || !imagePreview}
              onClick={runAnalysis}
              className="w-full bg-[#1b7e45] hover:bg-[#156738] disabled:opacity-60 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isHi ? 'AI वास्तविक विश्लेषण कर रहा है...' : 'Analyzing Picture with AI Vision...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isHi ? 'चित्र का वास्तविक AI विश्लेषण करें' : 'Analyze Picture in Real-Time'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Results & Feedback */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#d2dfd6] p-10 text-center shadow-xs flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-[#e8f5ed] border-2 border-[#1b7e45] flex items-center justify-center text-[#1b7e45] mb-4 animate-bounce">
                <Sparkles className="w-8 h-8 text-[#1b7e45]" />
              </div>
              <h3 className="text-base font-bold text-[#143626]">
                {isHi ? 'चित्र का विश्लेषण जारी है...' : 'AI Vision Analysis in Progress...'}
              </h3>
              <p className="text-xs text-[#557867] max-w-sm mt-1">
                {isHi
                  ? 'अनाज की गुणवत्ता, नमी (Moisture %), विजातीय तत्व और फसल मिलान की जाँच की जा रही है।'
                  : 'Validating crop match, inspecting grain texture, moisture content, and purity.'}
              </p>
            </div>
          ) : isInvalidImage ? (
            /* =================================================================== */
            /* INVALID IMAGE REJECTION CARD (As requested: "Please upload correct picture") */
            /* =================================================================== */
            <div className="bg-[#fff8f6] border-2 border-[#fca5a5] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col items-center text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center text-red-600 mb-4">
                <XCircle className="w-9 h-9" />
              </div>

              <div className="inline-block bg-red-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                ⚠️ {analysisResult?.errorMessage || 'Please upload correct picture'}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-red-950 mt-1">
                {isHi ? 'कृपया सही फसल की तस्वीर अपलोड करें' : 'Please upload correct picture'}
              </h3>

              <p className="text-xs sm:text-sm text-red-800 font-medium max-w-md mt-2 leading-relaxed">
                {isHi
                  ? `अपलोड की गई तस्वीर चुने गए अनाज (${selectedCrop}) से मेल नहीं खाती है। कृपया किसी व्यक्ति, वाहन या अन्य वस्तु के स्थान पर अपने खेत/गोदाम के वास्तविक अनाज की साफ फोटो अपलोड करें।`
                  : `The uploaded picture does not match the selected crop (${selectedCrop}). Please upload a clear photo of your grain harvest instead of non-crop objects.`}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <label className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs flex items-center gap-2 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>{isHi ? 'सही अनाज की फोटो अपलोड करें' : 'Upload Correct Crop Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={() => handleApplyPreset(presets[0])}
                  className="bg-white border border-red-300 text-red-800 hover:bg-red-50 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  {isHi ? 'मानक गेहूँ नमूना आज़माएं' : 'Try Valid Wheat Sample'}
                </button>
              </div>
            </div>
          ) : analysisResult ? (
            /* =================================================================== */
            /* VALID CROP ANALYSIS REPORT                                          */
            /* =================================================================== */
            <div className="bg-white rounded-2xl border border-[#d2dfd6] p-5 sm:p-6 shadow-xs flex flex-col gap-4 animate-fadeIn">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b border-[#e5efe8] pb-3 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#e6f4ec] text-[#1b7e45] text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#bce2cc]">
                      ✓ {isHi ? 'सत्यापित अनाज नमूना' : 'Verified Grain Sample'}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#618070]">
                      #{analysisResult.id}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#113222] mt-1">
                    {analysisResult.cropType} • {isHi ? 'गुणवत्ता एवं पात्रता रिपोर्ट' : 'Quality Assessment'}
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

              {/* 3 Scientific Metric Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
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
                      ? (isHi ? 'मानक ≤ 12% (पास)' : 'Standard ≤ 12% (Pass)')
                      : (isHi ? 'धूप में सुखाएं' : 'Needs Sun Drying')}
                  </span>
                </div>

                {/* Foreign matter */}
                <div className="bg-[#f7faf8] border border-[#cfe2d6] rounded-xl p-3 text-center">
                  <span className="text-[10.5px] text-[#557766] block font-medium">
                    {isHi ? 'विजातीय तत्व (Chaff/Dust)' : 'Foreign Matter'}
                  </span>
                  <span className="text-xl font-black text-[#113222] mt-0.5 block">
                    {analysisResult.foreignMatterPercent}%
                  </span>
                  <span className="text-[9.5px] text-[#2c8352] font-semibold mt-0.5 block">
                    {isHi ? 'स्वीकार्य ≤ 0.75%' : 'Permissible ≤ 0.75%'}
                  </span>
                </div>

                {/* Rejection risk */}
                <div className="bg-[#f7faf8] border border-[#cfe2d6] rounded-xl p-3 text-center">
                  <span className="text-[10.5px] text-[#557766] block font-medium">
                    {isHi ? 'अस्वीकृति जोखिम' : 'Rejection Risk'}
                  </span>
                  <span className={`text-base font-black mt-1 block uppercase ${
                    analysisResult.rejectionRiskLevel === 'Low' ? 'text-[#1b7e45]' : 'text-[#c62828]'
                  }`}>
                    {isHi ? (analysisResult.rejectionRiskLevel === 'Low' ? 'सुरक्षित (Safe)' : 'मध्यम') : analysisResult.rejectionRiskLevel}
                  </span>
                  <span className="text-[9.5px] text-[#638072] mt-0.5 block">
                    {analysisResult.isMspEligible ? 'MSP पात्र' : 'जाँच आवश्यक'}
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
                    {isHi ? 'मौसम परामर्श व परिवहन चेतावनी (Weather Alert)' : 'Weather Advisory & Transit Forecast'}
                  </h4>
                  <p className="text-xs text-[#5c3717] mt-0.5 font-medium leading-relaxed">
                    {isHi ? analysisResult.weatherAlertHi : analysisResult.weatherAlertEn}
                  </p>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-[#143626] mb-2">
                  {isHi ? 'किसान के लिए उपयोगी सुझाव (Actionable Guidance):' : 'Actionable Guidance for Farmer:'}
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
                  {isHi ? 'फसल मानक के अनुकूल है! अभी स्लॉट बुक करें।' : 'Crop meets procurement standards!'}
                </div>
                <button
                  type="button"
                  onClick={onNavigateToBooking}
                  className="bg-[#1b7e45] hover:bg-[#156738] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>{isHi ? 'मंडी स्लॉट बुक करें' : 'Book Mandi Slot Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#d2dfd6] p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-full bg-[#f0f7f3] border border-[#c4ded0] flex items-center justify-center text-[#1b4d3e] mb-3">
                <Sparkles className="w-7 h-7 text-[#1b7e45]" />
              </div>
              <h3 className="text-base font-bold text-[#143626]">
                {isHi ? 'अनाज की तस्वीर चुनें व विश्लेषण करें' : 'Select Grain & Analyze'}
              </h3>
              <p className="text-xs text-[#5a7b6a] max-w-md mt-1 leading-relaxed">
                {isHi
                  ? 'बाएँ पैनल से अपनी फसल चुनें या तस्वीर अपलोड करें। AI तकनीक द्वारा वास्तविक समय में नमी, विजातीय तत्व व गुणवत्ता की जाँच होगी।'
                  : 'Select your grain from the left panel or choose one of the quick presets to test moisture, purity, and grade.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
