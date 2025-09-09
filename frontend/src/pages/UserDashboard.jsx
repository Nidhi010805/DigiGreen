import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [nearestRetailers, setNearestRetailers] = useState([]);
  const navigate = useNavigate();

  // Haversine formula
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const fetchNearestRetailers = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Fetch all retailers
            const res = await API.get("/api/retailers"); 
            const retailers = res.data;

            // Calculate distance for each retailer
            const retailersWithDistance = retailers
              .filter(r => r.location?.lat && r.location?.lng)
              .map(r => ({
                ...r,
                distance: getDistance(latitude, longitude, r.location.lat, r.location.lng)
              }));

            // Sort by distance and take top 3
            retailersWithDistance.sort((a, b) => a.distance - b.distance);
            const top3 = retailersWithDistance.slice(0, 3);

            setNearestRetailers(top3);
            
          });
        } else {
          console.warn("Geolocation not supported by this browser.");
        }
      } catch (err) {
        console.error("Failed to fetch nearest retailers", err);
      }
    };

    fetchNearestRetailers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/api/user/profile")
      .then(res => setUser(res.data))
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
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Mobile:</span> {user.mobile || "Not Provided"}</p>
          <p><span className="font-medium">Address:</span> {user.address || "Not Provided"}</p>
          <p><span className="font-medium">Green Points:</span> {user.greenPoints}</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {/* <Card title="My Orders" desc={`${user.totalOrders || 0} orders placed`} onClick={() => navigate("/my-orders")} /> */}
        <Card  title="Returns" desc={`${user.totalReturns || 0} returns processed`} onClick={() => navigate("/my-returns")} />
        <Card title="Rewards" desc={`${user.greenPoints} points, ₹${user.cashbackEarned} cashback`} onClick={() => navigate("/my-rewards")} />
        <Card title="Settings" desc="Manage account info" onClick={() => navigate("/user/settings")} />
      
      </div>

      {/* Top 3 Nearest Retailers */}
{/* Section Heading */}
<h2 className="text-2xl font-bold text-green-700 mb-4">📍 Nearest Retailers</h2>

{/* Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {nearestRetailers.slice(0, 3).map((r) => (
    <div
      key={r.id}
      className="w-full bg-white/90 border border-gray-200 shadow-lg rounded-xl p-5 flex flex-col justify-start hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Store Name */}
      <p className="text-md font-semibold text-gray-800 mb-2">
        Store Name: {r.name}
      </p>

      {/* Other Details */}
      <p className="text-gray-700 mb-1"><strong>Email:</strong> {r.contact?.email || "N/A"}</p>
      <p className="text-gray-700 mb-1"><strong>Mobile:</strong> {r.contact?.phone || "Not Provided"}</p>
      <p className="text-gray-700 mb-1"><strong>City:</strong> {r.location?.city || "Not Available"}</p>
      <p className="text-gray-600 mt-2"><strong>Distance:</strong> {r.distance.toFixed(2)} km</p>
    </div>
  ))}
</div>


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
