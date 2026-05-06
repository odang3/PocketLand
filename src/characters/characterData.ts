export type CharacterId = 'ttangnyangi' | 'malangjelly' | 'penguinkong';

export type Character = {
  id: CharacterId;
  name: string;
  emoji: string;
  role: string;
  flavorText: string;
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
    flavorText: '발자국을 콕콕 남기며 땅을 넓혀요.',
    ability: '코인 보상 +5%',
    territoryEffect: '고양이 발자국 타일',
    unlockCost: 0,
    themeClass: 'character-card--paw',
  },
  {
    id: 'malangjelly',
    name: '말랑젤리',
    emoji: '🍮',
    role: '초보 추천',
    flavorText: '말랑말랑 천천히 움직여 실수해도 여유가 있어요.',
    ability: '이동 속도 -10%',
    territoryEffect: '젤리 반짝 타일',
    unlockCost: 300,
    themeClass: 'character-card--jelly',
  },
  {
    id: 'penguinkong',
    name: '펭귄콩',
    emoji: '🐧',
    role: '가벼운 전략형',
    flavorText: '차가운 얼음길로 방해꾼을 살짝 느리게 해요.',
    ability: '적 속도 -10%',
    territoryEffect: '얼음 결정 타일',
    unlockCost: 500,
    themeClass: 'character-card--ice',
  },
];

export function isCharacterId(value: string): value is CharacterId {
  return characterData.some((character) => character.id === value);
}
