import React from 'react';
import Board from './board';

const Game = ({ game, onReveal, onFlag, onNewGame }) => {
  const handleCellClick = (row, col) => {
    if (game.revealed[row][col] || game.flagged[row][col]) return;
    onReveal(row, col);
  };

  const handleCellRightClick = (row, col) => {
    if (game.revealed[row][col]) return;
    onFlag(row, col);
  };

  return (
    <div>
      <button onClick={onNewGame}>New Game</button>
      <div style={{ margin: '10px 0', fontWeight: 'bold' }}>
        Status: {game.status}
      </div>
      <Board
        board={game.board}
        revealed={game.revealed}
        flagged={game.flagged}
        onReveal={handleCellClick}
        onFlag={handleCellRightClick}
      />
    </div>
  );
};

export default Game;