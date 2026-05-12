import React, { useState } from 'react';
import { Lock, User, LogIn, CircleDollarSign, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { UserAccount } from '../types';

type LoginProps = {
  accounts: UserAccount[];
  onLogin: (account: UserAccount) => void;
};

export const Login: React.FC<LoginProps> = ({ accounts, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login
    setTimeout(() => {
      const match = (accounts || []).find(a => a.username === username && a.password === password);
      if (match) {
        onLogin(match);
      } else {
        setError('Username atau Password salah.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card p-10 space-y-8 bg-[#1e3a4a]/40 border-accent-primary/20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/20 border border-accent-primary/30 text-accent-primary mb-4">
              <CircleDollarSign className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">
              CostMaster<span className="text-accent-primary">Pro</span>
            </h1>
            <p className="text-text-secondary text-sm">Masuk untuk mengelola HPP Bisnis Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-accent-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a181d]/50 border border-border-main rounded-xl py-3 pl-11 pr-4 outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-sm"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-accent-primary transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a181d]/50 border border-border-main rounded-xl py-3 pl-11 pr-4 outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-accent-danger/10 border border-accent-danger/20 text-accent-danger text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
                isLoading 
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                  : "bg-accent-primary text-black hover:bg-accent-primary/90 shadow-accent-primary/20"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk Sekarang
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
             <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Akses Member Eksklusif</p>
             <p className="text-[9px] text-slate-600 mt-2 italic px-8">Gunakan username: admin & password: admin123 untuk masuk.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
