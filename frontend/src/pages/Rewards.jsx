import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Rewards() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const [profileRes, historyRes] = await Promise.all([
        API.get("/api/user/profile"),
        API.get("/api/redeem/history"),
      ]);
      setUser(profileRes.data);
      setHistory(historyRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  fetchData();
}, [navigate]); 


  const handleRedeemCashback = async () => {
    const points = parseInt(pointsToRedeem);
    if (!points || points <= 0) {
      setMessage("⚠️ Enter valid points to redeem.");
      return;
    }
    if (points > user.greenPoints) {
      setMessage("⚠️ You don't have enough points.");
      return;
    }

    setRedeeming(true);
    setMessage("");

    try {
      const res = await API.post("/api/redeem/redeem", {
        type: "cashback",
        item: `${points} Points Cashback`,
        pointsUsed: points,
      });

      setMessage(`✅ Successfully Redeemed ₹${res.data.cashbackAmount} Cashback`);

      setUser((prev) => ({
        ...prev,
        greenPoints: prev.greenPoints - points,
        cashbackEarned: prev.cashbackEarned + res.data.cashbackAmount,
      }));

      setHistory((prev) => [
        { ...res.data.redeemRecord, id: Date.now() },
        ...prev,
      ]);

      setPointsToRedeem("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Redeem failed, try again.");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-[#e0f4e8] to-[#ffffff]">
        <p className="text-gray-500 animate-pulse text-lg">Loading rewards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f4e8] to-[#ffffff] py-16 px-6 space-y-12">

      {/* Title */}
      <motion.h1
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-green-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight"
>
  Your Rewards
</motion.h1>


      {/* Stats Cards */}
<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-2xl shadow-lg p-6 text-center flex flex-col items-center"
  >
    <h2 className="text-lg font-semibold text-green-700 mb-1">Green Points</h2>
    <p className="text-3xl font-bold text-green-900">{user.greenPoints} 🌿</p>
    <p className="text-sm text-gray-600 mt-1">Earn points by returning packaging</p>
  </motion.div>

  <motion.div
    whileHover={{ scale: 1.03 }}
    className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-2xl shadow-lg p-6 text-center flex flex-col items-center"
  >
    <h2 className="text-lg font-semibold text-teal-700 mb-1">Total Cashback</h2>
    <p className="text-3xl font-bold text-teal-900">₹{user.cashbackEarned}</p>
    <p className="text-sm text-gray-600 mt-1">Your contributions pay off!</p>
  </motion.div>
</div>


      {/* Redeem Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl shadow-xl max-w-4xl mx-auto p-8 space-y-6"
      >
        <h2 className="text-xl font-semibold text-green-700">Redeem Cashback</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="number"
            min="1"
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(e.target.value)}
            placeholder="Points to Redeem"
            className="border border-gray-300 px-4 py-3 rounded-xl flex-1 w-full focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl w-full sm:w-auto transition-all shadow-md hover:shadow-lg"
            onClick={handleRedeemCashback}
            disabled={redeeming}
          >
            {redeeming ? "Processing..." : "Redeem"}
          </button>
        </div>
        {message && (
          <p className={`text-sm mt-2 ${message.includes("✅") ? "text-green-800" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </motion.div>

      {/* History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl shadow-xl max-w-4xl mx-auto p-8"
      >
        <h2 className="text-xl font-semibold text-green-700 mb-6">Redeem History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No redeem history found.</p>
        ) : (
          <ul className="divide-y">
            {history.map((h) => (
              <li
                key={h.id}
                className="py-4 flex justify-between items-center hover:bg-green-50 transition-colors rounded-xl px-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{h.item}</p>
                  <p className="text-sm text-gray-500">
                    {h.type} • {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold text-green-900">-{h.pointsUsed} pts</p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
