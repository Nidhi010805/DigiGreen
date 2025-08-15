import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import API from "../services/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/api/product/all")
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Unexpected API response:", res.data);
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setProducts([]);
      });
  }, []);

  return (
   <div className="max-w-7xl mx-auto p-4 mt-5">

      
      <motion.h1
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-3xl font-bold text-green-700 text-center mt-0 mb-4"
>
  All Products
</motion.h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products
            .filter(p => p.imageUrl && p.imageUrl.trim() !== "" && p.price > 0)
            .map(p => (
              <ProductCard key={p.id} product={p} />
            ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center text-gray-500 text-lg"
          >
            No products found.
          </motion.p>
        )}
      </div>
    </div>
  );
}
