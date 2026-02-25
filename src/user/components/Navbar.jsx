import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect } from "react";

export default function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // simple refresh
  };

  return (
    <header className="navbar">
      <div className="navbarInner">
        <Link to="/" className="logo">
          QuickStay
        </Link>

        <nav className="navLinks">
          <Link to="/">Home</Link>

          <Link to="/admin/login">Admin</Link>

          {!isLoggedIn && (
            <Link to="/login">Login/Signup</Link>
          )}

          {isLoggedIn && (
            <>
            <Link to="/hotels">Hotels</Link>
            <Link to="/dashboard">Dashboard</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}