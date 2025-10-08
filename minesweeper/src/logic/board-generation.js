// Board generation logic (client-side, but we'll use backend for actual game)
export function generateBoard(rows, cols, mines) {
  const board = Array.from({ length: rows }, () => Array(cols).fill(0));
  const minePositions = [];
  while (minePositions.length < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const pos = `${r}-${c}`;
    if (!minePositions.includes(pos)) {
      minePositions.push(pos);
      board[r][c] = -1;
    }
  }
  // Calculate numbers
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === -1) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === -1) {
            count++;
          }
        }
      }
      board[r][c] = count;
    }
  }
  return board;
}