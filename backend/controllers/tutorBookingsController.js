const pool = require("../db");

const tutorBookingsController = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  try {
    const result = await pool.query(
      "SELECT start_time FROM bookings WHERE tutor_id = $1 AND date = $2 AND status != 'cancelled'",
      [id, date]
    );
    res.json(result.rows); // [{ start_time: '13:00:00' }, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

module.exports = tutorBookingsController;
