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

function solve(sudoku, r, c) {
  if (sudoku)
    if (r === 9) {
      return true;
    } else if (c === 9) {
      return solve(sudoku, r + 1, 0);
    } else if (sudoku[r][c] !== 0) {
      return solve(sudoku, r, c + 1);
    } else {
      for (let k = 1; k <= 10; k++) {
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

function notUnique(sudoku) {
  for (let i = 0; i < 20; i++) {
  var randomNumber = Math.floor(Math.random() * 81) + 1;
  var row = Math.floor(randomNumber / 9)
  if (row === 9) row--
  var col = randomNumber - (row * 9)
  if (col ===9 ) col--
  console.log(row + " " + col)
  sudoku[row][col] = 0; 
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

function generateSudoku() {
  var sudoku = emptySudoku();
  solve(sudoku, 0 ,0);
  return sudoku;
}

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.get("/api", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error("Error querying data:", err.message);
    } else {
      let s = generateSudoku();
      notUnique(s)
      res.json({ result: s });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
