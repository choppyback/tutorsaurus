const pool = require("../db");

const updateBookingStatusController = (newStatus) => async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user;

  try {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE booking_id = $1",
      [bookingId]
    );

    const booking = result.rows[0];

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.tutor_id !== userId && booking.student_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this booking" });
    }

    await pool.query("UPDATE bookings SET status = $1 WHERE booking_id = $2", [
      newStatus,
      bookingId,
    ]);

    return res
      .status(200)
      .json({ message: `Booking ${newStatus} successfully.` });
  } catch (err) {
    console.error(`Error updating booking to ${newStatus}:`, err);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

module.exports = updateBookingStatusController;
