// src/components/LikesIcon.jsx
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../services/api";  

export default function LikesIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchLikes = async () => {
      try {
        const res = await API.get("/api/likes/my");
        const totalLikes = res.data.length;
        setCount(totalLikes);
        localStorage.setItem("likesCount", totalLikes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLikes();

    const handleUpdate = () => {
      const storedCount = parseInt(localStorage.getItem("likesCount")) || 0;
      setCount(storedCount);
    };

    window.addEventListener("likes-updated", handleUpdate);

    return () => window.removeEventListener("likes-updated", handleUpdate);
  }, []);

  return (
    <div className="relative">
      <Heart className="text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
