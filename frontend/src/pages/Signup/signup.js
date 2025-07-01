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
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    px: 2,
  },
  formBox: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#fff",
    p: 4,
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  title: {
    mb: 1,
    color: "#294A29",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#A2CB75",
    color: "#294A29",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#95bd68",
    },
  },
  backButton: {
    mt: 1,
    color: "#72885C",
    textTransform: "none",
    fontSize: "0.9rem",
    alignSelf: "flex-start",
  },
  errorText: {
    color: "red",
    fontSize: "0.9rem",
  },
};

export default styles;
