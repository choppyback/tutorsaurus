import React, { useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import BASE_URL from "../api";
import { Box, Typography } from "@mui/material";
import styles from "../styles/dashboard";

const Dashboard = () => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [filters, setFilters] = useState({
    maxPrice: "",
    rating: "",
    availability: "",
  });

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
      const passPrice =
        !filters.maxPrice || tutor.hourly_rate <= parseFloat(filters.maxPrice);

      const passRating =
        !filters.rating || tutor.rating >= parseFloat(filters.rating);

      const passAvailability =
        !filters.availability ||
        tutor.availability
          ?.toLowerCase()
          .includes(filters.availability.toLowerCase());

      return passPrice && passRating && passAvailability;
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
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
    </Box>
  );
};

export default Dashboard;
