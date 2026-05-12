import React, { useState, useEffect } from 'react';
import { BarChart, Clock, Wallet, Plus, Trash2, Save, X } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData, InvestmentItem } from '../types';
import { motion } from 'motion/react';

type BepRoiProps = {
  data: AppData;
  setData: (data: AppData) => void;
  calculations: any;
  updateInvestments: (items: InvestmentItem[]) => void;
};

export const BepRoi: React.FC<BepRoiProps> = ({ data, calculations, updateInvestments }) => {
  const { totalFixedMonthly, hppPerUnitFinal, totalInvestment, variableCostPerUnit } = calculations;
  
  const [draftInvestments, setDraftInvestments] = useState<InvestmentItem[]>(data.investments);

  // Sync draft state with data prop when it changes
  useEffect(() => {
    setDraftInvestments(data.investments);
  }, [data.investments]);

  const hasInvestChanges = JSON.stringify(draftInvestments) !== JSON.stringify(data.investments);

  const saveInvest = () => {
    updateInvestments(draftInvestments);
  };

  const cancelInvest = () => {
    setDraftInvestments(data.investments);
  };

  // Calculate BEP for Retail Price based on DRAFT if possible, but calculations use REAL data.
  // Actually, BEP/ROI is viewing Real data. Only Investments is editable here.
  
  const retailPrice = hppPerUnitFinal * (1 + data.priceLevels[0].markupPercent / 100);
  const contributionMargin = retailPrice - variableCostPerUnit;
  const bepUnit = Math.ceil(totalFixedMonthly / contributionMargin);
  const bepRp = bepUnit * retailPrice;
  const dailyProd = calculations.unitsPerMonth / 25; // Working 25 days/mo
  const bepDays = Math.ceil(bepUnit / dailyProd);

  // ROI Calculations
  const monthlyProfit = (retailPrice - hppPerUnitFinal) * calculations.unitsPerMonth;
  const roiMonthly = (monthlyProfit / totalInvestment) * 100;
  const paybackMonths = totalInvestment / monthlyProfit;

  return (
    <div className="space-y-8">
      {/* BEP Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart className="text-accent-primary" /> Analisis Break Even Point (BEP)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 bg-accent-primary/5 border-accent-primary/20">
            <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest font-bold">BEP Unit</p>
            <p className="text-4xl font-bold text-accent-primary">{bepUnit}</p>
            <p className="text-[10px] text-slate-500 mt-2">Unit yang harus terjual (Retail) untuk balik modal operasional</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest font-bold">BEP Rupiah</p>
            <p className="text-3xl font-bold text-white">{formatRupiah(bepRp)}</p>
            <p className="text-[10px] text-slate-500 mt-2">Target omzet bulanan minimal pada harga retail</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest font-bold">BEP dalam Hari</p>
            <p className="text-3xl font-bold text-white">{bepDays} Hari</p>
            <p className="text-[10px] text-slate-500 mt-2">Target tercapai pada hari ke-{bepDays} setiap bulannya</p>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="text-accent-secondary" /> Analisis ROI & Investasi
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
             <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold">Item Investasi Awal</h3>
                  {hasInvestChanges && <p className="text-[10px] text-accent-primary font-bold animate-pulse">PERUBAHAN BELUM TERSIMPAN</p>}
                </div>
                <div className="flex gap-2">
                  {hasInvestChanges && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                      <button onClick={saveInvest} className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"><Save className="w-3 h-3" /> Simpan</button>
                      <button onClick={cancelInvest} className="flex items-center gap-2 bg-accent-danger/20 text-accent-danger px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-accent-danger hover:text-white transition-all"><X className="w-3 h-3" /> Batal</button>
                    </motion.div>
                  )}
                  <button 
                    onClick={() => setDraftInvestments([...draftInvestments, { id: Math.random().toString(), name: '', value: 0, usefulLife: 3 }])}
                    className="btn-primary py-1.5 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah
                  </button>
                </div>
             </div>
             <table className="w-full text-xs">
                <thead className="text-slate-500 border-b border-border-main">
                   <tr>
                      <th className="pb-2 text-left px-1">Komponen</th>
                      <th className="pb-2 text-right px-1">Nilai (Rp)</th>
                      <th className="pb-2 text-right px-1 w-8"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                   {draftInvestments.map((iv, i) => (
                      <tr key={iv.id} className="hover:bg-white/5 group transition-colors">
                         <td className="py-2 px-1"><input type="text" value={iv.name || ''} onChange={e => {
                           const n = [...draftInvestments]; n[i].name = e.target.value; setDraftInvestments(n);
                         }} className="input-inline w-full border-transparent focus:border-accent-primary" placeholder="Contoh: Mesin Oven" /></td>
                         <td className="py-2 text-right px-1"><input type="number" value={iv.value || 0} onChange={e => {
                           const n = [...draftInvestments]; n[i].value = Number(e.target.value); setDraftInvestments(n);
                         }} className="input-inline w-24 text-right border-transparent focus:border-accent-primary" /></td>
                         <td className="py-2 text-right px-1"><button onClick={() => setDraftInvestments(draftInvestments.filter(item => item.id !== iv.id))} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3 text-accent-danger" /></button></td>
                      </tr>
                   ))}
                </tbody>
             </table>
             <div className="pt-4 border-t border-border-main flex justify-between">
                <span className="font-bold">Total Investasi Tersimpan</span>
                <span className="font-bold text-accent-primary">{formatRupiah(totalInvestment)}</span>
             </div>
          </div>

          <div className="glass-card p-6 bg-accent-secondary/5 border-accent-secondary/20 flex flex-col justify-between">
             <div className="space-y-6">
               <div>
                  <p className="text-slate-400 text-xs mb-1 uppercase">ROI Tahunan (Estimasi)</p>
                  <p className="text-5xl font-bold text-accent-secondary">{(roiMonthly * 12).toFixed(1)}%</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                   <div>
                      <p className="text-slate-500 text-[10px] uppercase">Laba Bersih / Bln</p>
                      <p className="text-lg font-bold">{formatRupiah(monthlyProfit)}</p>
                   </div>
                   <div>
                      <p className="text-slate-500 text-[10px] uppercase">ROI Bulanan</p>
                      <p className="text-lg font-bold">{roiMonthly.toFixed(1)}%</p>
                   </div>
               </div>
             </div>
             <div className="mt-8 p-4 bg-bg-primary rounded-lg border border-accent-secondary/30 flex items-center gap-4">
                <Clock className="w-8 h-8 text-accent-secondary" />
                <div>
                   <p className="text-xs text-slate-400">Payback Period (Balik Modal)</p>
                   <p className="text-xl font-bold">{paybackMonths.toFixed(1)} Bulan ({Math.floor(paybackMonths / 12)} Thn {Math.ceil(paybackMonths % 12)} Bln)</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
