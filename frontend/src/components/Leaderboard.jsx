import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import API from "../services/api";  

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/api/leaderboard");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d0e9db] to-[#ffffff] p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-800">🏆 Green Champions</h2>

      {/* Top 3 Layout */}
      <div className="flex justify-center gap-8 mb-12 flex-wrap">
        {users.slice(0, 3).map((user, index) => (
          <div key={user.id} className="flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  user.profilePhoto
                    ? `http://localhost:5000/uploads/${user.profilePhoto}`
                    : `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt="Profile"
                className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-4 ${
                  index === 0 ? "border-yellow-400" : "border-green-400"
                } shadow-md`}
              />
              {index === 0 && (
                <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-500" size={28} />
              )}
            </div>
            <h3 className="mt-2 font-semibold text-green-900">{user.name}</h3>
            <p className="text-green-700 font-bold">{user.greenPoints} pts</p>
          </div>
        ))}
      </div>

      {/* Other Users List */}
      <div className="max-w-xl mx-auto space-y-4">
        {users.slice(3).map((user, index) => (
         <div
  key={user.id}
  className="backdrop-blur-lg bg-white/70 border border-green-200 p-4 rounded-lg flex items-center gap-4 shadow-md hover:shadow-lg transition hover:ring-2 ring-green-400"
>
  <img
    src={
      user.profilePhoto
        ? `http://localhost:5000/uploads/${user.profilePhoto}`
        : `https://ui-avatars.com/api/?name=${user.name}`
    }
    alt="Profile"
    className="w-10 h-10 rounded-full border border-green-300 shadow"
  />

  <div className="flex-1">
    <h4 className="font-semibold text-green-900">{user.name}</h4>
    <p className="text-green-700 text-sm">{user.greenPoints} pts</p>
  </div>
  <span className="text-green-800 font-medium">#{index + 4}</span>
</div>

        ))}
      </div>
    </div>
  );
}
