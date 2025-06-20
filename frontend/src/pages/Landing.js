import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Box sx={{ backgroundColor: "#FAF6EE", minHeight: "100vh", py: 4 }}>
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src="/logo-pure.png" // make sure this path is correct
              alt="Tutorsaurus Logo"
              sx={{ height: 40, width: 40, mr: 1 }}
            />
            <Typography
              variant="h5"
              sx={{ color: "#294A29", fontFamily: "Inter, sans-serif" }}
            >
              Tutorsaurus
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Box */}
      <Container
        maxWidth="md"
        sx={{
          mt: 6,
          py: 10,
          px: 5,
          borderRadius: "32px",
          textAlign: "center",
        }}
      >
        {/* Mascot */}
        <Box
          component="img"
          src="/app-logo.png"
          alt="Tutorsaurus Logo"
          sx={{ width: 230 }}
        />

        {/* Headline */}
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#294A29" }}>
          Your Academic Sidekick
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, color: "#72885C" }}>
          All your tutoring needs in one place.
        </Typography>

        {/* Subtext */}
        <Typography sx={{ mt: 2, color: "#5C774E" }}>
          Connect with the right tutor based on your needs.
        </Typography>

        {/* CTA */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2, // space between buttons
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={{
              mt: 4,
              backgroundColor: "#fff",
              color: "#A0C878",
              px: 4,
              py: 1.5,
              borderRadius: "25px",
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#95bd68",
                color: "#fff",
              },
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/signup"
            sx={{
              mt: 4,
              backgroundColor: "#A2CB75",
              color: "#294A29",
              px: 4,
              py: 1.5,
              borderRadius: "25px",
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#95bd68",
              },
            }}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
