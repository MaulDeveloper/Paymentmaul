import React from 'react';
import { DEV_PROFILE } from '../constants';
import { Code2, Terminal, Cpu } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DeveloperProfile: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-slate-800/50 border border-slate-700 rounded-xl mb-6 backdrop-blur-sm">
        <img 
          src={DEV_PROFILE.avatar} 
          alt={DEV_PROFILE.name} 
          className="w-12 h-12 rounded-full border-2 border-indigo-500/50"
        />
        <div>
          <h3 className="font-bold text-slate-100">{DEV_PROFILE.name}</h3>
          <p className="text-xs text-indigo-400 font-mono">{DEV_PROFILE.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-8 animate-fade-in-up relative">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
        <img 
          src={DEV_PROFILE.avatar} 
          alt={DEV_PROFILE.name} 
          className="w-28 h-28 rounded-full border-4 border-slate-800 shadow-2xl relative z-10 object-cover mx-auto"
        />
        <div className="absolute bottom-1 right-1 z-20 bg-emerald-500 w-5 h-5 rounded-full border-4 border-slate-900" title="Available for work"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mt-4">{DEV_PROFILE.name}</h2>
      <div className="flex items-center justify-center gap-2 mt-1 text-indigo-400 font-mono text-sm">
        <Terminal size={14} />
        <span>{DEV_PROFILE.role}</span>
      </div>

      <p className="text-slate-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
        {DEV_PROFILE.bio}
      </p>

      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {DEV_PROFILE.skills.map((skill) => (
          <span key={skill} className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
            <Cpu size={10} /> {skill}
          </span>
        ))}
      </div>
    </div>
  );
};