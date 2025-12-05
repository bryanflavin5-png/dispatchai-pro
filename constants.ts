
import { Driver, DriverStatus, Load, LoadStatus, Invoice, InvoiceStatus, SafetyProfile, SafetyIncident, WorkOrder, Part, LaneMetric, RFP, Expense, Settlement, DriverMessage, DQFile, CoachingSession, Geofence, GeofenceEvent, DailyLog, LogEditRequest, CSABasicScore, ClearinghouseQuery, UnassignedEvent, IFTAEntry, Alert, Task, Applicant, YardSpot, Trailer, Truck } from './types';

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'D-101',
    name: 'John Miller',
    truckId: 'TRK-001',
    status: DriverStatus.AVAILABLE,
    currentLocation: 'Chicago, IL',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    phone: '(555) 123-4567',
    email: 'john.miller@example.com',
    avatar: 'https://picsum.photos/id/1005/60/60',
    hos: {
      status: 'OFF',
      driveTimeRemaining: 645, // 10h 45m
      onDutyRemaining: 780, // 13h
      cycleRemaining: 3200 // ~53h
    },
    vehicle: {
      fuelLevel: 85,
      odometer: 145000,
      engineHours: 4200,
      healthStatus: 'Healthy',
      defects: 0,
      nextServiceDate: '2023-12-01'
    },
    hazmatEndorsed: true,
    hireDate: '2021-05-15',
    licenseNumber: 'IL-12345678'
  },
  {
    id: 'D-102',
    name: 'Sarah Connor',
    truckId: 'TRK-005',
    status: DriverStatus.ON_LOAD,
    currentLocation: 'St. Louis, MO',
    coordinates: { lat: 38.6270, lng: -90.1994 },
    phone: '(555) 987-6543',
    email: 'sarah.connor@example.com',
    avatar: 'https://picsum.photos/id/1011/60/60',
    hos: {
      status: 'D',
      driveTimeRemaining: 120, // 2h
      onDutyRemaining: 180, // 3h
      cycleRemaining: 1500 // ~25h
    },
    vehicle: {
      fuelLevel: 45,
      odometer: 210500,
      engineHours: 6800,
      healthStatus: 'Warning',
      defects: 1,
      nextServiceDate: '2023-11-05'
    },
    hazmatEndorsed: false,
    hireDate: '2020-02-10',
    licenseNumber: 'MO-87654321'
  },
  {
    id: 'D-103',
    name: 'Mike Ross',
    truckId: 'TRK-008',
    status: DriverStatus.OFF_DUTY,
    currentLocation: 'Dallas, TX',
    coordinates: { lat: 32.7767, lng: -96.7970 },
    phone: '(555) 456-7890',
    email: 'mike.ross@example.com',
    avatar: 'https://picsum.photos/id/1012/60/60',
    hos: {
      status: 'SB',
      driveTimeRemaining: 660, // 11h
      onDutyRemaining: 840, // 14h
      cycleRemaining: 4000 // ~66h
    },
    vehicle: {
      fuelLevel: 92,
      odometer: 89000,
      engineHours: 2100,
      healthStatus: 'Healthy',
      defects: 0,
      nextServiceDate: '2024-01-15'
    },
    hazmatEndorsed: true,
    hireDate: '2022-11-01',
    licenseNumber: 'TX-11223344'
  },
  {
    id: 'D-104',
    name: 'Elena Fisher',
    truckId: 'TRK-012',
    status: DriverStatus.AVAILABLE,
    currentLocation: 'Atlanta, GA',
    coordinates: { lat: 33.7490, lng: -84.3880 },
    phone: '(555) 222-3333',
    email: 'elena.fisher@example.com',
    avatar: 'https://picsum.photos/id/1027/60/60',
    hos: {
      status: 'ON',
      driveTimeRemaining: 500, // 8h 20m
      onDutyRemaining: 600, // 10h
      cycleRemaining: 2800 // ~46h
    },
    vehicle: {
      fuelLevel: 25,
      odometer: 310000,
      engineHours: 9500,
      healthStatus: 'Critical',
      defects: 2,
      nextServiceDate: '2023-10-30'
    },
    hazmatEndorsed: false,
    hireDate: '2019-06-20',
    licenseNumber: 'GA-55667788'
  }
];

