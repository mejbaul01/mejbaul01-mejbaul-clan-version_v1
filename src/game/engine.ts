import { Gem, GemType, SpecialType } from '../types';

export const GRID_ROWS = 8;
export const GRID_COLS = 8;

export const GEM_TYPES: GemType[] = [
  'ruby',
  'amethyst',
  'sapphire',
  'emerald',
  'topaz',
  'quartz',
];

let nextGemId = 1;

export function createGem(
  type: GemType,
  row: number,
  col: number,
  special: SpecialType = 'none'
): Gem {
  return {
    id: `gem_${nextGemId++}_${Date.now()}`,
    type,
    special,
    row,
    col,
  };
}

export function getRandomGemType(): GemType {
  const idx = Math.floor(Math.random() * GEM_TYPES.length);
  return GEM_TYPES[idx];
}

// Check if a cell would create an immediate match of 3 during generation
function causesMatchAt(
  board: (Gem | null)[][],
  type: GemType,
  r: number,
  c: number
): boolean {
  // Horizontal check
  if (
    c >= 2 &&
    board[r][c - 1]?.type === type &&
    board[r][c - 2]?.type === type
  ) {
    return true;
  }
  // Vertical check
  if (
    r >= 2 &&
    board[r - 1][c]?.type === type &&
    board[r - 2][c]?.type === type
  ) {
    return true;
  }
  return false;
}

// Generate initial 8x8 board with NO initial 3-matches, and guaranteed legal move
export function generateInitialBoard(): Gem[][] {
  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const board: (Gem | null)[][] = Array.from({ length: GRID_ROWS }, () =>
      Array(GRID_COLS).fill(null)
    );

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        // Pick gem that doesn't cause match-3
        const candidates = [...GEM_TYPES].sort(() => Math.random() - 0.5);
        let chosen: GemType = candidates[0];

        for (const candidate of candidates) {
          if (!causesMatchAt(board, candidate, r, c)) {
            chosen = candidate;
            break;
          }
        }
        board[r][c] = createGem(chosen, r, c);
      }
    }

    const fullBoard = board as Gem[][];
    const hint = findLegalMove(fullBoard);
    if (hint) {
      return fullBoard;
    }
  }

  // Fallback: create deterministic valid board
  const fallback: Gem[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    const row: Gem[] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      const type = GEM_TYPES[(r + c * 2) % GEM_TYPES.length];
      row.push(createGem(type, r, c));
    }
    fallback.push(row);
  }
  return fallback;
}

export interface MatchResult {
  matchedGems: Gem[];
  specialSpawns: { gem: Gem; special: SpecialType }[];
}

