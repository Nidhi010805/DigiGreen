import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // "user", "retailer", or null
  const [loading, setLoading] = useState(true);

  // App mount पर token check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const login = (role, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUserRole(role); // Navbar तुरंत update होगा
  };

  const logout = () => {
    localStorage.clear();
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
