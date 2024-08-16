import { memo } from 'react';
import './index.css';
import { CellType } from '../../types';

export default memo(function Cell({ cell }: { cell: CellType }) {
  return <button className='cell'>{cell}</button>;
});
