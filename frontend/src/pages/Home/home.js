const styles = {
  page: {
    background: "linear-gradient(277deg ,rgb(242, 255, 240), #fefae9)",
    minHeight: "100vh",
    py: 0,
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
  card: {
    display: "flex",
    gap: 3,
    alignItems: "center",
    borderRadius: 3,
    p: 3,
    bgcolor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  tutorImage: {
    width: 163,
    height: 217,
    borderRadius: 2,
    objectFit: "cover",
  },
  divider: {
    width: "2px",
    height: "100%",
    bgcolor: "#eee",
  },
  bookButton: {
    backgroundColor: "#A2CB75",
    color: "#294A29",
    "&:hover": {
      backgroundColor: "#95bd68",
    },
  },
};

export default styles;