export const MOCK_TRUCKS: Truck[] = [
  {
    id: 'TRK-001',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2021,
    vin: '1FVACWDT3MH12345',
    plate: 'IL-12345',
    status: 'Active',
    assignedDriverId: 'D-101',
    mileage: 145000,
    purchaseDate: '2020-12-15'
  },
  {
    id: 'TRK-005',
    make: 'Volvo',
    model: 'VNL 760',
    year: 2020,
    vin: '4V4NC9TH5KN67890',
    plate: 'MO-54321',
    status: 'Active',
    assignedDriverId: 'D-102',
    mileage: 210500,
    purchaseDate: '2019-10-01'
  },
  {
    id: 'TRK-008',
    make: 'Peterbilt',
    model: '579',
    year: 2023,
    vin: '1XP5D49X5PD11223',
    plate: 'TX-99887',
    status: 'Active',
    assignedDriverId: 'D-103',
    mileage: 89000,
    purchaseDate: '2022-09-01'
  },
  {
    id: 'TRK-012',
    make: 'Kenworth',
    model: 'T680',
    year: 2019,
    vin: '1XKAD49X5KJ44556',
    plate: 'GA-77665',
    status: 'Maintenance',
    assignedDriverId: 'D-104',
    mileage: 310000,
    purchaseDate: '2018-11-15'
  }
];

export const MOCK_LOADS: Load[] = [
  {
    id: 'L-5001',
    customer: 'Acme Steel',
    origin: 'Gary, IN',
    destination: 'Detroit, MI',
    pickupDate: '2023-10-25',
    deliveryDate: '2023-10-26',
    rate: 1200,
    weight: 42000,
    status: LoadStatus.PENDING,
    commodity: 'Steel Coils',
    originCoords: { lat: 41.5934, lng: -87.3464 },
    destinationCoords: { lat: 42.3314, lng: -83.0458 },
    documents: [
      { type: 'RateCon', status: 'Approved' },
      { type: 'BOL', status: 'Missing' }
    ]
  },
  {
    id: 'L-5002',
    customer: 'Fresh Foods Inc',
    origin: 'Atlanta, GA',
    destination: 'Miami, FL',
    pickupDate: '2023-10-26',
    deliveryDate: '2023-10-27',
    rate: 2800,
    weight: 35000,
    status: LoadStatus.PENDING,
    commodity: 'Frozen Produce',
    originCoords: { lat: 33.7490, lng: -84.3880 },
    destinationCoords: { lat: 25.7617, lng: -80.1918 },
    documents: [
      { type: 'RateCon', status: 'Approved' },
      { type: 'BOL', status: 'Missing' }
    ]
  },
  {
    id: 'L-5003',
    customer: 'ChemCorp',
    origin: 'Houston, TX',
    destination: 'Phoenix, AZ',
    pickupDate: '2023-10-24',
    deliveryDate: '2023-10-26',
    rate: 4200,
    weight: 40000,
    status: LoadStatus.IN_TRANSIT,
    assignedDriverId: 'D-102',
    commodity: 'Industrial Solvent',
    originCoords: { lat: 29.7604, lng: -95.3698 },
    destinationCoords: { lat: 33.4484, lng: -112.0740 },
    documents: [
      { type: 'RateCon', status: 'Approved' },
      { type: 'BOL', status: 'Uploaded' },
      { type: 'POD', status: 'Missing' }
    ],
    hazmat: {
        class: '3',
        unNumber: '1263',
        placardRequired: true
    }
  },
  {
    id: 'L-5004',
    customer: 'BuildRight',
    origin: 'Charlotte, NC',
    destination: 'Nashville, TN',
    pickupDate: '2023-10-27',
    deliveryDate: '2023-10-28',
    rate: 950,
    weight: 45000,
    status: LoadStatus.PENDING,
    commodity: 'Lumber',
    originCoords: { lat: 35.2271, lng: -80.8431 },
    destinationCoords: { lat: 36.1627, lng: -86.7816 },
    documents: [
      { type: 'RateCon', status: 'Missing' }
    ]
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2023-001',
    loadId: 'L-4990',
    customer: 'Walmart Logistics',
    amount: 4500,
    status: InvoiceStatus.PAID,
    issueDate: '2023-10-01',
    dueDate: '2023-10-31',
    agingDays: 0
  },
  {
    id: 'INV-2023-002',
    loadId: 'L-4992',
    customer: 'Acme Steel',
    amount: 1200,
    status: InvoiceStatus.OVERDUE,
    issueDate: '2023-09-15',
    dueDate: '2023-10-15',
    agingDays: 45
  },
  {
    id: 'INV-2023-003',
    loadId: 'L-4995',
    customer: 'Home Depot',
    amount: 3200,
    status: InvoiceStatus.FACTORING_SUBMITTED,
    issueDate: '2023-10-20',
    dueDate: '2023-11-20',
    agingDays: 5
  },
  {
    id: 'INV-2023-004',
    loadId: 'L-4998',
    customer: 'Tech Dist',
    amount: 2800,
    status: InvoiceStatus.DRAFT,
    issueDate: '2023-10-25',
    dueDate: '2023-11-25',
    agingDays: 0
  },
  {
    id: 'INV-2023-005',
    loadId: 'L-5000',
    customer: 'BuildRight',
    amount: 1500,
    status: InvoiceStatus.FACTORING_FUNDED,
    issueDate: '2023-10-22',
    dueDate: '2023-11-21',
    agingDays: 0
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'EXP-101',
    category: 'Fuel',
    amount: 540.50,
    date: '2023-10-26',
    vendor: 'Loves Travel Stop',
    description: 'Diesel - 120gal',
    truckId: 'TRK-005'
  },
  {
    id: 'EXP-102',
    category: 'Maintenance',
    amount: 280.00,
    date: '2023-10-25',
    vendor: 'TruckPro',
    description: 'Brake parts',
    truckId: 'TRK-012'
  },
  {
    id: 'EXP-103',
    category: 'Insurance',
    amount: 1200.00,
    date: '2023-10-01',
    vendor: 'Progressive Commercial',
    description: 'Monthly Premium - Fleet',
  },
  {
    id: 'EXP-104',
    category: 'Lumper',
    amount: 150.00,
    date: '2023-10-26',
    vendor: 'Capstones',
    description: 'Unload Fee',
    truckId: 'TRK-001'
  }
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'SET-901',
    driverId: 'D-101',
    periodStart: '2023-10-15',
    periodEnd: '2023-10-21',
    grossPay: 2100.00,
    deductions: {
      fuel: 0,
      advances: 200,
      insurance: 50,
      other: 0
    },
    netPay: 1850.00,
    status: 'Paid'
  },
  {
    id: 'SET-902',
    driverId: 'D-102',
    periodStart: '2023-10-15',
    periodEnd: '2023-10-21',
    grossPay: 2400.00,
    deductions: {
      fuel: 0,
      advances: 0,
      insurance: 50,
      other: 100
    },
    netPay: 2250.00,
    status: 'Pending'
  }
];

