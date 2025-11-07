import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    if (onSearch) {
      onSearch(searchTerm); // Call onSearch on every input change
    }
  };

  return (
    <div className="w-full flex justify-end">
      <div className="w-96">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="SEARCH"
            className="w-full px-4 py-4 text-primary bg-transparent rounded-full border border-seagreen focus:outline-none focus:border-seagreen focus:ring-1 focus:ring-seagreen text-sm placeholder-seagreen"
            onChange={handleChange}
          />
          <button
            className="absolute right-1 h-[80%] px-4 text-white bg-seagreen rounded-full pointer-events-none"
            aria-label="Search"
          >
            <Search size={20} className="text-white z-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
