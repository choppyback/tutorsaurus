import { useCallback } from "react";
import { cancelBooking } from "../api/cancelBooking";

export const useCancelBooking = (token, fetchBookings) => {
  const handleCancel = useCallback(
    async (bookingId) => {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this booking?"
      );
      if (!confirmCancel) return;

      try {
        const res = await cancelBooking(bookingId, token);
        fetchBookings();
        alert(res.message);
      } catch (err) {
        console.error("Failed to cancel booking", err);
        alert("Failed to cancel booking. Please try again.");
      }
    },
    [token, fetchBookings]
  );

  return handleCancel;
};
