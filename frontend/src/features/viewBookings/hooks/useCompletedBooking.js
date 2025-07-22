import { useCallback } from "react";
import axios from "axios";
import BASE_URL from "../../../config/api";

export const useCompletedBooking = (token, fetchBookings) => {
  const completedBooking = useCallback(
    async (bookingId) => {
      try {
        await axios.patch(
          `${BASE_URL}/api/bookings/${bookingId}/complete`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Booking completed.");
        // Refetch bookings to update new state
        fetchBookings();
      } catch (err) {
        console.error("Failed to complete booking", err);
      }
    },
    [token, fetchBookings]
  );

  return completedBooking;
};
