import "./Booking.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/hotels/${id}`
        );
        setHotel(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [id]);

  // -------------------------
  // FORM STATE
  // -------------------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    rooms: 1,
    request: "",
  });

  const [dateError, setDateError] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // -------------------------
  // DATE VALIDATION
  // -------------------------
  useEffect(() => {
    if (!form.checkIn || !form.checkOut) {
      setDateError("");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inDate = new Date(form.checkIn);
    const outDate = new Date(form.checkOut);

    if (inDate < today) {
      setDateError("Check-in date cannot be in the past.");
      return;
    }

    if (outDate <= inDate) {
      setDateError("Check-out must be after check-in date.");
      return;
    }

    setDateError("");
  }, [form.checkIn, form.checkOut]);

  const todayString = new Date().toISOString().split("T")[0];

  // -------------------------
  // CALCULATIONS
  // -------------------------
  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut || dateError) return 0;

    const inDate = new Date(form.checkIn);
    const outDate = new Date(form.checkOut);

    const diff = outDate - inDate;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (isNaN(days) || days <= 0) return 0;
    return days;
  }, [form.checkIn, form.checkOut, dateError]);

  const subtotal = useMemo(() => {
    if (!hotel || nights === 0) return 0;
    return hotel.price * nights * form.rooms;
  }, [hotel, nights, form.rooms]);

  const taxes = useMemo(() => {
    return Math.round(subtotal * 0.12);
  }, [subtotal]);

  const total = useMemo(() => subtotal + taxes, [subtotal, taxes]);

  // -------------------------
  // CONFIRM BOOKING
  // -------------------------
  async function handleConfirm() {
    if (!form.name.trim()) return alert("Please enter your full name");
    if (!form.email.trim()) return alert("Please enter your email");
    if (!form.phone.trim()) return alert("Please enter your phone number");
    if (!form.checkIn) return alert("Please select check-in date");
    if (!form.checkOut) return alert("Please select check-out date");

    if (dateError) return alert(dateError);

    if (nights === 0) {
      return alert("Please select valid dates.");
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return alert("Please login first");
      }

      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          hotelId: hotel._id,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: form.adults + form.children,
          rooms: form.rooms,
          totalPrice: total,
          specialRequest: form.request,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
      navigate("/dashboard/user-bookings");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Booking failed");
    }
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!hotel) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Hotel not found 😅</h2>
        <button onClick={() => navigate("/hotels")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="bookingPage">
      <button className="backBtn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bookingGrid">
        <div className="bookingFormCard">
          <h1>Confirm Booking</h1>
          <p className="muted">
            Fill the details below to book <b>{hotel.name}</b>
          </p>

          <form className="bookingForm">
            <div className="formRow">
              <div className="inputBox">
                <label>Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="inputBox">
                <label>Email</label>
                <input
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* DATES */}
            <div className="formRow">
              <div className="inputBox">
                <label>Check-in</label>
                <input
                  type="date"
                  min={todayString}
                  value={form.checkIn}
                  onChange={(e) => updateField("checkIn", e.target.value)}
                />
              </div>

              <div className="inputBox">
                <label>Check-out</label>
                <input
                  type="date"
                  min={form.checkIn || todayString}
                  value={form.checkOut}
                  onChange={(e) => updateField("checkOut", e.target.value)}
                />
              </div>
            </div>

            {/* RED ERROR MESSAGE */}
            {dateError && (
              <p style={{ color: "red", marginTop: "-10px", marginBottom: "15px", fontSize: "14px" }}>
                {dateError}
              </p>
            )}

            {/* GUESTS */}
            <div className="formRow">
              <div className="inputBox">
                <label>Adults</label>
                <select
                  value={form.adults}
                  onChange={(e) =>
                    updateField("adults", Number(e.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="inputBox">
                <label>Children</label>
                <select
                  value={form.children}
                  onChange={(e) =>
                    updateField("children", Number(e.target.value))
                  }
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="formRow">
              <div className="inputBox">
                <label>Rooms</label>
                <select
                  value={form.rooms}
                  onChange={(e) =>
                    updateField("rooms", Number(e.target.value))
                  }
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="inputBox">
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="inputBox">
              <label>Special Request</label>
              <textarea
                value={form.request}
                onChange={(e) => updateField("request", e.target.value)}
                placeholder="Any special request (optional)"
              />
            </div>

            <button
              type="button"
              className="confirmBtn"
              onClick={handleConfirm}
              disabled={!!dateError}
              style={{ opacity: dateError ? 0.6 : 1 }}
            >
              Confirm Booking
            </button>
          </form>
        </div>

        {/* SUMMARY SIDE UNCHANGED */}
        <div className="bookingSummaryCard">
          <div
            className="summaryImg"
            style={{ backgroundImage: `url(${hotel.image})` }}
          />

          <div className="summaryBody">
            <h2>{hotel.name}</h2>
            <p className="muted">
              {hotel.city}, {hotel.state} • {hotel.type}
            </p>

            <div className="summaryStats">
              <div className="statBox">
                <p>Nights</p>
                <h3>{nights || "-"}</h3>
              </div>

              <div className="statBox">
                <p>Guests</p>
                <h3>{form.adults + form.children}</h3>
              </div>

              <div className="statBox">
                <p>Rooms</p>
                <h3>{form.rooms}</h3>
              </div>
            </div>

            <div className="summaryPrice">
              <p>Price / night</p>
              <h3>₹{hotel.price?.toLocaleString("en-IN")}</h3>
            </div>

            <div className="billBox">
              <div className="billRow">
                <span>Subtotal</span>
                <b>₹{subtotal.toLocaleString("en-IN")}</b>
              </div>

              <div className="billRow">
                <span>Taxes (12%)</span>
                <b>₹{taxes.toLocaleString("en-IN")}</b>
              </div>

              <div className="billRow totalRow">
                <span>Total</span>
                <b>${total.toLocaleString("en-IN")}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}