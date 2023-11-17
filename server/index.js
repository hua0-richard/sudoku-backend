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

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
  )
`;

// Define the SQL statement to insert data into the table
const insertDataQuery = `
  INSERT INTO users (name, age) VALUES
  ('John Doe', 25),
  ('Jane Doe', 30),
  ('Bob Smith', 22)
`;

// Execute the SQL statement to create the table
db.run(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
    return;
  }

  // Execute the SQL statement to insert data into the table
  db.run(insertDataQuery, (err) => {
    if (err) {
      console.error('Error inserting data:', err.message);
    } else {
      console.log('Data inserted successfully');

      // Query the table to retrieve the inserted data
      db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          console.error('Error querying data:', err.message);
        } else {
          console.log('Retrieved data:');
          console.log(rows);
        }

        // // Close the database connection
        // db.close();
      });
    }
  });
});

app.get("/api", (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error querying data:', err.message);
    } else {
      console.log('Retrieved data:');
      console.log(rows);
      res.json({result: rows});
    }
});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

