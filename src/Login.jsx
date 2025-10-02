import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    
    if (!email) {
      setMessage("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Invalid email format");
      return;
    }
    if (!password) {
      setMessage("Password required");
      return;
    }

    try {
      
      const res = await axios.post("http://127.0.0.1:5000/login", {
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
      if (err.response && err.response.status === 401) {
        setMessage("Invalid credentials");
      } else {
        setMessage("Login failed!");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
}

export default Login;
