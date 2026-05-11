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

export type AppData = {
  materials: RawMaterial[];
  batchesPerProduction: number;
  laborCosts: LaborCost[];
  overheadCosts: OverheadCost[];
  nonProductionCosts: NonProductionCost[];
  production: ProductionResult;
  priceLevels: PriceLevel[];
  investments: InvestmentItem[];
};
