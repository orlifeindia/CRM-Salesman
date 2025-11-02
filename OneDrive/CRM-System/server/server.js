// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (Optional - for frontend)
app.use(express.static(path.join(__dirname, '../')));

// ========== IMPORT ROUTES ==========
const customerRoutes = require('./routes/customer.routes');
const leadRoutes = require('./routes/lead.routes');
const orderRoutes = require('./routes/order.routes');

// ========== USE ROUTES ==========
app.use('/api/customers', customerRoutes);
app.use('/leads', leadRoutes);
app.use('/orders', orderRoutes);

// ========== HOME ROUTE ==========
app.get('/', (req, res) => {
  res.json({
    message: 'CRM API Server',
    status: 'Running',
    endpoints: {
      customers: '/api/customers',
      leads: '/leads',
      orders: '/orders',
      health: '/health'
    }
  });
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ========== ERROR HANDLERS ==========
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// ========== START SERVER ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    🚀 CRM Server Running               ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                         ║
║  URL: http://localhost:${PORT}         ║
╠════════════════════════════════════════╣
║  📊 API Endpoints:                     ║
║  → Customers: /api/customers           ║
║  → Leads: /leads                       ║
║  → Orders: /orders                     ║
║  → Health: /health                     ║
╚════════════════════════════════════════╝
  `);
});
