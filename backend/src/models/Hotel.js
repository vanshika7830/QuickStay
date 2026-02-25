const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  id: { type: String, unique: true },       
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  images: { type: [String], default: [] },  
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  rooms: { type: Number, default: 0 },
  description: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);