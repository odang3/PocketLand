import {
  defaultCharacterId,
  isCharacterId,
  type CharacterId,
} from '../characters/characterData';
import type { Difficulty } from '../game/types';

export type BestScoreByDifficulty = Record<Difficulty, number>;

export type PlayerSaveData = {
  coins: number;
  ownedCharacterIds: CharacterId[];
  selectedCharacterId: CharacterId;
  bestScoreByDifficulty: BestScoreByDifficulty;
  totalPlayCount: number;
};

const STORAGE_KEY = 'pocketland.save.v1';
const MAX_COINS = 999999;
const MAX_BEST_SCORE = 100;
const MAX_TOTAL_PLAY_COUNT = 99999;

const defaultSaveData: PlayerSaveData = {
  coins: 0,
  ownedCharacterIds: [defaultCharacterId],
  selectedCharacterId: defaultCharacterId,
  bestScoreByDifficulty: {
    easy: 0,
    normal: 0,
    hard: 0,
  },
  totalPlayCount: 0,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toSafeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toClampedSafeNumber(value: unknown, fallback: number, min: number, max: number): number {
  return clampNumber(toSafeNumber(value, fallback), min, max);
}

function normalizeOwnedCharacterIds(value: unknown): CharacterId[] {
  if (!Array.isArray(value)) {
    return defaultSaveData.ownedCharacterIds;
  }

  const ids = value.filter((id): id is CharacterId => typeof id === 'string' && isCharacterId(id));
  const uniqueIds = Array.from(new Set<CharacterId>([defaultCharacterId, ...ids]));
  return uniqueIds;
}

function normalizeBestScore(value: unknown): BestScoreByDifficulty {
  const score = isRecord(value) ? value : {};

  return {
    easy: toClampedSafeNumber(score.easy, 0, 0, MAX_BEST_SCORE),
    normal: toClampedSafeNumber(score.normal, 0, 0, MAX_BEST_SCORE),
    hard: toClampedSafeNumber(score.hard, 0, 0, MAX_BEST_SCORE),
  };
}

function normalizeSaveData(value: unknown): PlayerSaveData {
  if (!isRecord(value)) {
    return defaultSaveData;
  }

  const ownedCharacterIds = normalizeOwnedCharacterIds(value.ownedCharacterIds);
  const selectedCharacterId =
    typeof value.selectedCharacterId === 'string' &&
    isCharacterId(value.selectedCharacterId) &&
    ownedCharacterIds.includes(value.selectedCharacterId)
      ? value.selectedCharacterId
      : defaultCharacterId;

  return {
    coins: toClampedSafeNumber(value.coins, defaultSaveData.coins, 0, MAX_COINS),
    ownedCharacterIds,
    selectedCharacterId,
    bestScoreByDifficulty: normalizeBestScore(value.bestScoreByDifficulty),
    totalPlayCount: toClampedSafeNumber(
      value.totalPlayCount,
      defaultSaveData.totalPlayCount,
      0,
      MAX_TOTAL_PLAY_COUNT,
    ),
  };
}

export function loadPlayerSave(): PlayerSaveData {
  try {
    const rawSave = window.localStorage.getItem(STORAGE_KEY);
    if (!rawSave) {
      return defaultSaveData;
    }

    return normalizeSaveData(JSON.parse(rawSave));
  } catch {
    return defaultSaveData;
  }
}

export function savePlayerSave(saveData: PlayerSaveData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSaveData(saveData)));
  } catch {
    // 저장소가 차단되거나 용량을 초과해도 게임 진행은 유지한다.
  }
}
