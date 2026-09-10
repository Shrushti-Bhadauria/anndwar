import { 
  FarmerProfile, 
  DocumentItem, 
  PaymentRecord, 
  MandiSlot, 
  ProcurementStage, 
  MandiCenter, 
  LogisticsConsolidation, 
  GodownStock,
  CropPreCheckResult 
} from '../src/types.js';

// In-Memory & Persistent MongoDB-compatible collection store
class MongoCollection<T extends { id: string }> {
  name: string;
  documents: Map<string, T> = new Map();

  constructor(name: string, initialData: T[] = []) {
    this.name = name;
    initialData.forEach(item => this.documents.set(item.id, { ...item }));
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    const list = Array.from(this.documents.values());
    if (Object.keys(filter).length === 0) return list;
    return list.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if ((item as any)[key] !== val) return false;
      }
      return true;
    });
  }

  async findById(id: string): Promise<T | null> {
    return this.documents.get(id) || null;
  }

  async findOne(filter: Partial<T> = {}): Promise<T | null> {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async create(doc: T): Promise<T> {
    this.documents.set(doc.id, { ...doc });
    return doc;
  }

  async updateOne(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = this.documents.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  async count(): Promise<number> {
    return this.documents.size;
  }
}

// Initial Seed Data accurately aligned with user's screenshots
export const initialFarmer: FarmerProfile = {
  id: 'farmer_001',
  nameHi: 'राम सिंह',
  nameEn: 'Ram Singh',
  phone: '98260XXXXX',
  aadhaarMasked: 'XXXX-XXXX-4812',
  samagraId: '48921008',
  village: 'धर्मराजपुरा, सांवेर',
  district: 'इन्दौर (मध्य प्रदेश)',
  totalLandAcres: 8.5,
  registeredCrop: 'शरबती गेहूँ (ग्रेड-A)',
  registeredQuantityLimit: 120,
  isKycVerified: true,
  isBhulekhSynced: true,
  isNpciSeeded: true
};

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc_1',
    titleHi: 'आधार कार्ड (Aadhaar Card)',
    titleEn: 'Aadhaar Card',
    subtitleHi: 'UIDAI e-KYC ओटीपी मान्य',
    subtitleEn: 'UIDAI e-KYC OTP Validated',
    statusTextHi: 'सत्यापित',
    statusTextEn: 'Verified',
    isVerified: true,
    docNumber: 'XXXX-XXXX-4812',
    iconType: 'aadhaar'
  },
  {
    id: 'doc_2',
    titleHi: 'भू-अभिलेख खसरा / खतौनी',
    titleEn: 'Land Record Khasra / Khatauni',
    subtitleHi: 'MP Bhulekh डेटा सिंक OK',
    subtitleEn: 'MP Bhulekh Data Sync OK',
    statusTextHi: 'सिंक पूर्ण',
    statusTextEn: 'Sync Complete',
    isVerified: true,
    docNumber: 'खसरा क्र: 124/2, 125/1 (रकबा 3.4 हे.)',
    iconType: 'bhulekh'
  },
  {
    id: 'doc_3',
    titleHi: 'बैंक पासबुक / निरस्त चेक',
    titleEn: 'Bank Passbook / Cancelled Cheque',
    subtitleHi: 'NPCI Seeding OK',
    subtitleEn: 'NPCI Seeding OK',
    statusTextHi: 'आधार लिंक सक्रिय',
    statusTextEn: 'Aadhaar Linked Active',
    isVerified: true,
    docNumber: 'SBI A/c: *******4921 (IFSC: SBIN000124)',
    iconType: 'bank'
  },
  {
    id: 'doc_4',
    titleHi: 'समग्र परिवार आईडी (Samagra)',
    titleEn: 'Samagra Family ID',
    subtitleHi: 'सदस्य आईडी: 48921008',
    subtitleEn: 'Member ID: 48921008',
    statusTextHi: 'प्रमाणित',
    statusTextEn: 'Certified',
    isVerified: true,
    docNumber: '48921008',
    iconType: 'samagra'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay_01',
    cropNameHi: 'चना उपार्जन (30 क्विंटल)',
    cropNameEn: 'Gram / Chana Procurement (30 Quintal)',
    quantityQuintal: 30,
    totalAmount: 163200,
    date: '14 मार्च 2025',
    seasonHi: 'रबी विपणन',
    seasonEn: 'Rabi Marketing',
    status: 'credit_successful',
    utrNumber: 'SBIN004829104',
    mandiName: 'सांवेर उपार्जन केंद्र',
    receiptNumber: 'RCP-RABI-2025-0912'
  },
  {
    id: 'pay_02',
    cropNameHi: 'सोयाबीन उपार्जन (25 क्विंटल)',
    cropNameEn: 'Soybean Procurement (25 Quintal)',
    quantityQuintal: 25,
    totalAmount: 122250,
    date: '22 नवंबर 2024',
    seasonHi: 'खरीफ विपणन',
    seasonEn: 'Kharif Marketing',
    status: 'credit_successful',
    utrNumber: 'SBIN003910482',
    mandiName: 'इंदौर कृषि उपज मंडी',
    receiptNumber: 'RCP-KHARIF-2024-8841'
  }
];

