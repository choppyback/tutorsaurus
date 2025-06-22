import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    onSearch(query);
  };

  return (
    <Box sx={{ px: 3 }}>
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
          onClick={handleSubmit}
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
    </Box>
  );
}

export default SearchBar;
