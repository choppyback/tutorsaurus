import { Box, Typography, Button, Stack } from "@mui/material";
import { formatDate } from "../../../shared/utils/formatDate";

export default function BookingCard({
  booking,
  onCancel,
  onConfirm,
  onComplete,
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
        {/* Left section - booking details */}
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
            <strong>Student:</strong> {booking.student_name}
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

        {/* Right section - action buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {booking.status === "pending" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => onConfirm(booking.booking_id)}
                sx={{
                  backgroundColor: "#3a86e1ff",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#2a6db0ff",
                  },
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onCancel(booking.booking_id)}
                sx={{
                  backgroundColor: "#e13a2eff",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#b03030ff",
                  },
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Cancel
              </Button>
            </Stack>
          )}

          {booking.status === "confirmed" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => onComplete(booking.booking_id)}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Complete
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onCancel(booking.booking_id)}
                sx={{
                  backgroundColor: "#e13a2eff",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#b03030ff",
                  },
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Cancel
              </Button>
            </Stack>
          )}

          {(booking.status === "cancelled" ||
            booking.status === "completed") && (
            <Typography color="gray" fontSize="13px" fontWeight="bold">
              No actions available
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
