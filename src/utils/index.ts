import { GridType, CellType } from '../types';

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
