import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const Hero = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const handleCTAClick = () => {
    if (!role) navigate("/signup");
    else if (role === "user") navigate("/user/dashboard");
    else if (role === "retailer") navigate("/retailer/dashboard");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <div className="font-sans text-gray-800 relative overflow-hidden">

      <motion.section 
        initial="hidden" 
        animate="visible" 
        variants={stagger} 
        className="bg-gradient-to-b py-20 text-center px-4 relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1 }}
          className="absolute top-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-teal-500/30 rounded-full blur-3xl z-0" 
        />
        <motion.h1 variants={fadeInUp} transition={{ duration: 0.8 }} className="relative text-4xl sm:text-5xl font-bold text-teal-600 leading-tight mb-4">
          SMARTER,<span className="text-green-600">GREENER RETAIL</span><br className="hidden sm:block" /> - POWERED BY AI
        </motion.h1>
        <motion.p variants={fadeInUp} transition={{ duration: 0.8, delay: 0.3 }} className="relative text-gray-600 max-w-2xl mx-auto mb-6 text-sm sm:text-base">
          Forecast demand. Optimize routes. Reduce packaging waste. Track CO₂. Reverse carbon footprint of ecommerce.
        </motion.p>
       <motion.button
  variants={fadeInUp}
  transition={{ duration: 0.8, delay: 0.6 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleCTAClick}
  className="relative bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold text-sm sm:text-base shadow-lg"
>
  {role ? "Go to Dashboard" : "Join Now"}
</motion.button>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1.2 }} 
          className="absolute bottom-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-teal-500/30 rounded-full blur-3xl z-0" 
        />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="text-center px-4 relative z-10"
      >
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-teal-500/30 rounded-full blur-3xl z-0" />
        <motion.div className="relative z-10 mt-10 mb-10">
          <motion.img
            src="/section2.png"
            alt="GreenChain Illustration"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-4xl h-auto"
          />
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-12 relative px-4 z-10"
      >
        <div className="absolute top-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-teal-500/30 rounded-full blur-3xl z-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="backdrop-blur-lg bg-white/50 border border-white/40 rounded-xl p-6 md:p-12 shadow-md">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-start text-teal-600 mb-10">
              FEATURES
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {[{
                icon: "/icon1.png",
                title: "AI-Powered Demand Forecasting",
                text: "Lower emissions via smarter shipping & packaging"
              }, {
                icon: "/icon3.png",
                title: "Route Optimization",
                text: "Minimize delivery emissions and lead time"
              }, {
                icon: "/icon2.png",
                title: "Real-Time CO₂ & Waste Tracking Dashboard",
                text: "Get actionable carbon data & suggestions"
              }, {
                icon: "/icon4.png",
                title: "Packaging Return & Reward System",
                text: "Gamified incentives for circular ecommerce"
              }].map(({ icon, title, text }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start p-4 gap-4"
                >
                  <div className="w-24 h-24 p-2 rounded-lg backdrop-blur-md bg-white/10 border shadow-black-700/50 shadow-md flex items-center justify-center">
                    <img src={icon} alt={title} className="w-16 h-16" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-black mb-1 text-base sm:text-lg">{title}</h3>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-teal-500/30 rounded-full blur-3xl z-0" />
      </motion.section>

      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={fadeInUp} 
        className="bg-teal-600 py-12 text-center px-4 relative z-10"
      >
        <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Together We’ve Achieved :</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative z-10">
          <motion.div whileHover={{ scale: 1.1 }} className="backdrop-blur-lg bg-white/30 rounded-lg p-6 shadow-md w-64">
            <div className="text-2xl font-bold text-white">
              <CountUp end={12000} duration={3} separator="," />+
            </div>
            <div className="text-sm text-white">packages returned</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="backdrop-blur-lg bg-white/30 rounded-lg p-6 shadow-md w-64">
            <div className="text-2xl font-bold text-white">
              <CountUp end={8} duration={2.5} decimals={1} />+
            </div>
            <div className="text-sm text-white">tons CO₂ saved</div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="pt-24 pb-16 px-4 relative z-10"
      >
        <div className="absolute top-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-teal-500/30 rounded-full blur-3xl z-0" />
        <motion.div className="flex flex-col items-center text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">Ready to make an Impact?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6 text-sm md:text-base">
            Let’s drive smarter routes, greener deliveries, and circular packaging — CO₂-optimized ecommerce is here.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCTAClick}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base"
          >
            {role === "user"
              ? "Collect more Green Points"
              : role === "retailer"
              ? "Manage Smarty"
              : "Explore more Features"}
          </motion.button>
        </motion.div>
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-teal-500/30 rounded-full blur-3xl z-0" />
      </motion.section>
    </div>
  );
};

export default Hero;
