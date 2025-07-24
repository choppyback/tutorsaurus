import axios from "axios";
import BASE_URL from "../../../config/api";

export const completeBooking = async (bookingId, token) => {
  const res = await axios.patch(
    `${BASE_URL}/api/bookings/${bookingId}/complete`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};
