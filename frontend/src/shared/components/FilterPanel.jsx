import React from "react";
import {
  Box,
  Typography,
  Slider,
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
      <Box>
        <Typography
          fontWeight="bold"
          fontSize="14px"
          sx={{ color: "#294A29", mb: 0.5, ml: 0.5 }}
        >
          Min Rating
        </Typography>
        <Slider
          value={filters.rating || 1}
          min={1}
          max={5}
          step={0.1}
          onChange={(_, newValue) =>
            setFilters({ ...filters, rating: newValue })
          }
          size="small"
          valueLabelDisplay="auto"
          sx={{
            color: "#A2CB75", // your green theme
            width: "95%", // make it shorter
            ml: 1, // align with label
          }}
        />
      </Box>
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
