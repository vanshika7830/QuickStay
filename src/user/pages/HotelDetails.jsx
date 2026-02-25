import "./HotelDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Star, Check } from "lucide-react";

export default function HotelDetails() {
  const { id } = useParams(); // This is the MongoDB _id
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hotels/${id}`);
        if (!res.ok) throw new Error("Hotel not found");
        const data = await res.json();
        setHotel(data);
      } catch (err) {
        console.error(err);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading hotel details...</h2>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Hotel not found 😅</h2>
        <button
          style={{
            marginTop: 15,
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "#111827",
            color: "white",
            fontWeight: 800,
          }}
          onClick={() => navigate("/hotels")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="hotelDetailsPage">
      {/* Top Back */}
      <button className="backBtn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Main Card */}
      <div className="detailsCard">
        {/* Image */}
        <div
          className="detailsImg"
          style={{ backgroundImage: `url(${hotel.images?.[0] || "https://via.placeholder.com/400"})` }}
        />

        {/* Content */}
        <div className="detailsBody">
          <div className="detailsTop">
            <div>
              <h1>{hotel.name}</h1>
              <p className="detailsLoc">
                <MapPin size={16} />
                {hotel.cityCode} • {hotel.address || hotel.type || ""}
              </p>
            </div>

            <div className="detailsRating">
              <Star size={16} />
              <span>{hotel.rating || "N/A"}</span>
              {/* <p>{hotel.reviews || 0} reviews</p> */}
            </div>
          </div>

          {/* Description */}
          <p className="detailsDesc">{hotel.description || "No description available."}</p>

          {/* Amenities */}
          {/* <div className="amenitiesBox">
            <h3>Amenities</h3>
            <div className="amenitiesGrid">
              {(hotel.amenities || []).map((a, index) => (
                <div key={index} className="amenityItem">
                  <Check size={16} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Bottom */}
          <div className="detailsBottom">
            <p className="detailsPrice">
              ${hotel.price?.toLocaleString("en-IN") || "N/A"} <span>/night</span>
            </p>

            <button
              className="bookBtn"
              onClick={() => navigate(`/hotels/${hotel._id}/book`)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}