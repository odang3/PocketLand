export type CharacterId = 'ttangnyangi' | 'malangjelly' | 'penguinkong';

export type Character = {
  id: CharacterId;
  name: string;
  emoji: string;
  role: string;
  ability: string;
  territoryEffect: string;
  unlockCost: number;
  themeClass: string;
};

export const defaultCharacterId: CharacterId = 'ttangnyangi';

export const characterData: Character[] = [
  {
    id: 'ttangnyangi',
    name: '땅냥이',
    emoji: '🐱',
    role: '기본 친구',
    ability: '코인 보상 +5%',
    territoryEffect: '발바닥 무늬 땅',
    unlockCost: 0,
    themeClass: 'character-card--paw',
  },
  {
    id: 'malangjelly',
    name: '말랑젤리',
    emoji: '🍮',
    role: '초보자 추천',
    ability: '이동 속도 -10%',
    territoryEffect: '말랑한 젤리 땅',
    unlockCost: 300,
    themeClass: 'character-card--jelly',
  },
  {
    id: 'penguinkong',
    name: '펭귄콩',
    emoji: '🐧',
    role: '가벼운 전략형',
    ability: '적 속도 -10%',
    territoryEffect: '반짝이는 얼음 땅',
    unlockCost: 500,
    themeClass: 'character-card--ice',
  },
];

export function isCharacterId(value: string): value is CharacterId {
  return characterData.some((character) => character.id === value);
}
