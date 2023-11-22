// server/index.js
import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
const jsonParser = bodyParser.json();
import * as solver from "./solver.js";

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
app.use(cors());

app.get("/sudoku", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error("Error querying data:", err.message);
    } else {
      let sudoku = solver.emptySudoku();
      solver.fillSudoku(sudoku);
      solver.diff(sudoku);
      console.log(solver.unique(sudoku, 0, 0, 0));
      // solve(sudoku, 0, 0);
      res.json({ result: sudoku });
    }
  });
});

app.post("/solution", jsonParser, (req, res) => {
  console.log(req.body);
  let solution = solver.solve(req.body, 0, 0);
  res.json({ result: req.body });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
