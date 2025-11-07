import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../../Api/GetCategories.Api"; // Import the API function
import CategoryCard from "./Common/CategoryCard";
import { useNavigate } from "react-router-dom";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories(); // Call the API function
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleExploreMore = () => {
    navigate("/products");
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col items-center space-y-8 isolate_container">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full ">
        {categories.slice(0, 4).map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-justify space-y-4 justify-center"
          >
            <CategoryCard
              image={category.image}
              title={category.name}
              description={category.description}
              link={category._id}
            />
          </div>
        ))}
      </div>
      {/* Explore More Button */}
      <button
        onClick={handleExploreMore}
        className="bg-seagreen text-white px-8 py-3 rounded-full font-semibold hover:bg-darkgreen"
      >
        EXPLORE MORE
      </button>
    </div>
  );
};

export default CategoryGrid;
