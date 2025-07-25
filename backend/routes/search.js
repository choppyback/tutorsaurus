const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const { module } = req.query;
  try {
    const result = await db.query(
      `SELECT 
        u.user_id, 
        u.name, 
        u.faculty, 
        u.profile_pic, 
        tm.hourly_rate, 
        t.bio,
        STRING_AGG(DISTINCT m_all.code, ', ') AS all_modules,
        ROUND(AVG(DISTINCT r.score)::numeric, 1) AS rating,
        COUNT(DISTINCT rv.review_id) AS review_count
      FROM users u
      JOIN tutors t ON u.user_id = t.user_id
      JOIN tutor_modules tm ON t.user_id = tm.user_id
      JOIN modules m_query ON tm.module_id = m_query.module_id
      JOIN tutor_modules tm_all ON tm_all.user_id = t.user_id
      JOIN modules m_all ON tm_all.module_id = m_all.module_id
      LEFT JOIN ratings r ON r.tutor_id = t.user_id
      LEFT JOIN reviews rv ON rv.tutor_id = t.user_id
      WHERE m_query.code ILIKE $1
      GROUP BY u.user_id, u.name, u.faculty, u.profile_pic, tm.hourly_rate, t.bio`,
      [`%${module}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
