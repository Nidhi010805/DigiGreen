import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export default function HelpCentre() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-20 px-6 flex items-center justify-center">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-2xl backdrop-blur-lg border border-green-100"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full shadow-lg">
            <HelpCircle size={32} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text mb-6">
          Help Centre
        </h1>

        {/* Decorative Line */}
        <div className="flex justify-center mb-6">
          <div className="h-1 w-24 bg-green-500 rounded-full"></div>
        </div>

        {/* Support Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mb-8"
        >
          Need assistance? Our team is here to help with your orders, returns, account setup, or any product-related queries. Explore FAQs or contact us directly.
        </motion.p>

        {/* Quick Support Options */}
        <div className="grid sm:grid-cols-2 gap-6 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="border rounded-xl p-6 hover:shadow-lg cursor-pointer transition"
          >
            <h3 className="text-lg font-bold mb-2 text-green-700">FAQs</h3>
            <p className="text-sm text-gray-600">Find answers to common questions about orders, packaging returns, and more.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="border rounded-xl p-6 hover:shadow-lg cursor-pointer transition"
          >
            <h3 className="text-lg font-bold mb-2 text-green-700">Contact Support</h3>
            <p className="text-sm text-gray-600">Need personalized help? Reach out to our team via email or live chat.</p>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
