import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    API.get("/api/returns")
      .then((res) => {
        setReturns(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-16 p-6 mb-16">
      <h1 className="text-2xl font-bold mb-6 text-green-600">Your Return History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : returns.length === 0 ? (
        <p className="text-gray-500">No returns yet.</p>
      ) : (
        <ul className="space-y-4">
          {returns.map((r) => (
            <li
              key={r.id}
              className="bg-green-100/80 shadow rounded p-4 flex items-center justify-between gap-4"
            >
              {/* Left Side Info */}
              <div className="flex-1">
                <p className="font-medium text-lg">{r.packageName}</p>
                <p className="text-sm text-gray-600">
                  Category: <span className="font-semibold">{r.category}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Size: <span className="font-semibold">{r.size || "N/A"}</span> |{" "}
                  Weight: <span className="font-semibold">{r.weight || "N/A"} kg</span>
                </p>
                <p className="text-sm text-gray-500">
                 Submitted on {new Date(r.scannedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Photo */}
              {r.photo && (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${r.photo}`}
                  alt="Return"
                  className="w-20 h-20 object-cover rounded-full border-2 border-green-500 shadow-md"
                />
              )}

              {/* Status */}
              <div className="text-right">
                <span
                  className={`text-sm font-semibold ${
                    r.status === "approved"
                      ? "text-green-700"
                      : r.status === "initiated"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {r.status === "initiated"
                    ? "Pending"
                    : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
