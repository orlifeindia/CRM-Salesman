// server/routes/units.routes.js
const express = require('express');
const router = express.Router();

let pool;
function setPool(dbPool) { 
    pool = dbPool; 
}

// POST - Create Unit
router.post('/units', async (req, res) => {
    const { unit_name, alias, print_name, uqc } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO units (unit_name, alias, print_name, uqc) VALUES ($1, $2, $3, $4) RETURNING *',
            [unit_name, alias, print_name, uqc]
        );
        res.json({ success: true, unit: result.rows[0] });
    } catch (err) {
        console.error('Unit creation error:', err);
        res.status(500).json({ error: "Error creating unit" });
    }
});

// GET - All Units
router.get('/units', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM units ORDER BY unit_name');
        res.json(result.rows);
    } catch (err) {
        console.error('Unit fetch error:', err);
        res.status(500).json({ error: "Error fetching units" });
    }
});

module.exports = { router, setPool };
