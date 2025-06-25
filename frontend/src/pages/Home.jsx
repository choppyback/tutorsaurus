import React, { useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import BASE_URL from "../api";
import { Box, Typography, Dialog } from "@mui/material";
import TutorProfile from "./TutorProfile";
import styles from "../styles/home";

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
      setTutors(res.data);
      setFilteredTutors(res.data); // default to all results
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const applyFilters = () => {
    const filtered = tutors.filter((tutor) => {
      const passFaculty =
        !filters.faculty ||
        tutor.faculty?.toLowerCase() === filters.faculty.toLowerCase();
      const passPrice =
        !filters.maxPrice || tutor.hourly_rate <= parseFloat(filters.maxPrice);
      const passRating =
        !filters.rating || tutor.rating >= parseFloat(filters.rating);

      return passFaculty && passPrice && passRating;
    });

    setFilteredTutors(filtered);
  };

  return (
    <Box sx={styles.page}>
      <NavBar />
      <SearchBar onSearch={handleSearch} />

      {/* Filter + Results Box */}
      <Box sx={{ display: "flex", px: 3, pt: 4, gap: 4 }}>
        {/* Left Sidebar */}
        <Box sx={styles.sidebar}>
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onApply={applyFilters}
          />
        </Box>

        {/* Right Tutor Cards */}
        <Box sx={{ flex: 1 }}>
          {filteredTutors.length === 0 ? (
            <Typography>No tutors found.</Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 3,
              }}
            >
              {filteredTutors.map((tutor, index) => (
                <Box
                  onClick={() => handleOpenProfile(tutor.user_id)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.03)", cursor: "pointer" },
                  }}
                >
                  <Box
                    component="img"
                    src={BASE_URL + tutor.profile_pic}
                    alt={tutor.name}
                    sx={{
                      width: 160,
                      height: 160,
                      borderRadius: 2,
                      objectFit: "cover",
                      mb: 2,
                    }}
                  />
                  <Typography fontWeight="bold">{tutor.name}</Typography>
                  <Typography fontSize="0.875rem">
                    Module: {tutor.all_modules}
                  </Typography>
                  <Typography fontSize="0.875rem">
                    Faculty: {tutor.faculty}
                  </Typography>
                  <Typography fontSize="0.875rem">
                    Hourly Rate: {tutor.hourly_rate}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {selectedTutorId && <TutorProfile id={selectedTutorId} />}
      </Dialog>
    </Box>
  );
};

export default Home;
