import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function Loadgame() {
    const navigate = useNavigate();

    useEffect(() => {
        const welcome = async () => {
            try {
                await axios.post("http://127.0.0.1:5000/logout",{}, {
        
                headers: { "Content-Type": "application/json" },
                withCredentials:true
            });
             } catch (error) {
                console.error("Game load failed", error);
            }
        };

        welcome();
    }, [navigate]);

    return null;
}

export default Loadgame;
