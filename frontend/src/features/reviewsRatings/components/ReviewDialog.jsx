import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Stack,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function ReviewDialog({
  open,
  booking,
  onClose,
  onSubmit,
  readOnly = false,
  initialRating = 0,
  initialComment = "",
}) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (readOnly) {
      setRating(initialRating);
      setComment(initialComment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [initialRating, initialComment, readOnly, open]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        booking_id: booking.booking_id,
        tutor_id: booking.tutor_id,
        rating,
        comment,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          padding: 3,
          bgcolor: "#fafafa",
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: 20, mb: 1, px: 0 }}>
          {readOnly ? "Your Review for" : "Leave a Review for"}{" "}
          <strong>{booking?.tutor_name}</strong>
        </DialogTitle>

        <DialogContent sx={{ px: 0 }}>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontWeight="bold">Rating:</Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => !readOnly && setRating(newValue)}
                readOnly={readOnly}
              />
            </Box>

            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) => !readOnly && setComment(e.target.value)}
              inputProps={{ maxLength: 250 }} // limit to 250 characters
              helperText={`${comment.length}/250 characters`} // show count
              InputProps={{
                readOnly,
                sx: { backgroundColor: "#fff", borderRadius: 1 },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 0, mt: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
            Close
          </Button>
          {!readOnly && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={rating === 0}
              sx={{
                backgroundColor: "#A2CB75",
                color: "#294A29",
                "&:hover": {
                  backgroundColor: "#95bd68",
                },
                fontWeight: "bold",
                borderRadius: 3,
                px: 4,
              }}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Paper>
    </Dialog>
  );
}
