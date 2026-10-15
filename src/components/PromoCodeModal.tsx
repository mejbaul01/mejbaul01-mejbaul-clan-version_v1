import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, Sparkles, Copy } from 'lucide-react';
import { PlayerProfile } from '../types';
import { sound } from '../game/sound';

interface PromoCodeModalProps {
  profile: PlayerProfile;
  onRedeem: (code: string, reward: PromoReward) => void;
  onClose: () => void;
}

export interface PromoReward {
  coins: number;
  hearts: number;
  hammer: number;
  hint: number;
  shuffle: number;
  rainbow: number;
  description: string;
}

const PROMO_CODES: Record<string, PromoReward> = {
  MEJBA2026: {
    coins: 100,
    hearts: 0,
    hammer: 0,
    hint: 0,
    shuffle: 0,
    rainbow: 1,
    description: '+100 Gold Coins and 1 Rainbow Blast',
  },
  RESTOFCLANS: {
    coins: 80,
    hearts: 0,
    hammer: 1,
    hint: 0,
    shuffle: 0,
    rainbow: 0,
    description: '+80 Gold Coins and 1 Shutter Hammer',
  },
  LOVE5: {
    coins: 0,
    hearts: 5,
    hammer: 0,
    hint: 0,
    shuffle: 0,
    rainbow: 0,
    description: 'Full 5 Hearts (❤️) Refill',
  },
  CROWN50: {
    coins: 50,
    hearts: 0,
    hammer: 0,
    hint: 2,
    shuffle: 0,
    rainbow: 0,
    description: '+50 Gold Coins and 2 Magic Hints',
  },
  GEMS100: {
    coins: 100,
    hearts: 0,
    hammer: 0,
    hint: 0,
    shuffle: 1,
    rainbow: 0,
    description: '+100 Gold Coins and 1 Mystic Shuffle',
  },
  GOLDENCHEST: {
    coins: 150,
    hearts: 0,
    hammer: 1,
    hint: 1,
    shuffle: 1,
    rainbow: 1,
    description: '+150 Gold Coins and 1 of every Booster',
  },
  RUBYMASTER: {
    coins: 75,
    hearts: 0,
    hammer: 2,
    hint: 0,
    shuffle: 0,
    rainbow: 0,
    description: '+75 Gold Coins and 2 Shutter Hammers',
  },
  AMETHYSTGLOW: {
    coins: 60,
    hearts: 0,
    hammer: 0,
    hint: 3,
    shuffle: 0,
    rainbow: 0,
    description: '+60 Gold Coins and 3 Magic Hints',
  },
  EMERALDKING: {
    coins: 120,
    hearts: 0,
    hammer: 0,
    hint: 0,
    shuffle: 2,
    rainbow: 0,
    description: '+120 Gold Coins and 2 Mystic Shuffles',
  },
  ROYALBONUS: {
    coins: 200,
    hearts: 5,
    hammer: 0,
    hint: 0,
    shuffle: 0,
    rainbow: 1,
    description: '+200 Gold Coins, 5 Hearts, and 1 Rainbow Blast',
  },
  HAPPYNEWYEAR: {
    coins: 250,
    hearts: 5,
    hammer: 2,
    hint: 2,
    shuffle: 2,
    rainbow: 2,
    description: '+250 Gold Coins, 5 Hearts, and 2 of each Booster (Happy New Year Gift)',
  },
  HALLOWEEN: {
    coins: 180,
    hearts: 0,
    hammer: 3,
    hint: 1,
    shuffle: 3,
    rainbow: 1,
    description: '+180 Gold Coins, 3 Hammers, 3 Shuffles, & 1 Rainbow Blast (Halloween Spooky Gift)',
  },
  EID: {
    coins: 500,
    hearts: 5,
    hammer: 3,
    hint: 3,
    shuffle: 3,
    rainbow: 3,
    description: '+500 Gold Coins, 5 Hearts, and 3 of all Boosters (Grand Eid Mubarak Gift)',
  },
};

export const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  profile,
  onRedeem,
  onClose,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase().replace(/[\s_-]+/g, '');
    if (!clean) return;

    if (profile.redeemedCodes.includes(clean)) {
      sound.playInvalid();
      setFeedback({
        type: 'error',
        message: 'This promo code has already been redeemed!',
      });
      return;
    }

    const reward = PROMO_CODES[clean];
    if (reward) {
      sound.playVictory();
      setFeedback({
        type: 'success',
        message: `Unlocked: ${reward.description}!`,
      });
      onRedeem(clean, reward);
      setInputCode('');
    } else {
      sound.playInvalid();
      setFeedback({
        type: 'error',
        message: 'Invalid secret code. Please verify spelling!',
      });
    }
  };

  const handleCopyCode = (code: string) => {
    sound.playClick();
    setInputCode(code);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none">
      <div className="bg-gradient-to-b from-[#250d3a] via-[#1a082b] to-[#11031d] border border-purple-500/40 rounded-3xl w-full max-w-sm p-4 shadow-2xl relative">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <KeyRound className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-base font-black text-amber-300 text-center tracking-wide">
          Official Secret Promo Codes
        </h2>
        <p className="text-[11px] text-purple-200 text-center mb-3">
          Enter official Mejba Clan vouchers to claim coins, hearts & boosters!
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 mb-3">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. HAPPYNEWYEAR, EID, MEJBA2026"
              className="flex-1 bg-purple-950/80 border border-purple-500/40 rounded-xl px-3 py-2 text-sm font-mono font-bold text-amber-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-black text-xs px-4 rounded-xl shadow-md active:scale-95 transition-transform"
            >
              Redeem
            </button>
          </div>

          {feedback && (
            <div
              className={`p-2 rounded-xl flex items-center gap-2 text-xs font-bold ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </form>

        {/* 13 Available Promo Codes list */}
        <div className="bg-[#150726] border border-purple-500/20 rounded-2xl p-2.5 max-h-52 overflow-y-auto space-y-1.5">
          <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            13 Official Secret Codes (Tap to Fill)
          </div>
          {Object.entries(PROMO_CODES).map(([code, reward]) => {
            const isRedeemed = profile.redeemedCodes.includes(code);
            return (
              <div
                key={code}
                onClick={() => !isRedeemed && handleCopyCode(code)}
                className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isRedeemed
                    ? 'bg-zinc-950/50 border-zinc-800 text-zinc-500 opacity-60'
                    : 'bg-purple-900/30 hover:bg-purple-800/40 border-purple-500/20 text-purple-100 cursor-pointer active:scale-98'
                }`}
              >
                <div>
                  <div className="font-mono font-black text-amber-300 tracking-wider">
                    {code}
                  </div>
                  <div className="text-[10px] text-zinc-400">{reward.description}</div>
                </div>

                <div>
                  {isRedeemed ? (
                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                      Claimed
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Copy className="w-2.5 h-2.5" /> Use
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
