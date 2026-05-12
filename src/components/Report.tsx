import React, { useRef, useState } from 'react';
import { FileDown, Printer, Copy, Check, Info, Loader2 } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { AppData } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';

type ReportProps = {
  data: AppData;
  setData: (data: AppData) => void;
  calculations: any;
};

export const Report: React.FC<ReportProps> = ({ data, calculations }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const cleanStylesForExport = (clonedDoc: Document) => {
    // Add a style tag to override problematic CSS and align fonts
    const style = clonedDoc.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      
      :root {
        /* Force hex values for common colors that might be oklch in Tailwind 4 */
        --color-slate-50: #f8fafc !important;
        --color-slate-100: #f1f5f9 !important;
        --color-slate-200: #e2e8f0 !important;
        --color-slate-300: #cbd5e1 !important;
        --color-slate-400: #94a3b8 !important;
        --color-slate-500: #64748b !important;
        --color-slate-600: #475569 !important;
        --color-slate-700: #334155 !important;
        --color-slate-800: #1e293b !important;
        --color-slate-900: #0f172a !important;
        
        --color-accent-primary: #00c9a7 !important;
        --color-accent-secondary: #0891b2 !important;
        --color-accent-warning: #f59e0b !important;
        --color-accent-danger: #ef4444 !important;
        --color-bg-primary: #0f2027 !important;
      }
      
      * {
        /* Disable modern features that html2canvas struggles with */
        backdrop-filter: none !important;
        transition: none !important;
        animation: none !important;
        font-family: 'Inter', system-ui, sans-serif !important;
      }
      
      /* Force display properly in the captured clone */
      .report-container {
        width: 1000px !important; /* Fixed width for consistent capture */
        margin: 0 !important;
        padding: 48px !important;
        background-color: #ffffff !important;
        color: #0f172a !important;
        box-shadow: none !important; /* Shadows can look messy in capture */
        border: 1px solid #e2e8f0 !important;
      }

      /* Ensure tables look sharp */
      table { border-collapse: collapse !important; width: 100% !important; }
      th, td { border: 1px solid #f1f5f9 !important; }

      /* Fix transparency issues on some elements */
      .bg-\[\#00c9a7\]\/5 { background-color: rgba(0, 201, 167, 0.05) !important; }
    `;
    clonedDoc.head.appendChild(style);

    // Manually search and replace modern color functions
    const allElements = clonedDoc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as HTMLElement;
      if (el.style) {
        if (el.style.filter && (el.style.filter.includes('oklch') || el.style.filter.includes('oklab'))) {
          el.style.filter = 'none';
        }
        // Force cleanup of computed styles that might still use oklab
        const computed = window.getComputedStyle(el);
        if (computed.backgroundColor.includes('oklab') || computed.backgroundColor.includes('oklch')) {
          el.style.backgroundColor = '#ffffff';
        }
        if (computed.color.includes('oklab') || computed.color.includes('oklch')) {
          el.style.color = '#0f172a';
        }
      }
    }
  };

  const exportPDF = async () => {
    if (!reportRef.current || isExporting) return;
    
    try {
      setIsExporting(true);
      const element = reportRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3, // Very high quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc) => {
          cleanStylesForExport(clonedDoc);
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate fit
      const ratio = pdfWidth / imgWidth;
      const finalWidth = pdfWidth;
      const finalHeight = imgHeight * ratio;
      
      // Handle multi-page if necessary, but for now we fit to width
      // and let it overflow if it's long, or scale to fit one page
      let position = 0;
      if (finalHeight > pdfHeight) {
        // Multi-page approach
        let remainingHeight = finalHeight;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, 'JPEG', 0, position, finalWidth, finalHeight);
          remainingHeight -= pdfHeight;
          position -= pdfHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }
      } else {
        // Center vertically if it fits on one page
        const yOffset = (pdfHeight - finalHeight) / 2;
        pdf.addImage(imgData, 'JPEG', 0, yOffset, finalWidth, finalHeight);
      }
      
      pdf.save(`CMP-Laporan-${data.production.productName || 'Produk'}.pdf`);
      
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Gagal mengekspor PDF. Pastikan browser Anda mendukung fitur ini.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportJPG = async () => {
    if (!reportRef.current || isExporting) return;

    try {
      setIsExporting(true);
      const element = reportRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          cleanStylesForExport(clonedDoc);
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      
      try {
        const response = await fetch(imgData);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }) 
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (copyError) {
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `CMP-Laporan-${data.production.productName || 'Produk'}.jpg`;
        link.click();
      }
    } catch (error) {
      console.error('Failed to export JPG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold">Laporan & Analisis Akhir</h2>
          <p className="text-[#94a3b8] text-sm">Review struktur biaya dan unduh dokumen laporan resmi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 bg-[#475569] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#334155] transition-all border border-[#334155]"
          >
            <Printer className="w-4 h-4" /> Cetak
          </button>
          
          <button 
            onClick={exportPDF} 
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#00c9a7] text-[#0f2027] px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
          
          <button 
            onClick={exportJPG} 
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#0891b2] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Tersimpan!
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Export JPG
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div 
          ref={reportRef} 
          className="report-container bg-white text-[#0f172a] rounded-xl p-8 md:p-12 shadow-2xl space-y-10 min-w-[800px] border border-[#e2e8f0]"
        >
          <header className="flex justify-between items-start border-b-2 border-[#00c9a7] pb-8">
             <div className="space-y-1">
                <h1 className="text-3xl font-black text-[#00c9a7] uppercase tracking-tighter">CostMaster Pro</h1>
                <p className="text-[#64748b] font-bold text-xs">PRODUCTION COST MANAGEMENT SYSTEM</p>
             </div>
             <div className="text-right space-y-1">
                <h2 className="text-xl font-black">LAPORAN ANALISIS HPP</h2>
                <div className="flex flex-col text-xs text-[#64748b] font-bold">
                  <span>ID: #CMP-{Math.floor(100000 + Math.random() * 900000)}</span>
                  <span>TANGGAL: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
             </div>
          </header>

          <section className="space-y-4">
             <h3 className="text-lg font-black border-l-4 border-[#00c9a7] pl-3 bg-[#00c9a7]/5 py-2 uppercase tracking-wide">1. Ringkasan Eksekutif</h3>
             <div className="text-[#334155] leading-relaxed text-sm space-y-4">
                <p>
                  Laporan ini menyajikan analisis mendalam mengenai Harga Pokok Produksi (HPP) untuk produk <span className="font-bold text-[#0f2027] underline decoration-[#00c9a7] decoration-2 underline-offset-2">"{data.production.productName || 'Tanpa Nama'}"</span>. 
                  Analisis ini mencakup seluruh komponen biaya mulai dari bahan baku langsung, tenaga kerja, hingga alokasi biaya operasional bulanan.
                </p>
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#f1f5f9]">
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase mb-1">HPP per Unit</p>
                    <p className="text-xl font-black text-[#0891b2]">{formatRupiah(calculations.hppPerUnitFinal)}</p>
                  </div>
                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#f1f5f9]">
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase mb-1">Volume Produksi</p>
                    <p className="text-xl font-black text-[#0f2027]">{calculations.unitsPerMonth} <span className="text-xs">Unit/Bln</span></p>
                  </div>
                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#f1f5f9]">
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase mb-1">Perkiraan Omzet</p>
                    <p className="text-xl font-black text-[#059669] font-bold">{formatRupiah(calculations.hppPerUnitFinal * 1.5 * calculations.unitsPerMonth)}</p>
                  </div>
                </div>
             </div>
          </section>

          <div className="grid grid-cols-5 gap-10">
             <section className="col-span-3 space-y-4">
                <h3 className="text-lg font-black border-l-4 border-[#00c9a7] pl-3 uppercase tracking-wide">2. Rincian Struktur Biaya</h3>
                <table className="w-full text-xs text-left border-collapse rounded-lg overflow-hidden border border-[#e2e8f0]">
                   <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase">
                      <tr>
                         <th className="p-4">Kategori Biaya</th>
                         <th className="p-4 text-right">Nilai / Unit</th>
                         <th className="p-4 text-right">Kontribusi</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#f1f5f9]">
                      <tr className="hover:bg-[#f8fafc]">
                        <td className="p-4 font-medium italic">Bahan Baku Langsung (Raw Materials)</td>
                        <td className="p-4 text-right font-bold">{formatRupiah(calculations.materialPerUnit)}</td>
                        <td className="p-4 text-right font-bold text-[#00c9a7]">{((calculations.materialPerUnit / calculations.hppPerUnitFinal) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc]">
                        <td className="p-4 font-medium italic">BTKL (Direct Labor)</td>
                        <td className="p-4 text-right font-bold">{formatRupiah(calculations.laborPerUnit)}</td>
                        <td className="p-4 text-right font-bold text-[#00c9a7]">{((calculations.laborPerUnit / calculations.hppPerUnitFinal) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc]">
                        <td className="p-4 font-medium italic">BOP (Overhead)</td>
                        <td className="p-4 text-right font-bold">{formatRupiah(calculations.overheadPerUnit)}</td>
                        <td className="p-4 text-right font-bold text-[#00c9a7]">{((calculations.overheadPerUnit / calculations.hppPerUnitFinal) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc]">
                        <td className="p-4 font-medium italic">Marketing & Admin (Non-Prod)</td>
                        <td className="p-4 text-right font-bold">{formatRupiah(calculations.nonProductionPerUnit)}</td>
                        <td className="p-4 text-right font-bold text-[#00c9a7]">{((calculations.nonProductionPerUnit / calculations.hppPerUnitFinal) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="bg-[#0f172a] text-white font-bold text-sm">
                        <td className="p-4 uppercase">Total Harga Pokok Produksi (HPP)</td>
                        <td className="p-4 text-right underline decoration-[#00c9a7] decoration-4 underline-offset-4">{formatRupiah(calculations.hppPerUnitFinal)}</td>
                        <td className="p-4 text-right">100%</td>
                      </tr>
                   </tbody>
                </table>
             </section>

             <section className="col-span-2 space-y-4">
                <h3 className="text-lg font-black border-l-4 border-[#0891b2] pl-3 uppercase tracking-wide">3. Pricing Strategy</h3>
                <div className="space-y-3">
                   {data.priceLevels.map((l, index) => (
                     <div key={l.id} className="group relative flex justify-between items-center p-4 bg-white rounded-xl border-2 border-[#f1f5f9] hover:border-[#0891b2] transition-all">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0891b2] rounded-full flex items-center justify-center text-[8px] text-white font-bold">{index + 1}</div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-[#94a3b8] tracking-wider mb-0.5">{l.name}</p>
                          <p className="text-[10px] font-bold text-[#64748b]">Min: {l.minOrder} unit</p>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-[#0891b2]">{formatRupiah(calculations.hppPerUnitFinal * (1 + l.markupPercent/100))}</p>
                           <p className="text-[9px] font-bold px-2 py-0.5 bg-[#d1fae5] text-[#047857] rounded-full inline-block">Markup {l.markupPercent}%</p>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          <section className="space-y-4 border-t-2 border-dashed border-[#e2e8f0] pt-10">
             <h3 className="text-lg font-black border-l-4 border-[#ef4444] pl-3 uppercase tracking-wide">4. Analisis & Rekomendasi</h3>
             <div className="bg-[#0f172a] p-8 rounded-2xl border-4 border-[#1e293b] text-[#cbd5e1] text-sm italic leading-loose relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Info className="w-20 h-20" /></div>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-3">
                    <span className="text-[#00c9a7] font-bold">●</span>
                    <span>
                      {calculations.materialPerUnit / calculations.hppPerUnitFinal > 0.6 ? 
                        "Risiko Tinggi: Biaya bahan baku mendominasi (>60%). Sangat disarankan untuk melakukan evaluasi formulasi produk atau mencari sumber alternatif bahan baku untuk menjaga profitabilitas." : 
                        "Struktur Bahan Baku Terkendali: Porsi bahan baku terhadap total HPP berada dalam kategori aman."}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#0891b2] font-bold">●</span>
                    <span>
                      {calculations.laborPerUnit / calculations.hppPerUnitFinal > 0.3 ? 
                        "Inisiasi Otomatisasi: Biaya tenaga kerja cukup signifikan. Pertimbangkan untuk meningkatkan kapasitas produksi tanpa menambah SDM melalui perbaikan alur kerja (workflow)." : 
                        "Efisiensi Tenaga Kerja Baik: Kontribusi upah terhadap beban produksi sudah optimal."}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#f59e0b] font-bold">●</span>
                    <span>Optimasi Penjualan: Fokuskan strategi pemasaran pada level 'Reseller' atau 'Grosir' untuk mempercepat cashflow dan menekan biaya logistik per unit produk.</span>
                  </li>
                </ul>
             </div>
          </section>

          <footer className="flex justify-between items-end border-t border-[#f1f5f9] pt-10">
             <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9] border border-[#e2e8f0]" />
                  <div className="w-24 h-2 bg-[#f1f5f9] rounded" />
                </div>
                <p className="text-[10px] text-[#94a3b8] font-bold italic">TANDA TANGAN / PENGESAHAN</p>
             </div>
             <div className="text-right">
                <p className="text-xs font-bold text-[#0f172a] uppercase tracking-widest">DIHASILKAN OLEH COSTMASTER PRO v2.0</p>
                <p className="text-[9px] text-[#94a3b8]">Keakuratan laporan ini tergantung pada integritas data yang diberikan oleh pengguna.</p>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

