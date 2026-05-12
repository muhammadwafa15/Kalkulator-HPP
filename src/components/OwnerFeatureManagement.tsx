import React from 'react';
import { ShieldAlert, Check, X, ShieldCheck, Zap, Crown, Info } from 'lucide-react';
import { UserAccount } from '../types';
import { APP_FEATURES, PLUGIN_PACKAGES } from '../constants';

type OwnerFeatureProps = {
  accounts: UserAccount[];
  updateAccounts: (accounts: UserAccount[]) => void;
};

export const OwnerFeatureManagement: React.FC<OwnerFeatureProps> = ({ accounts, updateAccounts }) => {
  const members = accounts.filter(a => a.role === 'member');
  const pendingRequests = members.filter(m => m.upgradeRequest?.status === 'pending');

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

  const toggleFeature = (accountId: string, featureId: string) => {
    updateAccounts(accounts.map(a => {
      if (a.id === accountId) {
        const features = a.enabledFeatures || [];
        const hasFeature = features.includes(featureId);
        const newFeatures = hasFeature 
          ? features.filter(f => f !== featureId)
          : [...features, featureId];
        return { ...a, enabledFeatures: newFeatures };
      }
      return a;
    }));
  };

  const applyPackage = (accountId: string, packageId: string) => {
    const pkg = PLUGIN_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;

    updateAccounts(accounts.map(a => 
      a.id === accountId ? { ...a, enabledFeatures: [...(pkg.features || [])] } : a
    ));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-accent-primary" /> Matriks Aktivasi Fitur
          </h1>
          <p className="text-text-secondary text-sm">Kelola akses fitur member secara massal berdasarkan paket</p>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-accent-warning uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap className="w-4 h-4 fill-accent-warning" /> Permintaan Upgrade Menunggu Persetujuan ({pendingRequests.length})
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
                    <p className="text-[10px] text-accent-warning font-bold uppercase tracking-widest leading-none mb-1">REQ: PAKET {req.upgradeRequest?.packageId.toUpperCase()}</p>
                    <p className="text-[9px] text-text-secondary opacity-60 italic">{new Date(req.upgradeRequest?.requestDate || '').toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRejectUpgrade(req.id)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all font-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleApproveUpgrade(req.id)}
                    className="px-6 py-3 bg-accent-warning text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-warning/20"
                  >
                    AKTIFKAN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Package Reference / Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLUGIN_PACKAGES.map(pkg => (
          <div key={pkg.id} className="glass-card p-5 border-white/5 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-3">
              {pkg.id === 'starter' && <Zap className="w-5 h-5 text-slate-400" />}
              {pkg.id === 'pro' && <ShieldCheck className="w-5 h-5 text-accent-primary" />}
              {pkg.id === 'enterprise' && <Crown className="w-5 h-5 text-accent-secondary" />}
              <h4 className="font-bold text-sm tracking-wide">{pkg.name}</h4>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed mb-4 italic">
              "{pkg.recommendation}"
            </p>
            <div className="flex flex-wrap gap-1.5 opacity-60">
              {pkg.features.map(f => (
                <span key={f} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {APP_FEATURES.find(af => af.id === f)?.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-6 min-w-[250px] font-bold text-xs uppercase tracking-widest text-text-secondary">Member & Package</th>
                {APP_FEATURES.map(f => (
                  <th key={f.id} className="p-6 text-center min-w-[120px]">
                    <p className="text-[10px] font-black uppercase text-accent-primary mb-1">{f.label}</p>
                    <Info className="w-3 h-3 mx-auto text-slate-500 opacity-50 cursor-help" title={f.desc} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map(member => {
                // Determine current package matches
                const currentFeatures = member.enabledFeatures || [];
                const activePackage = [...PLUGIN_PACKAGES].reverse().find(pkg => 
                  pkg.features.every(f => currentFeatures.includes(f))
                );

                return (
                  <tr key={member.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4 mb-4 relative">
                        <div className="w-10 h-10 rounded-2xl bg-accent-primary/10 flex items-center justify-center font-black text-accent-primary">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">{member.fullName}</p>
                            {member.upgradeRequest?.status === 'pending' && (
                              <span className="w-2 h-2 rounded-full bg-accent-warning animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" title="Upgrade Pending"></span>
                            )}
                          </div>
                          <p className="text-[10px] text-text-secondary">@{member.username}</p>
                        </div>
                      </div>
                      
                      {/* Package Quick Actions */}
                      <div className="flex gap-2">
                        {PLUGIN_PACKAGES.map(pkg => (
                          <button
                            key={pkg.id}
                            onClick={() => applyPackage(member.id, pkg.id)}
                            className={`text-[9px] px-2 py-1 rounded-lg border font-bold transition-all ${
                              activePackage?.id === pkg.id
                                ? 'bg-accent-primary/20 border-accent-primary/40 text-accent-primary'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-accent-primary/30'
                            }`}
                          >
                            SET {pkg.id.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </td>
                    
                    {APP_FEATURES.map(feature => {
                      const isActive = (member.enabledFeatures || []).includes(feature.id);
                      return (
                        <td key={feature.id} className="p-6 text-center">
                          <button
                            onClick={() => toggleFeature(member.id, feature.id)}
                            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto ${
                              isActive 
                                ? 'bg-accent-primary text-bg-primary shadow-lg shadow-accent-primary/20 scale-100' 
                                : 'bg-white/5 text-slate-600 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 border border-white/10'
                            }`}
                          >
                            {isActive ? <Check className="w-5 h-5 font-black" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
