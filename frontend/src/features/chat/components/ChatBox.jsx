import React, { useState, useEffect, useRef } from "react";
import useSocket from "../hooks/useSocket";
import BASE_URL from "../../../config/api";
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";

export default function ChatBox({
  open,
  onClose,
  userId,
  conversationId,
  name,
  profile_pic,
}) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalBox}>
        {/* Header */}
        <Box sx={styles.header}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={BASE_URL + profile_pic}
              sx={{ width: 50, height: 50 }}
            />
            <Typography fontWeight="bold">{name}</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Message History */}
        <Box sx={styles.messageContainer}>
          {messages.map((msg, i) => {
            const isMine = msg.sender_id === userId;

            return (
              <Box
                key={i}
                sx={{
                  ...styles.bubble,
                  alignSelf: isMine ? "flex-end" : "flex-start",
                  bgcolor: isMine ? "#e3f2fd" : "#f1f1f1",
                }}
              >
                <Typography variant="body2">{msg.message}</Typography>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box sx={styles.inputBox}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message here..."
            InputProps={{
              sx: { borderRadius: 20, pl: 2 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={sendMessage}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
    width: 500,
    height: 500,
    bgcolor: "#ffffff",
    borderRadius: 3,
    boxShadow: 24,
    p: 2,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    pb: 2,
    borderBottom: "1px solid #e0e0e0",
  },
  messageContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 1,
    py: 2,
    px: 1,
  },
  bubble: {
    maxWidth: "75%",
    p: 1,
    px: 2,
    borderRadius: 2,
    fontSize: "14px",
  },
  inputBox: {
    mt: 1,
  },
};
