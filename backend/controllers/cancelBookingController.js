const pool = require("../db");

const cancelBookingController = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    // Ensure the booking belongs to the user
    const result = await pool.query(
      "SELECT * FROM bookings WHERE booking_id = $1",
      [bookingId]
    );

    const booking = result.rows[0];

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking status
    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE booking_id = $1",
      [bookingId]
    );

    return res.status(200).json({ message: "Booking cancelled successfully." });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return res
      .status(500)
      .json({ message: `Error cancelling booking: ${err.message}` });
  }
};

module.exports = cancelBookingController;
