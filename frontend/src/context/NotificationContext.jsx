import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../services/api";

const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    const SERVER_URL = "http://localhost:5000";

    // Step 1: Fetch Existing Notifications
    API.get("/api/notifications")
      .then(res => setNotifications(res.data))
      .catch(err => console.error("❌ Error fetching notifications:", err));

    // Step 2: Socket Connection for Live Updates
    socketRef.current = io(SERVER_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join", userId);
    });

    socketRef.current.on("newNotification", (data) => {
      setNotifications((prev) => {
        const exists = prev.some(n => n.id === data.id);
        return exists ? prev : [data, ...prev];
      });
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
