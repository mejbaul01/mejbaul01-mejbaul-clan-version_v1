import React from 'react';
import { X, Trophy, Medal, Crown, Star, Flame } from 'lucide-react';
import { PlayerProfile } from '../types';
import { sound } from '../game/sound';

interface LeaderboardModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

interface ClanLeader {
  rank: number;
  name: string;
  clan: string;
  stars: number;
  score: number;
  badgeColor: string;
}

const GLOBAL_LEADERS: ClanLeader[] = [
  {
    rank: 1,
    name: 'King Mejba',
    clan: 'Rest of Clans Sovereign',
    stars: 60,
    score: 98400,
    badgeColor: 'from-amber-400 to-amber-600',
  },
  {
    rank: 2,
    name: 'Lady Amethyst',
    clan: 'Violet Citadel Guild',
    stars: 58,
    score: 92100,
    badgeColor: 'from-purple-400 to-purple-600',
  },
  {
    rank: 3,
    name: 'Warlord Ruby',
    clan: 'Crimson Vanguard',
    stars: 55,
    score: 86500,
    badgeColor: 'from-rose-400 to-rose-600',
  },
  {
    rank: 4,
    name: 'Sir Sapphire',
    clan: 'Oceanic Horizon',
    stars: 52,
    score: 79200,
    badgeColor: 'from-sky-400 to-sky-600',
  },
  {
    rank: 5,
    name: 'Elder Emerald',
    clan: 'Mystic Sylvan Grove',
    stars: 48,
    score: 71800,
    badgeColor: 'from-emerald-400 to-emerald-600',
  },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  profile,
  onClose,
}) => {
  const playerTotalStars = Object.values(profile.levels).reduce(
    (acc, lvl) => acc + (lvl.stars || 0),
    0
  );
  const playerTotalScore = Object.values(profile.levels).reduce(
    (acc, lvl) => acc + (lvl.highScore || 0),
    0
  );

  // Player estimated clan rank
  let playerRank = 6;
  if (playerTotalStars >= 60) playerRank = 1;
  else if (playerTotalStars >= 58) playerRank = 2;
  else if (playerTotalStars >= 55) playerRank = 3;
  else if (playerTotalStars >= 52) playerRank = 4;
  else if (playerTotalStars >= 48) playerRank = 5;
  else playerRank = Math.max(6, 40 - Math.floor(playerTotalStars * 0.6));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none">
      <div className="bg-gradient-to-b from-[#240c3a] via-[#1a082b] to-[#120420] border border-purple-500/40 rounded-3xl w-full max-w-sm p-4 shadow-2xl relative flex flex-col max-h-[92vh]">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-base font-black text-amber-300 text-center tracking-wide">
          Hall of Fame · Clan Standings
        </h2>
        <p className="text-[11px] text-purple-200 text-center mb-3">
          Top mythical champions of the Rest of Clans realm.
        </p>

        {/* Player Standing Card */}
        <div className="bg-gradient-to-r from-purple-900/80 via-rose-950/70 to-purple-900/80 border border-amber-400/60 rounded-2xl p-2.5 mb-3 shadow-md">
          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Your Clan Position</span>
            <span className="font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
              Rank #{playerRank}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-extrabold text-sm text-white">{profile.name}</div>
              <div className="text-[10px] text-purple-200">
                Mejba Clan Challenger • Stage {profile.currentLevel}/20
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-purple-950/60 px-2 py-1 rounded-xl border border-purple-500/30">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-amber-300">{playerTotalStars}</span>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-zinc-400">Total Score</div>
                <div className="text-xs font-mono font-bold text-purple-200">
                  {playerTotalScore.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Leader List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {GLOBAL_LEADERS.map((leader) => (
            <div
              key={leader.rank}
              className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${leader.badgeColor} flex items-center justify-center font-black text-xs text-purple-950 shadow`}
                >
                  {leader.rank === 1 ? (
                    <Crown className="w-4 h-4 text-purple-950" />
                  ) : (
                    `#${leader.rank}`
                  )}
                </div>

                <div className="text-left">
                  <div className="font-bold text-xs text-purple-100 flex items-center gap-1.5">
                    <span>{leader.name}</span>
                  </div>
                  <div className="text-[10px] text-purple-300 opacity-80">{leader.clan}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-300">{leader.stars}</span>
                </div>
                <div className="text-right min-w-[55px]">
                  <span className="text-xs font-mono text-purple-200 font-bold">
                    {leader.score.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
