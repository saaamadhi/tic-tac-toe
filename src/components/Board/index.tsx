import { CellType } from '../../types';
import './index.css';
import Cell from '../Cell';
import { memo } from 'react';

export default memo(function Board({
  grid,
  onClick,
  disabled,
}: {
  grid?: Map<number, Record<number, CellType>>;
  onClick: ({ rowId, cellId }: { rowId: number; cellId: number }) => void;
  disabled: boolean;
}) {
  if (!grid) {
    return null;
  }

  return (
    <div
      className='board'
      style={{
        gridTemplateRows: `repeat(${grid.size}, 1fr)`,
        gridTemplateColumns: `repeat(${grid.size}, 1fr)`,
      }}
    >
      {Array.from(grid, ([rowKey, rowValue]) =>
        Object.entries(rowValue).map(([cellKey, cellValue]) => (
          <Cell
            key={`${rowKey}-${cellKey}`}
            value={cellValue}
            disabled={disabled}
            onClick={() => onClick({ rowId: rowKey, cellId: Number(cellKey) })}
          />
        ))
      )}
    </div>
  );
});
