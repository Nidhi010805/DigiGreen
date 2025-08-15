import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../services/api";  

export default function CartIcon() {
  const [count, setCount] = useState(() => {
    return parseInt(localStorage.getItem("cartCount")) || 0;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchCart = async () => {
      try {
        const res = await API.get("/api/cart/my");  
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCount(total);
        localStorage.setItem("cartCount", total);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();

    const handleUpdate = () => {
      const backupCount = parseInt(localStorage.getItem("cartCount")) || 0;
      setCount(backupCount);
    };

    window.addEventListener("cart-updated", handleUpdate);

    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  return (
    <div className="relative">
      <ShoppingCart className="text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
