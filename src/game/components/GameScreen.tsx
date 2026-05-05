import { useMemo, useState } from 'react';
import type { Character } from '../../characters/characterData';
import { createInitialGameState, getOwnedRatio } from '../engine/grid';
import { GameCanvas } from './GameCanvas';
import { GameHud } from './GameHud';
import { GameResultModal } from './GameResultModal';

type GameScreenProps = {
  character: Character;
  onBackHome: () => void;
  onRestart: () => void;
};

export function GameScreen({ character, onBackHome, onRestart }: GameScreenProps) {
  const [isResultOpen, setIsResultOpen] = useState(false);
  const gameState = useMemo(() => createInitialGameState('easy'), []);
  const ownedRatio = useMemo(() => getOwnedRatio(gameState.grid), [gameState.grid]);

  return (
    <main className="app-shell">
      <section className="page-screen game-screen">
        <header className="game-header">
          <button className="back-button" type="button" onClick={onBackHome} aria-label="홈으로 돌아가기">
            ←
          </button>
          <div className="current-character">
            <span aria-hidden="true">{character.emoji}</span>
            <div>
              <p className="eyebrow">선택한 친구</p>
              <strong>{character.name}</strong>
            </div>
          </div>
        </header>

        <GameHud
          ownedRatio={ownedRatio}
          targetRatio={gameState.targetRatio}
          lives={gameState.player.lives}
          character={character}
        />

        <GameCanvas gameState={gameState} character={character} />

        <p className="page-description">
          아직 조작과 점령 판정은 연결하지 않았어요. 현재 보드는 32x32 그리드와 시작 소유 영역을
          보여주는 캔버스 뼈대예요.
        </p>

        <div className="action-stack">
          <button className="primary-button" type="button" onClick={() => setIsResultOpen(true)}>
            결과 모달 보기
          </button>
          <button className="secondary-button" type="button" onClick={onRestart}>
            캐릭터 다시 고르기
          </button>
        </div>
      </section>

      {isResultOpen ? <GameResultModal onRestart={onRestart} onBackHome={onBackHome} /> : null}
    </main>
  );
}
