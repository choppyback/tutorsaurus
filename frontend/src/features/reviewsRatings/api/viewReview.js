import axios from "axios";
import BASE_URL from "../../../config/api";

export const viewReview = async (bookingId, token) => {
  const res = await axios.get(`${BASE_URL}/api/reviews/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
