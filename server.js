// server.js (CRM-System/server/server.js)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test route
app.get('/', (req, res) => {
  res.send('Orlife CRM backend LIVE!');
});

// Example: Customers Route
app.get('/customers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM customers ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Port listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
