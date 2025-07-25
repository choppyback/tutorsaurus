import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../../../shared/components/NavBar.jsx";
import SearchBar from "../../../../shared/components/SearchBar";
import FilterPanel from "../../../../shared/components/FilterPanel";
import BASE_URL from "../../../../config/api.js";
import { Button, Stack, Box, Typography } from "@mui/material";
import TutorProfile from "../../../tutorProfile/pages/TutorProfile/TutorProfile.jsx";
import { getRoleFromToken } from "../../../../shared/utils/getRoleFromToken";
import styles from "./home.js";
import starIcon from "../../../../assets/images/star.svg";

const Home = () => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [filters, setFilters] = useState({
    faculty: "",
    maxPrice: "",
    rating: "",
  });

  // For tutor profile viewing
  const [open, setOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);

  const handleOpenProfile = (id) => {
    setSelectedTutorId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTutorId(null);
  };

  const handleSearch = async (query) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/search?module=${query}`);
      setFilters({ faculty: "", maxPrice: "", rating: "" }); // clear filters each time search query changes
      setTutors(res.data);
      setFilteredTutors(res.data); // default to all results
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    handleSearch("");
  }, []);

  // apply filters whenever there are changes to filters
  useEffect(() => {
    const filtered = tutors.filter((tutor) => {
      const passFaculty =
        !filters.faculty ||
        tutor.faculty?.toLowerCase() === filters.faculty.toLowerCase();
      const passPrice =
        !filters.maxPrice || tutor.hourly_rate <= parseFloat(filters.maxPrice);
      const passRating =
        !filters.rating || (tutor.rating ?? 0) >= parseFloat(filters.rating);

      return passFaculty && passPrice && passRating;
    });

    setFilteredTutors(filtered);
  }, [filters]);

  return (
    <Box sx={styles.page}>
      <NavBar role={getRoleFromToken()} />
      <SearchBar onSearch={handleSearch} />

      <Box sx={{ px: "90px", pt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          {filteredTutors.length > 0
            ? `Found ${filteredTutors.length} tutor${
                filteredTutors.length > 1 ? "s" : ""
              } for you`
            : "No tutors found. Please try a different search."}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", px: "66px", pt: 4, gap: 4 }}>
        <Box sx={styles.filterbar}>
          <FilterPanel filters={filters} setFilters={setFilters} />
        </Box>

        <Stack spacing={3} sx={{ flex: 1 }}>
          {filteredTutors.map((tutor, index) => (
            <Box sx={styles.card}>
              <Box
                component="img"
                src={BASE_URL + tutor.profile_pic}
                alt={tutor.name}
                sx={styles.tutorImage}
              />

              <Box
                flex={1}
                display="flex"
                gap={4}
                justifyContent="space-between"
                sx={{ pr: 3 }}
              >
                <Box display="flex" flex={1} flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography fontWeight="bold" fontSize="19px">
                      {tutor.name}
                    </Typography>
                    <img src={starIcon} alt="star" width={14} height={14} />
                    <Typography
                      fontWeight="bold"
                      fontSize="14px"
                      lineHeight="1"
                    >
                      {tutor.rating ? tutor.rating : "N/A"}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: "14px" }}
                    >
                      ({tutor.review_count || 0})
                    </Typography>
                  </Box>

                  <Typography fontWeight="bold" fontSize="16px">
                    Hourly Rate: ${tutor.hourly_rate}
                  </Typography>

                  <Typography fontSize="15px">
                    <Box component="span" fontWeight="bold">
                      Teaches:
                    </Box>{" "}
                    {tutor.all_modules}
                  </Typography>
                </Box>

                <Box display="flex" flex={1} flexDirection="column">
                  <Box>
                    <Typography fontSize="17px" fontWeight="bold">
                      About
                    </Typography>
                    <Typography
                      color="text.secondary"
                      fontSize="15px"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 5,
                        wordBreak: "break-word",
                      }}
                    >
                      {tutor.bio}...
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={styles.divider} />

              <Box display="flex" alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => handleOpenProfile(tutor.user_id)}
                  sx={styles.viewButton}
                >
                  View profile
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      <TutorProfile id={selectedTutorId} open={open} onClose={handleClose} />
    </Box>
  );
};

export default Home;
