const express = require('express');
const router = express.Router();
const axios = require('axios');
let pool;

// Pool inject function
function setPool(dbPool) { pool = dbPool; }
module.exports = { router, setPool };

// ======== GET LEADS =========
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ लीड्स लाने में गलती:', err);
    res.status(500).json({ error: 'लीड्स लाने में दिक्कत' });
  }
});

// ======== ADD LEAD ==========
router.post('/', async (req, res) => {
  try {
    const { name, mobile, email, status } = req.body;
    // Insert with email!
    const result = await pool.query(
      `INSERT INTO leads (name, mobile, email, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, mobile, email, status || 'New']
    );

    // WhatsApp भेजो (optional)
    let msg = `नमस्ते ${name}, Orlife में आपका स्वागत है!`;
    let wStatus = "WhatsApp ऑटो-रिप्लाई चला गया!";
    try {
      await axios.get('http://bhashsms.com/api/sendmsg.php', {
        params: { user: "Babulal_BW", pass: "123456", sender: "Orlife india", phone: mobile, text: msg, priority: "wa", type: "normal" }
      });
    } catch(e) { wStatus = "WhatsApp ऑटो-रिप्लाई फेल!"; }
    res.status(201).json({ ...result.rows[0], msg: wStatus });
  } catch (err) {
    console.error('❌ Lead add error:', err);
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

// ======== UPDATE LEAD ==========
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, status } = req.body;
    const result = await pool.query(
      `UPDATE leads 
       SET name=$1, mobile=$2, email=$3, status=$4
       WHERE id=$5 RETURNING *`,
      [name, mobile, email, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Lead update error:', err);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// ======== DELETE LEAD ==========
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM leads WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    console.error('❌ Lead delete error:', err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});
