import { useState } from "react";
import axios from "axios";
import BASE_URL from "../api";
import { Box, TextField, Button, Typography } from "@mui/material";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/search?module=${query}`);
      setResults(res.data);
      setHasSearched(true);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <Box sx={{ px: 3 }}>
      {/* Search Input and Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by module code (e.g. CS2030S)"
          variant="outlined"
          sx={{
            width: 300,
            backgroundColor: "#fff",
            borderRadius: 2,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            ml: 2,
            backgroundColor: "#A2CB75",
            color: "#294A29",
            fontWeight: "bold",
          }}
        >
          Search
        </Button>
      </Box>

      {/* No Result Message */}
      {hasSearched && results.length === 0 && (
        <Typography
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          No tutors found for "{query}"
        </Typography>
      )}

      {/* Display Search Results */}
      {results.length > 0 && (
        <Box sx={{ mt: 4, display: "grid", gap: 2 }}>
          {results.map((tutor, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {/* Profile Image */}
              <Box
                component="img"
                src={BASE_URL + tutor.profile_pic} // Make sure profile_pic starts with /uploads/...
                alt={tutor.name}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />

              {/* Tutor Detail */}
              <Box sx={{ mt: 4 }}>
                <Typography fontWeight="bold">{tutor.name}</Typography>
                <Typography fontSize="0.875rem" color="text.secondary">
                  Module: {tutor.all_modules}
                </Typography>
                <Typography fontSize="0.875rem" color="text.secondary">
                  Faculty: {tutor.faculty}
                </Typography>
                <Typography fontSize="0.875rem" color="text.secondary">
                  Hourly Rate: {tutor.hourly_rate}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default SearchBar;
