import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const retailersFile = path.join(process.cwd(), "scripts", "retailers.json");

// Helper function to calculate distance (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

// ✅ Get all retailers
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(retailersFile, "utf-8");
    const retailers = JSON.parse(data);
    res.json(retailers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch retailers", error: error.message });
  }
});

// ✅ Get retailer by ID
router.get("/:id", (req, res) => {
  try {
    const data = fs.readFileSync(retailersFile, "utf-8");
    const retailers = JSON.parse(data);
    const retailer = retailers.find(r => r.id === parseInt(req.params.id));
    if (!retailer) return res.status(404).json({ message: "Retailer not found" });
    res.json(retailer);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch retailer", error: error.message });
  }
});

// ✅ Get nearest retailer by user location
router.post("/nearest", (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    const data = fs.readFileSync(retailersFile, "utf-8");
    const retailers = JSON.parse(data);

    let nearest = null;
    let minDistance = Infinity;

    retailers.forEach((ret) => {
      if (ret.location?.lat && ret.location?.lng) {
        const dist = getDistance(lat, lng, ret.location.lat, ret.location.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = ret;
        }
      }
    });

    if (!nearest) {
      return res.status(404).json({ message: "No retailers with valid coordinates found" });
    }

    res.json({ nearest, distance: minDistance });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch nearest retailer", error: error.message });
  }
});

export default router;
