import React from 'react';
import { Users, Link as LinkIcon, Mail, Phone, CreditCard, ExternalLink } from 'lucide-react';
import { UserAccount } from '../types';

type OwnerCRMProps = {
  accounts: UserAccount[];
};

export const OwnerCRM: React.FC<OwnerCRMProps> = ({ accounts }) => {
  const members = accounts.filter(a => a.role === 'member');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-accent-primary" /> CRM & Member Tracking
          </h1>
          <p className="text-text-secondary text-sm">Kelola pendaftaran baru dan monitoring pembayaran</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
          <LinkIcon className="w-3 h-3" /> Copy Registration Link
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-text-secondary">Member Name</th>
                  <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-text-secondary">Contact</th>
                  <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-text-secondary">Invoice Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs">
                          {member.fullName.charAt(0)}
                         </div>
                         <div>
                          <p className="font-bold">{member.fullName}</p>
                          <p className="text-[10px] text-text-secondary">Joined May 2024</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                         <button className="p-1.5 bg-blue-500/10 text-blue-500 rounded"><Mail className="w-3 h-3" /></button>
                         <button className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded"><Phone className="w-3 h-3" /></button>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">TERBAYAR</span>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-accent-primary hover:underline text-xs flex items-center gap-1 ml-auto">
                        View Payment <ExternalLink className="w-3 h-3" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-6 border-accent-primary/20 bg-accent-primary/5">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-accent-primary/20 text-accent-primary rounded-lg">
                    <CreditCard className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-sm">Payment Gateway</h4>
              </div>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                URL untuk pendaftaran member baru dengan pembayaran otomatis menggunakan Midtrans/Xendit.
              </p>
              <div className="space-y-3">
                 <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] break-all text-accent-primary">
                    https://costmaster.pro/register?ref=owner1
                 </div>
                 <button className="w-full py-3 bg-accent-primary text-black font-bold rounded-xl text-[10px] uppercase tracking-widest transition-transform active:scale-95">Copy URL</button>
              </div>
           </div>

           <div className="glass-card p-6">
              <h4 className="font-bold text-sm mb-4">Integrasi WhatsApp</h4>
              <p className="text-xs text-text-secondary mb-4">Kirim pengingat perpanjangan masa aktif otomatis ke member.</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-bold text-emerald-500 uppercase">Connected</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
