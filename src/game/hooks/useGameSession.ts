import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Character } from '../../characters/characterData';
import { DIFFICULTY_SETTINGS, MALANGJELLY_PLAYER_SPEED_MULTIPLIER } from '../constants';
import { moveEnemiesOneTick, resolveEnemyPathCollision } from '../engine/enemy';
import { createInitialGameState, getOwnedRatio } from '../engine/grid';
import { movePlayerOneTick, rotatePlayerClockwise } from '../engine/movement';
import {
  calculateGameReward,
  type GameRewardResult,
  type GameSessionResultInput,
} from '../engine/rewards';
import type { Difficulty } from '../types';

type UseGameSessionArgs = {
  character: Character;
  difficulty: Difficulty;
  onFinishGame: (resultInput: GameSessionResultInput) => GameRewardResult;
};

export type CaptureFeedback = {
  id: number;
  gainedCoins: number;
  gainedRatio: number;
};

export function useGameSession({ character, difficulty, onFinishGame }: UseGameSessionArgs) {
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [gameState, setGameState] = useState(() => createInitialGameState(difficulty));
  const [rewardResult, setRewardResult] = useState<GameRewardResult | null>(null);
  const [captureFeedback, setCaptureFeedback] = useState<CaptureFeedback | null>(null);
  const hasReportedResultRef = useRef(false);
  const previousOwnedRatioRef = useRef(getOwnedRatio(gameState.grid));
  const feedbackIdRef = useRef(0);
  const ownedRatio = useMemo(() => getOwnedRatio(gameState.grid), [gameState.grid]);
  const playerSpeedMultiplier =
    character.id === 'malangjelly' ? MALANGJELLY_PLAYER_SPEED_MULTIPLIER : 1;
  const playerTickMs = Math.round(DIFFICULTY_SETTINGS[difficulty].playerTickMs / playerSpeedMultiplier);
  const coinPreview = useMemo(
    () =>
      calculateGameReward({
        status: 'gameOver',
        difficulty: gameState.difficulty,
        finalOwnedRatio: ownedRatio,
        selectedCharacterId: character.id,
        previousBestScore: 0,
      }).earnedCoins,
    [character.id, gameState.difficulty, ownedRatio],
  );

  useEffect(() => {
    const previousOwnedRatio = previousOwnedRatioRef.current;
    if (ownedRatio <= previousOwnedRatio) {
      previousOwnedRatioRef.current = ownedRatio;
      return;
    }

    const gainedRatio = ownedRatio - previousOwnedRatio;
    const gainedCoins = calculateGameReward({
      status: 'gameOver',
      difficulty: gameState.difficulty,
      finalOwnedRatio: gainedRatio,
      selectedCharacterId: character.id,
      previousBestScore: 0,
    }).earnedCoins;

    feedbackIdRef.current += 1;
    setCaptureFeedback({
      id: feedbackIdRef.current,
      gainedCoins,
      gainedRatio,
    });
    previousOwnedRatioRef.current = ownedRatio;
  }, [character.id, gameState.difficulty, ownedRatio]);

  useEffect(() => {
    if (!captureFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCaptureFeedback(null);
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [captureFeedback]);

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
    }, playerTickMs);

    return () => {
      window.clearInterval(tickId);
    };
  }, [character.id, playerTickMs]);

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

  const rotatePlayer = useCallback(() => {
    setGameState((currentGameState) => rotatePlayerClockwise(currentGameState));
  }, []);

  const playAgain = useCallback(() => {
    hasReportedResultRef.current = false;
    previousOwnedRatioRef.current = getOwnedRatio(createInitialGameState(difficulty).grid);
    setCaptureFeedback(null);
    setRewardResult(null);
    setIsResultOpen(false);
    setGameState(createInitialGameState(difficulty));
  }, [difficulty]);

  return {
    captureFeedback,
    coinPreview,
    gameState,
    isResultOpen,
    ownedRatio,
    playAgain,
    rewardResult,
    rotatePlayer,
  };
}
