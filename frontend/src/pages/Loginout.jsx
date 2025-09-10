import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout: authLogout } = useContext(AuthContext);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await API.post("/api/auth/logout", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (error) {
        console.error(error?.response?.data || error.message);
      } finally {
        authLogout(); 

        // ✅ Navigate after a small delay to allow Navbar to re-render
        setTimeout(() => navigate("/", { replace: true }), 50);
      }
    };

    logoutUser();
  }, [authLogout, navigate]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h2 className="text-xl font-semibold animate-pulse">Logging you out...</h2>
    </div>
  );
}
