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
import { AlertCircle, TrendingUp, TrendingDown, Info, BarChart3, ShieldCheck, Crown, Zap, ExternalLink, ShieldAlert, CreditCard, Save } from 'lucide-react';
import { formatRupiah, cn } from '../lib/utils';
import { AppData, UserAccount, Recipe } from '../types';
import { APP_FEATURES, PLUGIN_PACKAGES } from '../constants';

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
  setData: (data: AppData) => void;
  calculations: any;
  user: UserAccount | null;
  updateAccounts: (accounts: UserAccount[]) => void;
  accounts: UserAccount[];
  ownerSettings: any;
};

export const Dashboard: React.FC<DashboardProps> = ({ data, setData, calculations, user, updateAccounts, accounts, ownerSettings }) => {
  const { hppPerUnitFinal, totalCostPerMonth, unitsPerMonth, variableCostPerUnit, totalFixedMonthly } = calculations;

  const handleSaveRecipe = () => {
    const isEnterprise = user?.enabledFeatures?.includes('recipes');
    if (!isEnterprise) {
      alert('Fitur Simpan Resep hanya tersedia untuk paket Enterprise.');
      return;
    }

    const recipeName = prompt('Masukkan nama produk untuk resep ini:');
    if (recipeName) {
      const newRecipe: Recipe = {
        id: Math.random().toString(36).substr(2, 9),
        name: recipeName,
        hppPerUnit: hppPerUnitFinal,
        totalCost: calculations.totalMaterialBatch + calculations.laborPerUnit * data.production.unitsPerBatch + (calculations.overheadPerUnit * data.production.unitsPerBatch),
        unitsPerBatch: data.production.unitsPerBatch,
        batchesPerMonth: data.production.batchesPerMonth,
        materials: [...data.materials],
        laborCosts: [...data.laborCosts],
        overheadCosts: [...data.overheadCosts],
        createdAt: new Date().toISOString()
      };
      
      const currentRecipes = data.recipes || [];
      setData({
        ...data,
        recipes: [...currentRecipes, newRecipe]
      });
      alert('Resep berhasil disimpan ke menu Produk & Resep!');
    }
  };

  const retailLevel = data.priceLevels[0];
  const retailPrice = hppPerUnitFinal * (1 + retailLevel.markupPercent / 100);
  const marginAmt = retailPrice - hppPerUnitFinal;
  const marginPct = (marginAmt / retailPrice) * 100;

  const bepUnit = Math.ceil(totalFixedMonthly / (retailPrice - variableCostPerUnit));
  const totalInvestment = data.investments.reduce((acc, i) => acc + i.value, 0);
  const monthlyProfit = (retailPrice - hppPerUnitFinal) * unitsPerMonth;
  const roiMonthly = (monthlyProfit / totalInvestment) * 100;

  // Subscription logic
  const expiryDate = user?.activeUntil ? new Date(user.activeUntil) : null;
  const today = new Date();
  const diffTime = expiryDate ? expiryDate.getTime() - today.getTime() : 0;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;
  const isWarning = diffDays > 0 && diffDays <= 7;

  const handleUpgrade = (packageId: string) => {
    if (!user) return;
    
    const requestDate = new Date().toISOString();
    const waNumber = ownerSettings?.whatsappNumber || '628123456789';
    const isWaEnabled = ownerSettings?.isWhatsappEnabled ?? true;
    const paymentLink = isWaEnabled 
      ? `https://wa.me/${waNumber}?text=Halo%20Owner%2C%20saya%20ingin%20upgrade%20ke%20paket%20${packageId.toUpperCase()}%20untuk%20akun%20${user.username}`
      : undefined;
    
    const updatedAccounts = accounts.map(a => 
      a.id === user.id ? { 
        ...a, 
        upgradeRequest: { 
          packageId, 
          status: 'pending' as const, 
          requestDate,
          paymentLink
        } 
      } : a
    );
    
    updateAccounts(updatedAccounts);
    alert(`Permintaan upgrade ke paket ${packageId.toUpperCase()} telah dikirim ke Owner. Silakan hubungi owner untuk pembayaran.`);
  };

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
          <button 
            onClick={handleSaveRecipe}
            className="px-4 py-2 rounded-xl bg-[#2d4a5a] text-sm font-medium border border-white/10 hover:bg-[#3d5a6a] transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Simpan Resep
          </button>
          <button className="px-4 py-2 rounded-xl bg-accent-primary text-black text-sm font-bold shadow-lg shadow-accent-primary/20 hover:scale-105 transition-transform">+ Tambah Produksi</button>
        </div>
      </div>

      {/* Subscription Alert */}
      {user?.role === 'member' && (isExpired || isWarning) && (
        <div className={cn(
          "p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 border-2 animate-in slide-in-from-top-4 duration-700",
          isExpired 
            ? "bg-accent-danger/20 border-accent-danger/30 text-white shadow-xl shadow-accent-danger/20" 
            : "bg-accent-warning/20 border-accent-warning/30 text-white shadow-xl shadow-accent-warning/20"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              isExpired ? "bg-accent-danger text-white" : "bg-accent-warning text-black"
            )}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight">
                {isExpired ? "Masa Aktif Berakhir!" : "Masa Aktif Akan Berakhir"}
              </h3>
              <p className="text-sm opacity-80">
                {isExpired 
                  ? `Masa aktif Anda telah habis pada ${expiryDate?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}. Akses fitur mungkin terbatas.`
                  : `Masa aktif Anda tersisa ${diffDays} hari lagi (Berakhir ${expiryDate?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}).`
                }
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              const upgradeSection = document.getElementById('upgrade-section');
              upgradeSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={cn(
              "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 active:scale-95",
              isExpired ? "bg-accent-danger text-white" : "bg-accent-warning text-black"
            )}
          >
            {isExpired ? "Aktifkan Kembali" : "Perpanjang Sekarang"}
          </button>
        </div>
      )}

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

      {/* Upgrade Features Section */}
      <div id="upgrade-section" className="space-y-6 scroll-mt-24">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-3 italic">
            <Zap className="text-accent-warning w-6 h-6 fill-accent-warning" /> 
            Upgrade Level Produksi
          </h2>
          <div className="h-[1px] flex-1 bg-white/5 mx-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLUGIN_PACKAGES.map(pkg => {
            const isCurrent = user?.enabledFeatures?.length === pkg.features.length;
            const isPending = user?.upgradeRequest?.packageId === pkg.id && user?.upgradeRequest?.status === 'pending';

            return (
              <div 
                key={pkg.id} 
                className={cn(
                  "glass-card p-6 border-white/5 relative group transition-all duration-500",
                  isCurrent ? "ring-2 ring-accent-primary bg-accent-primary/5" : "hover:border-white/20"
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-accent-primary/20">
                    Paket Saat Ini
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {pkg.id === 'starter' && <Zap className="w-6 h-6 text-slate-400" />}
                    {pkg.id === 'pro' && <ShieldCheck className="w-6 h-6 text-accent-primary" />}
                    {pkg.id === 'enterprise' && <Crown className="w-6 h-6 text-accent-secondary" />}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Mulai dari</p>
                    <p className="text-lg font-black text-white">
                      {pkg.id === 'starter' ? 'FREE' : pkg.id === 'pro' ? 'Rp 99rb' : 'Rp 299rb'}
                    </p>
                  </div>
                </div>

                <h4 className="text-lg font-bold mb-2 group-hover:text-accent-primary transition-colors">{pkg.name}</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed mb-6 italic min-h-[40px]">
                  "{pkg.recommendation}"
                </p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.slice(0, 5).map(fid => (
                    <li key={fid} className="flex items-center gap-3 text-[11px]">
                      <div className="w-4 h-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
                        <TrendingUp className="w-2.5 h-2.5 text-accent-primary" />
                      </div>
                      <span className="text-text-secondary">{APP_FEATURES.find(af => af.id === fid)?.label}</span>
                    </li>
                  ))}
                  {pkg.features.length > 5 && (
                    <li className="text-[10px] text-accent-primary font-bold pl-7">+ {pkg.features.length - 5} Fitur Lanjutan</li>
                  )}
                </ul>

                {isPending ? (
                  <div className="space-y-3">
                    <div className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-accent-warning text-[10px] font-black uppercase italic tracking-widest">
                      <CreditCard className="w-4 h-4 animate-pulse" /> Pending Approval
                    </div>
                    {user?.upgradeRequest?.paymentLink && (
                      <a 
                        href={user.upgradeRequest.paymentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-accent-warning text-black rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
                      >
                        Bayar Sekarang <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <button 
                    disabled={isCurrent}
                    onClick={() => handleUpgrade(pkg.id)}
                    className={cn(
                      "w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                      isCurrent 
                        ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5" 
                        : "bg-accent-primary text-black hover:scale-105 active:scale-95 shadow-lg shadow-accent-primary/20"
                    )}
                  >
                    {isCurrent ? "TERAKTIVASI" : "PILIH PAKET"}
                  </button>
                )}
              </div>
            );
          })}
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
