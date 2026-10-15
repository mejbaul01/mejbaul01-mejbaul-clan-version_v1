import React from 'react';
import { X, Gift, Check, Sparkles, Coins, Hammer, Wand2, Disc, Shuffle } from 'lucide-react';
import { PlayerProfile } from '../types';
import { sound } from '../game/sound';

interface DailyRewardModalProps {
  profile: PlayerProfile;
  onClaim: (day: number) => void;
  onClose: () => void;
}

interface TributeDay {
  day: number;
  title: string;
  coins: number;
  boosters: Partial<PlayerProfile['boosters']>;
  icon: React.ReactNode;
}

const TRIBUTE_DAYS: TributeDay[] = [
  {
    day: 1,
    title: 'First Spark',
    coins: 50,
    boosters: {},
    icon: <Coins className="w-6 h-6 text-amber-400" />,
  },
  {
    day: 2,
    title: 'Smashing Force',
    coins: 0,
    boosters: { hammer: 1 },
    icon: <Hammer className="w-6 h-6 text-rose-400" />,
  },
  {
    day: 3,
    title: 'Clan Treasury',
    coins: 75,
    boosters: {},
    icon: <Coins className="w-6 h-6 text-amber-300" />,
  },
  {
    day: 4,
    title: 'Rainbow Prism',
    coins: 0,
    boosters: { rainbow: 1 },
    icon: <Disc className="w-6 h-6 text-cyan-400" />,
  },
  {
    day: 5,
    title: 'Mystic Sight',
    coins: 100,
    boosters: { hint: 2 },
    icon: <Wand2 className="w-6 h-6 text-purple-400" />,
  },
  {
    day: 6,
    title: 'Grand Clan Tribute',
    coins: 250,
    boosters: { hammer: 2, hint: 2, shuffle: 2, rainbow: 2 },
    icon: <Sparkles className="w-7 h-7 text-yellow-300 animate-spin" />,
  },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  profile,
  onClaim,
  onClose,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const alreadyClaimedToday = profile.dailyReward.lastClaimDate === todayStr;
  const currentActiveDay = profile.dailyReward.currentDay || 1;

  const handleClaim = (day: number) => {
    sound.playVictory();
    onClaim(day);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none">
      <div className="bg-gradient-to-b from-[#240c3a] via-[#1a082c] to-[#120420] border border-purple-500/40 rounded-3xl w-full max-w-sm p-4 shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-lg font-black text-amber-300 tracking-wide">
          6-Day Daily Tribute
        </h2>
        <p className="text-xs text-purple-200 mb-3">
          Claim daily loyalty gifts. Cycle auto-refreshes after Day 6!
        </p>

        {/* 6 Day Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {TRIBUTE_DAYS.map((item) => {
            const isCompleted = item.day < currentActiveDay;
            const isReady = item.day === currentActiveDay && !alreadyClaimedToday;
            const isLocked = item.day > currentActiveDay || (item.day === currentActiveDay && alreadyClaimedToday);

            return (
              <div
                key={item.day}
                className={`rounded-2xl p-2.5 flex flex-col items-center justify-between border relative ${
                  isReady
                    ? 'bg-gradient-to-b from-purple-800 to-purple-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50 scale-105'
                    : isCompleted
                    ? 'bg-purple-950/40 border-purple-800/40 opacity-70'
                    : 'bg-zinc-950/60 border-zinc-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-extrabold mb-1">
                  <span className={isReady ? 'text-amber-300' : 'text-zinc-400'}>
                    Day {item.day}
                  </span>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div className="my-1">{item.icon}</div>

                <div className="text-[10px] font-bold text-center leading-tight">
                  {item.coins > 0 && <div className="text-amber-300">+{item.coins} Coins</div>}
                  {item.boosters.hammer && <div className="text-rose-300">+{item.boosters.hammer} Hammer</div>}
                  {item.boosters.rainbow && <div className="text-cyan-300">+{item.boosters.rainbow} Rainbow</div>}
                  {item.boosters.hint && <div className="text-purple-300">+{item.boosters.hint} Hints</div>}
                  {item.day === 6 && <div className="text-yellow-300 font-black">+All Boosters!</div>}
                </div>

                {isReady && (
                  <button
                    onClick={() => handleClaim(item.day)}
                    className="w-full mt-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-purple-950 font-black text-[11px] py-1 rounded-lg shadow-md active:scale-95 transition-transform"
                  >
                    Claim!
                  </button>
                )}

                {isCompleted && (
                  <span className="text-[9px] font-bold text-emerald-400 mt-1 uppercase tracking-wider">
                    Claimed
                  </span>
                )}

                {isLocked && !isCompleted && !isReady && (
                  <span className="text-[9px] font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                    {item.day === currentActiveDay ? 'Tomorrow' : 'Locked'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {alreadyClaimedToday && (
          <div className="bg-purple-950/60 border border-purple-500/30 rounded-xl p-2 text-xs text-purple-300 font-semibold">
            ✨ You have claimed today's tribute! Next reward unlocks tomorrow.
          </div>
        )}
      </div>
    </div>
  );
};
