import React from "react";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  metrics,
  areaData,
  topUsers,
  topRetailers,
  timeData,
  categoryData,
  monthlyData,
  impactEquivalents,
  returnStats,
  ngoPartners,
} from "../data/dummyData";

const COLORS = [
  "#00C49F",
  "#0088FE",
  "#FFBB28",
  "#FF8042",
  "#00A1FF",
  "#00FFAA",
  "#AAFF00",
];

const AdminDashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-200 to-teal-200 p-8 shadow-md">
        <h1 className="text-4xl font-bold text-green-900 text-center">
          🌍 EcoLoop Admin Dashboard
        </h1>
        <p className="text-center text-gray-700 mt-2">
          Track environmental impact, user engagement, and partner campaigns
        </p>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* High-Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Returns", value: metrics.totalReturns, color: "text-green-700" },
            { label: "Total GreenCoins", value: metrics.totalGreenCoins, color: "text-teal-600" },
            { label: "CO₂ Saved (kg)", value: metrics.totalCO2Saved, color: "text-green-700" },
            { label: "Plastic Saved (kg)", value: metrics.totalPlasticSaved, color: "text-teal-600" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
            >
              <div className="text-gray-500 text-sm">{item.label}</div>
              <div className={`text-3xl font-bold ${item.color}`}>
                <CountUp end={item.value} duration={2} separator="," />
              </div>
            </div>
          ))}
        </div>

        {/* Users / Retailers / Campaigns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Users", value: metrics.totalUsers, color: "text-green-700" },
            { label: "Total Retailers", value: metrics.totalRetailers, color: "text-teal-600" },
            { label: "Active Campaigns", value: metrics.activeCampaigns, color: "text-green-700" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
            >
              <div className="text-gray-500 text-sm">{item.label}</div>
              <div className={`text-3xl font-bold ${item.color}`}>
                <CountUp end={item.value} duration={2} separator="," />
              </div>
            </div>
          ))}
        </div>

        {/* Returns by Region */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            📍 Returns by Region
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="returns" fill="#00C49F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Users & Retailers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              👥 Top Users
            </h2>
            <ul>
              {topUsers.map((user, idx) => (
                <li
                  key={idx}
                  className="flex justify-between py-2 border-b last:border-none"
                >
                  <span>{user.name}</span>
                  <span className="font-bold text-teal-600">
                    {user.greenCoins} GC ({user.returns} returns)
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              🏪 Top Retailers
            </h2>
            <ul>
              {topRetailers.map((r, idx) => (
                <li
                  key={idx}
                  className="flex justify-between py-2 border-b last:border-none"
                >
                  <span>{r.name}</span>
                  <span className="font-bold text-teal-600">
                    {r.approvedReturns} Returns ({r.impact})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Time Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            📈 Returns & CO₂ / Plastic Saved Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="returns" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="co2" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="plastic" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            📦 Returns by Packaging Category
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="returns"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ index }) => {
                  const entry = categoryData[index];
                  return `${entry.category} (${entry.returns})`;
                }}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value}`, props.payload.category]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            📅 Monthly Returns & CO₂ Saved
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="returns" fill="#00C49F" />
              <Bar dataKey="co2" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Environmental Equivalents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "🌳 Trees Planted Equivalent", value: impactEquivalents.treesPlantedEquivalent },
            { label: "🚗 Cars Taken Off Road", value: impactEquivalents.carsTakenOffRoad },
            { label: "💧 Water Saved (L)", value: impactEquivalents.waterSavedLiters },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-gray-500 text-sm">{item.label}</div>
              <div className="text-2xl font-bold text-green-700">
                <CountUp end={item.value} duration={2} separator="," />
              </div>
            </div>
          ))}
        </div>

        {/* Return Success Rate */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            ✅ Return Success Rate
          </h2>
          <p className="text-gray-700">
            Total Requests: <b>{returnStats.totalRequests}</b> | Approved: <b>{returnStats.approved}</b> | Rejected: <b>{returnStats.rejected}</b>
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-6">
            <div
              className="bg-green-500 h-6 rounded-full text-white text-sm text-center"
              style={{ width: `${returnStats.successRate}%` }}
            >
              {returnStats.successRate}%
            </div>
          </div>
        </div>

        {/* NGO / Partner Campaigns */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            🤝 NGO / Partner Campaigns
          </h2>
          <ul>
            {ngoPartners.map((ngo, idx) => (
              <li key={idx} className="flex justify-between py-2 border-b last:border-none">
                <span>{ngo.name}</span>
                <span className="font-bold text-teal-600">
                  {ngo.campaigns} Campaigns ({ngo.impact})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
