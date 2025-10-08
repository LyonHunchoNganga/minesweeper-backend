import React from 'react';
import Cell from './cell';

const Board = ({ board, revealed, flagged, onReveal, onFlag }) => {
  return (
    <div className="board">
      {board.map((row, r) => (
        <div key={r} className="row">
          {row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              row={r}
              col={c}
              value={cell}
              revealed={revealed[r][c]}
              flagged={flagged[r][c]}
              onReveal={onReveal}
              onFlag={onFlag}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;