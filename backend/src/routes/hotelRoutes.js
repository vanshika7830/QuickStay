const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Hotel = require("../models/Hotel");
const { protect, adminOnly } = require("../middleware/authMiddleware");
// ----------------------
// Multer setup
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ----------------------
// GET all hotels admin
// ----------------------
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    console.log("FETCH HOTELS ERROR:", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});


// PUBLIC 
router.get("/public", async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    console.error("FETCH PUBLIC HOTELS ERROR:", err);
    res.status(500).json({ message: "Error fetching hotels", error: err.message });
  }
});

// ----------------------
// GET hotel by ID
// ----------------------
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ----------------------
// POST add hotel
// ----------------------
router.post("/add", upload.array("images", 5), async (req, res) => {
  try {
    const { name, city, address, price, rating, rooms, description, status } = req.body;

    if (!name || !city || !address) {
      return res.status(400).json({ message: "Name, city, and address are required" });
    }

    // Safely handle images even if none uploaded
    const images = (req.files || []).map(file => "/uploads/" + file.filename);

    // Generate unique hotel id
    let baseId = `${name}_${city}`.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    let id = baseId;
    let counter = 1;
    while (await Hotel.findOne({ id })) {
      counter++;
      id = `${baseId}_${counter}`;
    }

    const hotel = new Hotel({
      id,
      name,
      city,            // ✅ matches schema
      address,
      price: price ? Number(price) : 0,
      rating: rating ? Number(rating) : 0,
      rooms: rooms ? Number(rooms) : 0,
      description: description || "",
      status: status || "active",
      images,
    });

    await hotel.save();

    res.status(201).json({ message: "Hotel added successfully", hotel });
  } catch (err) {
    console.error("ERROR ADDING HOTEL:", err);
    res.status(500).json({ message: "Failed to add hotel", error: err.message });
  }
});


module.exports = router;