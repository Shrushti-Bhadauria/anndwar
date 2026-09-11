import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { SlotBooking } from './components/SlotBooking';
import { LiveQueueTracker } from './components/LiveQueueTracker';
import { CropPreCheck } from './components/CropPreCheck';
import { DocumentsModal } from './components/DocumentsModal';
import { PaymentHistoryModal } from './components/PaymentHistoryModal';
import { SlotReceiptModal } from './components/SlotReceiptModal';
import { SmartRescheduleModal } from './components/SmartRescheduleModal';
import { MandiOperatorTerminal } from './components/MandiOperatorTerminal';
import { LogisticsAndGodown } from './components/LogisticsAndGodown';
import { AdminCommandCentre } from './components/AdminCommandCentre';
import { MongoCompassViewer } from './components/MongoCompassViewer';
import { DbtPaymentView } from './components/DbtPaymentView';
import { LoginView } from './components/LoginView';
import { KisanWhatsAppBot } from './components/KisanWhatsAppBot';
import { Language, FarmerProfile, MandiSlot, FarmerDocument, PaymentRecord, AuthUser } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [currentView, setCurrentView] = useState<string>('farmer_home');
  const [activeDbtTab, setActiveDbtTab] = useState<'status' | 'history' | 'calculator' | 'support'>('status');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('anndwar_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // WhatsApp Assistant State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Core domain data
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [activeSlot, setActiveSlot] = useState<MandiSlot | null>(null);
  const [documents, setDocuments] = useState<FarmerDocument[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Modals
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetch('/api/farmer/profile')
      .then((res) => res.json())
      .then((data) => setFarmer(data))
      .catch((err) => console.error(err));

    fetch('/api/slots/active')
      .then((res) => res.json())
      .then((data) => setActiveSlot(data))
      .catch((err) => console.error(err));

    fetch('/api/farmer/documents')
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error(err));

    fetch('/api/farmer/payments')
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('anndwar_auth_user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }

    // Direct user strictly to their authorized portal
    if (user.role === 'farmer') {
      setCurrentView('farmer_home');
    } else if (user.role === 'mandi_operator') {
      setCurrentView('mandi_terminal');
    } else if (user.role === 'admin') {
      setCurrentView('admin_centre');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('anndwar_auth_user');
    } catch (err) {
      console.error(err);
    }
    setCurrentView('farmer_home');
  };

  const handleLiveSlotUpdate = (newSlot: MandiSlot) => {
    setActiveSlot(newSlot);
    // Broadcast update across APIs / simulate sync
    fetch('/api/slots/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSlot),
    }).catch((err) => console.log('Live slot synced:', err));
  };

  // If user is not authenticated, show clean Login screen with WhatsApp bot available
  if (!currentUser) {
    return (
      <>
        <LoginView
          lang={lang}
          onToggleLang={toggleLanguage}
          onLoginSuccess={handleLoginSuccess}
          onOpenWhatsAppHelp={() => setIsWhatsAppOpen(true)}
        />
        <KisanWhatsAppBot
          lang={lang}
          activeSlot={activeSlot}
          onSlotBooked={handleLiveSlotUpdate}
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
        />
      </>
    );
  }

  const role = currentUser.role;
  const isFarmerRole = role === 'farmer';
  const isOperatorRole = role === 'mandi_operator';
  const isAdminRole = role === 'admin';

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#143425] flex flex-col font-sans selection:bg-[#1b7e45]/20">
      {/* Top Role-Aware Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        currentUser={currentUser}
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        onLogout={handleLogout}
        onOpenWhatsAppHelp={() => setIsWhatsAppOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Strictly for Farmer Portal only!) */}
        {isFarmerRole && (
          <Sidebar
            lang={lang}
            currentTab={currentView}
            onSelectTab={(tab) => setCurrentView(tab)}
            farmer={farmer}
            onOpenDocuments={() => setIsDocumentsOpen(true)}
            onOpenPayments={() => {
              setCurrentView('payments');
              setActiveDbtTab('status');
            }}
            activeDbtTab={activeDbtTab}
            onSelectDbtTab={(tab) => {
              setActiveDbtTab(tab);
              setCurrentView('payments');
            }}
          />
        )}

        {/* View Switcher Router Strictly by Role */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* FARMER VIEWS */}
          {isFarmerRole && (
            <>
              {currentView === 'farmer_home' && (
                <FarmerDashboard
                  lang={lang}
                  farmer={farmer}
                  slot={activeSlot}
                  onNavigate={(tab) => setCurrentView(tab)}
                  onOpenDocuments={() => setIsDocumentsOpen(true)}
                  onOpenPayments={() => {
                    setCurrentView('payments');
                    setActiveDbtTab('status');
                  }}
                  onOpenReschedule={() => setIsRescheduleOpen(true)}
                />
              )}

              {currentView === 'payments' && (
                <DbtPaymentView
                  lang={lang}
                  farmer={farmer}
                  activeTab={activeDbtTab}
                  onTabChange={(tab) => setActiveDbtTab(tab)}
                  onNavigateToBooking={() => setCurrentView('slot_booking')}
                />
              )}

              {currentView === 'live_queue' && (
                <LiveQueueTracker
                  lang={lang}
                  activeSlot={activeSlot}
                  onNavigateToMandiTerminal={() => setCurrentView('live_queue')}
                  onOpenReceipt={() => setIsReceiptOpen(true)}
                />
              )}

              {currentView === 'slot_booking' && (
                <SlotBooking
                  lang={lang}
                  activeSlot={activeSlot}
                  onSlotBooked={handleLiveSlotUpdate}
                  onOpenReceipt={() => setIsReceiptOpen(true)}
                  onOpenReschedule={() => setIsRescheduleOpen(true)}
                  onViewLiveQueue={() => setCurrentView('live_queue')}
                />
              )}

              {currentView === 'crop_check' && (
                <CropPreCheck
                  lang={lang}
                  onNavigateToBooking={() => setCurrentView('slot_booking')}
                />
              )}
            </>
          )}

          {/* MANDI OPERATOR VIEWS (Strictly Operator Terminal) */}
          {isOperatorRole && (
            <MandiOperatorTerminal
              lang={lang}
              activeSlot={activeSlot}
              onOpenReceipt={() => setIsReceiptOpen(true)}
            />
          )}

          {/* ADMIN VIEWS (Strictly Admin HQ views) */}
          {isAdminRole && (
            <>
              {currentView === 'admin_centre' && (
                <AdminCommandCentre 
                  lang={lang} 
                />
              )}

              {currentView === 'logistics_godown' && (
                <LogisticsAndGodown lang={lang} />
              )}

              {currentView === 'mongo_compass' && (
                <MongoCompassViewer lang={lang} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals (Farmer operations) */}
      <DocumentsModal
        isOpen={isDocumentsOpen}
        onClose={() => setIsDocumentsOpen(false)}
        lang={lang}
        documents={documents}
      />

      <PaymentHistoryModal
        isOpen={isPaymentsOpen}
        onClose={() => setIsPaymentsOpen(false)}
        lang={lang}
        payments={payments}
      />

      <SlotReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        lang={lang}
        slot={activeSlot}
        farmer={farmer}
      />

      <SmartRescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        lang={lang}
        currentSlot={activeSlot}
        onRescheduleSuccess={handleLiveSlotUpdate}
      />

      {/* Kisan WhatsApp Bot (Available for all views, especially helpful for farmers) */}
      <KisanWhatsAppBot
        lang={lang}
        activeSlot={activeSlot}
        onSlotBooked={handleLiveSlotUpdate}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />
    </div>
  );
}
