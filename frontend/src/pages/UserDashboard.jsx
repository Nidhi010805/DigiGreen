import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [nearestRetailer, setNearestRetailer] = useState(null);
const [nearestDistance, setNearestDistance] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchNearestRetailer = async () => {
    try {
      // 👇 user location get karo (browser se)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const res = await API.post("/api/retailers/nearest", {
            lat: latitude,
            lng: longitude,
          });

          setNearestRetailer(res.data.nearest);
          setNearestDistance(res.data.distance.toFixed(2));
        });
      } else {
        console.warn("Geolocation not supported by this browser.");
      }
    } catch (err) {
      console.error("Failed to fetch nearest retailer", err);
    }
  };

  fetchNearestRetailer();
}, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/api/user/profile")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#e0f4e8] to-[#ffffff]">
        <p className="text-lg text-gray-600 text-center">Loading your profile...</p>
      </div>
    );
  }
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const defaultAvatar = "https://placehold.co/100x100?text=Avatar";
const profileImg = user?.profilePhoto
  ? `${BASE_URL}/uploads/${user.profilePhoto}`
  : defaultAvatar;


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f4e8] to-[#ffffff] px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36 py-8 mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-green-800 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <img
  src={profileImg}
  alt="Profile"
  className="w-16 h-16 rounded-full border object-cover shadow-md"
/>

        Welcome, {user.name}
      </h1>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
       <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-xl p-6 shadow-xl">
  <h2 className="text-lg font-semibold mb-4 text-green-700">Account Information</h2>
  <p>
    <span className="font-medium">Email:</span> {user.email}
  </p>
  <p>
    <span className="font-medium">Mobile:</span> {user.mobile || "Not Provided"}
  </p>
  <p>
    <span className="font-medium">Address:</span> {user.address || "Not Provided"}
  </p>
  <p>
    <span className="font-medium">Green Points:</span> {user.greenPoints}
  </p>
</div>

        <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-xl p-6 shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-2 text-green-700">Membership Level</h2>
          <p className="text-2xl font-bold text-green-700">
            {user.greenPoints >= 100
              ? "🌍 Green Warrior"
              : user.greenPoints >= 50
              ? "🌱 Silver Member"
              : "🌿 Bronze Member"}
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">Contribute more to unlock badges</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card title="My Orders" desc={`${user.totalOrders || 0} orders placed`} onClick={() => navigate("/my-orders")} />
        <Card title="Returns" desc={`${user.totalReturns || 0} returns processed`} onClick={() => navigate("/my-returns")} />
        <Card title="Rewards" desc={`${user.greenPoints} points, ₹${user.cashbackEarned} cashback`} onClick={() => navigate("/my-rewards")} />
        <Card title="Settings" desc="Manage account info" onClick={() => navigate("/user/settings")} />
          <Card 
  title="Initiate Return" 
  desc="Return a used package" 
  onClick={() => navigate("/return-package")} 
/>

      </div>
{/* 📍 Nearest Retailer */}
    {nearestRetailer && (
      <div className="mt-6 bg-white/80 border border-gray-200 shadow-xl rounded-xl p-6">
        <h2 className="text-lg font-semibold text-green-700 mb-2">📍 Nearest Retailer</h2>
        <p><strong>Name:</strong> {nearestRetailer.name}</p>
        <p><strong>Email:</strong> {nearestRetailer.email}</p>
        <p><strong>Mobile:</strong> {nearestRetailer.mobile || "Not Provided"}</p>
        <p><strong>Address:</strong> {nearestRetailer.address || "Not Available"}</p>
        <p className="text-gray-600 mt-1"><strong>Distance:</strong> {nearestDistance} km</p>
      </div>
    )}
    {/* Initiate Return Button */}
    <button
      onClick={() => navigate("/return-package")}
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
    >
      Initiate Return
    </button>
      
     
        
    
    </div>
  );
}


function Card({ title, desc, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="cursor-pointer w-full backdrop-blur-lg bg-white/80 border border-gray-200 rounded-xl p-6 shadow-xl hover:ring-2 ring-green-600 text-center flex flex-col justify-center h-full"
    >
      <h3 className="text-lg font-semibold mb-2 text-green-800">{title}</h3>
      <p className="text-gray-700">{desc}</p>
    </motion.div>
  );
}
