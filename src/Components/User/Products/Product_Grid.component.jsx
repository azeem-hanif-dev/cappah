import React, { useState } from "react";
import Product_Card from "./Common/Product_Card.common";
import Not_Found from "/common/Not_Found.svg";
import { motion, AnimatePresence } from "framer-motion";

const Product_Grid = ({ products = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Adjust this based on your needs

  if (products.length === 0) {
    return (
      <div className="w-full flex justify-center items-center">
        <img
          src={Not_Found}
          alt="No Products Available"
          className="h-64 w-64"
        />
      </div>
    );
  }

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Page navigation functions
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 750, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 750, behavior: "smooth" });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 750, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col">
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {currentProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.05, opacity: 0.75 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: "tween",
              }}
            >
              <Product_Card
                id={product._id}
                title={product.title}
                description={product.description}
                image={product.images[0]}
                colors={product.colors}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-8">
          <div className="flex items-center">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              className={`h-10 w-10 flex items-center justify-center rounded bg-primary text-black ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-400"
              }`}
              disabled={currentPage === 1}
            >
              <span className="text-xl">&lt;</span>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
              // Calculate the page number to display
              let pageToShow;
              if (totalPages <= 3) {
                pageToShow = index + 1;
              } else if (currentPage <= 3) {
                pageToShow = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + index;
              } else {
                pageToShow = currentPage - 2 + index;
              }

              return (
                <button
                  key={pageToShow}
                  onClick={() => goToPage(pageToShow)}
                  className={`h-10 w-10 flex items-center justify-center rounded mx-1 ${
                    currentPage === pageToShow
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              className={`h-10 w-10 flex items-center justify-center rounded bg-primary text-black ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-400"
              }`}
              disabled={currentPage === totalPages}
            >
              <span className="text-xl">&gt;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product_Grid;
