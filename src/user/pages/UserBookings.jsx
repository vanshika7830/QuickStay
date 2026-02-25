import { useEffect, useState } from "react";
import "./UserBookings.css";
const API = import.meta.env.VITE_API_URL;
export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/api/bookings/my-bookings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`${API}/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to cancel booking");

      const updatedBooking = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b._id === updatedBooking.booking._id ? updatedBooking.booking : b))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (!bookings.length) return <p>No bookings yet.</p>;

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">My Bookings</h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking._id}>
            <div className="booking-header">
              <h3>{booking.hotel.name}</h3>
              <span className={`status ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>

            <p>
              <strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p>
              <strong>Guests:</strong> {booking.guests} | <strong>Rooms:</strong> {booking.rooms}
            </p>
            <p>
              <strong>Total Price:</strong> ${booking.totalPrice}
            </p>

            {booking.status !== "Cancelled" && (
              <button
                className="cancel-btn"
                onClick={() => cancelBooking(booking._id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}