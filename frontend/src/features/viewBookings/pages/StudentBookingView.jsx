import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import NavBar from "../../../shared/components/NavBar";
import StatusFilter from "../components/StatusFilter";
import BookingCard from "../components/BookingCard";
import ReviewDialog from "../../reviewsRatings/components/ReviewDialog";

// HOOKS
import { useCancelBooking } from "../hooks/useCancelBooking";
import { useLeaveReview } from "../../reviewsRatings/hooks/useLeaveReview";

// API
import { fetchBookings } from "../api/fetchBooking";

// STYLES
import styles from "./StudentBookingView";

export default function StudentBookingView() {
  // STATE
  // ==========================
  const token = localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // HOOKS
  // ==========================
  const handleCancel = useCancelBooking(token, fetchBookings);
  const { leaveReview } = useLeaveReview(token, fetchBookings); // renamed to match naming style

  // EVENT HANDLERS
  // ==========================
  function handleOpenReviewDialog(booking) {
    setSelectedBooking(booking);
    setDialogOpen(true);
  }

  // EFFECTS
  // ==========================
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings("student", token);
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // COMPUTED
  // ==========================
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
            Your Bookings
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
                  key={booking.booking_id}
                  booking={booking}
                  userRole="student"
                  onCancel={handleCancel}
                  onReview={handleOpenReviewDialog}
                />
              ))}
            </Stack>
          )}
          {dialogOpen && selectedBooking && (
            <ReviewDialog
              open={dialogOpen}
              nameToDisplay={selectedBooking.tutor_name}
              booking={selectedBooking}
              onClose={() => setDialogOpen(false)}
              onSubmit={leaveReview}
              readOnly={false}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
