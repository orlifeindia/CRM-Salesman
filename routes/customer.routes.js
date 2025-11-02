const express = require('express');
const router = express.Router();

// Pool variable (will be injected from server.js)
let pool;

// Function to inject database pool
function setPool(dbPool) {
  pool = dbPool;
}

// ========== GET ALL CUSTOMERS ==========
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');

    console.log('✅ Customers fetched:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// ========== GET SINGLE CUSTOMER ==========
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// ========== ADD NEW CUSTOMER ==========
router.post('/', async (req, res) => {
  try {
    const {
      name, mobile, email, address, city, district, state, pincode,
      distributor_code, docket_no, shipping_details, status
    } = req.body;

    const result = await pool.query(
      `INSERT INTO customers 
       (name, mobile, email, address, city, district, state, pincode, 
        distributor_code, docket_no, shipping_details, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) 
       RETURNING *`,
      [name, mobile, email, address, city, district, state, pincode,
       distributor_code, docket_no, shipping_details, status || 'Active']
    );

    console.log('✅ Customer added:', result.rows[0].name);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error adding customer:', err);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// ========== UPDATE CUSTOMER ==========
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, mobile, email, address, city, district, state, pincode,
      distributor_code, docket_no, shipping_details, status
    } = req.body;

    const result = await pool.query(
      `UPDATE customers 
       SET name=$1, mobile=$2, email=$3, address=$4, city=$5, district=$6, 
           state=$7, pincode=$8, distributor_code=$9, docket_no=$10, 
           shipping_details=$11, status=$12, updated_at=NOW()
       WHERE id=$13 
       RETURNING *`,
      [name, mobile, email, address, city, district, state, pincode,
       distributor_code, docket_no, shipping_details, status || 'Active', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log('✅ Customer updated:', result.rows[0].name);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error updating customer:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// ========== DELETE CUSTOMER ==========
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log('✅ Customer deleted:', id);
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting customer:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// ========== EXPORT ==========
module.exports = {
  setPool: (p) => pool = p,
  router
};
