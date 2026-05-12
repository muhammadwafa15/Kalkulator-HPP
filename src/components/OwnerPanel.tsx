import React, { useState } from 'react';
import { UserCog, Plus, Trash2, Key, Save, UserPlus, ShieldCheck, X } from 'lucide-react';
import { UserAccount } from '../types';

type OwnerPanelProps = {
  accounts: UserAccount[];
  updateAccounts: (accounts: UserAccount[]) => void;
};

export const OwnerPanel: React.FC<OwnerPanelProps> = ({ accounts, updateAccounts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftAccount, setDraftAccount] = useState<UserAccount | null>(null);

  const addAccount = () => {
    const newAcc: UserAccount = {
      id: Math.random().toString(36).substr(2, 9),
      username: '',
      password: '',
      role: 'member',
      fullName: 'New Member',
      activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      enabledFeatures: ['dashboard'],
      status: 'active'
    };
    // We add it to the list but don't strictly "save" it until the user clicks check
    // Actually, it's better to add it to the list and start editing it
    updateAccounts([...accounts, newAcc]);
    setEditingId(newAcc.id);
    setDraftAccount(newAcc);
  };

  const startEditing = (acc: UserAccount) => {
    setEditingId(acc.id);
    setDraftAccount({ ...acc });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftAccount(null);
  };

  const saveEditing = () => {
    if (draftAccount) {
      updateAccounts(accounts.map(a => a.id === draftAccount.id ? draftAccount : a));
      setEditingId(null);
      setDraftAccount(null);
    }
  };

  const updateDraft = (updates: Partial<UserAccount>) => {
    if (draftAccount) {
      setDraftAccount({ ...draftAccount, ...updates });
    }
  };

  const deleteAccount = (id: string) => {
    if (accounts.find(a => a.id === id)?.role === 'owner') {
      alert('Owner account cannot be deleted!');
      return;
    }
    updateAccounts(accounts.filter(a => a.id !== id));
    if (editingId === id) {
      cancelEditing();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <UserCog className="text-accent-primary" /> Management Access Control
        </h2>
        <button onClick={addAccount} className="btn-primary">
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Account List */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0a181d] border-b border-border-main">
              <tr>
                <th className="p-4 text-text-secondary uppercase text-[10px] tracking-widest font-bold">Role</th>
                <th className="p-4 text-text-secondary uppercase text-[10px] tracking-widest font-bold">Full Name</th>
                <th className="p-4 text-text-secondary uppercase text-[10px] tracking-widest font-bold">Username</th>
                <th className="p-4 text-text-secondary uppercase text-[10px] tracking-widest font-bold">Password</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${acc.role === 'owner' ? 'bg-accent-primary/20 text-accent-primary' : 'bg-accent-secondary/20 text-accent-secondary'}`}>
                      {acc.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {editingId === acc.id && draftAccount ? (
                      <input 
                        type="text" 
                        value={draftAccount.fullName || ''} 
                        onChange={(e) => updateDraft({ fullName: e.target.value })}
                        className="bg-bg-primary/50 border border-border-main rounded px-2 py-1 outline-none focus:border-accent-primary w-full"
                      />
                    ) : (
                      <span className="font-medium text-white">{acc.fullName}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === acc.id && draftAccount ? (
                      <input 
                        type="text" 
                        value={draftAccount.username || ''} 
                        onChange={(e) => updateDraft({ username: e.target.value })}
                        className="bg-bg-primary/50 border border-border-main rounded px-2 py-1 outline-none focus:border-accent-primary"
                      />
                    ) : acc.username}
                  </td>
                  <td className="p-4">
                    {editingId === acc.id && draftAccount ? (
                      <div className="relative">
                        <input 
                          type="text" 
                          value={draftAccount.password || ''} 
                          onChange={(e) => updateDraft({ password: e.target.value })}
                          className="bg-bg-primary/50 border border-border-main rounded px-2 py-1 outline-none focus:border-accent-primary pr-8"
                        />
                        <Key className="absolute right-2 top-2 w-3 h-3 text-slate-500" />
                      </div>
                    ) : (
                      <span className="font-mono text-slate-500">••••••••</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {editingId === acc.id ? (
                      <>
                        <button 
                          onClick={saveEditing}
                          title="Simpan"
                          className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={cancelEditing}
                          title="Batalkan"
                          className="p-2 bg-accent-danger/20 text-accent-danger rounded-lg hover:bg-accent-danger hover:text-white transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button 
                         onClick={() => startEditing(acc)}
                         title="Edit"
                         className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteAccount(acc.id)}
                      disabled={acc.role === 'owner'}
                      title="Hapus"
                      className={`p-2 rounded-lg transition-all ${acc.role === 'owner' ? 'opacity-20 cursor-not-allowed' : 'hover:bg-accent-danger/20 text-slate-400 hover:text-accent-danger'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Info Card */}
        <div className="p-6 bg-accent-primary/5 border border-accent-primary/20 rounded-2xl flex items-start gap-5">
           <div className="w-12 h-12 rounded-2xl bg-accent-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-accent-primary w-6 h-6" />
           </div>
           <div>
              <h4 className="font-bold text-accent-primary mb-1">Owner Security Guidelines</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                As the application owner, you have full control over data accessibility. 
                Keep your credentials unique and strong. Adding members allows staff to manage production costs 
                and generation without access to this panel.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
