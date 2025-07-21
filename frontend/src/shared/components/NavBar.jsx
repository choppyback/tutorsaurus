import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { getBookingsPath } from "../../shared/utils/getBookingsPath";

const NavBar = ({ role }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.1)",
        px: 3,
        minHeight: 90,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo + Brand Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src="/logo-pure.png"
            alt="Tutorsaurus Logo"
            sx={{ height: 40 }}
          />
          <Typography
            variant="h6"
            sx={{ color: "#294A29", fontWeight: "bold" }}
          >
            Tutorsaurus
          </Typography>
        </Box>

        {/* Right: Dropdown Menu */}
        <Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuClick}
          >
            <MenuIcon sx={{ color: "#294A29" }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem component={Link} to="/home" onClick={handleMenuClose}>
              Home
            </MenuItem>
            <MenuItem
              component={Link}
              to="/editprofile"
              onClick={handleMenuClose}
            >
              Profile
            </MenuItem>
            <MenuItem
              component={Link}
              to={getBookingsPath()}
              onClick={handleMenuClose}
            >
              My Bookings
            </MenuItem>
            {role === "admin" && (
              <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                Admin Dashboard
              </MenuItem>
            )}
            <MenuItem
              sx={{
                borderColor: "#A2CB75",
                color: "#294A29",
                fontWeight: "bold",
              }}
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
