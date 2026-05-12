import React, { useState, useEffect } from 'react';
import { Package, LayoutGrid, Save, X } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData } from '../types';
import { motion } from 'motion/react';

type ProductionResultsProps = {
  data: AppData;
  setData: (data: AppData) => void;
  calculations: any;
  updateProduction: (updates: Partial<AppData['production']>) => void;
};

export const ProductionResults: React.FC<ProductionResultsProps> = ({ data, calculations, updateProduction }) => {
  const [draft, setDraft] = useState<AppData['production']>(data.production);

  // Sync draft state with data prop when it changes
  useEffect(() => {
    setDraft(data.production);
  }, [data.production]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(data.production);

  const saveChanges = () => {
    updateProduction(draft);
  };

  const cancelChanges = () => {
    setDraft(data.production);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-border-main">
        <div>
          <h2 className="text-xl font-bold">Kapabilitas & Hasil Produksi</h2>
          {hasChanges && <p className="text-[10px] text-accent-primary font-bold animate-pulse">ADA PERUBAHAN BELUM TERSIMPAN</p>}
        </div>
        {hasChanges && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-2">
            <button 
              onClick={saveChanges}
              className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" /> Simpan
            </button>
            <button 
              onClick={cancelChanges}
              className="flex items-center gap-2 bg-accent-danger/20 text-accent-danger px-6 py-2 rounded-lg text-sm font-bold hover:bg-accent-danger hover:text-white transition-all"
            >
              <X className="w-4 h-4" /> Batal
            </button>
          </motion.div>
        )}
      </div>

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
              <input type="text" value={draft.productName || ''} onChange={e => setDraft({ ...draft, productName: e.target.value })} className="input-inline bg-white/5 border border-border-main p-2 outline-none rounded-lg focus:border-accent-primary transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Unit per Batch</label>
                <input type="number" value={draft.unitsPerBatch || 0} onChange={e => setDraft({ ...draft, unitsPerBatch: Number(e.target.value) })} className="input-inline bg-white/5 border border-border-main p-2 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Batch per Bulan</label>
                <input type="number" value={draft.batchesPerMonth || 0} onChange={e => setDraft({ ...draft, batchesPerMonth: Number(e.target.value) })} className="input-inline bg-white/5 border border-border-main p-2 rounded-lg" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-400 mb-1">Kapasitas Maksimum (Unit/Bulan)</label>
              <input type="number" value={draft.maxCapacity || 0} onChange={e => setDraft({ ...draft, maxCapacity: Number(e.target.value) })} className="input-inline bg-white/5 border border-border-main p-2 rounded-lg" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400">Target Utilisasi (%)</label>
                <span className="text-xs font-bold text-accent-primary">{draft.utilization || 0}%</span>
              </div>
              <input type="range" min="0" max="100" value={draft.utilization || 0} onChange={e => setDraft({ ...draft, utilization: Number(e.target.value) })} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-primary" />
            </div>

             <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400">Resiko Waste/Gagal Prod (%)</label>
                <span className="text-xs font-bold text-accent-danger">{draft.wastePercent || 0}%</span>
              </div>
              <input type="range" min="0" max="25" value={draft.wastePercent || 0} onChange={e => setDraft({ ...draft, wastePercent: Number(e.target.value) })} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-danger" />
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-l-4 border-accent-primary bg-accent-primary/5">
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Output Produksi Aktual</h4>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase">Unit/Bulan</p>
                  <p className="text-2xl font-bold">{calculations.unitsPerMonth}</p>
               </div>
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase">Utilisasi</p>
                  <p className="text-2xl font-bold text-accent-primary">{(calculations.unitsPerMonth / draft.maxCapacity * 100).toFixed(1)}%</p>
               </div>
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase">Biaya Var/Unit</p>
                  <p className="text-lg font-bold">{formatRupiah(calculations.variableCostPerUnit)}</p>
               </div>
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
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
                <span className="text-slate-400 text-sm">Biaya Waste ({draft.wastePercent}%)</span>
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
