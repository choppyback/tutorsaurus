import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const location = useLocation();

  const isOnProfilePage = location.pathname === "/editprofile";

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "none",
        px: 3,
        minHeight: 90,
        justifyContent: "center",
      }}
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

        {/* Right: Conditional Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {isOnProfilePage ? (
            <Button
              component={Link}
              to="/home"
              sx={{
                color: "#294A29",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Home
            </Button>
          ) : (
            <Button
              component={Link}
              to="/editprofile"
              sx={{
                color: "#294A29",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Profile
            </Button>
          )}
          <Button
            onClick={handleLogout}
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
