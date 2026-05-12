import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData, RawMaterial } from '../types';
import { motion } from 'motion/react';

type RawMaterialsProps = {
  data: AppData;
  setData: (data: AppData) => void;
  calculations: any;
  updateMaterials: (materials: RawMaterial[]) => void;
};

export const RawMaterials: React.FC<RawMaterialsProps> = ({ data, calculations, updateMaterials }) => {
  const [draftMaterials, setDraftMaterials] = useState<RawMaterial[]>(data.materials);

  // Sync draft state with data prop when it changes (e.g. on login/account switch)
  useEffect(() => {
    setDraftMaterials(data.materials);
  }, [data.materials]);

  const hasChanges = JSON.stringify(draftMaterials) !== JSON.stringify(data.materials);

  const addMaterial = () => {
    setDraftMaterials([...draftMaterials, { 
      id: Math.random().toString(), 
      name: '', 
      unit: '', 
      qty: 0, 
      pricePerUnit: 0, 
      note: '-' 
    }]);
  };

  const removeMaterial = (id: string) => {
    setDraftMaterials(draftMaterials.filter(m => m.id !== id));
  };

  const updateDraft = (idx: number, updates: Partial<RawMaterial>) => {
    const next = [...draftMaterials];
    next[idx] = { ...next[idx], ...updates };
    setDraftMaterials(next);
  };

  const saveChanges = () => {
    updateMaterials(draftMaterials);
  };

  const cancelChanges = () => {
    setDraftMaterials(data.materials);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rincian Bahan Baku</h2>
          {hasChanges && <p className="text-[10px] text-accent-primary font-bold animate-pulse">ADA PERUBAHAN BELUM TERSIMPAN</p>}
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
              <button 
                onClick={saveChanges}
                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
              >
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
              <button 
                onClick={cancelChanges}
                className="flex items-center gap-2 bg-accent-danger/20 text-accent-danger px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent-danger hover:text-white transition-all"
              >
                <X className="w-4 h-4" /> Batal
              </button>
            </motion.div>
          )}
          <button onClick={addMaterial} className="btn-primary">
            <Plus className="w-4 h-4" /> Tambah Bahan
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 border-b border-border-main">
            <tr>
              <th className="p-4 w-12 text-slate-400">No</th>
              <th className="p-4">Nama Bahan</th>
              <th className="p-4">Satuan</th>
              <th className="p-4">Qty / Batch</th>
              <th className="p-4">Harga Satuan</th>
              <th className="p-4">Total</th>
              <th className="p-4 w-12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main">
            {draftMaterials.map((m, idx) => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-slate-500">{idx + 1}</td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={m.name || ''} 
                    onChange={e => updateDraft(idx, { name: e.target.value })}
                    className="input-inline w-full border-transparent focus:border-accent-primary"
                    placeholder="Contoh: Tepung Terigu"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={m.unit || ''} 
                    onChange={e => updateDraft(idx, { unit: e.target.value })}
                    className="input-inline w-20 border-transparent focus:border-accent-primary"
                    placeholder="kg/gr"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={m.qty || 0} 
                    onChange={e => updateDraft(idx, { qty: Number(e.target.value) })}
                    className="input-inline w-24 border-transparent focus:border-accent-primary"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={m.pricePerUnit || 0} 
                    onChange={e => updateDraft(idx, { pricePerUnit: Number(e.target.value) })}
                    className="input-inline w-32 border-transparent focus:border-accent-primary"
                  />
                </td>
                <td className="p-4 font-semibold text-accent-primary">
                  {formatRupiah(m.qty * m.pricePerUnit)}
                </td>
                <td className="p-4">
                  <button onClick={() => removeMaterial(m.id)} className="opacity-0 group-hover:opacity-100 text-accent-danger hover:scale-110 transition-all p-2 hover:bg-accent-danger/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 bg-white/5 border-t border-border-main flex flex-wrap gap-8 justify-end">
          <div className="text-right">
            <p className="text-xs text-slate-400">Total Biaya Bahan Baku/Batch</p>
            <p className="text-xl font-bold text-white">{formatRupiah(draftMaterials.reduce((acc, m) => acc + (m.qty * m.pricePerUnit), 0))}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Hasil Kalkulasi Tersimpan</p>
            <p className="text-xl font-bold text-accent-primary">{formatRupiah(calculations.materialPerUnit)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