export const MOCK_MESSAGES: DriverMessage[] = [
  {
    id: 'MSG-001',
    driverId: 'D-102',
    direction: 'Inbound',
    message: 'Arrived at shipper. waiting for dock assignment.',
    timestamp: '10:30 AM',
    read: false
  },
  {
    id: 'MSG-002',
    driverId: 'D-102',
    direction: 'Outbound',
    message: 'Copy that. Make sure to get the detention slip signed if over 2 hours.',
    timestamp: '10:32 AM',
    read: true
  },
  {
    id: 'MSG-003',
    driverId: 'D-101',
    direction: 'Inbound',
    message: 'Check engine light just came on. Amber color.',
    timestamp: '09:15 AM',
    read: true
  }
];

export const MOCK_SAFETY_PROFILES: SafetyProfile[] = [
  {
    driverId: 'D-101',
    safetyScore: 98,
    telematics: { harshBraking: 0, rapidAccel: 1, harshCornering: 0, speedingEvents: 0, seatbeltViolations: 0 },
    dqFileStatus: 'Audit Ready'
  },
  {
    driverId: 'D-102',
    safetyScore: 92,
    telematics: { harshBraking: 1, rapidAccel: 2, harshCornering: 0, speedingEvents: 1, seatbeltViolations: 0 },
    dqFileStatus: 'Incomplete'
  },
  {
    driverId: 'D-103',
    safetyScore: 78,
    telematics: { harshBraking: 3, rapidAccel: 4, harshCornering: 2, speedingEvents: 5, seatbeltViolations: 1 },
    dqFileStatus: 'Critical'
  },
  {
    driverId: 'D-104',
    safetyScore: 99,
    telematics: { harshBraking: 0, rapidAccel: 0, harshCornering: 0, speedingEvents: 0, seatbeltViolations: 0 },
    dqFileStatus: 'Audit Ready'
  }
];

