import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Plus, Trash2, Info, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData, PriceLevel } from '../types';

type PriceLevelingProps = {
  data: AppData;
  calculations: any;
  updatePriceLevels: (levels: PriceLevel[]) => void;
};

export const PriceLeveling: React.FC<PriceLevelingProps> = ({ data, calculations, updatePriceLevels }) => {
  const hpp = calculations.hppPerUnitFinal;

  const levelsData = useMemo(() => {
    return data.priceLevels.map(l => {
      const sellPrice = hpp * (1 + l.markupPercent / 100);
      const marginRp = sellPrice - hpp;
      const marginPct = (marginRp / sellPrice) * 100;
      return {
        ...l,
        sellPrice,
        marginRp,
        marginPct,
        monthlyProfit: marginRp * calculations.unitsPerMonth
      };
    });
  }, [data.priceLevels, hpp, calculations.unitsPerMonth]);

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
        <h2 className="text-2xl font-bold">Leveling Harga & Strategi Margin</h2>
        <button 
          onClick={() => updatePriceLevels([...data.priceLevels, { id: Math.random().toString(), name: 'Level Baru', minOrder: 0, markupPercent: 0, isEditable: true }])}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Tambah Level
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 border-b border-border-main">
            <tr>
              <th className="p-4">Level</th>
              <th className="p-4">Min. Order</th>
              <th className="p-4">HPP (Rp)</th>
              <th className="p-4">Markup (%)</th>
              <th className="p-4">Harga Jual</th>
              <th className="p-4">Margin (Rp)</th>
              <th className="p-4">Margin (%)</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main">
            {levelsData.map((l, i) => (
              <tr key={l.id} className="hover:bg-white/5 transition-colors">
                <td className="p-2"><input type="text" value={l.name} onChange={e => {
                  const next = [...data.priceLevels]; next[i].name = e.target.value; updatePriceLevels(next);
                }} className="input-inline w-32" /></td>
                <td className="p-2"><input type="number" value={l.minOrder} onChange={e => {
                  const next = [...data.priceLevels]; next[i].minOrder = Number(e.target.value); updatePriceLevels(next);
                }} className="input-inline w-20" /></td>
                <td className="p-4 text-slate-400">{formatRupiah(hpp)}</td>
                <td className="p-2">
                   <div className="flex items-center gap-1">
                     <input type="number" value={l.markupPercent} onChange={e => {
                      const next = [...data.priceLevels]; next[i].markupPercent = Number(e.target.value); updatePriceLevels(next);
                    }} className="input-inline w-16 text-center font-bold text-accent-primary" />
                     <span className="text-slate-500">%</span>
                   </div>
                </td>
                <td className="p-4 font-bold text-white">{formatRupiah(l.sellPrice)}</td>
                <td className="p-4 text-accent-primary">{formatRupiah(l.marginRp)}</td>
                <td className="p-4 font-medium" style={{ color: l.marginPct < 15 ? '#ef4444' : l.marginPct < 25 ? '#f59e0b' : '#00c9a7' }}>{l.marginPct.toFixed(1)}%</td>
                <td className="p-4">
                  <button onClick={() => updatePriceLevels(data.priceLevels.filter(item => item.id !== l.id))} className="text-accent-danger"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="glass-card p-6">
            <h3 className="font-bold mb-6">Kurva Harga Jual vs Level</h3>
            <div className="h-64">
              <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
         </div>
         <div className="glass-card p-6 flex flex-col justify-center gap-4 bg-accent-secondary/5 border-accent-secondary/20">
            <div className="flex gap-2 items-center text-accent-secondary mb-2">
              <Info className="w-5 h-5" />
              <h4 className="font-bold">Tips Penentuan Harga</h4>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
               <li className="flex gap-2 items-start"><ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-accent-secondary" /> Pastikan margin Retail Anda di atas target operasional (min. 30%).</li>
               <li className="flex gap-2 items-start"><ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-accent-secondary" /> Distributor biasanya mendapat markup 10-15% dari HPP.</li>
               <li className="flex gap-2 items-start"><ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-accent-secondary" /> Selisih antar level idealnya adalah 5% - 10% untuk mendorong bulk order.</li>
            </ul>
         </div>
      </div>
    </div>
  );
};
