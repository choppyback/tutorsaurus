const pool = require("../db");

const studentBookingsController = async (req, res) => {
  const studentId = req.user;

  try {
    const result = await pool.query(
      `
      SELECT 
        b.booking_id,
        b.module_id,
        m.code AS module_code,
        m.title AS module_name,
        b.date,
        b.start_time,
        b.end_time,
        b.status,
        b.student_id, 
        t.user_id AS tutor_id,
        t.name AS tutor_name,
        t.profile_pic AS tutor_profile_pic,
        EXISTS (
          SELECT 1 FROM reviews r
          WHERE r.booking_id = b.booking_id
        ) AS has_reviewed
      FROM bookings b
      JOIN users t ON t.user_id = b.tutor_id
      JOIN modules m ON m.module_id = b.module_id
      WHERE b.student_id = $1
      ORDER BY b.date ASC, b.start_time ASC
      `,
      [studentId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = studentBookingsController;
