import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser()
      .then(() => {
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout failed", err);

        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  return <p>Logging out...</p>;
}
