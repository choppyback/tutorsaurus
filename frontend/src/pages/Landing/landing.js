const styles = {
  page: {
    backgroundColor: "#FAF6EE",
    minHeight: "100vh",
    py: 4,
  },
  brandHeader: {
    px: 5,
    pt: 2,
  },
  brandContent: {
    display: "flex",
    alignItems: "center",
  },
  brandLogo: {
    height: 40,
    width: 40,
    mr: 1,
  },
  logoText: {
    color: "#294A29",
    fontFamily: "Inter, sans-serif",
  },
  heroContainer: {
    mt: 6,
    py: 10,
    px: 5,
    borderRadius: "32px",
    textAlign: "center",
  },
  heroImage: {
    width: 230,
  },
  ctaContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    mt: 4,
  },
  loginButton: {
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
  },
  signupButton: {
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
  },
};

export default styles;
