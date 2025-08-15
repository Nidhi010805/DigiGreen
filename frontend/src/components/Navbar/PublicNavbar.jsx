import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/50 shadow-md fixed top-0 w-full z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-green-600">
          Eco<span className="text-teal-600">Loop</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          <Link to="/" className={`hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600 font-semibold" : ""}`}>Home</Link>
         
          <Link to="/login" className="hover:text-blue-600">Login</Link>
          <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-3 text-gray-700 font-medium bg-white shadow">
          <Link to="/" onClick={() => setMenuOpen(false)} className={`hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600 font-semibold" : ""}`}>Home</Link>
          
          <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Login</Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
