import React, { useState } from 'react';
import { 
  Book, 
  Search, 
  Trash2, 
  Eye, 
  ChevronRight, 
  Clock, 
  Package, 
  ArrowLeft,
  UtensilsCrossed,
  Layers,
  Users
} from 'lucide-react';
import { AppData, Recipe } from '../types';
import { formatRupiah, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type RecipesProps = {
  data: AppData;
  setData: (data: AppData) => void;
};

export const Recipes: React.FC<RecipesProps> = ({ data, setData }) => {
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const recipes = data.recipes || [];
  
  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteRecipe = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
      setData({
        ...data,
        recipes: recipes.filter(r => r.id !== id)
      });
      if (selectedRecipe?.id === id) setSelectedRecipe(null);
    }
  };

  if (selectedRecipe) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedRecipe(null)}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em] italic">Kembali ke Daftar</span>
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => deleteRecipe(selectedRecipe.id)}
              className="p-3 bg-accent-danger/10 text-accent-danger rounded-2xl hover:bg-accent-danger hover:text-white transition-all shadow-lg shadow-accent-danger/10"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Header Card */}
          <div className="lg:col-span-3 glass-card p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <UtensilsCrossed className="w-48 h-48 rotate-12" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
                    <Book className="w-5 h-5 text-accent-primary" />
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">{selectedRecipe.name}</h2>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-secondary italic">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(selectedRecipe.createdAt).toLocaleDateString('id-ID')}</span>
                  <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {selectedRecipe.unitsPerBatch} Units / Batch</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-accent-primary tracking-widest italic mb-1">HPP Per Unit</p>
                <p className="text-4xl font-black text-white">{formatRupiah(selectedRecipe.hppPerUnit)}</p>
              </div>
            </div>
          </div>

          {/* Left Column: Ingredients */}
          <div className="lg:col-span-2 space-y-6">
            <section className="glass-card p-8 rounded-[2.5rem] border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Layers className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-sm italic">Daftar Bahan Baku</h3>
              </div>

              <div className="space-y-4">
                {selectedRecipe.materials.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-text-secondary">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{m.name}</p>
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{m.qty} {m.unit} @ {formatRupiah(m.pricePerUnit)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-accent-primary">{formatRupiah(m.qty * m.pricePerUnit)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Other Costs */}
          <div className="space-y-6">
            <section className="glass-card p-8 rounded-[2.5rem] border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Users className="w-6 h-6 text-accent-secondary" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-sm italic">Biaya Produksi Lainnya</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-4 opacity-50 italic">Tenaga Kerja</h4>
                  <div className="space-y-3">
                    {selectedRecipe.laborCosts.map((l, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary italic">{l.position}</span>
                        <span className="font-bold text-white">{formatRupiah(l.wagePerHour * l.hoursPerBatch)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-4 opacity-50 italic">Overhead</h4>
                  <div className="space-y-3">
                    {selectedRecipe.overheadCosts.map((o, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary italic">{o.name}</span>
                        <span className="font-bold text-white">{formatRupiah(o.monthlyValue * (o.allocationPercent / 100) / (selectedRecipe.batchesPerMonth || 1))}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 bg-accent-primary/5 -mx-4 px-4 py-4 rounded-2xl border border-accent-primary/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-primary italic">Total Cost / Batch</span>
                    <span className="text-lg font-black text-white">{formatRupiah(selectedRecipe.totalCost)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">
            Produk <span className="text-accent-primary">& Resep</span>
          </h2>
          <p className="text-text-secondary text-xs mt-1 font-medium tracking-widest uppercase italic">Manajemen snapshot perhitungan HPP per produk</p>
        </div>
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5 group-focus-within:text-accent-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari resep..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 outline-none focus:border-accent-primary transition-colors font-bold text-sm"
          />
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="glass-card p-16 rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 rounded-[2rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-white/10">
            <UtensilsCrossed className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold italic uppercase tracking-tight">Belum Ada Resep Tersimpan</h3>
            <p className="text-sm text-text-secondary max-w-xs mx-auto">Simpan hasil perhitungan HPP dari Dashboard untuk membuat resep produk baru.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <motion.div 
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card group p-6 rounded-[2.5rem] border-white/5 hover:border-accent-primary/30 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col h-full"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <UtensilsCrossed className="w-24 h-24 rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-accent-primary/10 group-hover:border-accent-primary/20 transition-colors">
                      <Book className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest opacity-50">{new Date(recipe.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>

                  <h4 className="text-lg font-black uppercase italic tracking-tight mb-2 group-hover:text-accent-primary transition-colors truncate">{recipe.name}</h4>
                  
                  <div className="mt-2 space-y-4 flex-1">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <div>
                        <p className="text-[10px] font-black uppercase text-accent-primary tracking-widest italic mb-1">HPP Per Unit</p>
                        <p className="text-2xl font-black text-white">{formatRupiah(recipe.hppPerUnit)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary italic">
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {recipe.unitsPerBatch} Un / Batch</span>
                      <span className="flex items-center gap-1 text-accent-primary">Detail Resep <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
