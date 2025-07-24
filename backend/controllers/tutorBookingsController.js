const pool = require("../db");

const tutorBookingsController = async (req, res) => {
  const tutorId = req.user;

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
        s.name AS student_name,
        t.name AS tutor_name,
        EXISTS (
          SELECT 1 FROM reviews r WHERE r.booking_id = b.booking_id
        ) AS has_reviewed
      FROM bookings b
      JOIN users s ON s.user_id = b.student_id
      JOIN modules m ON m.module_id = b.module_id
      JOIN users t ON t.user_id = b.tutor_id
      WHERE b.tutor_id = $1
      ORDER BY b.date ASC, b.start_time ASC
      `,
      [tutorId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = tutorBookingsController;
