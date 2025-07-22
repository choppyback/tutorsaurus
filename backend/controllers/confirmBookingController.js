const pool = require("../db");

const confirmBookingController = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user;

  try {
    // Fetch the booking
    const result = await pool.query(
      "SELECT * FROM bookings WHERE booking_id = $1",
      [bookingId]
    );

    const booking = result.rows[0];

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: check if user is the tutor
    if (booking.tutor_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to confirm this booking" });
    }

    // Update the booking status
    await pool.query(
      "UPDATE bookings SET status = 'confirmed' WHERE booking_id = $1",
      [bookingId]
    );

    return res.status(200).json({ message: "Booking confirmed successfully." });
  } catch (err) {
    console.error("Error confirming booking:", err);
    return res
      .status(500)
      .json({ message: `Error confirming booking: ${err.message}` });
  }
};

module.exports = confirmBookingController;
