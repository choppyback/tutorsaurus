const pool = require("../db");
const log = require("log-beautify");

// GET messages by conversationId
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         m.sender_id,
         u.name AS sender_name,
         m.message,
         m.timestamp
       FROM messages m
       JOIN users u ON m.sender_id = u.user_id
       WHERE m.conversation_id = $1
       ORDER BY m.timestamp ASC`,
      [conversationId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).send("Server error");
  }
};

// POST start a conversation
exports.startConversation = async (req, res) => {
  const { tutorId, studentId } = req.body;
  let student_id, tutor_id;

  if (req.role === "student") {
    student_id = req.user;
    tutor_id = tutorId;
  } else if (req.role === "tutor") {
    tutor_id = req.user;
    student_id = studentId;
  } else {
    return res.status(403).json({ error: "Unauthorized role" });
  }

  try {
    const existing = await pool.query(
      `SELECT * FROM conversations WHERE student_id = $1 AND tutor_id = $2`,
      [student_id, tutor_id]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO conversations (student_id, tutor_id)
       VALUES ($1, $2)
       RETURNING *`,
      [student_id, tutor_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating conversation:", err.message);
    res.status(500).send("Server error");
  }
};

// GET all conversations for a user
exports.getConversationsForUser = async (req, res) => {
  log.info("HITTTT");
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
};
