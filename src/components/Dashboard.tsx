import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { AlertCircle, TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
import { formatRupiah, cn } from '../lib/utils';
import { AppData } from '../types';

ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement
);

type DashboardProps = {
  data: AppData;
  calculations: any;
};

export const Dashboard: React.FC<DashboardProps> = ({ data, calculations }) => {
  const { hppPerUnitFinal, totalCostPerMonth, unitsPerMonth, variableCostPerUnit, totalFixedMonthly } = calculations;

  const retailLevel = data.priceLevels[0];
  const retailPrice = hppPerUnitFinal * (1 + retailLevel.markupPercent / 100);
  const marginAmt = retailPrice - hppPerUnitFinal;
  const marginPct = (marginAmt / retailPrice) * 100;

  const bepUnit = Math.ceil(totalFixedMonthly / (retailPrice - variableCostPerUnit));
  const totalInvestment = data.investments.reduce((acc, i) => acc + i.value, 0);
  const monthlyProfit = (retailPrice - hppPerUnitFinal) * unitsPerMonth;
  const roiMonthly = (monthlyProfit / totalInvestment) * 100;

  const doughnutData = {
    labels: ['Bahan Baku', 'Tenaga Kerja', 'Overhead', 'Non-Produksi', 'Waste'],
    datasets: [{
      data: [
        calculations.materialPerUnit,
        calculations.laborPerUnit,
        calculations.overheadPerUnit,
        calculations.nonProductionPerUnit,
        hppPerUnitFinal - calculations.baseHppPerUnit
      ],
      backgroundColor: [
        '#00c9a7',
        '#0891b2',
        '#3d5a6a',
        '#ef4444',
        '#8b5cf6'
      ],
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: data.priceLevels.map(l => l.name),
    datasets: [
      {
        label: 'Harga Jual (Rp)',
        data: data.priceLevels.map(l => hppPerUnitFinal * (1 + l.markupPercent / 100)),
        backgroundColor: '#00c9a7',
        borderRadius: 4,
      },
      {
        label: 'HPP (Rp)',
        data: data.priceLevels.map(() => hppPerUnitFinal),
        backgroundColor: '#2d4a5a',
        borderRadius: 4,
      }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading">Ringkasan Dashboard</h1>
          <p className="text-text-secondary text-sm">Periode Produksi: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-[#2d4a5a] text-sm font-medium border border-white/10 hover:bg-[#3d5a6a] transition-colors">Export Data</button>
          <button className="px-4 py-2 rounded-xl bg-accent-primary text-black text-sm font-bold shadow-lg shadow-accent-primary/20 hover:scale-105 transition-transform">+ Tambah Produksi</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="HPP PER UNIT" value={formatRupiah(hppPerUnitFinal)} trend="+2.4%" />
        <StatCard title="RECOMMENDED PRICE" value={formatRupiah(retailPrice)} status={`Markup ${retailLevel.markupPercent}%`} />
        <StatCard 
          title="MARGIN KEUNTUNGAN" 
          value={`${marginPct.toFixed(1)}%`} 
          status={marginPct < 20 ? "Di bawah target" : "Batas 20%"}
          variant={marginPct < 15 ? 'danger' : marginPct < 25 ? 'warning' : 'success'} 
        />
        <StatCard title="ESTIMASI ROI" value={`${roiMonthly.toFixed(1)}%`} status="/ Bulan" />
      </div>

      {/* Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Chart */}
        <div className="col-span-1 p-6 glass-card bg-[#1e3a4a]/40 border-[#2d4a5a] rounded-3xl flex flex-col">
          <h3 className="text-sm font-semibold mb-6 flex justify-between items-center">
            Breakdown Biaya <Info className="w-4 h-4 text-text-secondary" />
          </h3>
          <div className="flex-1 min-h-[200px] flex items-center justify-center py-4">
            <Doughnut 
              data={doughnutData} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { 
                  legend: { display: false } 
                },
                cutout: '75%'
              }} 
            />
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-bold">{formatRupiah(totalCostPerMonth).substring(3, 8)}...</span>
              <span className="text-[10px] text-text-secondary uppercase tracking-tighter">Total Ops</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-[11px]">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00c9a7]"></span> Bahan Baku</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#0891b2]"></span> Labor</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3d5a6a]"></span> Overhead</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> Non-Produksi</div>
          </div>
        </div>

        {/* Pricing Chart */}
        <div className="col-span-1 lg:col-span-2 p-6 glass-card bg-[#1e3a4a]/40 border-[#2d4a5a] rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold">HPP vs Harga Jual per Level</h3>
            <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-accent-primary rounded-sm"></span> Harga Jual</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#2d4a5a] rounded-sm"></span> HPP</span>
            </div>
          </div>
          <div className="h-[250px]">
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: { 
                  y: { display: false },
                  x: { grid: { display: false }, border: { display: false } }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Alert Warning Section */}
      {marginPct < 20 && (
        <div className={cn(
          "p-4 border-l-4 rounded-r-xl flex items-center justify-between",
          marginPct < 15 ? "bg-accent-danger/10 border-accent-danger" : "bg-accent-warning/10 border-accent-warning"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              marginPct < 15 ? "bg-accent-danger/20 text-accent-danger" : "bg-accent-warning/20 text-accent-warning"
            )}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className={cn("text-sm font-bold", marginPct < 15 ? "text-accent-danger" : "text-accent-warning")}>
                Peringatan Margin Rendah
              </h4>
              <p className="text-xs text-text-secondary">
                Margin keuntungan saat ini berada di {marginPct.toFixed(1)}%, di bawah target aman 20%.
              </p>
            </div>
          </div>
          <button className={cn(
            "px-4 py-2 text-black text-[10px] font-bold rounded-lg uppercase tracking-wider transition-opacity hover:opacity-90",
            marginPct < 15 ? "bg-accent-danger" : "bg-accent-warning"
          )}>
            Review Pricing
          </button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, trend, status, variant = 'default' }: any) => {
  const statusColors: any = {
    default: 'text-text-secondary',
    success: 'text-emerald-500',
    warning: 'text-accent-warning',
    danger: 'text-accent-danger',
  };

  return (
    <div className="p-5 bg-[#1e3a4a]/80 border border-accent-primary/15 rounded-2xl backdrop-blur-md">
      <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && <span className="text-xs text-accent-primary">{trend}</span>}
        {status && <span className={cn("text-[10px] font-medium opacity-80", statusColors[variant] || 'text-text-secondary')}>{status}</span>}
      </div>
    </div>
  );
};
