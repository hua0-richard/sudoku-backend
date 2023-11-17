const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to Database");
});

const createUserTableQuery =
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT)";
const createUserDataTableQuery =
  "CREATE TABLE IF NOT EXISTS userdata(id INTEGER PRIMARY KEY, username TEXT)";

const insertCreateUserQuery = "INSERT INTO users (username) VALUES {'genesis'}";
const insertCreateUserDataTableQuery =
  "INSERT INTO userdata() VALUES {'genesis'}";

const dropTablesQuery =
  "DROP TABLE IF EXISTS users; DROP TABLE IF EXISTS userdata";

db.run(createUserTableQuery, (err) => {
  if (err) {
    console.error("Error Creating Table: ", err.message);
    return;
  } else {
    console.log("Created Table");
  }
});

db.run(createUserDataTableQuery, (err) => {
  if (err) {
    console.error("Error Creating Table: ", err.message);
    return;
  } else {
    console.log("Created Table");
  }
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
});
