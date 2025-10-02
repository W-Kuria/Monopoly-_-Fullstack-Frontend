import { useNavigate } from "react-router-dom";
import axios from "axios";


function Logout() {
  const navigate = useNavigate();
   
        const handleLogout = async () => {
    try {
        await axios.post("http://127.0.0.1:5000/logout",{}, {
        
        headers: { "Content-Type": "application/json" },
        withCredentials:true
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");


    navigate("/signup");
  } catch (error) {
    console.error("Logout failed", error);
  }
}

    return(
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )

}

export default Logout