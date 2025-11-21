import React from 'react';
import { PaymentMethod } from '../types';
import { QrCode, Wallet, ChevronRight } from 'lucide-react';

interface Props {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Payment Method
        </label>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {/* DANA Button */}
        <button
          onClick={() => onSelect(PaymentMethod.DANA)}
          className={`group relative flex items-center p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden ${
            selected === PaymentMethod.DANA
              ? 'bg-sky-900/20 border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.15)]'
              : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className={`p-3 rounded-lg mr-4 transition-colors ${selected === PaymentMethod.DANA ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-sky-500/20 group-hover:text-sky-400'}`}>
            <Wallet size={24} />
          </div>
          <div className="flex-1 z-10">
            <div className={`font-bold transition-colors ${selected === PaymentMethod.DANA ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>DANA</div>
            <div className="text-xs text-slate-500 group-hover:text-slate-400">Direct Transfer</div>
          </div>
          <div className={`text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sky-400`}>
            <ChevronRight size={20} />
          </div>
        </button>

        {/* QRIS Button */}
        <button
          onClick={() => onSelect(PaymentMethod.QRIS)}
          className={`group relative flex items-center p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden ${
            selected === PaymentMethod.QRIS
              ? 'bg-fuchsia-900/20 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.15)]'
              : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
           <div className={`p-3 rounded-lg mr-4 transition-colors ${selected === PaymentMethod.QRIS ? 'bg-fuchsia-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-fuchsia-500/20 group-hover:text-fuchsia-400'}`}>
            <QrCode size={24} />
          </div>
          <div className="flex-1 z-10">
            <div className={`font-bold transition-colors ${selected === PaymentMethod.QRIS ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>QRIS</div>
            <div className="text-xs text-slate-500 group-hover:text-slate-400">Scan All E-Wallets</div>
          </div>
          <div className="absolute top-3 right-3">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};