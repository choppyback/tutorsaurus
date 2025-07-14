const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 2000;
const path = require("path");
const pool = require("./db");

//middleware

app.use(cors());
app.use(express.json());
// Serve static files (e.g., profile pictures) from the 'uploads' directory
// Accessed via /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use("/auth", require("./routes/auth"));
app.use("/api/search", require("./routes/search"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/modules", require("./routes/modules"));
app.use("/api/admin", require('./routes/adminRoutes'))

// troubleshoot for hosting
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).send("Database error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
