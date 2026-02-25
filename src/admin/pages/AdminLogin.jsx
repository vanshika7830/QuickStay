import "./AdminLogin.css";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ================= LOGIN / SIGNUP FUNCTION =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/admin/register"
        : "http://localhost:5000/api/auth/admin/login";  // ✅ correct

      const payload = isSignup
        ? { name, email, password }
        : { email, password };

      const res = await axios.post(url, payload);

      // If login
      if (!isSignup) {
        if (res.data.user.role !== "admin") {
          setError("Access denied. Not an admin.");
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("admin", JSON.stringify(res.data.user));

        navigate("/admin/dashboard");
      } else {
        alert("Admin registered successfully. Now login.");
        setIsSignup(false);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="adminLoginPage">
      <div className="adminLoginCard">
        <h1 className="title">
          {isSignup ? "Admin Signup" : "QuickStay Admin"}
        </h1>

        <p className="subtitle">
          {isSignup
            ? "Create an admin account"
            : "Login to manage hotels & bookings"}
        </p>

        <form className="loginForm" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="inputBox">

              <input
                type="text"
                placeholder="Admin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="inputBox">

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="inputBox">

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="loginBtn" type="submit">
            {isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p className="switchText">
          {isSignup ? "Already an admin?" : "New admin?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Signup"}
          </span>
        </p>
      </div>
    </div>
  );
}