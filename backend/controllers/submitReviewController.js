const pool = require("../db");

const submitReviewController = async (req, res) => {
  const { booking_id, tutor_id, score, review } = req.body;
  const student_id = req.user; // from authenticate middleware

  if (!booking_id || !tutor_id || !score || !review) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check if review already exists for this booking
    const existing = await pool.query(
      "SELECT * FROM reviews WHERE booking_id = $1",
      [booking_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Review already submitted." });
    }

    // Insert review
    await pool.query(
      `INSERT INTO reviews (booking_id, tutor_id, student_id, review)
       VALUES ($1, $2, $3, $4)`,
      [booking_id, tutor_id, student_id, review]
    );

    // Insert rating
    await pool.query(
      `INSERT INTO ratings (booking_id, tutor_id, student_id, score)
       VALUES ($1, $2, $3, $4)`,
      [booking_id, tutor_id, student_id, score]
    );

    res.status(201).json({ message: "Review submitted successfully." });
  } catch (err) {
    console.error("Error submitting review:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = submitReviewController;
