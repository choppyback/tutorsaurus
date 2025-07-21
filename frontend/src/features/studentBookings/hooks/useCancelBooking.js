import { useCallback } from "react";
import { cancelBooking } from "../api/cancelBooking";

export const useCancelBooking = (token, setBookings) => {
  const handleCancel = useCallback(
    async (bookingId) => {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this booking?"
      );
      if (!confirmCancel) return;

      try {
        await cancelBooking(bookingId, token);
        setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
        alert("Booking cancelled successfully.");
      } catch (err) {
        console.error("Failed to cancel booking", err);
        alert("Failed to cancel booking. Please try again.");
      }
    },
    [token, setBookings]
  );

  return handleCancel;
};
