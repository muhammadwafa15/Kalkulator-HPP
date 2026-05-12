import React from 'react';
import { 
  Smartphone, 
  Globe, 
  Palette, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { OwnerSettings } from '../types';
import { cn } from '../lib/utils';

type ManajemenProfilProps = {
  ownerSettings: OwnerSettings;
  setOwnerSettings: (settings: OwnerSettings) => void;
};

const THEME_COLORS = [
  { name: 'Emerald', hex: '#00c9a7' },
  { name: 'Cyan', hex: '#0891b2' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
];

export const ManajemenProfil: React.FC<ManajemenProfilProps> = ({ ownerSettings, setOwnerSettings }) => {
  const [success, setSuccess] = React.useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            Manajemen <span className="text-accent-primary">Profil & Brand</span>
          </h2>
          <p className="text-text-secondary text-xs mt-1 font-medium tracking-widest uppercase">Kustomisasi identitas aplikasi Anda</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-accent-primary text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-primary/20 flex items-center gap-2"
        >
          {success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {success ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo & WhatsApp */}
        <div className="space-y-8">
          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-primary/10 border border-accent-primary/20">
                <ImageIcon className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm italic">Logo & Brand Visual</h3>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-[2rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-4 text-center group hover:border-accent-primary/50 transition-colors cursor-pointer relative overflow-hidden">
                {ownerSettings.logoUrl ? (
                  <img src={ownerSettings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-white/20 mb-2 group-hover:text-accent-primary transition-colors" />
                    <span className="text-[10px] text-white/30 font-bold uppercase">Unggah Logo</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (re) => setOwnerSettings({ ...ownerSettings, logoUrl: re.target?.result as string });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-bold">Instruksi Logo</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">Gunakan gambar format PNG transparan dengan resolusi minimal 512x512px untuk hasil terbaik.</p>
                <button className="text-[10px] font-black text-accent-primary uppercase tracking-widest mt-2 hover:underline">Hapus Logo Saat Ini</button>
              </div>
            </div>
          </section>

          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-warning/10 border border-accent-warning/20">
                <Smartphone className="w-6 h-6 text-accent-warning" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm italic">Aktivasi WhatsApp Notifikasi</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white italic">Status Notifikasi</h4>
                  <p className="text-[10px] text-text-secondary">Aktifkan pengiriman pesan otomatis</p>
                </div>
                <button 
                  onClick={() => setOwnerSettings({ ...ownerSettings, isWhatsappEnabled: !ownerSettings.isWhatsappEnabled })}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                    ownerSettings.isWhatsappEnabled ? "bg-accent-warning" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform duration-300",
                    ownerSettings.isWhatsappEnabled ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Nomor WhatsApp (Aktif)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={ownerSettings.whatsappNumber || ''}
                    onChange={(e) => setOwnerSettings({ ...ownerSettings, whatsappNumber: e.target.value })}
                    placeholder="Contoh: 628123456789"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-accent-warning transition-colors font-bold text-sm pl-12"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-warning font-black text-sm">+</div>
                </div>
              </div>
              <div className="p-4 bg-accent-warning/5 border border-accent-warning/10 rounded-2xl flex gap-3 italic">
                <AlertCircle className="w-4 h-4 text-accent-warning shrink-0" />
                <p className="text-[10px] text-text-secondary leading-relaxed">
                  Nomor ini akan digunakan sebagai tujuan pesan otomatis saat member melakukan permintaan upgrade level atau konfirmasi pembayaran.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Domain & Theme */}
        <div className="space-y-8">
          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-secondary/10 border border-accent-secondary/20">
                <Globe className="w-6 h-6 text-accent-secondary" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm italic">Domain Kustom</h3>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Nama Domain / Subdomain</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={ownerSettings.customDomain || ''}
                      onChange={(e) => setOwnerSettings({ ...ownerSettings, customDomain: e.target.value, domainStatus: 'pending' })}
                      placeholder="app.bisnisanda.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-accent-secondary transition-colors font-bold text-sm pl-12"
                    />
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-secondary w-5 h-5" />
                  </div>
                  {ownerSettings.customDomain && ownerSettings.domainStatus !== 'active' && (
                    <button 
                      onClick={() => {
                        // Simulate verification
                        setOwnerSettings({ ...ownerSettings, domainStatus: 'active' });
                        alert('Domain berhasil diverifikasi dan diaktifkan!');
                      }}
                      className="px-6 py-4 bg-accent-secondary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent-secondary/20"
                    >
                      Verifikasi
                    </button>
                  )}
                </div>
              </div>

              {ownerSettings.domainStatus === 'active' ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-black uppercase tracking-widest text-xs">Domain Aktif</span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-relaxed font-medium capitalize">
                    Aplikasi Anda dan semua akses member sekarang dapat dilakukan melalui: 
                    <span className="text-white ml-1 underline decoration-emerald-500/50">https://{ownerSettings.customDomain}</span>
                  </p>
                </div>
              ) : ownerSettings.customDomain ? (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 text-accent-warning">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Langkah Integrasi DNS</span>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-[10px] text-text-secondary italic">Tambahkan record berikut pada panel kontrol domain Anda (DNS Management):</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1 bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-[8px] font-black uppercase text-text-secondary mb-1 opacity-50">Type</p>
                          <p className="text-[10px] font-bold text-white">CNAME</p>
                        </div>
                        <div className="col-span-1 bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-[8px] font-black uppercase text-text-secondary mb-1 opacity-50">Host</p>
                          <p className="text-[10px] font-bold text-white">{ownerSettings.customDomain?.includes('.') ? ownerSettings.customDomain.split('.')[0] : '@'}</p>
                        </div>
                        <div className="col-span-1 bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-[8px] font-black uppercase text-text-secondary mb-1 opacity-50">Value</p>
                          <p className="text-[10px] font-bold text-white">lb.costmaster.pro</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-accent-secondary/5 border border-accent-secondary/10 rounded-xl">
                        <p className="text-[9px] text-text-secondary leading-relaxed">
                          *Setelah menambahkan record, mungkin butuh waktu hingga 24 jam untuk propagasi DNS sebelum Anda dapat menekan tombol Verifikasi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-text-secondary italic pl-2">Hubungkan domain Anda sendiri untuk memperkuat branding profesional dan akses member yang terpusat.</p>
              )}
            </div>
          </section>

          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-primary/10 border border-accent-primary/20">
                <Palette className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm italic">Tema & Warna Tampilan</h3>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                {THEME_COLORS.map(color => (
                  <button 
                    key={color.hex}
                    onClick={() => setOwnerSettings({ ...ownerSettings, primaryColor: color.hex })}
                    className={cn(
                      "group flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                      ownerSettings.primaryColor === color.hex 
                        ? "bg-white/10 border-accent-primary shadow-lg shadow-accent-primary/10" 
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    )}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl shadow-inner group-hover:scale-110 transition-transform" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{color.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 opacity-40 italic">Preview Dashboard Theme</h4>
                <div className="flex gap-4">
                  <div className="flex-1 h-3 rounded-full bg-accent-primary/20" style={{ backgroundColor: `${ownerSettings.primaryColor}20` }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: '65%', backgroundColor: ownerSettings.primaryColor }}></div>
                  </div>
                  <div className="w-12 h-3 rounded-full" style={{ backgroundColor: ownerSettings.primaryColor }}></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded-xl bg-white/5 border border-white/10"></div>
                  <div className="h-8 rounded-xl bg-white/5 border border-white/10 border-accent-primary/30" style={{ borderColor: `${ownerSettings.primaryColor}30` }}></div>
                  <div className="h-8 rounded-xl bg-white/5 border border-white/10"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
