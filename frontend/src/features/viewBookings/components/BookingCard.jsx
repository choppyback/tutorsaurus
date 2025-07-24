import { Box, Typography } from "@mui/material";
import { formatDate } from "../../../shared/utils/formatDate";
import BookingActions from "./BookingActions";

export default function BookingCard({
  booking,
  userRole,
  onCancel,
  onConfirm,
  onComplete,
  onReview,
}) {
  const statusColor =
    booking.status === "confirmed" || booking.status === "completed"
      ? "green"
      : booking.status === "pending"
      ? "orange"
      : "red";

  return (
    <Box
      key={booking.booking_id}
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "center",
        borderRadius: 3,
        p: 3,
        bgcolor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Box display="flex" justifyContent="space-between" flex={1}>
        {/* Booking details */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography fontWeight="bold" fontSize="19px">
            {booking.module_name}
          </Typography>
          <Typography>
            <strong>Date:</strong> {formatDate(booking.date)}
          </Typography>
          <Typography>
            <strong>Time:</strong> {booking.start_time} – {booking.end_time}
          </Typography>
          <Typography>
            <strong>{userRole === "tutor" ? "Student" : "Tutor"}:</strong>{" "}
            {userRole === "tutor" ? booking.student_name : booking.tutor_name}
          </Typography>
          <Typography>
            <strong>Status:</strong>{" "}
            <Box
              component="span"
              sx={{ color: statusColor, fontWeight: "bold" }}
            >
              {booking.status}
            </Box>
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BookingActions
            booking={booking}
            userRole={userRole}
            onCancel={onCancel}
            onConfirm={onConfirm}
            onComplete={onComplete}
            onReview={onReview}
          />
        </Box>
      </Box>
    </Box>
  );
}
