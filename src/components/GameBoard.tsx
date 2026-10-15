import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Sparkles, Timer, Flame, Award, Zap, Shuffle, Wand2, Hammer, Disc } from 'lucide-react';
import { Gem, GemType, LevelConfig, PlayerProfile } from '../types';
import {
  GRID_ROWS,
  GRID_COLS,
  generateInitialBoard,
  findMatches,
  expandSpecialExplosions,
  applyGravityAndRefill,
  findLegalMove,
  shuffleBoard,
  testSwapValid,
} from '../game/engine';
import { THEMES } from '../game/themes';
import { GemIcon } from './GemIcon';
import { sound } from '../game/sound';
import { haptic } from '../game/haptics';

interface GameBoardProps {
  level: LevelConfig;
  profile: PlayerProfile;
  onVictory: (score: number, stars: number) => void;
  onDefeat: (reason: 'moves' | 'time') => void;
  onPause: () => void;
  onUpdateBoosters: (newBoosters: PlayerProfile['boosters']) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  profile,
  onVictory,
  onDefeat,
  onPause,
  onUpdateBoosters,
}) => {
  const [board, setBoard] = useState<Gem[][]>(() => generateInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [movesLeft, setMovesLeft] = useState<number>(level.moves);
  const [timeLeft, setTimeLeft] = useState<number>(level.timeLimitSec); // 239s = 03:59
  const [gemsCollected, setGemsCollected] = useState<number>(0);

  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [activeBooster, setActiveBooster] = useState<'hammer' | 'rainbow' | null>(null);

  const [comboBanner, setComboBanner] = useState<string | null>(null);
  const [shuffleToast, setShuffleToast] = useState<boolean>(false);

  // Drag tracking for touch/mouse swipe
  const dragStartPos = useRef<{ x: number; y: number; row: number; col: number } | null>(null);
  const hasFinishedRef = useRef<boolean>(false);

  const themeConfig = THEMES[profile.theme] || THEMES.royal;

  // Level Countdown Timer (03:59)
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        onDefeat('time');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasFinishedRef.current) {
            hasFinishedRef.current = true;
            onDefeat('time');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onDefeat]);

  // Check victory / defeat conditions
  const checkGameEnd = useCallback(
    (currentScore: number, remainingMoves: number) => {
      if (hasFinishedRef.current) return;

      const targetMet = currentScore >= level.targetScore;
      const gemTargetMet = level.gemTarget ? gemsCollected >= level.gemTarget.count : true;

      if (targetMet && gemTargetMet) {
        hasFinishedRef.current = true;
        let stars = 1;
        if (currentScore >= level.starScores[2]) stars = 3;
        else if (currentScore >= level.starScores[1]) stars = 2;
        onVictory(currentScore, stars);
      } else if (remainingMoves <= 0) {
        hasFinishedRef.current = true;
        onDefeat('moves');
      }
    },
    [gemsCollected, level, onDefeat, onVictory]
  );

  // Cascade resolution cycle
  const processCascades = useCallback(
    async (currentBoard: Gem[][], initialRainbowGem?: { gem: Gem; targetType: GemType }) => {
      setIsBusy(true);
      let workingBoard = currentBoard;
      let cascadeMultiplier = 1;
      let totalEarnedScore = 0;
      let totalGemsMatchedThisMove = 0;

      while (true) {
        const { matchedGems, specialSpawns } = findMatches(workingBoard);

        // Check if rainbow blast occurred
        let allClearedGems: Gem[] = [];
        if (initialRainbowGem && cascadeMultiplier === 1) {
          allClearedGems = expandSpecialExplosions(workingBoard, [initialRainbowGem.gem], initialRainbowGem.targetType);
          sound.playRainbow();
          haptic.rainbow();
        } else if (matchedGems.length > 0) {
          allClearedGems = expandSpecialExplosions(workingBoard, matchedGems);
          sound.playMatch(cascadeMultiplier);
          const hasExplosives = allClearedGems.some(g => g.special === 'bomb' || g.special === 'striped_h' || g.special === 'striped_v');
          if (hasExplosives) {
            haptic.explosion();
          } else {
            haptic.match(cascadeMultiplier);
          }
        } else {
          break; // Cascade chain has completed
        }

        if (allClearedGems.length === 0) break;

        // Show combo banner for multi-cascades
        if (cascadeMultiplier > 1) {
          const bannerText =
            cascadeMultiplier >= 4
              ? `🔥 MEGA CASCADE x${cascadeMultiplier}! 🔥`
              : `⚡ COMBO x${cascadeMultiplier}! ⚡`;
          setComboBanner(bannerText);
          setTimeout(() => setComboBanner(null), 1200);
        }

        // Score calculations: 60 pts per gem * multiplier
        const stepScore = allClearedGems.length * 60 * cascadeMultiplier;
        totalEarnedScore += stepScore;

        // Gem target collection
        if (level.gemTarget) {
          const matchedTargetGems = allClearedGems.filter((g) => g.type === level.gemTarget!.type).length;
          totalGemsMatchedThisMove += matchedTargetGems;
        }

        // Visual match flash
        const clearedIdSet = new Set(allClearedGems.map((g) => g.id));
        setBoard((prev) =>
          prev.map((row) =>
            row.map((gem) => (clearedIdSet.has(gem.id) ? { ...gem, isMatched: true } : gem))
          )
        );

        // Animation delay for gem pop
        await new Promise((r) => setTimeout(r, 260));

        // Apply gravity & spawn refills
        workingBoard = applyGravityAndRefill(workingBoard, clearedIdSet, specialSpawns);
        setBoard(workingBoard);

        // Animation delay for gem fall
        await new Promise((r) => setTimeout(r, 240));

        cascadeMultiplier = Math.min(5, cascadeMultiplier + 1);
      }

      // Update state
      const nextScore = score + totalEarnedScore;
      setScore(nextScore);

      if (totalGemsMatchedThisMove > 0) {
        setGemsCollected((prev) => prev + totalGemsMatchedThisMove);
      }

      // Check if board has legal moves remaining; if not, auto-shuffle!
      const hint = findLegalMove(workingBoard);
      if (!hint) {
        setShuffleToast(true);
        sound.playExplosion();
        await new Promise((r) => setTimeout(r, 1000));
        workingBoard = shuffleBoard(workingBoard);
        setBoard(workingBoard);
        setShuffleToast(false);
      }

      setIsBusy(false);

      // Verify end conditions
      checkGameEnd(nextScore, movesLeft);
    },
    [checkGameEnd, level.gemTarget, movesLeft, score]
  );

  // Execute swap between gem A and gem B
  const handleSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isBusy || movesLeft <= 0 || hasFinishedRef.current) return;

    // Check adjacency
    const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
    if (dist !== 1) {
      setSelectedGem({ row: r2, col: c2 });
      sound.playClick();
      return;
    }

    const gemA = board[r1][c1];
    const gemB = board[r2][c2];

    setSelectedGem(null);
    setIsBusy(true);

    // Animate swap forward
    const swappedBoard = board.map((row) => [...row]);
    swappedBoard[r1][c1] = { ...gemB, row: r1, col: c1 };
    swappedBoard[r2][c2] = { ...gemA, row: r2, col: c2 };
    setBoard(swappedBoard);
    sound.playSwap();
    haptic.medium();

    await new Promise((r) => setTimeout(r, 180));

    // Check if swap involves rainbow gem
    let rainbowTrigger: { gem: Gem; targetType: GemType } | undefined;
    if (gemA.special === 'rainbow') {
      rainbowTrigger = { gem: gemA, targetType: gemB.type };
    } else if (gemB.special === 'rainbow') {
      rainbowTrigger = { gem: gemB, targetType: gemA.type };
    }

    // Check validity
    const isValid = rainbowTrigger || testSwapValid(board, r1, c1, r2, c2);

    if (isValid) {
      // Deduct move
      const nextMoves = movesLeft - 1;
      setMovesLeft(nextMoves);

      // Process cascades
      await processCascades(swappedBoard, rainbowTrigger);
    } else {
      // Swap back with invalid sound & tactile error
      sound.playInvalid();
      haptic.error();
      await new Promise((r) => setTimeout(r, 150));
      setBoard(board);
      setIsBusy(false);
    }
  };

  // Booster handlers
  const useShutterHammer = async (row: number, col: number) => {
    if (profile.boosters.hammer <= 0 || isBusy) return;
    setActiveBooster(null);
    setIsBusy(true);

    sound.playExplosion();
    haptic.explosion();

    // Smash target gem + 3x3 surrounding
    const toClearSet = new Set<string>();
    const clearedGems: Gem[] = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
          const g = board[nr][nc];
          toClearSet.add(g.id);
          clearedGems.push(g);
        }
      }
    }

    // Spend booster
    onUpdateBoosters({
      ...profile.boosters,
      hammer: profile.boosters.hammer - 1,
    });

    // Score
    setScore((s) => s + clearedGems.length * 80);

    // Apply gravity
    const refilled = applyGravityAndRefill(board, toClearSet, []);
    setBoard(refilled);

    await new Promise((r) => setTimeout(r, 250));
    await processCascades(refilled);
  };

  const useRainbowBlast = async (targetType: GemType) => {
    if (profile.boosters.rainbow <= 0 || isBusy) return;
    setActiveBooster(null);
    setIsBusy(true);

    sound.playRainbow();

    const toClearSet = new Set<string>();
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (board[r][c].type === targetType) {
          toClearSet.add(board[r][c].id);
        }
      }
    }

    onUpdateBoosters({
      ...profile.boosters,
      rainbow: profile.boosters.rainbow - 1,
    });

    setScore((s) => s + toClearSet.size * 100);

    const refilled = applyGravityAndRefill(board, toClearSet, []);
    setBoard(refilled);

    await new Promise((r) => setTimeout(r, 250));
    await processCascades(refilled);
  };

  const triggerMagicHint = () => {
    if (profile.boosters.hint <= 0 || isBusy) return;
    const hint = findLegalMove(board);
    if (!hint) return;

    sound.playCoin();
    onUpdateBoosters({
      ...profile.boosters,
      hint: profile.boosters.hint - 1,
    });

    // Highlight hint gems
    setBoard((prev) =>
      prev.map((row, r) =>
        row.map((gem, c) => {
          const isHintGem =
            (r === hint.gem1.row && c === hint.gem1.col) ||
            (r === hint.gem2.row && c === hint.gem2.col);
          return isHintGem ? { ...gem, isHint: true } : gem;
        })
      )
    );

    setTimeout(() => {
      setBoard((prev) =>
        prev.map((row) => row.map((gem) => ({ ...gem, isHint: false })))
      );
    }, 2800);
  };

  const triggerMysticShuffle = () => {
    if (profile.boosters.shuffle <= 0 || isBusy) return;
    sound.playExplosion();

    onUpdateBoosters({
      ...profile.boosters,
      shuffle: profile.boosters.shuffle - 1,
    });

    setShuffleToast(true);
    setTimeout(() => {
      const reshuffled = shuffleBoard(board);
      setBoard(reshuffled);
      setShuffleToast(false);
    }, 500);
  };

  // Cell click handler
  const handleCellClick = (r: number, c: number) => {
    if (isBusy || hasFinishedRef.current) return;

    if (activeBooster === 'hammer') {
      useShutterHammer(r, c);
      return;
    }

    if (activeBooster === 'rainbow') {
      useRainbowBlast(board[r][c].type);
      return;
    }

    if (!selectedGem) {
      sound.playClick();
      setSelectedGem({ row: r, col: c });
    } else {
      if (selectedGem.row === r && selectedGem.col === c) {
        setSelectedGem(null);
      } else {
        handleSwap(selectedGem.row, selectedGem.col, r, c);
      }
    }
  };

  // Pointer drag for swipe
  const handlePointerDown = (e: React.PointerEvent, row: number, col: number) => {
    if (isBusy || hasFinishedRef.current || activeBooster) return;
    dragStartPos.current = { x: e.clientX, y: e.clientY, row, col };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartPos.current || isBusy || hasFinishedRef.current) {
      dragStartPos.current = null;
      return;
    }

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 22; // px

    if (absX > threshold || absY > threshold) {
      const { row, col } = dragStartPos.current;
      let targetRow = row;
      let targetCol = col;

      if (absX > absY) {
        targetCol = dx > 0 ? col + 1 : col - 1;
      } else {
        targetRow = dy > 0 ? row + 1 : row - 1;
      }

      if (targetRow >= 0 && targetRow < GRID_ROWS && targetCol >= 0 && targetCol < GRID_COLS) {
        handleSwap(row, col, targetRow, targetCol);
      }
    }

    dragStartPos.current = null;
  };

  // Format timer string: MM:SS (e.g. 03:59)
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage towards 3-star score
  const maxScoreTarget = level.starScores[2];
  const progressPct = Math.min(100, Math.floor((score / maxScoreTarget) * 100));

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between pb-3 px-2 max-w-md mx-auto select-none relative">
      {/* Top Bar: Level, Target, Timer, Moves, Pause */}
      <div className="w-full bg-[#1b0a2e]/95 border border-purple-500/25 rounded-2xl p-2.5 shadow-xl mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-500/20 text-amber-300 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40">
              Stage {level.id}
            </span>
            <span className="text-xs font-semibold text-purple-200 truncate max-w-[140px]">
              {level.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 03:59 Countdown Timer */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                timeLeft < 30
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 animate-pulse'
                  : 'bg-purple-950/60 text-purple-200 border border-purple-500/30'
              }`}
              title="Time Remaining"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            {/* Pause Button */}
            <button
              onClick={() => {
                sound.playClick();
                onPause();
              }}
              className="p-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/20 active:scale-95 transition-transform"
              title="Pause Game"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score & Star Tier Progress Bar */}
        <div className="relative w-full bg-[#10061e] h-4 rounded-full overflow-hidden border border-purple-500/30 flex items-center mb-1.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />

          {/* Star Milestone Indicators */}
          {[1, 2, 3].map((starIndex) => {
            const milestoneScore = level.starScores[starIndex - 1];
            const leftPct = (milestoneScore / maxScoreTarget) * 100;
            const isEarned = score >= milestoneScore;
            return (
              <div
                key={starIndex}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                style={{ left: `${leftPct}%` }}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    isEarned
                      ? 'bg-amber-400 text-purple-950 shadow-[0_0_8px_#f59e0b]'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-600'
                  }`}
                >
                  <Award className="w-2.5 h-2.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Score & Moves counters */}
        <div className="flex items-center justify-between text-xs font-bold px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Score:</span>
            <span className="text-amber-300 font-mono text-sm tracking-wide">
              {score.toLocaleString()}
            </span>
            <span className="text-zinc-500 text-[10px]">/ {level.targetScore.toLocaleString()}</span>
          </div>

          {/* Optional Gem Collection Goal */}
          {level.gemTarget && (
            <div className="flex items-center gap-1 bg-purple-900/30 px-2 py-0.5 rounded-md border border-purple-500/20">
              <GemIcon type={level.gemTarget.type} className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono text-purple-200">
                {gemsCollected}/{level.gemTarget.count}
              </span>
            </div>
          )}

          {/* Moves Left */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-mono text-sm">{movesLeft}</span>
            <span className="text-zinc-400 text-[10px]">moves</span>
          </div>
        </div>
      </div>

      {/* Main 8x8 Board Container */}
      <div className="relative w-full aspect-square max-w-[390px] p-2 rounded-2xl bg-[#150727]/90 border border-purple-500/30 shadow-2xl flex items-center justify-center">
        {/* Dynamic Board Cells Grid */}
        <div className={`grid grid-cols-8 grid-rows-8 gap-1 w-full h-full p-1.5 rounded-xl ${themeConfig.boardBg}`}>
          {board.map((row, r) =>
            row.map((gem, c) => {
              const isSelected = selectedGem?.row === r && selectedGem?.col === c;
              return (
                <div
                  key={gem.id}
                  onClick={() => handleCellClick(r, c)}
                  onPointerDown={(e) => handlePointerDown(e, r, c)}
                  onPointerUp={handlePointerUp}
                  className={`relative aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 border ${
                    themeConfig.cellBg
                  } ${themeConfig.cellBorder} ${
                    isSelected
                      ? 'ring-2 ring-amber-300 ring-offset-1 ring-offset-purple-950 scale-105 z-20 shadow-[0_0_12px_#f59e0b]'
                      : ''
                  } ${gem.isHint ? 'animate-hint-pulse ring-2 ring-yellow-400 z-10' : ''} ${
                    gem.isMatched ? 'animate-gem-pop' : 'animate-gem-spawn'
                  }`}
                >
                  <GemIcon type={gem.type} special={gem.special} className="w-4/5 h-4/5" />
                </div>
              );
            })
          )}
        </div>

        {/* Combo Multiplier Banner Overlay */}
        {comboBanner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white font-black text-lg px-4 py-2 rounded-full shadow-[0_0_24px_rgba(244,63,94,0.9)] animate-bounce border border-amber-300">
              {comboBanner}
            </div>
          </div>
        )}

        {/* Auto-Shuffle Toast */}
        {shuffleToast && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm rounded-2xl z-40">
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <Shuffle className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="font-extrabold text-base text-amber-300">No Moves Remaining!</p>
              <p className="text-xs text-purple-200">Shuffling jewels for free...</p>
            </div>
          </div>
        )}

        {/* Active Booster Prompt Indicator */}
        {activeBooster && (
          <div className="absolute -top-3 inset-x-4 bg-amber-500 text-purple-950 font-bold text-xs py-1 px-3 rounded-full shadow-lg flex items-center justify-between z-30 animate-pulse">
            <span>
              {activeBooster === 'hammer'
                ? 'Tap any jewel to smash!'
                : 'Tap jewel color to clear!'}
            </span>
            <button
              onClick={() => setActiveBooster(null)}
              className="ml-2 font-black text-rose-900 bg-amber-200 px-1.5 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Boosters Bar */}
      <div className="w-full bg-[#1b0a2e]/90 border border-purple-500/20 rounded-xl p-2 mt-2 shadow-lg">
        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center justify-between px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Magical Boosters
          </span>
          <span className="text-zinc-400 lowercase">tap to activate</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Shutter Hammer */}
          <button
            onClick={() => {
              if (profile.boosters.hammer > 0) {
                sound.playClick();
                setActiveBooster(activeBooster === 'hammer' ? null : 'hammer');
              }
            }}
            disabled={profile.boosters.hammer <= 0 || isBusy}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all active:scale-95 ${
              activeBooster === 'hammer'
                ? 'bg-amber-500 text-purple-950 border-white shadow-[0_0_10px_#f59e0b]'
                : profile.boosters.hammer > 0
                ? 'bg-purple-900/40 text-purple-100 border-purple-500/30 hover:bg-purple-800/50'
                : 'bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50'
            }`}
          >
            <Hammer className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="text-[10px] font-bold leading-tight">Hammer</span>
            <span className="text-[9px] font-mono opacity-80">x{profile.boosters.hammer}</span>
          </button>

          {/* Magic Hint */}
          <button
            onClick={triggerMagicHint}
            disabled={profile.boosters.hint <= 0 || isBusy}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all active:scale-95 ${
              profile.boosters.hint > 0
                ? 'bg-purple-900/40 text-purple-100 border-purple-500/30 hover:bg-purple-800/50'
                : 'bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50'
            }`}
          >
            <Wand2 className="w-4 h-4 mb-0.5 text-cyan-400" />
            <span className="text-[10px] font-bold leading-tight">Hint</span>
            <span className="text-[9px] font-mono opacity-80">x{profile.boosters.hint}</span>
          </button>

          {/* Mystic Shuffle */}
          <button
            onClick={triggerMysticShuffle}
            disabled={profile.boosters.shuffle <= 0 || isBusy}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all active:scale-95 ${
              profile.boosters.shuffle > 0
                ? 'bg-purple-900/40 text-purple-100 border-purple-500/30 hover:bg-purple-800/50'
                : 'bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50'
            }`}
          >
            <Shuffle className="w-4 h-4 mb-0.5 text-emerald-400" />
            <span className="text-[10px] font-bold leading-tight">Shuffle</span>
            <span className="text-[9px] font-mono opacity-80">x{profile.boosters.shuffle}</span>
          </button>

          {/* Rainbow Blast */}
          <button
            onClick={() => {
              if (profile.boosters.rainbow > 0) {
                sound.playClick();
                setActiveBooster(activeBooster === 'rainbow' ? null : 'rainbow');
              }
            }}
            disabled={profile.boosters.rainbow <= 0 || isBusy}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all active:scale-95 ${
              activeBooster === 'rainbow'
                ? 'bg-amber-500 text-purple-950 border-white shadow-[0_0_10px_#f59e0b]'
                : profile.boosters.rainbow > 0
                ? 'bg-purple-900/40 text-purple-100 border-purple-500/30 hover:bg-purple-800/50'
                : 'bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50'
            }`}
          >
            <Disc className="w-4 h-4 mb-0.5 text-rose-400 animate-rainbow" />
            <span className="text-[10px] font-bold leading-tight">Rainbow</span>
            <span className="text-[9px] font-mono opacity-80">x{profile.boosters.rainbow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
