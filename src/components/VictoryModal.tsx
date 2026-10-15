import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, Map, Coins, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { LevelConfig } from '../types';
import { sound } from '../game/sound';

interface VictoryModalProps {
  level: LevelConfig;
  score: number;
  stars: number;
  coinsEarned: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onGoToMap: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  score,
  stars,
  coinsEarned,
  hasNextLevel,
  onNextLevel,
  onGoToMap,
}) => {
  // Number of stars currently popped into view sequentially
  const [revealedStars, setRevealedStars] = useState<number>(0);
  const [showScoreCard, setShowScoreCard] = useState<boolean>(false);

  useEffect(() => {
    sound.playVictory();

    // Initial fanfare confetti blast
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#ec4899', '#a855f7', '#10b981'],
      });
    } catch {
      // safe fallback
    }

    // Sequential Star Reveals with ascending audio chimes
    const t1 = setTimeout(() => {
      setRevealedStars(1);
      sound.playMatch(1);
    }, 350);

    let t2: number | undefined;
    if (stars >= 2) {
      t2 = window.setTimeout(() => {
        setRevealedStars(2);
        sound.playMatch(3);
      }, 800);
    }

    let t3: number | undefined;
    if (stars >= 3) {
      t3 = window.setTimeout(() => {
        setRevealedStars(3);
        sound.playMatch(5);
        // Second celebratory burst for 3 full stars
        try {
          confetti({
            particleCount: 90,
            spread: 90,
            origin: { y: 0.45 },
            colors: ['#fbbf24', '#f59e0b', '#ffffff', '#e11d48'],
          });
        } catch {
          // safe
        }
      }, 1250);
    }

    // Reveal score card and action buttons
    const tScore = setTimeout(() => {
      setShowScoreCard(true);
    }, stars >= 3 ? 1500 : stars === 2 ? 1100 : 700);

    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
      if (t3) clearTimeout(t3);
      clearTimeout(tScore);
    };
  }, [stars]);

  const getRankPraise = () => {
    if (stars === 3) return { text: 'LEGENDARY CLAN MASTER!', color: 'text-amber-300' };
    if (stars === 2) return { text: 'GREAT CONQUEST!', color: 'text-purple-200' };
    return { text: 'STAGE COMPLETED!', color: 'text-rose-200' };
  };

  const praise = getRankPraise();

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none animate-gem-spawn">
      <div className="bg-gradient-to-b from-[#2e0e4b] via-[#1f0934] to-[#140424] border-2 border-amber-400/60 rounded-3xl w-full max-w-sm p-5 shadow-[0_0_35px_rgba(245,158,11,0.35)] text-center relative overflow-hidden">
        {/* Subtle background ambient rays */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Crown & Trophy Header */}
        <div className="relative mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-[0_0_20px_#f59e0b] ring-2 ring-white/30 animate-float">
            <Trophy className="w-8 h-8 text-purple-950" />
          </div>
        </div>

        <h2 className="text-xl font-black text-amber-300 tracking-wider uppercase mb-0.5 drop-shadow-md">
          {praise.text}
        </h2>
        <p className="text-xs text-purple-200 mb-4 font-semibold">
          Stage {level.id}: {level.title}
        </p>

        {/* Rewarding 3-Star Animated Display */}
        <div className="flex items-center justify-center gap-3 mb-4 min-h-[72px]">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stars;
            const isRevealed = starIndex <= revealedStars;
            // Center star (star 2) sits slightly higher for dynamic trophy curve
            const isCenterStar = starIndex === 2;

            return (
              <div
                key={starIndex}
                className={`relative flex items-center justify-center transition-all ${
                  isCenterStar ? '-translate-y-2' : 'translate-y-0'
                }`}
              >
                {/* Empty star slot background */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                    isRevealed && isEarned
                      ? 'bg-amber-400/20 border-amber-400 shadow-[0_0_18px_#f59e0b]'
                      : 'bg-zinc-950/70 border-zinc-800 opacity-30'
                  }`}
                >
                  {/* Glowing halo behind revealed star */}
                  {isRevealed && isEarned && (
                    <div className="absolute inset-0 bg-amber-400/30 rounded-2xl blur-md animate-ping opacity-40 pointer-events-none" />
                  )}

                  {isRevealed && isEarned ? (
                    <div className="relative flex items-center justify-center animate-star-impact animate-star-shine">
                      <Star className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_#fbbf24]" />
                      <Sparkles className="w-3.5 h-3.5 text-white absolute -top-1 -right-1 animate-ping" />
                    </div>
                  ) : (
                    <Star className="w-7 h-7 text-zinc-600" />
                  )}
                </div>

                {/* Star number badge */}
                <span className="absolute -bottom-2 text-[9px] font-mono font-bold text-zinc-400">
                  {starIndex}⭐
                </span>
              </div>
            );
          })}
        </div>

        {/* Score & Reward Card (fades in rewarding breakdown) */}
        <div
          className={`transition-all duration-500 transform ${
            showScoreCard
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="bg-[#120521]/90 border border-purple-500/30 rounded-2xl p-3 mb-3.5 space-y-2 shadow-inner">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Final Score:
              </span>
              <span className="font-mono font-black text-base text-amber-300">
                {score.toLocaleString()} pts
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-1.5 border-t border-purple-500/20">
              <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Clan Spoils:
              </span>
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1 text-sm">
                +{coinsEarned} <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {hasNextLevel ? (
              <button
                onClick={() => {
                  sound.playClick();
                  onNextLevel();
                }}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-purple-950 font-black text-sm py-2.5 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span>Continue to Next Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-bold text-amber-300 bg-amber-500/20 p-2 rounded-xl border border-amber-500/40">
                🎉 All 20 Stages Mastered! You are the Sovereign of Clans!
              </div>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onGoToMap();
              }}
              className="w-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 font-bold text-xs py-2 rounded-xl border border-purple-500/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Quest Map</span>
            </button>
          </div>

          {/* Open Source Footer credit */}
          <a
            href={localStorage.getItem('mejba_github_repo') || 'https://github.com/mejbaul01/mejbaul-clan-version-1.5.5.2'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 pt-2 border-t border-purple-500/20 flex items-center justify-center gap-1.5 text-[10px] text-purple-300/80 hover:text-amber-300 transition-colors"
          >
            <GithubIcon className="w-3 h-3 text-amber-400" />
            <span>Open Source on GitHub (MIT License)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
