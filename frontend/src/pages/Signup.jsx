import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user"); // default user

  // User form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    password: ""
  });

  // Retailer form state
  const [retailerForm, setRetailerForm] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
    location: { city: "", lat: "", lng: "" },
    phone: "",
    acceptedItems: [],
    category: ""
  });

  // Handle user input
  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  // Handle retailer input
  const handleRetailerChange = (e) => {
    const { name, value, options } = e.target;

    // For acceptedItems multi-select
    if (name === "acceptedItems") {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setRetailerForm({ ...retailerForm, acceptedItems: selected });
    } 
    // For location fields
    else if (name === "city" || name === "lat" || name === "lng") {
      setRetailerForm({
        ...retailerForm,
        location: { ...retailerForm.location, [name]: value }
      });
    } 
    // Other fields
    else {
      setRetailerForm({ ...retailerForm, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = role === "user" ? userForm : retailerForm;
      console.log("Submitting form data:", formData);
      const res = await API.post("/api/auth/signup", { ...formData, role });

      if (res.status === 201) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-100 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Signup
        </h2>

        {/* Role Selector */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Sign up as</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none"
          >
            <option value="user">User</option>
            <option value="retailer">Retailer</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* User Form */}
          {role === "user" && (
            <>
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={userForm.mobile}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={userForm.address}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {/* Retailer Form */}
          {role === "retailer" && (
            <>
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={retailerForm.name}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={retailerForm.email}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={retailerForm.password}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={retailerForm.storeName}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={retailerForm.location.city}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Latitude</label>
                <input
                  type="text"
                  name="lat"
                  value={retailerForm.location.lat}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Longitude</label>
                <input
                  type="text"
                  name="lng"
                  value={retailerForm.location.lng}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={retailerForm.phone}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={retailerForm.category}
                  onChange={handleRetailerChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Accepted Items</label>
                <select
                  name="acceptedItems"
                  value={retailerForm.acceptedItems}
                  onChange={handleRetailerChange}
                  multiple
                  className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none"
                >
                  <option value="Cardboard">Cardboard</option>
                  <option value="Plastic Bottles">Plastic Bottles</option>
                  <option value="Myntra Packages">Myntra Packages</option>
                  <option value="Paper Bags">Paper Bags</option>
                  <option value="Glass Bottles">Glass Bottles</option>
                  <option value="E-commerce Packaging">E-commerce Packaging</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </motion.div>
    </div>
  );
}
