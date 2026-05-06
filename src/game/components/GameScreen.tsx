import { useEffect, useMemo, useRef, useState } from 'react';
import type { Character } from '../../characters/characterData';
import { DIFFICULTY_SETTINGS } from '../constants';
import { moveEnemiesOneTick, resolveEnemyPathCollision } from '../engine/enemy';
import { createInitialGameState, getOwnedRatio } from '../engine/grid';
import { movePlayerOneTick, rotatePlayerClockwise } from '../engine/movement';
import type { GameRewardResult, GameSessionResultInput } from '../engine/rewards';
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
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameState, setGameState] = useState(() => createInitialGameState(difficulty));
  const [rewardResult, setRewardResult] = useState<GameRewardResult | null>(null);
  const hasReportedResultRef = useRef(false);
  const ownedRatio = useMemo(() => getOwnedRatio(gameState.grid), [gameState.grid]);
  const difficultyLabel = DIFFICULTY_SETTINGS[difficulty].label;

  useEffect(() => {
    const tickId = window.setInterval(() => {
      setGameState((currentGameState) => {
        const pathCollisionCheckedState = resolveEnemyPathCollision(currentGameState);
        if (pathCollisionCheckedState !== currentGameState) {
          return pathCollisionCheckedState;
        }

        const playerMovedState = movePlayerOneTick(pathCollisionCheckedState);
        if (playerMovedState.status !== 'playing') {
          return playerMovedState;
        }

        return moveEnemiesOneTick(playerMovedState, character.id);
      });
    }, DIFFICULTY_SETTINGS[difficulty].playerTickMs);

    return () => {
      window.clearInterval(tickId);
    };
  }, [character.id, difficulty]);

  useEffect(() => {
    if (gameState.status !== 'clear' && gameState.status !== 'gameOver') {
      return;
    }

    if (hasReportedResultRef.current) {
      return;
    }

    hasReportedResultRef.current = true;
    const result = onFinishGame({
      status: gameState.status,
      difficulty: gameState.difficulty,
      finalOwnedRatio: ownedRatio,
      selectedCharacterId: character.id,
    });
    setRewardResult(result);
    setIsResultOpen(true);
  }, [character.id, gameState.difficulty, gameState.status, onFinishGame, ownedRatio]);

  const playAgain = () => {
    hasReportedResultRef.current = false;
    setRewardResult(null);
    setIsResultOpen(false);
    setGameState(createInitialGameState(difficulty));
  };

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
          character={character}
        />

        <GameCanvas
          gameState={gameState}
          character={character}
          onRotateDirection={() => setGameState((currentGameState) => rotatePlayerClockwise(currentGameState))}
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