export const MOCK_DQ_FILES: DQFile[] = [
    {
        driverId: 'D-101',
        application: 'Verified',
        mvr: 'Current',
        medicalCard: 'Current',
        cdl: 'Current',
        annualReview: 'Completed',
        pspReport: 'On File'
    },
    {
        driverId: 'D-102',
        application: 'Verified',
        mvr: 'Current',
        medicalCard: 'Expiring',
        cdl: 'Current',
        annualReview: 'Completed',
        pspReport: 'Missing'
    },
    {
        driverId: 'D-103',
        application: 'Missing',
        mvr: 'Expired',
        medicalCard: 'Current',
        cdl: 'Current',
        annualReview: 'Overdue',
        pspReport: 'Missing'
    },
    {
        driverId: 'D-104',
        application: 'Verified',
        mvr: 'Current',
        medicalCard: 'Current',
        cdl: 'Current',
        annualReview: 'Completed',
        pspReport: 'On File'
    }
];

export const MOCK_COACHING: CoachingSession[] = [
    {
        id: 'COACH-001',
        driverId: 'D-103',
        topic: 'Speeding',
        status: 'Assigned',
        dueDate: '2023-11-01'
    },
    {
        id: 'COACH-002',
        driverId: 'D-102',
        topic: 'Logbook',
        status: 'Completed',
        dueDate: '2023-10-15'
    }
];

export const MOCK_INCIDENTS: SafetyIncident[] = [
  {
    id: 'INC-001',
    driverId: 'D-103',
    date: '2023-10-12',
    type: 'Speeding',
    description: '15mph over limit on I-40',
    status: 'Open',
    severity: 'Medium'
  },
  {
    id: 'INC-002',
    driverId: 'D-102',
    date: '2023-09-28',
    type: 'Vehicle Maintenance',
    description: 'Cracked windshield noted during inspection',
    status: 'Closed',
    severity: 'Low'
  },
  {
    id: 'INC-003',
    driverId: 'D-103',
    date: '2023-08-15',
    type: 'HOS Violation',
    description: 'Exceeded 14-hour rule by 30 mins',
    status: 'Closed',
    severity: 'Medium'
  }
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-1001',
    truckId: 'TRK-012',
    type: 'Repair',
    status: 'Scheduled',
    date: '2023-10-30',
    description: 'Replace rear brake pads and check calipers',
    mechanic: 'Bill D.',
    laborHours: 3.5,
    partsCost: 280.00,
    laborCost: 350.00,
    totalCost: 630.00,
    warrantyClaim: false
  },
  {
    id: 'WO-1002',
    truckId: 'TRK-005',
    type: 'PM B',
    status: 'Overdue',
    date: '2023-10-20',
    description: 'Oil change, filter replacement, transmission fluid check',
    mechanic: 'Unassigned',
    laborHours: 4.0,
    partsCost: 320.00,
    laborCost: 400.00,
    totalCost: 720.00,
    warrantyClaim: false
  },
  {
    id: 'WO-1003',
    truckId: 'TRK-001',
    type: 'Inspection',
    status: 'Completed',
    date: '2023-10-15',
    description: 'Annual DOT Inspection',
    mechanic: 'Sarah L.',
    laborHours: 1.5,
    partsCost: 0,
    laborCost: 150.00,
    totalCost: 150.00,
    warrantyClaim: false
  },
  {
    id: 'WO-1004',
    truckId: 'TRK-008',
    type: 'Repair',
    status: 'Completed',
    date: '2023-09-10',
    description: 'Turbo Actuator Failure - Warranty Replace',
    mechanic: 'Bill D.',
    laborHours: 6.0,
    partsCost: 1200.00,
    laborCost: 600.00,
    totalCost: 1800.00,
    warrantyClaim: true
  }
];

