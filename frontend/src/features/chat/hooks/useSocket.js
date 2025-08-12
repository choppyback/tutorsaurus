import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io("http://localhost:2000", {
      auth: {
        token,
      },
    });

    // Listen for connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
