import { useState } from "react";
import { submitReview } from "../api/submitReview";

export function useLeaveReview(token, fetchBookings) {
  const [loading, setLoading] = useState(false);

  const leaveReview = async ({ booking_id, tutor_id, rating, comment }) => {
    try {
      setLoading(true);
      const res = await submitReview({
        booking_id,
        tutor_id,
        score: rating,
        review: comment,
        token,
      });
      fetchBookings();
      alert(res.message);
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return { leaveReview, loading };
}
