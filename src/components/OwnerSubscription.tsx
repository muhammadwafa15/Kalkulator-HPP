import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle2, UserPlus, X, Shield, Key, Zap, ShieldCheck, Crown } from 'lucide-react';
import { UserAccount } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PLUGIN_PACKAGES, APP_FEATURES } from '../constants';

type OwnerSubscriptionProps = {
  accounts: UserAccount[];
  updateAccounts: (accounts: UserAccount[]) => void;
  ownerSettings: any;
};

export const OwnerSubscription: React.FC<OwnerSubscriptionProps> = ({ accounts, updateAccounts }) => {
  const members = accounts.filter(a => a.role === 'member');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    fullName: '',
    username: '',
    password: '',
    durationDays: 30,
    selectedPackage: 'starter'
  });

  const applyPackage = (accountId: string, packageId: string) => {
    const pkg = PLUGIN_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;

    updateAccounts(accounts.map(a => 
      a.id === accountId ? { ...a, enabledFeatures: [...pkg.features] } : a
    ));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberData.fullName || !newMemberData.username || !newMemberData.password) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + newMemberData.durationDays);

    const pkg = PLUGIN_PACKAGES.find(p => p.id === newMemberData.selectedPackage);

    const newMember: UserAccount = {
      id: `mem-${Date.now()}`,
      fullName: newMemberData.fullName,
      username: newMemberData.username.toLowerCase().replace(/\s+/g, ''),
      password: newMemberData.password,
      role: 'member',
      activeUntil: expiryDate.toISOString().split('T')[0],
      status: 'active',
      enabledFeatures: pkg ? [...pkg.features] : ['dashboard']
    };

    updateAccounts([...accounts, newMember]);
    setNewMemberData({ fullName: '', username: '', password: '', durationDays: 30, selectedPackage: 'starter' });
    setShowAddModal(false);
  };

  const handleApproveUpgrade = (memberId: string) => {
    updateAccounts(accounts.map(a => {
      if (a.id === memberId && a.upgradeRequest) {
        const pkg = PLUGIN_PACKAGES.find(p => p.id === a.upgradeRequest?.packageId);
        return {
          ...a,
          enabledFeatures: pkg ? [...pkg.features] : a.enabledFeatures,
          upgradeRequest: { ...a.upgradeRequest, status: 'approved' }
        };
      }
      return a;
    }));
  };

  const handleRejectUpgrade = (memberId: string) => {
    updateAccounts(accounts.map(a => {
      if (a.id === memberId && a.upgradeRequest) {
        return {
          ...a,
          upgradeRequest: { ...a.upgradeRequest, status: 'rejected' }
        };
      }
      return a;
    }));
  };

  const pendingRequests = members.filter(m => m.upgradeRequest?.status === 'pending');

  const updateExpiry = (id: string, date: string) => {
    updateAccounts(accounts.map(a => a.id === id ? { ...a, activeUntil: date, status: new Date(date) > new Date() ? 'active' : 'expired' } : a));
  };

  const extendSubscription = (id: string, days: number) => {
    updateAccounts(accounts.map(a => {
      if (a.id === id) {
        const currentExpiry = new Date(a.activeUntil);
        const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
        const newExpiry = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
        const dateStr = newExpiry.toISOString().split('T')[0];
        return { ...a, activeUntil: dateStr, status: 'active' };
      }
      return a;
    }));
  };

  const toggleStatus = (id: string) => {
    updateAccounts(accounts.map(a => {
      if (a.id === id) {
        const newStatus = a.status === 'active' ? 'expired' : 'active';
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  const removeMember = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus member ini?')) {
      updateAccounts(accounts.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-accent-primary" /> Pengaturan Masa Aktif
          </h1>
          <p className="text-text-secondary text-sm">Kelola durasi akses dan status berlangganan member</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-accent-primary hover:bg-accent-primary/90 text-bg-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-accent-primary/20"
        >
          <UserPlus className="w-5 h-5" /> Tambah Member Baru
        </button>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-accent-warning uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap className="w-4 h-4 fill-accent-warning" /> Permintaan Upgrade Pending ({pendingRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-5 rounded-3xl bg-accent-warning/10 border-2 border-accent-warning/20 flex items-center justify-between gap-4 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-warning/20 flex items-center justify-center text-accent-warning">
                    {req.upgradeRequest?.packageId === 'pro' ? <ShieldCheck className="w-6 h-6" /> : <Crown className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tight">{req.fullName}</h4>
                    <p className="text-[10px] text-accent-warning font-bold uppercase">Upgrade ke {req.upgradeRequest?.packageId.toUpperCase()}</p>
                    <p className="text-[10px] text-text-secondary opacity-60 italic">{new Date(req.upgradeRequest?.requestDate || '').toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRejectUpgrade(req.id)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleApproveUpgrade(req.id)}
                    className="px-6 py-3 bg-accent-warning text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-warning/20"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {members.map(member => (
          <div key={member.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-white/5">
            <div className="flex items-center gap-4 min-w-[250px]">
              <div className={`p-3 rounded-2xl ${member.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {member.status === 'active' ? <Clock className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold">{member.fullName}</h4>
                  {member.upgradeRequest?.status === 'pending' && (
                    <span className="w-2 h-2 rounded-full bg-accent-warning animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" title="Upgrade Pending"></span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-text-secondary">@{member.username}</p>
                  <span className="text-[9px] font-black uppercase text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full tracking-widest">
                    {PLUGIN_PACKAGES.find(p => p.features.length === member.enabledFeatures.length)?.name || 'Custom'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 items-center">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center md:text-left">Berlaku Hingga</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={member.activeUntil || ''}
                    onChange={(e) => updateExpiry(member.id, e.target.value)}
                    className="bg-bg-primary border border-border-main rounded-lg px-3 py-1.5 text-sm text-white focus:border-accent-primary outline-none"
                  />
                  {new Date(member.activeUntil) < new Date() && (
                    <span className="text-[10px] text-red-500 font-bold">EXPIRED</span>
                  )}
                </div>
              </div>

              <div className="px-6 border-x border-white/5 text-center">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Status</p>
                <button 
                  onClick={() => toggleStatus(member.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${member.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}
                >
                  {member.status?.toUpperCase() || ''}
                </button>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-2">
               <button 
                 onClick={() => extendSubscription(member.id, 30)}
                 className="w-full md:w-auto px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all"
               >
                 Extend 30 Days
               </button>
               <button 
                 onClick={() => removeMember(member.id)}
                 className="w-full md:w-auto px-6 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 rounded-xl text-[10px] font-bold transition-all"
               >
                 Hapus Member
               </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowAddModal(false)}
               className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md p-8 relative z-10 border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="text-accent-primary" /> Member Baru
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">Nama Lengkap</label>
                  <input 
                    type="text"
                    required
                    value={newMemberData.fullName}
                    onChange={e => setNewMemberData({...newMemberData, fullName: e.target.value})}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-bg-primary border border-border-main rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Username</label>
                    <input 
                      type="text"
                      required
                      value={newMemberData.username}
                      onChange={e => setNewMemberData({...newMemberData, username: e.target.value})}
                      placeholder="budi_s"
                      className="w-full bg-bg-primary border border-border-main rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input 
                        type="password"
                        required
                        value={newMemberData.password}
                        onChange={e => setNewMemberData({...newMemberData, password: e.target.value})}
                        className="w-full bg-bg-primary border border-border-main rounded-xl pl-10 pr-4 py-3 text-sm focus:border-accent-primary outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">Level Paket Plugins</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLUGIN_PACKAGES.map(pkg => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setNewMemberData({...newMemberData, selectedPackage: pkg.id})}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          newMemberData.selectedPackage === pkg.id
                            ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                            : 'bg-bg-primary border-border-main text-text-secondary hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-center mb-1">
                          {pkg.id === 'starter' && <Zap className="w-4 h-4" />}
                          {pkg.id === 'pro' && <ShieldCheck className="w-4 h-4" />}
                          {pkg.id === 'enterprise' && <Crown className="w-4 h-4" />}
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-tighter">{pkg.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">Durasi Akses Awal</label>
                  <select 
                    value={newMemberData.durationDays}
                    onChange={e => setNewMemberData({...newMemberData, durationDays: parseInt(e.target.value)})}
                    className="w-full bg-bg-primary border border-border-main rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none transition-all"
                  >
                    <option value={7}>7 Hari (Trial)</option>
                    <option value={30}>30 Hari (1 Bulan)</option>
                    <option value={90}>90 Hari (3 Bulan)</option>
                    <option value={365}>365 Hari (1 Tahun)</option>
                  </select>
                </div>

                <div className="pt-4">
                   <button 
                     type="submit"
                     className="w-full bg-accent-primary text-bg-primary font-bold py-3 rounded-xl hover:bg-accent-primary/90 transition-all flex items-center justify-center gap-2"
                   >
                     Buat Akun Member
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
