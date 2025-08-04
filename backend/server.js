const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const pool = require("./db");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 2000;

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST"],
  },
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("⚡ New user connected:", socket.id);

  socket.on("joinRoom", ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`🟢 Socket ${socket.id} joined room ${conversationId}`);
  });

  socket.on("sendMessage", ({ conversationId, senderId, message }) => {
    // Relay message to the room
    io.to(conversationId).emit("receiveMessage", {
      senderId,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/api/search", require("./routes/search"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/modules", require("./routes/modules"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/reviews", require("./routes/review"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).send("Database error");
  }
});

// Start server (with WebSocket support)
server.listen(PORT, () => {
  console.log(`🚀 Server with WebSocket running on port ${PORT}`);
});
