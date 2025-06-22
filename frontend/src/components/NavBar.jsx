import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#fff", boxShadow: "none", px: 3 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Logo + Brand Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src="/logo-pure.png"
            alt="Tutorsaurus Logo"
            sx={{ height: 40, mr: 1 }}
          />
          <Typography
            variant="h6"
            sx={{ color: "#294A29", fontWeight: "bold" }}
          >
            Tutorsaurus
          </Typography>
        </Box>

        {/* Right: Profile + Logout */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/profile"
            sx={{ color: "#294A29", textTransform: "none", fontWeight: "bold" }}
          >
            Profile
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              borderColor: "#A2CB75",
              color: "#294A29",
              fontWeight: "bold",
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
