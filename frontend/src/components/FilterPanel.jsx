import React from "react";
import { Box, TextField, Button } from "@mui/material";

const FilterPanel = ({ filters, setFilters, onApply }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
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
      <TextField
        label="Availability"
        value={filters.availability}
        onChange={(e) =>
          setFilters({ ...filters, availability: e.target.value })
        }
      />
      <Button
        variant="contained"
        onClick={onApply}
        sx={{
          backgroundColor: "#A2CB75",
          color: "#294A29",
          fontWeight: "bold",
        }}
      >
        Filter
      </Button>
    </Box>
  );
};

export default FilterPanel;
