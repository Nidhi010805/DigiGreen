import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PublicNavbar from "./Navbar/PublicNavbar";
import UserNavbar from "./Navbar/UserNavbar";
import RetailerNavbar from "./Navbar/RetailerNavbar";

export default function NavbarSwitcher() {
  const { userRole, loading } = useContext(AuthContext);

  if (loading) return <PublicNavbar />; 

  if (!userRole) return <PublicNavbar />;
  if (userRole === "user") return <UserNavbar />;
  if (userRole === "retailer") return <RetailerNavbar />;
}
