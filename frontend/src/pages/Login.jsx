import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";  
import { AuthContext } from "../context/AuthContext"; 

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Please fill in all fields");
    }

    try {
      const res = await API.post("/api/auth/login", { email, password });
      // console.log("Calling:", process.env.REACT_APP_API_URL);


      if (res.status === 200) {
        const data = res.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("userId", data.user.id);

          authLogin(data.role, data.token);

        // ✅ Navigate based on role
        if (data.role?.toLowerCase() === "retailer") {
          navigate("/retailer/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-white dark:bg-teal-100 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-gray-50 dark:bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-600 text-center">
          Login to Ecoloop
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
}
