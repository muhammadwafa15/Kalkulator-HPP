import React from 'react';
import { LayoutDashboard, Users, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { formatRupiah } from '../lib/utils';

type OwnerDashboardProps = {
  accounts: UserAccount[];
};

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ accounts }) => {
  const totalMembers = accounts.filter(a => a.role === 'member').length;
  const activeMembers = accounts.filter(a => a.status === 'active' && a.role === 'member').length;
  const pendingMembers = accounts.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading">Owner Terminal</h1>
          <p className="text-text-secondary text-sm">System Health & Member Activity Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OwnerStatCard title="TOTAL MEMBER" value={totalMembers.toString()} icon={Users} color="text-accent-primary" />
        <OwnerStatCard title="MEMBER AKTIF" value={activeMembers.toString()} icon={CheckCircle2} color="text-emerald-500" />
        <OwnerStatCard title="PENDING REGISTER" value={pendingMembers.toString()} icon={AlertCircle} color="text-accent-warning" />
        <OwnerStatCard title="EST. REVENUE" value={formatRupiah(totalMembers * 150000)} icon={TrendingUp} color="text-accent-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {accounts.slice(0, 5).map((acc, i) => (
              <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-xs font-bold">
                    {acc.fullName.charAt(0)}
                   </div>
                   <div>
                    <p className="text-sm font-semibold">{acc.fullName}</p>
                    <p className="text-[10px] text-text-secondary">Logged in 2 hours ago</p>
                   </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded font-bold ${acc.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {acc.status?.toUpperCase() || ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 border-accent-primary/20 bg-accent-primary/5">
           <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-accent-primary">Platform Maintenance</h3>
           <div className="space-y-4 text-sm text-text-secondary">
              <p>• Database Sync Status: <span className="text-emerald-500 font-bold uppercase text-[10px]">Optimal</span></p>
              <p>• Plugin Store: <span className="text-accent-primary font-bold uppercase text-[10px]">Live (3 Updates)</span></p>
              <p>• Member APIs: <span className="text-emerald-500 font-bold uppercase text-[10px]">All Systems Operational</span></p>
              <div className="pt-4">
                <button className="w-full py-3 bg-accent-primary text-black font-bold rounded-xl text-xs uppercase tracking-widest">Run System Scan</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const OwnerStatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="glass-card p-6 border-white/10 group hover:border-accent-primary/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{title}</p>
      <Icon className={`w-5 h-5 ${color} opacity-80`} />
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);
