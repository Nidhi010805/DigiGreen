import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const retailersFile = path.join(process.cwd(), "scripts", "retailers.json");

// Haversine formula to calculate distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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

// ✅ Get nearest retailer (optionally filter by accepted item)
router.post("/nearest", (req, res) => {
  try {
    let { lat, lng, acceptedItem } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    lat = Number(lat);
    lng = Number(lng);

    const data = fs.readFileSync(retailersFile, "utf-8");
    let retailers = JSON.parse(data);

    // Filter by accepted item if provided
    if (acceptedItem) {
      retailers = retailers.filter(r => r.acceptedItems?.includes(acceptedItem));
    }

    let nearest = null;
    let minDistance = Infinity;

    retailers.forEach((ret) => {
      const rLat = Number(ret.location?.lat);
      const rLng = Number(ret.location?.lng);
      if (!isNaN(rLat) && !isNaN(rLng)) {
        const dist = getDistance(lat, lng, rLat, rLng);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = ret;
        }
      }
    });

    if (!nearest) {
      return res.status(404).json({ message: "No retailers with valid coordinates found" });
    }

    res.json({ nearest, distance: minDistance.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch nearest retailer", error: error.message });
  }
});

export default router;
