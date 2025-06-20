const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const { module } = req.query;
  try {
    const result = await db.query(
      `SELECT * FROM users 
       WHERE role = 'tutor' 
       AND (
         $1 = ANY(modules_taught) 
         OR EXISTS (SELECT 1 FROM unnest(modules_taught) AS mod WHERE mod ILIKE $2)
       )`,
      [module, `%${module}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
