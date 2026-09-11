import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  X, 
  Volume2, 
  Mic, 
  CheckCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Tractor, 
  Banknote, 
  ExternalLink, 
  Sparkles,
  PhoneCall,
  RotateCcw
} from 'lucide-react';
import { Language, MandiSlot } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  options?: Array<{ label: string; action: string; value?: string }>;
  slotDetails?: Partial<MandiSlot>;
}

interface KisanWhatsAppBotProps {
  lang: Language;
  activeSlot: MandiSlot | null;
  onSlotBooked?: (slot: MandiSlot) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const KisanWhatsAppBot: React.FC<KisanWhatsAppBotProps> = ({
  lang,
  activeSlot,
  onSlotBooked,
  isOpen,
  onClose,
}) => {
  const isHi = lang === 'hi';
  const [inputVal, setInputVal] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bookingStep, setBookingStep] = useState<number | null>(null);
  const [tempBooking, setTempBooking] = useState<{
    crop: string;
    quintal: number;
    center: string;
    time: string;
    vehicle: string;
  }>({
    crop: 'शरबती गेहूँ',
    quintal: 45,
    center: 'सांवेर उपार्जन केंद्र',
    time: '11:00 AM – 12:30 PM',
    vehicle: 'MP 09 GH 4412',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    {
      id: 'm1',
      sender: 'bot',
      text: isHi
        ? '🌾 **राम-राम किसान भाई!** मैं अन्नद्वार का व्हाट्सएप सहायक हूँ। यदि आपको वेबसाइट चलाना कठिन लगता है, तो आप यहाँ सीधे चैट में अपना काम कर सकते हैं:'
        : '🌾 **Welcome Farmer Brother!** I am your Anndwar WhatsApp Sahayak. If using the website is difficult, you can do everything right here in chat:',
      time: 'अभी',
      options: [
        { label: '📋 नया स्लॉट बुक / रजिस्ट्रेशन', action: 'book_slot' },
        { label: '⏳ लाइव टोकन व कतार स्थिति', action: 'check_queue' },
        { label: '💰 DBT भुगतान व MSP दरें', action: 'check_payment' },
        { label: '🧪 फसल गुणवत्ता (नमी) जांच', action: 'check_crop' },
        { label: '📞 हेल्पलाइन से बात करें', action: 'call_helpline' },
      ],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Text to speech for illiterate farmers
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = isHi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const addBotMessage = (text: string, options?: Message['options'], slotDetails?: Partial<MandiSlot>) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options,
      slotDetails,
    };
    setMessages((prev) => [...prev, newMsg]);
    // Optional auto-read for farmer accessibility
    // speakText(text);
  };

  const handleUserSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Process input
    setTimeout(() => {
      processCommand(text.toLowerCase());
    }, 400);
  };

