import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { useState,useContext  } from "react";
import { AuthContext } from "../../context/AuthContext";




export default function RetailerNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout } = useContext(AuthContext);

  const handleLogout = () => {
   authLogout();
    navigate("/");
  };

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
           <Link to="/retailer/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
          {/* Bell Icon */}
          <button className="hover:text-blue-600 cursor-pointer"><Bell /></button>

          {/* Profile Icon + Dropdown */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="hover:text-blue-600 cursor-pointer">
              <User />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-sm z-10">
                {/* <Link to="/retailer/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link> */}
                {/* <Link to="/retailer/inventory" className="block px-4 py-2 hover:bg-gray-100">Inventory</Link>
                <Link to="/retailer/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link> */}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden text-gray-700 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow px-6 py-4 flex flex-col space-y-3 text-gray-700 font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)} className={`hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600 font-semibold" : ""}`}>Home</Link>

          {/* Bell Icon */}
          <button className="hover:text-blue-600 flex items-center gap-2 cursor-pointer" onClick={() => setMenuOpen(false)}>
            <Bell /> Notifications
          </button>

          <Link to="/retailer/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Dashboard</Link>
          {/* <Link to="/retailer/inventory" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Inventory</Link>
          <Link to="/retailer/orders" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Orders</Link> */}

          {/* Logout */}
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="hover:text-blue-600 flex items-center gap-2 cursor-pointer">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
