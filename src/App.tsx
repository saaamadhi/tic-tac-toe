import Board from './components/Board';
import BoardSizeSelector from './components/BoardSizeSelector';
import GameHistory from './components/GameHistory';
import useGame from './hooks/useGame';
import './App.css';
import Canvas from './components/Canvas';
import useModal from './hooks/useModal';
import Modal from './components/Modal';
import { useState } from 'react';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState<'friend' | 'computer'>(
    'friend'
  );

  const { modalRef, gameWrapperRef, onModalClose } = useModal({
    setSelectedPlayer,
  });
  const {
    boardSize,
    getCurrentMove,
    grid,
    historyKeys,
    onResetGame,
    onSelectBoardSize,
    onClickCell,
    onNavigateHistory,
    getBoardHeader,
    winnerDetails,
    isCellDisabled,
  } = useGame({ selectedPlayer });

  const { coords } = winnerDetails;

  return (
    <>
      <Canvas />

      <Modal ref={modalRef} onModalClose={onModalClose} />

      <div className='wrapper' ref={gameWrapperRef}>
        <div className='game__container'>
          <div className='game-instructions'>
            <h2 className='title'>Tic-Tac-Toe Game</h2>

            <BoardSizeSelector
              size={boardSize}
              onSelectBoardSize={onSelectBoardSize}
            />
          </div>
          <div className='game-board'>
            {boardSize && (
              <div className='board-header'>
                <div className='board-header__container'>
                  <p className='board-header__current-move'>
                    {historyKeys && historyKeys.length > 1
                      ? `Current move: ${getCurrentMove()}`
                      : null}
                  </p>
                  <button
                    type='button'
                    onClick={onResetGame}
                    className='board-header__reset-button'
                  >
                    Reset
                  </button>
                </div>
                <div
                  style={{
                    minHeight: '40px',
                  }}
                >
                  <p>{getBoardHeader()}</p>
                </div>
              </div>
            )}

            <Board
              grid={grid}
              winnerCoords={coords}
              onClick={onClickCell}
              disabled={isCellDisabled}
            />
          </div>
          <GameHistory
            historyKeys={historyKeys}
            onNavigateHistory={onNavigateHistory}
          />
        </div>
      </div>
    </>
  );
}

export default App;
