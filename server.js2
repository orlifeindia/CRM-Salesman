const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Example endpoint: Health check
app.get('/', (req, res) => {
  res.send('Server running!');
});

// DATABASE POOL setup (local dev config, production में env var यूज़ करें)
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',      // Cloud पर env var से; local test पर fallback
  password: process.env.DB_PASS || 'postgres12345',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'crm_system'
});

// Customers Routes
// इन फाइलों का repo में करीब check करें
const customerRoutes = require('./routes/customer.routes');
customerRoutes.setPool(pool);
app.use('/api/customers', customerRoutes.router);

// Leads Routes
const leadRoutes = require('./routes/lead.routes');
leadRoutes.setPool(pool);
app.use('/api/leads', leadRoutes.router);

// Order Routes
const orderRoutes = require('./routes/order.routes');
orderRoutes.setPool(pool);
app.use('/api/orders', orderRoutes.router);

// Static files serve (optional—frontend assets public करने के लिए)
// app.use(express.static(path.join(__dirname, '..')));

// WhatsApp Auto-Reply - dummy handler (actual API integration डाल सकते हैं)
async function sendAutoReplyViaAPI(mobile, msg) {
  console.log(`[WA-MSG] Sending to ${mobile}: ${msg}`);
  // Integrate your SMS/WA API here as needed
  return true;
}

// POST /api/leads: auto-reply example (आप चाहें तो अलग route file में ले जाएं)
app.post('/api/leads', async (req, res) => {
  const { name = "Customer", mobile } = req.body;
  let autoReply = { msg: "Hello {name}, welcome to Orlife!", enabled: true };

  if (autoReply.enabled && name && mobile) {
    let msg = autoReply.msg.replace("{name}", name);
    await sendAutoReplyViaAPI(mobile, msg);
  }

  res.json({ status: "Lead added, auto-reply sent if enabled." });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
