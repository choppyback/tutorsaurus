import React, { useState, useEffect, useRef } from "react";
import useSocket from "../hooks/useSocket";
import BASE_URL from "../../../config/api";
import dayjs from "dayjs";

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

  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((msg) => {
      const date = dayjs(msg.timestamp).format("YYYY-MM-DD"); // normalize to same format
      if (!groups[date]) groups[date] = []; // create array if date does not exist
      groups[date].push(msg); // append if date exist
    });

    return groups;
  };

  const formatDateLabel = (date) => {
    const day = dayjs(date);
    const today = dayjs();
    const yesterday = dayjs().subtract(1, "day");

    if (day.isSame(today, "day")) return "Today"; // compare day part, ignore time
    if (day.isSame(yesterday, "day")) return "Yesterday";
    return day.format("DD MMM YYYY");
  };

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
          {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
            <React.Fragment key={date}>
              {/* Date separator */}
              <Box
                sx={{
                  textAlign: "center",
                  color: "#888",
                  fontSize: "12px",
                  my: 1,
                }}
              >
                {formatDateLabel(date)}
              </Box>
              {/* Messages for that date */}
              {msgs.map((msg, i) => {
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
                    <Typography
                      variant="caption"
                      fontSize={10}
                      color="text.secondary"
                    >
                      {dayjs(msg.timestamp).format("HH:mm")}
                    </Typography>
                  </Box>
                );
              })}
            </React.Fragment>
          ))}
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
