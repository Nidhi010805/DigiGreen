// 🔹 High-level Metrics
export const metrics = {
  totalReturns: 18500,
  totalGreenCoins: 45200,
  totalCO2Saved: 6800, // kg
  totalPlasticSaved: 1950, // kg
  totalUsers: 2400,
  totalRetailers: 320,
  activeCampaigns: 15
};

// 🔹 Area-wise Returns
export const areaData = [
  { region: "Delhi", returns: 4500, growth: "12%" },
  { region: "Mumbai", returns: 3800, growth: "9%" },
  { region: "Bengaluru", returns: 3000, growth: "15%" },
  { region: "Chennai", returns: 2200, growth: "7%" },
  { region: "Kolkata", returns: 1800, growth: "5%" },
  { region: "Hyderabad", returns: 1500, growth: "6%" },
  { region: "Pune", returns: 1200, growth: "4%" },
];

// 🔹 Top Users
export const topUsers = [
  { name: "Anjali", greenCoins: 2200, returns: 180 },
  { name: "Ravi", greenCoins: 2150, returns: 175 },
  { name: "Priya", greenCoins: 2100, returns: 160 },
  { name: "Karan", greenCoins: 2050, returns: 155 },
  { name: "Meera", greenCoins: 2000, returns: 150 }
];

// 🔹 Top Retailers
export const topRetailers = [
  { name: "EcoMart", approvedReturns: 1600, impact: "320kg CO₂ saved" },
  { name: "GreenShop", approvedReturns: 1450, impact: "290kg CO₂ saved" },
  { name: "RecycleHub", approvedReturns: 1380, impact: "275kg CO₂ saved" },
  { name: "NatureKart", approvedReturns: 1200, impact: "240kg CO₂ saved" },
  { name: "SustainaBazaar", approvedReturns: 1000, impact: "200kg CO₂ saved" }
];

// 🔹 Daily Trends
export const timeData = [
  { date: "1-Sep", returns: 200, co2: 80, plastic: 20 },
  { date: "2-Sep", returns: 250, co2: 100, plastic: 25 },
  { date: "3-Sep", returns: 300, co2: 120, plastic: 30 },
  { date: "4-Sep", returns: 280, co2: 110, plastic: 28 },
  { date: "5-Sep", returns: 320, co2: 130, plastic: 32 },
  { date: "6-Sep", returns: 350, co2: 140, plastic: 35 },
  { date: "7-Sep", returns: 400, co2: 160, plastic: 40 },
  { date: "8-Sep", returns: 420, co2: 170, plastic: 42 },
  { date: "9-Sep", returns: 390, co2: 155, plastic: 39 },
  { date: "10-Sep", returns: 450, co2: 180, plastic: 45 }
];

// 🔹 Packaging Categories
export const categoryData = [
  { category: "Plastic Bottles", returns: 5000 },
  { category: "Cardboard Boxes", returns: 4200 },
  { category: "Myntra Packages", returns: 3000 },
  { category: "Amazon Packaging", returns: 2800 },
  { category: "Electronics Packaging", returns: 2500 }
];

// 🔹 Monthly Trends
export const monthlyData = [
  { month: "Jan", returns: 1200, co2: 400 },
  { month: "Feb", returns: 1500, co2: 480 },
  { month: "Mar", returns: 1800, co2: 520 },
  { month: "Apr", returns: 2000, co2: 600 },
  { month: "May", returns: 2200, co2: 650 },
  { month: "Jun", returns: 2500, co2: 700 },
];

// 🔹 Environmental Equivalents
export const impactEquivalents = {
  treesPlantedEquivalent: 950,   // हर 7kg CO₂ ≈ 1 tree/year
  carsTakenOffRoad: 120,         // हर 56kg CO₂ ≈ 1 car off road
  waterSavedLiters: 25000        // plastic bottle conversion
};

// 🔹 Return Success Rate
export const returnStats = {
  totalRequests: 20000,
  approved: 18500,
  rejected: 1500,
  successRate: 92.5
};

// 🔹 NGO / Partner Campaigns
export const ngoPartners = [
  { name: "Clean Earth NGO", campaigns: 5, impact: "500kg CO₂ saved" },
  { name: "Green Future Org", campaigns: 3, impact: "320kg CO₂ saved" }
];
