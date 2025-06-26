const router = require("express").Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT code FROM modules ORDER BY code");
    const moduleCodes = result.rows.map((row) => row.code);
    res.json(moduleCodes);
  } catch (err) {
    console.error("Error fetching modules:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
