import React from 'react';

const Cell = ({ row, col, value, revealed, flagged, onReveal, onFlag }) => {
  const handleClick = () => {
    if (!revealed && !flagged) {
      onReveal(row, col);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (!revealed) {
      onFlag(row, col);
    }
  };

  let display = '';
  if (flagged) {
    display = '🚩';
  } else if (revealed) {
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
      className={`cell ${revealed ? 'revealed' : 'hidden'}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {display}
    </div>
  );
};

export default Cell;