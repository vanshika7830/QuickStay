const Hotel = require("../models/Hotel");
const amadeus = require("../config/amadeus");

/**
 * Helper function to generate high-quality random hotel images from Unsplash
 */
const generateHotelImages = (name, count = 4) => {
    const images = [];
    const searchTerms = ["hotel", "room", "lobby", "resort", "luxury"];
    for (let i = 0; i < count; i++) {
        const term = searchTerms[i % searchTerms.length];
        // Using source.unsplash.com with parameters for relevance
        images.push(`https://images.unsplash.com/photo-${1600000000000 + (Math.floor(Math.random() * 1000000))}?auto=format&fit=crop&w=800&q=80&sig=${Math.random()}`);
        // Alternative: use a more reliable fixed set of high quality hotel images or a predictable search query
        // Since unsplash source is deprecated, we can use a more robust approach if needed.
        // Let's use a standard search-based URL for now.
    }
    return [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    ];
};

// @desc    Get all hotels from DB
// @route   GET /api/hotels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Import hotels from Amadeus by city code
// @route   GET /api/hotels/import
exports.importHotels = async (req, res) => {
    try {
        const { cityCode = "DEL" } = req.query;

        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode,
        });

        const hotelsData = response.data;
        let importedCount = 0;

        for (let h of hotelsData) {
            const existingHotel = await Hotel.findOne({ hotelId: h.hotelId });
            if (existingHotel) continue;

            await Hotel.create({
                name: h.name,
                hotelId: h.hotelId,
                cityCode: h.iataCode,
                latitude: h.geoCode?.latitude,
                longitude: h.geoCode?.longitude,
                address: h.address?.lines?.join(", "),
                images: generateHotelImages(h.name, 4),
            });

            importedCount++;
        }

        res.json({ message: `Imported ${importedCount} new hotels for city ${cityCode}` });
    } catch (error) {
        console.error("Import Error:", error);
        res.status(500).json({ message: "Import failed", error: error.message });
    }
};

// @desc    Search hotels dynamically from Amadeus
// @route   GET /api/hotels/search
exports.searchHotels = async (req, res) => {
    try {
        const { cityCode } = req.query;
        if (!cityCode) {
            return res.status(400).json({ message: "City code is required" });
        }

        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode,
        });

        // We can either return raw data or enrich it with images on the fly
        const enrichedHotels = response.data.map(h => ({
            ...h,
            images: generateHotelImages(h.name, 4)
        }));

        res.json(enrichedHotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
