import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Info, Save, X } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData, LaborCost, OverheadCost, NonProductionCost } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type ProductionCostsProps = {
  data: AppData;
  setData: (data: AppData) => void;
  calculations: any;
  updateLabor: (costs: LaborCost[]) => void;
  updateOverhead: (costs: OverheadCost[]) => void;
  updateNonProduction: (costs: NonProductionCost[]) => void;
};

export const ProductionCosts: React.FC<ProductionCostsProps> = ({ data, calculations, updateLabor, updateOverhead, updateNonProduction }) => {
  const [activeTab, setActiveTab] = useState<'btkl' | 'bop' | 'non'>('btkl');
  
  // Draft States
  const [draftLabor, setDraftLabor] = useState<LaborCost[]>(data.laborCosts);
  const [draftOverhead, setDraftOverhead] = useState<OverheadCost[]>(data.overheadCosts);
  const [draftNonProduction, setDraftNonProduction] = useState<NonProductionCost[]>(data.nonProductionCosts);

  // Sync draft states when data prop changes
  useEffect(() => {
    setDraftLabor(data.laborCosts);
    setDraftOverhead(data.overheadCosts);
    setDraftNonProduction(data.nonProductionCosts);
  }, [data.laborCosts, data.overheadCosts, data.nonProductionCosts]);

  // Check for changes
  const hasLaborChanges = JSON.stringify(draftLabor) !== JSON.stringify(data.laborCosts);
  const hasOverheadChanges = JSON.stringify(draftOverhead) !== JSON.stringify(data.overheadCosts);
  const hasNonProdChanges = JSON.stringify(draftNonProduction) !== JSON.stringify(data.nonProductionCosts);

  const saveLabor = () => {
    updateLabor(draftLabor);
  };

  const cancelLabor = () => {
    setDraftLabor(data.laborCosts);
  };

  const saveOverhead = () => {
    updateOverhead(draftOverhead);
  };

  const cancelOverhead = () => {
    setDraftOverhead(data.overheadCosts);
  };

  const saveNonProduction = () => {
    updateNonProduction(draftNonProduction);
  };

  const cancelNonProduction = () => {
    setDraftNonProduction(data.nonProductionCosts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Biaya Operasional & Overhead</h2>
      </div>

      <div className="flex bg-white/5 p-1 rounded-xl w-fit border border-border-main">
        <button onClick={() => setActiveTab('btkl')} className={cn("px-6 py-2 rounded-lg font-medium transition-all relative", activeTab === 'btkl' ? "bg-accent-primary text-bg-primary" : "text-slate-400 hover:text-white")}>
          Tenaga Kerja (BTKL)
          {hasLaborChanges && <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-primary rounded-full border-2 border-bg-primary animate-pulse" />}
        </button>
        <button onClick={() => setActiveTab('bop')} className={cn("px-6 py-2 rounded-lg font-medium transition-all relative", activeTab === 'bop' ? "bg-accent-primary text-bg-primary" : "text-slate-400 hover:text-white")}>
          Overhead (BOP)
          {hasOverheadChanges && <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-primary rounded-full border-2 border-bg-primary animate-pulse" />}
        </button>
        <button onClick={() => setActiveTab('non')} className={cn("px-6 py-2 rounded-lg font-medium transition-all relative", activeTab === 'non' ? "bg-accent-primary text-bg-primary" : "text-slate-400 hover:text-white")}>
          Non-Produksi
          {hasNonProdChanges && <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-primary rounded-full border-2 border-bg-primary animate-pulse" />}
        </button>
      </div>

      <div className="glass-card">
        {activeTab === 'btkl' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Biaya Tenaga Kerja Langsung</h3>
                {hasLaborChanges && <p className="text-[10px] text-accent-primary font-bold animate-pulse">ADA PERUBAHAN BELUM TERSIMPAN</p>}
              </div>
              <div className="flex gap-2">
                {hasLaborChanges && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                    <button onClick={saveLabor} className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all"><Save className="w-4 h-4" /> Simpan</button>
                    <button onClick={cancelLabor} className="flex items-center gap-2 bg-accent-danger/20 text-accent-danger px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-accent-danger hover:text-white transition-all"><X className="w-4 h-4" /> Batal</button>
                  </motion.div>
                )}
                <button onClick={() => setDraftLabor([...draftLabor, { id: Math.random().toString(), position: '', count: 1, wagePerHour: 0, hoursPerBatch: 0 }])} className="btn-primary py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah</button>
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-border-main">
                  <th className="pb-3 px-2">Posisi/Pekerjaan</th>
                  <th className="pb-3 px-2">Jumlah</th>
                  <th className="pb-3 px-2">Upah/Jam</th>
                  <th className="pb-3 px-2">Jam/Batch</th>
                  <th className="pb-3 px-2 text-right">Total</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {draftLabor.map((l, i) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-2"><input type="text" value={l.position || ''} onChange={e => {
                      const n = [...draftLabor]; n[i].position = e.target.value; setDraftLabor(n);
                    }} className="input-inline w-full border-transparent focus:border-accent-primary" placeholder="Contoh: Tukang Masak" /></td>
                    <td className="py-3 px-2"><input type="number" value={l.count || 0} onChange={e => {
                      const n = [...draftLabor]; n[i].count = Number(e.target.value); setDraftLabor(n);
                    }} className="input-inline w-16" /></td>
                    <td className="py-3 px-2"><input type="number" value={l.wagePerHour || 0} onChange={e => {
                      const n = [...draftLabor]; n[i].wagePerHour = Number(e.target.value); setDraftLabor(n);
                    }} className="input-inline w-24" /></td>
                    <td className="py-3 px-2"><input type="number" value={l.hoursPerBatch || 0} onChange={e => {
                      const n = [...draftLabor]; n[i].hoursPerBatch = Number(e.target.value); setDraftLabor(n);
                    }} className="input-inline w-16" /></td>
                    <td className="py-3 px-2 text-right font-medium text-accent-primary">{formatRupiah(l.count * l.wagePerHour * l.hoursPerBatch)}</td>
                    <td className="py-3 px-2 text-right"><button onClick={() => setDraftLabor(draftLabor.filter(item => item.id !== l.id))} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-accent-danger" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bop' && (
           <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Biaya Overhead Pabrik</h3>
                {hasOverheadChanges && <p className="text-[10px] text-accent-primary font-bold animate-pulse">ADA PERUBAHAN BELUM TERSIMPAN</p>}
              </div>
              <div className="flex gap-2">
                {hasOverheadChanges && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                    <button onClick={saveOverhead} className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all"><Save className="w-4 h-4" /> Simpan</button>
                    <button onClick={cancelOverhead} className="flex items-center gap-2 bg-accent-danger/20 text-accent-danger px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-accent-danger hover:text-white transition-all"><X className="w-4 h-4" /> Batal</button>
                  </motion.div>
                )}
                <button onClick={() => setDraftOverhead([...draftOverhead, { id: Math.random().toString(), name: '', type: 'Variabel', monthlyValue: 0, allocationPercent: 100 }])} className="btn-primary py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah</button>
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-border-main">
                  <th className="pb-3 px-2">Overhead</th>
                  <th className="pb-3 px-2">Jenis</th>
                  <th className="pb-3 px-2">Nilai/Bulan</th>
                  <th className="pb-3 px-2">Alokasi (%)</th>
                  <th className="pb-3 px-2 text-right">Hasil Alokasi</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {draftOverhead.map((o, i) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-2"><input type="text" value={o.name || ''} onChange={e => {
                      const n = [...draftOverhead]; n[i].name = e.target.value; setDraftOverhead(n);
                    }} className="input-inline w-full border-transparent focus:border-accent-primary" placeholder="Contoh: Listrik & Air" /></td>
                    <td className="py-3 px-2">
                      <select value={o.type || 'Variabel'} onChange={e => {
                        const n = [...draftOverhead]; n[i].type = e.target.value as any; setDraftOverhead(n);
                      }} className="bg-transparent border-none focus:ring-1 focus:ring-accent-primary rounded px-1 outline-none text-xs">
                        <option value="Tetap" className="bg-bg-secondary">Tetap</option>
                        <option value="Variabel" className="bg-bg-secondary">Variabel</option>
                      </select>
                    </td>
                    <td className="py-3 px-2"><input type="number" value={o.monthlyValue || 0} onChange={e => {
                      const n = [...draftOverhead]; n[i].monthlyValue = Number(e.target.value); setDraftOverhead(n);
                    }} className="input-inline w-28" /></td>
                    <td className="py-3 px-2"><input type="number" value={o.allocationPercent || 0} onChange={e => {
                      const n = [...draftOverhead]; n[i].allocationPercent = Number(e.target.value); setDraftOverhead(n);
                    }} className="input-inline w-16" /></td>
                    <td className="py-3 px-2 text-right font-medium text-accent-primary">{formatRupiah(o.monthlyValue * (o.allocationPercent / 100))}</td>
                    <td className="py-3 px-2 text-right"><button onClick={() => setDraftOverhead(draftOverhead.filter(item => item.id !== o.id))} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-accent-danger" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'non' && (
           <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Biaya Non-Produksi</h3>
                {hasNonProdChanges && <p className="text-[10px] text-accent-primary font-bold animate-pulse">ADA PERUBAHAN BELUM TERSIMPAN</p>}
              </div>
              <div className="flex gap-2">
                {hasNonProdChanges && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                    <button onClick={saveNonProduction} className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all"><Save className="w-4 h-4" /> Simpan</button>
                    <button onClick={cancelNonProduction} className="flex items-center gap-2 bg-accent-danger/20 text-accent-danger px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-accent-danger hover:text-white transition-all"><X className="w-4 h-4" /> Batal</button>
                  </motion.div>
                )}
                <button onClick={() => setDraftNonProduction([...draftNonProduction, { id: Math.random().toString(), name: '', category: 'Pemasaran', monthlyValue: 0 }])} className="btn-primary py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah</button>
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-border-main">
                  <th className="pb-3 px-2">Deskripsi Biaya</th>
                  <th className="pb-3 px-2">Kategori</th>
                  <th className="pb-3 px-2">Nilai/Bulan</th>
                  <th className="pb-3 px-2 text-right">Biaya/Unit</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {draftNonProduction.map((n, i) => (
                  <tr key={n.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-2"><input type="text" value={n.name || ''} onChange={e => {
                      const next = [...draftNonProduction]; next[i].name = e.target.value; setDraftNonProduction(next);
                    }} className="input-inline w-full border-transparent focus:border-accent-primary" placeholder="Contoh: Biaya Marketing" /></td>
                    <td className="py-3 px-2">
                      <select value={n.category || 'Pemasaran'} onChange={e => {
                        const next = [...draftNonProduction]; next[i].category = e.target.value as any; setDraftNonProduction(next);
                      }} className="bg-transparent border-none focus:ring-1 focus:ring-accent-primary rounded px-1 outline-none text-xs">
                        <option value="Pemasaran" className="bg-bg-secondary">Pemasaran</option>
                        <option value="Admin" className="bg-bg-secondary">Admin</option>
                        <option value="Distribusi" className="bg-bg-secondary">Distribusi</option>
                      </select>
                    </td>
                    <td className="py-3 px-2"><input type="number" value={n.monthlyValue || 0} onChange={e => {
                      const next = [...draftNonProduction]; next[i].monthlyValue = Number(e.target.value); setDraftNonProduction(next);
                    }} className="input-inline w-28" /></td>
                    <td className="py-3 px-2 text-right font-medium text-accent-primary">{formatRupiah(n.monthlyValue / calculations.unitsPerMonth)}</td>
                    <td className="py-3 px-2 text-right"><button onClick={() => setDraftNonProduction(draftNonProduction.filter(item => item.id !== n.id))} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-accent-danger" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-card p-6 border-accent-primary/20 bg-accent-primary/5">
        <h3 className="font-bold text-xl mb-4 text-accent-primary">Rekapitulasi HPP</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><p className="text-xs text-slate-400">Biaya Bahan Baku/Unit</p><p className="text-lg font-bold">{formatRupiah(calculations.materialPerUnit)}</p></div>
          <div><p className="text-xs text-slate-400">Biaya Tenaga Kerja/Unit</p><p className="text-lg font-bold">{formatRupiah(calculations.laborPerUnit)}</p></div>
          <div><p className="text-xs text-slate-400">Biaya Overhead/Unit</p><p className="text-lg font-bold">{formatRupiah(calculations.overheadPerUnit)}</p></div>
          <div><p className="text-xs text-slate-400">Biaya Non-Produksi/Unit</p><p className="text-lg font-bold">{formatRupiah(calculations.nonProductionPerUnit)}</p></div>
        </div>
        <div className="mt-8 pt-6 border-t border-border-main flex justify-between items-end">
          <div>
            <p className="text-slate-400 flex items-center gap-1 mb-2">HPP Dasar (Sebelum Waste) <Info className="w-3 h-3" /></p>
            <p className="text-2xl font-bold">{formatRupiah(calculations.baseHppPerUnit)}</p>
          </div>
          <div className="text-right">
             <p className="text-accent-primary font-bold text-3xl mb-1">{formatRupiah(calculations.hppPerUnitFinal)}</p>
             <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">HPP Akhir per Unit</p>
          </div>
        </div>
      </div>
    </div>
  );
};
