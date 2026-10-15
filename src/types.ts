export type GemType = 'ruby' | 'amethyst' | 'sapphire' | 'emerald' | 'topaz' | 'quartz';

export type SpecialType = 'none' | 'striped_h' | 'striped_v' | 'bomb' | 'rainbow';

export interface Gem {
  id: string;
  type: GemType;
  special: SpecialType;
  row: number;
  col: number;
  isMatched?: boolean;
  isHint?: boolean;
}

export type ThemeId = 'royal' | 'celestial' | 'emerald' | 'volcanic' | 'cyberpunk';

export interface LevelConfig {
  id: number;
  title: string;
  targetScore: number;
  moves: number;
  timeLimitSec: number; // 239 sec = 03:59
  starScores: [number, number, number];
  gemTarget?: {
    type: GemType;
    count: number;
  };
  description: string;
}

export interface Boosters {
  hammer: number;      // Shutter hammer: smash gem or 3x3
  hint: number;        // Magic hint: show guaranteed match
  shuffle: number;     // Mystic shuffle: reshuffle board
  rainbow: number;     // Rainbow blast: clear all gems of one type
}

export interface LevelProgress {
  stars: number;       // 0 to 3
  highScore: number;
  unlocked: boolean;
}

export interface PlayerProfile {
  name: string;
  coins: number;
  hearts: number;              // Max 5
  lastHeartLostTime: number;   // Timestamp for 59m recovery
  boosters: Boosters;
  levels: Record<number, LevelProgress>;
  currentLevel: number;
  dailyReward: {
    lastClaimDate: string;     // YYYY-MM-DD
    currentDay: number;        // 1 to 6
  };
  redeemedCodes: string[];
  vault: {
    depositedCoins: number;
    lastInterestTimestamp: number;
    accumulatedInterest: number;
  };
  theme: ThemeId;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}

export type Screen = 'splash' | 'menu' | 'map' | 'game';
