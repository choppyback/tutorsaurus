import axios from "axios";
import BASE_URL from "../../../config/api";

export const useConfirmBooking = (token, setBookings) => {
  const confirmBooking = async (bookingId) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/bookings/${bookingId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local booking list with new status
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId ? { ...b, status: "confirmed" } : b
        )
      );

      alert("Booking confirmed successfully.");
    } catch (err) {
      console.error("Failed to confirm booking", err);
    }
  };

  return confirmBooking;
};