// Find all matches on board and detect 4-line, 5-line, or L/T shapes
export function findMatches(board: Gem[][]): MatchResult {
  const horizontalMatches: Gem[][] = [];
  const verticalMatches: Gem[][] = [];

  // Horizontal scan
  for (let r = 0; r < GRID_ROWS; r++) {
    let matchGroup: Gem[] = [board[r][0]];
    for (let c = 1; c < GRID_COLS; c++) {
      if (board[r][c].type === matchGroup[0].type) {
        matchGroup.push(board[r][c]);
      } else {
        if (matchGroup.length >= 3) {
          horizontalMatches.push([...matchGroup]);
        }
        matchGroup = [board[r][c]];
      }
    }
    if (matchGroup.length >= 3) {
      horizontalMatches.push([...matchGroup]);
    }
  }

  // Vertical scan
  for (let c = 0; c < GRID_COLS; c++) {
    let matchGroup: Gem[] = [board[0][c]];
    for (let r = 1; r < GRID_ROWS; r++) {
      if (board[r][c].type === matchGroup[0].type) {
        matchGroup.push(board[r][c]);
      } else {
        if (matchGroup.length >= 3) {
          verticalMatches.push([...matchGroup]);
        }
        matchGroup = [board[r][c]];
      }
    }
    if (matchGroup.length >= 3) {
      verticalMatches.push([...matchGroup]);
    }
  }

  const matchedSet = new Set<string>();
  const allMatchedGems: Gem[] = [];
  const specialSpawns: { gem: Gem; special: SpecialType }[] = [];

  // Detect 5-in-a-line (Rainbow) & 4-in-a-line (Striped)
  horizontalMatches.forEach((group) => {
    group.forEach((gem) => {
      if (!matchedSet.has(gem.id)) {
        matchedSet.add(gem.id);
        allMatchedGems.push(gem);
      }
    });

    if (group.length >= 5) {
      const mid = group[Math.floor(group.length / 2)];
      specialSpawns.push({ gem: mid, special: 'rainbow' });
    } else if (group.length === 4) {
      const mid = group[1];
      specialSpawns.push({ gem: mid, special: 'striped_h' });
    }
  });

  verticalMatches.forEach((group) => {
    group.forEach((gem) => {
      if (!matchedSet.has(gem.id)) {
        matchedSet.add(gem.id);
        allMatchedGems.push(gem);
      }
    });

    if (group.length >= 5) {
      const mid = group[Math.floor(group.length / 2)];
      if (!specialSpawns.some((s) => s.gem.id === mid.id)) {
        specialSpawns.push({ gem: mid, special: 'rainbow' });
      }
    } else if (group.length === 4) {
      const mid = group[1];
      if (!specialSpawns.some((s) => s.gem.id === mid.id)) {
        specialSpawns.push({ gem: mid, special: 'striped_v' });
      }
    }
  });

  // Detect T or L shapes (intersecting horizontal & vertical matches)
  for (const hGroup of horizontalMatches) {
    for (const vGroup of verticalMatches) {
      const intersection = hGroup.find((hg) => vGroup.some((vg) => vg.id === hg.id));
      if (intersection && hGroup.length >= 3 && vGroup.length >= 3) {
        if (!specialSpawns.some((s) => s.gem.id === intersection.id)) {
          specialSpawns.push({ gem: intersection, special: 'bomb' });
        }
      }
    }
  }

  return {
    matchedGems: allMatchedGems,
    specialSpawns,
  };
}

// Expand matched gems according to specials (striped, bomb, rainbow)
export function expandSpecialExplosions(
  board: Gem[][],
  initialMatched: Gem[],
  rainbowTargetType?: GemType
): Gem[] {
  const toClearSet = new Set<string>();
  const toClearList: Gem[] = [];

  const addGem = (gem: Gem) => {
    if (!toClearSet.has(gem.id)) {
      toClearSet.add(gem.id);
      toClearList.push(gem);
    }
  };

  initialMatched.forEach((g) => addGem(g));

  let changed = true;
  while (changed) {
    changed = false;
    const currentList = [...toClearList];

    for (const gem of currentList) {
      // Striped Horizontal: clears entire row
      if (gem.special === 'striped_h') {
        for (let c = 0; c < GRID_COLS; c++) {
          const target = board[gem.row][c];
          if (!toClearSet.has(target.id)) {
            addGem(target);
            changed = true;
          }
        }
      }
      // Striped Vertical: clears entire column
      if (gem.special === 'striped_v') {
        for (let r = 0; r < GRID_ROWS; r++) {
          const target = board[r][gem.col];
          if (!toClearSet.has(target.id)) {
            addGem(target);
            changed = true;
          }
        }
      }
      // Bomb: clears 3x3 surrounding radius
      if (gem.special === 'bomb') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = gem.row + dr;
            const nc = gem.col + dc;
            if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
              const target = board[nr][nc];
              if (!toClearSet.has(target.id)) {
                addGem(target);
                changed = true;
              }
            }
          }
        }
      }
      // Rainbow: clears all gems of targeted color
      if (gem.special === 'rainbow' || rainbowTargetType) {
        const typeToClear = rainbowTargetType || gem.type;
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            const target = board[r][c];
            if (target.type === typeToClear && !toClearSet.has(target.id)) {
              addGem(target);
              changed = true;
            }
          }
        }
      }
    }
  }

  return toClearList;
}

