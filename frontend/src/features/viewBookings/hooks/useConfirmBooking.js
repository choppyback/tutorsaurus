import { useCallback } from "react";
import { confirmBooking } from "../api/confirmBooking";

export const useConfirmBooking = (token, fetchBookings) => {
  const handleConfrim = useCallback(
    async (bookingId) => {
      try {
        const res = await confirmBooking(bookingId, token);
        alert(res.message);
        // Refetch bookings to update new state
        fetchBookings();
      } catch (err) {
        console.error("Failed to confirm booking", err);
      }
    },
    [token, fetchBookings]
  );

  return handleConfrim;
};
