import { Link, useNavigate, useLocation } from "react-router-dom";
import {  LogOut, Menu, X } from "lucide-react";
import CartIcon from "../CartIcon";
import LikesIcon from "../LikesIcon";
import NotificationBell from "../NotificationBell";
import { useState } from "react";
import API from "../../services/api";


export default function UserNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };



const handleLogout = async () => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      const res = await API.post("/api/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(res.data.message);  // "Logout successful" popup yaha aayega
    }
  } catch (error) {
    alert("Logout failed");
    console.error("Logout Error:", error?.response?.data || error.message);
  } finally {
    localStorage.clear();
    navigate("/");
  }
};



  return (
    <nav className="bg-gray-50 shadow-md fixed top-0 w-full z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-green-600">
          Eco<span className="text-teal-600">Loop</span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6">
          <input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search products or info..."
  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
/>

        </form>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          <Link to="/" className={`hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600 font-semibold" : ""}`}>Home</Link>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/leaderboard" className="hover:text-blue-600">Leaderboard</Link>
          <Link to="/cart" className="hover:text-blue-600"><CartIcon /></Link>
          <Link to="/likes" className="hover:text-blue-600"><LikesIcon /></Link>

          {/* Real-Time Notification Bell */}
          <NotificationBell />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="hover:text-blue-600 flex items-center justify-center w-9 h-9 bg-green-100 rounded-full text-green-700 font-bold uppercase"
            >
              {localStorage.getItem("name") ? localStorage.getItem("name")[0] : "U"}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-sm z-10">
                <Link to="/user/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link to="/my-returns" className="block px-4 py-2 hover:bg-gray-100">My Returns</Link>
                <Link to="/my-rewards" className="block px-4 py-2 hover:bg-gray-100">My Rewards</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Icon */}
        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow px-6 py-4 flex flex-col space-y-3 text-gray-700 font-medium">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400 mb-2"
            />
          </form>

          <Link to="/" onClick={() => setMenuOpen(false)} className={`hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600 font-semibold" : ""}`}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Products</Link>
          <Link to="/leaderboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Leaderboard</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 flex items-center gap-2"><CartIcon /> Cart</Link>
          <Link to="/likes" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 flex items-center gap-2"><LikesIcon /> Likes</Link>

          {/* <Link to="/notifications" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 flex items-center gap-2 relative">
            Notifications
            {notifications.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </Link> */}

          <Link to="/user/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Dashboard</Link>
          <Link to="/my-returns" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">My Returns</Link>
          <Link to="/my-rewards" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">My Rewards</Link>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="hover:text-blue-600 flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
