// [
// [1,2,3] -> (i + 1) * rowI
// [4,5,6]
// [7,8,9]
// ]
// const dummyArray = [...new Array(10).fill(0).keys()].map((item) => item + 1);
// const board = new Array(3)
//   .fill(0)
//   .map((_, index) => dummyArray.slice(index * 3, (index + 1) * 3));

import { CellType } from '../types';

export const boardOptions = Array(8)
  .fill(null)
  .map((_, index) => index + 3);

export const generateGrid = <T extends CellType | string | number | undefined>({
  rows,
  columns,
  mapper,
}: {
  rows: number;
  columns: number;
  mapper: () => T;
}) => {
  return Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(null).map(mapper));
};
