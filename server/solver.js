export function isValid(sudoku, r, c, k) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[r][i] === k) {
      return false;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (sudoku[i][c] === k) {
      return false;
    }
  }

  let r_grid = Math.floor(r / 3);
  let c_grid = Math.floor(c / 3);

  for (let i = r_grid * 3; i < r_grid * 3 + 3; i++) {
    for (let j = c_grid * 3; j < c_grid * 3 + 3; j++) {
      if (sudoku[i][j] === k) {
        return false;
      }
    }
  }

  return true;
}

export function unique(sudoku, r, c, sol) {
  if (sudoku)
    if (r === 9) {
      return sol + 1;
    } else if (c === 9) {
      return unique(sudoku, r + 1, 0, sol);
    } else if (sudoku[r][c] !== 0) {
      return unique(sudoku, r, c + 1, sol);
    } else {
      for (let k = 1; k < 10; k++) {
        if (isValid(sudoku, r, c, k) && sol < 2) {
          sudoku[r][c] = k;
          sol = unique(sudoku, r, c + 1, sol);
        }
      }
      sudoku[r][c] = 0;
      return sol;
    }
}

export function solve(sudoku, r, c) {
  if (sudoku)
    if (r === 9) {
      return true;
    } else if (c === 9) {
      return solve(sudoku, r + 1, 0);
    } else if (sudoku[r][c] !== 0) {
      return solve(sudoku, r, c + 1);
    } else {
      for (let k = 1; k < 10; k++) {
        if (isValid(sudoku, r, c, k)) {
          sudoku[r][c] = k;
          if (solve(sudoku, r, c + 1)) {
            return true;
          }
          sudoku[r][c] = 0;
        }
      }
      return false;
    }
}

export function checkZeros(sudoku, limit) {
  let count = 0;
  for (let r of sudoku) {
    for (let c of r) {
      if (c === 0) {
        count++;
      }
    }
  }
  if (count < limit) {
    console.log("fail");
    return false;
  }
  return true;
}

export function diff(sudoku) {
  while (!checkZeros(sudoku, 55)) {
    notUnique(sudoku);
  }
}

export function check(sudoku_solution, sudoku) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku_solution[i][j] !== sudoku[i][j]) {
        return false;
      }
    }
  }
  return true;
}

export function notUnique(s) {
  var rA = Math.floor(Math.random() * 9); // Generates a random integer between 0 and 8
  var rB = Math.floor(Math.random() * 9); // Generates a random integer between 0 and 8
  let temp = JSON.parse(JSON.stringify(s));
  temp[rA][rB] = 0;
  if (unique(temp, 0, 0, 0) === 1) {
    s[rA][rB] = 0;
  }
}

export function emptySudoku() {
  let sudoku = [];
  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 9; j++) {
      row.push(0);
    }
    sudoku.push(row);
  }
  return sudoku;
}

export function shuffleArray(array) {
  // Fisher-Yates (Knuth) Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function fillSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        let randomNums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of randomNums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillSudoku(board)) {
              return true;
            }
            board[row][col] = 0; // Backtrack if the current placement is invalid
          }
        }
        return false;
      }
    }
  }
  return true; // The board is filled
}