export const initialActiveSlot: MandiSlot = {
  id: 'slot_active',
  tokenNumber: 'MP-2409',
  farmerId: 'farmer_001',
  farmerName: 'राम सिंह',
  date: '26 अक्टूबर 2025',
  timeSlot: '11:00 AM – 12:30 PM',
  gateArrivalExpected: '10:45 AM',
  mandiCenterName: 'सांवेर उपार्जन केंद्र',
  gateNumber: 'गेट क्र. 02',
  laneNumber: 'लेन #02 (ट्रॉली लेन)',
  cropName: 'शरबती गेहूँ',
  cropGrade: 'ग्रेड-A',
  quantityQuintal: 45,
  mspRatePerQuintal: 2400,
  totalEstimatedValue: 108000,
  vehicleNumber: 'MP-09-GE-4102',
  vehicleType: 'ट्रैक्टर ट्रॉली',
  status: 'arrived',
  bookingTimestamp: '2025-10-25T14:20:00Z',
  qrCodeData: 'ANNDWAR|MP-2409|FARMER_001|WHEAT|45Q|SANWER_GATE02'
};

export const initialStages: ProcurementStage[] = [
  {
    id: 'stage_1',
    step: 1,
    titleHi: 'किसान सत्यापन',
    titleEn: 'Farmer Verification',
    subHi: 'पूर्ण • 08:30 AM (सत्यापित)',
    subEn: 'Completed • 08:30 AM (Approved)',
    status: 'completed',
    time: '08:30 AM',
    details: 'पोर्टल द्वारा स्वीकृत एवं भू-अभिलेख सत्यापित',
    iconType: 'farmer'
  },
  {
    id: 'stage_2',
    step: 2,
    titleHi: 'स्लॉट बुकिंग',
    titleEn: 'Slot Booking',
    subHi: 'सत्यापित (#SLOT-8)',
    subEn: 'Verified (#SLOT-8)',
    status: 'completed',
    time: 'स्लॉट: 11:00 AM',
    details: 'सांवेर उपार्जन केंद्र - गेट 02',
    iconType: 'slot'
  },
  {
    id: 'stage_3',
    step: 3,
    titleHi: 'मंडी गेट प्रवेश',
    titleEn: 'Mandi Gate Entry',
    subHi: 'सम्पन्न • 10:45 AM',
    subEn: 'Pass • 10:45 AM',
    status: 'completed',
    time: '10:45 AM',
    details: 'RFID गेट #01 स्कैन व यार्ड मार्शल सत्यापन',
    iconType: 'gate'
  },
  {
    id: 'stage_4',
    step: 4,
    titleHi: 'गुणवत्ता व नमी जांच',
    titleEn: 'Quality & Moisture Test',
    subHi: 'नमी: 11.4% (मानक योग्य पास)',
    subEn: 'Moisture: 11.4% (Pass Standard)',
    status: 'in_progress',
    time: 'प्रगति पर (11:12 AM)',
    details: 'डिजिटल नमी मापक #03 द्वारा परीक्षण जारी',
    iconType: 'quality'
  },
  {
    id: 'stage_5',
    step: 5,
    titleHi: 'इलेक्ट्रॉनिक तौल',
    titleEn: 'Electronic Weighment',
    subHi: 'कांटा #02 पर कतार में',
    subEn: 'Gross/Tare at Scale #02',
    status: 'upcoming',
    time: 'प्रतीक्षारत',
    details: 'सकल एवं शुद्ध तौल (Gross & Tare)',
    iconType: 'weigh'
  },
  {
    id: 'stage_6',
    step: 6,
    titleHi: 'ई-उपार्जन पावती',
    titleEn: 'Digital MSP Slip',
    subHi: 'तौल उपरांत तुरंत तैयार',
    subEn: 'Ready Post Weighment',
    status: 'upcoming',
    time: 'प्रतीक्षारत',
    details: 'डिजिटल रसीद व SMS प्रेषण',
    iconType: 'receipt'
  },
  {
    id: 'stage_7',
    step: 7,
    titleHi: 'DBT बैंक भुगतान',
    titleEn: 'Direct Benefit Transfer',
    subHi: 'आधार लिंक्ड बैंक खाता',
    subEn: 'Direct to Bank Account',
    status: 'upcoming',
    time: '24-48 कार्य घंटे',
    details: 'PFMS/NPCI गेटवे द्वारा प्रत्यक्ष अंतरण',
    iconType: 'dbt'
  }
];

