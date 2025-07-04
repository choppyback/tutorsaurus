import { useState } from "react";
import { Box, InputBase, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    onSearch(query);
  };

  return (
    <Box
      sx={{
        py: 6,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Find the right tutor for your academic needs.
      </Typography>

      {/* Search Box */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 700,
          height: 70,
          borderRadius: "12px",
          mx: "auto",
          backgroundColor: "#fff",
          borderRadius: "10px",
          px: 2,
          boxShadow: 5,
        }}
      >
        <InputBase
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="By Keyword"
          fullWidth
          sx={{
            py: 1.2,
            px: 2,
            fontSize: 16,
          }}
        />
        <IconButton onClick={handleSubmit}>
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default SearchBar;
