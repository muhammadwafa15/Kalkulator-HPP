export type RawMaterial = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  pricePerUnit: number;
  note: string;
};

export type LaborCost = {
  id: string;
  position: string;
  count: number;
  wagePerHour: number;
  hoursPerBatch: number;
};

export type OverheadCost = {
  id: string;
  name: string;
  type: 'Tetap' | 'Variabel';
  monthlyValue: number;
  allocationPercent: number;
};

export type NonProductionCost = {
  id: string;
  name: string;
  category: 'Pemasaran' | 'Admin' | 'Distribusi';
  monthlyValue: number;
};

export type ProductionResult = {
  productName: string;
  unitsPerBatch: number;
  batchesPerMonth: number;
  maxCapacity: number;
  utilization: number;
  wastePercent: number;
};

export type PriceLevel = {
  id: string;
  name: string;
  minOrder: number;
  markupPercent: number;
  isEditable: boolean;
};

export type InvestmentItem = {
  id: string;
  name: string;
  value: number;
  usefulLife: number; // in years
};

export type UserRole = 'owner' | 'member';

export type UpgradeRequest = {
  packageId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  paymentLink?: string;
};

export type UserAccount = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
  activeUntil: string; // ISO date string
  enabledFeatures: string[]; // List of feature IDs
  status: 'active' | 'expired' | 'pending';
  upgradeRequest?: UpgradeRequest;
};

export type DomainStatus = 'not_configured' | 'pending' | 'active' | 'error';

export type OwnerSettings = {
  logoUrl?: string;
  whatsappNumber: string;
  isWhatsappEnabled: boolean;
  customDomain?: string;
  domainStatus?: DomainStatus;
  primaryColor: string;
};

export type Recipe = {
  id: string;
  name: string;
  hppPerUnit: number;
  totalCost: number;
  unitsPerBatch: number;
  batchesPerMonth: number;
  materials: RawMaterial[];
  laborCosts: LaborCost[];
  overheadCosts: OverheadCost[];
  createdAt: string;
};

export type AppData = {
  materials: RawMaterial[];
  batchesPerProduction: number;
  laborCosts: LaborCost[];
  overheadCosts: OverheadCost[];
  nonProductionCosts: NonProductionCost[];
  production: ProductionResult;
  priceLevels: PriceLevel[];
  investments: InvestmentItem[];
  recipes?: Recipe[];
};
