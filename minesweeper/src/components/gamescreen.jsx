import React from 'react';
import Board from './gamescreen/board';

const GameScreen = ({ game, onReveal, onFlag }) => {
  return (
    <div>
      <h2>Game Status: {game.status}</h2>
      <Board
        board={game.board}
        revealed={game.revealed}
        flagged={game.flagged}
        onReveal={onReveal}
        onFlag={onFlag}
      />
    </div>
  );
};

export default GameScreen;