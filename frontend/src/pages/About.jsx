import { motion } from "framer-motion";
import { Scan, Repeat, Gift, Store } from "lucide-react";

export default function ReturnFlow() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20 px-6 flex flex-col items-center">

      <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text mb-12">
        How Retailer Return System Works
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 max-w-6xl">

        {/* Step 1 - Retailer Scans */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border shadow-xl text-center max-w-xs hover:scale-105 transition"
        >
          <div className="mx-auto bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-full w-fit mb-4">
            <Scan size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Retailer Scans Package</h3>
          <p className="text-gray-600 text-sm">
            Retailer uses QR scanner to identify product packaging for return.
          </p>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="text-4xl text-green-600 hidden md:block"
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ➡️
        </motion.div>

        {/* Step 2 - Package Returned */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-3xl border shadow-xl text-center max-w-xs hover:scale-105 transition"
        >
          <div className="mx-auto bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-full w-fit mb-4">
            <Repeat size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Packaging Returned</h3>
          <p className="text-gray-600 text-sm">
            Customer hands over empty packaging to retailer for responsible disposal or reuse.
          </p>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="text-4xl text-green-600 hidden md:block"
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ➡️
        </motion.div>

        {/* Step 3 - Earn Rewards */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-3xl border shadow-xl text-center max-w-xs hover:scale-105 transition"
        >
          <div className="mx-auto bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-full w-fit mb-4">
            <Gift size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Earn Green Points</h3>
          <p className="text-gray-600 text-sm">
            Customer gets Green Points instantly, redeemable for offers or rewards.
          </p>
        </motion.div>

      </div>

      {/* Partner Stores Note */}
      <div className="mt-12 text-center">
        <div className="flex justify-center mb-4">
          <Store size={28} className="text-green-700" />
        </div>
        <p className="text-gray-600 max-w-xl mx-auto text-sm">
          Available at all partner retail stores participating in the GreenLoop Return Network.
        </p>
      </div>
    </div>
  );
}
