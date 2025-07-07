import React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const faculties = [
  "Arts and Social Sciences",
  "Business",
  "Computing",
  "Dentistry",
  "Design and Engineering",
  "Law",
  "Medicine",
  "Science",
  "Music",
  "Public Health",
  "Public Policy",
];

const FilterPanel = ({ filters, setFilters }) => {
  const handleClear = () => {
    setFilters({ faculty: "", maxPrice: "", rating: "" });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
      <FormControl fullWidth>
        <InputLabel>Faculty</InputLabel>
        <Select
          value={filters.faculty || ""}
          label="Faculty"
          onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {faculties.map((f, idx) => (
            <MenuItem key={idx} value={f}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Max Price"
        type="number"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
      />
      <TextField
        label="Rating"
        type="number"
        value={filters.rating}
        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
      />
      <Button
        variant="outlined"
        onClick={handleClear}
        sx={{
          borderColor: "#A2CB75",
          color: "#294A29",
          fontWeight: "bold",
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default FilterPanel;
