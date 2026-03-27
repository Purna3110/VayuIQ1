import { Router, type IRouter } from "express";

const router: IRouter = Router();

const AQI_CATEGORIES = [
  { max: 50, category: "Good", healthAdvice: "Air quality is satisfactory. Enjoy outdoor activities." },
  { max: 100, category: "Moderate", healthAdvice: "Air quality is acceptable. Unusually sensitive individuals should limit prolonged outdoor exertion." },
  { max: 150, category: "Unhealthy for Sensitive Groups", healthAdvice: "People with heart or lung disease, older adults, and children should reduce prolonged outdoor exertion." },
  { max: 200, category: "Unhealthy", healthAdvice: "Everyone may begin to experience health effects. Sensitive groups should avoid outdoor exertion." },
  { max: 300, category: "Very Unhealthy", healthAdvice: "Health alert: Everyone may experience serious health effects. Avoid outdoor activities." },
  { max: 500, category: "Hazardous", healthAdvice: "Health emergency. Everyone should avoid all outdoor exertion." },
];

function getCategory(aqi: number) {
  return AQI_CATEGORIES.find(c => aqi <= c.max) || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

function getRiskPercentage(aqi: number) {
  return Math.min(100, Math.round((aqi / 500) * 100));
}

const HYDERABAD_HOTSPOTS = [
  { id: 1, lat: 17.3850, lng: 78.4867, aqi: 168, name: "Secunderabad", severity: "unhealthy" },
  { id: 2, lat: 17.4399, lng: 78.4983, aqi: 145, name: "Begumpet", severity: "moderate" },
  { id: 3, lat: 17.3616, lng: 78.4747, aqi: 187, name: "Charminar", severity: "unhealthy" },
  { id: 4, lat: 17.4156, lng: 78.4347, aqi: 112, name: "Banjara Hills", severity: "moderate" },
  { id: 5, lat: 17.4947, lng: 78.3996, aqi: 93, name: "HITEC City", severity: "moderate" },
  { id: 6, lat: 17.3279, lng: 78.5511, aqi: 203, name: "LB Nagar", severity: "very-unhealthy" },
  { id: 7, lat: 17.4239, lng: 78.5479, aqi: 156, name: "Uppal", severity: "unhealthy" },
  { id: 8, lat: 17.4840, lng: 78.5740, aqi: 134, name: "Kompally", severity: "moderate" },
];

router.get("/current", (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 17.3850;
  const lng = parseFloat(req.query.lng as string) || 78.4867;

  const baseAqi = 140 + Math.floor(Math.random() * 40);
  const { category, healthAdvice } = getCategory(baseAqi);

  res.json({
    aqi: baseAqi,
    category,
    dominantPollutant: "PM2.5",
    temperature: 28 + Math.round(Math.random() * 5),
    humidity: 55 + Math.round(Math.random() * 15),
    windSpeed: 8 + Math.round(Math.random() * 10),
    location: "Hyderabad, India",
    lat,
    lng,
    riskPercentage: getRiskPercentage(baseAqi),
    healthAdvice,
    timestamp: new Date().toISOString(),
  });
});

router.get("/prediction", (_req, res) => {
  const now = new Date();
  const predictions = [0, 1, 2].map(i => {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const aqi = 120 + Math.floor(Math.random() * 80);
    const { category } = getCategory(aqi);
    return {
      date: date.toISOString().split("T")[0],
      aqi,
      category,
    };
  });

  const avgAqi = predictions.reduce((s, p) => s + p.aqi, 0) / predictions.length;
  let insight = "Air quality will remain at moderate-to-unhealthy levels. ";
  if (avgAqi > 150) {
    insight += "Sensitive individuals and children should avoid prolonged outdoor exposure. Consider wearing N95 masks.";
  } else if (avgAqi > 100) {
    insight += "Limit extended outdoor activities during peak hours (8-11am, 5-8pm).";
  } else {
    insight += "Conditions are relatively safe for most outdoor activities.";
  }

  res.json({ predictions, insight });
});

router.get("/hotspots", (_req, res) => {
  res.json(HYDERABAD_HOTSPOTS);
});

export default router;
