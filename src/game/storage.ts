import { PlayerProfile, ThemeId } from '../types';

const STORAGE_KEY = 'mejba_clan_save_v1';
export const HEART_RECOVERY_TIME_MS = 59 * 60 * 1000; // 59 minutes

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Mejba Warrior',
  coins: 150,
  hearts: 5,
  lastHeartLostTime: 0,
  boosters: {
    hammer: 2,
    hint: 3,
    shuffle: 2,
    rainbow: 1,
  },
  levels: {
    1: { stars: 0, highScore: 0, unlocked: true },
    2: { stars: 0, highScore: 0, unlocked: false },
    3: { stars: 0, highScore: 0, unlocked: false },
    4: { stars: 0, highScore: 0, unlocked: false },
    5: { stars: 0, highScore: 0, unlocked: false },
    6: { stars: 0, highScore: 0, unlocked: false },
    7: { stars: 0, highScore: 0, unlocked: false },
    8: { stars: 0, highScore: 0, unlocked: false },
    9: { stars: 0, highScore: 0, unlocked: false },
    10: { stars: 0, highScore: 0, unlocked: false },
    11: { stars: 0, highScore: 0, unlocked: false },
    12: { stars: 0, highScore: 0, unlocked: false },
    13: { stars: 0, highScore: 0, unlocked: false },
    14: { stars: 0, highScore: 0, unlocked: false },
    15: { stars: 0, highScore: 0, unlocked: false },
    16: { stars: 0, highScore: 0, unlocked: false },
    17: { stars: 0, highScore: 0, unlocked: false },
    18: { stars: 0, highScore: 0, unlocked: false },
    19: { stars: 0, highScore: 0, unlocked: false },
    20: { stars: 0, highScore: 0, unlocked: false },
  },
  currentLevel: 1,
  dailyReward: {
    lastClaimDate: '',
    currentDay: 1,
  },
  redeemedCodes: [],
  vault: {
    depositedCoins: 0,
    lastInterestTimestamp: Date.now(),
    accumulatedInterest: 0,
  },
  theme: 'royal',
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
};

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);

    // Merge with defaults to ensure schema resilience
    const profile: PlayerProfile = {
      ...DEFAULT_PROFILE,
      ...parsed,
      boosters: {
        ...DEFAULT_PROFILE.boosters,
        ...(parsed.boosters || {}),
      },
      levels: {
        ...DEFAULT_PROFILE.levels,
        ...(parsed.levels || {}),
      },
      dailyReward: {
        ...DEFAULT_PROFILE.dailyReward,
        ...(parsed.dailyReward || {}),
      },
      vault: {
        ...DEFAULT_PROFILE.vault,
        ...(parsed.vault || {}),
      },
      redeemedCodes: Array.isArray(parsed.redeemedCodes) ? parsed.redeemedCodes : [],
    };

    // Calculate heart regeneration
    const now = Date.now();
    if (profile.hearts < 5 && profile.lastHeartLostTime > 0) {
      const elapsed = now - profile.lastHeartLostTime;
      const heartsGained = Math.floor(elapsed / HEART_RECOVERY_TIME_MS);
      if (heartsGained > 0) {
        profile.hearts = Math.min(5, profile.hearts + heartsGained);
        if (profile.hearts >= 5) {
          profile.lastHeartLostTime = 0;
        } else {
          // Carry forward remaining time
          profile.lastHeartLostTime += heartsGained * HEART_RECOVERY_TIME_MS;
        }
      }
    }

    // Calculate passive 5% hourly vault interest
    if (profile.vault.depositedCoins > 0) {
      const vaultElapsed = now - (profile.vault.lastInterestTimestamp || now);
      const hoursElapsed = Math.floor(vaultElapsed / (60 * 60 * 1000));
      if (hoursElapsed > 0) {
        const hourlyInterest = Math.max(1, Math.floor(profile.vault.depositedCoins * 0.05));
        profile.vault.accumulatedInterest += hourlyInterest * hoursElapsed;
        profile.vault.lastInterestTimestamp = now;
      }
    } else {
      profile.vault.lastInterestTimestamp = now;
    }

    saveProfile(profile);
    return profile;
  } catch (err) {
    console.warn('Failed to load profile, resetting to default', err);
    saveProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save profile', err);
  }
}

export function resetProgress(): PlayerProfile {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = { ...DEFAULT_PROFILE };
  saveProfile(fresh);
  return fresh;
}
