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
  const { coinPreview, gameState, isResultOpen, ownedRatio, playAgain, rewardResult, rotatePlayer } =
    useGameSession({
      character,
      difficulty,
      onFinishGame,
    });
  const difficultyLabel = DIFFICULTY_SETTINGS[difficulty].label;

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
          character={character}
        />

        <GameCanvas
          gameState={gameState}
          character={character}
          onRotateDirection={rotatePlayer}
        />

        <p className="game-control-hint">화면을 탭하면 방향이 바뀌어요.</p>

        <div className="action-stack">
          <button className="secondary-button" type="button" onClick={onBackHome}>
            홈으로
          </button>
        </div>
      </section>

      {isResultOpen && rewardResult ? (
        <GameResultModal rewardResult={rewardResult} onPlayAgain={playAgain} onBackHome={onBackHome} />
      ) : null}
    </main>
  );
}
