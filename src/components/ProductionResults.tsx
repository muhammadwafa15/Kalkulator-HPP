import React from 'react';
import { Package, Percent, LayoutGrid, Info } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData } from '../types';

type ProductionResultsProps = {
  data: AppData;
  calculations: any;
  updateProduction: (updates: Partial<AppData['production']>) => void;
};

export const ProductionResults: React.FC<ProductionResultsProps> = ({ data, calculations, updateProduction }) => {
  const p = data.production;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-accent-primary mb-4">
            <Package className="w-5 h-5" />
            <h3 className="font-bold text-lg">Input Kapasitas & Target</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-xs text-slate-400 mb-1">Nama Produk</label>
              <input type="text" value={p.productName} onChange={e => updateProduction({ productName: e.target.value })} className="input-inline bg-white/5 border border-border-main p-2 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Unit per Batch</label>
                <input type="number" value={p.unitsPerBatch} onChange={e => updateProduction({ unitsPerBatch: Number(e.target.value) })} className="input-inline bg-white/5 border border-border-main p-2" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Batch per Bulan</label>
                <input type="number" value={p.batchesPerMonth} onChange={e => updateProduction({ batchesPerMonth: Number(e.target.value) })} className="input-inline bg-white/5 border border-border-main p-2" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-400 mb-1">Kapasitas Maksimum (Unit/Bulan)</label>
              <input type="number" value={p.maxCapacity} onChange={e => updateProduction({ maxCapacity: Number(e.target.value) })} className="input-inline bg-white/5 border border-border-main p-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400">Target Utilisasi (%)</label>
                <span className="text-xs font-bold text-accent-primary">{p.utilization}%</span>
              </div>
              <input type="range" min="0" max="100" value={p.utilization} onChange={e => updateProduction({ utilization: Number(e.target.value) })} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-primary" />
            </div>

             <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400">Resiko Waste/Gagal Prod (%)</label>
                <span className="text-xs font-bold text-accent-danger">{p.wastePercent}%</span>
              </div>
              <input type="range" min="0" max="25" value={p.wastePercent} onChange={e => updateProduction({ wastePercent: Number(e.target.value) })} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-danger" />
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-l-4 border-accent-primary bg-accent-primary/5">
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Output Produksi Aktual</h4>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase">Unit/Bulan</p>
                  <p className="text-2xl font-bold">{calculations.unitsPerMonth}</p>
               </div>
               <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase">Utilisasi</p>
                  <p className="text-2xl font-bold text-accent-primary">{(calculations.unitsPerMonth / p.maxCapacity * 100).toFixed(1)}%</p>
               </div>
               <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase">Biaya Var/Unit</p>
                  <p className="text-lg font-bold">{formatRupiah(calculations.variableCostPerUnit)}</p>
               </div>
               <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase">Fixed Monthly</p>
                  <p className="text-lg font-bold">{formatRupiah(calculations.totalFixedMonthly)}</p>
               </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-lg">Analisis Produksi</h4>
              <LayoutGrid className="text-slate-500 w-5 h-5" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">HPP (Awal)</span>
                <span className="font-semibold">{formatRupiah(calculations.baseHppPerUnit)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-main">
                <span className="text-slate-400 text-sm">Biaya Waste ({p.wastePercent}%)</span>
                <span className="font-semibold text-accent-danger">+{formatRupiah(calculations.hppPerUnitFinal - calculations.baseHppPerUnit)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-white font-bold">HPP Final</span>
                <span className="text-xl font-bold text-accent-primary">{formatRupiah(calculations.hppPerUnitFinal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
