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

app.get("/sudoku/easy", (req, res) => {
    let sudoku = solver.emptySudoku();
    solver.fillSudoku(sudoku);
    sudoku = solver.holes(sudoku, 15);
    res.json({ result: sudoku });
});

app.get("/sudoku/medium", (req, res) => {
  let sudoku = solver.emptySudoku();
  solver.fillSudoku(sudoku);
  sudoku = solver.holes(sudoku, 30);
  res.json({ result: sudoku });
});

app.get("/sudoku/hard", (req, res) => {
  let sudoku = solver.emptySudoku();
  solver.fillSudoku(sudoku);
  sudoku = solver.holes(sudoku, 50);
  res.json({ result: sudoku });
});



app.post("/solution", jsonParser, (req, res) => {
  console.log(req.body);
  let solution = solver.solve(req.body, 0, 0);
  res.json({ result: req.body });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