export const initialMandis: MandiCenter[] = [
  {
    id: 'mandi_sanwer',
    name: 'सांवेर उपार्जन केंद्र',
    district: 'इन्दौर',
    activeScales: 4,
    avgWaitMinutes: 25,
    loadPercent: 48,
    congestionLevel: 'low',
    distanceKm: 4.2,
    dailyCapacityQuintal: 4500,
    procuredTodayQuintal: 2150
  },
  {
    id: 'mandi_indore_main',
    name: 'इंदौर कृषि उपज मंडी (चोइथराम)',
    district: 'इन्दौर',
    activeScales: 6,
    avgWaitMinutes: 65,
    loadPercent: 88,
    congestionLevel: 'high',
    distanceKm: 18.5,
    dailyCapacityQuintal: 9000,
    procuredTodayQuintal: 7900
  },
  {
    id: 'mandi_depalpur',
    name: 'देपालपुर उपार्जन केंद्र',
    district: 'इन्दौर',
    activeScales: 3,
    avgWaitMinutes: 30,
    loadPercent: 52,
    congestionLevel: 'medium',
    distanceKm: 14.0,
    dailyCapacityQuintal: 3500,
    procuredTodayQuintal: 1820
  },
  {
    id: 'mandi_mhow',
    name: 'महू उपार्जन केंद्र',
    district: 'इन्दौर',
    activeScales: 3,
    avgWaitMinutes: 20,
    loadPercent: 38,
    congestionLevel: 'low',
    distanceKm: 22.0,
    dailyCapacityQuintal: 3000,
    procuredTodayQuintal: 1140
  }
];

export const initialLogistics: LogisticsConsolidation[] = [
  {
    id: 'log_01',
    vehicleNumber: 'MP-09-LA-5582',
    driverName: 'विक्रम सिंह',
    driverPhone: '9893112233',
    capacityQuintal: 120,
    loadedQuintal: 110,
    farmerStops: [
      { farmerName: 'राम सिंह', village: 'धर्मराजपुरा', quintal: 45, pickupTime: '09:00 AM', status: 'picked' },
      { farmerName: 'गोपाल पटेल', village: 'अजरोदा', quintal: 35, pickupTime: '09:45 AM', status: 'picked' },
      { farmerName: 'कैलाश वर्मा', village: 'लसूडिया', quintal: 30, pickupTime: '10:30 AM', status: 'en_route' }
    ],
    destinationMandi: 'सांवेर उपार्जन केंद्र',
    fuelSavedPercent: 34,
    emptyTripsEliminated: 2,
    liveStatus: 'in_transit'
  }
];

export const initialGodownStocks: GodownStock[] = [
  {
    id: 'stock_01',
    godownName: 'MPWLC केंद्रीय गोदाम परिसर #03',
    siloNumber: 'साइलो ब्लॉक B-14',
    cropType: 'शरबती गेहूँ (ग्रेड-A)',
    storedQuintals: 14200,
    maxCapacityQuintals: 20000,
    lastStockEntry: 'आज 10:15 AM',
    bagCount: 28400,
    qualityGrade: 'A+'
  },
  {
    id: 'stock_02',
    godownName: 'MPWLC केंद्रीय गोदाम परिसर #03',
    siloNumber: 'साइलो ब्लॉक B-15',
    cropType: 'सोयाबीन (पीला सोना)',
    storedQuintals: 8500,
    maxCapacityQuintals: 15000,
    lastStockEntry: 'कल 05:40 PM',
    bagCount: 17000,
    qualityGrade: 'A'
  }
];

// Initialize Collections
export const db = {
  farmers: new MongoCollection<FarmerProfile>('farmers', [initialFarmer]),
  documents: new MongoCollection<DocumentItem>('documents', initialDocuments),
  payments: new MongoCollection<PaymentRecord>('payments', initialPayments),
  slots: new MongoCollection<MandiSlot>('slots', [initialActiveSlot]),
  stages: new MongoCollection<ProcurementStage>('stages', initialStages),
  mandis: new MongoCollection<MandiCenter>('mandis', initialMandis),
  logistics: new MongoCollection<LogisticsConsolidation>('logistics', initialLogistics),
  godownStocks: new MongoCollection<GodownStock>('godown_stocks', initialGodownStocks),
  cropChecks: new MongoCollection<CropPreCheckResult>('crop_prechecks', [])
};
