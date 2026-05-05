import { useEffect, useRef } from 'react';
import type { Character } from '../../characters/characterData';
import type { CellType, GameState } from '../types';

type GameCanvasProps = {
  gameState: GameState;
  character: Character;
};

type ThemeColors = {
  owned: string;
  ownedAccent: string;
  path: string;
};

const themeColorsByCharacter: Record<Character['id'], ThemeColors> = {
  ttangnyangi: {
    owned: '#ffd987',
    ownedAccent: '#f2a65a',
    path: '#ff9f6e',
  },
  malangjelly: {
    owned: '#ffc9ea',
    ownedAccent: '#d889d9',
    path: '#9fd8ff',
  },
  penguinkong: {
    owned: '#bfefff',
    ownedAccent: '#78bce8',
    path: '#8de0e8',
  },
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

function drawCell(
  context: CanvasRenderingContext2D,
  cell: CellType,
  x: number,
  y: number,
  cellSize: number,
  colors: ThemeColors,
) {
  const inset = Math.max(1, cellSize * 0.08);
  const size = cellSize - inset * 2;

  if (cell === 'empty') {
    context.fillStyle = '#e7f6d8';
    context.fillRect(x, y, cellSize, cellSize);
    return;
  }

  context.fillStyle = cell === 'owned' ? colors.owned : colors.path;
  drawRoundedCell(context, x + inset, y + inset, size, Math.max(2, cellSize * 0.2));

  if (cell === 'owned') {
    context.fillStyle = colors.ownedAccent;
    context.globalAlpha = 0.55;
    context.beginPath();
    context.arc(x + cellSize * 0.5, y + cellSize * 0.5, cellSize * 0.12, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  }
}

function drawPlayer(
  context: CanvasRenderingContext2D,
  gameState: GameState,
  character: Character,
  cellSize: number,
) {
  const centerX = (gameState.player.position.x + 0.5) * cellSize;
  const centerY = (gameState.player.position.y + 0.5) * cellSize;

  context.fillStyle = '#ffffff';
  context.beginPath();
  context.arc(centerX, centerY, cellSize * 0.68, 0, Math.PI * 2);
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

    context.fillStyle = '#ff8f9c';
    context.beginPath();
    context.arc(centerX, centerY, cellSize * 0.48, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(centerX - cellSize * 0.14, centerY - cellSize * 0.08, cellSize * 0.07, 0, Math.PI * 2);
    context.arc(centerX + cellSize * 0.14, centerY - cellSize * 0.08, cellSize * 0.07, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#7a4050';
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
  context.fillStyle = '#dff4d2';
  context.fillRect(0, 0, displaySize, displaySize);

  const cellSize = displaySize / gameState.gridSize;
  const colors = themeColorsByCharacter[character.id];

  gameState.grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      drawCell(context, cell, x * cellSize, y * cellSize, cellSize, colors);
    });
  });

  context.strokeStyle = 'rgba(83, 139, 92, 0.16)';
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

export function GameCanvas({ gameState, character }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const render = () => {
      const displaySize = wrapper.clientWidth;
      renderGameCanvas(canvas, gameState, character, displaySize);
    };

    render();

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
    };
  }, [character, gameState]);

  return (
    <div className="game-canvas-frame" ref={wrapperRef}>
      <canvas ref={canvasRef} aria-label="포켓랜드 게임 보드" role="img" />
    </div>
  );
}
