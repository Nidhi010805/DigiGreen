import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function NotificationBell() {
  const { notifications, setNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await API.patch("/api/notifications/mark-all");
      
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const filteredNotifications = notifications.filter(n =>
    filterType === "All" || n.type === filterType
  );

  const handleNotificationClick = (n) => {
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative hover:text-blue-600">
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 text-sm z-50">
          <div className="flex justify-between mb-2">
            <strong>Notifications</strong>
            <button
              className={`text-blue-600 text-xs disabled:opacity-50`}
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {["All", "Reward", "Return", "Order"].map(type => (
              <button
                key={type}
                className={`px-2 py-1 rounded text-xs ${filterType === type ? "bg-green-200" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() => setFilterType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <ul className="max-h-60 overflow-y-auto space-y-2">
            {filteredNotifications.length ? (
              filteredNotifications.map((n, idx) => (
                <li
                  key={idx}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-2 rounded cursor-pointer ${n.isRead ? "bg-gray-50" : "bg-green-100"} hover:bg-gray-200`}
                >
                  <p>{n.message}</p>
                  <span className="text-xs text-gray-400 block">{n.type}</span>
                  <span className="text-[10px] text-gray-400 block">{new Date(n.createdAt).toLocaleString()}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center">No notifications</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
