const express = require('express');
const router = express.Router();
let pool;

function setPool(dbPool) { pool = dbPool; }

// Migration route
router.get('/migrate-status', async (req, res) => {
    try {
        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending'`);
        await pool.query(`UPDATE orders SET status = 'Pending' WHERE status IS NULL`);
        res.json({ success: true, message: 'Status column added!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ALL ORDERS
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// GET SINGLE ORDER
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// CREATE ORDER
router.post('/', async (req, res) => {
    try {
        const { party_name, order_date, quotation_no, narration, items, grand_total } = req.body;
        
        const result = await pool.query(
            `INSERT INTO orders (party_name, order_date, quotation_no, narration, items, grand_total, status, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, 'Pending', NOW(), NOW()) 
             RETURNING *`,
            [party_name, order_date, quotation_no, narration, JSON.stringify(items), grand_total]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// UPDATE ORDER - FIXED
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        
        console.log('Update request:', body);
        
        // Get current order
        const existing = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const current = existing.rows[0];
        
        // Only update fields that exist in database
        const updates = [];
        const values = [];
        let paramCount = 1;
        
        // Handle items update
        if (body.items !== undefined) {
            updates.push(`items = $${paramCount++}`);
            values.push(typeof body.items === 'string' ? body.items : JSON.stringify(body.items));
        }
        
        // Handle grand_total or total_amount
        if (body.grand_total !== undefined) {
            // Check if column is 'total_amount' or 'grand_total'
            if (current.hasOwnProperty('total_amount')) {
                updates.push(`total_amount = $${paramCount++}`);
            } else {
                updates.push(`grand_total = $${paramCount++}`);
            }
            values.push(body.grand_total);
        }
        
        // Handle status
        if (body.status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(body.status);
        }
        
        // Always update updated_at
        updates.push(`updated_at = NOW()`);
        
        // Add ID as last parameter
        values.push(id);
        
        if (updates.length === 1) { // Only updated_at
            return res.json(current); // No changes needed
        }
        
        const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        
        console.log('Query:', query);
        console.log('Values:', values);
        
        const result = await pool.query(query, values);
        
        res.json(result.rows[0]);
        
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update order', details: error.message });
    }
});

// DELETE ORDER
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
module.exports = { router, setPool };



