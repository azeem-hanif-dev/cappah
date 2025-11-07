import { Link } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";

const Product_Card = ({ id, title, image }) => {
  function truncateString(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }

  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-full pb-6 bg-white overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="bg-white w-full h-[320px] lg:h-[250px] flex items-center justify-center overflow-hidden">
        <img
          src={image || "common/noimage.png"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center justify-center w-full text-center mt-2">
        <h3 className="text-gray-900 w-full px-2 overflow-hidden">{title}</h3>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Details Link */}
      <Link
        to={`/products/${id}`}
        className="minicontent font-light hover:text-primary text-center"
      >
        Details →
      </Link>
    </div>
  );
};

export default Product_Card;
