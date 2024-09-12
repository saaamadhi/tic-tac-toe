import { memo, useMemo } from 'react';
import { CellType } from '../../types';
import Cell from '../Cell';
import './index.css';
import { WIN_YELLOW_COLOR_HEX, generateRandomColor } from '../../utils';

export default memo(function Board({
  grid,
  winnerCoords,
  onClick,
  disabled,
}: {
  winnerCoords?: Array<string>;
  grid?: Map<number, Record<number, CellType>>;
  onClick: ({ rowId, cellId }: { rowId: number; cellId: number }) => void;
  disabled: boolean;
}) {
  const boardColor = useMemo(() => generateRandomColor(), []);

  if (!grid) {
    return null;
  }

  return (
    <div
      className='board'
      style={{
        gridTemplateRows: `repeat(${grid.size}, minmax(34px, 1fr))`,
        gridTemplateColumns: `repeat(${grid.size}, minmax(34px, 1fr))`,
        border: `2px solid ${boardColor}`,
        backgroundColor: boardColor,
      }}
    >
      {Array.from(grid, ([rowKey, rowValue]) =>
        Object.entries(rowValue).map(([cellKey, cellValue]) => (
          <Cell
            key={`${rowKey}-${cellKey}`}
            style={
              winnerCoords?.length &&
              winnerCoords.includes(`${rowKey},${cellKey}`)
                ? {
                    backgroundColor: WIN_YELLOW_COLOR_HEX,
                  }
                : undefined
            }
            value={cellValue}
            disabled={disabled}
            onClick={() => onClick({ rowId: rowKey, cellId: Number(cellKey) })}
          />
        ))
      )}
    </div>
  );
});
