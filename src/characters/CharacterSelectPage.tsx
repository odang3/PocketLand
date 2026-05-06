import { CharacterCard } from './CharacterCard';
import { characterData, type Character, type CharacterId } from './characterData';
import {
  getCharacterPresentation,
  getUnlockProgress,
} from './characterPresentation';

type CharacterSelectPageProps = {
  mode: 'play' | 'collection';
  coins: number;
  ownedCharacterIds: CharacterId[];
  selectedCharacterId: CharacterId;
  onBack: () => void;
  onSelectCharacter: (characterId: CharacterId) => void;
  onUnlockCharacter: (characterId: CharacterId) => void;
  onStartGame?: () => void;
};

function findFeaturedCharacter(ownedCharacterIds: CharacterId[], selectedCharacterId: CharacterId): Character {
  return (
    characterData.find((character) => !ownedCharacterIds.includes(character.id)) ??
    characterData.find((character) => character.id === selectedCharacterId) ??
    characterData[0]
  );
}

export function CharacterSelectPage({
  mode,
  coins,
  ownedCharacterIds,
  selectedCharacterId,
  onBack,
  onSelectCharacter,
  onUnlockCharacter,
  onStartGame,
}: CharacterSelectPageProps) {
  const isPlayMode = mode === 'play';
  const ownedCount = characterData.filter((character) => ownedCharacterIds.includes(character.id)).length;
  const featuredCharacter = findFeaturedCharacter(ownedCharacterIds, selectedCharacterId);
  const featuredPresentation = getCharacterPresentation(featuredCharacter);
  const isFeaturedOwned = ownedCharacterIds.includes(featuredCharacter.id);
  const featuredProgress = getUnlockProgress(featuredCharacter, coins, isFeaturedOwned);
  const featuredCoinProgress = Math.min(coins, featuredCharacter.unlockCost);

  return (
    <main className="app-shell app-shell--collection">
      <section className="page-screen collection-screen">
        <header className="collection-header">
          <button className="back-button collection-back-button" type="button" onClick={onBack} aria-label="뒤로가기">
            ←
          </button>
          <div>
            <p className="eyebrow">{isPlayMode ? '출발 준비' : '수집 현황'}</p>
            <h1>{isPlayMode ? '친구 선택' : '캐릭터 도감'}</h1>
          </div>
          <div className="collection-coin-hud" aria-label="보유 코인">
            <span aria-hidden="true">🪙</span>
            <strong>{coins.toLocaleString('ko-KR')}</strong>
          </div>
        </header>

        <section className={`featured-character featured-character--${featuredPresentation.grade}`}>
          <div className="featured-character__copy">
            <span className={`grade-badge grade-badge--${featuredPresentation.grade}`}>
              {featuredPresentation.gradeLabel}
            </span>
            <h2>{featuredPresentation.displayName}</h2>
            <p>{featuredPresentation.flavorText}</p>
          </div>

          <div className="featured-character__avatar" aria-hidden="true">
            <span>{featuredPresentation.emoji}</span>
          </div>

          <dl className="featured-stats">
            <div>
              <dt>능력</dt>
              <dd>{featuredPresentation.ability}</dd>
            </div>
            <div>
              <dt>{isFeaturedOwned ? '상태' : '해금 비용'}</dt>
              <dd>{isFeaturedOwned ? '보유 중' : `${featuredCharacter.unlockCost} 코인`}</dd>
            </div>
          </dl>

          <div className="featured-progress">
            <div>
              <span style={{ width: `${featuredProgress}%` }} />
            </div>
            <p>
              {isFeaturedOwned ? '선택 가능한 친구예요' : `${featuredCoinProgress}/${featuredCharacter.unlockCost} 코인`}
            </p>
          </div>
        </section>

        <div className="collection-status-panel" aria-label="수집 현황">
          <div>
            <span>수집</span>
            <strong>
              {ownedCount}/{characterData.length}
            </strong>
          </div>
          <div className="collection-progress-bar" aria-hidden="true">
            <span style={{ width: `${(ownedCount / characterData.length) * 100}%` }} />
          </div>
        </div>

        <div className="character-list collection-grid">
          {characterData.map((character) => {
            const isOwned = ownedCharacterIds.includes(character.id);

            return (
              <CharacterCard
                key={character.id}
                character={character}
                coins={coins}
                isOwned={isOwned}
                isSelected={character.id === selectedCharacterId}
                canUnlock={!isOwned && coins >= character.unlockCost}
                mode={mode}
                onSelectCharacter={onSelectCharacter}
                onUnlockCharacter={onUnlockCharacter}
              />
            );
          })}
        </div>

        {isPlayMode ? (
          <button className="primary-button sticky-action collection-start-button" type="button" onClick={onStartGame}>
            선택한 친구로 시작
          </button>
        ) : null}
      </section>
    </main>
  );
}
