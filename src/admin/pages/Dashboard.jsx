import "./Dashboard.css";
const API = import.meta.env.VITE_API_URL;
import {
  Hotel,
  CalendarCheck,
  IndianRupee,
  Users,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // JWT from login
    if (!token) {
      console.error("No admin token found!");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch hotels count
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${API}/api/hotels`, config);
        setStats((prev) => ({ ...prev, totalHotels: res.data.length }));
      } catch (err) {
        console.error("Error fetching hotels:", err.response?.data || err);
      }
    };

    // Fetch bookings for count and revenue
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API}/api/bookings`, config);
        const bookings = res.data;

        const totalRevenue = bookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0
        );

        setStats((prev) => ({
          ...prev,
          totalBookings: bookings.length,
          totalRevenue,
        }));

        // Latest 5 bookings
        const latest = bookings
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setRecentBookings(latest);
      } catch (err) {
        console.error("Error fetching bookings:", err.response?.data || err);
      }
    };

    // Fetch users for active count
    // Fetch users for active count
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/users`, config);

        // Count only users with role === "user"
        const activeCount = res.data.filter((u) => u.role === "user").length;

        setStats((prev) => ({ ...prev, activeUsers: activeCount }));
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err);
      }
    };

    fetchHotels();
    fetchBookings();
    fetchUsers();
  }, []);

  const statItems = [
    {
      title: "Total Hotels",
      value: stats.totalHotels,
      icon: <Hotel size={22} />,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <CalendarCheck size={22} />,
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <Users size={22} />,
    },
  ];

  return (
    <div className="adminDashboard">
      {/* Header */}
      <div className="dashHeader" data-aos="fade-up">
        <div>
          <h1>Dashboard</h1>
          <p>Quick overview of hotels, bookings and revenue.</p>
        </div>

        <button className="dashBtn">
          <TrendingUp size={18} />
          View Reports
        </button>
      </div>

      {/* Stats */}
      <div className="statsGrid">
        {statItems.map((item, index) => (
          <div
            className="statCard"
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="statIcon">{item.icon}</div>
            <div>
              <p className="statTitle">{item.title}</p>
              <h2 className="statValue">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="recentCard" data-aos="fade-up" data-aos-delay="200">
        <h2>Recent Bookings</h2>

        <div className="tableWrap">
          <table className="recentTable">
            <thead>
              <tr>
                <th>User</th>
                <th>Hotel</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="3" className="emptyRow">
                    No recent bookings
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.user?.name || b.userName || "N/A"}</td>
                    <td>{b.hotel?.name || b.hotelName || "N/A"}</td>
                    <td>
                      <span className={`status ${b.status?.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}