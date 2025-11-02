const express = require('express');
const router = express.Router();

let pool;
function setPool(dbPool) { pool = dbPool; }

// POST /api/login route - FINAL CODE
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // admin_users table se user check karo
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1 AND active = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = result.rows[0];
    // Test ke liye plain password compare, production me bcrypt lagao
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({ success: true, user: { user_id: user.user_id, username: user.username, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = { router, setPool };
