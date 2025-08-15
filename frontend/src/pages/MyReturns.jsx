import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    API.get("/api/returnpackaging/my-packaging")
      .then(res => {
        setReturns(res.data);
        setLoading(false);
      })
      .catch(err => {
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
        <ul className="space-y-3">
          {returns.map(r => (
            <li key={r.id} className="bg-green-100/80 shadow rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{r.product.name} (x{r.quantity})</p>
                <p className="text-sm text-gray-500">Material: {r.material} | Size: {r.size}</p>
                <p className="text-sm text-gray-500">Requested on {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${
                  r.status === "approved" ? "text-green-700" :
                  r.status === "pending" ? "text-yellow-600" :
                  "text-red-600"
                }`}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
