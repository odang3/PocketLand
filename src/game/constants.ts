import type { Difficulty } from './types';

export const GRID_SIZE = 32;
export const MALANGJELLY_PLAYER_SPEED_MULTIPLIER = 0.9;
export const PENGUINKONG_ENEMY_SPEED_MULTIPLIER = 0.9;

export type DifficultySettings = {
  label: string;
  description: string;
  targetRatio: number;
  lives: number;
  enemyCount: number;
  playerTickMs: number;
  enemySpeedMultiplier: number;
};

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard'];

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    label: '쉬움',
    description: '처음 시작하기 좋아요',
    targetRatio: 60,
    lives: 3,
    enemyCount: 1,
    playerTickMs: 260,
    enemySpeedMultiplier: 0.45,
  },
  normal: {
    label: '보통',
    description: '가볍게 한 판 즐기기 좋아요',
    targetRatio: 70,
    lives: 3,
    enemyCount: 2,
    playerTickMs: 220,
    enemySpeedMultiplier: 0.68,
  },
  hard: {
    label: '어려움',
    description: '짧고 빠른 도전을 원할 때',
    targetRatio: 80,
    lives: 2,
    enemyCount: 3,
    playerTickMs: 190,
    enemySpeedMultiplier: 0.95,
  },
};
