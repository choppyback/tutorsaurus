import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import {
  Modal,
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ChatBox({ open, onClose, conversationId }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("joinRoom", { conversationId });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, conversationId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `http://localhost:2000/api/chat/${conversationId}`
      );
      const data = await res.json();
      setMessages(data);
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit("sendMessage", {
        conversationId,
        message: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalBox}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Chat
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Message History */}
        <Box sx={styles.messageContainer}>
          {messages.map((msg, i) => (
            <Box key={i} mb={1}>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ display: "inline", mr: 1 }}
              >
                {msg.sender_name || msg.sender_id}:
              </Typography>
              <Typography variant="body2" component="span">
                {msg.message}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Input Field */}
        <Box mt={2} display="flex" gap={1}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const styles = {
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    maxHeight: "80vh",
    overflowY: "auto",
    bgcolor: "rgb(248, 252, 247)",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  },
  messageContainer: {
    maxHeight: 300,
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: 1,
    padding: 2,
    backgroundColor: "#fff",
  },
};