// Apply gravity and refill empty board cells
export function applyGravityAndRefill(
  board: Gem[][],
  clearedGemIds: Set<string>,
  specialSpawns: { gem: Gem; special: SpecialType }[]
): Gem[][] {
  const newBoard: (Gem | null)[][] = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS).fill(null)
  );

  // First place any special gems that were forged in the match
  const specialMap = new Map<string, SpecialType>();
  specialSpawns.forEach((s) => specialMap.set(`${s.gem.row},${s.gem.col}`, s.special));

  // Process column by column
  for (let c = 0; c < GRID_COLS; c++) {
    const survivors: Gem[] = [];
    for (let r = GRID_ROWS - 1; r >= 0; r--) {
      const gem = board[r][c];
      const coordKey = `${r},${c}`;

      if (specialMap.has(coordKey)) {
        // Spawn the forged special gem here
        const specialType = specialMap.get(coordKey)!;
        survivors.push(createGem(gem.type, 0, c, specialType));
      } else if (!clearedGemIds.has(gem.id)) {
        survivors.push(gem);
      }
    }

    // Place surviving gems from bottom up
    let writeRow = GRID_ROWS - 1;
    for (const gem of survivors) {
      newBoard[writeRow][c] = {
        ...gem,
        row: writeRow,
        col: c,
        isMatched: false,
        isHint: false,
      };
      writeRow--;
    }

    // Refill remaining slots from top
    while (writeRow >= 0) {
      const freshType = getRandomGemType();
      newBoard[writeRow][c] = createGem(freshType, writeRow, c);
      writeRow--;
    }
  }

  return newBoard as Gem[][];
}

// Test swapping two adjacent cells without mutating original board
export function testSwapValid(
  board: Gem[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  // Rainbow swap is always valid
  if (
    board[r1][c1].special === 'rainbow' ||
    board[r2][c2].special === 'rainbow'
  ) {
    return true;
  }

  // Clone board shallowly
  const clone: Gem[][] = board.map((row) => [...row]);
  const temp = clone[r1][c1];
  clone[r1][c1] = { ...clone[r2][c2], row: r1, col: c1 };
  clone[r2][c2] = { ...temp, row: r2, col: c2 };

  const { matchedGems } = findMatches(clone);
  return matchedGems.length > 0;
}

// Find a legal move on the board for the Magic Hint booster or shuffle check
export interface LegalMoveHint {
  gem1: { row: number; col: number };
  gem2: { row: number; col: number };
}

export function findLegalMove(board: Gem[][]): LegalMoveHint | null {
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      // Check right swap
      if (c + 1 < GRID_COLS) {
        if (testSwapValid(board, r, c, r, c + 1)) {
          return {
            gem1: { row: r, col: c },
            gem2: { row: r, col: c + 1 },
          };
        }
      }
      // Check down swap
      if (r + 1 < GRID_ROWS) {
        if (testSwapValid(board, r, c, r + 1, c)) {
          return {
            gem1: { row: r, col: c },
            gem2: { row: r + 1, col: c },
          };
        }
      }
    }
  }
  return null;
}

// Mystic Shuffle: Reshuffles all gems on the board until a legal move exists with no initial matches
export function shuffleBoard(board: Gem[][]): Gem[][] {
  const allGems: Gem[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      allGems.push(board[r][c]);
    }
  }

  let attempts = 0;
  while (attempts < 50) {
    attempts++;
    allGems.sort(() => Math.random() - 0.5);

    const newBoard: Gem[][] = [];
    let idx = 0;
    for (let r = 0; r < GRID_ROWS; r++) {
      const row: Gem[] = [];
      for (let c = 0; c < GRID_COLS; c++) {
        const source = allGems[idx++];
        row.push({
          ...source,
          id: `gem_${nextGemId++}_${Date.now()}`,
          row: r,
          col: c,
          isMatched: false,
          isHint: false,
        });
      }
      newBoard.push(row);
    }

    const { matchedGems } = findMatches(newBoard);
    if (matchedGems.length === 0 && findLegalMove(newBoard)) {
      return newBoard;
    }
  }

  // If reshuffling existing gems fails to find a legal board, generate a fresh layout
  return generateInitialBoard();
}
