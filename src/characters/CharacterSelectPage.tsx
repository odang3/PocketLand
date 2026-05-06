import { CharacterCard } from './CharacterCard';
import { characterData, type CharacterId } from './characterData';

type CharacterSelectPageProps = {
  mode: 'play' | 'collection';
  coins: number;
  ownedCharacterIds: CharacterId[];
  selectedCharacterId: CharacterId;
  onBack: () => void;
  onGrantDebugCoins: () => void;
  onSelectCharacter: (characterId: CharacterId) => void;
  onUnlockCharacter: (characterId: CharacterId) => void;
  onStartGame?: () => void;
};

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
  const selectedCharacterName =
    characterData.find((character) => character.id === selectedCharacterId)?.name ?? '땅냥이';

  return (
    <main className="app-shell">
      <section className="page-screen">
        <header className="page-header">
          <button className="back-button" type="button" onClick={onBack} aria-label="홈으로 돌아가기">
            ←
          </button>
          <div>
            <p className="eyebrow">{isPlayMode ? '출발 준비' : '수집 현황'}</p>
            <h1>{isPlayMode ? '친구 선택' : '캐릭터 도감'}</h1>
          </div>
        </header>

        <div className="collection-summary">
          <div>
            <span>보유 코인</span>
            <strong>{coins.toLocaleString('ko-KR')}</strong>
          </div>
          <div>
            <span>선택한 친구</span>
            <strong>{selectedCharacterName}</strong>
          </div>
        </div>

        <p className="page-description">
          {isPlayMode
            ? '함께 땅을 넓힐 친구를 고르고 한 판을 시작해요.'
            : '모은 친구와 아직 해금할 친구를 확인해요.'}
        </p>

        <div className="character-list">
          {characterData.map((character) => {
            const isOwned = ownedCharacterIds.includes(character.id);

            return (
              <CharacterCard
                key={character.id}
                character={character}
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

        <button className="debug-coin-button" type="button" onClick={onGrantDebugCoins}>
          개발용 +100 코인
        </button>

        {isPlayMode ? (
          <button className="primary-button sticky-action" type="button" onClick={onStartGame}>
            선택한 친구로 시작
          </button>
        ) : null}
      </section>
    </main>
  );
}
