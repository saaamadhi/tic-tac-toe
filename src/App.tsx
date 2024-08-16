import { useState, ChangeEvent } from 'react';
import './App.css';
import Board from './components/Board';
import { boardOptions, generateGrid } from './utils';
import { CellType } from './types';

function App() {
  const [squareAmount, setSquareAmount] = useState(() => {
    return localStorage.getItem('gridSize') || '';
  });
  const [grid, setGrid] = useState<CellType[][] | undefined>(() => {
    return squareAmount
      ? generateGrid({
          rows: Number(squareAmount),
          columns: Number(squareAmount),
          mapper: () => null,
        })
      : undefined;
  });

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSquareAmount(event.target.value);
    setGrid(
      generateGrid({
        rows: Number(value),
        columns: Number(value),
        mapper: () => null,
      })
    );
    localStorage.setItem('gridSize', value);
  };

  return (
    <div className='wrapper'>
      <h3 className='title'>Tic-Tac-Toe Game</h3>
      <div className='select__container'>
        <p>Choose size of the board:</p>
        <select
          id='board-size'
          name='board-size'
          value={squareAmount}
          onChange={handleSelect}
        >
          <option value='' disabled>
            --Please choose an option--
          </option>
          {boardOptions.map((el) => (
            <option value={el} key={el}>
              {el}
            </option>
          ))}
        </select>
      </div>

      <Board grid={grid} />
    </div>
  );
}

export default App;
