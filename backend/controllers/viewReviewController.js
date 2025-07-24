const pool = require("../db");

const viewReviewController = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        r.review,
        r.created_at,
        r.tutor_id,
        r.student_id,
        rt.score
      FROM reviews r
      LEFT JOIN ratings rt 
        ON r.booking_id = rt.booking_id
      WHERE r.booking_id = $1;
      `,
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = viewReviewController;
