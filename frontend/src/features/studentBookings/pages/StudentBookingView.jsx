import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import BASE_URL from "../../../config/api";
import { formatDate } from "../../../shared/utils/formatDate";
import NavBar from "../../../shared/components/NavBar";

import styles from "./StudentBookingView";

export default function StudentBookingView() {
  const token = localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/bookings/student/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={styles.page}>
        <Box sx={{ px: "90px", pt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Your Bookings
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : bookings.length === 0 ? (
            <Typography>No bookings found.</Typography>
          ) : (
            <Stack spacing={3}>
              {bookings.map((booking) => (
                <Box key={booking.booking_id} sx={styles.card}>
                  <Box
                    flex={1}
                    display="flex"
                    justifyContent="space-between"
                    pr={3}
                  >
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography fontWeight="bold" fontSize="19px">
                        {booking.module_name}
                      </Typography>

                      <Typography fontSize="15px">
                        <Box component="span" fontWeight="bold">
                          Date:
                        </Box>{" "}
                        {formatDate(booking.date)}
                      </Typography>

                      <Typography fontSize="15px">
                        <Box component="span" fontWeight="bold">
                          Time:
                        </Box>{" "}
                        {booking.start_time} – {booking.end_time}
                      </Typography>

                      <Typography fontSize="15px">
                        <Box component="span" fontWeight="bold">
                          Tutor:
                        </Box>{" "}
                        {booking.tutor_name}
                      </Typography>

                      <Typography fontSize="15px">
                        <Box component="span" fontWeight="bold">
                          Status:
                        </Box>{" "}
                        <Box
                          component="span"
                          sx={{
                            color:
                              booking.status === "confirmed"
                                ? "green"
                                : booking.status === "pending"
                                ? "orange"
                                : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {booking.status}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      variant="outlined"
                      sx={styles.viewButton}
                      onClick={() =>
                        alert(`Viewing booking #${booking.booking_id}`)
                      }
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}
