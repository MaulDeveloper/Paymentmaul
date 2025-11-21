import React, { useState } from 'react';
import { PaymentMethod } from '../types';
import { DANA_DETAILS, QRIS_IMAGE_URL } from '../constants';
import { Copy, Check, ArrowRight, Smartphone, Fingerprint, ShieldCheck, Download, Loader2 } from 'lucide-react';

interface Props {
  method: PaymentMethod;
  onConfirm: () => void;
}

export const PaymentDetails: React.FC<Props> = ({ method, onConfirm }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DANA_DETAILS.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      // Attempt to fetch the image as a blob to force download
      const response = await fetch(QRIS_IMAGE_URL, {
        method: 'GET',
        mode: 'cors', 
        cache: 'no-cache'
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'QRIS-Payment.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Direct download failed, using fallback", error);
      // Fallback: Open in new tab so user can long-press/save manually
      window.open(QRIS_IMAGE_URL, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mb-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">PROTECTION</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
            Selesaikan Pembayaran
        </h2>
        <p className="text-slate-400 text-sm mt-1">Transfer Dengan Nominal yang Ditentukan.</p>
      </div>

      {method === PaymentMethod.DANA ? (
        <div className="relative group perspective-1000">
          {/* Virtual Card UI - Premium Dark */}
          <div className="relative bg-slate-900 rounded-2xl p-6 text-white shadow-2xl border border-slate-700 overflow-hidden transform transition-transform hover:scale-[1.02]">
            {/* Glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-sky-500/10 to-transparent opacity-50 pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" className="h-6 brightness-200 grayscale" alt="DANA" />
                    </div>
                    <Smartphone className="text-slate-500" />
                </div>

                <div className="space-y-2 mb-8">
                    <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">NUMBER ACCOUNT</p>
                    <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 backdrop-blur-sm">
                        <p className="text-xl font-mono font-bold tracking-widest text-sky-400 shadow-sm">{DANA_DETAILS.number}</p>
                        <button 
                            onClick={handleCopy}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-white"
                            title="Salin"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-0.5">NAME ACCOUNT</p>
                        <p className="font-medium text-slate-200">{DANA_DETAILS.name}</p>
                    </div>
                    <Fingerprint className="text-slate-600/50" size={48} />
                </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500"></div>
          
          {/* QR Container */}
          <div className="relative p-2 rounded-xl border-2 border-slate-900 mb-2">
             <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-black"></div>
             <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-black"></div>
             <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-black"></div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-black"></div>
             
             <img 
                src={QRIS_IMAGE_URL}
                alt="QRIS Code" 
                crossOrigin="anonymous"
                className="w-full max-w-[220px] object-contain rounded-lg"
            />
          </div>

          {/* Download Button */}
          <button 
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 text-[10px] font-bold uppercase tracking-wider transition-colors mb-4 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
                <Loader2 size={12} className="animate-spin" />
            ) : (
                <Download size={12} className="group-hover:scale-110 transition-transform" />
            )}
            <span>{isDownloading ? 'Downloading...' : 'Download QRIS'}</span>
          </button>

          <div className="flex gap-3 opacity-60 grayscale">
             <div className="h-4 font-bold text-[10px] text-slate-900">Gopay</div>
             <div className="h-4 font-bold text-[10px] text-slate-900">OVO</div>
             <div className="h-4 font-bold text-[10px] text-slate-900">DANA</div>
             <div className="h-4 font-bold text-[10px] text-slate-900">BRI</div>
             <div className="h-4 font-bold text-[10px] text-slate-900">BCA</div>
             <div className="h-4 font-bold text-[10px] text-slate-900">ShopeePay</div>
             <div className="h-4 font-bold text-[10px] text-slate-900">LinkAja</div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={onConfirm}
          className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 px-4 rounded-xl shadow-lg transition-all hover:shadow-white/20 active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            <span>Konfirmasi Pembayaran</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};