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
  formBox: {
    maxWidth: 400,
    mx: "auto",
    backgroundColor: "#fff",
    p: 4,
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  title: {
    mb: 2,
    color: "#294A29",
  },
  loginButton: {
    backgroundColor: "#A2CB75",
    color: "#294A29",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#95bd68",
    },
  },
  backButton: {
    mt: 2,
    color: "#72885C",
    textTransform: "none",
    fontSize: "0.9rem",
  },
  signUpText: {
    mt: 2,
    textAlign: "center",
  },
};

export default styles;
