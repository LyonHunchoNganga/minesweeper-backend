import React from 'react';

const Cell = ({ row, col, cell, onClick, gameOver }) => {
  const handleClick = () => {
    if (!cell.revealed) {
      onClick();
    }
  };

  let display = '';
  if (cell.revealed) {
    if (cell.mine) {
      display = '💣';
    } else if (cell.adjacentMines === 0) {
      display = '';
    } else {
      display = cell.adjacentMines.toString();
    }
  } else if (gameOver && cell.mine) {
    display = '💣';
  }

  return (
    <div
      className={`cell ${cell.revealed ? 'revealed' : 'hidden'}`}
      onClick={handleClick}
    >
      {display}
    </div>
  );
};

export default Cell;