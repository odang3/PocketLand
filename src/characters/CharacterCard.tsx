import type { Character, CharacterId } from './characterData';

type CharacterCardProps = {
  character: Character;
  isOwned: boolean;
  isSelected: boolean;
  canUnlock: boolean;
  mode: 'play' | 'collection';
  onSelectCharacter: (characterId: CharacterId) => void;
  onUnlockCharacter: (characterId: CharacterId) => void;
};

export function CharacterCard({
  character,
  isOwned,
  isSelected,
  canUnlock,
  mode,
  onSelectCharacter,
  onUnlockCharacter,
}: CharacterCardProps) {
  const stateLabel = isSelected ? '선택됨' : isOwned ? '보유 중' : '잠김';
  const unlockText =
    character.unlockCost === 0 ? '처음부터 함께해요' : `${character.unlockCost} 코인으로 해금`;
  const actionLabel = isOwned
    ? isSelected
      ? '선택됨'
      : '선택하기'
    : canUnlock
      ? '해금하기'
      : '코인이 부족해요';

  return (
    <article
      className={`character-card ${character.themeClass} ${isSelected ? 'is-selected' : ''} ${
        !isOwned ? 'is-locked' : ''
      }`}
    >
      <div className="character-card__top">
        <div className="character-avatar" aria-hidden="true">
          {character.emoji}
        </div>
        <div>
          <p className="eyebrow">{character.role}</p>
          <h2>{character.name}</h2>
        </div>
        <span className={isOwned ? 'state-pill state-pill--owned' : 'state-pill'}>
          {stateLabel}
        </span>
      </div>

      <dl className="character-details">
        <div>
          <dt>능력</dt>
          <dd>{character.ability}</dd>
        </div>
        <div>
          <dt>땅 효과</dt>
          <dd>{character.territoryEffect}</dd>
        </div>
        <div>
          <dt>해금</dt>
          <dd>{unlockText}</dd>
        </div>
      </dl>

      {!isOwned && !canUnlock ? (
        <p className="card-message">코인이 부족해요. 조금만 더 모아볼까요?</p>
      ) : null}

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
