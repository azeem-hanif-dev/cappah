"use client";

import { useEffect, useState } from "react";
import { fetchProductsFromApi } from "../../../Api/RelatedProducts.Api";
import Related_Product_Card from "./Common/Related_Product_Card.common";
import Loader from "/common/Loader.gif";
import Not_Found from "/common/Not_Found.svg";
import { motion, AnimatePresence } from "framer-motion"; // You'll need to install framer-motion

const Related_Products = ({ category, subCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Set items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Always show 4 items per page, but the grid layout will change
      setItemsPerPage(4);
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      if (!category) return; // Exit if no category is provided
      try {
        setLoading(true); // Ensure loading state is true
        const categoryParam = subCategory || category;
        const data = await fetchProductsFromApi(categoryParam);
        const activeProducts = data.products.filter(
          (product) => product.isActive
        );
        setProducts(activeProducts || []); // Update products state
      } catch (err) {
        setError(err?.message || "Error loading products");
      } finally {
        setLoading(false); // End loading state
      }
    };
    getProducts();
  }, [category, subCategory]); // Re-fetch if category or subCategory changes

  // Calculate total pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Navigation functions
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Get current products
  const getCurrentProducts = () => {
    const startIndex = currentPage * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-12">
        <img
          src={Loader || "/placeholder.svg"}
          alt="Loading..."
          className="w-24 h-24"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    <div className="w-full py-8 px-4">
      {products && products.length > 0 ? (
        <div className="relative">
          {/* Products grid with framer motion */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {getCurrentProducts().map((product) => (
                  <div key={product._id} className="w-full">
                    <Related_Product_Card
                      id={product._id}
                      title={product.title}
                      description={product.description}
                      image={product.images[0]}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons at bottom center */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-6">
              <button
                onClick={goToPrevPage}
                className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none transition-all duration-300"
                aria-label="Previous page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={goToNextPage}
                className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none transition-all duration-300"
                aria-label="Next page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center py-12">
          <img
            src={Not_Found || "/placeholder.svg"}
            alt="No Product Available"
            className="h-64 w-64"
          />
          <p className="text-gray-500 mt-4">No related products found</p>
        </div>
      )}
    </div>
  );
};

export default Related_Products;
