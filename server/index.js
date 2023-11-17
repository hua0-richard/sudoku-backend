// server/index.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to Database");
});

// db.close((err) => {
//   if (err) { console.err(err.message)}
// })

const PORT = process.env.PORT || 3001;

const app = express();

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

app.get("/api", (req, res) => {
  let temp = emptySudoku();
  res.json({result: temp});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

