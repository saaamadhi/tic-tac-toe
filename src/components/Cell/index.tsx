import { memo } from 'react';
import './index.css';
import { CellType } from '../../types';

export default memo(function Cell({
  cell,
  onClick,
  disabled,
}: {
  cell: CellType;
  onClick: any;
  disabled: boolean;
}) {
  return (
    <button className='cell' onClick={onClick} disabled={Boolean(disabled)}>
      {cell}
    </button>
  );
});
