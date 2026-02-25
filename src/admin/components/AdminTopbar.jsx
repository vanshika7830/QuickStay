import { useNavigate } from "react-router-dom";
import "./AdminTopbar.css";

export default function AdminTopbar() {
  const navigate = useNavigate();

  function handleLogout() {
    // frontend only for now
    navigate("/admin/login");
  }

  return (
    <header className="topbar">
      <h3 className="topbarTitle">Admin Dashboard</h3>

      <div className="topbarActions">
        <a href="/" target="_blank" rel="noreferrer" className="viewSiteBtn">
          User
        </a>

        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
