const styles = {
  page: {
    background: "linear-gradient(277deg ,rgb(242, 255, 240), #fefae9)",
    minHeight: "100vh",
    py: 0,
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
  filterbar: {
    top: 105,
    position: "sticky",
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
