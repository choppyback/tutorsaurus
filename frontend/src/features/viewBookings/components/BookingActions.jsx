// viewBookings/components/BookingActions.jsx

import { Button, Stack, Typography } from "@mui/material";

const actionButtonStyles = {
  red: {
    backgroundColor: "#e13a2eff",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#b03030ff",
    },
    fontWeight: "bold",
    fontSize: "13px",
  },
  blue: {
    backgroundColor: "#3a86e1ff",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#2a6db0ff",
    },
    fontWeight: "bold",
    fontSize: "13px",
  },
  green: {
    backgroundColor: "#4caf50",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
    fontWeight: "bold",
    fontSize: "13px",
  },
};

export default function BookingActions({
  booking,
  userRole,
  onCancel,
  onConfirm,
  onComplete,
  onReview,
}) {
  if (userRole === "tutor") {
    if (booking.status === "pending") {
      return (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => onConfirm(booking.booking_id)}
            sx={actionButtonStyles.blue}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onCancel(booking.booking_id)}
            sx={actionButtonStyles.red}
          >
            Cancel
          </Button>
        </Stack>
      );
    }

    if (booking.status === "confirmed") {
      return (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => onComplete(booking.booking_id)}
            sx={actionButtonStyles.green}
          >
            Complete
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onCancel(booking.booking_id)}
            sx={actionButtonStyles.red}
          >
            Cancel
          </Button>
        </Stack>
      );
    }

    if (booking.status === "completed" && booking.has_reviewed) {
      return (
        <Button
          variant="outlined"
          onClick={() => onReview(booking)}
          sx={actionButtonStyles.blue}
        >
          View Review
        </Button>
      );
    }
  }

  if (userRole === "student") {
    if (booking.status === "completed" && !booking.has_reviewed) {
      return (
        <Button
          variant="outlined"
          onClick={() => onReview(booking)}
          sx={actionButtonStyles.blue}
        >
          Leave Review
        </Button>
      );
    }
    if (booking.status === "pending" || booking.status === "confirmed") {
      return (
        <Button
          variant="outlined"
          color="error"
          onClick={() => onCancel(booking.booking_id)}
          sx={actionButtonStyles.red}
        >
          Cancel
        </Button>
      );
    }
  }

  return (
    <Typography color="gray" fontSize="13px" fontWeight="bold">
      No actions available
    </Typography>
  );
}
