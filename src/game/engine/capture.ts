import type { CellType, GridPosition } from '../types';

type CaptureResult = {
  grid: CellType[][];
  capturedCellCount: number;
};

const neighborOffsets: GridPosition[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function isRectangularGrid(grid: CellType[][]): boolean {
  const width = grid[0]?.length ?? 0;
  return width > 0 && grid.every((row) => row.length === width);
}

function addEdgeCellIfEmpty(
  grid: CellType[][],
  visited: boolean[][],
  queue: GridPosition[],
  x: number,
  y: number,
) {
  if (grid[y]?.[x] === 'empty' && !visited[y][x]) {
    visited[y][x] = true;
    queue.push({ x, y });
  }
}

export function captureClosedTerritory(grid: CellType[][]): CaptureResult {
  if (grid.length === 0 || !isRectangularGrid(grid)) {
    return {
      grid: grid.map((row) => [...row]),
      capturedCellCount: 0,
    };
  }

  const height = grid.length;
  const width = grid[0].length;
  const outsideReachable = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  const queue: GridPosition[] = [];

  // PATH cells act as temporary walls. We only seed EMPTY edge cells, then flood
  // through EMPTY cells to find every open area connected to the outside.
  for (let x = 0; x < width; x += 1) {
    addEdgeCellIfEmpty(grid, outsideReachable, queue, x, 0);
    addEdgeCellIfEmpty(grid, outsideReachable, queue, x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    addEdgeCellIfEmpty(grid, outsideReachable, queue, 0, y);
    addEdgeCellIfEmpty(grid, outsideReachable, queue, width - 1, y);
  }

  let cursor = 0;
  while (cursor < queue.length) {
    const current = queue[cursor];
    cursor += 1;

    neighborOffsets.forEach((offset) => {
      const next = {
        x: current.x + offset.x,
        y: current.y + offset.y,
      };

      if (next.x < 0 || next.x >= width || next.y < 0 || next.y >= height) {
        return;
      }

      if (grid[next.y][next.x] !== 'empty' || outsideReachable[next.y][next.x]) {
        return;
      }

      outsideReachable[next.y][next.x] = true;
      queue.push(next);
    });
  }

  let capturedCellCount = 0;
  const nextGrid = grid.map((row, y) =>
    row.map((cell, x) => {
      // Any EMPTY cell not reached by the edge flood-fill is enclosed by the
      // temporary PATH wall, so it becomes owned together with the path itself.
      if (cell === 'path' || (cell === 'empty' && !outsideReachable[y][x])) {
        capturedCellCount += 1;
        return 'owned';
      }

      return cell;
    }),
  );

  return {
    grid: nextGrid,
    capturedCellCount,
  };
}
