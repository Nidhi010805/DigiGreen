import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    fetchData();
  }, []);

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

  const handleRedeemCashback = async () => {
    const points = parseInt(pointsToRedeem);

    if (!points || points <= 0) {
      setMessage("⚠️ Enter valid points to redeem.");
      return;
    }
    if (points > user.greenPoints) {
      setMessage("⚠️ You don't have enough Green Points.");
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

      // Instantly update UI without refetch
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
      <div className="h-screen flex justify-center items-center">
        <p className="text-gray-600 animate-pulse">Loading rewards...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl rounded-xl mx-auto bg-green-100/80 my-16 p-6 space-y-8">
      <h1 className="text-3xl font-bold text-green-600 text-center">Your Rewards</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
          <h2 className="text-lg font-medium mb-1">Green Points</h2>
          <p className="text-4xl font-bold text-green-600">{user.greenPoints} 🌿</p>
          <p className="text-sm text-gray-500 mt-2">Earn points by returning packaging</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
          <h2 className="text-lg font-medium mb-1">Total Cashback Earned</h2>
          <p className="text-4xl font-bold text-green-600">₹{user.cashbackEarned}</p>
          <p className="text-sm text-gray-500 mt-2">Your contribution pays off!</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold">Redeem Cashback</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="number"
            min="1"
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(e.target.value)}
            placeholder="Points to Redeem"
            className="border px-4 py-2 rounded flex-1 w-full"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full sm:w-auto"
            onClick={handleRedeemCashback}
            disabled={redeeming}
          >
            {redeeming ? "Processing..." : "Redeem"}
          </button>
        </div>
        {message && (
          <p className={`text-sm mt-2 ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Redeem History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No redeem history found.</p>
        ) : (
          <ul className="divide-y">
            {history.map((h) => (
              <li key={h.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{h.item}</p>
                  <p className="text-sm text-gray-500">
                    {h.type} • {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold text-green-700">-{h.pointsUsed} points</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
