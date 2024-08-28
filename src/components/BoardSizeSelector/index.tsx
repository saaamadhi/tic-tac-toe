import { ChangeEvent, useMemo } from 'react';
import { getBoardOptions, BOARD_SIZE } from '../../utils';
import './index.css';

export default function BoardSizeSelector({
  size,
  onSelectBoardSize,
}: {
  size: string;
  onSelectBoardSize: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  const boardSizeList = useMemo(
    () => getBoardOptions(BOARD_SIZE.min, BOARD_SIZE.max),
    []
  );

  return (
    <div className='select__container'>
      <label htmlFor='board-size' className='select__label'>
        Choose size of the board:
      </label>
      <select
        id='board-size'
        name='board-size'
        value={size}
        onChange={onSelectBoardSize}
      >
        <option value='' disabled>
          --Please choose an option--
        </option>
        {boardSizeList.map((el) => (
          <option value={el} key={el}>
            {`${el}x${el}`}
          </option>
        ))}
      </select>
    </div>
  );
}
