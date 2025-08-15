import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";  

export default function ProductCard({ product, showDelete }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !product?.id) return;
    const fetchLikes = async () => {
      try {
        const res = await API.get("/api/likes/my");
        const isLiked = res.data.some((like) => like.productId === product.id);
        setLiked(isLiked);
      } catch (err) {
        console.error("Error fetching likes", err);
      }
    };
    fetchLikes();
  }, [product?.id, token]);

  if (!product || !product.id) {
    return (
      <div className="p-4 border rounded shadow text-center">
        <p>Product Data Missing</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!token) return alert("Please login first");
    try {
      await API.post("/api/cart/add", { productId: product.id, quantity: 1 });
      alert("Product added to cart!");

      const res = await API.get("/api/cart/my");
      const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!token) return alert("Please login first");
    try {
      const res = await API.post("/api/order/place", { productId: product.id, quantity: 1 });
      if (res.status === 200) {
        alert("Order placed successfully!");
        navigate("/my-orders");
      } else {
        alert(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Error placing order", err);
      alert("Error placing order");
    }
  };

  const handleLike = async () => {
    if (!token) return alert("Please login first");
    try {
      if (liked) {
        await API.delete(`/api/likes/remove/${product.id}`);
        setLiked(false);
        alert("Removed from Likes");
      } else {
        await API.post("/api/likes/add", { productId: product.id });
        setLiked(true);
        alert("Added to Likes");
      }
      const res = await API.get("/api/likes/my");
      localStorage.setItem("likesCount", res.data.length);
      window.dispatchEvent(new Event("likes-updated"));
    } catch (err) {
      console.error("Error updating Likes", err);
      alert("Error updating Likes");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
      className="border rounded-2xl shadow-md p-4 flex flex-col justify-between h-full bg-white hover:shadow-xl transition backdrop-blur-sm"
    >
      {/* Product Image */}
      {product.imageUrl ? (
        <motion.img
          src={product.imageUrl}
          alt={product.name || "Product"}
          className="h-40 w-full object-contain mb-3 rounded-lg"
          whileHover={{ scale: 1.05 }}
        />
      ) : (
        <div className="h-40 w-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
          No Image
        </div>
      )}

      {/* Product Details */}
      <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name || "Unnamed Product"}</h2>
      <p className="text-gray-500 text-sm mb-1 line-clamp-1">{product.category || "No Category"}</p>
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description || "No Description"}</p>

      {/* Price */}
      <p className="text-green-700 font-bold text-lg mb-3">₹ {product.price || "0"}</p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="ring-2 ring-green-600 hover:bg-green-600 hover:text-white text-green-700 text-sm px-3 py-1 rounded flex items-center gap-1 transition"
        >
          <ShoppingCart size={16} /> Add
        </motion.button>

        {showDelete ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="text-red-500 hover:text-red-700"
            title="Remove from Likes"
          >
            <Trash2 />
          </motion.button>
        ) : (
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.3 }}
            animate={{ scale: liked ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${liked ? "text-red-500" : "text-gray-500"} hover:scale-110 transition`}
          >
            <Heart />
          </motion.button>
        )}
      </div>

      {/* Buy Now Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleBuyNow}
        className="bg-gradient-to-r from-green-400 to-green-700 hover:from-green-700 hover:to-green-400 text-white text-sm px-4 py-1 rounded self-end transition"
      >
        Buy Now
      </motion.button>
    </motion.div>
  );
}
