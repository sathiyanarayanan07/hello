// controllers/location.controller.js
exports.getReverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to fetch location" });
    }

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in getReverseGeocode:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
