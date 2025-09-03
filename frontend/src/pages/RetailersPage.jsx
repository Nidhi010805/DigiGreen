import React, { useEffect, useState } from "react";
import axios from "axios";

const RetailersPage = () => {
  const [retailers, setRetailers] = useState([]);

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/retailers");
        console.log("Retailer data:", res.data);
        setRetailers(res.data);
      } catch (err) {
        console.error("Error fetching retailers:", err);
      }
    };
    fetchRetailers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ♻️ Available Retailers ({retailers.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {retailers.map((retailer) => (
            <div
              key={retailer.id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-1">
                {retailer.name}
              </h2>
              <p className="text-gray-500 text-sm mb-2">{retailer.category}</p>

              {/* ✅ Location safe render */}
              <p className="text-gray-600">
                {typeof retailer.location === "string"
                  ? retailer.location
                  : retailer.location?.city}
                {retailer.location?.lat && retailer.location?.lng && (
                  <span className="block text-xs text-gray-400">
                    📍 {retailer.location.lat}, {retailer.location.lng}
                  </span>
                )}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {retailer.acceptedItems?.join(", ")}
              </p>

              <div className="mt-3 text-sm text-gray-700">
                <p>📧 {retailer.contact?.email}</p>
                <p>📞 {retailer.contact?.phone}</p>
              </div>
            </div>
          ))}
        </div>

        {retailers.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No retailers available.
          </p>
        )}
      </div>
    </div>
  );
};

export default RetailersPage;
