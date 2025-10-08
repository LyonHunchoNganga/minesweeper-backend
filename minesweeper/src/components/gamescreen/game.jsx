import React, { useState, useEffect } from 'react';
import Board from './board';
import {useNavigate} from "react-router";

const Game = ({secondsElapsed, startGame, endGame}) => {

  const nav = useNavigate()

  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [mines, setMines] = useState(10);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [status, setStatus] = useState('');

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    startGame()
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      newGrid.push([]);
      for (let j = 0; j < cols; j++) {
        newGrid[i].push({
          mine: false,
          revealed: false,
          adjacentMines: 0,
        });
      }
    }

    let placedMines = 0;
    while (placedMines < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      if (!newGrid[randomRow][randomCol].mine) {
        newGrid[randomRow][randomCol].mine = true;
        placedMines++;
      }
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newGrid[i][j].mine) {
          newGrid[i][j].adjacentMines = countAdjacentMines(newGrid, i, j);
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setStatus('');
  };

  const countAdjacentMines = (grid, row, col) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !(i === 0 && j === 0)
        ) {
          if (grid[newRow][newCol].mine) {
            count++;
          }
        }
      }
    }
    return count;
  };

  const deepCopyGrid = (grid) => grid.map(row => row.map(cell => ({ ...cell })));

  const revealEmptyCells = (grid, row, col) => {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      grid[row][col].revealed
    ) {
      return;
    }
    grid[row][col].revealed = true;
    if (grid[row][col].adjacentMines === 0 && !grid[row][col].mine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (!(i === 0 && j === 0)) {
            revealEmptyCells(grid, row + i, col + j);
          }
        }
      }
    }
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;

    const newGrid = deepCopyGrid(grid);

    if (newGrid[row][col].mine) {
      newGrid[row][col].revealed = true;
      setGrid(newGrid);
      setGameOver(true);
      setStatus('Game Over!');
      endGame()
      return;
    }

    revealEmptyCells(newGrid, row, col);
    setGrid(newGrid);

    const allCellsRevealed = newGrid.flat().filter(cell => !cell.mine).every(cell => cell.revealed);
    if (allCellsRevealed) {
      setGameOver(true);
      setStatus('You Win!');
      endGame()
    }
  };

  return (
    <div>
      <button onClick={initializeGame}>Restart Game</button>
      <button onClick={()=>{nav("/")}}>Exit Game</button>
      <div style={{ margin: '10px 0', fontWeight: 'bold' }}>{status}</div>
      <Board grid={grid} handleCellClick={handleCellClick} gameOver={gameOver} />
    </div>
  );
};

export default Game;