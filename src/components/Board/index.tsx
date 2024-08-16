import { CellType } from '../../types';
import './index.css';
import Cell from '../Cell';
import { memo } from 'react';

export default memo(function Board({
  grid,
  onClick,
  disabled,
}: {
  grid?: CellType[][];
  onClick: ({ rowId, cellId }: { rowId: any; cellId: any }) => void;
  disabled: boolean;
}) {
  if (!grid) {
    return null;
  }

  return (
    <div
      className='board'
      style={{
        gridTemplateRows: `repeat(${grid.length}, 1fr)`,
        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <Cell
            key={`${cellIndex}-${rowIndex}`}
            cell={cell}
            onClick={() => onClick({ rowId: rowIndex, cellId: cellIndex })}
            disabled={disabled}
          />
        ))
      )}
    </div>
  );
});
