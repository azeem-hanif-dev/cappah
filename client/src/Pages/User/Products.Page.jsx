import React, { useState, useEffect } from "react";
import Filter_System from "../../Components/User/Products/Filter_System.component";
import Product_Grid from "../../Components/User/Products/Product_Grid.component";
import SearchBar from "../../Components/User/Products/Common/Search_Bar.common";
import { fetchProducts } from "../../Api/Common/Product/Product.Api";
import { useLocation } from "react-router-dom";
import Hero from "../../Components/User/Products/Hero_Product.component";
const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const location = useLocation();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const products = await fetchProducts(); // Fetch all products on page load
        // console.log("Products are following", products);
        const activeProducts = products.filter((product) => product.isActive);
        setAllProducts(activeProducts);
        setFilteredProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const { category, subcategory } = location.state || {};

    if (category) setSelectedCategory(category._id);
    if (subcategory) setSelectedSubcategories([subcategory._id]);
  }, [location.state]);

  useEffect(() => {
    // Start with all products
    let filtered = allProducts;

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by selected subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSubcategories.includes(product.subCategory)
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.trim().toLowerCase();

      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubcategories, searchTerm, allProducts]);

  if (loadingProducts) {
    return (
      <div className="w-full flex justify-center items-center">
        <img src="/common/Loader.gif" alt="Loading" className="h-64 w-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <Hero />
      <div className="flex flex-col justify-between items-center isolate_container space-y-12 bg-bggray ">
        <SearchBar onSearch={setSearchTerm} />

        <div className="flex w-full">
          <div>
            <Filter_System
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategories={selectedSubcategories}
              setSelectedSubcategories={setSelectedSubcategories}
            />
          </div>
          <div className="w-full">
            <Product_Grid products={filteredProducts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
