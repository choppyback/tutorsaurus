const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

// GET /api/profile/:user_id
router.get("/", authorize, async (req, res) => {
  try {
    const user_id = req.user;

    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
