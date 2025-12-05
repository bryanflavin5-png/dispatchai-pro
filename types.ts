
export enum LoadStatus {
  PENDING = 'Pending',
  DISPATCHED = 'Dispatched',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum DriverStatus {
  AVAILABLE = 'Available',
  ON_LOAD = 'On Load',
  OFF_DUTY = 'Off Duty',
  MAINTENANCE = 'Maintenance'
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  FACTORING_SUBMITTED = 'Factoring Submitted',
  FACTORING_FUNDED = 'Factoring Funded'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HOSClocks {
  status: 'OFF' | 'SB' | 'D' | 'ON';
  driveTimeRemaining: number; // minutes
  onDutyRemaining: number; // minutes
  cycleRemaining: number; // minutes (70hr/8day)
}

export interface VehicleTelemetry {
  fuelLevel: number; // percentage 0-100
  odometer: number;
  engineHours: number;
  healthStatus: 'Healthy' | 'Warning' | 'Critical';
  defects: number; // count of open DVIR defects
  nextServiceDate: string;
}

export interface Driver {
  id: string;
  name: string;
  truckId: string;
  status: DriverStatus;
  currentLocation: string; // City, State
  coordinates: Coordinates;
  phone: string;
  email?: string;
  avatar: string;
  hos: HOSClocks;
  vehicle: VehicleTelemetry;
  hazmatEndorsed: boolean;
  licenseNumber?: string;
  hireDate?: string;
}

export interface Truck {
  id: string; // e.g. TRK-001
  make: string;
  model: string;
  year: number;
  vin: string;
  plate: string;
  status: 'Active' | 'Maintenance' | 'OutOfService';
  assignedDriverId?: string;
  mileage: number;
  purchaseDate: string;
}

export interface LoadDocument {
  type: 'BOL' | 'POD' | 'RateCon' | 'Lumper';
  status: 'Missing' | 'Uploaded' | 'Approved';
  url?: string;
}

export interface Load {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  rate: number;
  weight: number;
  status: LoadStatus;
  assignedDriverId?: string;
  commodity: string;
  originCoords?: Coordinates;
  destinationCoords?: Coordinates;
  documents: LoadDocument[];
  hazmat?: {
    class: string; // e.g., "3", "2.1"
    unNumber: string; // e.g., "1203"
    placardRequired: boolean;
  };
}

export interface Invoice {
  id: string;
  loadId: string;
  customer: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  agingDays: number; // How many days open
}

export interface Expense {
  id: string;
  category: 'Fuel' | 'Maintenance' | 'Insurance' | 'Tolls' | 'Lumper' | 'Office';
  amount: number;
  date: string;
  vendor: string;
  description: string;
  truckId?: string; // If assignable to a specific asset
}

export interface Settlement {
  id: string;
  driverId: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  deductions: {
    fuel: number;
    advances: number;
    insurance: number;
    other: number;
  };
  netPay: number;
  status: 'Pending' | 'Approved' | 'Paid';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DriverMessage {
  id: string;
  driverId: string;
  direction: 'Inbound' | 'Outbound';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SafetyIncident {
  id: string;
  driverId: string;
  date: string;
  type: 'Accident' | 'Speeding' | 'HOS Violation' | 'DOT Inspection' | 'Vehicle Maintenance';
  description: string;
  status: 'Open' | 'Under Review' | 'Closed';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

// Enterprise Safety Features
export interface TelematicsMetrics {
  harshBraking: number;
  rapidAccel: number;
  harshCornering: number;
  speedingEvents: number;
  seatbeltViolations: number;
}

export interface DQFile {
  driverId: string;
  application: 'Verified' | 'Missing';
  mvr: 'Current' | 'Expiring' | 'Expired';
  medicalCard: 'Current' | 'Expiring' | 'Expired';
  cdl: 'Current' | 'Expiring' | 'Expired';
  annualReview: 'Completed' | 'Overdue';
  pspReport: 'On File' | 'Missing';
}

export interface CoachingSession {
  id: string;
  driverId: string;
  incidentId?: string;
  topic: 'Speeding' | 'Cornering' | 'Logbook' | 'Inspection';
  status: 'Assigned' | 'Completed' | 'Overdue';
  dueDate: string;
}

export interface SafetyProfile {
  driverId: string;
  safetyScore: number; // 0-100
  telematics: TelematicsMetrics;
  dqFileStatus: 'Audit Ready' | 'Incomplete' | 'Critical';
}

// FMCSA Advanced Features
export interface CSABasicScore {
  category: 'Unsafe Driving' | 'Crash Indicator' | 'HOS Compliance' | 'Vehicle Maint' | 'Drugs/Alcohol' | 'Hazmat' | 'Driver Fitness';
  score: number; // Percentile
  threshold: number; // Alert threshold
  status: 'Good' | 'Warning' | 'Alert';
  trend: 'Improving' | 'Worsening';
}

export interface ClearinghouseQuery {
  driverId: string;
  type: 'Pre-Employment' | 'Annual';
  status: 'Pending' | 'Clear' | 'Prohibited';
  lastQueryDate: string;
  nextQueryDue: string;
}

export interface UnassignedEvent {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  location: string;
  miles: number;
  status: 'Pending' | 'Assigned' | 'Annotated';
  assignedDriverId?: string;
}

export interface IFTAEntry {
  jurisdiction: string; // State/Province code
  totalMiles: number;
  taxableMiles: number;
  fuelPurchased: number; // Gallons
  fuelTaxPaid: number;
  mpg: number;
  taxDue: number; // Calculated field
}

// ELD / HOS Log Features
export type ELDStatus = 'OFF' | 'SB' | 'D' | 'ON';

export interface ELDEvent {
  id: string;
  status: ELDStatus;
  startTime: string; // HH:mm
  endTime: string; // HH:mm or 'Now'
  duration: number; // minutes
  location: string;
  vehicleId: string;
  origin: 'Auto' | 'Manual';
  notes?: string;
}

export interface DailyLog {
  id: string;
  driverId: string;
  date: string;
  events: ELDEvent[];
  certified: boolean;
  violations: string[]; // e.g., "11 Hour Rule", "14 Hour Rule"
  milesDriven: number;
}

export interface LogEditRequest {
  id: string;
  logId: string;
  driverId: string;
  eventId: string;
  proposedStatus: ELDStatus;
  proposedStartTime: string;
  proposedLocation: string;
  reason: string;
  adminId: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  timestamp: string;
}

// TMT Features: Parts & Work Orders
export interface Part {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  category: 'Filter' | 'Brake' | 'Fluid' | 'Tire' | 'Electrical';
  location: string;
}

export interface WorkOrder {
  id: string;
  truckId: string;
  type: 'PM A' | 'PM B' | 'Repair' | 'Inspection';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  date: string;
  description: string;
  mechanic?: string;
  laborHours: number;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  warrantyClaim: boolean;
}

export type MaintenanceRecord = WorkOrder;

// TPP Features: Lane Analytics & Procurement
export interface LaneMetric {
  id: string;
  origin: string;
  destination: string;
  avgMarketRate: number;
  avgMyRate: number;
  volume: number;
  tenderAcceptance: number;
  balance: 'Headhaul' | 'Backhaul' | 'Neutral';
}

export interface RFP {
  id: string;
  customer: string;
  lane: string;
  volume: number;
  status: 'Active' | 'Submitted' | 'Won' | 'Lost';
  dueDate: string;
  targetRate: number;
}

// Geofencing Features
export interface Geofence {
  id: string;
  name: string;
  coordinates: Coordinates;
  radius: number;
  type: 'Yard' | 'Shipper' | 'Receiver' | 'Restricted';
}

export interface GeofenceEvent {
  id: string;
  driverId: string;
  geofenceId: string;
  event: 'Entry' | 'Exit';
  timestamp: string;
}

// Dashboard Features
export interface Alert {
  id: string;
  type: 'Late' | 'Compliance' | 'Maintenance' | 'Billing';
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

// Recruitment / ATS Features
export interface Applicant {
  id: string;
  name: string;
  stage: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  experienceYears: number;
  licenseType: 'Class A' | 'Class B';
  applicationDate: string;
  notes: string;
  avatar: string;
}

// Yard Management (YMS) Features
export interface Trailer {
  id: string;
  number: string;
  type: 'Dry Van' | 'Reefer' | 'Flatbed';
  status: 'Empty' | 'Loaded' | 'Repair';
  contents?: string;
}

export interface YardSpot {
  id: string;
  name: string;
  type: 'Dock' | 'Parking';
  occupied: boolean;
  trailerId?: string;
}

export type ViewState = 'dashboard' | 'dispatch' | 'drivers' | 'analytics' | 'financials' | 'tracking' | 'safety' | 'maintenance' | 'procurement' | 'messages' | 'recruitment' | 'yard' | 'assets';