import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RawMaterials } from './components/RawMaterials';
import { ProductionCosts } from './components/ProductionCosts';
import { ProductionResults } from './components/ProductionResults';
import { PriceLeveling } from './components/PriceLeveling';
import { BepRoi } from './components/BepRoi';
import { Report } from './components/Report';
import { Login } from './components/Login';
import { OwnerDashboard } from './components/OwnerDashboard';
import { OwnerFeatureManagement } from './components/OwnerFeatureManagement';
import { OwnerSubscription } from './components/OwnerSubscription';
import { OwnerPlugins } from './components/OwnerPlugins';
import { OwnerCRM } from './components/OwnerCRM';
import { OwnerPanel } from './components/OwnerPanel';
import { ManajemenProfil } from './components/ManajemenProfil';
import { MemberProfile } from './components/MemberProfile';
import { Recipes } from './components/Recipes';
import { useHppData } from './hooks/useHppData';
import { cn } from './lib/utils';
import { Download, Upload, RotateCcw, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount, OwnerSettings } from './types';
import { INITIAL_ACCOUNTS } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

  const [ownerSettings, setOwnerSettings] = useState<OwnerSettings>(() => {
    const defaults: OwnerSettings = {
      whatsappNumber: '628123456789',
      isWhatsappEnabled: true,
      customDomain: '',
      domainStatus: 'not_configured',
      primaryColor: '#00c9a7'
    };
    const saved = localStorage.getItem('costmaster_owner_settings');
    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch (e) {
        return defaults;
      }
    }
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem('costmaster_owner_settings', JSON.stringify(ownerSettings));
    if (ownerSettings.primaryColor) {
      document.documentElement.style.setProperty('--color-accent-primary', ownerSettings.primaryColor);
      // Also generate a muted version for background opacities if needed, 
      // but Tailwind 4 might handle opacity differently.
      // Usually --color-accent-primary is enough for @theme
    }
  }, [ownerSettings]);

  // Global Accounts Management (Centralized)
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('costmaster_pro_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((acc: any) => ({
          fullName: '',
          username: '',
          password: '',
          activeUntil: new Date().toISOString().split('T')[0],
          status: 'active',
          ...acc,
          enabledFeatures: acc.enabledFeatures || (acc.role === 'owner' ? ['all'] : ['dashboard'])
        }));
      } catch (e) {
        return INITIAL_ACCOUNTS;
      }
    }
    return INITIAL_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('costmaster_pro_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const { 
    data, 
    calculations, 
    setData,
    updateMaterials, 
    updateLabor, 
    updateOverhead, 
    updateNonProduction, 
    updateProduction, 
    updatePriceLevels, 
    updateInvestments, 
    exportData, 
    importData, 
    resetData 
  } = useHppData(user?.id || null);

  const updateAccounts = (newAccounts: UserAccount[]) => {
    setAccounts(newAccounts);
  };

  // Load auth state
  useEffect(() => {
    const savedUserId = localStorage.getItem('costmaster_user_id');
    if (savedUserId && accounts) {
      const match = accounts.find(a => a.id === savedUserId);
      if (match) {
        setIsAuthenticated(true);
        setUser(match);
      }
    }
  }, [accounts]);

  const handleLogin = (account: UserAccount) => {
    setIsAuthenticated(true);
    setUser(account);
    localStorage.setItem('costmaster_user_id', account.id);
    setActiveTab(account.role === 'owner' ? 'owner_dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('costmaster_user_id');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => importData(re.target?.result as string);
      reader.readAsText(file);
    }
  };

  const renderContent = () => {
    const props = { data, setData, calculations, updateMaterials, updateLabor, updateOverhead, updateNonProduction, updateProduction, updatePriceLevels, updateInvestments, updateAccounts };
    
    switch (activeTab) {
      // Member Routes
      case 'dashboard': return <Dashboard data={data} setData={setData} calculations={calculations} user={user} updateAccounts={updateAccounts} accounts={accounts} ownerSettings={ownerSettings} />;
      case 'materials': 
        if (user?.role === 'member' && !user.enabledFeatures?.includes('materials')) return <Dashboard data={data} setData={setData} calculations={calculations} />;
        return <RawMaterials {...props} />;
      case 'production_costs': 
        if (user?.role === 'member' && !user.enabledFeatures?.includes('production_costs')) return <Dashboard data={data} calculations={calculations} />;
        return <ProductionCosts {...props} />;
      case 'results': 
        if (user?.role === 'member' && !user.enabledFeatures?.includes('results')) return <Dashboard data={data} calculations={calculations} />;
        return <ProductionResults {...props} />;
      case 'pricing': 
        if (user?.role === 'member' && !user.enabledFeatures?.includes('pricing')) return <Dashboard data={data} calculations={calculations} />;
        return <PriceLeveling {...props} />;
      case 'bep_roi': 
        if (user?.role === 'member' && !user.enabledFeatures?.includes('bep_roi')) return <Dashboard data={data} calculations={calculations} />;
        return <BepRoi {...props} />;
      case 'report': 
        if (user?.role === 'member' && !user.enabledFeatures?.includes('report')) return <Dashboard data={data} setData={setData} calculations={calculations} />;
        return <Report {...props} />;
      case 'recipes':
        if (user?.role === 'member' && !user.enabledFeatures?.includes('recipes')) return <Dashboard data={data} setData={setData} calculations={calculations} />;
        return <Recipes data={data} setData={setData} />;
      case 'member_profile': return <MemberProfile user={user} updateAccounts={updateAccounts} accounts={accounts} onUpdateUser={setUser} />;
      
      // Owner Routes
      case 'owner_dashboard': return <OwnerDashboard accounts={accounts} />;
      case 'owner_accounts': return <OwnerFeatureManagement accounts={accounts} updateAccounts={updateAccounts} />;
      case 'owner_subscriptions': return <OwnerSubscription accounts={accounts} updateAccounts={updateAccounts} ownerSettings={ownerSettings} />;
      case 'owner_profile': return <ManajemenProfil ownerSettings={ownerSettings} setOwnerSettings={setOwnerSettings} />;
      case 'owner_plugins': return <OwnerPlugins />;
      case 'owner_crm': return <OwnerCRM accounts={accounts} />;
      case 'owner_panel': return <OwnerPanel accounts={accounts} updateAccounts={updateAccounts} />; // Legacy or additional settings
      
      default: return <Dashboard data={data} calculations={calculations} />;
    }
  };

  if (!isAuthenticated) {
    return <Login accounts={accounts} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex selection:bg-accent-primary/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        role={user?.role}
        enabledFeatures={user?.enabledFeatures}
        ownerSettings={ownerSettings}
      />
      
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isCollapsed ? "pl-20" : "pl-64"
      )}>
        {/* Top Navbar */}
        <header className="h-20 border-b border-border-main bg-bg-primary/50 backdrop-blur-md sticky top-0 z-40 px-10 flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-accent-primary font-heading uppercase tracking-[0.2em]">
              {activeTab.replace('_', ' ')}
            </h2>
            <div className="h-4 w-[1px] bg-border-main"></div>
            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">
              {user?.fullName}'s Workstation
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={exportData} 
              title="Export JSON" 
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-text-secondary hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <label className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-text-secondary hover:text-white cursor-pointer transition-all flex items-center gap-2 text-xs font-semibold">
              <Upload className="w-4 h-4" /> Import
              <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
            <button 
              onClick={resetData} 
              title="Reset Data" 
              className="p-2.5 bg-accent-danger/10 hover:bg-accent-danger/20 border border-accent-danger/20 rounded-xl text-accent-danger transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="h-8 w-[1px] bg-border-main mx-1"></div>
            <button 
              onClick={handleLogout} 
              title="Keluar" 
              className="p-2.5 bg-white/5 hover:bg-accent-danger/10 border border-white/10 hover:border-accent-danger/20 rounded-xl text-text-secondary hover:text-accent-danger transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 pb-20 max-w-[1400px] mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        .btn-primary {
          @apply flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-bg-primary px-4 py-2 rounded-lg font-semibold transition-all active:scale-95;
        }
        .input-inline {
          @apply bg-transparent border-none focus:ring-1 focus:ring-accent-primary rounded px-2 outline-none transition-all;
        }
      `}</style>
    </div>
  );
}
