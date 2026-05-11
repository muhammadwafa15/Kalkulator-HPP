import React, { useState } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData, LaborCost, OverheadCost, NonProductionCost } from '../types';
import { cn } from '../lib/utils';

type ProductionCostsProps = {
  data: AppData;
  calculations: any;
  updateLabor: (costs: LaborCost[]) => void;
  updateOverhead: (costs: OverheadCost[]) => void;
  updateNonProduction: (costs: NonProductionCost[]) => void;
};

export const ProductionCosts: React.FC<ProductionCostsProps> = ({ data, calculations, updateLabor, updateOverhead, updateNonProduction }) => {
  const [activeTab, setActiveTab] = useState<'btkl' | 'bop' | 'non'>('btkl');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Biaya Operasional & Overhead</h2>
      </div>

      <div className="flex bg-white/5 p-1 rounded-xl w-fit border border-border-main">
        <button onClick={() => setActiveTab('btkl')} className={cn("px-6 py-2 rounded-lg font-medium transition-all", activeTab === 'btkl' ? "bg-accent-primary text-bg-primary" : "text-slate-400 hover:text-white")}>Tenaga Kerja (BTKL)</button>
        <button onClick={() => setActiveTab('bop')} className={cn("px-6 py-2 rounded-lg font-medium transition-all", activeTab === 'bop' ? "bg-accent-primary text-bg-primary" : "text-slate-400 hover:text-white")}>Overhead (BOP)</button>
        <button onClick={() => setActiveTab('non')} className={cn("px-6 py-2 rounded-lg font-medium transition-all", activeTab === 'non' ? "bg-accent-primary text-bg-primary" : "text-slate-400 hover:text-white")}>Non-Produksi</button>
      </div>

      <div className="glass-card p-6">
        {activeTab === 'btkl' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Biaya Tenaga Kerja Langsung</h3>
              <button onClick={() => updateLabor([...data.laborCosts, { id: Math.random().toString(), position: '', count: 1, wagePerHour: 0, hoursPerBatch: 0 }])} className="btn-primary py-1.5 text-sm"><Plus className="w-4 h-4" /> Tambah</button>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-border-main">
                  <th className="pb-3">Posisi/Pekerjaan</th>
                  <th className="pb-3">Jumlah (Org)</th>
                  <th className="pb-3">Upah/Jam</th>
                  <th className="pb-3">Jam/Batch</th>
                  <th className="pb-3 text-right">Total</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {data.laborCosts.map((l, i) => (
                  <tr key={l.id}>
                    <td className="py-3"><input type="text" value={l.position} onChange={e => {
                      const n = [...data.laborCosts]; n[i].position = e.target.value; updateLabor(n);
                    }} className="input-inline w-full" /></td>
                    <td className="py-3"><input type="number" value={l.count} onChange={e => {
                      const n = [...data.laborCosts]; n[i].count = Number(e.target.value); updateLabor(n);
                    }} className="input-inline w-16" /></td>
                    <td className="py-3"><input type="number" value={l.wagePerHour} onChange={e => {
                      const n = [...data.laborCosts]; n[i].wagePerHour = Number(e.target.value); updateLabor(n);
                    }} className="input-inline w-24" /></td>
                    <td className="py-3"><input type="number" value={l.hoursPerBatch} onChange={e => {
                      const n = [...data.laborCosts]; n[i].hoursPerBatch = Number(e.target.value); updateLabor(n);
                    }} className="input-inline w-16" /></td>
                    <td className="py-3 text-right font-medium text-accent-primary">{formatRupiah(l.count * l.wagePerHour * l.hoursPerBatch)}</td>
                    <td className="py-3 text-right"><button onClick={() => updateLabor(data.laborCosts.filter(item => item.id !== l.id))}><Trash2 className="w-4 h-4 text-accent-danger" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Similar logic for BOP and Non-Produksi would go here - for now showing summaries */}
        {activeTab === 'bop' && (
           <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Biaya Overhead Pabrik</h3>
              <button onClick={() => updateOverhead([...data.overheadCosts, { id: Math.random().toString(), name: '', type: 'Variabel', monthlyValue: 0, allocationPercent: 100 }])} className="btn-primary py-1.5 text-sm"><Plus className="w-4 h-4" /> Tambah</button>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-border-main">
                  <th className="pb-3">Overhead</th>
                  <th className="pb-3">Jenis</th>
                  <th className="pb-3">Nilai/Bulan</th>
                  <th className="pb-3">Alokasi (%)</th>
                  <th className="pb-3 text-right">Alokasi/Bulan</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {data.overheadCosts.map((o, i) => (
                  <tr key={o.id}>
                    <td className="py-3"><input type="text" value={o.name} onChange={e => {
                      const n = [...data.overheadCosts]; n[i].name = e.target.value; updateOverhead(n);
                    }} className="input-inline w-full" /></td>
                    <td className="py-3">
                      <select value={o.type} onChange={e => {
                        const n = [...data.overheadCosts]; n[i].type = e.target.value as any; updateOverhead(n);
                      }} className="bg-transparent border-none focus:ring-1 focus:ring-accent-primary rounded px-1 outline-none">
                        <option value="Tetap" className="bg-bg-secondary">Tetap</option>
                        <option value="Variabel" className="bg-bg-secondary">Variabel</option>
                      </select>
                    </td>
                    <td className="py-3"><input type="number" value={o.monthlyValue} onChange={e => {
                      const n = [...data.overheadCosts]; n[i].monthlyValue = Number(e.target.value); updateOverhead(n);
                    }} className="input-inline w-28" /></td>
                    <td className="py-3"><input type="number" value={o.allocationPercent} onChange={e => {
                      const n = [...data.overheadCosts]; n[i].allocationPercent = Number(e.target.value); updateOverhead(n);
                    }} className="input-inline w-16" /></td>
                    <td className="py-3 text-right font-medium text-accent-primary">{formatRupiah(o.monthlyValue * (o.allocationPercent / 100))}</td>
                    <td className="py-3 text-right"><button onClick={() => updateOverhead(data.overheadCosts.filter(item => item.id !== o.id))}><Trash2 className="w-4 h-4 text-accent-danger" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'non' && (
           <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Biaya Non-Produksi</h3>
              <button onClick={() => updateNonProduction([...data.nonProductionCosts, { id: Math.random().toString(), name: '', category: 'Pemasaran', monthlyValue: 0 }])} className="btn-primary py-1.5 text-sm"><Plus className="w-4 h-4" /> Tambah</button>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-border-main">
                  <th className="pb-3">Deskripsi Biaya</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Nilai/Bulan</th>
                  <th className="pb-3 text-right">Biaya/Unit</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {data.nonProductionCosts.map((n, i) => (
                  <tr key={n.id}>
                    <td className="py-3"><input type="text" value={n.name} onChange={e => {
                      const next = [...data.nonProductionCosts]; next[i].name = e.target.value; updateNonProduction(next);
                    }} className="input-inline w-full" /></td>
                    <td className="py-3">
                      <select value={n.category} onChange={e => {
                        const next = [...data.nonProductionCosts]; next[i].category = e.target.value as any; updateNonProduction(next);
                      }} className="bg-transparent border-none focus:ring-1 focus:ring-accent-primary rounded px-1 outline-none">
                        <option value="Pemasaran" className="bg-bg-secondary">Pemasaran</option>
                        <option value="Admin" className="bg-bg-secondary">Admin</option>
                        <option value="Distribusi" className="bg-bg-secondary">Distribusi</option>
                      </select>
                    </td>
                    <td className="py-3"><input type="number" value={n.monthlyValue} onChange={e => {
                      const next = [...data.nonProductionCosts]; next[i].monthlyValue = Number(e.target.value); updateNonProduction(next);
                    }} className="input-inline w-28" /></td>
                    <td className="py-3 text-right font-medium text-accent-primary">{formatRupiah(n.monthlyValue / calculations.unitsPerMonth)}</td>
                    <td className="py-3 text-right"><button onClick={() => updateNonProduction(data.nonProductionCosts.filter(item => item.id !== n.id))}><Trash2 className="w-4 h-4 text-accent-danger" /></button></td>
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
