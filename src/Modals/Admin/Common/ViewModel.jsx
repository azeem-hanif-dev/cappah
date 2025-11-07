import { useState, useEffect } from "react";
import { fetchCategoriesById } from "../../../Api/Common/Category/GetCategoriesById.Api";
import { fetchSubcategories } from "../../../Api/Common/Category/SubCategory/SubCategory.Api";

const ViewModal = ({ isOpen, data, onClose }) => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset names when modal opens/closes or data changes
    setCategoryName("");
    setSubCategoryName("");

    const fetchCategoryAndSubCategoryNames = async () => {
      if (data) {
        setLoading(true);

        // Fetch category name if category ID exists
        if (data.category) {
          try {
            console.log("Fetching category data for ID:", data.category);
            const categoryData = await fetchCategoriesById(data.category);
            console.log("Category API response:", categoryData);

            // Since fetchCategoriesById returns an array
            if (Array.isArray(categoryData) && categoryData.length > 0) {
              // Find the matching category by ID (if needed)
              const matchingCategory =
                categoryData.find(
                  (cat) => cat._id === data.category || cat.id === data.category
                ) || categoryData[0]; // Default to first item if no match

              if (matchingCategory && matchingCategory.name) {
                setCategoryName(matchingCategory.name);
                console.log("Category name set to:", matchingCategory.name);
              }
            }
          } catch (error) {
            console.error("Error fetching category:", error);
          }
        }

        // Fetch subcategory name if subcategory ID exists
        if (data.subCategory && data.category) {
          try {
            console.log(
              "Fetching subcategories for category ID:",
              data.category
            );
            console.log("Looking for subcategory ID:", data.subCategory);

            const subCategoriesData = await fetchSubcategories(data.category);
            console.log("Subcategories API response:", subCategoriesData);

            // Handle different response formats for subcategories
            let subcategories = [];

            if (Array.isArray(subCategoriesData)) {
              subcategories = subCategoriesData;
            } else if (
              subCategoriesData &&
              typeof subCategoriesData === "object"
            ) {
              subcategories =
                subCategoriesData.data || subCategoriesData.subcategories || [];
            }

            if (Array.isArray(subcategories) && subcategories.length > 0) {
              const matchingSubCategory = subcategories.find(
                (subCat) =>
                  subCat._id === data.subCategory ||
                  subCat.id === data.subCategory
              );

              console.log("Matching subcategory found:", matchingSubCategory);

              if (matchingSubCategory && matchingSubCategory.name) {
                setSubCategoryName(matchingSubCategory.name);
                console.log(
                  "Subcategory name set to:",
                  matchingSubCategory.name
                );
              }
            }
          } catch (error) {
            console.error("Error fetching subcategory:", error);
          }
        }

        setLoading(false);
      }
    };

    if (isOpen && data) {
      fetchCategoryAndSubCategoryNames();
    }
  }, [data, isOpen]);

  if (!isOpen || !data) return null;

  const handleImageClick = (src) => {
    setEnlargedImage(src); // Set the clicked image as enlarged
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null); // Close the enlarged image
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleString(); // Format date using built-in JS function
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  console.log("Data is following", data);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-admintext bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto">
        <h2 className="uppercase subheading3 mb-4 text-left font-bold">
          Details
        </h2>

        {data.image && (
          <img
            src={data.image || "/placeholder.svg"}
            alt="Item"
            className="w-full h-40 object-contain rounded mb-4 cursor-pointer"
            onClick={() => handleImageClick(data.image)}
            onError={(e) => {
              e.target.src = "./common/noimage.png";
            }}
          />
        )}
        {data.icon && (
          <div className="text-start mb-4 content">
            <strong className="capitalize">Icon:</strong>
            <img
              src={data.icon || "/placeholder.svg"}
              alt="Icon"
              className="w-16 h-16 object-contain rounded border cursor-pointer mt-2"
              onClick={() => handleImageClick(data.icon)}
              onError={(e) => {
                e.target.src = "./common/noimage.png";
              }}
            />
          </div>
        )}

        <div className="space-y-2 text-left content ">
          {Object.entries(data).map(([key, value]) => {
            if (
              [
                "_id",
                "__v",
                "isActive",
                "isDeleted",
                "image",
                "password",
                "icon",
              ].includes(key)
            )
              return null;

            // Handle category specially
            if (key == "category") {
              return (
                <div key={key} className="mb-2 content text-wrap break-words">
                  <strong className="capitalize">Category:</strong>{" "}
                  {categoryName || (loading ? "loading..." : value)}
                </div>
              );
            }

            // Handle subcategory specially
            if (key === "subCategory") {
              return (
                <div key={key} className="mb-2 content text-wrap break-words">
                  <strong className="capitalize">Sub Category:</strong>{" "}
                  {subCategoryName || (loading ? "loading..." : value)}
                </div>
              );
            }

            // Format date fields
            if (key === "dateOfBirth") {
              return (
                <div key={key} className="mb-2 content text-wrap break-words">
                  <strong className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </strong>{" "}
                  {formatDateOnly(value)}
                </div>
              );
            } else if (["createdAt", "updatedAt", "timestamp"].includes(key)) {
              return (
                <div key={key} className="mb-2 content text-wrap break-words">
                  <strong className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </strong>{" "}
                  {formatDate(value)}
                </div>
              );
            }

            if (key === "images" && Array.isArray(value)) {
              return (
                <div key={key} className="mb-4">
                  <strong className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </strong>
                  <div className="flex gap-2 mt-2">
                    {value.map((imgSrc, index) => (
                      <img
                        key={index}
                        src={imgSrc || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        className="w-16 h-16 object-contain rounded border cursor-pointer"
                        onClick={() => handleImageClick(imgSrc)}
                        onError={(e) => {
                          e.target.src = "./common/noimage.png";
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            if (key === "colors" && typeof value[0] === "string") {
              try {
                const parsedColors = JSON.parse(value[0]); // Parse the first element

                return (
                  <div key={key} className="mb-4 content">
                    <strong className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </strong>
                    <div className="flex gap-2 mt-2">
                      {parsedColors.map((color, index) => (
                        <span
                          key={index}
                          className="w-6 h-6 rounded-full border"
                          style={{
                            backgroundColor: color.hex,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              } catch (error) {
                console.error("Error parsing colors:", error);
              }
            }

            return (
              <div key={key} className="mb-2 content text-wrap break-words">
                <strong className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}:
                </strong>{" "}
                {typeof value === "string" || typeof value === "number"
                  ? value
                  : JSON.stringify(value)}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-4 content">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-75">
          {/* Close Button */}
          <button
            onClick={closeEnlargedImage}
            className="absolute top-4 right-4 content font-bold text-primary hover:text-white transition duration-200"
          >
            &times;
          </button>

          {/* Enlarged Image */}
          <img
            src={enlargedImage || "/placeholder.svg"}
            alt="Enlarged"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking the image
          />
        </div>
      )}
    </div>
  );
};

export default ViewModal;
