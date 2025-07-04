const styles = {
  page: {
    background: "linear-gradient(to right, #fef1f1, #fefae9)",
    minHeight: "100vh",
    py: 0,
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
  title: {
    color: "#294A29",
    mb: 2,
    fontWeight: "bold",
  },
  logoutButton: {
    mt: 4,
    borderColor: "#A2CB75",
    color: "#294A29",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#f0f5e9",
    },
  },
  sidebar: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 2,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    px: 3,
    pt: 3,
    pb: 3,
    height: "fit-content",
  },
};

export default styles;
