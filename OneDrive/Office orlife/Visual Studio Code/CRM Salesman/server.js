const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection details
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Orlife@2025',
  port: 5432,
});

client.connect()
  .then(() => console.log('PostgreSQL connected!'))
  .catch(err => console.error('Connection error:', err));

// ================= CUSTOMER ROUTES (with DB)
app.post('/customers', async (req, res) => {
  try {
    const { name, email, mobile, status } = req.body;
    await client.query(
      'INSERT INTO customers (name, email, mobile, status) VALUES ($1, $2, $3, $4)',
      [name, email, mobile, status]
    );
    res.json({ status: 'Customer added successfully!' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});

app.get('/customers', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});
// ========== CUSTOMER UPDATE (PUT) ==========
app.put('/customers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, mobile, status } = req.body;
    await client.query(
      'UPDATE customers SET name=$1, email=$2, mobile=$3, status=$4 WHERE id=$5',
      [name, email, mobile, status, id]
    );
    res.json({ status: 'Customer updated successfully!' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});

// ========== CUSTOMER DELETE (DELETE) ==========
app.delete('/customers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await client.query('DELETE FROM customers WHERE id=$1', [id]);
    res.json({ status: 'Customer deleted successfully!' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});


// ================= LEAD ROUTES (with DB)
// Make sure you have "leads" table in your DB with columns: name, email, mobile, status

app.post('/leads', async (req, res) => {
  try {
    const { name, mobile, email, status = 'New' } = req.body;
    await client.query(
      'INSERT INTO leads (name, mobile, email, status) VALUES ($1, $2, $3, $4)',
      [name, mobile, email, status]
    );
    res.json({ status: 'Lead added successfully!' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});

app.get('/leads', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM leads');
    res.json(result.rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});

// ================ OTHER ROUTES — EDIT/DELETE AS NEEDED (शुरुआत में ऊपर वाले से काम चल जाएगा)
// ========== LEAD UPDATE (PUT) ==========
app.put('/leads/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, mobile, email, status } = req.body;
    await client.query(
      'UPDATE leads SET name=$1, mobile=$2, email=$3, status=$4 WHERE id=$5',
      [name, mobile, email, status, id]
    );
    res.json({ status: 'Lead updated successfully!' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});

// ========== LEAD DELETE (DELETE) ==========
app.delete('/leads/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await client.query('DELETE FROM leads WHERE id=$1', [id]);
    res.json({ status: 'Lead deleted successfully!' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error', dbError: err });
  }
});

// Only one listen!
app.listen(3001, () => {
  console.log('🚀 Server चल गया! http://localhost:3001 पर');
});
