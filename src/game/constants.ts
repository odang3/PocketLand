import type { Difficulty } from './types';

export const GRID_SIZE = 32;
export const STARTING_LIVES = 3;

export const TARGET_RATIO_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 60,
  normal: 70,
  hard: 80,
};
