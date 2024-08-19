export enum PLAYER {
  'X' = 'X',
  'O' = 'O',
}

export type CellType = null | PLAYER;
export type GridType = Map<number, Record<number, CellType>>;
export type HistoryType =
  | Record<number, (GridType | Set<string> | undefined)[]>
  | undefined;
