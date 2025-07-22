import { useCallback } from "react";
import axios from "axios";
import BASE_URL from "../../../config/api";

export const useConfirmBooking = (token, fetchBookings) => {
  const confirmBooking = useCallback(
    async (bookingId) => {
      try {
        const res = await axios.patch(
          `${BASE_URL}/api/bookings/${bookingId}/confirm`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("Booking confirmed successfully.");
        // Refetch bookings to update new state
        fetchBookings();
      } catch (err) {
        console.error("Failed to confirm booking", err);
      }
    },
    [token, fetchBookings]
  );

  return confirmBooking;
};
