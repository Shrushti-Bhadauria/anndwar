import React from 'react';
import { 
  User, 
  CheckCircle, 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  FileText, 
  CreditCard, 
  Sparkles, 
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';

interface SidebarProps {
  lang: Language;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  farmer: FarmerProfile | null;
  onOpenDocuments: () => void;
  onOpenPayments: () => void;
  activeDbtTab?: string;
  onSelectDbtTab?: (tab: 'status' | 'history' | 'calculator' | 'support') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  currentTab,
  onSelectTab,
  farmer,
  onOpenDocuments,
  onOpenPayments,
  activeDbtTab = 'status',
  onSelectDbtTab,
}) => {
  const isHi = lang === 'hi';

  const dbtSubFeatures = [
    { id: 'status', labelHi: '⚡ लाइव PFMS स्थिति', labelEn: '⚡ Live Status', badge: 'चरण 5' },
    { id: 'history', labelHi: '📜 भुगतान पासबुक', labelEn: '📜 Passbook', badge: '4 लॉट' },
    { id: 'calculator', labelHi: '🧮 डीबीटी अनुमानक', labelEn: '🧮 Calculator', badge: 'MSP' },
    { id: 'support', labelHi: '🛡️ आधार सीडिंग सहायता', labelEn: '🛡️ Seeding & Help', badge: 'NPCI' },
  ];

  const menuItems = [
    {
      id: 'farmer_home',
      labelHi: 'मुख्य किसान पोर्टल',
      labelEn: 'Main Farmer Portal',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'live_queue',
      labelHi: 'लाइव कतार ट्रैकर',
      labelEn: 'Live Queue Tracker',
      icon: Clock,
      badge: isHi ? 'लाइव' : 'LIVE',
      badgeColor: 'bg-[#e2f7eb] text-[#137333] border border-[#a4e2bd]',
    },
    {
      id: 'slot_booking',
      labelHi: 'मंडी स्लॉट बुकिंग',
      labelEn: 'Mandi Slot Booking',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'crop_check',
      labelHi: '🤖 AI फसल पूर्व-जांच',
      labelEn: '🤖 AI Crop Pre-Check',
      icon: Sparkles,
      badge: isHi ? 'स्मार्ट' : 'AI',
      badgeColor: 'bg-[#eef3fe] text-[#1967d2] border border-[#b8d2fb]',
    },
    {
      id: 'receipts',
      labelHi: 'तोल पर्ची व पावती',
      labelEn: 'Weighment Slip & Receipt',
      icon: FileText,
      badge: null,
      action: 'open_receipts',
    },
    {
      id: 'payments',
      labelHi: 'DBT भुगतान स्थिति',
      labelEn: 'DBT Payment Status',
      icon: CreditCard,
      badge: isHi ? '₹1.08L देय' : '₹1.08L Due',
      badgeColor: 'bg-[#fff8e1] text-[#b45309] border border-[#ffe082]',
      action: 'open_payments',
      hasSubmenu: true,
    },
    {
      id: 'documents',
      labelHi: 'दस्तावेज व चेकलिस्ट',
      labelEn: 'Document Checklist',
      icon: ShieldCheck,
      badge: '4/4',
      badgeColor: 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]',
      action: 'open_docs',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#f8faf8] border-r border-[#e0e9e2] p-3 sm:p-4 flex flex-col gap-4">
      {/* Farmer Profile Card (Exact match to screenshot 6 top left box) */}
      <div className="bg-white rounded-xl p-3 border border-[#d9e5dc] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#edf5ef] border border-[#b8d6c0] flex items-center justify-center text-[#1b4d3e]">
            <User className="w-4 h-4 text-[#1b4d3e]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-[#183525]">
                {isHi ? (farmer?.nameHi || 'राम सिंह') : (farmer?.nameEn || 'Ram Singh')}
              </span>
              <CheckCircle className="w-3.5 h-3.5 text-[#1b7e45] fill-[#1b7e45]/20" />
            </div>
            <p className="text-[11px] text-[#5f7a6b] leading-tight">
              {isHi ? 'प्रमाणित किसान (सांवेर)' : 'Verified Farmer (Sanwer)'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Items (Matching screenshot 6 menu) */}
      <nav className="flex flex-col gap-1.5" aria-label="Sidebar Menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <div key={item.id} className="flex flex-col">
              <button
                onClick={() => {
                  if (item.action === 'open_docs') {
                    onOpenDocuments();
                  } else if (item.id === 'payments' || item.action === 'open_payments') {
                    onSelectTab('payments');
                  } else if (item.action === 'open_receipts') {
                    onSelectTab('slot_booking');
                  } else {
                    onSelectTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1b4d3e] text-white shadow-xs font-semibold'
                    : 'text-[#2a4537] hover:bg-[#eaf1ec] hover:text-[#183525]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#a2ecc2]' : 'text-[#476e58]'}`} />
                  <span>{isHi ? item.labelHi : item.labelEn}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-[#296853] text-[#d4f6e3]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Sub-features under DBT option on left navbar */}
              {item.id === 'payments' && (
                <div className="ml-4 pl-2.5 border-l-2 border-[#b8d6c0] my-1 space-y-0.5">
                  {dbtSubFeatures.map((sub) => {
                    const isSubActive = currentTab === 'payments' && activeDbtTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          onSelectTab('payments');
                          onSelectDbtTab?.(sub.id as any);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left cursor-pointer ${
                          isSubActive
                            ? 'bg-[#e2efe7] text-[#1b4d3e] font-bold shadow-2xs'
                            : 'text-[#395646] hover:bg-[#ebf3ee] hover:text-[#183525]'
                        }`}
                      >
                        <span className="truncate">{isHi ? sub.labelHi : sub.labelEn}</span>
                        <span className="text-[9px] bg-white border border-[#c4dbcf] text-[#2c5b46] px-1 py-0.2 rounded font-bold">
                          {sub.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Local Mandi Assistance Note */}
      <div className="mt-auto pt-3 border-t border-[#e2ece4]">
        <div className="bg-[#eff6f1] rounded-xl p-2.5 border border-[#d2e4d6] text-[11px] text-[#335643]">
          <div className="flex items-center gap-1.5 font-semibold text-[#184632] mb-1">
            <Building2 className="w-3.5 h-3.5 text-[#1e583e]" />
            <span>{isHi ? 'सक्रिय उपार्जन केंद्र' : 'Active Centre'}</span>
          </div>
          <p className="text-[10.5px] leading-snug">
            {isHi ? 'सांवेर उपार्जन केंद्र (गेट क्र. 02)' : 'Sanwer Centre (Gate #02)'}
          </p>
          <p className="text-[10px] text-[#558268] mt-0.5">
            {isHi ? 'नमी जांच दल उपस्थित • 4 कांटे कार्यरत' : 'Moisture Team Onsite • 4 Scales Live'}
          </p>
        </div>
      </div>
    </aside>
  );
};
