import React from 'react';
import Cell from './cell';

const Board = ({ board, revealed, flagged, onReveal, onFlag }) => {
  const rows = board.length;
  const cols = board[0].length;

  return (
    <div className="board">
      {board.map((row, r) => (
        <div key={r} className="row">
          {row.map((value, c) => (
            <Cell
              key={`${r}-${c}`}
              value={value}
              isRevealed={revealed[r][c]}
              isFlagged={flagged[r][c]}
              onReveal={() => onReveal(r, c)}
              onFlag={() => onFlag(r, c)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
