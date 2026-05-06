import type { Character, CharacterId } from './characterData';

export type CharacterGrade = 'normal' | 'rare' | 'epic';

export type CharacterPresentation = {
  displayName: string;
  emoji: string;
  grade: CharacterGrade;
  gradeLabel: string;
  role: string;
  ability: string;
  flavorText: string;
  shardGoal: number;
};

export const characterPresentation: Record<CharacterId, CharacterPresentation> = {
  ttangnyangi: {
    displayName: '땅냥이',
    emoji: '🐱',
    grade: 'normal',
    gradeLabel: '노말',
    role: '기본 친구',
    ability: '코인 보상 +5%',
    flavorText: '발자국을 콕콕 남기며 따뜻한 영지를 넓혀요.',
    shardGoal: 30,
  },
  malangjelly: {
    displayName: '말랑젤리',
    emoji: '🫧',
    grade: 'rare',
    gradeLabel: '레어',
    role: '초보 추천',
    ability: '이동 속도 -10%',
    flavorText: '말랑말랑 천천히 움직여 실수해도 여유가 있어요.',
    shardGoal: 45,
  },
  penguinkong: {
    displayName: '펭귄콩',
    emoji: '🐧',
    grade: 'epic',
    gradeLabel: '에픽',
    role: '가벼운 전략가',
    ability: '적 속도 -10%',
    flavorText: '차가운 얼음길로 방해꾼을 살짝 느리게 해요.',
    shardGoal: 60,
  },
};

export function getCharacterPresentation(character: Character): CharacterPresentation {
  return characterPresentation[character.id];
}

export function getUnlockProgress(character: Character, coins: number, isOwned: boolean): number {
  if (isOwned || character.unlockCost <= 0) {
    return 100;
  }

  return Math.min(99, Math.floor((coins / character.unlockCost) * 100));
}

export function getShardProgress(character: Character, coins: number, isOwned: boolean): number {
  const presentation = getCharacterPresentation(character);
  if (isOwned) {
    return presentation.shardGoal;
  }

  if (character.unlockCost <= 0) {
    return 0;
  }

  return Math.min(presentation.shardGoal - 1, Math.floor((coins / character.unlockCost) * presentation.shardGoal));
}
