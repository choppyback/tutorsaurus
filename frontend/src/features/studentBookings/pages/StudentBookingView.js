const styles = {
  page: {
    background: "linear-gradient(277deg ,rgb(242, 255, 240), #fefae9)",
    minHeight: "100vh",
    pt: 4,
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
  viewButton: {
    backgroundColor: "#A2CB75",
    color: "#294A29",
    "&:hover": {
      backgroundColor: "#95bd68",
    },
    fontWeight: "bold",
    fontSize: "13px",
  },
};

export default styles;
