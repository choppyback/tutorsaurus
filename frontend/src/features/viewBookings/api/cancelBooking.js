import axios from "axios";
import BASE_URL from "../../../config/api";

// change booking status to cancelled

export const cancelBooking = async (bookingId, token) => {
  return await axios.patch(
    `${BASE_URL}/api/bookings/${bookingId}/cancel`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
