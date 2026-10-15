import React, { useState, useEffect, useCallback } from 'react';
import { PlayerProfile, Screen, ThemeId } from './types';
import { loadProfile, saveProfile, resetProgress } from './game/storage';
import { LEVELS } from './game/levels';
import { sound } from './game/sound';

import { HeaderBar } from './components/HeaderBar';
import { SplashView } from './components/SplashView';
import { MenuView } from './components/MenuView';
import { LevelMap } from './components/LevelMap';
import { GameBoard } from './components/GameBoard';

import { VictoryModal } from './components/VictoryModal';
import { DefeatModal } from './components/DefeatModal';
import { PauseModal } from './components/PauseModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { PromoCodeModal, PromoReward } from './components/PromoCodeModal';
import { ShopModal } from './components/ShopModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyModal } from './components/PrivacyModal';
import { OpenSourceModal } from './components/OpenSourceModal';
import { DownloadModal } from './components/DownloadModal';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeLevelId, setActiveLevelId] = useState<number>(profile.currentLevel);

  // Modals state
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopInitialTab, setShopInitialTab] = useState<'boosters' | 'vault' | 'themes'>('boosters');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isOpenSourceOpen, setIsOpenSourceOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPauseOpen, setIsPauseOpen] = useState(false);

  const [victoryData, setVictoryData] = useState<{
    score: number;
    stars: number;
    coinsEarned: number;
  } | null>(null);

  const [defeatData, setDefeatData] = useState<{
    reason: 'moves' | 'time';
  } | null>(null);

  // Sync audio toggles with SoundController
  useEffect(() => {
    sound.setSfxEnabled(profile.soundEnabled);
    sound.setMusicEnabled(profile.musicEnabled);
  }, [profile.musicEnabled, profile.soundEnabled]);

  // Listen for native PWA install prompt
  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsDownloadOpen(false);
      }
    }
  };

  // Update profile and persist
  const updateProfile = useCallback((updater: (prev: PlayerProfile) => PlayerProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      saveProfile(next);
      return next;
    });
  }, []);

  // Launch a level
  const startLevel = (levelId: number) => {
    if (profile.hearts <= 0) {
      sound.playInvalid();
      setShopInitialTab('boosters');
      setIsShopOpen(true);
      return;
    }
    setActiveLevelId(levelId);
    setVictoryData(null);
    setDefeatData(null);
    setIsPauseOpen(false);
    setScreen('game');
  };

  // Victory Handler
  const handleVictory = (score: number, stars: number) => {
    const coinsEarned = 25 + stars * 15;
    setVictoryData({ score, stars, coinsEarned });

    updateProfile((prev) => {
      const currentLevelProg = prev.levels[activeLevelId] || { stars: 0, highScore: 0, unlocked: true };
      const nextLevels = { ...prev.levels };

      // Update current level
      nextLevels[activeLevelId] = {
        stars: Math.max(currentLevelProg.stars, stars),
        highScore: Math.max(currentLevelProg.highScore, score),
        unlocked: true,
      };

      // Unlock next stage
      const nextLevelId = activeLevelId + 1;
      let nextCurrentLevel = prev.currentLevel;
      if (nextLevelId <= 20) {
        nextLevels[nextLevelId] = {
          ...(nextLevels[nextLevelId] || { stars: 0, highScore: 0 }),
          unlocked: true,
        };
        nextCurrentLevel = Math.max(prev.currentLevel, nextLevelId);
      }

      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        currentLevel: nextCurrentLevel,
        levels: nextLevels,
      };
    });
  };

  // Defeat Handler (Deducts 1 Heart)
  const handleDefeat = (reason: 'moves' | 'time') => {
    setDefeatData({ reason });

    updateProfile((prev) => {
      const nextHearts = Math.max(0, prev.hearts - 1);
      const lostTime = prev.lastHeartLostTime === 0 ? Date.now() : prev.lastHeartLostTime;

      return {
        ...prev,
        hearts: nextHearts,
        lastHeartLostTime: lostTime,
      };
    });
  };

  // Claim Daily Tribute
  const handleClaimDaily = (day: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    updateProfile((prev) => {
      const nextDay = day >= 6 ? 1 : day + 1;
      let addedCoins = 0;
      const nextBoosters = { ...prev.boosters };

      if (day === 1) addedCoins = 50;
      else if (day === 2) nextBoosters.hammer += 1;
      else if (day === 3) addedCoins = 75;
      else if (day === 4) nextBoosters.rainbow += 1;
      else if (day === 5) {
        addedCoins = 100;
        nextBoosters.hint += 2;
      } else if (day === 6) {
        addedCoins = 250;
        nextBoosters.hammer += 2;
        nextBoosters.hint += 2;
        nextBoosters.shuffle += 2;
        nextBoosters.rainbow += 2;
      }

      return {
        ...prev,
        coins: prev.coins + addedCoins,
        boosters: nextBoosters,
        dailyReward: {
          lastClaimDate: todayStr,
          currentDay: nextDay,
        },
      };
    });
    setIsDailyOpen(false);
  };

  // Redeem Promo Code
  const handleRedeemPromo = (code: string, reward: PromoReward) => {
    updateProfile((prev) => ({
      ...prev,
      coins: prev.coins + reward.coins,
      hearts: reward.hearts > 0 ? 5 : prev.hearts,
      lastHeartLostTime: reward.hearts > 0 ? 0 : prev.lastHeartLostTime,
      boosters: {
        hammer: prev.boosters.hammer + reward.hammer,
        hint: prev.boosters.hint + reward.hint,
        shuffle: prev.boosters.shuffle + reward.shuffle,
        rainbow: prev.boosters.rainbow + reward.rainbow,
      },
      redeemedCodes: [...prev.redeemedCodes, code],
    }));
  };

  // Shop actions
  const handleBuyBooster = (type: keyof PlayerProfile['boosters'], cost: number) => {
    updateProfile((prev) => {
      if (prev.coins < cost) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        boosters: {
          ...prev.boosters,
          [type]: prev.boosters[type] + 1,
        },
      };
    });
  };

  const handleRefillHearts = (cost: number) => {
    updateProfile((prev) => {
      if (prev.coins < cost) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        hearts: 5,
        lastHeartLostTime: 0,
      };
    });
  };

  const handleDepositVault = (amount: number) => {
    updateProfile((prev) => {
      if (prev.coins < amount) return prev;
      return {
        ...prev,
        coins: prev.coins - amount,
        vault: {
          ...prev.vault,
          depositedCoins: prev.vault.depositedCoins + amount,
          lastInterestTimestamp: Date.now(),
        },
      };
    });
  };

  const handleWithdrawVault = (amount: number) => {
    updateProfile((prev) => {
      if (prev.vault.depositedCoins < amount) return prev;
      return {
        ...prev,
        coins: prev.coins + amount,
        vault: {
          ...prev.vault,
          depositedCoins: prev.vault.depositedCoins - amount,
          lastInterestTimestamp: Date.now(),
        },
      };
    });
  };

  const handleClaimVaultInterest = () => {
    updateProfile((prev) => {
      const interest = prev.vault.accumulatedInterest;
      if (interest <= 0) return prev;
      return {
        ...prev,
        coins: prev.coins + interest,
        vault: {
          ...prev.vault,
          accumulatedInterest: 0,
          lastInterestTimestamp: Date.now(),
        },
      };
    });
  };

  const handleGoHome = () => {
    sound.playClick();
    setIsDailyOpen(false);
    setIsPromoOpen(false);
    setIsShopOpen(false);
    setIsLeaderboardOpen(false);
    setIsSettingsOpen(false);
    setIsPrivacyOpen(false);
    setIsOpenSourceOpen(false);
    setIsDownloadOpen(false);
    setIsPauseOpen(false);
    setVictoryData(null);
    setDefeatData(null);
    setScreen('splash');
  };

  const currentLevelConfig = LEVELS.find((l) => l.id === activeLevelId) || LEVELS[0];

  return (
    <div className="w-full min-h-screen bg-[#12081f] text-white flex flex-col font-['Nunito',sans-serif]">
      {/* Persistent Header */}
      {screen !== 'splash' && (
        <HeaderBar
          profile={profile}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShop={(tab) => {
            setShopInitialTab(tab || 'boosters');
            setIsShopOpen(true);
          }}
          onGoHome={handleGoHome}
        />
      )}

      {/* Screen Routing */}
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {screen === 'splash' && (
          <SplashView onEnter={() => setScreen('menu')} />
        )}

        {screen === 'menu' && (
          <MenuView
            profile={profile}
            onPlayCurrentLevel={() => startLevel(profile.currentLevel)}
            onOpenMap={() => setScreen('map')}
            onOpenDaily={() => setIsDailyOpen(true)}
            onOpenShop={(tab) => {
              setShopInitialTab(tab || 'boosters');
              setIsShopOpen(true);
            }}
            onOpenPromo={() => setIsPromoOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenOpenSource={() => setIsOpenSourceOpen(true)}
            onOpenDownload={() => setIsDownloadOpen(true)}
          />
        )}

        {screen === 'map' && (
          <LevelMap
            profile={profile}
            onSelectLevel={startLevel}
            onBackToMenu={() => setScreen('menu')}
          />
        )}

        {screen === 'game' && (
          <GameBoard
            key={activeLevelId}
            level={currentLevelConfig}
            profile={profile}
            onVictory={handleVictory}
            onDefeat={handleDefeat}
            onPause={() => setIsPauseOpen(true)}
            onUpdateBoosters={(nextBoosters) =>
              updateProfile((prev) => ({ ...prev, boosters: nextBoosters }))
            }
          />
        )}
      </main>

      {/* Modals & Overlays */}
      {isDailyOpen && (
        <DailyRewardModal
          profile={profile}
          onClaim={handleClaimDaily}
          onClose={() => setIsDailyOpen(false)}
        />
      )}

      {isPromoOpen && (
        <PromoCodeModal
          profile={profile}
          onRedeem={handleRedeemPromo}
          onClose={() => setIsPromoOpen(false)}
        />
      )}

      {isShopOpen && (
        <ShopModal
          profile={profile}
          initialTab={shopInitialTab}
          onBuyBooster={handleBuyBooster}
          onRefillHearts={handleRefillHearts}
          onSelectTheme={(themeId: ThemeId) =>
            updateProfile((prev) => ({ ...prev, theme: themeId }))
          }
          onDepositVault={handleDepositVault}
          onWithdrawVault={handleWithdrawVault}
          onClaimVaultInterest={handleClaimVaultInterest}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {isLeaderboardOpen && (
        <LeaderboardModal
          profile={profile}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          profile={profile}
          onUpdateSound={(sfx, music) =>
            updateProfile((prev) => ({
              ...prev,
              soundEnabled: sfx,
              musicEnabled: music,
            }))
          }
          onUpdateName={(name) =>
            updateProfile((prev) => ({ ...prev, name }))
          }
          onResetProgress={() => {
            const fresh = resetProgress();
            setProfile(fresh);
            setScreen('menu');
          }}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenOpenSource={() => setIsOpenSourceOpen(true)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isPrivacyOpen && (
        <PrivacyModal onClose={() => setIsPrivacyOpen(false)} />
      )}

      {isOpenSourceOpen && (
        <OpenSourceModal onClose={() => setIsOpenSourceOpen(false)} />
      )}

      {isDownloadOpen && (
        <DownloadModal
          onClose={() => setIsDownloadOpen(false)}
          deferredPrompt={deferredPrompt}
          onInstallPwa={handleInstallPwa}
        />
      )}

      {isPauseOpen && (
        <PauseModal
          profile={profile}
          onResume={() => setIsPauseOpen(false)}
          onRestart={() => {
            setIsPauseOpen(false);
            startLevel(activeLevelId);
          }}
          onGoToMap={() => {
            setIsPauseOpen(false);
            setScreen('map');
          }}
          onToggleSound={(sfx, music) =>
            updateProfile((prev) => ({
              ...prev,
              soundEnabled: sfx,
              musicEnabled: music,
            }))
          }
        />
      )}

      {victoryData && (
        <VictoryModal
          level={currentLevelConfig}
          score={victoryData.score}
          stars={victoryData.stars}
          coinsEarned={victoryData.coinsEarned}
          hasNextLevel={activeLevelId < 20}
          onNextLevel={() => {
            setVictoryData(null);
            startLevel(activeLevelId + 1);
          }}
          onGoToMap={() => {
            setVictoryData(null);
            setScreen('map');
          }}
        />
      )}

      {defeatData && (
        <DefeatModal
          level={currentLevelConfig}
          reason={defeatData.reason}
          profile={profile}
          onRetry={() => {
            setDefeatData(null);
            startLevel(activeLevelId);
          }}
          onGoToMap={() => {
            setDefeatData(null);
            setScreen('map');
          }}
          onOpenShop={() => {
            setDefeatData(null);
            setShopInitialTab('boosters');
            setIsShopOpen(true);
          }}
        />
      )}
    </div>
  );
};
