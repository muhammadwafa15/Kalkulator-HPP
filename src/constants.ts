import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  materials: [
    { id: '1', name: 'Tepung terigu', unit: 'kg', qty: 2, pricePerUnit: 12000, note: '-' },
    { id: '2', name: 'Gula pasir', unit: 'kg', qty: 0.5, pricePerUnit: 15000, note: '-' },
    { id: '3', name: 'Telur', unit: 'butir', qty: 6, pricePerUnit: 2500, note: '-' },
    { id: '4', name: 'Mentega', unit: 'gram', qty: 200, pricePerUnit: 80, note: '-' },
    { id: '5', name: 'Vanili', unit: 'sachet', qty: 2, pricePerUnit: 1500, note: '-' },
  ],
  batchesPerProduction: 1,
  laborCosts: [
    { id: '1', position: 'Produksi Utama', count: 1, wagePerHour: 15000, hoursPerBatch: 4 },
  ],
  overheadCosts: [
    { id: '1', name: 'Listrik & Air', type: 'Variabel', monthlyValue: 200000, allocationPercent: 80 },
    { id: '2', name: 'Sewa Tempat', type: 'Tetap', monthlyValue: 500000, allocationPercent: 50 },
    { id: '3', name: 'Penyusutan Mesin', type: 'Tetap', monthlyValue: 100000, allocationPercent: 100 },
  ],
  nonProductionCosts: [
    { id: '1', name: 'Pemasaran Ads', category: 'Pemasaran', monthlyValue: 150000 },
    { id: '2', name: 'Ongkir Pengiriman', category: 'Distribusi', monthlyValue: 100000 },
  ],
  production: {
    productName: 'Kue Lapis Premium',
    unitsPerBatch: 20,
    batchesPerMonth: 25,
    maxCapacity: 1000,
    utilization: 50,
    wastePercent: 5,
  },
  priceLevels: [
    { id: '1', name: 'Retail', minOrder: 1, markupPercent: 50, isEditable: true },
    { id: '2', name: 'Semi-grosir', minOrder: 11, markupPercent: 35, isEditable: true },
    { id: '3', name: 'Grosir Kecil', minOrder: 51, markupPercent: 25, isEditable: true },
    { id: '4', name: 'Grosir Besar', minOrder: 101, markupPercent: 15, isEditable: true },
    { id: '5', name: 'Distributor', minOrder: 501, markupPercent: 10, isEditable: true },
  ],
  investments: [
    { id: '1', name: 'Mesin Mixer & Oven', value: 5000000, usefulLife: 3 },
    { id: '2', name: 'Setup Dapur', value: 2000000, usefulLife: 2 },
  ],
};
