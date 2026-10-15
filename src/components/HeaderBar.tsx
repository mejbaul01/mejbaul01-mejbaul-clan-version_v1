import React, { useState, useEffect } from 'react';
import { Heart, Coins, Star, Settings as SettingsIcon, Store, Shield } from 'lucide-react';
import { PlayerProfile } from '../types';
import { HEART_RECOVERY_TIME_MS } from '../game/storage';
import { sound } from '../game/sound';

interface HeaderBarProps {
  profile: PlayerProfile;
  onOpenSettings: () => void;
  onOpenShop: (initialTab?: 'boosters' | 'vault' | 'themes') => void;
  onGoHome?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  profile,
  onOpenSettings,
  onOpenShop,
  onGoHome,
}) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  // Calculate live countdown to next heart recovery
  useEffect(() => {
    const updateCountdown = () => {
      if (profile.hearts >= 5 || !profile.lastHeartLostTime) {
        setTimeLeftStr('');
        return;
      }
      const now = Date.now();
      const elapsed = now - profile.lastHeartLostTime;
      const remainingMs = Math.max(0, HEART_RECOVERY_TIME_MS - (elapsed % HEART_RECOVERY_TIME_MS));

      const totalSec = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSec / 60);
      const seconds = totalSec % 60;
      setTimeLeftStr(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [profile.hearts, profile.lastHeartLostTime]);

  const totalStars = Object.values(profile.levels).reduce((sum, lvl) => sum + (lvl.stars || 0), 0);

  return (
    <header className="w-full bg-[#180a29]/90 backdrop-blur-md border-b border-purple-500/20 px-3 py-2 sticky top-0 z-40 select-none shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* App Title / Home */}
        <button
          onClick={() => {
            sound.playClick();
            if (onGoHome) onGoHome();
          }}
          className="flex items-center gap-2 group transition-transform active:scale-95 cursor-pointer hover:opacity-90"
          title="Return to First Page (Splash / Intro)"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-[#180a29] rounded-[7px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-left leading-none">
            <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent block">
              Mejbaul Clan
            </span>
            <span className="text-[10px] text-purple-300 font-semibold tracking-wider uppercase opacity-80">
              Rest of Clans
            </span>
          </div>
        </button>

        {/* Stats & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hearts & Recovery Timer */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop('boosters');
            }}
            className="flex items-center gap-1 bg-rose-950/40 border border-rose-500/30 px-2 py-1 rounded-full hover:bg-rose-900/40 transition-colors"
            title={profile.hearts < 5 ? `Next heart in ${timeLeftStr}` : 'Full Hearts!'}
          >
            <Heart className={`w-3.5 h-3.5 ${profile.hearts > 0 ? 'text-rose-500 fill-rose-500' : 'text-zinc-500'}`} />
            <span className="text-xs font-bold text-rose-200">{profile.hearts}/5</span>
            {timeLeftStr && profile.hearts < 5 && (
              <span className="text-[10px] font-mono text-rose-400 ml-0.5 hidden xs:inline">
                {timeLeftStr}
              </span>
            )}
          </button>

          {/* Gold Coins */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop('vault');
            }}
            className="flex items-center gap-1 bg-amber-950/40 border border-amber-500/30 px-2 py-1 rounded-full hover:bg-amber-900/40 transition-colors"
            title="Gold Coins & Clan Vault"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">{profile.coins}</span>
          </button>

          {/* Stars */}
          <div className="flex items-center gap-1 bg-purple-950/40 border border-purple-500/30 px-2 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-yellow-200">{totalStars}</span>
          </div>

          {/* Clan Shop Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop('boosters');
            }}
            className="p-1.5 rounded-full bg-purple-800/40 hover:bg-purple-700/60 text-purple-200 border border-purple-400/20 active:scale-95 transition-transform"
            title="Clan Shop"
          >
            <Store className="w-4 h-4 text-purple-300" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-1.5 rounded-full bg-purple-800/40 hover:bg-purple-700/60 text-purple-200 border border-purple-400/20 active:scale-95 transition-transform"
            title="Settings & Privacy"
          >
            <SettingsIcon className="w-4 h-4 text-purple-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
