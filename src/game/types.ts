export type CellType = 'empty' | 'owned' | 'path';

export type Direction = 'up' | 'right' | 'down' | 'left';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type GameStatus = 'playing' | 'clear' | 'gameOver';

export type GridPosition = {
  x: number;
  y: number;
};

export type PlayerState = {
  position: GridPosition;
  startPosition: GridPosition;
  direction: Direction;
  path: GridPosition[];
  lives: number;
};

export type EnemyState = {
  id: string;
  position: GridPosition;
  velocity: GridPosition;
};

export type GameState = {
  difficulty: Difficulty;
  status: GameStatus;
  targetRatio: number;
  gridSize: number;
  grid: CellType[][];
  player: PlayerState;
  enemies: EnemyState[];
  enemyMoveProgress: number;
};
