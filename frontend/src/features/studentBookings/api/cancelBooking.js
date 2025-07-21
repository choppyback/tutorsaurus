import axios from "axios";
import BASE_URL from "../../../config/api";

export const cancelBooking = async (bookingId, token) => {
  return await axios.delete(`${BASE_URL}/api/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
