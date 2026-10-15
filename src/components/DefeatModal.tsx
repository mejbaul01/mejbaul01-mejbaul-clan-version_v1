import React, { useEffect } from 'react';
import { Heart, RotateCcw, Map, Store, AlertOctagon, Timer, Flame } from 'lucide-react';
import { LevelConfig, PlayerProfile } from '../types';
import { sound } from '../game/sound';

interface DefeatModalProps {
  level: LevelConfig;
  reason: 'moves' | 'time';
  profile: PlayerProfile;
  onRetry: () => void;
  onGoToMap: () => void;
  onOpenShop: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({
  level,
  reason,
  profile,
  onRetry,
  onGoToMap,
  onOpenShop,
}) => {
  useEffect(() => {
    sound.playDefeat();
  }, []);

  const hasHearts = profile.hearts > 0;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none animate-gem-spawn">
      <div className="bg-gradient-to-b from-[#2e0b1f] via-[#1f0714] to-[#12030b] border-2 border-rose-500/50 rounded-3xl w-full max-w-sm p-5 shadow-[0_0_30px_rgba(244,63,94,0.3)] text-center relative">
        {/* Defeat Icon */}
        <div className="w-13 h-13 rounded-2xl bg-rose-900/60 border border-rose-500/40 flex items-center justify-center mx-auto mb-2 text-rose-400">
          {reason === 'time' ? (
            <Timer className="w-7 h-7" />
          ) : (
            <AlertOctagon className="w-7 h-7" />
          )}
        </div>

        <h2 className="text-xl font-black text-rose-400 tracking-wider uppercase mb-1">
          {reason === 'time' ? "Time's Up!" : 'Out of Moves!'}
        </h2>
        <p className="text-xs text-rose-200/90 mb-3">
          Failed to conquer Stage {level.id}. -1 Heart lost!
        </p>

        {/* Lives remaining display */}
        <div className="bg-[#18040d] border border-rose-500/30 rounded-2xl p-3 mb-4">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            {[1, 2, 3, 4, 5].map((hIndex) => (
              <Heart
                key={hIndex}
                className={`w-5 h-5 ${
                  hIndex <= profile.hearts
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-zinc-700'
                }`}
              />
            ))}
          </div>

          <div className="text-xs font-bold text-rose-200">
            {profile.hearts} / 5 Hearts Remaining
          </div>
          {profile.hearts < 5 && (
            <div className="text-[10px] text-rose-400 mt-1">
              ❤️ Hearts recover 1 per 59 minutes, or refill in the Clan Shop.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {hasHearts ? (
            <button
              onClick={() => {
                sound.playClick();
                onRetry();
              }}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again (1 ❤️)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenShop();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 font-black text-sm py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Store className="w-4 h-4" />
              <span>Refill Lives in Shop</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="w-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 font-bold text-xs py-2 rounded-xl border border-purple-500/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Return to Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
