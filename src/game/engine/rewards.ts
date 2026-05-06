import type { CharacterId } from '../../characters/characterData';
import type { Difficulty, GameStatus } from '../types';

export type GameRewardInput = {
  status: GameStatus;
  difficulty: Difficulty;
  finalOwnedRatio: number;
  selectedCharacterId: CharacterId;
  previousBestScore: number;
};

export type GameSessionResultInput = Omit<GameRewardInput, 'previousBestScore'>;

export type GameRewardResult = {
  status: GameStatus;
  difficulty: Difficulty;
  finalOwnedRatio: number;
  earnedCoins: number;
  baseCoins: number;
  clearBonus: number;
  characterBonus: number;
  previousBestScore: number;
  bestScore: number;
  isBestScoreUpdated: boolean;
};

export function calculateGameReward(input: GameRewardInput): GameRewardResult {
  const safeOwnedRatio = Math.max(0, Math.floor(input.finalOwnedRatio));
  const baseCoins = Math.floor(safeOwnedRatio * 1.2);
  const clearBonus = input.status === 'clear' ? 50 : 0;
  const subtotal = baseCoins + clearBonus;
  const characterBonus = input.selectedCharacterId === 'ttangnyangi' ? Math.floor(subtotal * 0.05) : 0;
  const bestScore = Math.max(input.previousBestScore, safeOwnedRatio);

  return {
    status: input.status,
    difficulty: input.difficulty,
    finalOwnedRatio: safeOwnedRatio,
    earnedCoins: subtotal + characterBonus,
    baseCoins,
    clearBonus,
    characterBonus,
    previousBestScore: input.previousBestScore,
    bestScore,
    isBestScoreUpdated: bestScore > input.previousBestScore,
  };
}
