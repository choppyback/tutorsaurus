import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const TutorReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No reviews available.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {reviews.map((review) => (
        <Paper
          key={review.review_id}
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "white",
            border: "1px solid #eee",
          }}
        >
          {/* Name + Time */}
          <Box mb={1}>
            <Typography fontWeight="bold">
              {review.reviewer_name || "Anonymous"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(review.created_at).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Review Text */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            {review.review}
          </Typography>

          {/* Stars */}
          <Box display="flex" alignItems="center" gap={0.5}>
            {[...Array(review.score)].map((_, idx) => (
              <StarIcon key={idx} fontSize="small" sx={{ color: "#f4b400" }} />
            ))}
            <Typography variant="body2" color="text.secondary">
              {review.score}/5
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default TutorReviews;
