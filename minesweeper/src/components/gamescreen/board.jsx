import React from 'react';
import Cell from './cell';

const Board = ({ grid, handleCellClick, gameOver }) => {
  return (
    <div className="board">
      {grid.map((row, r) => (
        <div key={r} className="row">
          {row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              row={r}
              col={c}
              cell={cell}
              onClick={() => handleCellClick(r, c)}
              gameOver={gameOver}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
