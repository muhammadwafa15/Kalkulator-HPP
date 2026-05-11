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
import { useHppData } from './hooks/useHppData';
import { cn } from './lib/utils';
import { Download, Upload, RotateCcw, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const { 
    data, 
    calculations, 
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
  } = useHppData();

  // Load auth state
  useEffect(() => {
    const savedUser = localStorage.getItem('costmaster_user');
    if (savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
    localStorage.setItem('costmaster_user', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('costmaster_user');
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
    const props = { data, calculations, updateMaterials, updateLabor, updateOverhead, updateNonProduction, updateProduction, updatePriceLevels, updateInvestments };
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={data} calculations={calculations} />;
      case 'materials': return <RawMaterials {...props} />;
      case 'production_costs': return <ProductionCosts {...props} />;
      case 'results': return <ProductionResults {...props} />;
      case 'pricing': return <PriceLeveling {...props} />;
      case 'bep_roi': return <BepRoi {...props} />;
      case 'report': return <Report {...props} />;
      default: return <Dashboard data={data} calculations={calculations} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex selection:bg-accent-primary/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
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
              {user}'s Workstation
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
