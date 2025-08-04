const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET messages by conversationId
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT sender_id, message, timestamp
       FROM messages
       WHERE conversation_id = $1
       ORDER BY timestamp ASC`,
      [conversationId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).send("Server error");
  }
});

// POST start a conversation (or fetch existing)
router.post("/start", async (req, res) => {
  const { studentId, tutorId } = req.body;
  try {
    // Check if it exists
    const existing = await pool.query(
      `SELECT * FROM conversations WHERE student_id = $1 AND tutor_id = $2`,
      [studentId, tutorId]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    // Create new conversation
    const result = await pool.query(
      `INSERT INTO conversations (student_id, tutor_id)
       VALUES ($1, $2)
       RETURNING *`,
      [studentId, tutorId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating conversation:", err.message);
    res.status(500).send("Server error");
  }
});

// GET all conversations for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM conversations
       WHERE student_id = $1 OR tutor_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching conversations:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
