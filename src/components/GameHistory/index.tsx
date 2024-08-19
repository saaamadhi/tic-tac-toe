import { Fragment, memo } from 'react';
import './index.css';
import { HistoryType } from '../../types';

export default memo(function GameHistory({
  history,
  onNavigateHistory,
}: {
  history: HistoryType;
  onNavigateHistory: (key: number) => void;
}) {
  if (!history) {
    return null;
  }

  const historyKeys = Object.keys(history);

  return (
    <div className='game-history'>
      {historyKeys.length > 1 ? <p>Steps:</p> : null}
      <ul className='game-history__container'>
        {historyKeys.map((key) => {
          const formattedKey = Number(key);
          return (
            <Fragment key={`history-step-${key}`}>
              {formattedKey ? (
                <li className='game-history__step'>
                  <button
                    type='button'
                    onClick={() => {
                      onNavigateHistory(formattedKey);
                    }}
                  >
                    {`Go to move #${key}`}
                  </button>
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
});
