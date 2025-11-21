import React, { useState, useRef, useEffect } from 'react';
import { PaymentMethod } from './types';
import { DeveloperProfile } from './components/ProductSummary';
import { PaymentSelector } from './components/PaymentSelector';
import { PaymentDetails } from './components/PaymentDetails';
import { UploadForm } from './components/UploadForm';
import { CheckCircle2, ArrowLeft, Zap, Volume2, VolumeX, Music } from 'lucide-react';

const App: React.FC = () => {
  // Steps: 
  // 0 = Profile & Method Selection
  // 1 = Details
  // 2 = Upload
  // 3 = Success
  const [step, setStep] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep(1);
  };

  const handlePaymentConfirmed = () => {
    setStep(2);
  };

  const handleUploadSuccess = () => {
    setStep(3);
  };

  const resetFlow = () => {
    setStep(0);
    setSelectedMethod(null);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Handle Audio Autoplay Strategy
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4; // Set initial volume

    const attemptPlay = () => {
      // Try to play
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // Remove listeners immediately once successfully played to avoid re-triggering
            ['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => 
              document.removeEventListener(evt, attemptPlay)
            );
          })
          .catch((error) => {
            console.log("Autoplay prevented by browser. Waiting for interaction.");
            setIsPlaying(false);
          });
      }
    };

    // 1. Try immediate play (works if browser allowed or persisted permission)
    attemptPlay();

    // 2. Add fallback listeners for ANY user interaction (click, touch, scroll, key)
    // This ensures music starts on the very first interaction if autoplay was blocked.
    ['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => 
      document.addEventListener(evt, attemptPlay)
    );

    return () => {
      ['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => 
        document.removeEventListener(evt, attemptPlay)
      );
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-10 px-4 bg-grid-pattern">
      
      {/* Background Audio with autoPlay & preload */}
      <audio ref={audioRef} loop autoPlay preload="auto" src="https://files.catbox.moe/0ft3c3.mp3" />

      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      {/* Music Control Button */}
      <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
        <button 
            onClick={toggleMusic}
            className={`flex items-center justify-center w-10 h-10 rounded-full border backdrop-blur-md transition-all duration-500 shadow-lg ${
                isPlaying 
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-400 animate-[pulse_3s_infinite]' 
                : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:bg-slate-800'
            }`}
        >
            {isPlaying ? (
                <div className="relative">
                    <Volume2 size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
                </div>
            ) : (
                <VolumeX size={18} />
            )}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="flex justify-center mb-8">
           <div className="bg-slate-900/80 border border-white/10 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
              <Zap size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold tracking-[0.2em] text-slate-300">PAY.ME</span>
           </div>
        </div>

        {/* Main Glass Panel */}
        <div className="glass-panel rounded-3xl overflow-hidden relative">
            {/* Progress Bar */}
            {step > 0 && step < 3 && (
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500"
                        style={{ width: `${(step / 2) * 100}%` }}
                    ></div>
                </div>
            )}

            <div className="p-6 sm:p-8 min-h-[500px] flex flex-col">
                
                {/* Navigation (Back Button) */}
                {step > 0 && step < 3 && (
                    <button 
                        onClick={goBack}
                        className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors z-20"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                {/* Step 3: Success State */}
                {step === 3 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up py-8">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20"></div>
                            <CheckCircle2 size={80} className="text-emerald-400 relative z-10" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Pembayaran Terkirim</h2>
                        <p className="text-slate-400 mb-8 font-mono text-sm">
                            Terimaksih Sudah Bertransaksi !<br/>Bukti Pembayaran Telah Terkirim.
                        </p>
                        <button 
                            onClick={resetFlow}
                            className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm tracking-wider uppercase hover:bg-slate-700 transition-colors"
                        >
                            KIRIM BUKTI TRANSAKSI LAGI
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Step 0: Profile & Method Selection */}
                        {step === 0 && (
                            <div className="animate-fade-in-up">
                                <DeveloperProfile />
                                <div className="mt-8">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center mb-4">
                                        Pilih Metode Pembayaran
                                    </h3>
                                    <PaymentSelector 
                                        selected={selectedMethod} 
                                        onSelect={handleMethodSelect} 
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 1: Payment Details */}
                        {step === 1 && selectedMethod && (
                            <div className="animate-fade-in-up mt-8">
                                <DeveloperProfile compact />
                                <PaymentDetails 
                                    method={selectedMethod}
                                    onConfirm={handlePaymentConfirmed} 
                                />
                            </div>
                        )}

                        {/* Step 2: Upload Proof */}
                        {step === 2 && selectedMethod && (
                            <div className="animate-fade-in-up mt-8">
                                <DeveloperProfile compact />
                                <UploadForm 
                                    method={selectedMethod} 
                                    onSuccess={handleUploadSuccess} 
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
                Secure Encrypted Transaction
            </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;