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
  const [history, setHistory] = useState<
    Array<CellType[][] | undefined> | undefined
  >([grid]);
  const [historyStep, setHistoryStep] = useState<number | undefined>();

  const calculateWinner = (grid: CellType[][] | undefined) => {
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
      grid?.every(
        (row, index) =>
          row[grid.length - (index + 1)] === grid[0][grid.length - 1]
      )
    ) {
      return grid[0][grid.length - 1];
    }

    if (grid && grid.every((row) => row.every((cell) => cell !== null))) {
      return 'XO';
    }

    return undefined;
  };

  const onResetGame = () => {
    setPlayer('X');
    if (squareAmount) {
      const initGrid = generateGrid({
        rows: Number(squareAmount),
        columns: Number(squareAmount),
        mapper: () => null,
      });
      setGrid(initGrid);
      setHistory([initGrid]);
    }
  };

  const onSelectBoardSize = (event: ChangeEvent<HTMLSelectElement>) => {
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

  const onClickCell = useCallback(
    ({ rowId, cellId }: { rowId: any; cellId: any }) => {
      let nextGrid: CellType[][] | undefined;
      if (grid && grid[rowId][cellId] === null) {
        setPlayer((currentPlayer) => (currentPlayer === 'X' ? 'O' : 'X'));
        setGrid((currentValue) => {
          nextGrid = currentValue?.map((row, rowIndex) =>
            row.map((cell, cellIndex) => {
              if (rowIndex === rowId && cellIndex === cellId) {
                return player;
              }
              return cell;
            })
          );

          return nextGrid;
        });
        setHistory(
          (currentHistory: Array<CellType[][] | undefined> | undefined) => {
            if (currentHistory?.length && historyStep) {
              setHistoryStep(undefined);
              return [...currentHistory.slice(0, historyStep), nextGrid];
            }
            return currentHistory?.length
              ? [...currentHistory, nextGrid]
              : [nextGrid];
          }
        );
      }
    },
    [grid, player]
  );

  const winner = useMemo(() => calculateWinner(grid), [grid]);

  const onNavigateHistory = (step: number, value: CellType[][] | undefined) => {
    setGrid(value);
    setHistoryStep(step + 1);
    setPlayer((step + 1) % 2 === 0 ? 'O' : 'X');
  };

  const getBoardHeader = () => {
    if (!winner) {
      return <p>{`Next up: ${player}`}</p>;
    }
    return <p>{winner?.length > 1 ? 'Draw!' : `Winner: ${winner}`}</p>;
  };

  return (
    <div className='wrapper'>
      <h3 className='title'>Tic-Tac-Toe Game</h3>
      <div className='game__container'>
        <div className='game-board'>
          <div className='select__container'>
            <p>Choose size of the board:</p>
            <select
              id='board-size'
              name='board-size'
              value={squareAmount}
              onChange={onSelectBoardSize}
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
            {squareAmount && (
              <div className='board-header'>
                {getBoardHeader()}
                <button type='button' onClick={onResetGame}>
                  Reset
                </button>
              </div>
            )}
          </div>

          <Board grid={grid} onClick={onClickCell} disabled={Boolean(winner)} />
        </div>
        <div className='game-history'>
          {squareAmount && <p>Steps:</p>}
          <ul>
            {squareAmount &&
              history?.map((el, index) => {
                return (
                  <li key={`history-step-${index}`}>
                    <button
                      type='button'
                      onClick={() => {
                        onNavigateHistory(index, el);
                      }}
                    >
                      {index ? `Go to move #${index}` : 'Go to game start'}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
