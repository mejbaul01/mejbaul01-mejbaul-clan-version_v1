import React, { useState } from 'react';
import {
  X,
  Store,
  Coins,
  Heart,
  Hammer,
  Wand2,
  Shuffle,
  Disc,
  Landmark,
  Palette,
  Check,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { PlayerProfile, ThemeId } from '../types';
import { THEMES } from '../game/themes';
import { sound } from '../game/sound';

interface ShopModalProps {
  profile: PlayerProfile;
  initialTab?: 'boosters' | 'vault' | 'themes';
  onBuyBooster: (type: keyof PlayerProfile['boosters'], cost: number) => void;
  onRefillHearts: (cost: number) => void;
  onSelectTheme: (themeId: ThemeId) => void;
  onDepositVault: (amount: number) => void;
  onWithdrawVault: (amount: number) => void;
  onClaimVaultInterest: () => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  profile,
  initialTab = 'boosters',
  onBuyBooster,
  onRefillHearts,
  onSelectTheme,
  onDepositVault,
  onWithdrawVault,
  onClaimVaultInterest,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'boosters' | 'vault' | 'themes'>(initialTab);
  const [vaultAmountInput, setVaultAmountInput] = useState<string>('50');

  const BOOSTER_ITEMS = [
    {
      id: 'hammer' as const,
      name: 'Shutter Hammer',
      desc: 'Smashes any gem or 3x3 surrounding zone',
      cost: 40,
      icon: <Hammer className="w-5 h-5 text-amber-400" />,
      stock: profile.boosters.hammer,
    },
    {
      id: 'hint' as const,
      name: 'Magic Hint',
      desc: 'Illuminates a guaranteed valid jewel match',
      cost: 25,
      icon: <Wand2 className="w-5 h-5 text-cyan-400" />,
      stock: profile.boosters.hint,
    },
    {
      id: 'shuffle' as const,
      name: 'Mystic Shuffle',
      desc: 'Rearranges all jewels without using a turn',
      cost: 30,
      icon: <Shuffle className="w-5 h-5 text-emerald-400" />,
      stock: profile.boosters.shuffle,
    },
    {
      id: 'rainbow' as const,
      name: 'Rainbow Blast',
      desc: 'Obliterates all gems of a chosen color',
      cost: 60,
      icon: <Disc className="w-5 h-5 text-rose-400 animate-rainbow" />,
      stock: profile.boosters.rainbow,
    },
  ];

  const handleDeposit = () => {
    const val = parseInt(vaultAmountInput, 10);
    if (!isNaN(val) && val > 0 && val <= profile.coins) {
      sound.playCoin();
      onDepositVault(val);
    } else {
      sound.playInvalid();
    }
  };

  const handleWithdraw = () => {
    const val = parseInt(vaultAmountInput, 10);
    if (!isNaN(val) && val > 0 && val <= profile.vault.depositedCoins) {
      sound.playCoin();
      onWithdrawVault(val);
    } else {
      sound.playInvalid();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none">
      <div className="bg-gradient-to-b from-[#240c3a] via-[#1a082b] to-[#120420] border border-purple-500/40 rounded-3xl w-full max-w-sm p-4 shadow-2xl relative flex flex-col max-h-[92vh]">
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
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center shadow-md">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-black text-amber-300">Clan Bazaar & Treasury</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300/90">
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" /> {profile.coins} Coins
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-rose-300">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {profile.hearts}/5
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#130623] p-1 rounded-xl border border-purple-500/30 gap-1 mb-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('boosters');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'boosters'
                ? 'bg-purple-800 text-amber-300 shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Bazaar
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('vault');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'vault'
                ? 'bg-purple-800 text-amber-300 shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Clan Vault
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('themes');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'themes'
                ? 'bg-purple-800 text-amber-300 shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Themes
          </button>
        </div>

        {/* Tab 1: Boosters & Hearts */}
        {activeTab === 'boosters' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {/* Heart Refill Card */}
            <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-900/60 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-500" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-rose-100">Full 5 Hearts Refill</div>
                  <div className="text-[10px] text-rose-300">Instant recovery for all 5 lives</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (profile.coins >= 50 && profile.hearts < 5) {
                    sound.playCoin();
                    onRefillHearts(50);
                  } else {
                    sound.playInvalid();
                  }
                }}
                disabled={profile.coins < 50 || profile.hearts >= 5}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 disabled:opacity-40 text-purple-950 font-black text-xs px-3 py-1.5 rounded-xl shadow active:scale-95 transition-transform"
              >
                50 🪙
              </button>
            </div>

            {/* Booster Cards */}
            {BOOSTER_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/25 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-900/60 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-purple-100 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <span className="text-[9px] bg-purple-800 text-purple-200 px-1.5 py-0.2 rounded-full font-mono">
                        Owned: {item.stock}
                      </span>
                    </div>
                    <div className="text-[10px] text-purple-300 line-clamp-1">{item.desc}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (profile.coins >= item.cost) {
                      sound.playCoin();
                      onBuyBooster(item.id, item.cost);
                    } else {
                      sound.playInvalid();
                    }
                  }}
                  disabled={profile.coins < item.cost}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 disabled:opacity-40 text-purple-950 font-black text-xs px-3 py-1.5 rounded-xl shadow active:scale-95 transition-transform shrink-0 ml-2"
                >
                  {item.cost} 🪙
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Clan Vault (5% Hourly Interest) */}
        {activeTab === 'vault' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-center">
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1.5">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-amber-300">Mejba Clan Vault</h3>
              <p className="text-[11px] text-purple-200 mb-2">
                Deposit gold coins to earn <span className="text-amber-300 font-bold">5% passive interest dividend</span> every hour!
              </p>

              <div className="grid grid-cols-2 gap-2 bg-[#120521] p-2.5 rounded-xl border border-purple-500/20 text-left">
                <div>
                  <div className="text-[10px] text-zinc-400">Deposited Gold:</div>
                  <div className="text-base font-black text-amber-300 font-mono">
                    {profile.vault.depositedCoins} 🪙
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">Accrued Dividend:</div>
                  <div className="text-base font-black text-emerald-400 font-mono flex items-center gap-1">
                    +{profile.vault.accumulatedInterest} 🪙
                  </div>
                </div>
              </div>

              {/* Claim Interest Button */}
              {profile.vault.accumulatedInterest > 0 && (
                <button
                  onClick={() => {
                    sound.playVictory();
                    onClaimVaultInterest();
                  }}
                  className="w-full mt-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white font-extrabold text-xs py-2 rounded-xl shadow active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  Claim +{profile.vault.accumulatedInterest} Coins Dividend!
                </button>
              )}
            </div>

            {/* Deposit / Withdraw Controls */}
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/25 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                <span>Transaction Amount:</span>
                <span className="font-mono text-amber-300">Wallet: {profile.coins} 🪙</span>
              </div>

              <div className="flex gap-1.5">
                {[25, 50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setVaultAmountInput(amt.toString())}
                    className="flex-1 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-[10px] font-bold text-amber-300 border border-purple-500/20"
                  >
                    {amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={vaultAmountInput}
                onChange={(e) => setVaultAmountInput(e.target.value)}
                min="1"
                className="w-full bg-[#120521] border border-purple-500/40 rounded-xl px-3 py-1.5 text-sm font-mono font-bold text-amber-300 text-center focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleDeposit}
                  disabled={profile.coins <= 0}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-purple-950 font-black text-xs py-2 rounded-xl shadow flex items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={profile.vault.depositedCoins <= 0}
                  className="bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-purple-100 font-black text-xs py-2 rounded-xl shadow flex items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 5 Themes Selector */}
        {activeTab === 'themes' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {Object.values(THEMES).map((theme) => {
              const isSelected = profile.theme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectTheme(theme.id);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-purple-900/70 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                      : 'bg-purple-950/40 hover:bg-purple-900/40 border-purple-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-purple-100">
                      {theme.name}
                    </span>
                    {isSelected ? (
                      <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-500/40">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400">Select</span>
                    )}
                  </div>
                  <div className="text-[10px] text-purple-300 opacity-80 mb-2">
                    {theme.description}
                  </div>

                  {/* Preview swatch bar */}
                  <div className={`h-3 rounded-full w-full ${theme.boardBg} border border-white/10`} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
