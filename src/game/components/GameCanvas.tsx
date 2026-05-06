import { useEffect, useRef } from 'react';
import type { Character } from '../../characters/characterData';
import type { CellType, Direction, GameState, GridPosition } from '../types';

type GameCanvasProps = {
  gameState: GameState;
  character: Character;
  onRotateDirection: () => void;
};

type ThemeColors = {
  empty: string;
  emptyAccent: string;
  owned: string;
  ownedAccent: string;
  ownedHighlight: string;
  path: string;
  pathAccent: string;
  pathGlow: string;
};

const themeColorsByCharacter: Record<Character['id'], ThemeColors> = {
  ttangnyangi: {
    empty: '#dff4c8',
    emptyAccent: '#c9e7b6',
    owned: '#ffe29c',
    ownedAccent: '#d98f49',
    ownedHighlight: '#fff4c9',
    path: '#ff9f5f',
    pathAccent: '#fff2c7',
    pathGlow: '#ffd15f',
  },
  malangjelly: {
    empty: '#e1f5dc',
    emptyAccent: '#c7eac6',
    owned: '#ffc8ec',
    ownedAccent: '#c978cf',
    ownedHighlight: '#fff1fb',
    path: '#9fd8ff',
    pathAccent: '#fff0fb',
    pathGlow: '#ffb8ef',
  },
  penguinkong: {
    empty: '#e3f5ed',
    emptyAccent: '#c7eadf',
    owned: '#c6f1ff',
    ownedAccent: '#69b6df',
    ownedHighlight: '#f5fdff',
    path: '#94e7ee',
    pathAccent: '#f4fdff',
    pathGlow: '#7fdcff',
  },
};

const directionVector: Record<Direction, GridPosition> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

function drawRoundedCell(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, size, size, radius);
  context.fill();
}