export const MOCK_PARTS: Part[] = [
  {
    id: 'P-5501',
    name: 'Oil Filter HD',
    sku: 'FLT-998',
    quantity: 12,
    minQuantity: 5,
    unitCost: 24.50,
    category: 'Filter',
    location: 'A-01'
  },
  {
    id: 'P-2201',
    name: 'Brake Pad Set (Rear)',
    sku: 'BRK-550',
    quantity: 3,
    minQuantity: 4,
    unitCost: 85.00,
    category: 'Brake',
    location: 'B-14'
  },
  {
    id: 'P-1105',
    name: '15W-40 Synthetic Oil (Gal)',
    sku: 'OIL-SYN',
    quantity: 45,
    minQuantity: 20,
    unitCost: 18.25,
    category: 'Fluid',
    location: 'F-02'
  },
  {
    id: 'P-3302',
    name: 'Steer Tire 11R22.5',
    sku: 'TR-11R',
    quantity: 2,
    minQuantity: 4,
    unitCost: 450.00,
    category: 'Tire',
    location: 'W-01'
  }
];

export const MOCK_LANE_METRICS: LaneMetric[] = [
  {
    id: 'LANE-001',
    origin: 'Chicago, IL',
    destination: 'Atlanta, GA',
    avgMarketRate: 2.85,
    avgMyRate: 2.95,
    volume: 45,
    tenderAcceptance: 92,
    balance: 'Headhaul'
  },
  {
    id: 'LANE-002',
    origin: 'Atlanta, GA',
    destination: 'Miami, FL',
    avgMarketRate: 3.10,
    avgMyRate: 2.90,
    volume: 28,
    tenderAcceptance: 88,
    balance: 'Headhaul'
  },
  {
    id: 'LANE-003',
    origin: 'Dallas, TX',
    destination: 'Phoenix, AZ',
    avgMarketRate: 2.15,
    avgMyRate: 2.25,
    volume: 32,
    tenderAcceptance: 95,
    balance: 'Neutral'
  },
  {
    id: 'LANE-004',
    origin: 'Phoenix, AZ',
    destination: 'Los Angeles, CA',
    avgMarketRate: 1.85,
    avgMyRate: 1.95,
    volume: 55,
    tenderAcceptance: 75,
    balance: 'Backhaul'
  }
];

export const MOCK_RFPS: RFP[] = [
  {
    id: 'RFP-2024-001',
    customer: 'Target Corp',
    lane: 'Midwest Regional',
    volume: 1500,
    status: 'Active',
    dueDate: '2023-11-15',
    targetRate: 3.25
  },
  {
    id: 'RFP-2024-002',
    customer: 'P&G',
    lane: 'Atlanta to Northeast',
    volume: 800,
    status: 'Submitted',
    dueDate: '2023-10-30',
    targetRate: 2.95
  },
  {
    id: 'RFP-2024-003',
    customer: 'Amazon Freight',
    lane: 'TX Triangle',
    volume: 2500,
    status: 'Won',
    dueDate: '2023-09-15',
    targetRate: 2.15
  }
];

export const MOCK_GEOFENCES: Geofence[] = [
    {
        id: 'GEO-001',
        name: 'Chicago Main Yard',
        coordinates: { lat: 41.8781, lng: -87.6298 },
        radius: 1500, // meters
        type: 'Yard'
    },
    {
        id: 'GEO-002',
        name: 'Acme Steel - Gary',
        coordinates: { lat: 41.5934, lng: -87.3464 },
        radius: 800,
        type: 'Shipper'
    },
    {
        id: 'GEO-003',
        name: 'Tech Dist - Phoenix',
        coordinates: { lat: 33.4484, lng: -112.0740 },
        radius: 1000,
        type: 'Receiver'
    },
    {
        id: 'GEO-004',
        name: 'Downtown Restricted Zone',
        coordinates: { lat: 41.8820, lng: -87.6278 },
        radius: 500,
        type: 'Restricted'
    }
];

export const MOCK_GEOFENCE_EVENTS: GeofenceEvent[] = [
    {
        id: 'EVT-1001',
        driverId: 'D-101',
        geofenceId: 'GEO-001',
        event: 'Entry',
        timestamp: '10:15 AM'
    },
    {
        id: 'EVT-1002',
        driverId: 'D-102',
        geofenceId: 'GEO-003',
        event: 'Entry',
        timestamp: '09:45 AM'
    },
    {
        id: 'EVT-1003',
        driverId: 'D-104',
        geofenceId: 'GEO-002',
        event: 'Exit',
        timestamp: '08:30 AM'
    }
];

