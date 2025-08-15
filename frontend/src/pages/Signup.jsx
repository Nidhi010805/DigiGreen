import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Please fill in all fields");
    }

    try {
      const res = await API.post("/api/auth/signup", form);

      if (res.status === 201) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
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
          Create Your RePack Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-700">Sign up as</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none"
            >
              <option value="user">User</option>
              <option value="retailer">Retailer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </motion.div>
    </div>
  );
}
