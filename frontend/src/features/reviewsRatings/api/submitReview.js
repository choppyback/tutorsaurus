import axios from "axios";
import BASE_URL from "../../../config/api";

export async function submitReview({
  booking_id,
  tutor_id,
  score,
  review,
  token,
}) {
  const res = await axios.post(
    `${BASE_URL}/api/reviews`,
    {
      booking_id,
      tutor_id,
      score,
      review,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
