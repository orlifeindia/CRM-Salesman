// db/connection.js
const { Client } = require('pg');

console.log('USING DB URL:', process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('✅ PostgreSQL connected!'))
  .catch(err => console.error('❌ Connection error:', err));

module.exports = client;
