import  {useState}  from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/signup", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "http://localhost:5174/"; 
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Signup failed");
      }
    }
  };

  return (
    <div >
      <div>
        <h1>Signup</h1>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
        <p>{message}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h1>Already have an account?</h1>
       
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Signup;
