import "./AdminHotels.css";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";

export default function Hotels() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No admin token found!");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/hotels", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHotels(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error.response?.data || error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Filter hotels based on search & status
  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        (h.city || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true : h.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [hotels, search, statusFilter]);

  if (loading) return <div>Loading hotels...</div>;

  return (
    <div className="adminHotels">
      {/* Header */}
      <div className="adminHotelsHeader" data-aos="fade-up">
        <div>
          <h1>Hotels</h1>
          <p>Manage your hotels, pricing and listing status.</p>
        </div>

        <button className="addBtn" onClick={() => navigate("/admin/add-hotel")}>
          <Plus size={18} /> Add Hotel
        </button>
      </div>

      {/* Filters */}
      <div className="filterRow" data-aos="fade-up" data-aos-delay="150">
        <div className="searchBox">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hotel name or city..."
          />
        </div>

        <select
          className="statusSelect"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Hotels Table */}
      <div className="hotelsTableCard" data-aos="fade-up" data-aos-delay="200">
        <div className="tableWrap">
          <table className="hotelsTable">
            <thead>
              <tr>
                <th>Hotel</th>
                <th>City</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan="6" className="emptyRow">
                    No hotels found.
                  </td>
                </tr>
              ) : (
                filteredHotels.map((hotel, index) => (
                  <tr
                    key={hotel._id}
                    data-aos="fade-up"
                    data-aos-delay={index * 80}
                  >
                    <td className="hotelName">{hotel.name}</td>
                    <td>{hotel.city}</td>
                    <td className="priceCell">₹{hotel.price}</td>
                    <td>{hotel.rating}</td>
                    <td>
                      <span className={`pill ${hotel.status}`}>
                        {hotel.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="actions">
                        <button className="iconBtn edit">
                          <Pencil size={16} />
                        </button>
                        <button className="iconBtn delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
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