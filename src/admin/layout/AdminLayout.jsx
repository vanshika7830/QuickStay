import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import "../styles/adminLayout.css";

export default function AdminLayout() {
  return (
    <div className="adminLayout">
      <AdminSidebar />
      <div className="adminMain">
        <AdminTopbar />
        <div className="adminContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
