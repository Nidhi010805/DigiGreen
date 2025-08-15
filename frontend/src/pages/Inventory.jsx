import React, { useEffect, useState } from "react";
import { getTopProducts } from "../services/api";

const Inventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getTopProducts().then(setProducts).catch(console.error);
  }, []);

  return (
  <div className="p-6 bg-white rounded-2xl shadow-lg mt-6 mx-4 mb-16 border border-gray-200">
  <h2 className="text-2xl font-bold text-green-600 mb-6 pb-2 text-center">
    Top Purchased Products
  </h2>
  <ul className="space-y-3">
    {products.length > 0 ? (
      products.map((product, index) => (
        <li
          key={product.id}
          className="flex justify-between items-center bg-white border-b hover:bg-teal-100/70 px-4 py-2 rounded-lg transition"
        >
          <span className="text-gray-800 font-medium">
            {index + 1}. {product.name}
          </span>
          <span className="text-sm text-green-600 font-semibold">
            {product.purchasedCount} bought
          </span>
        </li>
      ))
    ) : (
     <p className="text-gray-500 italic text-center">No data available yet.</p>
    )}
  </ul>
</div>
  );
};

export default Inventory;