import React, { useMemo, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Plus, Trash2, Info, ArrowRight, Save, X, Edit3, Check, BarChart3 } from 'lucide-react';
import { formatRupiah, cn } from '../lib/utils';
import { AppData, PriceLevel } from '../types';
import { motion, AnimatePresence } from 'motion/react';

type PriceLevelingProps = {
  data: AppData;
  setData: (data: AppData) => void;
  calculations: any;
  updatePriceLevels: (levels: PriceLevel[]) => void;
};

export const PriceLeveling: React.FC<PriceLevelingProps> = ({ data, calculations, updatePriceLevels }) => {
  const hpp = calculations.hppPerUnitFinal;
  const [draftLevels, setDraftLevels] = useState<PriceLevel[]>(data.priceLevels);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMarkup, setBulkMarkup] = useState<number>(0);

  // Sync draft state with data prop when it changes
  useEffect(() => {
    setDraftLevels(data.priceLevels);
  }, [data.priceLevels]);

  const hasChanges = JSON.stringify(draftLevels) !== JSON.stringify(data.priceLevels);

  const saveChanges = () => {
    updatePriceLevels(draftLevels);
  };

  const cancelChanges = () => {
    setDraftLevels(data.priceLevels);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === draftLevels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(draftLevels.map(l => l.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const applyBulkMarkup = () => {
    const next = draftLevels.map(l => 
      selectedIds.includes(l.id) ? { ...l, markupPercent: bulkMarkup } : l
    );
    setDraftLevels(next);
    setSelectedIds([]);
  };

  const levelsData = useMemo(() => {
    return draftLevels.map(l => {
      const sellPrice = hpp * (1 + l.markupPercent / 100);
      const marginRp = sellPrice - hpp;
      const marginPct = sellPrice > 0 ? (marginRp / sellPrice) * 100 : 0;
      return {
        ...l,
        sellPrice,
        marginRp,
        marginPct,
        monthlyProfit: marginRp * calculations.unitsPerMonth
      };
    });
  }, [draftLevels, hpp, calculations.unitsPerMonth]);

  const chartData = {
    labels: levelsData.map(l => l.name),
    datasets: [
      {
        label: 'Harga Jual (Rp)',
        data: levelsData.map(l => l.sellPrice),
        borderColor: '#00c9a7',
        backgroundColor: 'rgba(0, 201, 167, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold italic tracking-tight">Leveling Harga & Strategi Margin</h2>
          {hasChanges && <p className="text-[10px] text-accent-primary font-black animate-pulse uppercase tracking-[0.2em] mt-1">Sistem Mendeteksi Perubahan Belum Tersimpan</p>}
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
              <button 
                onClick={saveChanges}
                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all shadow-lg shadow-emerald-500/10 border border-emerald-500/20"
              >
                <Save className="w-4 h-4" /> Simpan
              </button>
              <button 
                onClick={cancelChanges}
                className="flex items-center gap-2 bg-accent-danger/20 text-accent-danger px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent-danger hover:text-white transition-all border border-accent-danger/20"
              >
                <X className="w-4 h-4" /> Batal
              </button>
            </motion.div>
          )}
          <button 
            onClick={() => setDraftLevels([...draftLevels, { id: Math.random().toString(), name: 'Level Baru', minOrder: 0, markupPercent: 0, isEditable: true }])}
            className="px-4 py-2 bg-accent-primary text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-primary/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Level
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-accent-primary/10 border-2 border-accent-primary/20 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-accent-primary/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-primary flex items-center justify-center text-black font-black">
                {selectedIds.length}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-accent-primary tracking-widest italic">Bulk Action Active</p>
                <p className="text-white text-xs font-bold leading-tight">{selectedIds.length} Level Harga Terpilih</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary pl-2">Reset Markup:</span>
                <input 
                  type="number" 
                  value={bulkMarkup}
                  onChange={e => setBulkMarkup(Number(e.target.value))}
                  className="bg-transparent text-white font-black text-center w-16 outline-none border-b-2 border-accent-primary/50 focus:border-accent-primary transition-colors"
                />
                <span className="text-accent-primary font-bold pr-2">%</span>
              </div>
              <button 
                onClick={applyBulkMarkup}
                className="px-6 py-3 bg-accent-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-primary/20 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Apply To Selection
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="p-3 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden rounded-[2.5rem] border-white/5">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="p-6 w-12">
                <button 
                  onClick={toggleSelectAll}
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    selectedIds.length === draftLevels.length 
                      ? "bg-accent-primary border-accent-primary text-black shadow-lg shadow-accent-primary/20" 
                      : "border-white/10 hover:border-white/30"
                  )}
                >
                  {selectedIds.length === draftLevels.length && <Check className="w-4 h-4" />}
                </button>
              </th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic">Level Name</th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic">Min. Order</th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic">HPP Dasar</th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic text-center">Markup (%)</th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic">Harga Jual</th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic text-right">Margin (Rp)</th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic text-center">Margin (%)</th>
              <th className="py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-text-secondary italic text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {levelsData.map((l, i) => (
              <tr 
                key={l.id} 
                className={cn(
                  "hover:bg-white/5 transition-colors group",
                  selectedIds.includes(l.id) ? "bg-accent-primary/5" : ""
                )}
              >
                <td className="p-6">
                  <button 
                    onClick={() => toggleSelectRow(l.id)}
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      selectedIds.includes(l.id) 
                        ? "bg-accent-primary border-accent-primary text-black" 
                        : "border-white/10 group-hover:border-white/30"
                    )}
                  >
                    {selectedIds.includes(l.id) && <Check className="w-4 h-4" />}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <input 
                    type="text" 
                    value={l.name || ''} 
                    onChange={e => {
                      const next = [...draftLevels]; next[i].name = e.target.value; setDraftLevels(next);
                    }} 
                    className="bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-accent-primary w-full py-1"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={l.minOrder || 0} 
                      onChange={e => {
                        const next = [...draftLevels]; next[i].minOrder = Number(e.target.value); setDraftLevels(next);
                      }} 
                      className="bg-transparent text-white font-medium outline-none border-b border-transparent focus:border-accent-primary w-16 py-1"
                    />
                    <span className="text-[10px] text-text-secondary uppercase font-black italic">Unit</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{formatRupiah(hpp)}</td>
                <td className="py-4 px-4">
                   <div className="flex items-center justify-center gap-1">
                     <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 flex items-center">
                       <Edit3 className="w-3 h-3 text-accent-primary mr-2 opacity-50" />
                       <input 
                        type="number" 
                        value={l.markupPercent || 0} 
                        onChange={e => {
                          const next = [...draftLevels]; next[i].markupPercent = Number(e.target.value); setDraftLevels(next);
                        }} 
                        className="bg-transparent text-white font-black text-center w-12 outline-none" 
                       />
                       <span className="text-accent-primary font-black text-[10px] ml-1">%</span>
                     </div>
                   </div>
                </td>
                <td className="py-4 px-4 font-black text-white">{formatRupiah(l.sellPrice)}</td>
                <td className="py-4 px-4 text-accent-primary text-right font-black">{formatRupiah(l.marginRp)}</td>
                <td className="py-4 px-4 text-center">
                  <div 
                    className="inline-block px-3 py-1 rounded-xl text-[10px] font-black italic border" 
                    style={{ 
                      backgroundColor: `${l.marginPct < 15 ? '#ef444410' : l.marginPct < 25 ? '#f59e0b10' : '#00c9a710'}`, 
                      borderColor: `${l.marginPct < 15 ? '#ef444430' : l.marginPct < 25 ? '#f59e0b30' : '#00c9a730'}`,
                      color: l.marginPct < 15 ? '#ef4444' : l.marginPct < 25 ? '#f59e0b' : '#00c9a7' 
                    }}
                  >
                    {l.marginPct.toFixed(1)}%
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => setDraftLevels(draftLevels.filter(item => item.id !== l.id))} 
                    className="opacity-0 group-hover:opacity-100 transition-all p-3 hover:bg-accent-danger/20 rounded-2xl group/btn"
                  >
                    <Trash2 className="w-4 h-4 text-accent-danger group-hover/btn:scale-110 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="glass-card p-6 rounded-[2.5rem] border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-accent-primary/10 border border-accent-primary/20">
                <BarChart3 className="w-5 h-5 text-accent-primary" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-[12px] italic">Kurva Harga Jual vs Level</h3>
            </div>
            <div className="h-64">
              <Line data={chartData} options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                  x: { grid: { display: false } }
                }
              }} />
            </div>
         </div>
         <div className="glass-card p-8 flex flex-col justify-center gap-6 bg-accent-secondary/5 border-accent-secondary/20 rounded-[2.5rem]">
            <div className="flex gap-4 items-center text-accent-secondary">
              <div className="p-3 rounded-2xl bg-accent-secondary/20 border border-accent-secondary/30">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-black uppercase tracking-widest text-[12px] italic">Strategi Penentuan Harga</h4>
            </div>
            <ul className="space-y-4">
               {[
                 "Pastikan margin Retail Anda di atas target operasional (min. 30%).",
                 "Distributor biasanya mendapat markup 10-15% dari HPP.",
                 "Selisih antar level idealnya adalah 5% - 10% untuk mendorong unit bulk order."
               ].map((tip, idx) => (
                 <li key={idx} className="flex gap-4 items-center text-[11px] text-slate-300 group">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-accent-secondary font-black group-hover:bg-accent-secondary group-hover:text-black transition-colors">
                      {idx + 1}
                    </div>
                    <span>{tip}</span>
                 </li>
               ))}
            </ul>
         </div>
      </div>
    </div>
  );
};

