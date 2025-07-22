import axios from "axios";
import BASE_URL from "../../../config/api";

export const useConfirmBooking = (token, fetchBookings) => {
  const confirmBooking = async (bookingId) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/bookings/${bookingId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking confirmed successfully.");
      fetchBookings();
    } catch (err) {
      console.error("Failed to confirm booking", err);
    }
  };

  return confirmBooking;
};
