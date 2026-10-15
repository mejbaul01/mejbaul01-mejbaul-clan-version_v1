import React from 'react';
import { ArrowLeft, Lock, Star, Play, Trophy, Sparkles } from 'lucide-react';
import { LevelConfig, PlayerProfile } from '../types';
import { LEVELS } from '../game/levels';
import { sound } from '../game/sound';

interface LevelMapProps {
  profile: PlayerProfile;
  onSelectLevel: (levelId: number) => void;
  onBackToMenu: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  profile,
  onSelectLevel,
  onBackToMenu,
}) => {
  return (
    <div className="w-full flex-1 flex flex-col max-w-md mx-auto px-3 py-2 pb-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 bg-[#1c0a30]/80 p-2.5 rounded-2xl border border-purple-500/20 backdrop-blur-md">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-200 bg-purple-900/40 hover:bg-purple-800/60 px-3 py-1.5 rounded-xl border border-purple-500/30 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Menu
        </button>

        <div className="text-center">
          <h2 className="text-sm font-black text-amber-300 tracking-wide flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            Clan Quest Map
          </h2>
          <p className="text-[10px] text-purple-300">20 Fantasy Match-3 Stages</p>
        </div>

        <div className="w-16" /> {/* Balance spacer */}
      </div>

      {/* Scrollable Stage Nodes */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {LEVELS.map((level) => {
          const progress = profile.levels[level.id] || { stars: 0, highScore: 0, unlocked: level.id === 1 };
          const isUnlocked = progress.unlocked || level.id === 1;
          const isCurrent = level.id === profile.currentLevel;

          return (
            <div
              key={level.id}
              onClick={() => {
                if (isUnlocked) {
                  sound.playClick();
                  onSelectLevel(level.id);
                } else {
                  sound.playInvalid();
                }
              }}
              className={`relative rounded-2xl p-3 border transition-all ${
                isUnlocked
                  ? 'cursor-pointer hover:scale-[1.02] active:scale-95'
                  : 'cursor-not-allowed opacity-60'
              } ${
                isCurrent
                  ? 'bg-gradient-to-r from-purple-900/90 via-rose-950/80 to-purple-900/90 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                  : isUnlocked
                  ? 'bg-[#1e0a35]/80 hover:bg-[#280e46]/90 border-purple-500/30 shadow-md'
                  : 'bg-zinc-950/60 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Node Number Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shadow-inner ${
                      !isUnlocked
                        ? 'bg-zinc-800 text-zinc-500'
                        : isCurrent
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-purple-950 shadow-[0_0_10px_#f59e0b]'
                        : 'bg-gradient-to-br from-purple-700 to-purple-900 text-purple-100 border border-purple-400/30'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-5 h-5 text-zinc-500" /> : level.id}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-purple-100">{level.title}</h3>
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold bg-amber-400 text-purple-950 px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-purple-300 line-clamp-1 opacity-80">
                      Target: {level.targetScore.toLocaleString()} pts • {level.moves} moves
                    </p>
                  </div>
                </div>

                {/* Right: Stars & Action */}
                <div className="flex flex-col items-end gap-1">
                  {isUnlocked ? (
                    <>
                      {/* Star ratings */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            className={`w-3.5 h-3.5 ${
                              starNum <= progress.stars
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_#f59e0b]'
                                : 'text-zinc-600'
                            }`}
                          />
                        ))}
                      </div>

                      {progress.highScore > 0 ? (
                        <span className="text-[10px] font-mono text-amber-300/90 font-bold">
                          Best: {progress.highScore.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-purple-300 flex items-center gap-1">
                          <Play className="w-3 h-3 text-amber-400 fill-amber-400" /> Play
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-zinc-500 text-xs font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
