import { useCallback } from "react";
import { completeBooking } from "../api/completeBooking";

export const useCompletedBooking = (token, fetchBookings) => {
  const handleCompleted = useCallback(
    async (bookingId) => {
      try {
        const res = await completeBooking(bookingId, token);
        alert(res.message);
        // Refetch bookings to update new state
        fetchBookings();
      } catch (err) {
        console.error("Failed to complete booking", err);
      }
    },
    [token, fetchBookings]
  );

  return handleCompleted;
};
