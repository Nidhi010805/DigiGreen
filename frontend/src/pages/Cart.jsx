import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import API from "../services/api";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const res = await API.get("/api/cart/my");
        setCart(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch cart");
      }
    };

    fetchCart();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      await API.delete(`/api/cart/remove/${id}`);

      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);

      const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartCount", newCount);
      window.dispatchEvent(new Event("cart-updated"));

      alert("Item removed from cart");
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  if (!token) return <p className="text-center mt-20">Please login to view your cart.</p>;

  return (
    /*<div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-green-600">My Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg flex items-center justify-between bg-white shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product?.imageUrl || ""}
                    alt={item.product?.name}
                    className="w-20 h-20 object-contain border rounded-md"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{item.product?.name}</h2>
                    <p className="text-sm text-gray-600">
                      ₹ {item.product?.price} × {item.quantity} ={" "}
                      <span className="font-medium text-green-700">
                        ₹ {item.quantity * item.product?.price}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border rounded-lg bg-gray-100 text-right">
            <p className="text-lg font-semibold text-gray-800">
              Total Items: <span className="text-green-700">{totalItems}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Total Price: <span className="text-green-700">₹ {totalPrice}</span>
            </p>
          </div>
        </>
      )}
    </div>*/




  <div className="bg-green-50 min-h-screen">
  <div className="max-w-5xl mx-auto px-4 py-16 pb-10">
    <h1 className="text-3xl font-bold mb-6 text-green-600 text-center">
      My Cart
    </h1>

    {cart.length === 0 ? (
      <p className="text-gray-600 text-center">Your cart is empty.</p>
    ) : (
      <>
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg flex items-center justify-between bg-white shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.imageUrl || ""}
                  alt={item.product?.name}
                  className="w-20 h-20 object-contain border rounded-md"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.product?.name}</h2>
                  <p className="text-sm text-gray-600">
                    ₹ {item.product?.price} × {item.quantity} ={" "}
                    <span className="font-medium text-green-700">
                      ₹ {item.quantity * item.product?.price}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700"
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 text-right">
          <p className="text-lg font-semibold text-gray-800">
            Total Items: <span className="text-green-700">{totalItems}</span>
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Total Price: <span className="text-green-700">₹ {totalPrice}</span>
          </p>
        </div>
      </>
    )}
  </div>
</div>
  );
}
