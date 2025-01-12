require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

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


app.get('/contacts', (req, res) => {
  const query = 'SELECT id, name, telp, email FROM contacts';  
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.post('/contacts', (req, res) => {
  const { name, telp, email } = req.body;  
  console.log('Received data:', { name, telp, email });  
  const query = 'INSERT INTO contacts (name, telp, email) VALUES (?, ?, ?)';  
  db.query(query, [name, telp, email], (err, results) => {
    if (err) {
      console.error('Error while inserting data:', err);
      return res.status(500).send(err);
    }
    res.json({ message: 'Contact added', id: results.insertId });
  });
});


app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, telp, email } = req.body;  
  const query = 'UPDATE contacts SET name = ?, telp = ?, email = ? WHERE id = ?';  
  db.query(query, [name, telp, email, id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Contact updated' });
  });
});


app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM contacts WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Contact deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
