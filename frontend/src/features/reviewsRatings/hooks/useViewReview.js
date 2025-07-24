import { useCallback } from "react";
import { viewReview } from "../api/viewReview";

export const useViewReview = (token) => {
  return useCallback(
    async (bookingId) => {
      try {
        const res = await viewReview(bookingId, token);
        return res;
      } catch (err) {
        const message = err?.message || "Failed to fetch review.";
        alert(message);
        throw err; // rethrow so caller can handle too if needed
      }
    },
    [token]
  );
};