function drawPawMark(context: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string) {
  const centerX = x + cellSize * 0.5;
  const centerY = y + cellSize * 0.55;

  context.fillStyle = color;
  context.globalAlpha = 0.62;
  context.beginPath();
  context.arc(centerX, centerY, cellSize * 0.12, 0, Math.PI * 2);
  context.arc(centerX - cellSize * 0.15, centerY - cellSize * 0.15, cellSize * 0.055, 0, Math.PI * 2);
  context.arc(centerX, centerY - cellSize * 0.2, cellSize * 0.055, 0, Math.PI * 2);
  context.arc(centerX + cellSize * 0.15, centerY - cellSize * 0.15, cellSize * 0.055, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function drawJellyMark(context: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string) {
  context.strokeStyle = color;
  context.lineWidth = Math.max(1, cellSize * 0.08);
  context.globalAlpha = 0.58;
  context.beginPath();
  context.arc(x + cellSize * 0.52, y + cellSize * 0.52, cellSize * 0.22, Math.PI * 0.15, Math.PI * 1.25);
  context.stroke();
  context.fillStyle = color;
  context.beginPath();
  context.arc(x + cellSize * 0.34, y + cellSize * 0.33, cellSize * 0.055, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function drawIceMark(context: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string) {
  const centerX = x + cellSize * 0.5;
  const centerY = y + cellSize * 0.5;
  const length = cellSize * 0.22;

  context.strokeStyle = color;
  context.lineWidth = Math.max(1, cellSize * 0.07);
  context.globalAlpha = 0.6;
  context.beginPath();
  context.moveTo(centerX - length, centerY);
  context.lineTo(centerX + length, centerY);
  context.moveTo(centerX, centerY - length);
  context.lineTo(centerX, centerY + length);
  context.moveTo(centerX - length * 0.7, centerY - length * 0.7);
  context.lineTo(centerX + length * 0.7, centerY + length * 0.7);
  context.stroke();
  context.globalAlpha = 1;
}

function drawOwnedThemeMark(
  context: CanvasRenderingContext2D,
  characterId: Character['id'],
  x: number,
  y: number,
  cellSize: number,
  color: string,
) {
  if (characterId === 'ttangnyangi') {
    drawPawMark(context, x, y, cellSize, color);
    return;
  }

  if (characterId === 'malangjelly') {
    drawJellyMark(context, x, y, cellSize, color);
    return;
  }

  drawIceMark(context, x, y, cellSize, color);
}

function drawSparkle(context: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, color: string) {
  context.strokeStyle = color;
  context.lineWidth = Math.max(1, size * 0.12);
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(centerX - size, centerY);
  context.lineTo(centerX + size, centerY);
  context.moveTo(centerX, centerY - size);
  context.lineTo(centerX, centerY + size);
  context.stroke();
}

function drawCell(
  context: CanvasRenderingContext2D,
  cell: CellType,
  x: number,
  y: number,
  cellSize: number,
  colors: ThemeColors,
  characterId: Character['id'],
) {
  const inset = Math.max(1, cellSize * 0.08);
  const size = cellSize - inset * 2;

  if (cell === 'empty') {
    context.fillStyle = (x / cellSize + y / cellSize) % 2 === 0 ? colors.empty : colors.emptyAccent;
    context.fillRect(x, y, cellSize, cellSize);
    context.fillStyle = 'rgba(255, 255, 255, 0.2)';
    context.beginPath();
    context.arc(x + cellSize * 0.72, y + cellSize * 0.28, cellSize * 0.1, 0, Math.PI * 2);
    context.fill();
    return;
  }

  if (cell === 'path') {
    context.shadowColor = colors.pathGlow;
    context.shadowBlur = cellSize * 0.42;
  }

  const gradient = context.createLinearGradient(x, y, x, y + cellSize);
  gradient.addColorStop(0, cell === 'owned' ? colors.ownedHighlight : colors.pathAccent);
  gradient.addColorStop(1, cell === 'owned' ? colors.owned : colors.path);
  context.fillStyle = gradient;
  drawRoundedCell(context, x + inset, y + inset, size, Math.max(2, cellSize * 0.2));
  context.shadowBlur = 0;

  if (cell === 'owned') {
    drawOwnedThemeMark(context, characterId, x, y, cellSize, colors.ownedAccent);
    context.fillStyle = 'rgba(255, 255, 255, 0.34)';
    context.beginPath();
    context.arc(x + cellSize * 0.32, y + cellSize * 0.3, cellSize * 0.08, 0, Math.PI * 2);
    context.fill();
    return;
  }

  context.globalAlpha = 0.78;
  drawSparkle(context, x + cellSize * 0.5, y + cellSize * 0.5, cellSize * 0.13, colors.pathAccent);
  context.globalAlpha = 1;
}

function drawPlayer(
  context: CanvasRenderingContext2D,
  gameState: GameState,
  character: Character,
  cellSize: number,
) {
  const centerX = (gameState.player.position.x + 0.5) * cellSize;
  const centerY = (gameState.player.position.y + 0.5) * cellSize;
  const direction = directionVector[gameState.player.direction];

  const auraGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, cellSize * 1.25);
  auraGradient.addColorStop(0, 'rgba(255, 247, 177, 0.7)');
  auraGradient.addColorStop(1, 'rgba(255, 247, 177, 0)');
  context.fillStyle = auraGradient;
  context.beginPath();
  context.arc(centerX, centerY, cellSize * 1.25, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#ffffff';
  context.shadowColor = 'rgba(80, 53, 34, 0.28)';
  context.shadowBlur = cellSize * 0.45;
  context.beginPath();
  context.arc(centerX, centerY, cellSize * 0.76, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;

  context.strokeStyle = '#ffcf5f';
  context.lineWidth = Math.max(2, cellSize * 0.13);
  context.beginPath();
  context.arc(centerX, centerY, cellSize * 0.76, 0, Math.PI * 2);
  context.stroke();

  const arrowTipX = centerX + direction.x * cellSize * 0.98;
  const arrowTipY = centerY + direction.y * cellSize * 0.98;
  const arrowBaseX = centerX + direction.x * cellSize * 0.5;
  const arrowBaseY = centerY + direction.y * cellSize * 0.5;
  const perpendicularX = -direction.y;
  const perpendicularY = direction.x;
  const arrowHalfWidth = cellSize * 0.22;

  context.fillStyle = '#4f321c';
  context.strokeStyle = '#ffffff';
  context.lineWidth = Math.max(2, cellSize * 0.12);
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(arrowTipX, arrowTipY);
  context.lineTo(arrowBaseX + perpendicularX * arrowHalfWidth, arrowBaseY + perpendicularY * arrowHalfWidth);
  context.lineTo(arrowBaseX - perpendicularX * arrowHalfWidth, arrowBaseY - perpendicularY * arrowHalfWidth);
  context.closePath();
  context.stroke();
  context.fill();

  context.font = `${Math.max(14, cellSize * 1.1)}px sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(character.emoji, centerX, centerY + cellSize * 0.03);
}

function drawEnemies(context: CanvasRenderingContext2D, gameState: GameState, cellSize: number) {
  gameState.enemies.forEach((enemy) => {
    const centerX = (enemy.position.x + 0.5) * cellSize;
    const centerY = (enemy.position.y + 0.5) * cellSize;

    const enemyGradient = context.createRadialGradient(
      centerX - cellSize * 0.12,
      centerY - cellSize * 0.16,
      cellSize * 0.08,
      centerX,
      centerY,
      cellSize * 0.58,
    );
    enemyGradient.addColorStop(0, '#ffccd4');
    enemyGradient.addColorStop(1, '#ff667a');

    context.fillStyle = 'rgba(255, 73, 102, 0.18)';
    context.beginPath();
    context.arc(centerX, centerY, cellSize * 0.86, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = enemyGradient;
    context.shadowColor = 'rgba(177, 55, 80, 0.34)';
    context.shadowBlur = cellSize * 0.36;
    context.beginPath();
    context.arc(centerX, centerY, cellSize * 0.54, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;

    context.fillStyle = '#ff667a';
    context.beginPath();
    context.moveTo(centerX - cellSize * 0.3, centerY - cellSize * 0.34);
    context.lineTo(centerX - cellSize * 0.48, centerY - cellSize * 0.66);
    context.lineTo(centerX - cellSize * 0.12, centerY - cellSize * 0.44);
    context.moveTo(centerX + cellSize * 0.3, centerY - cellSize * 0.34);
    context.lineTo(centerX + cellSize * 0.48, centerY - cellSize * 0.66);
    context.lineTo(centerX + cellSize * 0.12, centerY - cellSize * 0.44);
    context.fill();

    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(centerX - cellSize * 0.14, centerY - cellSize * 0.08, cellSize * 0.07, 0, Math.PI * 2);
    context.arc(centerX + cellSize * 0.14, centerY - cellSize * 0.08, cellSize * 0.07, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = '#7a4050';
    context.lineWidth = Math.max(1, cellSize * 0.08);
    context.beginPath();
    context.arc(centerX, centerY + cellSize * 0.12, cellSize * 0.12, 0, Math.PI);
    context.stroke();
  });
}

function renderGameCanvas(
  canvas: HTMLCanvasElement,
  gameState: GameState,
  character: Character,
  displaySize: number,
) {
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(displaySize * pixelRatio);
  canvas.height = Math.floor(displaySize * pixelRatio);
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, displaySize, displaySize);
  context.shadowBlur = 0;
  context.globalAlpha = 1;
  const boardGradient = context.createLinearGradient(0, 0, displaySize, displaySize);
  boardGradient.addColorStop(0, '#e7f8c7');
  boardGradient.addColorStop(0.55, '#d7f0bd');
  boardGradient.addColorStop(1, '#c7e6ab');
  context.fillStyle = boardGradient;
  context.fillRect(0, 0, displaySize, displaySize);

  const cellSize = displaySize / gameState.gridSize;
  const colors = themeColorsByCharacter[character.id];

  gameState.grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      drawCell(context, cell, x * cellSize, y * cellSize, cellSize, colors, character.id);
    });
  });

  context.strokeStyle = 'rgba(83, 139, 92, 0.08)';
  context.lineWidth = 1;
  for (let index = 0; index <= gameState.gridSize; index += 1) {
    const position = index * cellSize;
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, displaySize);
    context.moveTo(0, position);
    context.lineTo(displaySize, position);
    context.stroke();
  }

  drawEnemies(context, gameState, cellSize);
  drawPlayer(context, gameState, character, cellSize);
}

export function GameCanvas({ gameState, character, onRotateDirection }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const latestGameStateRef = useRef(gameState);
  const latestCharacterRef = useRef(character);
  const displaySizeRef = useRef(0);

  useEffect(() => {
    latestGameStateRef.current = gameState;
    latestCharacterRef.current = character;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const displaySize = displaySizeRef.current || wrapper?.clientWidth || 0;

    if (!canvas || displaySize <= 0) {
      return;
    }

    renderGameCanvas(canvas, gameState, character, displaySize);
  }, [character, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const render = () => {
      const displaySize = wrapper.clientWidth;
      if (displaySize <= 0) {
        return;
      }

      displaySizeRef.current = displaySize;
      renderGameCanvas(canvas, latestGameStateRef.current, latestCharacterRef.current, displaySize);
    };

    render();

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="game-canvas-frame" ref={wrapperRef} onPointerDown={(event) => {
      event.preventDefault();
      onRotateDirection();
    }}>
      <canvas ref={canvasRef} aria-label="포켓랜드 게임 보드" role="img" />
    </div>
  );
}
