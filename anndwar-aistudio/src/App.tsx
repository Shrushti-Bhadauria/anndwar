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
import { Language, FarmerProfile, MandiSlot, FarmerDocument, PaymentRecord } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [currentView, setCurrentView] = useState<string>('farmer_home');
  const [activeDbtTab, setActiveDbtTab] = useState<'status' | 'history' | 'calculator' | 'support'>('status');

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

  const isFarmerModule = [
    'farmer_home',
    'live_queue',
    'slot_booking',
    'crop_check',
    'payments',
  ].includes(currentView);

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#143425] flex flex-col font-sans selection:bg-[#1b7e45]/20">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Shown in Farmer Portal mode) */}
        {isFarmerModule && (
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

        {/* View Switcher Router */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
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
              onNavigateToMandiTerminal={() => setCurrentView('mandi_terminal')}
              onOpenReceipt={() => setIsReceiptOpen(true)}
            />
          )}

          {currentView === 'slot_booking' && (
            <SlotBooking
              lang={lang}
              activeSlot={activeSlot}
              onSlotBooked={(newSlot) => setActiveSlot(newSlot)}
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

          {currentView === 'mandi_terminal' && (
            <MandiOperatorTerminal
              lang={lang}
              activeSlot={activeSlot}
              onOpenReceipt={() => setIsReceiptOpen(true)}
              onViewFarmerPortal={() => setCurrentView('farmer_home')}
            />
          )}

          {currentView === 'logistics_godown' && (
            <LogisticsAndGodown lang={lang} />
          )}

          {currentView === 'admin_centre' && (
            <AdminCommandCentre 
              lang={lang} 
              onNavigateToFarmer={() => setCurrentView('farmer_home')}
            />
          )}

          {currentView === 'mongo_compass' && (
            <MongoCompassViewer lang={lang} />
          )}
        </main>
      </div>

      {/* Global Modals */}
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
        onRescheduleSuccess={(updatedSlot) => setActiveSlot(updatedSlot)}
      />
    </div>
  );
}
