import React from 'react';
import { 
  LayoutDashboard, 
  Beaker, 
  Settings, 
  Package, 
  CircleDollarSign, 
  BarChart3, 
  FileText,
  UserCog,
  ShieldAlert,
  CalendarClock,
  Puzzle,
  Users,
  ChevronLeft,
  Menu,
  CircleUser,
  UtensilsCrossed
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserRole } from '../types';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  role?: UserRole;
  enabledFeatures?: string[];
  ownerSettings?: any;
};

const memberMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'materials', label: 'Bahan Baku', icon: Beaker },
  { id: 'production_costs', label: 'Biaya Produksi', icon: Settings },
  { id: 'results', label: 'Hasil Produksi', icon: Package },
  { id: 'pricing', label: 'Leveling Harga', icon: CircleDollarSign },
  { id: 'bep_roi', label: 'BEP & ROI', icon: BarChart3 },
  { id: 'report', label: 'Laporan', icon: FileText },
  { id: 'recipes', label: 'Resep Produk', icon: UtensilsCrossed },
  { id: 'member_profile', label: 'Profil Saya', icon: CircleUser },
];

const ownerMenuItems = [
  { id: 'owner_dashboard', label: 'Member Summary', icon: LayoutDashboard },
  { id: 'owner_accounts', label: 'Aktivasi Fitur', icon: ShieldAlert },
  { id: 'owner_subscriptions', label: 'Masa Aktif', icon: CalendarClock },
  { id: 'owner_profile', label: 'Manajemen Profil', icon: UserCog },
  { id: 'owner_plugins', label: 'Premium Plugins', icon: Puzzle },
  { id: 'owner_crm', label: 'CRM & Payment', icon: Users },
  { id: 'dashboard', label: 'View as Member', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed, 
  role,
  enabledFeatures = [],
  ownerSettings
}) => {
  const currentItems = role === 'owner' 
    ? ownerMenuItems 
    : memberMenuItems.filter(item => 
        item.id === 'dashboard' || 
        item.id === 'member_profile' || 
        (enabledFeatures || []).includes(item.id)
      );

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-bg-sidebar border-r border-border-main transition-all duration-300 z-50 no-print flex flex-col",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between overflow-hidden">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            {ownerSettings?.logoUrl ? (
              <img src={ownerSettings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
                <CircleDollarSign className="text-bg-primary w-5 h-5" />
              </div>
            )}
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
        {currentItems.map((item) => (
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary shrink-0 flex items-center justify-center">
             <CircleUser className="text-white/80 w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate leading-none uppercase">{role === 'owner' ? 'Owner Account' : 'Staff Member'}</p>
              <p className="text-[10px] text-text-secondary truncate mt-1">CostMaster Pro Access</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
