import React from 'react';
import { Play, Sparkles, Shield, Crown } from 'lucide-react';
import { sound } from '../game/sound';

interface SplashViewProps {
  onEnter: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onEnter }) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between py-8 px-4 max-w-md mx-auto text-center select-none relative">
      <div className="w-full flex justify-end">
        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
          v1.5.2.2 • PWA & APK Ready
        </span>
      </div>

      {/* Main Logo & Emblem */}
      <div className="flex flex-col items-center my-auto">
        <div className="relative mb-5 group cursor-pointer" onClick={() => { sound.playClick(); onEnter(); }}>
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-3 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-3xl blur-xl opacity-60 animate-pulse" />

          {/* Icon Container */}
          <div className="relative w-28 h-28 rounded-3xl bg-[#1d0735] border-2 border-amber-400 p-2 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            <img src="/icon.svg" alt="Mejba Clan Logo" className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
          </div>

          <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full p-1.5 shadow-lg border border-white">
            <Crown className="w-4 h-4 text-purple-950" />
          </div>
        </div>

        {/* Titles */}
        <h1 className="text-3xl font-black tracking-tight text-white mb-1 drop-shadow-md">
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
            Mejba Clan
          </span>
        </h1>
        <div className="text-xs font-black tracking-widest text-purple-300 uppercase opacity-90 mb-2">
          Rest of Clans
        </div>
        <p className="text-xs text-purple-200/80 max-w-[280px] leading-relaxed">
          Match dazzling jewels, forge magical boosters, and conquer 20 mythical fantasy puzzle stages!
        </p>
      </div>

      {/* Enter Action */}
      <div className="w-full space-y-3">
        <button
          onClick={() => {
            sound.playVictory();
            onEnter();
          }}
          className="w-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-150 border-2 border-amber-300 animate-dance cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Play Now</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-purple-300/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Offline Capable • No Ads • Family Friendly</span>
        </div>
      </div>
    </div>
  );
};
