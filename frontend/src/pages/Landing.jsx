import { Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../styles/landing";

const LandingPage = () => {
  return (
    <Box sx={styles.page}>
      {/* Brand Header */}
      <Box sx={styles.brandHeader}>
        <Box sx={styles.brandContent}>
          <Box
            component="img"
            src="/logo-pure.png"
            alt="Tutorsaurus Logo"
            sx={styles.brandLogo}
          />
          <Typography variant="h5" sx={styles.logoText}>
            Tutorsaurus
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={styles.heroContainer}>
        <Box
          component="img"
          src="/app-logo.png"
          alt="Tutorsaurus Mascot"
          sx={styles.heroImage}
        />

        <Typography variant="h3" fontWeight="bold" sx={{ color: "#294A29" }}>
          Your Academic Sidekick
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, color: "#72885C" }}>
          All your tutoring needs in one place.
        </Typography>
        <Typography sx={{ mt: 2, color: "#5C774E" }}>
          Connect with the right tutor based on your needs.
        </Typography>

        <Box sx={styles.ctaContainer}>
          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={styles.loginButton}
          >
            Login
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/signup"
            sx={styles.signupButton}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
