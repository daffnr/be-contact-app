require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export default function handler(req, res) {
  if (req.method === "GET") {
    const query = "SELECT id, name, telp, email FROM contacts";
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  } else if (req.method === "POST") {
    const { name, telp, email } = req.body;
    const query = "INSERT INTO contacts (name, telp, email) VALUES (?, ?, ?)";
    db.query(query, [name, telp, email], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Contact added", id: results.insertId });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
