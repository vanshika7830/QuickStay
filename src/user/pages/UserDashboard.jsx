import { NavLink, Outlet } from "react-router-dom";
import "./UserDashboard.css";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    isActive ? "sideLink active" : "sideLink";

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2 className="sidebar-logo">QuickStay</h2>
          <nav className="sideNav">
            <NavLink to="user-bookings" className={linkClass}>
              My Bookings
            </NavLink>
            <NavLink to="profile" className={linkClass}>
              Profile
            </NavLink>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <h1>Welcome, {user?.name} 👋</h1>

        {/* This is where nested routes will render */}
        <Outlet />
      </main>
    </div>
  );
}