export const MOCK_DAILY_LOGS: DailyLog[] = [
  {
    id: 'LOG-20231026-D102',
    driverId: 'D-102',
    date: '2023-10-26',
    certified: false,
    violations: [],
    milesDriven: 450,
    events: [
      { id: 'E1', status: 'OFF', startTime: '00:00', endTime: '06:00', duration: 360, location: 'St. Louis, MO', vehicleId: 'TRK-005', origin: 'Auto' },
      { id: 'E2', status: 'ON', startTime: '06:00', endTime: '06:30', duration: 30, location: 'St. Louis, MO', vehicleId: 'TRK-005', origin: 'Auto', notes: 'Pre-trip inspection' },
      { id: 'E3', status: 'D', startTime: '06:30', endTime: '10:30', duration: 240, location: 'Kingdom City, MO', vehicleId: 'TRK-005', origin: 'Auto' },
      { id: 'E4', status: 'OFF', startTime: '10:30', endTime: '11:00', duration: 30, location: 'Kingdom City, MO', vehicleId: 'TRK-005', origin: 'Manual', notes: 'Break' },
      { id: 'E5', status: 'D', startTime: '11:00', endTime: 'Now', duration: 0, location: 'Kansas City, MO', vehicleId: 'TRK-005', origin: 'Auto' },
    ]
  }
];

export const MOCK_LOG_EDITS: LogEditRequest[] = [
  {
    id: 'EDIT-1001',
    logId: 'LOG-20231026-D102',
    driverId: 'D-102',
    eventId: 'E4',
    proposedStatus: 'ON',
    proposedStartTime: '10:30',
    proposedLocation: 'Kingdom City, MO',
    reason: 'Driver fueled during break period',
    adminId: 'ADM-001',
    status: 'Pending',
    timestamp: '2023-10-26 12:45'
  }
];

// New Mock Data for FMCSA Features
export const MOCK_CSA_SCORES: CSABasicScore[] = [
  { category: 'Unsafe Driving', score: 15, threshold: 65, status: 'Good', trend: 'Improving' },
  { category: 'Crash Indicator', score: 5, threshold: 65, status: 'Good', trend: 'Improving' },
  { category: 'HOS Compliance', score: 48, threshold: 65, status: 'Warning', trend: 'Worsening' },
  { category: 'Vehicle Maint', score: 32, threshold: 80, status: 'Good', trend: 'Improving' },
  { category: 'Drugs/Alcohol', score: 0, threshold: 80, status: 'Good', trend: 'Improving' },
  { category: 'Hazmat', score: 12, threshold: 80, status: 'Good', trend: 'Improving' },
  { category: 'Driver Fitness', score: 8, threshold: 80, status: 'Good', trend: 'Improving' },
];

export const MOCK_CLEARINGHOUSE: ClearinghouseQuery[] = [
  { driverId: 'D-101', type: 'Annual', status: 'Clear', lastQueryDate: '2023-01-15', nextQueryDue: '2024-01-15' },
  { driverId: 'D-102', type: 'Pre-Employment', status: 'Clear', lastQueryDate: '2023-08-20', nextQueryDue: '2024-08-20' },
  { driverId: 'D-103', type: 'Annual', status: 'Pending', lastQueryDate: '2022-10-15', nextQueryDue: '2023-10-15' },
];

export const MOCK_UNASSIGNED: UnassignedEvent[] = [
  { id: 'UE-001', vehicleId: 'TRK-005', startTime: '2023-10-25 23:15', endTime: '2023-10-25 23:45', location: 'St. Louis, MO', miles: 12, status: 'Pending' },
  { id: 'UE-002', vehicleId: 'TRK-012', startTime: '2023-10-26 04:00', endTime: '2023-10-26 04:10', location: 'Atlanta, GA', miles: 3, status: 'Annotated' },
];

