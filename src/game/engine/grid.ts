import { GRID_SIZE, STARTING_LIVES, TARGET_RATIO_BY_DIFFICULTY } from '../constants';
import type { CellType, Difficulty, GameState } from '../types';

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

function addPreviewPath(grid: CellType[][], startX: number, startY: number) {
  for (let x = startX + 4; x <= startX + 9; x += 1) {
    if (grid[startY]?.[x] !== undefined) {
      grid[startY][x] = 'path';
    }
  }
}

export function createInitialGameState(difficulty: Difficulty = 'easy'): GameState {
  const grid = createEmptyGrid(GRID_SIZE);
  const startX = 7;
  const startY = Math.floor(GRID_SIZE / 2);

  fillOwnedSquare(grid, startX, startY, 3);
  addPreviewPath(grid, startX, startY);

  return {
    difficulty,
    targetRatio: TARGET_RATIO_BY_DIFFICULTY[difficulty],
    gridSize: GRID_SIZE,
    grid,
    player: {
      position: { x: startX, y: startY },
      direction: 'right',
      lives: STARTING_LIVES,
    },
    enemies: [
      {
        id: 'enemy-1',
        position: { x: 22, y: 9 },
        direction: 'down',
      },
      {
        id: 'enemy-2',
        position: { x: 24, y: 23 },
        direction: 'left',
      },
    ],
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
