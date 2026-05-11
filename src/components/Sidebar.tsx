import React from 'react';
import { 
  LayoutDashboard, 
  Beaker, 
  Settings, 
  Package, 
  CircleDollarSign, 
  BarChart3, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'materials', label: 'Bahan Baku', icon: Beaker },
  { id: 'production_costs', label: 'Biaya Produksi', icon: Settings },
  { id: 'results', label: 'Hasil Produksi', icon: Package },
  { id: 'pricing', label: 'Leveling Harga', icon: CircleDollarSign },
  { id: 'bep_roi', label: 'BEP & ROI', icon: BarChart3 },
  { id: 'report', label: 'Laporan', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-bg-sidebar border-r border-border-main transition-all duration-300 z-50 no-print flex flex-col",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between overflow-hidden">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
              <CircleDollarSign className="text-bg-primary w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight whitespace-nowrap">
              CostMaster<span className="text-accent-primary">Pro</span>
            </span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "sidebar-item",
              activeTab === item.id && "active",
              isCollapsed && "justify-center px-0"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-border-main bg-[#0c1d24]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary shrink-0"></div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate leading-none">Admin Produksi</p>
              <p className="text-[10px] text-text-secondary truncate mt-1">Mitra Bakery Jaya</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
