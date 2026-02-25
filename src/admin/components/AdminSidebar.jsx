import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    isActive ? "sideLink active" : "sideLink";

  return (
    <aside className="sidebar">
      <h2 className="adminLogo">QuickStay</h2>
      <nav className="sideNav">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/hotels" className={linkClass}>
          Hotels
        </NavLink>

        <NavLink to="/admin/add-hotel" className={linkClass}>
          Add Hotel
        </NavLink>

        <NavLink to="/admin/bookings" className={linkClass}>
          Bookings
        </NavLink>
      </nav>
    </aside>
  );
}
