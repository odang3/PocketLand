export type CellType = 'empty' | 'owned' | 'path';

export type Direction = 'up' | 'right' | 'down' | 'left';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type GridPosition = {
  x: number;
  y: number;
};

export type PlayerState = {
  position: GridPosition;
  direction: Direction;
  lives: number;
};

export type EnemyState = {
  id: string;
  position: GridPosition;
  direction: Direction;
};

export type GameState = {
  difficulty: Difficulty;
  targetRatio: number;
  gridSize: number;
  grid: CellType[][];
  player: PlayerState;
  enemies: EnemyState[];
};
