import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData, RawMaterial } from '../types';

type RawMaterialsProps = {
  data: AppData;
  calculations: any;
  updateMaterials: (materials: RawMaterial[]) => void;
};

export const RawMaterials: React.FC<RawMaterialsProps> = ({ data, calculations, updateMaterials }) => {
  const addMaterial = () => {
    updateMaterials([...data.materials, { 
      id: Math.random().toString(), 
      name: '', 
      unit: '', 
      qty: 0, 
      pricePerUnit: 0, 
      note: '-' 
    }]);
  };

  const removeMaterial = (id: string) => {
    updateMaterials(data.materials.filter(m => m.id !== id));
  };

  const updateMaterial = (idx: number, updates: Partial<RawMaterial>) => {
    const next = [...data.materials];
    next[idx] = { ...next[idx], ...updates };
    updateMaterials(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rincian Bahan Baku</h2>
        <button onClick={addMaterial} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Bahan
        </button>
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
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main">
            {data.materials.map((m, idx) => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-slate-500">{idx + 1}</td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={m.name} 
                    onChange={e => updateMaterial(idx, { name: e.target.value })}
                    className="input-inline w-full"
                    placeholder="Contoh: Tepung Terigu"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={m.unit} 
                    onChange={e => updateMaterial(idx, { unit: e.target.value })}
                    className="input-inline w-20"
                    placeholder="kg/gr"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={m.qty} 
                    onChange={e => updateMaterial(idx, { qty: Number(e.target.value) })}
                    className="input-inline w-24"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={m.pricePerUnit} 
                    onChange={e => updateMaterial(idx, { pricePerUnit: Number(e.target.value) })}
                    className="input-inline w-32"
                  />
                </td>
                <td className="p-4 font-semibold text-accent-primary">
                  {formatRupiah(m.qty * m.pricePerUnit)}
                </td>
                <td className="p-4">
                  <button onClick={() => removeMaterial(m.id)} className="text-accent-danger hover:scale-110 transition-transform">
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
            <p className="text-xl font-bold text-white">{formatRupiah(calculations.totalMaterialBatch)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Biaya Bahan Baku/Unit</p>
            <p className="text-xl font-bold text-accent-primary">{formatRupiah(calculations.materialPerUnit)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
