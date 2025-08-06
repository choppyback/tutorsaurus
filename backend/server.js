const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const socketJWTAuth = require("./middleware/socketJWTAuth");
const socketHandlers = require("./sockets/socketHandlers");
const log = require("log-beautify");
const pool = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Apply middleware
io.use(socketJWTAuth);
io.on("connection", (socket) => socketHandlers(io, socket));

// Express middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api/search", require("./routes/search"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/modules", require("./routes/modules"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/reviews", require("./routes/review"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// DB test endpoint
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    log.error("DB error:", err.message);
    res.status(500).send("Database error");
  }
});

// Start server
const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
  log.success(`Backend running on port ${PORT}`);
});
