import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../config/api";
import { Modal, Box, Typography, Divider } from "@mui/material";
import styles from "./TutorProfile";
import BookingInterface from "../../../../shared/components/BookingInterface";

function TutorProfile({ id, open, onClose }) {
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchTutor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/profile/${id}`);
        setTutor(res.data);
      } catch (err) {
        console.error("Error fetching tutor profile", err);
      }
    };

    fetchTutor();
  }, [id]);

  if (!tutor) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "rgb(248, 252, 247)",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Tutor Info */}
        <Box display="flex" gap={2} alignItems="flex-start">
          {/* LEFT: Tutor image */}
          <Box>
            <Box
              component="img"
              src={BASE_URL + tutor.profile_pic}
              sx={styles.tutorImage}
            />
          </Box>

          {/* RIGHT: Text Content */}
          <Box display="flex" flexDirection="column" flex={1}>
            {/* Name + Rating */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography fontWeight="bold" fontSize="24px">
                {tutor.name}
              </Typography>
              <img src="/star.svg" alt="star" width={14} height={14} />
              <Typography fontWeight="bold" fontSize="16px">
                3.50
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "16px" }}>
                (0)
              </Typography>
            </Box>

            {/* Divider line */}
            <Divider sx={styles.divider} />

            <Box display="flex" flexDirection="column" gap={2}>
              {/* Pricing */}
              <Typography fontWeight="600" fontSize="20px">
                Pricing{" "}
                {tutor.hourly_rate ? `$${tutor.hourly_rate}` : "Not provided"}
              </Typography>

              {/* Modules */}
              <Typography fontSize="15px">
                <Box component="span" fontWeight="bold">
                  Teaches:
                </Box>{" "}
                {tutor.modules_taught}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bio */}
        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            About {tutor.name}
          </Typography>
          <Typography variant="body2">
            {tutor.bio || "No bio available"}
          </Typography>
        </Box>

        {/* Availability */}
        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Book a slot
          </Typography>
          <BookingInterface
            tutor_id={id}
            modules={tutor.modules_taught}
            availability={tutor.availability}
            hourly_rate={tutor.hourly_rate}
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default TutorProfile;
