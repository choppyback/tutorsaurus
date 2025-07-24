import { useCallback } from "react";
import { viewReview } from "../api/viewReview";

export const useViewReview = (token) => {
  return useCallback(
    async (bookingId) => {
      return await viewReview(bookingId, token);
    },
    [token]
  );
};
