import React from "react";
import ProductStand from "/Home/ProductStand.svg";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ image, title, description, link, category }) => {
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    console.log("Navigating with state:", { category: { _id: link } }); // Log the state
    navigate("/products", {
      state: { category: { _id: link } }, // Passing _id with link
    });
  };

  return (
    <div className="flex w-full h-full space-x-4 space-y-6 flex-col-reverse md:flex-row justify-center">
      <div className=" md:w-1/2 flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="subheading1 text-left font-semibold text-primary font-serif uppercase">
            {title}
          </h3>
          <p className="content font-light">{description}</p>
          <button
            onClick={handleLearnMoreClick}
            className="text-black font-semibold flex items-center hover:underline "
          >
            Learn More <span className="ml-3">→</span>
          </button>
        </div>
      </div>
      <div className="w-full md:w-1/2 items-center justify-center flex flex-col -space-y-16 md:-space-y-20 lg:-space-y-16">
        <img src={image} alt={title} className="z-10 " />
        <img src={ProductStand} alt="Stand" className="" />
      </div>
    </div>
  );
};

export default CategoryCard;
