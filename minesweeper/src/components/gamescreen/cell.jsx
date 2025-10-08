import React from 'react';

const Cell = ({ value, isRevealed, isFlagged, onReveal, onFlag }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (!isRevealed && !isFlagged) {
      onReveal();
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (!isRevealed) {
      onFlag();
    }
  };

  let display = '';
  if (isFlagged) {
    display = '🚩';
  } else if (isRevealed) {
    if (value === -1) {
      display = '💣';
    } else if (value === 0) {
      display = '';
    } else {
      display = value.toString();
    }
  }

  return (
    <div
      className={`cell ${isRevealed ? 'revealed' : 'hidden'}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {display}
    </div>
  );
};

export default Cell;