import { useState, useEffect, useMemo } from 'react';
import { AppData, RawMaterial, LaborCost, OverheadCost, NonProductionCost, PriceLevel, InvestmentItem } from '../types';
import { INITIAL_DATA } from '../constants';

export function useHppData() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('costmaster_pro_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('costmaster_pro_data', JSON.stringify(data));
  }, [data]);

  const calculations = useMemo(() => {
    // 1. Material Calculations
    const totalMaterialBatch = data.materials.reduce((acc, m) => acc + (m.qty * m.pricePerUnit), 0) * data.batchesPerProduction;
    const materialPerUnit = totalMaterialBatch / (data.batchesPerProduction * data.production.unitsPerBatch);

    // 2. Labor Calculations
    const totalLaborBatch = data.laborCosts.reduce((acc, l) => acc + (l.count * l.wagePerHour * l.hoursPerBatch), 0);
    const laborPerUnit = totalLaborBatch / data.production.unitsPerBatch;

    // 3. Overhead Calculations
    const totalMonthlyOverhead = data.overheadCosts.reduce((acc, o) => acc + (o.monthlyValue * (o.allocationPercent / 100)), 0);
    const totalBatchesPerMonth = data.production.batchesPerMonth;
    const overheadPerBatch = totalMonthlyOverhead / totalBatchesPerMonth;
    const overheadPerUnit = overheadPerBatch / data.production.unitsPerBatch;

    // 4. Non-Production Calculations
    const totalMonthlyNonProduction = data.nonProductionCosts.reduce((acc, n) => acc + n.monthlyValue, 0);
    const unitsPerMonth = data.production.unitsPerBatch * data.production.batchesPerMonth;
    const nonProductionPerUnit = totalMonthlyNonProduction / unitsPerMonth;

    // 5. Total HPP & Waste
    const baseHppPerUnit = materialPerUnit + laborPerUnit + overheadPerUnit + nonProductionPerUnit;
    const wasteCost = baseHppPerUnit * (data.production.wastePercent / 100);
    const hppPerUnitFinal = baseHppPerUnit + wasteCost;

    const totalCostPerMonth = hppPerUnitFinal * unitsPerMonth;

    // 6. BEP & ROI
    const totalFixedMonthly = data.overheadCosts
      .filter(o => o.type === 'Tetap')
      .reduce((acc, o) => acc + (o.monthlyValue * (o.allocationPercent / 100)), 0) + 
      data.nonProductionCosts.filter(n => n.category === 'Admin').reduce((acc, n) => acc + n.monthlyValue, 0);
    
    const variableCostPerUnit = materialPerUnit + laborPerUnit + 
      (data.overheadCosts.filter(o => o.type === 'Variabel').reduce((acc, o) => acc + (o.monthlyValue * (o.allocationPercent / 100)), 0) / unitsPerMonth);

    const totalInvestment = data.investments.reduce((acc, i) => acc + i.value, 0);

    return {
      totalMaterialBatch,
      materialPerUnit,
      laborPerUnit,
      overheadPerUnit,
      nonProductionPerUnit,
      baseHppPerUnit,
      hppPerUnitFinal,
      totalCostPerMonth,
      totalFixedMonthly,
      variableCostPerUnit,
      totalInvestment,
      unitsPerMonth
    };
  }, [data]);

  const updateProduction = (updates: Partial<AppData['production']>) => {
    setData(prev => ({ ...prev, production: { ...prev.production, ...updates } }));
  };

  const updateMaterials = (materials: RawMaterial[]) => setData(prev => ({ ...prev, materials }));
  const updateLabor = (laborCosts: LaborCost[]) => setData(prev => ({ ...prev, laborCosts }));
  const updateOverhead = (overheadCosts: OverheadCost[]) => setData(prev => ({ ...prev, overheadCosts }));
  const updateNonProduction = (nonProductionCosts: NonProductionCost[]) => setData(prev => ({ ...prev, nonProductionCosts }));
  const updatePriceLevels = (priceLevels: PriceLevel[]) => setData(prev => ({ ...prev, priceLevels }));
  const updateInvestments = (investments: InvestmentItem[]) => setData(prev => ({ ...prev, investments }));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `costmaster-pro-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      setData(imported);
    } catch (e) {
      alert('Format file tidak valid!');
    }
  };

  return {
    data,
    calculations,
    updateProduction,
    updateMaterials,
    updateLabor,
    updateOverhead,
    updateNonProduction,
    updatePriceLevels,
    updateInvestments,
    exportData,
    importData,
    resetData: () => setData(INITIAL_DATA)
  };
}
