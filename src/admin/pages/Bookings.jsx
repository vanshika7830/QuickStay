import "./Bookings.css";
import { Search, Eye } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch all bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No admin token found!");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Map to UI-friendly fields
        const formatted = data.map((b) => ({
          id: b._id,
          user: b.user?.name || "Unknown",
          hotel: b.hotel?.name || "Unknown",
          city: b.hotel?.cityCode || "Unknown",
          amount: b.totalPrice || 0,
          status: b.status || "pending",
          date: new Date(b.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));

        setBookings(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error.response?.data || error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on search & status
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.user.toLowerCase().includes(search.toLowerCase()) ||
        b.hotel.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" ? true : b.status === status;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, status]);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="adminBookings">
      {/* Header */}
      <div className="bookingsHeader" data-aos="fade-up">
        <div>
          <h1>Bookings</h1>
          <p>Track all bookings and manage booking status.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bookingFilters" data-aos="fade-up" data-aos-delay="150">
        <div className="searchBox">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking id, user or hotel..."
          />
        </div>

        <select
          className="statusSelect"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bookingsTableCard" data-aos="fade-up" data-aos-delay="200">
        <div className="tableWrap">
          <table className="bookingsTable">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Hotel</th>
                <th>City</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="emptyRow">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b, index) => (
                  <tr
                    key={b.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 70}
                  >
                    <td className="bookingId">{b.id}</td>
                    <td>{b.user}</td>
                    <td className="hotelName">{b.hotel}</td>
                    <td>{b.city}</td>
                    <td>{b.date}</td>
                    <td className="amount">₹{b.amount}</td>
                    <td>
                      <span className={`pill ${b.status}`}>{b.status}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="viewBtn">
                        <Eye size={16} /> View
                      </button>
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