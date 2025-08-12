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
import { useConfirmBooking } from "../hooks/useConfirmBooking";
import { useCompletedBooking } from "../hooks/useCompletedBooking";
import { useViewReview } from "../../reviewsRatings/hooks/useViewReview";

// STYLES
import styles from "./TutorBookingView";

export default function TutorBookingView() {
  // STATE
  // ==========================
  const token = localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [review, setReview] = useState(null);
  const [openChat, setOpenChat] = useState(null); // { studentId, conversationId }

  // HOOKS
  // ==========================
  const handleCancel = useCancelBooking(token, fetchBookings);
  const handleConfirm = useConfirmBooking(token, fetchBookings);
  const handleComplete = useCompletedBooking(token, fetchBookings);
  const fetchReview = useViewReview(token);

  // EVENT HANDLERS
  // ==========================
  async function fetchBookings() {
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
  }

  async function handleChatToggle(booking) {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/chat/start`,
        { studentId: booking.student_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenChat({
        userId: booking.tutor_id,
        conversationId: res.data.conversation_id,
        name: booking.student_name,
        profile_pic: booking.student_profile_pic,
      });
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  }

  async function handleViewReview(booking) {
    setSelectedBooking(booking);
    setDialogOpen(true);
    try {
      const data = await fetchReview(booking.booking_id);
      setReview(data);
    } catch (err) {
      console.error("Failed to fetch review:", err);
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
                  key={booking.booking_id}
                  booking={booking}
                  userRole="tutor"
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                  onComplete={handleComplete}
                  onReview={handleViewReview}
                  onMessage={handleChatToggle}
                />
              ))}
            </Stack>
          )}

          {/* REVIEW DIALOG */}
          {selectedBooking && (
            <ReviewDialog
              open={dialogOpen}
              nameToDisplay={selectedBooking.student_name}
              booking={selectedBooking}
              onClose={() => setDialogOpen(false)}
              readOnly={true}
              initialRating={review?.score}
              initialComment={review?.review}
            />
          )}

          {/* CHATBOX */}
          {openChat && (
            <ChatBox
              open
              onClose={() => setOpenChat(null)}
              userId={openChat.userId}
              conversationId={openChat.conversationId}
              name={openChat.name}
              profile_pic={openChat.profile_pic}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
