import { DIFFICULTY_SETTINGS, GRID_SIZE } from '../constants';
import type { CellType, Difficulty, EnemyState, GameState } from '../types';

function createEmptyGrid(size: number): CellType[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 'empty'));
}

function fillOwnedSquare(grid: CellType[][], centerX: number, centerY: number, radius: number) {
  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if (grid[y]?.[x] !== undefined) {
        grid[y][x] = 'owned';
      }
    }
  }
}

function createEnemiesForDifficulty(difficulty: Difficulty): EnemyState[] {
  const enemyPresets: EnemyState[] = [
    {
      id: 'enemy-1',
      position: { x: 22, y: 9 },
      velocity: { x: 1, y: 1 },
    },
    {
      id: 'enemy-2',
      position: { x: 24, y: 23 },
      velocity: { x: -1, y: 1 },
    },
    {
      id: 'enemy-3',
      position: { x: 15, y: 25 },
      velocity: { x: 1, y: -1 },
    },
  ];

  return enemyPresets.slice(0, DIFFICULTY_SETTINGS[difficulty].enemyCount);
}

export function createInitialGameState(difficulty: Difficulty = 'easy'): GameState {
  const grid = createEmptyGrid(GRID_SIZE);
  const difficultySettings = DIFFICULTY_SETTINGS[difficulty];
  const startX = 7;
  const startY = Math.floor(GRID_SIZE / 2);

  fillOwnedSquare(grid, startX, startY, 3);

  return {
    difficulty,
    status: 'playing',
    targetRatio: difficultySettings.targetRatio,
    gridSize: GRID_SIZE,
    grid,
    player: {
      position: { x: startX, y: startY },
      startPosition: { x: startX, y: startY },
      direction: 'right',
      path: [],
      lives: difficultySettings.lives,
    },
    enemies: createEnemiesForDifficulty(difficulty),
    enemyMoveProgress: 0,
  };
}

export function getOwnedRatio(grid: CellType[][]): number {
  const totalCellCount = grid.length * (grid[0]?.length ?? 0);
  if (totalCellCount === 0) {
    return 0;
  }

  const ownedCellCount = grid.flat().filter((cell) => cell === 'owned').length;
  return Math.round((ownedCellCount / totalCellCount) * 100);
}
