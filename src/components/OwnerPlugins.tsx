import React from 'react';
import { Puzzle, Star, Zap, ShoppingCart, Lock } from 'lucide-react';

export const OwnerPlugins: React.FC = () => {
  const plugins = [
    { id: 'whitelabel', title: 'Whitelabel Pro', desc: 'Hapus branding CostMaster dan gunakan logo sendiri.', price: 'Rp 250.000', icon: Star, color: 'text-amber-400', active: true },
    { id: 'multicurrency', title: 'Multi-Currency', desc: 'Dukungan untuk berbagai mata uang internasional.', price: 'Rp 150.000', icon: Zap, color: 'text-blue-400', active: false },
    { id: 'ai_predict', title: 'AI Price Prediction', desc: 'Gunakan AI untuk memprediksi harga pasar ideal.', price: 'Rp 500.000', icon: Puzzle, color: 'text-accent-primary', active: false },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Puzzle className="text-accent-primary" /> Premium Plugins Store
        </h1>
        <p className="text-text-secondary text-sm">Expand capabilities with powerful production add-ons</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plugins.map(plugin => (
          <div key={plugin.id} className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden group">
            {!plugin.active && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:ring-accent-primary/50 transition-all`}>
              <plugin.icon className={`w-8 h-8 ${plugin.color}`} />
            </div>
            <h3 className="text-lg font-bold mb-2">{plugin.title}</h3>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed flex-1">
              {plugin.desc}
            </p>
            
            <div className="w-full pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-slate-500">Price</span>
                <span className="text-sm font-bold text-white">{plugin.price}</span>
              </div>
              <button className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                plugin.active 
                  ? 'bg-emerald-500/20 text-emerald-500 cursor-default' 
                  : 'bg-accent-primary text-black hover:scale-105 active:scale-95'
              }`}>
                {plugin.active ? (
                  <>Sudah Terinstal</>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" />
                    Beli Lisensi
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
