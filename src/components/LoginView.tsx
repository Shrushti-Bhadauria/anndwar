import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Globe, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Language, UserRole, AuthUser } from '../types';

interface LoginViewProps {
  lang: Language;
  onToggleLang: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  onOpenWhatsAppHelp?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  lang,
  onToggleLang,
  onLoginSuccess,
  onOpenWhatsAppHelp,
}) => {
  const isHi = lang === 'hi';
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [identifier, setIdentifier] = useState('MP-88210');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valid credential databases for simulation
  const validCredentials: Record<UserRole, {
    validIds: string[];
    validPins: string[];
    user: AuthUser;
  }> = {
    farmer: {
      validIds: ['MP-88210', '9826100001', 'ramsingh', 'kisan', '88210'],
      validPins: ['1234', 'kisan123', 'pass123'],
      user: {
        id: 'MP-88210',
        name: 'राम सिंह (Ram Singh)',
        role: 'farmer',
        phoneOrEmail: '9826100001',
        stationOrCenter: 'सांवेर उपार्जन केंद्र (गेट #02)',
      },
    },
    mandi_operator: {
      validIds: ['MND-OP-02', 'operator', 'operator@mandi.gov.in', 'mandi02'],
      validPins: ['mandi123', '1234', 'operator123'],
      user: {
        id: 'MND-OP-02',
        name: 'राजेश वर्मा (Rajesh Verma)',
        role: 'mandi_operator',
        phoneOrEmail: 'operator@mandi.gov.in',
        stationOrCenter: 'सांवेर उपार्जन केंद्र (गेट #02)',
      },
    },
    admin: {
      validIds: ['ADM-701', 'admin', 'admin@anndwar.gov.in', 'alok.ias'],
      validPins: ['admin123', '1234', 'secret123'],
      user: {
        id: 'ADM-701',
        name: 'डॉ. आलोक श्रीवास्तव (Dr. Alok Shrivastava, IAS)',
        role: 'admin',
        phoneOrEmail: 'admin@anndwar.gov.in',
        stationOrCenter: 'राज्य उपार्जन मुख्यालय, भोपाल',
      },
    },
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'farmer') {
      setIdentifier('MP-88210');
      setPassword('1234');
    } else if (role === 'mandi_operator') {
      setIdentifier('MND-OP-02');
      setPassword('mandi123');
    } else {
      setIdentifier('ADM-701');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const cred = validCredentials[selectedRole];
      const trimmedId = identifier.trim().toLowerCase();
      const trimmedPin = password.trim();

      const isIdValid = cred.validIds.some((id) => id.toLowerCase() === trimmedId);
      const isPinValid = cred.validPins.includes(trimmedPin);

      if (isIdValid && isPinValid) {
        onLoginSuccess(cred.user);
      } else {
        setErrorMessage(
          isHi
            ? '❌ गलत क्रेडेंशियल्स! कृपया सही आईडी और पासवर्ड दर्ज करें। (Incorrect credentials. Please verify your details.)'
            : '❌ Incorrect credentials! Please check your ID and password.'
        );
      }
      setIsSubmitting(false);
    }, 350);
  };

  const applyDemo = (role: UserRole, testInvalid: boolean = false) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (testInvalid) {
      setIdentifier('WRONG-ID-999');
      setPassword('0000');
      return;
    }
    if (role === 'farmer') {
      setIdentifier('MP-88210');
      setPassword('1234');
    } else if (role === 'mandi_operator') {
      setIdentifier('MND-OP-02');
      setPassword('mandi123');
    } else {
      setIdentifier('ADM-701');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-[#143425] flex flex-col font-sans selection:bg-[#1b7e45]/20">
      {/* Top Gov Header Bar */}
      <header className="bg-[#1b4d3e] text-white border-b border-[#143e31] sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm border border-[#c4dbcf] overflow-hidden flex-shrink-0">
              <img src="/logo.png" alt="अन्नद्वार" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  {isHi ? 'अन्नद्वार' : 'Anndwar'}
                </h1>
                <span className="text-[10px] font-bold bg-[#2a6b54] text-[#d4f3e3] px-1.5 py-0.5 rounded tracking-wider border border-[#3d856b]">
                  {isHi ? 'MSP e-उपार्जन पोर्टल' : 'MSP Procurement'}
                </span>
              </div>
              <p className="text-[10.5px] text-[#b8d6c8] leading-tight">
                {isHi ? 'खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग' : 'Dept. of Food, Civil Supplies & Consumer Protection'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* WhatsApp Floating Hint Button */}
            {onOpenWhatsAppHelp && (
              <button
                onClick={onOpenWhatsAppHelp}
                className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
                title={isHi ? 'व्हाट्सएप पर सहायता' : 'WhatsApp Assistance'}
              >
                <span>💬 {isHi ? 'व्हाट्सएप सहायता' : 'WhatsApp Help'}</span>
              </button>
            )}

            {/* Helpline */}
            <a
              href="tel:18001801551"
              className="hidden md:flex items-center gap-1.5 bg-[#255e4c] hover:bg-[#2c6e59] text-[#e8f5ef] text-xs px-3 py-1.5 rounded-full border border-[#3b7d67] transition-all"
            >
              <Phone className="w-3 h-3 text-[#91e0bd]" />
              <span className="font-semibold tracking-wide">1800-180-1551</span>
            </a>

            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 bg-[#255e4c] hover:bg-[#2c6e59] text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-[#3b7d67] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#91e0bd]" />
              <span>{isHi ? 'हिन्दी' : 'ENG'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          {/* Outer clean card */}
          <div className="bg-white rounded-3xl border border-[#d2dfd6] shadow-sm p-6 sm:p-8">
            {/* Title & Subtitle with Logo */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm border border-[#cfe0d5] flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="अन्नद्वार - किसान से देश तक" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#edf7f1] text-[#14532d] text-xs font-bold px-3 py-1 rounded-full border border-[#bce3cb] mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1b7e45]" />
                <span>{isHi ? 'सुरक्षित एकीकृत लॉगिन' : 'Secure Unified Access'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#143224] tracking-tight">
                {isHi ? 'पोर्टल में प्रवेश करें' : 'Sign in to Anndwar'}
              </h2>
              <p className="text-xs sm:text-sm text-[#547362] mt-1">
                {isHi
                  ? 'किसान से देश तक — अपनी भूमिका चुनें एवं संबंधित क्रेडेंशियल्स दर्ज करें'
                  : 'From Farmer to Nation — Select your authorized role and enter credentials'}
              </p>
            </div>

            {/* 3 Dedicated Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#f0f5f2] rounded-2xl border border-[#dce8e0] mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange('farmer')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'farmer'
                    ? 'bg-white text-[#1b4d3e] shadow-xs ring-1 ring-black/5'
                    : 'text-[#506e5e] hover:text-[#183626]'
                }`}
              >
                <User className="w-4 h-4 text-[#1b7e45]" />
                <span>{isHi ? 'किसान' : 'Farmer'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('mandi_operator')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'mandi_operator'
                    ? 'bg-white text-[#854d0e] shadow-xs ring-1 ring-amber-300'
                    : 'text-[#506e5e] hover:text-[#183626]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#b45309]" />
                <span>{isHi ? 'मंडी ऑपरेटर' : 'Operator'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-white text-[#1e40af] shadow-xs ring-1 ring-blue-300'
                    : 'text-[#506e5e] hover:text-[#183626]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                <span>{isHi ? 'प्रशासक' : 'Admin'}</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-start gap-2.5 animate-bounce-once shadow-2xs">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Role Header Info */}
            <div className="mb-5 p-3 rounded-xl bg-[#f9fbf9] border border-[#e2ede5] flex items-center justify-between text-xs">
              <span className="text-[#597867]">
                {selectedRole === 'farmer' && (isHi ? '🌾 किसान लॉगिन (ID या मोबाइल)' : '🌾 Farmer Login (Kisan ID / Phone)')}
                {selectedRole === 'mandi_operator' && (isHi ? '🏢 गेट ऑपरेटर टर्मिनल' : '🏢 Mandi Operator Terminal')}
                {selectedRole === 'admin' && (isHi ? '🛡️ राज्य मुख्यालय कमांड सेंटर' : '🛡️ State HQ Command Center')}
              </span>
              <span className="font-semibold text-[#1b7e45] bg-[#e6f4ec] px-2 py-0.5 rounded text-[11px]">
                {isHi ? 'प्रमाणन आवश्यक' : 'Auth Required'}
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#143425] mb-1.5">
                  {selectedRole === 'farmer' && (isHi ? 'किसान आईडी अथवा पंजीकृत मोबाइल सं.' : 'Kisan ID or Registered Mobile')}
                  {selectedRole === 'mandi_operator' && (isHi ? 'ऑपरेटर यूज़र आईडी' : 'Operator User ID')}
                  {selectedRole === 'admin' && (isHi ? 'अधिकारी ईमेल अथवा आईडी' : 'Official Email or ID')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={
                      selectedRole === 'farmer'
                        ? 'उदा: MP-88210 या 9826100001'
                        : selectedRole === 'mandi_operator'
                        ? 'उदा: MND-OP-02'
                        : 'उदा: ADM-701'
                    }
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-semibold transition-all bg-white text-gray-900 focus:outline-none ${
                      errorMessage
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-[#cfe0d5] focus:border-[#1b7e45] focus:ring-2 focus:ring-[#1b7e45]/15'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#143425]">
                    {selectedRole === 'farmer' ? (isHi ? '4-अंकीय सुरक्षा पिन' : '4-Digit Security PIN') : (isHi ? 'पासवर्ड' : 'Password')}
                  </label>
                  <span className="text-[11px] text-[#2c7a4b] hover:underline cursor-pointer">
                    {isHi ? 'सहायता चाहिए?' : 'Need Help?'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm font-semibold transition-all bg-white text-gray-900 focus:outline-none ${
                      errorMessage
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-[#cfe0d5] focus:border-[#1b7e45] focus:ring-2 focus:ring-[#1b7e45]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#1b4d3e] hover:bg-[#143d31] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>{isHi ? 'सत्यापित किया जा रहा है...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <span>{isHi ? 'प्रवेश करें (Login)' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 text-[#88f0bc]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-5 border-t border-[#e5efe8]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-[#446654] uppercase tracking-wider">
                  {isHi ? '⚡ त्वरित परीक्षण डेमो (1-Click Test):' : '⚡ 1-Click Quick Testing:'}
                </span>
                <span className="text-[10px] text-gray-400">Auto-fill</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyDemo('farmer')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#eaf5ef] hover:bg-[#d8eedf] text-[#14532d] text-xs font-semibold text-center border border-[#b8dec6] transition-colors cursor-pointer"
                >
                  🌾 किसान (Ram Singh)
                </button>
                <button
                  type="button"
                  onClick={() => applyDemo('mandi_operator')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#fef9c3] hover:bg-[#fef08a] text-[#854d0e] text-xs font-semibold text-center border border-[#fde047] transition-colors cursor-pointer"
                >
                  🏢 ऑपरेटर (MND-02)
                </button>
                <button
                  type="button"
                  onClick={() => applyDemo('admin')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#1e40af] text-xs font-semibold text-center border border-[#bfdbfe] transition-colors cursor-pointer"
                >
                  🛡️ एडमिन (HQ Bhopal)
                </button>
                <button
                  type="button"
                  onClick={() => applyDemo('farmer', true)}
                  className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold text-center border border-red-200 transition-colors cursor-pointer"
                  title="गलत विवरण डालकर वेरिफिकेशन एरर जांचें"
                >
                  ❌ गलत क्रेडेंशियल
                </button>
              </div>
            </div>

            {/* WhatsApp Alternative Assistant Box */}
            <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#e7f7ed] to-[#f2fbf5] border border-[#a8e2be] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  💬
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#14472c]">
                    {isHi ? 'वेबसाइट चलाना नहीं आता? कोई बात नहीं!' : 'Difficult to use website?'}
                  </h4>
                  <p className="text-[11px] text-[#33684a]">
                    {isHi ? 'व्हाट्सएप से रजिस्ट्रेशन व लाइव कतार जांचें' : 'Use WhatsApp for registration & queue check'}
                  </p>
                </div>
              </div>

              {onOpenWhatsAppHelp && (
                <button
                  type="button"
                  onClick={onOpenWhatsAppHelp}
                  className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex-shrink-0"
                >
                  {isHi ? 'सहायक खोलें' : 'Open Bot'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-[#638472] border-t border-[#e2eee5] bg-white">
        {isHi ? 'अन्नद्वार खाद्यान्न उपार्जन पोर्टल • राष्ट्रीय सूचना विज्ञान केंद्र (NIC) एवं राज्य शासन' : 'Anndwar Grain Procurement Portal • NIC & State Government'}
      </footer>
    </div>
  );
};
