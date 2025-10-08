import React, { useState, useEffect } from 'react';
import GameScreen from './gamescreen/game';

const Minesweeper = ({ user }) => {
  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);

  const startNewGame = async (rows, cols, mines) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/games/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rows, cols, mines }),
    });
    const data = await response.json();
    setGameId(data.game_id);
    setGame({
      board: data.board,
      revealed: data.revealed,
      flagged: data.flagged,
      rows,
      cols,
      mines,
      status: 'ongoing',
    });
  };

  const revealCell = async (row, col) => {
    if (!gameId) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/games/${gameId}/reveal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ row, col }),
    });
    const data = await response.json();
    setGame(prev => ({
      ...prev,
      revealed: data.revealed,
      status: data.status,
    }));
  };

  const flagCell = async (row, col) => {
    if (!gameId) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/games/${gameId}/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ row, col }),
    });
    const data = await response.json();
    setGame(prev => ({
      ...prev,
      flagged: data.flagged,
    }));
  };

  return (
    <div>
      <h1>Minesweeper</h1>
      {!game ? (
        <div>
          <button onClick={() => startNewGame(9, 9, 10)}>Easy</button>
          <button onClick={() => startNewGame(16, 16, 40)}>Medium</button>
          <button onClick={() => startNewGame(16, 30, 99)}>Hard</button>
        </div>
      ) : (
        <GameScreen
          game={game}
          onReveal={revealCell}
          onFlag={flagCell}
          onNewGame={() => setGame(null)}
        />
      )}
    </div>
  );
};

export default Minesweeper;