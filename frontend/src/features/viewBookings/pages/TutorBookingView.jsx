import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import axios from "axios";
import BASE_URL from "../../../config/api";
import NavBar from "../../../shared/components/NavBar";
import StatusFilter from "../components/StatusFilter";
import BookingCard from "../components/BookingCard";

// HOOKS
import { useCancelBooking } from "../hooks/useCancelBooking";
import { useConfirmBooking } from "../hooks/useConfirmBooking";

// STYLES
import styles from "./StudentBookingView";

export default function TutorBookingView() {
  const token = localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const handleCancel = useCancelBooking(token, setBookings);
  const handleConfirm = useConfirmBooking(token, setBookings);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/bookings/tutor/`, {
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

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  return (
    <>
      <NavBar />
      <Box sx={styles.page}>
        <Box sx={{ px: "90px", p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Bookings You've Received
          </Typography>

          <StatusFilter active={activeFilter} onChange={setActiveFilter} />

          {loading ? (
            <CircularProgress />
          ) : filteredBookings.length === 0 ? (
            <Typography>No bookings found.</Typography>
          ) : (
            <Stack spacing={3}>
              {filteredBookings.map((booking) => (
                <BookingCard
                  booking={booking}
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                  // onComplete={handleComplete}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}
