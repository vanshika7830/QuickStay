const express = require("express");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE BOOKING
 */
router.post("/", protect, async (req, res) => {
  try {
    const {
      hotelId,
      checkIn,
      checkOut,
      guests,
      rooms,
      totalPrice,
      specialRequest,
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const booking = new Booking({
      user: req.user._id,   // ✅ correct
      hotel: hotelId,
      checkIn,
      checkOut,
      guests,
      rooms,
      totalPrice,
      specialRequest,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking successful",
      booking,
    });

  } catch (error) {
    console.log("BOOKING ERROR:", error);
    res.status(500).json({ message: "Booking failed" });
  }
});

/**
 * GET USER BOOKINGS
 */
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.log("FETCH BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ================= CANCEL BOOKING =================
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow cancelling confirmed bookings
    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    console.log("CANCEL BOOKING ERROR:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});



// ================= GET ALL BOOKINGS (ADMIN) =================
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")   // include user info
      .populate("hotel", "name location") // include hotel info
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.log("FETCH ALL BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Error fetching all bookings" });
  }
});

module.exports = router;