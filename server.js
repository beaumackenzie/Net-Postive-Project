const express = require('express');
const Database = require('better-sqlite3');
const app = express();
const db = new Database('net_positive_proj.sqlite');

app.use(express.json());

const cors = require('cors');
app.use(cors());



// 1. Get all hoops data
app.get('/nyc_table1', (req, res) => {
  const hoops = db.prepare('SELECT * FROM nyc_table1').all();
  res.json(hoops);
});


app.put('/nyc_table1/:id', (req, res) => {
  const { id } = req.params;
  const { has_net } = req.body;

  const result = db.prepare('UPDATE nyc_table1 SET has_net = ? WHERE id = ?').run(has_net, id);

  if (result.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Record not found' });
  }
});


app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});