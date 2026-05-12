import React, { useState } from 'react';
import { User, Lock, ShieldCheck, Crown, Zap, CheckCircle2, Save, Key } from 'lucide-react';
import { UserAccount } from '../types';
import { PLUGIN_PACKAGES } from '../constants';
import { cn } from '../lib/utils';

type MemberProfileProps = {
  user: UserAccount | null;
  updateAccounts: (accounts: UserAccount[]) => void;
  accounts: UserAccount[];
  onUpdateUser: (user: UserAccount) => void;
};

export const MemberProfile: React.FC<MemberProfileProps> = ({ user, updateAccounts, accounts, onUpdateUser }) => {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [password, setPassword] = useState(user?.password || '');
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const currentPackage = PLUGIN_PACKAGES.find(p => p.features.length === user.enabledFeatures?.length);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, fullName, password };
    const updatedAccounts = accounts.map(a => a.id === user.id ? updatedUser : a);
    
    updateAccounts(updatedAccounts);
    onUpdateUser(updatedUser);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">
          Profil <span className="text-accent-primary">Saya</span>
        </h2>
        <p className="text-text-secondary text-xs mt-1 font-medium tracking-widest uppercase italic">Kelola informasi akun dan amankan profil Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Status Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700 rotate-12">
              {currentPackage?.id === 'starter' && <Zap className="w-32 h-32" />}
              {currentPackage?.id === 'pro' && <ShieldCheck className="w-32 h-32" />}
              {currentPackage?.id === 'enterprise' && <Crown className="w-32 h-32" />}
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-accent-primary/10 flex items-center justify-center font-black text-3xl text-accent-primary mb-4 border border-accent-primary/20">
                  {user.fullName.charAt(0)}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">{user.fullName}</h3>
                <p className="text-xs text-text-secondary">@{user.username}</p>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-2 opacity-50">Level Member Aktif</p>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-widest",
                    currentPackage?.id === 'starter' ? "bg-white/5 border-white/10 text-white" :
                    currentPackage?.id === 'pro' ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary" :
                    "bg-accent-secondary/10 border-accent-secondary/30 text-accent-secondary"
                  )}>
                    {currentPackage?.id === 'starter' && <Zap className="w-4 h-4" />}
                    {currentPackage?.id === 'pro' && <ShieldCheck className="w-4 h-4" />}
                    {currentPackage?.id === 'enterprise' && <Crown className="w-4 h-4" />}
                    {currentPackage?.name || 'Custom Plan'}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-2 opacity-50">Masa Berlaku</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {new Date(user.activeUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <User className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-sm italic">Pengaturan Akun</h3>
              </div>
              <button 
                type="submit"
                className="px-8 py-3 bg-accent-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-primary/20 flex items-center gap-2"
              >
                {success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {success ? "Berhasil Disimpan" : "Simpan Perubahan"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-accent-primary transition-colors font-bold text-sm"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1 flex items-center gap-2 opacity-50">
                    <Lock className="w-3 h-3" /> Username (Immutable)
                  </label>
                  <input 
                    type="text" 
                    value={user.username || ''}
                    readOnly
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-sm text-text-secondary cursor-not-allowed opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1 flex items-center gap-2">
                    <Key className="w-3 h-3" /> Ganti Password
                  </label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-accent-primary transition-colors font-bold text-sm pl-12"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary opacity-30" />
                  </div>
                </div>

                <div className="p-5 bg-accent-primary/5 border border-accent-primary/10 rounded-3xl italic space-y-2">
                  <div className="flex items-center gap-2 text-accent-primary">
                    <Save className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Keamanan Akun</span>
                  </div>
                  <p className="text-[9px] text-text-secondary leading-relaxed">
                    Pastikan Anda menggunakan password yang kuat dan unik. Kami merekomendasikan penggantian password secara berkala untuk menjaga keamanan data usaha Anda.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
