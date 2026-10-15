import React from 'react';
import {
  Play,
  Map,
  Gift,
  Store,
  KeyRound,
  Trophy,
  Settings as SettingsIcon,
  Crown,
  Star,
} from 'lucide-react';
import { PlayerProfile } from '../types';
import { sound } from '../game/sound';

interface MenuViewProps {
  profile: PlayerProfile;
  onPlayCurrentLevel: () => void;
  onOpenMap: () => void;
  onOpenDaily: () => void;
  onOpenShop: (tab?: 'boosters' | 'vault' | 'themes') => void;
  onOpenPromo: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenOpenSource: () => void;
  onOpenDownload: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  profile,
  onPlayCurrentLevel,
  onOpenMap,
  onOpenDaily,
  onOpenShop,
  onOpenPromo,
  onOpenLeaderboard,
  onOpenSettings,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isDailyRewardReady = profile.dailyReward.lastClaimDate !== todayStr;

  const totalStars = Object.values(profile.levels).reduce(
    (sum, lvl) => sum + (lvl.stars || 0),
    0
  );

  return (
    <div className="w-full flex-1 flex flex-col justify-between py-2 px-3 max-w-md mx-auto select-none overflow-y-auto space-y-3">
      {/* Hero Banner: Current Clan Warrior */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-[#270b42] to-rose-950 border border-purple-500/30 p-4 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1b082e] border-2 border-amber-400 p-1 flex items-center justify-center shadow-lg">
              <img src="/icon.svg" alt="Clan crest" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-sm text-white">{profile.name}</span>
              </div>
              <span className="text-[11px] font-semibold text-purple-300">
                Current Quest: Stage {profile.currentLevel} of 20
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-xl">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-300">{totalStars} ⭐</span>
          </div>
        </div>

        {/* Big Play CTA Button */}
        <button
          onClick={() => {
            sound.playVictory();
            onPlayCurrentLevel();
          }}
          className="w-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-black text-base py-3 px-4 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 border border-amber-300 active:scale-95 transition-transform"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Play Stage {profile.currentLevel}</span>
        </button>
      </div>

      {/* Grid of Main Navigation Hubs */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Level Map */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenMap();
          }}
          className="p-3 rounded-2xl bg-[#1b0a2e]/90 hover:bg-[#250d3f] border border-purple-500/30 flex items-center gap-3 text-left transition-all active:scale-95 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-purple-100">Quest Map</div>
            <div className="text-[10px] text-purple-300 opacity-80">20 Stages</div>
          </div>
        </button>

        {/* Daily Tribute */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenDaily();
          }}
          className="p-3 rounded-2xl bg-[#1b0a2e]/90 hover:bg-[#250d3f] border border-purple-500/30 flex items-center gap-3 text-left transition-all active:scale-95 shadow-md relative"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-purple-100 flex items-center gap-1">
              <span>Daily Tribute</span>
              {isDailyRewardReady && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <div className="text-[10px] text-amber-300 font-bold">
              {isDailyRewardReady ? 'Gift Ready!' : 'Day ' + profile.dailyReward.currentDay}
            </div>
          </div>
        </button>

        {/* Clan Bazaar & Vault */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenShop('boosters');
          }}
          className="p-3 rounded-2xl bg-[#1b0a2e]/90 hover:bg-[#250d3f] border border-purple-500/30 flex items-center gap-3 text-left transition-all active:scale-95 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-purple-100">Bazaar & Vault</div>
            <div className="text-[10px] text-purple-300 opacity-80">Boosters & 5% Int.</div>
          </div>
        </button>

        {/* 10 Secret Promo Codes */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenPromo();
          }}
          className="p-3 rounded-2xl bg-[#1b0a2e]/90 hover:bg-[#250d3f] border border-purple-500/30 flex items-center gap-3 text-left transition-all active:scale-95 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-purple-100">Promo Codes</div>
            <div className="text-[10px] text-purple-300 opacity-80">13 Secret Gifts</div>
          </div>
        </button>

        {/* Hall of Fame */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLeaderboard();
          }}
          className="p-3 rounded-2xl bg-[#1b0a2e]/90 hover:bg-[#250d3f] border border-purple-500/30 flex items-center gap-3 text-left transition-all active:scale-95 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-900/40 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-purple-100">Hall of Fame</div>
            <div className="text-[10px] text-purple-300 opacity-80">Clan Rankings</div>
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="p-3 rounded-2xl bg-[#1b0a2e]/90 hover:bg-[#250d3f] border border-purple-500/30 flex items-center gap-3 text-left transition-all active:scale-95 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-900/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-purple-100">Settings</div>
            <div className="text-[10px] text-purple-300 opacity-80">Audio & Policy</div>
          </div>
        </button>
      </div>
    </div>
  );
};
