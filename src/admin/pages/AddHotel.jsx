import "./AddHotel.css";
import { ImagePlus, Save } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddHotel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    price: "",
    rating: "",
    rooms: "",
    description: "",
    status: "active",
  });

  const [files, setFiles] = useState([]); // store selected files

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files)); // store File objects
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate unique slug ID
      const id = `${form.name}_${form.city}`
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      const formData = new FormData();
      formData.append("id", id);
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      files.forEach((file) => formData.append("images", file)); // append files

      const res = await axios.post("http://localhost:5000/api/hotels/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Hotel added successfully!");
      setForm({
        name: "",
        city: "",
        address: "",
        price: "",
        rating: "",
        rooms: "",
        description: "",
        status: "active",
      });
      setFiles([]);
      navigate("/admin/hotels"); // optional: redirect to hotels list
    } catch (err) {
      console.error("ERROR ADDING HOTEL:", err);
      alert(err.response?.data?.message || "Error adding hotel");
    }
  };

  return (
    <div className="addHotelPage">
      <div className="addHotelHeader" data-aos="fade-up">
        <div>
          <h1>Add Hotel</h1>
          <p>Create a new hotel listing for QuickStay.</p>
        </div>
      </div>

      <div className="addHotelCard" data-aos="fade-up" data-aos-delay="150">
        <form className="hotelForm" onSubmit={handleSubmit}>
          <div className="formRow">
            <div className="formGroup">
              <label>Hotel Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Eg: Luxury Resort Goa"
                required
              />
            </div>

            <div className="formGroup">
              <label>City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Eg: Goa"
                required
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Eg: Calangute Beach Road"
                required
              />
            </div>

            <div className="formGroup">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Price (per night)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Eg: 4999"
                required
              />
            </div>

            <div className="formGroup">
              <label>Rating</label>
              <input
                type="number"
                step="0.1"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="Eg: 4.8"
                required
              />
            </div>

            <div className="formGroup">
              <label>Total Rooms</label>
              <input
                type="number"
                name="rooms"
                value={form.rooms}
                onChange={handleChange}
                placeholder="Eg: 50"
                required
              />
            </div>
          </div>

          <div className="formGroup full">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write hotel description..."
              rows="5"
              required
            />
          </div>

          {/* Upload Images */}
          <div className="uploadBox">
            <div className="uploadIcon">
              <ImagePlus size={22} />
            </div>
            <div>
              <h3>Upload Hotel Images</h3>
              <p>Images will be uploaded to server</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFiles}
              className="uploadBtn"
            />
          </div>

          <div className="formActions">
            <button className="saveBtn" type="submit">
              <Save size={18} /> Save Hotel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}