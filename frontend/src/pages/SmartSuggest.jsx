import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Send } from "lucide-react";

export default function SmartSuggest() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions([
      {
        id: 1,
        name: "Biodegradable Bubble Wrap",
        description: "Eco-friendly alternative to traditional plastic bubble wrap.",
        rating: 9.2,
        source: "GreenWrap Co."
      },
      {
        id: 2,
        name: "Reusable Cloth Bags",
        description: "Durable, washable, and reusable alternative to plastic bags.",
        rating: 8.8,
        source: "EcoFabric Inc."
      },
      {
        id: 3,
        name: "Compostable Mailers",
        description: "Breaks down naturally in compost environments within 6 months.",
        rating: 9.0,
        source: "CompoPack"
      }
    ]);
  }, []);

  return (
    <div className="pt-20 px-6 md:px-16 bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-800 dark:text-green-200 mb-4 flex items-center gap-3"
      >
        <Sparkles className="text-yellow-500" /> Smart Packaging Assistant
      </motion.h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
        Your AI-powered guide to sustainable packaging options 🌱
      </p>

      {/* Chat-Like Suggestions */}
      <div className="flex-1 space-y-6 max-w-3xl mx-auto w-full">
        {suggestions.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: item.id * 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-2">
              <Bot className="text-green-700 dark:text-green-200" />
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl shadow-md w-full">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-200">{item.name}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Source: {item.source} • AI Rating: {item.rating}/10
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Box (Mock Only) */}
      <div className="mt-10 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-full shadow-inner">
          <input
            type="text"
            placeholder="Ask about sustainable packaging…"
            disabled
            className="flex-1 bg-transparent focus:outline-none text-gray-600 dark:text-gray-300 placeholder-gray-400"
          />
          <Send className="text-gray-400" />
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Chat input disabled in demo — full AI assistant coming soon 🤖
        </p>
      </div>
    </div>
  );
}
