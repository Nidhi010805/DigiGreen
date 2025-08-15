import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function OurMission() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white to-green-50 overflow-hidden">

      {/* Subtle Background Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full opacity-20 blur-2xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto bg-white shadow-2xl backdrop-blur-xl border border-green-100 p-12 rounded-3xl relative z-10"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full shadow-lg">
            <Leaf size={32} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text mb-4">
          Our Mission
        </h2>

        {/* Decorative Underline */}
        <div className="flex justify-center mb-6">
          <div className="h-1 w-24 bg-green-500 rounded-full"></div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {/*We aim to redefine sustainable retail by enabling easy packaging returns and rewarding customers for responsible actions — building a greener, circular economy together.*/}

          <div className="text-gray-600 max-w-6xl mx-auto px-4 pt-12 pb-16">
          {/* Intro */}
          <p className="text-center text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            At <span className="font-semibold text-green-700">EcoLoop</span>, our mission is to build a greener, smarter future for retail by rethinking the way we handle packaging and inventory. We believe sustainability should be simple — both for shoppers and retailers.
          </p>

          {/* Grid for Users and Retailers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Users */}
            <div className="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-green-700 mb-2">♻️ For Users</h3>
              <p className="leading-relaxed">
                We empower everyday customers to become eco-champions by returning packaging waste easily and earning <span className="font-medium text-green-600">Green Points</span>. These points can be redeemed for cashback or rewards — turning eco-action into real impact.
              </p>
            </div>

            {/* For Retailers */}
            <div className="bg-teal-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">🛒 For Retailers</h3>
              <p className="leading-relaxed">
                We enable retailers to make <span className="font-medium text-teal-600">data-driven stocking decisions</span> through inventory forecasting tools that highlight top-selling products — ensuring products are always in stock, minimizing waste, and avoiding delivery delays.
              </p>
            </div>
          </div>
        </div>
        </motion.p>
      </motion.div>
    </section>
  );
}
