const pool = require("../db");

const deleteBookingController = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if booking exists
    const bookingResult = await pool.query(
      "SELECT * FROM bookings WHERE booking_id = $1",
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Delete the booking
    await pool.query("DELETE FROM bookings WHERE booking_id = $1", [bookingId]);

    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ message: "Server error cancelling booking" });
  }
};

module.exports = deleteBookingController;
