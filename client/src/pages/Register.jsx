import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Style/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      alert(res.data.message);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Create account</h1>
          <p>Register to join Discord Clone</p>
        </div>

        <div className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />

          <button onClick={handleRegister}>Register</button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;