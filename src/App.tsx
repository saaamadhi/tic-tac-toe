import { useState, ChangeEvent, useCallback, useMemo } from 'react';
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
  const [player, setPlayer] = useState<Exclude<CellType, null>>('X');

  const calculateWinner = () => {
    for (let i = 0; grid && i < grid.length; i++) {
      if (grid[i].every((cell) => cell === grid[i][0])) {
        return grid[i][0];
      }
      if (grid.every((row) => row[i] === grid[0][i])) {
        return grid[0][i];
      }
    }

    if (grid?.every((row, index) => row[index] === grid[0][0])) {
      return grid[0][0];
    }
    if (
      grid?.every((row) => row[grid.length - 1] === grid[0][grid.length - 1])
    ) {
      return grid[0][grid.length - 1];
    }

    return undefined;
  };

  const resetGame = () => {
    setPlayer('X');
    if (squareAmount) {
      setGrid(
        generateGrid({
          rows: Number(squareAmount),
          columns: Number(squareAmount),
          mapper: () => null,
        })
      );
    }
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setPlayer('X');
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

  const handleClick = useCallback(
    ({ rowId, cellId }: { rowId: any; cellId: any }) => {
      if (grid && grid[rowId][cellId] === null) {
        setPlayer((currentPlayer) => (currentPlayer === 'X' ? 'O' : 'X'));
        setGrid((currentValue) =>
          currentValue?.map((row, rowIndex) =>
            row.map((cell, cellIndex) => {
              if (rowIndex === rowId && cellIndex === cellId) {
                return player;
              }
              return cell;
            })
          )
        );
      }
    },
    [grid, player]
  );

  const winner = calculateWinner();

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
        <div className='board-header'>
          <p>{winner ? `Winner: ${winner}` : `Next up: ${player}`}</p>
          <button type='button' onClick={resetGame}>
            Reset
          </button>
        </div>
      </div>

      <Board grid={grid} onClick={handleClick} disabled={Boolean(winner)} />
    </div>
  );
}

export default App;
