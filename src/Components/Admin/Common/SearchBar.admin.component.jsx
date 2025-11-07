import React from "react";

const SearchBar = ({ placeholder, onSearch, className, ...rest }) => {
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    if (onSearch) {
      onSearch(searchTerm); // Call onSearch on every input change
    }
  };

  return (
    <div className="relative flex items-center sm:mr-4 ">
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        className="rounded-md  border border-gray-300 button pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary focus:border-transparent"
        onChange={handleChange} // Trigger search on change
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="absolute right-3 h-4 w-4 text-primary"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
