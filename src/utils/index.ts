import { GridType, CellType, PLAYER } from '../types';

const WHITE_COLOR_INT = 16777215;
const BLACK_COLOR_HEX = '#000000';

export const WIN_YELLOW_COLOR_HEX = '#faec6e';

export const BOARD_SIZE = {
  min: 3,
  max: 8,
};

export const getBoardOptions = (min: number, max: number) => {
  return Array(max)
    .fill(null)
    .map((_, index) => index + min);
};

export const generateGrid = <T extends CellType>({
  size,
  mapper,
}: {
  size: number;
  mapper: () => T;
}) => {
  const hashMap: GridType = new Map();

  for (let i = 0; i < size; i++) {
    const child: Record<number, CellType> = {};
    for (let j = 0; j < size; j++) {
      child[j] = mapper();
    }
    hashMap.set(i, child);
  }
  return hashMap;
};

export const generateGridCoords = (size: number) => {
  const positions: Set<string> = new Set();
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.add(`${i},${j}`);
    }
  }
  return positions;
};

export const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * WHITE_COLOR_INT).toString(16);

  return BLACK_COLOR_HEX.slice(0, -randomColor.length) + randomColor;
};

export const calculateWinner = (
  grid?: GridType,
  nullPositions?: Set<string>
) => {
  let coords: string[] = [];
  const firstRow = grid?.get(0);
  if (grid && firstRow) {
    for (const [index, row] of grid) {
      // Find winner in a row
      if (
        row[0] !== null &&
        Object.values(row).every((cell) => cell === row[0])
      ) {
        coords = Object.values(row).map(
          (_, cellIndex) => `${index},${cellIndex}`
        );

        return { winner: row[0], coords };
      }
      //Find winner in a column
      if (
        firstRow[index] !== null &&
        [...grid.values()].every((row) => row[index] === firstRow[index])
      ) {
        coords = [...grid.values()].map(
          (_, rowIndex) => `${rowIndex},${index}`
        );

        return { winner: firstRow[index], coords };
      }
    }

    //Find winner in a main diagonal
    if (
      firstRow[0] !== null &&
      [...grid.values()].every((row, index) => row[index] === firstRow[0])
    ) {
      coords = [...grid.values()].map(
        (_, rowIndex) => `${rowIndex},${rowIndex}`
      );
      return { winner: firstRow[0], coords };
    }
    //Find winner in an anti-diagonal
    if (
      [...grid.values()].every(
        (row, index) =>
          firstRow[grid.size - 1] !== null &&
          row[grid.size - (index + 1)] === firstRow[grid.size - 1]
      )
    ) {
      coords = [...grid.values()].map(
        (_, rowIndex) => `${rowIndex},${grid.size - (rowIndex + 1)}`
      );
      return { winner: firstRow[grid.size - 1], coords };
    }
  }

  // Find if it's a draw
  if (grid && !nullPositions?.size) {
    return { winner: 'XO' };
  }

  return { winner: undefined };
};

export const getCornerMoves = (size: number) => [
  `0,0`,
  `0,${size - 1}`,
  `${size - 1},0`,
  `${size - 1},${size - 1}`,
];

export const isComputerWinningMove = (
  player: PLAYER,
  row: number,
  col: number,
  grid?: GridType
) => {
  if (!grid) {
    return;
  }
  grid.get(row)![col] = player; // Temporarily place the move
  const winnerPlayer = calculateWinner(grid);
  grid.get(row)![col] = null; // Undo the move
  return winnerPlayer.winner === player;
};
