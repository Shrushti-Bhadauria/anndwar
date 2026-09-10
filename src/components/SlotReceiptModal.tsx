import React from 'react';
import { X, Printer, Download, QrCode, CheckCircle, Shield, Building2 } from 'lucide-react';
import { Language, MandiSlot, FarmerProfile } from '../types';

interface SlotReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  slot: MandiSlot | null;
  farmer: FarmerProfile | null;
}

export const SlotReceiptModal: React.FC<SlotReceiptModalProps> = ({
  isOpen,
  onClose,
  lang,
  slot,
  farmer,
}) => {
  if (!isOpen || !slot) return null;
  const isHi = lang === 'hi';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#cbdcd0] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:border-none print:shadow-none print:max-h-full">
        {/* Modal Toolbar (hidden in print) */}
        <div className="bg-[#1b4d3e] text-white p-3.5 px-5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#88f0bc]" />
            <span className="text-xs sm:text-sm font-bold">
              {isHi ? 'ई-टोकन प्रवेश पास (Official E-Receipt)' : 'Official E-Token Entry Pass'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="p-5 sm:p-7 overflow-y-auto print:p-0 space-y-4 text-[#143425]">
          {/* Government / Mandi Header */}
          <div className="text-center pb-3 border-b-2 border-[#1b4d3e]">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🌾</span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#1b4d3e]">
                अन्नद्वार • म.प्र. शासन ई-उपार्जन प्रणाली
              </h2>
            </div>
            <p className="text-xs text-[#4f6e5e] font-semibold">
              खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग • रबी विपणन सत्र 2025-26
            </p>
            <div className="inline-block bg-[#edf6f1] text-[#1b4d3e] text-[11px] font-bold px-3 py-0.5 rounded-full border border-[#c4ded0] mt-1.5">
              गेट प्रवेश ई-टोकन पर्ची (Mandi Yard Entry E-Token)
            </div>
          </div>

          {/* Token & QR Section */}
          <div className="flex items-center justify-between bg-[#f8faf8] border border-[#d2dfd6] rounded-xl p-3.5">
            <div>
              <span className="text-[10px] text-[#618070] font-semibold uppercase block">
                {isHi ? 'टोकन क्रमांक / TOKEN ID' : 'Token ID'}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#113222] tracking-wider">
                {slot.tokenNumber}
              </div>
              <span className="text-[11px] text-[#1b7e45] font-bold mt-0.5 block">
                ✓ ई-सत्यापित एवं अधिकृत (Active Verified)
              </span>
            </div>

            <div className="text-center bg-white p-2 border border-[#cbdcd0] rounded-lg shadow-2xs">
              <QrCode className="w-16 h-16 text-[#1b4d3e]" />
              <span className="text-[9px] font-mono text-[#618070] block mt-0.5">SCAN AT GATE</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#f9fbf9] p-2.5 rounded-lg border border-[#e2eae4]">
              <span className="text-[10px] text-[#638072] block font-medium">किसान का नाम:</span>
              <span className="font-bold text-[#143425] text-sm">{farmer?.nameHi || 'राम सिंह'}</span>
              <span className="text-[10px] text-[#557766] block mt-0.5">आधार: XXXX-XXXX-4192</span>
            </div>

            <div className="bg-[#f9fbf9] p-2.5 rounded-lg border border-[#e2eae4]">
              <span className="text-[10px] text-[#638072] block font-medium">आवंटित तिथि व समय:</span>
              <span className="font-bold text-[#143425] text-sm">{slot.date}</span>
              <span className="text-[10.5px] text-[#1b7e45] font-bold block mt-0.5">{slot.timeSlot}</span>
            </div>

            <div className="bg-[#f9fbf9] p-2.5 rounded-lg border border-[#e2eae4]">
              <span className="text-[10px] text-[#638072] block font-medium">उपार्जन केंद्र व गेट:</span>
              <span className="font-bold text-[#143425]">{slot.mandiCenterName}</span>
              <span className="text-[10px] text-[#557766] block mt-0.5">{slot.gateNumber}, {slot.laneNumber}</span>
            </div>

            <div className="bg-[#f9fbf9] p-2.5 rounded-lg border border-[#e2eae4]">
              <span className="text-[10px] text-[#638072] block font-medium">फसल एवं वाहन:</span>
              <span className="font-bold text-[#143425]">{slot.cropName} ({slot.quantityQuintal} क्विंटल)</span>
              <span className="text-[10.5px] font-mono font-bold text-[#183929] block mt-0.5">{slot.vehicleNumber}</span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-[#fbfcfb] border border-[#e0ece3] rounded-xl p-3 text-[11px] text-[#3c5e4d] space-y-1">
            <div className="font-bold text-[#183827] mb-1">
              महत्वपूर्ण दिशा-निर्देश (Important Instructions):
            </div>
            <p>१. कृपया आवंटित समय से 15 मिनट पूर्व (10:45 AM) गेट पर उपस्थित होना सुनिश्चित करें।</p>
            <p>२. फसल में नमी 12% से कम होनी चाहिए (AI Pre-Check रिपोर्ट साथ रखें)।</p>
            <p>३. वाहन पर तिरपाल अनिवार्य है। तौल उपरांत कंप्यूटर रसीद प्राप्त करें।</p>
            <p>४. भुगतान सीधे आधार लिंक्ड बैंक खाते (DBT) में 24-48 घंटों में अंतरित होगा।</p>
          </div>

          {/* Barcode line */}
          <div className="pt-2 text-center border-t border-[#e2eae4]">
            <div className="font-mono text-xl sm:text-2xl tracking-[0.25em] font-bold text-[#2a4d3b]">
              ||||| | |||| ||| |||||| |||| |||||
            </div>
            <span className="text-[9px] text-[#6b8b7a] block mt-0.5">
              E-UPARJAN TOKEN • ANNDWAR VERIFIED HASH #9821420
            </span>
          </div>
        </div>

        {/* Modal Footer (hidden in print) */}
        <div className="p-4 bg-[#f8faf8] border-t border-[#e3ece6] flex items-center justify-between print:hidden">
          <span className="text-xs text-[#527764]">
            {isHi ? 'हेल्पलाइन: 1800-180-1551' : 'Toll-Free: 1800-180-1551'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#1b4d3e] hover:bg-[#153f33] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'डाउनलोड / प्रिंट पर्ची' : 'Print Receipt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
