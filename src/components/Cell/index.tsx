import { CSSProperties, memo } from 'react';
import './index.css';
import { CellType } from '../../types';

export default memo(function Cell({
  value,
  onClick,
  disabled,
  style,
}: {
  value: CellType;
  onClick: () => void;
  disabled: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      className='cell'
      style={style}
      onClick={onClick}
      disabled={Boolean(disabled)}
    >
      {value}
    </button>
  );
});
