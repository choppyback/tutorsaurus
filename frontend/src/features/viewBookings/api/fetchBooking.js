import axios from "axios";
import BASE_URL from "../../../config/api";

export const fetchBookings = async (userRole, token) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/bookings/${userRole}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch ${userRole} bookings:`, err);
    throw err;
  }
};
