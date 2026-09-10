import React from 'react';
import { 
  Phone, 
  Globe, 
  Building2, 
  LayoutDashboard, 
  BarChart3, 
  Truck, 
  Database,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currentView: string;
  onSelectView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  currentView,
  onSelectView,
}) => {
  const isHi = lang === 'hi';

  const isFarmerActive =
    currentView.startsWith('farmer_') ||
    ['live_queue', 'slot_booking', 'crop_check', 'payments', 'documents'].includes(currentView);

  const isMandiActive = currentView === 'mandi_terminal';
  const isAdminActive = currentView === 'admin_centre';

  // Primary 3 Portals requested prominently on Top Navbar
  const primaryPortals = [
    {
      id: 'farmer_home',
      labelHi: 'किसान पोर्टल',
      labelEn: 'Farmer Portal',
      tagHi: 'अन्नदाता',
      tagEn: 'Farmer',
      icon: LayoutDashboard,
      isActive: isFarmerActive,
      badge: isFarmerActive ? (isHi ? 'सक्रिय' : 'Active') : null,
      activeClass: 'bg-white text-[#1b4d3e] shadow-sm ring-1 ring-black/10 font-bold',
      inactiveClass: 'text-[#e1f3ea] hover:bg-[#153f33] hover:text-white',
    },
    {
      id: 'mandi_terminal',
      labelHi: 'मंडी ऑपरेटर',
      labelEn: 'Mandi Operator',
      tagHi: 'टर्मिनल',
      tagEn: 'Terminal',
      icon: Building2,
      isActive: isMandiActive,
      badge: isHi ? 'लाइव गेट' : 'Live Gate',
      badgeColor: 'bg-amber-400/20 text-amber-200 border border-amber-400/40',
      activeClass: 'bg-[#fffae6] text-[#854d0e] shadow-sm ring-2 ring-amber-400 font-bold',
      inactiveClass: 'text-[#fae8b4] hover:bg-[#1f4a3c] hover:text-white',
    },
    {
      id: 'admin_centre',
      labelHi: 'एडमिन पोर्टल',
      labelEn: 'Admin Portal',
      tagHi: 'कमांड सेंटर',
      tagEn: 'HQ Center',
      icon: BarChart3,
      isActive: isAdminActive,
      badge: isHi ? 'कंट्रोल रूम' : 'HQ Live',
      badgeColor: 'bg-blue-400/20 text-blue-200 border border-blue-400/40',
      activeClass: 'bg-[#eff6ff] text-[#1e40af] shadow-sm ring-2 ring-blue-400 font-bold',
      inactiveClass: 'text-[#bfdbfe] hover:bg-[#1a4437] hover:text-white',
    },
  ];

  // Secondary Tools / Utilities
  const secondaryTabs = [
    {
      id: 'logistics_godown',
      labelHi: 'गोदाम',
      labelEn: 'Godown',
      icon: Truck,
      isActive: currentView === 'logistics_godown',
    },
    {
      id: 'mongo_compass',
      labelHi: 'Compass',
      labelEn: 'Compass',
      icon: Database,
      isActive: currentView === 'mongo_compass',
    },
  ];

  return (
    <header className="bg-[#1b4d3e] text-white border-b border-[#143e31] sticky top-0 z-40 shadow-md">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onSelectView('farmer_home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
          title={isHi ? 'मुख्य किसान पोर्टल पर जाएं' : 'Go to Farmer Portal'}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 flex items-center justify-center p-1 shadow-inner border border-[#c4dbcf] transition-transform group-hover:scale-105">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f8faf7] border border-[#2a6b54] flex items-center justify-center text-[#1b4d3e]">
              <span className="text-lg sm:text-xl leading-none font-bold">🌾</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                {isHi ? 'अन्नद्वार' : 'Anndwar'}
              </h1>
              <span className="text-[10px] font-bold bg-[#2a6b54] text-[#d4f3e3] px-1.5 py-0.5 rounded tracking-wider border border-[#3d856b]">
                MSP e-उपार्जन
              </span>
            </div>
            <p className="text-[10.5px] text-[#b8d6c8] hidden md:block leading-none mt-0.5">
              {isHi ? 'खाद्यान्न उपार्जन, तौल एवं पारदर्शी लॉजिस्टिक्स' : 'Grain Procurement & Transparent Logistics'}
            </p>
          </div>
        </div>

        {/* Primary 3 Roles Switcher (Prominent Center/Main Navigation) */}
        <div className="flex items-center gap-1.5 bg-[#143e31]/80 p-1 rounded-2xl border border-[#235846] shadow-inner">
          {primaryPortals.map((portal) => {
            const Icon = portal.icon;
            return (
              <button
                key={portal.id}
                onClick={() => onSelectView(portal.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs transition-all cursor-pointer select-none ${
                  portal.isActive ? portal.activeClass : portal.inactiveClass
                }`}
                title={isHi ? `${portal.labelHi} खोलें` : `Open ${portal.labelEn}`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <div className="flex items-baseline gap-1">
                  <span className="font-bold">{isHi ? portal.labelHi : portal.labelEn}</span>
                  {portal.tagHi && (
                    <span className="hidden xl:inline text-[9.5px] opacity-75 font-normal">
                      ({isHi ? portal.tagHi : portal.tagEn})
                    </span>
                  )}
                </div>

                {portal.badge && (
                  <span
                    className={`hidden sm:inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      portal.badgeColor || 'bg-[#1b4d3e]/15 text-[#1b4d3e]'
                    }`}
                  >
                    {portal.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Section: Secondary Tabs + Helpline + Language */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Secondary Views (Logistics & Godown, Compass) */}
          <div className="hidden lg:flex items-center gap-1 border-r border-[#2d6c55] pr-2">
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectView(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    tab.isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-[#c6e4d6] hover:bg-[#153f33] hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3 text-[#9ee7c5]" />
                  <span>{isHi ? tab.labelHi : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Toll Free Helpline */}
          <a
            href="tel:18001801551"
            className="hidden xl:flex items-center gap-1.5 bg-[#255e4c] hover:bg-[#2c6e59] text-[#e8f5ef] text-xs px-3 py-1.5 rounded-full border border-[#3b7d67] transition-all"
            title={isHi ? 'टोल-फ्री किसान हेल्पलाइन' : 'Toll-Free Helpline'}
          >
            <Phone className="w-3 h-3 text-[#91e0bd]" />
            <span className="font-semibold tracking-wide">1800-180-1551</span>
          </a>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 bg-[#255e4c] hover:bg-[#2c6e59] text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border border-[#3b7d67] transition-all cursor-pointer"
            title="भाषा बदलें / Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#91e0bd]" />
            <span>{isHi ? 'हिन्दी' : 'ENG'}</span>
          </button>
        </div>
      </div>

      {/* Quick Mobile Bar for Secondary views if on small screens */}
      <div className="flex lg:hidden items-center justify-between px-3 py-1 bg-[#153f33] border-t border-[#1a4d3f] text-[11px] text-[#c2dfd1]">
        <div className="flex items-center gap-2">
          <span>{isHi ? 'अतिरिक्त मॉड्यूल:' : 'Modules:'}</span>
          <button
            onClick={() => onSelectView('logistics_godown')}
            className={`px-2 py-0.5 rounded cursor-pointer ${currentView === 'logistics_godown' ? 'bg-white text-[#1b4d3e] font-bold' : 'hover:text-white'}`}
          >
            🚛 {isHi ? 'लॉजिस्टिक्स व गोदाम' : 'Logistics'}
          </button>
          <button
            onClick={() => onSelectView('mongo_compass')}
            className={`px-2 py-0.5 rounded cursor-pointer ${currentView === 'mongo_compass' ? 'bg-white text-[#1b4d3e] font-bold' : 'hover:text-white'}`}
          >
            🍃 {isHi ? 'कम्पास डेटा' : 'Compass'}
          </button>
        </div>
        <div className="text-[10px] text-[#86c4a8]">
          {isMandiActive ? (isHi ? 'मंडी मोड' : 'Operator Mode') : isAdminActive ? (isHi ? 'एडमिन मोड' : 'Admin Mode') : (isHi ? 'किसान पोर्टल' : 'Farmer Portal')}
        </div>
      </div>
    </header>
  );
};
