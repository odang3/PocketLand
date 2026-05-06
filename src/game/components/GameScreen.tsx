import type { Character } from '../../characters/characterData';
import { DIFFICULTY_SETTINGS } from '../constants';
import type { GameRewardResult, GameSessionResultInput } from '../engine/rewards';
import { useGameSession } from '../hooks/useGameSession';
import type { Difficulty } from '../types';
import { GameCanvas } from './GameCanvas';
import { GameHud } from './GameHud';
import { GameResultModal } from './GameResultModal';

type GameScreenProps = {
  character: Character;
  difficulty: Difficulty;
  onFinishGame: (resultInput: GameSessionResultInput) => GameRewardResult;
  onBackHome: () => void;
};

export function GameScreen({ character, difficulty, onFinishGame, onBackHome }: GameScreenProps) {
  const { captureFeedback, coinPreview, gameState, isResultOpen, ownedRatio, playAgain, rewardResult, rotatePlayer } =
    useGameSession({
      character,
      difficulty,
      onFinishGame,
    });
  const difficultyLabel = DIFFICULTY_SETTINGS[difficulty].label;

  return (
    <main className="app-shell app-shell--game">
      <section className="page-screen game-screen game-play-screen">
        <header className="game-header game-header--premium">
          <button className="back-button game-home-button" type="button" onClick={onBackHome} aria-label="홈으로 돌아가기">
            ←
          </button>
          <div className="current-character current-character--premium">
            <span aria-hidden="true">{character.emoji}</span>
            <div>
              <p className="eyebrow">{difficultyLabel} 모드</p>
              <strong>{character.name}</strong>
            </div>
          </div>
        </header>

        <GameHud
          ownedRatio={ownedRatio}
          targetRatio={gameState.targetRatio}
          lives={gameState.player.lives}
          coinPreview={coinPreview}
        />

        <div className="game-board-stage">
          {captureFeedback ? (
            <div className="capture-feedback" key={captureFeedback.id} aria-live="polite">
              <span>✨ 영지 확장!</span>
              <strong>
                +{captureFeedback.gainedRatio}% · +{captureFeedback.gainedCoins} 코인
              </strong>
            </div>
          ) : null}

          <GameCanvas
            gameState={gameState}
            character={character}
            onRotateDirection={rotatePlayer}
          />
        </div>

        <div className="game-bottom-controls">
          <p className="game-control-hint">
            <span aria-hidden="true">👆</span>
            화면을 탭하면 방향이 바뀌어요
          </p>

          <button className="skill-button" type="button" aria-label="스킬 준비중" disabled>
            <span className="skill-button__badge">3</span>
            <span aria-hidden="true">⚡</span>
          </button>
        </div>
      </section>

      {isResultOpen && rewardResult ? (
        <GameResultModal rewardResult={rewardResult} onPlayAgain={playAgain} onBackHome={onBackHome} />
      ) : null}
    </main>
  );
}
