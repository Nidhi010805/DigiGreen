import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await API.post("/api/auth/logout");  
      } catch (error) {
        console.error("Logout Error:", error?.response?.data || error.message);
      } finally {
        localStorage.clear();
        navigate("/");  
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h2 className="text-xl font-semibold animate-pulse">Logging you out...</h2>
    </div>
  );
}
