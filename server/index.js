// server/index.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to Database");
});
const cors = require('cors');

// db.close((err) => {
//   if (err) { console.err(err.message)}
// })

function isValid(sudoku, r, c, k) {
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

function solve(sudoku, r, c, countsol=false) {
  if (sudoku)
    if (r === 9) {
      return true;
    } else if (c === 9) {
      return solve(sudoku, r + 1, 0, countsol);
    } else if (sudoku[r][c] !== 0) {
      return solve(sudoku, r, c + 1, countsol);
    } else {
      for (let k = 1; k < 10; k++) {
        if (isValid(sudoku, r, c, k)) {
          sudoku[r][c] = k;
          if (solve(sudoku, r, c + 1, countsol)) {
            if (countsol) {
              sudoku[r][c] = 0;
            } else {
              return true;
            }
          }
          sudoku[r][c] = 0;
        }
      }
      return false;
    }
}

function check(sudoku_solution, sudoku) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku_solution[i][j] !== sudoku[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function unique(s) {
  for (let i = 0; i < 60; i++) {
  var rA = Math.floor(Math.random() * 9); // Generates a random integer between 0 and 8
  var rB = Math.floor(Math.random() * 9); // Generates a random integer between 0 and 8
  let save =  s[rA][rB]
  let temp = [];
  for (let row of s) {
    let r = [];
    for (let column of row) {
      r.push(column)
    }
    temp.push(r)
  }
  temp[rA][rB] = 0;
  if (!solve(temp, 0 ,0, true)) {
    s[rA][rB] = save;
  }
}

}

function emptySudoku() {
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

function shuffleArray(array) {
  // Fisher-Yates (Knuth) Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function fillSudoku(board) {
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


const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.get("/api", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error("Error querying data:", err.message);
    } else {
      let s = emptySudoku();
      fillSudoku(s)
      unique(s)
      // console.log(solve(s, 0, 0, true))
      res.json({ result: s });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