export const MOCK_IFTA: IFTAEntry[] = [
  { jurisdiction: 'IL', totalMiles: 4500, taxableMiles: 4500, fuelPurchased: 750, fuelTaxPaid: 450.00, mpg: 6.0, taxDue: 50.00 },
  { jurisdiction: 'IN', totalMiles: 3200, taxableMiles: 3200, fuelPurchased: 400, fuelTaxPaid: 210.00, mpg: 6.2, taxDue: 120.00 },
  { jurisdiction: 'MO', totalMiles: 1800, taxableMiles: 1800, fuelPurchased: 300, fuelTaxPaid: 150.00, mpg: 6.0, taxDue: -20.00 }, // Credit
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'ALT-01', type: 'Late', message: 'Driver Sarah Connor is 2 hours behind schedule for L-5003', priority: 'High', timestamp: '10 min ago' },
  { id: 'ALT-02', type: 'Compliance', message: 'Driver Mike Ross has missing POD for L-5003', priority: 'Medium', timestamp: '1 hr ago' },
  { id: 'ALT-03', type: 'Maintenance', message: 'TRK-012 Critical Engine Fault detected', priority: 'High', timestamp: '2 hrs ago' },
  { id: 'ALT-04', type: 'Billing', message: '3 Invoices are overdue > 45 days', priority: 'Low', timestamp: '4 hrs ago' },
];

export const MOCK_TASKS: Task[] = [
  { id: 'TSK-01', text: 'Call Acme Steel about detention time', completed: false, dueDate: 'Today' },
  { id: 'TSK-02', text: 'Review Driver Applications (2)', completed: false, dueDate: 'Tomorrow' },
  { id: 'TSK-03', text: 'Submit IFTA Report for Q3', completed: true, dueDate: 'Yesterday' },
  { id: 'TSK-04', text: 'Schedule PM B for TRK-005', completed: false, dueDate: 'Next Week' },
];

export const MOCK_APPLICANTS: Applicant[] = [
    { id: 'APP-01', name: 'Robert Davis', stage: 'New', experienceYears: 12, licenseType: 'Class A', applicationDate: '2023-10-25', notes: 'Heavy haul experience', avatar: 'https://picsum.photos/id/1062/60/60' },
    { id: 'APP-02', name: 'Maria Garcia', stage: 'Screening', experienceYears: 3, licenseType: 'Class A', applicationDate: '2023-10-24', notes: 'Waiting on PSP', avatar: 'https://picsum.photos/id/1074/60/60' },
    { id: 'APP-03', name: 'James Wilson', stage: 'Interview', experienceYears: 5, licenseType: 'Class A', applicationDate: '2023-10-22', notes: 'Scheduled for Fri', avatar: 'https://picsum.photos/id/1025/60/60' },
    { id: 'APP-04', name: 'Linda Chen', stage: 'Offer', experienceYears: 8, licenseType: 'Class A', applicationDate: '2023-10-15', notes: 'Offer sent $0.65/mi', avatar: 'https://picsum.photos/id/1013/60/60' },
    { id: 'APP-05', name: 'Tom Baker', stage: 'Hired', experienceYears: 20, licenseType: 'Class A', applicationDate: '2023-10-10', notes: 'Orientation Monday', avatar: 'https://picsum.photos/id/1003/60/60' },
];

export const MOCK_YARD_SPOTS: YardSpot[] = [
    { id: 'D-01', name: 'Dock 1', type: 'Dock', occupied: true, trailerId: 'TRL-501' },
    { id: 'D-02', name: 'Dock 2', type: 'Dock', occupied: false },
    { id: 'D-03', name: 'Dock 3', type: 'Dock', occupied: true, trailerId: 'TRL-505' },
    { id: 'P-01', name: 'Spot 101', type: 'Parking', occupied: true, trailerId: 'TRL-900' },
    { id: 'P-02', name: 'Spot 102', type: 'Parking', occupied: true, trailerId: 'TRL-902' },
    { id: 'P-03', name: 'Spot 103', type: 'Parking', occupied: false },
    { id: 'P-04', name: 'Spot 104', type: 'Parking', occupied: true, trailerId: 'TRL-101' },
];

export const MOCK_TRAILERS: Trailer[] = [
    { id: 'TRL-501', number: '53001', type: 'Dry Van', status: 'Loaded', contents: 'Acme Steel - 42k' },
    { id: 'TRL-505', number: '53005', type: 'Reefer', status: 'Empty' },
    { id: 'TRL-900', number: '53099', type: 'Dry Van', status: 'Repair', contents: 'Broken landing gear' },
    { id: 'TRL-902', number: '53102', type: 'Flatbed', status: 'Loaded', contents: 'Lumber' },
    { id: 'TRL-101', number: '53200', type: 'Dry Van', status: 'Empty' },
];