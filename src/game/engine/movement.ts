import type { Direction, GameState, GridPosition } from '../types';
import { captureClosedTerritory } from './capture';
import { getOwnedRatio } from './grid';

const clockwiseDirection: Record<Direction, Direction> = {
  up: 'right',
  right: 'down',
  down: 'left',
  left: 'up',
};

const directionOffset: Record<Direction, GridPosition> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

function isInsideBoard(position: GridPosition, gridSize: number): boolean {
  return position.x >= 0 && position.x < gridSize && position.y >= 0 && position.y < gridSize;
}

function getNextPosition(position: GridPosition, direction: Direction): GridPosition {
  const offset = directionOffset[direction];

  return {
    x: position.x + offset.x,
    y: position.y + offset.y,
  };
}

function getNextInsideDirection(position: GridPosition, direction: Direction, gridSize: number): Direction {
  let nextDirection = clockwiseDirection[direction];

  for (let turnCount = 0; turnCount < 4; turnCount += 1) {
    if (isInsideBoard(getNextPosition(position, nextDirection), gridSize)) {
      return nextDirection;
    }

    nextDirection = clockwiseDirection[nextDirection];
  }

  return direction;
}

function clearCurrentPath(gameState: GameState): GameState['grid'] {
  return gameState.grid.map((row) => row.map((cell) => (cell === 'path' ? 'empty' : cell)));
}

export function losePlayerLifeAndReset(gameState: GameState): GameState {
  const nextLives = gameState.player.lives - 1;
  const nextStatus = nextLives <= 0 ? 'gameOver' : 'playing';

  return {
    ...gameState,
    status: nextStatus,
    grid: clearCurrentPath(gameState),
    enemyMoveProgress: 0,
    player: {
      ...gameState.player,
      position: gameState.player.startPosition,
      direction: 'right',
      path: [],
      lives: Math.max(0, nextLives),
    },
  };
}

export function rotatePlayerClockwise(gameState: GameState): GameState {
  if (gameState.status !== 'playing') {
    return gameState;
  }

  return {
    ...gameState,
    player: {
      ...gameState.player,
      direction: clockwiseDirection[gameState.player.direction],
    },
  };
}

export function movePlayerOneTick(gameState: GameState): GameState {
  if (gameState.status !== 'playing') {
    return gameState;
  }

  const nextPosition = getNextPosition(gameState.player.position, gameState.player.direction);

  if (!isInsideBoard(nextPosition, gameState.gridSize)) {
    return {
      ...gameState,
      player: {
        ...gameState.player,
        direction: getNextInsideDirection(
          gameState.player.position,
          gameState.player.direction,
          gameState.gridSize,
        ),
      },
    };
  }

  const nextCell = gameState.grid[nextPosition.y]?.[nextPosition.x];
  if (!nextCell) {
    return gameState;
  }

  let nextGrid = gameState.grid.map((row) => [...row]);
  let nextPath = gameState.player.path;

  if (nextCell === 'path' && gameState.player.path.length > 0) {
    return losePlayerLifeAndReset(gameState);
  }

  if (nextCell === 'empty') {
    nextGrid[nextPosition.y][nextPosition.x] = 'path';
    nextPath = [...gameState.player.path, nextPosition];
  }

  if (nextCell === 'owned' && nextPath.length > 0) {
    const captureResult = captureClosedTerritory(nextGrid);
    nextGrid = captureResult.grid;
    nextPath = [];
  }

  const ownedRatio = getOwnedRatio(nextGrid);
  const nextStatus = ownedRatio >= gameState.targetRatio ? 'clear' : gameState.status;

  return {
    ...gameState,
    status: nextStatus,
    grid: nextGrid,
    player: {
      ...gameState.player,
      position: nextPosition,
      path: nextPath,
    },
  };
}
