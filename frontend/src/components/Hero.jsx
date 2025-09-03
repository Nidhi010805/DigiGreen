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
  className="py-20 relative px-6 z-10 bg-gray-50"
>
  {/* Background Decoration */}
  <div className="absolute top-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-green-400/20 rounded-full blur-3xl z-0" />
  <div className="absolute bottom-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-teal-400/20 rounded-full blur-3xl z-0" />

  <div className="max-w-6xl mx-auto relative z-10">
    <motion.h2 
      variants={fadeInUp} 
      className="text-3xl md:text-4xl font-bold text-center text-teal-600 mb-4"
    >
      Key Features & Advantages
    </motion.h2>
    <motion.p
      variants={fadeInUp}
      className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
    >
      Smart. Standardized. Sustainable. Our ecosystem enables transparency, rewards, and scalability.
    </motion.p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {[{
        icon: "/qr.png",
        title: "Unique QR Code Tracking",
        text: "Track every package’s journey with full lifecycle visibility"
      }, {
        icon: "/app.png",
        title: "User & Retailer Apps",
        text: "Frictionless returns & verifications for all stakeholders"
      }, {
        icon: "/coins.png",
        title: "GreenCoins Reward System",
        text: "Motivate consumers with cashback & reward points"
      }, {
        icon: "/dashboard.png",
        title: "Real-Time Tracking Dashboard",
        text: "Brands track recycling data & EPR compliance instantly"
      }, {
        icon: "/ai.png",
        title: "AI Damage Detection (Future)",
        text: "Ensure only reusable packaging is re-circulated"
      }, {
        icon: "/blockchain.png",
        title: "Blockchain Traceability (Future)",
        text: "Tamper-proof audit trail for government & brands"
      }].map(({ icon, title, text }, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <img src={icon} alt={title} className="w-10 h-10" />
          </div>
          <h3 className="font-semibold text-teal-700 mb-2 text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{text}</p>
        </motion.div>
      ))}
    </div>
  </div>
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
  className="relative py-20 px-6 z-10 bg-gradient-to-b from-white via-green-50 to-green-100 text-center"
>
  {/* Decorative Circles */}
  <div className="absolute top-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-green-400/20 rounded-full blur-3xl z-0" />
  <div className="absolute bottom-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-teal-400/20 rounded-full blur-3xl z-0" />

  <motion.div className="relative z-10 max-w-3xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
      One Nation, One Packaging — <span className="text-teal-600">Zero Waste</span>
    </h2>
    <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
      Join India’s first unified, reward-based circular packaging ecosystem.  
      Replace <span className="font-semibold">use-and-throw</span> with  
      <span className="font-semibold"> use-return-reward</span> and be part of the green revolution.
    </p>

    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCTAClick}
      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg transition-all"
    >
      {role === "user"
        ? "Start Returning & Earning"
        : role === "retailer"
        ? "Join as Retail Partner"
        : "Be a Part of EcooLoop"}
    </motion.button>
  </motion.div>
</motion.section>

    </div>
  );
};

export default Hero;
