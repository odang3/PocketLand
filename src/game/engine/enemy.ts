import type { CharacterId } from '../../characters/characterData';
import { DIFFICULTY_SETTINGS, PENGUINKONG_ENEMY_SPEED_MULTIPLIER } from '../constants';
import type { EnemyState, GameState, GridPosition } from '../types';
import { losePlayerLifeAndReset } from './movement';

function isOutsideBoard(position: GridPosition, gridSize: number): boolean {
  return position.x < 0 || position.x >= gridSize || position.y < 0 || position.y >= gridSize;
}

function isBlockedByBoardOrOwned(gameState: GameState, position: GridPosition): boolean {
  if (isOutsideBoard(position, gameState.gridSize)) {
    return true;
  }

  return gameState.grid[position.y]?.[position.x] === 'owned';
}

function moveEnemy(enemy: EnemyState, gameState: GameState): EnemyState {
  const horizontalTarget = {
    x: enemy.position.x + enemy.velocity.x,
    y: enemy.position.y,
  };
  const verticalTarget = {
    x: enemy.position.x,
    y: enemy.position.y + enemy.velocity.y,
  };

  const nextVelocity = {
    x: isBlockedByBoardOrOwned(gameState, horizontalTarget) ? -enemy.velocity.x : enemy.velocity.x,
    y: isBlockedByBoardOrOwned(gameState, verticalTarget) ? -enemy.velocity.y : enemy.velocity.y,
  };

  const nextPosition = {
    x: enemy.position.x + nextVelocity.x,
    y: enemy.position.y + nextVelocity.y,
  };

  if (isBlockedByBoardOrOwned(gameState, nextPosition)) {
    return {
      ...enemy,
      velocity: nextVelocity,
    };
  }

  return {
    ...enemy,
    position: nextPosition,
    velocity: nextVelocity,
  };
}

export function enemyTouchesPath(gameState: GameState, enemies: EnemyState[] = gameState.enemies): boolean {
  return enemies.some((enemy) => gameState.grid[enemy.position.y]?.[enemy.position.x] === 'path');
}

export function resolveEnemyPathCollision(
  gameState: GameState,
  enemies: EnemyState[] = gameState.enemies,
): GameState {
  if (gameState.status !== 'playing' || !enemyTouchesPath(gameState, enemies)) {
    return gameState;
  }

  return losePlayerLifeAndReset({
    ...gameState,
    enemies,
  });
}

export function moveEnemiesOneTick(gameState: GameState, selectedCharacterId: CharacterId): GameState {
  if (gameState.status !== 'playing') {
    return gameState;
  }

  const characterSpeedMultiplier =
    selectedCharacterId === 'penguinkong' ? PENGUINKONG_ENEMY_SPEED_MULTIPLIER : 1;
  const speedMultiplier =
    DIFFICULTY_SETTINGS[gameState.difficulty].enemySpeedMultiplier * characterSpeedMultiplier;
  const nextEnemyMoveProgress = gameState.enemyMoveProgress + speedMultiplier;

  if (nextEnemyMoveProgress < 1) {
    const collisionResult = resolveEnemyPathCollision(gameState);
    if (collisionResult !== gameState) {
      return collisionResult;
    }

    return {
      ...gameState,
      enemyMoveProgress: nextEnemyMoveProgress,
    };
  }

  const collisionResult = resolveEnemyPathCollision(gameState);
  if (collisionResult !== gameState) {
    return collisionResult;
  }

  const movedEnemies = gameState.enemies.map((enemy) => moveEnemy(enemy, gameState));

  const movedCollisionResult = resolveEnemyPathCollision(gameState, movedEnemies);
  if (movedCollisionResult !== gameState) {
    return movedCollisionResult;
  }

  return {
    ...gameState,
    enemies: movedEnemies,
    enemyMoveProgress: nextEnemyMoveProgress - 1,
  };
}
