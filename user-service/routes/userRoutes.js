const express = require("express");
const pool = require("../db");

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/email", async(req, res) => {
  try {
    const user_id = req.query.user_id; 
    const queryUserEmail = `SELECT email FROM users WHERE id = $1`;
        const userResult = await pool.query(queryUserEmail, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user_email = userResult.rows[0].email;

    res.status(200).json({user_email: user_email})
  } catch (error) {
    
  }
});

// Create a user
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
