import { memo } from 'react';
import './index.css';
import { CellType } from '../../types';

export default memo(function Cell({
  value,
  onClick,
  disabled,
}: {
  value: CellType;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button className='cell' onClick={onClick} disabled={Boolean(disabled)}>
      {value}
    </button>
  );
});
