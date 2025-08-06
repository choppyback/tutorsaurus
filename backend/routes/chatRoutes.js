const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const chatController = require("../controllers/chatController");

// GET messages by conversationId
router.get("/:conversationId", chatController.getMessages);

// POST start a conversation
router.post("/start", authenticate, chatController.startConversation);

// GET all conversations for a user
router.get("/user/:userId", chatController.getConversationsForUser);

module.exports = router;
