import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();  // Prevent page refresh on form submit

    try {
        const res = await axios.post("http://localhost:30001/login", { email, password });
        
        console.log("Login Response:", res.data); // Debugging

        if (res.data.user_id) {
            localStorage.setItem("user_id", res.data.user_id);  // Store user_id
            navigate("/events");  // Redirect to events page
        } else {
            alert("Invalid login credentials!");
        }
    } catch (error) {
        console.error("Login failed:", error.response?.data?.error || error.message);
        alert("Login failed! Check your credentials.");
    }
};


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
};

export default Login;
