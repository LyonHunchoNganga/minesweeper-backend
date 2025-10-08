import React from 'react';
import Board from './board';

const Game = ({ game, onReveal, onFlag, onNewGame }) => {
  return (
    <div>
      <h2>Status: {game.status}</h2>
      <Board
        board={game.board}
        revealed={game.revealed}
        flagged={game.flagged}
        onReveal={onReveal}
        onFlag={onFlag}
      />
      <button onClick={onNewGame}>New Game</button>
    </div>
  );
};

export default Game;