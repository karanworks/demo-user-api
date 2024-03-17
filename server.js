const express = require("express");
const app = express();

app.use(express.json());

const { createConnection } = require("mysql");

const mySQLConnection = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user",
  connectionLimit: 2,
});

const tableName = "register";

mySQLConnection.query(
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  (err, result, fields) => {
    if (err) {
      console.log("Database me error aa gya ji ->", err);
      return;
    }

    return console.log(result);
  }
);

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const query = `INSERT INTO register (username, email, password) VALUES (?, ?, ?)`;

  mySQLConnection.query(
    query,
    [username, email, password],
    (err, result, fields) => {
      if (err) {
        console.log("error while creating user -> ", err);
        return;
      }
      console.log("registration successful ->", result);
    }
  );

  res.json({ message: "User created!" });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM register WHERE email = ? AND password = ?`;

  mySQLConnection.query(query, [email, password], (err, result, fields) => {
    if (err) {
      console.log("error while creating user -> ", err);
      return;
    }
    console.log("registration successful ->", result);

    if (result.length > 0) {
      const user = result[0];

      res.status(200).json({ message: "User logged in", user });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

app.listen(3001, () => {
  console.log("Server listening at port no 3001");
});
