import { CharacterCard } from './CharacterCard';
import { characterData, type Character, type CharacterId } from './characterData';
import {
  getCharacterPresentation,
  getShardProgress,
  getUnlockProgress,
} from './characterPresentation';

type CharacterSelectPageProps = {
  mode: 'play' | 'collection';
  coins: number;
  ownedCharacterIds: CharacterId[];
  selectedCharacterId: CharacterId;
  onBack: () => void;
  onGrantDebugCoins?: () => void;
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
  onGrantDebugCoins,
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
  const featuredShardProgress = getShardProgress(featuredCharacter, coins, isFeaturedOwned);

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
              조각 진행률 {featuredShardProgress}/{featuredPresentation.shardGoal}
            </p>
          </div>
        </section>

        <div className="collection-status-panel" aria-label="수집 현황">
          <div>
            <span>수집 현황</span>
            <strong>
              {ownedCount}/{characterData.length}
            </strong>
          </div>
          <p>모두 모으면 보너스 코인 보상이 열려요</p>
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

        {onGrantDebugCoins ? (
          <button className="debug-coin-button" type="button" onClick={onGrantDebugCoins}>
            개발용 +100 코인
          </button>
        ) : null}

        {isPlayMode ? (
          <button className="primary-button sticky-action collection-start-button" type="button" onClick={onStartGame}>
            선택한 친구로 시작
          </button>
        ) : null}
      </section>
    </main>
  );
}
