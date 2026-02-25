import "./Hotels.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Star } from "lucide-react";
const API = import.meta.env.VITE_API_URL;
export default function Hotels() {
  const navigate = useNavigate();

  const [hotelsData, setHotelsData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [minRating, setMinRating] = useState("0");
  const [city, setCity] = useState("all");
  const [loading, setLoading] = useState(true);

  // ----------------------
  // Fetch hotels from public backend route
  // ----------------------
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`${API}/api/hotels/public`); // public route
        if (!res.ok) throw new Error("Failed to fetch hotels");
        const data = await res.json();
        setHotelsData(data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setHotelsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // ----------------------
  // Extract unique cities for filter dropdown
  // ----------------------
  const cities = useMemo(() => {
    return ["all", ...new Set(hotelsData.map((h) => h.city))];
  }, [hotelsData]);

  // ----------------------
  // Filtered & sorted hotels
  // ----------------------
  const filteredHotels = useMemo(() => {
    let list = [...hotelsData];

    // search by name or city
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q)
      );
    }

    // city filter
    if (city !== "all") {
      list = list.filter((h) => h.city === city);
    }

    // minimum rating filter
    const ratingNum = Number(minRating);
    if (ratingNum > 0) {
      list = list.filter((h) => h.rating >= ratingNum);
    }

    // sorting
    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    if (sort === "ratingHigh") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [hotelsData, search, sort, minRating, city]);

  if (loading) return <div className="hotelsPage">Loading hotels...</div>;

  return (
    <div className="hotelsPage">
      {/* Header */}
      <div className="hotelsHeader">
        <h1>Hotels</h1>
        <p>Search premium stays and book instantly ✨</p>
      </div>

      {/* Filters */}
      <div className="hotelsFilters">
        <div className="searchInput">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hotel or city..."
          />
        </div>

        <div className="filterSelect">
          <SlidersHorizontal size={18} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Sort: Popular</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="ratingHigh">Rating: High to Low</option>
          </select>
        </div>

        <div className="filterSelect">
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Cities" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="filterSelect">
          <Star size={18} />
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          >
            <option value="0">Rating: All</option>
            <option value="4.0">4.0+</option>
            <option value="4.3">4.3+</option>
            <option value="4.5">4.5+</option>
            <option value="4.7">4.7+</option>
          </select>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="hotelsGrid">
        {filteredHotels.length === 0 ? (
          <div className="noHotels">
            <h3>No hotels found 😅</h3>
            <p>Try searching a different city or filter.</p>
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <div className="hotelCard" key={hotel._id}>
              <div
                className="hotelImg"
                style={{
                  backgroundImage: `url(${
                    hotel.images?.[0] || "https://via.placeholder.com/400"
                  })`,
                }}
              />

              <div className="hotelBody">
                <div className="hotelTop">
                  <h3>{hotel.name}</h3>
                  <span className="rating">{hotel.rating || "N/A"}</span>
                </div>

                <p className="hotelLoc">
                  {hotel.city} • {hotel.address || ""}
                </p>

                <div className="hotelBottom">
                  <p className="price">
                    ₹{hotel.price?.toLocaleString("en-IN") || "N/A"}{" "}
                    <span>/night</span>
                  </p>

                  <button
                    className="viewBtn"
                    onClick={() => navigate(`/hotels/${hotel._id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}