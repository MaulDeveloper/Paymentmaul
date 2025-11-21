import React, { useState, useRef } from 'react';
import { PaymentMethod } from '../types';
import { sendProofToTelegram } from '../services/telegramService';
import { UploadCloud, FileText, X, Send, Loader2, FileCheck, DollarSign, Package } from 'lucide-react';

interface Props {
  method: PaymentMethod;
  onSuccess: () => void;
}

export const UploadForm: React.FC<Props> = ({ method, onSuccess }) => {
  const [note, setNote] = useState('');
  const [productName, setProductName] = useState('');
  const [nominal, setNominal] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  // Simple number formatter for input display could be added here, 
  // but for now we keep it as raw text to allow flexibility.
  
  const handleSubmit = async () => {
    if (!file) {
      setError("Bukti pembayaran wajib diupload.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await sendProofToTelegram(file, note, productName, nominal, method);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal mengirim data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 animate-fade-in-up">
      <h3 className="text-lg font-bold text-white mb-6 text-center">Konfirmasi Transfer</h3>
      
      <div className="space-y-5">

        {/* Product Name Input */}
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Nama Produk
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Package size={18} />
                </div>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Contoh: Script Bug Whatsapp"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-200 placeholder:text-slate-600 font-medium"
                />
            </div>
        </div>
        
        {/* Nominal Input */}
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Nominal Transfer (Rp)
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <span className="font-mono font-bold">Rp</span>
                </div>
                <input
                    type="number"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    placeholder="0"
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-emerald-400 placeholder:text-slate-700 font-mono font-bold text-lg"
                />
            </div>
        </div>

        {/* Note Input */}
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Nama Pengirim
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <FileText size={18} />
                </div>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: Maul Ganteng"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-200 placeholder:text-slate-600 font-medium"
                />
            </div>
        </div>

        {/* File Upload Area */}
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Bukti Transfer
            </label>
            
            {!file ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative overflow-hidden border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-800/30 hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all group"
                >
                    <div className="bg-slate-800 p-4 rounded-full shadow-lg mb-3 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-400 ring-1 ring-white/5">
                        <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Click untuk upload bukti</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">JPG, PNG, PDF</p>
                </div>
            ) : (
                <div className="relative flex items-center p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl shadow-sm">
                    <div className="bg-indigo-500/20 p-2.5 rounded-lg mr-3 text-indigo-400">
                        <FileCheck size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-indigo-100 truncate">{file.name}</p>
                        <p className="text-xs text-indigo-300/70 font-mono">READY • {(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button 
                        onClick={() => setFile(null)}
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-red-400 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
            />
            {error && <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1 animate-pulse">⚠️ {error}</p>}
        </div>

        <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-4 rounded-xl transition-all shadow-lg mt-4 ${
                isSubmitting 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]'
            }`}
        >
            {isSubmitting ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Mengirim...</span>
                </>
            ) : (
                <>
                    <span>Kirim Bukti</span>
                    <Send size={20} />
                </>
            )}
        </button>
      </div>
    </div>
  );
};