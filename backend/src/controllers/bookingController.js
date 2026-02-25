const Booking = require("../models/Booking");

// ================= CREATE BOOKING =================
exports.createBooking = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests, totalPrice } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      hotel: hotelId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: "Pending", // Default status
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CONFIRM BOOKING =================
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow confirming pending bookings
    if (booking.status !== "Pending") {
      return res.status(400).json({ message: `Booking already ${booking.status}` });
    }

    booking.status = "Confirmed";
    await booking.save();

    res.json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= USER BOOKINGS =================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hotel");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN: ALL BOOKINGS =================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("hotel");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CANCEL BOOKING =================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