  const handleOptionClick = (option: { label: string; action: string; value?: string }) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: option.label,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      if (option.action === 'book_slot') {
        startBookingFlow();
      } else if (option.action === 'select_crop') {
        setTempBooking((prev) => ({ ...prev, crop: option.value || 'शरबती गेहूँ' }));
        addBotMessage(
          isHi
            ? `✅ फसल चुनी गई: **${option.value}**\nकृपया उपार्जन केंद्र चुनें:`
            : `✅ Selected crop: **${option.value}**\nPlease select Mandi Center:`,
          [
            { label: '🏛️ सांवेer उपार्जन केंद्र', action: 'select_center', value: 'सांवेर उपार्जन केंद्र' },
            { label: '🏛️ हातोद केंद्र', action: 'select_center', value: 'हातोद केंद्र' },
            { label: '🏛️ देपालपुर मंडी', action: 'select_center', value: 'देपालपुर मंडी' },
          ]
        );
      } else if (option.action === 'select_center') {
        setTempBooking((prev) => ({ ...prev, center: option.value || 'सांवेर उपार्जन केंद्र' }));
        addBotMessage(
          isHi
            ? `🏛️ केंद्र चुना गया: **${option.value}**\nसुविधाजनक समय स्लॉट चुनें:`
            : `🏛️ Selected Center: **${option.value}**\nPlease pick time slot:`,
          [
            { label: '⏰ सुबह 09:00 - 10:30 AM', action: 'select_time', value: '09:00 AM – 10:30 AM' },
            { label: '⏰ दोपहर 11:00 AM - 12:30 PM (अनुशंसित)', action: 'select_time', value: '11:00 AM – 12:30 PM' },
            { label: '⏰ दोपहर 02:00 - 03:30 PM', action: 'select_time', value: '02:00 PM – 03:30 PM' },
          ]
        );
      } else if (option.action === 'select_time') {
        const chosenTime = option.value || '11:00 AM – 12:30 PM';
        finalizeBooking(chosenTime);
      } else if (option.action === 'check_queue') {
        showQueueStatus();
      } else if (option.action === 'check_payment') {
        showPaymentStatus();
      } else if (option.action === 'check_crop') {
        showCropPreCheckGuidance();
      } else if (option.action === 'call_helpline') {
        addBotMessage(
          isHi
            ? '📞 **अन्नद्वार किसान टोल-फ्री हेल्पलाइन:**\n\n**1800-180-1551** (सुबह 7 से शाम 9 बजे)\n\nअथवा नीचे दिए गए बटन से सीधे कॉल करें या व्हाट्सएप पर चैट करें।'
            : '📞 **Anndwar Toll-Free Helpline:**\n\n**1800-180-1551**\n\nYou can dial directly or open official WhatsApp below.',
          [
            { label: '📲 असली व्हाट्सएप पर खोलें', action: 'open_real_whatsapp' },
            { label: 'मुख्य मेनू पर लौटें', action: 'main_menu' },
          ]
        );
      } else if (option.action === 'open_real_whatsapp') {
        window.open(
          'https://wa.me/9118001801551?text=Namaste%20Anndwar%20Sahayak,%20mujhe%20mandi%20slot%20aur%20queue%20ki%20jankari%20chahiye',
          '_blank'
        );
      } else if (option.action === 'main_menu') {
        addBotMessage(
          isHi ? 'मुख्य मेनू से विकल्प चुनें:' : 'Please choose an option from main menu:',
          initialMessages[0].options
        );
      }
    }, 350);
  };

  const startBookingFlow = () => {
    addBotMessage(
      isHi
        ? '📋 **नया स्लॉट बुकिंग (WhatsApp रजिस्ट्रेशन):**\nकृपया जिस फसल को बेचना चाहते हैं, उसे चुनें:'
        : '📋 **New Mandi Slot Booking:**\nPlease select the crop to sell:',
      [
        { label: '🌾 शरबती गेहूँ (MSP ₹2,400)', action: 'select_crop', value: 'शरबती गेहूँ' },
        { label: '🌱 देसी चना (MSP ₹5,440)', action: 'select_crop', value: 'देसी चना' },
        { label: '🌼 पीली सरसों (MSP ₹5,650)', action: 'select_crop', value: 'पीली सरसों' },
      ]
    );
  };

  const finalizeBooking = (time: string) => {
    const newToken = `MP-2025-${Math.floor(88000 + Math.random() * 999)}`;
    const newSlot: MandiSlot = {
      id: 'slot_' + Date.now(),
      tokenNumber: newToken,
      farmerId: 'MP-88210',
      farmerName: 'राम सिंह',
      date: '24 अक्टूबर 2025',
      timeSlot: time,
      gateArrivalExpected: time.split('–')[0].trim(),
      mandiCenterName: tempBooking.center,
      gateNumber: 'गेट क्र. 02',
      laneNumber: 'ट्रॉली लेन #01',
      cropName: tempBooking.crop,
      cropGrade: 'Grade-A (FAQ)',
      quantityQuintal: tempBooking.quintal,
      mspRatePerQuintal: tempBooking.crop.includes('चना') ? 5440 : 2400,
      totalEstimatedValue: (tempBooking.crop.includes('चना') ? 5440 : 2400) * tempBooking.quintal,
      vehicleNumber: tempBooking.vehicle,
      vehicleType: 'ट्रैक्टर ट्रॉली',
      status: 'confirmed',
      bookingTimestamp: new Date().toISOString(),
      qrCodeData: `ANNDWAR:${newToken}:MP-88210:45Q`,
    };

    onSlotBooked?.(newSlot);

    addBotMessage(
      isHi
        ? `🎉 **बधाई हो राम सिंह जी! आपका स्लॉट व्हाट्सएप से सफलतापूर्वक बुक हो गया है!**\n\n` +
          `• **टोकन सं:** \`${newToken}\`\n` +
          `• **फसल:** ${newSlot.cropName} (45 क्विंटल)\n` +
          `• **केंद्र:** ${newSlot.mandiCenterName} (${newSlot.gateNumber})\n` +
          `• **समय:** ${newSlot.timeSlot}\n` +
          `• **अनुमानित भुगतान:** ₹${newSlot.totalEstimatedValue.toLocaleString('en-IN')}\n\n` +
          `यह विवरण वेबसाइट और मंडी गेट पर तुरंत लाइव अपडेट हो चुका है।`
        : `🎉 **Slot Confirmed via WhatsApp!**\n\nToken: \`${newToken}\`\nTime: ${newSlot.timeSlot}\nMandi: ${newSlot.mandiCenterName}`,
      [
        { label: '⏳ इस टोकन की लाइव कतार देखें', action: 'check_queue' },
        { label: 'मुख्य मेनू पर लौटें', action: 'main_menu' },
      ],
      newSlot
    );
  };

  const showQueueStatus = () => {
    const token = activeSlot?.tokenNumber || 'MP-2409';
    addBotMessage(
      isHi
        ? `⏳ **लाइव कतार रिपोर्ट:**\n\n` +
          `• आपका टोकन: **#${token}**\n` +
          `• आपकी स्थिति: **14वें नंबर पर**\n` +
          `• आपके आगे कुल: **13 वाहन**\n` +
          `• अनुमानित प्रतीक्षा: **~35 मिनट**\n` +
          `• वर्तमान चरण: **गुणवत्ता परीक्षण (Moisture Lab)**\n` +
          `• निर्देश: कृपया वे-ब्रिज लेन #02 के समीप रहें।`
        : `⏳ **Live Queue Status:**\nToken: #${token}\nPosition: 14th (13 ahead)\nEst. Wait: ~35 mins.`,
      [
        { label: '📋 नया स्लॉट बुक करें', action: 'book_slot' },
        { label: '💰 भुगतान स्थिति देखें', action: 'check_payment' },
        { label: 'मुख्य मेनू', action: 'main_menu' },
      ]
    );
  };

  const showPaymentStatus = () => {
    addBotMessage(
      isHi
        ? `💰 **DBT भुगतान एवं MSP दर स्थिति:**\n\n` +
          `• **शरबती गेहूँ MSP:** ₹2,400 / क्विंटल (₹2,275 + ₹125 बोनस)\n` +
          `• **देसी चना MSP:** ₹5,440 / क्विंटल\n` +
          `• **अनुमानित कुल देय:** ₹1,08,000\n` +
          `• **बैंक खाता:** SBI (खाता: ****8812 - आधार व NPCI लिंक सत्यापित ✓)\n` +
          `• **PFMS स्थिति:** उपार्जन के 48-72 घंटे में सीधे खाते में हस्तांतरित।`
        : `💰 **DBT & MSP Rate:**\nWheat MSP: ₹2,400/Qt\nTotal: ₹1,08,000 directly via PFMS to Aadhaar seeded bank.`,
      [
        { label: '⏳ लाइव कतार जांचें', action: 'check_queue' },
        { label: 'मुख्य मेनू', action: 'main_menu' },
      ]
    );
  };

  const showCropPreCheckGuidance = () => {
    addBotMessage(
      isHi
        ? `🧪 **AI फसल पूर्व-जांच सलाह:**\n\n` +
          `1. मंडी जाने से पहले गेहूँ में नमी **12% से कम** होनी चाहिए।\n` +
          `2. यदि नमी 12% से अधिक है तो 1 दिन धूप में तिरपाल पर सुखाएं।\n` +
          `3. कंकड़-मिट्टी और छलनी से कचरा अलग कर लें ताकि ग्रेड-A का पूरा मूल्य मिले।\n\n` +
          `क्या आप AI द्वारा फोटो से नमी जांचना चाहते हैं?`
        : `🧪 **Crop Quality Advice:** Keep moisture under 12% before bringing to Mandi to avoid rejection.`,
      [
        { label: '📋 स्लॉट बुक करें', action: 'book_slot' },
        { label: 'मुख्य मेनू', action: 'main_menu' },
      ]
    );
  };

  const processCommand = (query: string) => {
    if (query.includes('slot') || query.includes('book') || query.includes('स्लॉट') || query.includes('बुक') || query.includes('रजिस्ट्रेशन')) {
      startBookingFlow();
    } else if (query.includes('queue') || query.includes('कतार') || query.includes('नंबर') || query.includes('token') || query.includes('टोकन')) {
      showQueueStatus();
    } else if (query.includes('paisa') || query.includes('rupaye') || query.includes('dbt') || query.includes('भुगतान') || query.includes('msp') || query.includes('रेट')) {
      showPaymentStatus();
    } else if (query.includes('crop') || query.includes('moisture') || query.includes('गेहूं') || query.includes('गुणवत्ता') || query.includes('नमी')) {
      showCropPreCheckGuidance();
    } else if (query.includes('help') || query.includes('call') || query.includes('फोन') || query.includes('मदद')) {
      addBotMessage(
        isHi
          ? '📞 **हेल्पलाइन नंबर:** 1800-180-1551\nआप किसी भी समय कॉल कर सकते हैं।'
          : '📞 Helpline: 1800-180-1551',
        initialMessages[0].options
      );
    } else {
      addBotMessage(
        isHi
          ? `मैंने आपका संदेश नोट कर लिया है: "${query}"। आप नीचे दिए गए मुख्य विकल्पों से त्वरित कार्यवाही कर सकते हैं:`
          : `I received your message. Please select an option:`,
        initialMessages[0].options
      );
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group">
        {/* Friendly speech bubble */}
        <div 
          onClick={onClose} 
          className="hidden sm:flex items-center gap-1.5 bg-white text-[#14472c] text-xs font-bold py-1.5 px-3 rounded-2xl shadow-lg border border-[#a8e2be] cursor-pointer hover:bg-[#edf8f1] transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
          <span>{isHi ? '💬 व्हाट्सएप किसान सहायक' : 'WhatsApp Sahayak'}</span>
        </div>

        {/* WhatsApp Icon Button */}
        <button
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer border-2 border-white"
          title={isHi ? 'अन्नद्वार व्हाट्सएप किसान साथी' : 'Open WhatsApp Assistant'}
        >
          <span className="text-3xl">💬</span>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            1
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 w-[95vw] sm:w-[390px] h-[580px] max-h-[90vh] bg-[#efeae2] rounded-3xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden font-sans">
      {/* WhatsApp Header */}
      <div className="bg-[#008069] text-white px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-0.5 border border-white/40 overflow-hidden flex-shrink-0 shadow-xs">
            <img src="/logo.png" alt="अन्नद्वार" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm leading-tight text-white">
                {isHi ? 'अन्नद्वार किसान साथी' : 'Anndwar WhatsApp'}
              </h3>
              <span className="text-[#88f0bc] text-xs" title="Official Verified">✓</span>
            </div>
            <p className="text-[11px] text-[#bbf7d0] flex items-center gap-1 leading-tight mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88f0bc] animate-pulse"></span>
              <span>{isHi ? 'ऑनलाइन • 24x7 किसान सेवा' : 'Online • 24x7 Service'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Read Aloud button */}
          <button
            onClick={() => {
              const lastMsg = messages[messages.length - 1];
              if (lastMsg) speakText(lastMsg.text);
            }}
            className={`p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer ${
              isSpeaking ? 'bg-white/30 text-amber-300' : ''
            }`}
            title={isHi ? 'बोलकर सुनाएं (Read Aloud)' : 'Listen (Voice)'}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Reset chat */}
          <button
            onClick={() => setMessages(initialMessages)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isHi ? 'रीसेट करें' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* WhatsApp Official Encrypted Banner */}
      <div className="bg-[#ffeecd] px-3 py-1 text-center text-[10.5px] text-[#6b5016] border-b border-[#ebd7a7] flex items-center justify-center gap-1">
        <span>🔒</span>
        <span>{isHi ? 'किसान मित्र संदेश एंड-टू-एंड सुरक्षित हैं' : 'End-to-end encrypted Kisan service'}</span>
      </div>

      {/* Messages Scroll Area with WhatsApp Background Pattern */}
      <div 
        className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#efeae2]"
        style={{
          backgroundImage: 'radial-gradient(#d4cec4 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs relative ${
                  isBot
                    ? 'bg-white text-gray-900 rounded-tl-xs border border-gray-200'
                    : 'bg-[#d9fdd3] text-gray-900 rounded-tr-xs border border-[#c3f0bb]'
                }`}
              >
                {/* Voice button on bot message */}
                {isBot && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="absolute -right-6 top-1 text-gray-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    title={isHi ? 'इसे सुनें' : 'Listen'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={line.startsWith('•') || line.startsWith('1.') ? 'mt-0.5' : 'mb-1'}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Optional interactive option chips */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="text-left px-2.5 py-1.5 rounded-xl bg-[#f0f9f3] hover:bg-[#d8eedf] text-[#14532d] text-xs font-semibold border border-[#bce3cb] transition-colors cursor-pointer flex items-center justify-between shadow-2xs"
                      >
                        <span>{opt.label}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">➔</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Time + status */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[9.5px] text-gray-400 font-medium">
                  <span>{msg.time}</span>
                  {!isBot && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="bg-[#f0f2f5] p-2 sm:p-2.5 border-t border-gray-300 flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            const prompt = isHi ? 'माइक सक्रिय: बोलकर बताएं' : 'Microphone Active: Speak now';
            handleUserSend(isHi ? 'मेरा टोकन और कतार चेक करो' : 'Check my token and queue');
          }}
          className="p-2 text-gray-600 hover:text-emerald-700 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          title={isHi ? 'बोलकर पूछें (Voice Input)' : 'Voice Input'}
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUserSend(inputVal);
          }}
          placeholder={isHi ? 'यहाँ संदेश लिखें (उदा: स्लॉट बुक, कतार स्थिति...)' : 'Type message here...'}
          className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#008069]"
        />

        <button
          type="button"
          onClick={() => handleUserSend(inputVal)}
          disabled={!inputVal.trim()}
          className="w-9 h-9 rounded-full bg-[#008069] hover:bg-[#006a57] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Official WhatsApp Link Banner */}
      <div className="bg-white px-3 py-1.5 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-600">
        <span>{isHi ? 'फोन में खोलें:' : 'Open in Phone:'}</span>
        <button
          onClick={() =>
            window.open(
              'https://wa.me/9118001801551?text=Namaste%20Anndwar%20Sahayak',
              '_blank'
            )
          }
          className="text-[#008069] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>📲 {isHi ? 'असली व्हाट्सएप खोलें' : 'Open WhatsApp App'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
