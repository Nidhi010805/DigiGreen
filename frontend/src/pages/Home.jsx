// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  return (
    <div className="w-full min-h-screen pt-0 bg-gradient-to-b from-[#e0f4e8] to-[#ffffff] flex flex-col">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 py-24 px-6 overflow-hidden">

        <div className="absolute top-0 right-0 translate-x-2.5 w-72 h-72 md:w-[400px] md:h-[400px] bg-teal-500/30 rounded-full blur-3xl" />
        {/* Background Image */}
        <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 w-full max-w-4xl opacity-40 pointer-events-none z-0">
          {/*<img
            src="./assets/supply-map.avif"
            alt="Map Illustration"
            className="w-full object-contain"
            style={{ height: "580px" }}
          />*/}
        </div>

        {/* White Overlay */}
  <div className="absolute inset-0 bg-white bg-opacity-50 z-0" />

  {/* Foreground Content */}
  <div className="relative z-10 text-center max-w-3xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-2">
      <span className="text-[#007A5E]">SMARTER, </span>
      <span className="text-green-600">GREENER RETAIL</span>
    </h2>
    <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-4">
      <span className="text-[#007A5E]">- POWERED BY AI</span>
    </h2>
    <p className="text-gray-800 max-w-xl mx-auto mb-6 text-sm md:text-base">
      Return packaging, earn rewards, and track eco-impact. Retailers approve returns, and users climb the leaderboard for sustainable actions.
    </p>
    <div className="flex flex-col md:flex-row justify-center gap-4">
      <button
        onClick={() => navigate("/return")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      >
        Return Packaging
      </button>
      <button
        onClick={() => navigate("/leaderboard")}
        className="bg-white border border-green-600 text-green-600 font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      >
        View Leaderboard
      </button>
    </div>
  </div>
</div>
      {/* Features Section */}
      <section className="bg-[#e6f7f2] py-16 px-4 flex flex-col items-center">
        <h3 className="text-2xl md:text-3xl font-bold text-[#007A5E] mb-12">
          FEATURES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {[
            {
              icon: "/assets/ai-icon.png",
              title: "AI-Powered Demand Forecasting",
              desc: "Lower overstock & spoilage",
            },
            {
              icon: "/assets/route-icon.png",
              title: "Route Optimization",
              desc: "Lower carbon delivery",
            },
            {
              icon: "/assets/co2-icon.png",
              title: "Real-Time CO₂ & Waste Tracking Dashboard",
              desc: "Lower overstock & spoilage",
            },
            {
              icon: "/assets/package-icon.png",
              title: "Packaging Return & Reward System",
              desc: "Drives customer engagement & circular packaging",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <div className="w-14 h-14 bg-green-100 flex items-center justify-center rounded-lg">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-900">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section
        className="w-full py-14 px-4 text-white"
        style={{
          background: "linear-gradient(135deg, #007A5E 0%, #009B77 100%)",
        }}
      >
        <h3 className="text-center text-2xl md:text-3xl font-semibold mb-10">
          Together We've Achieved :
        </h3>

        <div className="flex flex-col md:flex-row justify-center gap-10 text-center">
          <div className="bg-[#10856a] rounded-xl px-8 py-6 shadow-lg">
            <h4 className="text-4xl font-bold">12,000+</h4>
            <p className="mt-2 text-white text-opacity-90">packages returned</p>
          </div>
          <div className="bg-[#10856a] rounded-xl px-8 py-6 shadow-lg">
            <h4 className="text-4xl font-bold">8.0+</h4>
            <p className="mt-2 text-white text-opacity-90">tons CO₂ saved</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <div className="py-16 px-6 flex flex-col items-center text-center bg-white">
        <h3 className="text-2xl font-bold text-green-900 mb-4">
          Ready to make an Impact?
        </h3>
        <p className="text-gray-700 max-w-xl mb-6">
          Let's drive smarter routes, greener deliveries, and circular packaging — one optimized shipment at a time.
        </p>
        <button
          onClick={() => navigate("/features")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded transition-all"
        >
          Explore Features
        </button>
      </div>

    </div>
  );
}
