const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Connection error: ", err);
    return;
  }
  console.log("Connected to the database");
});

module.exports = (req, res) => {
  if (req.method === 'GET') {
    const query = 'SELECT id, name, telp, email FROM contacts';  
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  } else if (req.method === 'POST') {
    const { name, telp, email } = req.body;
    const query = 'INSERT INTO contacts (name, telp, email) VALUES (?, ?, ?)';
    db.query(query, [name, telp, email], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Contact added', id: results.insertId });
    });
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { name, telp, email } = req.body;
    const query = 'UPDATE contacts SET name = ?, telp = ?, email = ? WHERE id = ?';
    db.query(query, [name, telp, email, id], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Contact updated' });
    });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const query = 'DELETE FROM contacts WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Contact deleted' });
    });
  } else {
    res.status(405).send({ message: "Method Not Allowed" });
  }
};
