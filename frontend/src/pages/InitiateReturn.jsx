import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function InitiateReturn() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    API.get("/api/order/my")
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load orders");
      });
  }, [navigate]);

  const initiateReturn = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.isReturnInitiated) {
      alert("Return already initiated for this order.");
      return;
    }

    API.post("/api/returnpackaging/initiate", { orderId })
      .then(() => {
        alert("Return initiated successfully!");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isReturnInitiated: true } : o));
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.message || "Failed to initiate return");
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Initiate Packaging Return</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">No eligible orders found for return.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="p-4 shadow rounded bg-white flex justify-between items-center">
              <div>
                <p className="font-medium">{order.product.name}</p>
                <p>Material: {order.product.material}</p>
                <p>Size: {order.product.size}</p>
              </div>
              <button 
                onClick={() => initiateReturn(order.id)}
                disabled={order.isReturnInitiated}
                className={`px-3 py-1 rounded text-white ${
                  order.isReturnInitiated 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {order.isReturnInitiated ? "Return Initiated" : "Return"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
