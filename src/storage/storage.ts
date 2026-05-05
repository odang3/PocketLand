import {
  defaultCharacterId,
  isCharacterId,
  type CharacterId,
} from '../characters/characterData';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type BestScoreByDifficulty = Record<Difficulty, number>;

export type PlayerSaveData = {
  coins: number;
  ownedCharacterIds: CharacterId[];
  selectedCharacterId: CharacterId;
  bestScoreByDifficulty: BestScoreByDifficulty;
  totalPlayCount: number;
};

const STORAGE_KEY = 'pocketland.save.v1';

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
    easy: toSafeNumber(score.easy, 0),
    normal: toSafeNumber(score.normal, 0),
    hard: toSafeNumber(score.hard, 0),
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
    coins: toSafeNumber(value.coins, defaultSaveData.coins),
    ownedCharacterIds,
    selectedCharacterId,
    bestScoreByDifficulty: normalizeBestScore(value.bestScoreByDifficulty),
    totalPlayCount: toSafeNumber(value.totalPlayCount, defaultSaveData.totalPlayCount),
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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSaveData(saveData)));
}
