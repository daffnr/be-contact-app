require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { name, telp, email } = req.body;
    const query =
      "UPDATE contacts SET name = ?, telp = ?, email = ? WHERE id = ?";
    db.query(query, [name, telp, email, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Contact updated" });
    });
  } else if (req.method === "DELETE") {
    const query = "DELETE FROM contacts WHERE id = ?";
    db.query(query, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Contact deleted" });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
