import type { Character, CharacterId } from './characterData';
import {
  getCharacterPresentation,
  getShardProgress,
  getUnlockProgress,
} from './characterPresentation';

type CharacterCardProps = {
  character: Character;
  coins: number;
  isOwned: boolean;
  isSelected: boolean;
  canUnlock: boolean;
  mode: 'play' | 'collection';
  onSelectCharacter: (characterId: CharacterId) => void;
  onUnlockCharacter: (characterId: CharacterId) => void;
};

export function CharacterCard({
  character,
  coins,
  isOwned,
  isSelected,
  canUnlock,
  mode,
  onSelectCharacter,
  onUnlockCharacter,
}: CharacterCardProps) {
  const presentation = getCharacterPresentation(character);
  const unlockProgress = getUnlockProgress(character, coins, isOwned);
  const shardProgress = getShardProgress(character, coins, isOwned);
  const stateLabel = isSelected ? '선택됨' : isOwned ? '보유' : '잠김';
  const actionLabel = isOwned
    ? isSelected
      ? '선택됨'
      : '선택하기'
    : canUnlock
      ? '해금하기'
      : '코인 부족';

  return (
    <article
      className={`character-card collection-card collection-card--${presentation.grade} ${character.themeClass} ${
        isSelected ? 'is-selected' : ''
      } ${!isOwned ? 'is-locked' : ''}`}
    >
      <div className="collection-card__top">
        <span className={`grade-badge grade-badge--${presentation.grade}`}>{presentation.gradeLabel}</span>
        <span className={isOwned ? 'state-pill state-pill--owned' : 'state-pill state-pill--locked'}>
          {stateLabel}
        </span>
      </div>

      <div className="collection-card__avatar" aria-hidden="true">
        <span>{presentation.emoji}</span>
        {!isOwned ? <strong>🔒</strong> : null}
      </div>

      <div className="collection-card__body">
        <p>{presentation.role}</p>
        <h2>{presentation.displayName}</h2>
        <dl>
          <div>
            <dt>능력</dt>
            <dd>{presentation.ability}</dd>
          </div>
        </dl>
      </div>

      <div className="unlock-progress" aria-label={`${presentation.displayName} 해금 진행률 ${unlockProgress}%`}>
        <div>
          <span style={{ width: `${unlockProgress}%` }} />
        </div>
        <p>
          {isOwned
            ? '해금 완료'
            : `${shardProgress}/${getCharacterPresentation(character).shardGoal} 조각 · ${character.unlockCost} 코인`}
        </p>
      </div>

      <button
        className={isOwned || canUnlock ? 'small-primary-button' : 'small-disabled-button'}
        type="button"
        disabled={isSelected || (!isOwned && !canUnlock)}
        onClick={() => {
          if (isOwned) {
            onSelectCharacter(character.id);
            return;
          }

          onUnlockCharacter(character.id);
        }}
      >
        {mode === 'collection' && !isOwned && canUnlock ? '도감에 추가하기' : actionLabel}
      </button>
    </article>
  );
}
