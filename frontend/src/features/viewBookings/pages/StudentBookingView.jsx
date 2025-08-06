import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import axios from "axios";
import BASE_URL from "../../../config/api";
import NavBar from "../../../shared/components/NavBar";
import StatusFilter from "../components/StatusFilter";
import BookingCard from "../components/BookingCard";
import ReviewDialog from "../../reviewsRatings/components/ReviewDialog";
import ChatBox from "../../chat/components/ChatBox";

// HOOKS
import { useCancelBooking } from "../hooks/useCancelBooking";
import { useLeaveReview } from "../../reviewsRatings/hooks/useLeaveReview";

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

  const [openChat, setOpenChat] = useState(null); // { tutorId, conversationId }

  // HOOKS
  // ==========================
  const handleCancel = useCancelBooking(token, fetchBookings);
  const { leaveReview } = useLeaveReview(token, fetchBookings);

  // EVENT HANDLERS
  // ==========================
  async function fetchBookings() {
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
  }

  function handleOpenReviewDialog(booking) {
    setSelectedBooking(booking);
    setDialogOpen(true);
  }

  async function handleChatToggle(tutorId) {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/chat/start`,
        { tutorId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenChat({ tutorId, conversationId: res.data.conversation_id });
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  }

  // EFFECTS
  // ==========================
  useEffect(() => {
    fetchBookings();
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
                  onMessage={handleChatToggle}
                />
              ))}
            </Stack>
          )}

          {/* REVIEW DIALOG */}
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

          {/* CHATBOX */}
          {openChat && (
            <ChatBox
              open
              onClose={() => setOpenChat(null)}
              conversationId={openChat.conversationId}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
