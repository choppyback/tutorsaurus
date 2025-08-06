const log = require("log-beautify");
const pool = require("../db");

module.exports = (io, socket) => {
  log.info(`✅ User connected: ${socket.user_id} (socket ${socket.id})`);

  socket.on("joinRoom", ({ conversationId }) => {
    socket.join(conversationId);
    log.info(`📥 User ${socket.user_id} joined room ${conversationId}`);
  });

  socket.on("sendMessage", async ({ conversationId, message }) => {
    const senderId = socket.user_id;
    const timestamp = new Date().toISOString();

    try {
      await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, message, timestamp)
         VALUES ($1, $2, $3, $4)`,
        [conversationId, senderId, message, timestamp]
      );

      const result = await pool.query(
        `SELECT name FROM users WHERE user_id = $1`,
        [senderId]
      );
      const senderName = result.rows[0]?.name || "Unknown";

      io.to(conversationId).emit("receiveMessage", {
        sender_id: senderId,
        sender_name: senderName,
        message,
        timestamp,
      });

      log.success(`💾 Message saved (user ${senderId})`);
    } catch (err) {
      log.error("❌ Error handling sendMessage:", err.message);
    }
  });

  socket.on("disconnect", () => {
    log.info(`🔌 User disconnected: ${socket.user_id}`);
  });
};
