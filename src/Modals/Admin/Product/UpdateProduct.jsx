import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ImageIcon, Plus } from "lucide-react";
import ColorPicker from "./Common/ColorPicker";
import { Loader } from "lucide-react";
import ProductImage from "./ProductImage";
import { fetchSubcategories } from "../../../Api/Common/Category/SubCategory/SubCategory.Api";
import { fetchCategories } from "../../../Api/GetCategories.Api";
import { fetchProducts } from "../../../Api/Common/Product/Product.Api";
import { changeImage } from "../../../urls";
import { deleteImage } from "../../../urls";
import { productUpdate } from "../../../urls";

const MAX_IMAGES = 3;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // Ensure this is 3145728 bytes

const UpdateProductModal = ({ isOpen, onClose, product }) => {
  const [formChanges, setFormChanges] = useState({
    firstForm: false,
    secondForm: false,
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(product);
  const [error, setError] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pendingUploads, setPendingUploads] = useState(new Map());
  const [subCategory, setSubCategory] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialColors, setInitialColors] = useState([]);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const [errorMessage, setErrorMessage] = useState(null); // Added state for error messages

  const fetchSubCategory = async (id) => {
    try {
      const data = await fetchSubcategories(id);
      if (data && data.data) {
        setSubCategories(data.data);
        return data;
      } else {
        setSubCategories([]);
        setErrorMessage("No sub-categories available.");
        return null;
      }
    } catch (error) {
      setErrorMessage("Failed to load sub-categories.");
      throw error;
    }
  };

  const getCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      console.log("Fetched categoreiss is", fetchedCategories);
      setCategories(fetchedCategories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm();

  const formValues = watch();
  const currentDescription = watch("description") || "";
  const isDescriptionValid = currentDescription.length <= 500;
  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    if (productData) {
      // Parse initial colors and store them in state
      try {
        const parsedColors = JSON.parse(productData.colors[0]) || [];
        setInitialColors(parsedColors);
        setSelectedColors(parsedColors); // Also set the selectedColors initially
      } catch (error) {
        console.error("Error parsing initial colors:", error);
        setInitialColors([]);
        setSelectedColors([]); // Fallback to empty array if error
      }

      // Set other form values like category, subcategory, etc. here
    }
  }, [productData]);
  // Initialize form data and fetch subcategories when productData changes
  useEffect(() => {
    const initializeFormData = async () => {
      if (productData) {
        // Set basic form fields
        setExistingImages(productData.images || []);
        Object.entries({
          title: productData.title || "",
          productCode: productData.productCode || "",
          description: productData.description || "",
          size: productData.size || "",
        }).forEach(([key, value]) => setValue(key, value));

        // Set colors
        try {
          const parsedColors = JSON.parse(productData.colors[0]) || [];
          setSelectedColors(parsedColors);
        } catch (error) {
          console.error("Error parsing colors:", error);
          setSelectedColors([]);
        }

        // Handle category and subcategory
        if (productData.category) {
          const categoryId = productData.category;
          setCurrentCategoryId(categoryId);
          setValue("category", categoryId);

          try {
            const data = await fetchSubCategory(categoryId);
            console.log("Fetched subcategories:", data);

            if (data && data.data) {
              // Check if data and data.data exist
              setSubCategories(data.data);

              if (productData.subCategory) {
                const subCategoryId = productData.subCategory;
                setCurrentSubCategoryId(subCategoryId);
                setValue("subCategory", subCategoryId);
              }
            }
          } catch (error) {
            console.error("Error fetching subcategories:", error);
          }
        }
      }
    };

    initializeFormData();
  }, [productData, setValue]);
  useEffect(() => {
    const formValues = getValues();
    const firstFormFields = [
      "category",
      "subCategory",
      "title",
      "description",
      "productCode",
      "size",
    ];
    const secondFormFields = [];

    let firstFormChanged = false;
    let secondFormChanged = false;

    // Check first form fields
    firstFormFields.forEach((field) => {
      if (field === "category" && formValues[field] !== productData.category) {
        firstFormChanged = true;
      } else if (
        field === "subCategory" &&
        formValues[field] &&
        formValues[field] !== productData.subCategory
      ) {
        firstFormChanged = true;
      } else if (formValues[field] !== productData[field]) {
        firstFormChanged = true;
      }
    });

    // Check colors
    const currentColorsString = JSON.stringify(selectedColors);
    const originalColorsString = productData.colors?.[0] || "[]";
    if (currentColorsString !== originalColorsString) {
      firstFormChanged = true;
    }

    // Check images - compare actual image arrays
    if (
      existingImages.length !== (productData.images || []).length ||
      !existingImages.every((img) => productData.images.includes(img))
    ) {
      firstFormChanged = true;
    }

    // Check second form fields
    secondFormFields.forEach((field) => {
      if (formValues[field] !== productData[field]) {
        secondFormChanged = true;
      }
    });

    setFormChanges({
      firstForm: firstFormChanged,
      secondForm: secondFormChanged,
    });

    setHasChanges(firstFormChanged || secondFormChanged);
  }, [productData, selectedColors, existingImages, getValues]);
  useEffect(() => {
    const formValues = getValues();
    const hasAnyChanges = Object.entries(formValues).some(([key, value]) => {
      // Skip empty string values for subCategory
      if (key === "subCategory" && value === "") {
        return false;
      }

      // Handle color comparison
      if (key === "colors") {
        const currentColorsString = JSON.stringify(selectedColors);
        const originalColorsString = productData.colors?.[0] || "[]";
        return currentColorsString !== originalColorsString;
      }

      // For category and subCategory, compare with the ID from the nested object
      if (key === "category") {
        return value !== productData.category;
      }
      if (key === "subCategory") {
        return value !== productData.subCategory;
      }

      return value !== productData[key];
    });

    setHasChanges(hasAnyChanges);
  }, [productData, selectedColors, getValues]);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await fetchProducts();
      const data = response;

      if (data) {
        // Update both existingImages and productData
        setExistingImages(data.images || []);
        setProductData((prevData) => ({
          ...prevData,
          ...data, // Update all product data, not just images
        }));
      } else {
        toast.error("Failed to fetch updated product data");
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching product data: " + error.message
      );
    }
  }, []);

  const validateImage = (file) => {
    if (!file) return "Please select an image";
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload JPEG, PNG, or WebP images";
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return "Image size should be less than 3MB";
    }
    return null;
  };
  const checkForChanges = (data) => {
    // Transform colors into the required format for comparison
    const formattedColors = [JSON.stringify(selectedColors)];
    const formValues = {
      ...data,
      colors: formattedColors,
    };

    // Check each field for changes
    let hasChanges = false;

    // Check category changes
    if (formValues.category !== productData.category) {
      hasChanges = true;
    }

    // Check subcategory changes
    if (
      formValues.subCategory &&
      formValues.subCategory !== productData.subCategory
    ) {
      hasChanges = true;
    }

    // Check colors changes
    const currentColorsString = formValues.colors[0];
    const originalColorsString = productData.colors?.[0] || "[]";
    if (currentColorsString !== originalColorsString) {
      hasChanges = true;
    }

    // Check other fields
    const fieldsToCheck = ["title", "productCode", "description", "size"];

    for (const field of fieldsToCheck) {
      if (formValues[field] !== productData[field]) {
        hasChanges = true;
      }
    }

    // Check image changes
    if (JSON.stringify(existingImages) !== JSON.stringify(productData.images)) {
      hasChanges = true;
    }

    return hasChanges;
  };

  const handleImageChange = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = MAX_IMAGES - existingImages.length;

      if (files.length > remainingSlots) {
        toast.error(`You can only upload ${remainingSlots} more image(s)`);
        return;
      }

      const currentFormValues = getValues();
      const currentImages = [...existingImages];

      for (const file of files) {
        const error = validateImage(file);
        if (error) {
          toast.error(error);
          continue;
        }

        const formData = new FormData();
        formData.append("images", file);

        try {
          toast.info("Uploading image...", { autoClose: false });

          // Create a temporary URL for the file
          const tempUrl = URL.createObjectURL(file);

          // Immediately update the UI with the temporary image
          // setExistingImages((prevImages) => [...prevImages, tempUrl]);

          const response = await fetch(`${changeImage}${productData._id}`, {
            method: "PATCH",
            body: formData,
            headers: {
              Authorization: `Bearer ${CIP_Token}`,
            },
          });

          if (!response.ok) throw new Error("Failed to upload image");

          const result = await response.json();
          // console.log("Ur result is", result.data.images);
          // setExistingImages((prevImages) => [...prevImages, tempUrl]);
          if (response) {
            // Immediately update the UI with the new image
            setExistingImages((prevImages) => [
              ...prevImages,
              ...result.data.images.filter((img) => !prevImages.includes(img)),
            ]);

            // setProductData((prevData) => ({
            //   ...prevData,
            //   images: result.images,
            // }));
            console.log("Updated images:", result.images);
          }

          Object.entries(currentFormValues).forEach(([key, value]) => {
            setValue(key, value);
          });

          toast.dismiss();
          toast.success("Image uploaded successfully!");
        } catch (error) {
          // If there's an error, remove the temporary image
          setExistingImages((prevImages) =>
            prevImages.filter((img) => img !== tempUrl)
          );
          toast.dismiss();
          toast.error(error.message || "Failed to upload image");
        }
      }
    },
    [existingImages, productData._id, getValues, setValue, CIP_Token]
  );
  const removeImage = async (imagePath) => {
    if (existingImages.length === 1) {
      toast.error("At least one image is required");
      return;
    }
    try {
      toast.info("Deleting image...", { autoClose: false });
      const response = await fetch(`${deleteImage}${productData._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CIP_Token}`,
        },
        body: JSON.stringify({ imagePath: imagePath.trim() }),
      });

      if (!response.ok) throw new Error("Failed to delete image");
      setExistingImages((prevImages) =>
        prevImages.filter((img) => img !== imagePath)
      );
      toast.dismiss();
      toast.success("Image removed successfully!");
      // fetchProductData();
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Failed to remove image");
    }
  };
  const handleCategoryChange = async (e) => {
    const selectedId = e.target.value;
    setCurrentCategoryId(selectedId);
    setValue("category", selectedId);
    setCurrentSubCategoryId(null);
    setValue("subCategory", "");

    if (selectedId) {
      setIsLoading(true);
      try {
        const response = await fetchSubcategories(selectedId); // Pass selectedId to fetchSubcategories
        const data = await response.data;

        if (data) {
          setSubCategories(data);
        } else {
          toast.error("Failed to fetch subcategories");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to fetch subcategories");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    setCurrentSubCategoryId(selectedId);
    setValue("subCategory", selectedId);
  };

  // Update the handleSecondModalSubmit function
  const getChangedFields = (initialData, newData) => {
    const changedFields = {};

    Object.entries(newData).forEach(([key, value]) => {
      if (key === "subCategory") {
        const initialSubCategoryId = initialData.subCategory?._id || "";
        const newSubCategoryValue = value || "";

        // Include only if `subCategory` is actually different
        if (initialSubCategoryId !== newSubCategoryValue) {
          changedFields[key] = newSubCategoryValue;
        }
        return;
      }

      if (key === "colors") {
        const currentColorsString = value[0];
        const originalColorsString = initialData.colors?.[0] || "[]";
        if (currentColorsString !== originalColorsString) {
          changedFields[key] = value;
        }
        return;
      }

      if (key === "category") {
        if (value !== initialData.category?._id) {
          changedFields[key] = value;
        }
        return;
      }

      // For all other fields
      if (value !== initialData[key]) {
        changedFields[key] = value;
      }
    });

    return changedFields;
  };

  const handleSecondModalSubmit = async (data) => {
    try {
      setIsLoading(true);
      toast.info("Updating product...", { autoClose: false });

      const formattedColors = [JSON.stringify(selectedColors)];
      const formValues = {
        ...data,
        colors: formattedColors,
      };

      const changedData = getChangedFields(productData, formValues);

      if (
        existingImages.length &&
        JSON.stringify(existingImages) !== JSON.stringify(productData.images)
      ) {
        changedData.images = existingImages;
      }

      if (Object.keys(changedData).length === 0) {
        toast.dismiss();
        toast.info("No changes detected");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${productUpdate}${productData._id}`, {
        method: "PATCH",
        body: JSON.stringify(changedData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CIP_Token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update product");

      const result = await response.json();

      toast.dismiss();
      toast.success("Product updated successfully!");

      onClose();
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Failed to update product");
      setError(err.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-admintext bg-opacity-50 z-50">
      <div className="bg-admintext text-white p-6 rounded shadow-md max-w-4xl w-full flex flex-col md:flex-row">
        {/* Image Upload Section */}
        <div className="w-full md:w-1/3 mb-4 mr-5">
          <div className="sticky top-0">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Product Images
            </h3>
            <div className="space-y-4">
              {/* Existing Images */}
              {existingImages.map((image) => (
                <ProductImage
                  key={image} // Unique key based on the image source
                  src={image}
                  onRemove={removeImage}
                  path={image}
                />
              ))}

              {/* Upload Input */}
              {existingImages.length < MAX_IMAGES && (
                <label className="cursor-pointer block">
                  <div className="w-full h-24 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors duration-200">
                    <div className="flex justify-center items-center">
                      <span className="text-sm text-priamry flex-col justify-center items-center">
                        <Plus />{" "}
                      </span>
                      <div className="flex flex-col items-start justify-start ">
                        <span className="text-sm text-white">
                          {`Format: JPG, JPEG , PNG 
                        `}
                        </span>
                        <span className="text-sm text-white">
                          {` 
                          Size:     3 MB 
                          `}
                        </span>
                        <span className="text-sm text-white">
                          {`
                          Dimension:1000 x 1500 px.`}
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                      className="hidden"
                    />
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-grow mt-4 max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit(handleSecondModalSubmit)}>
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left">
                Category
              </label>
              <select
                {...register("category", { required: true })}
                onChange={handleCategoryChange}
                value={currentCategoryId || ""}
                className={`w-full p-2 text-admintext rounded  focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200 ${
                  errors.category ? "border-error" : ""
                }`}
              >
                <option value="" className="text-admintext ">
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="text-admintext"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Select */}
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left ">
                Sub Category
              </label>
              <select
                {...register("subCategory")}
                onChange={handleSubCategoryChange}
                value={currentSubCategoryId || ""}
                className={`w-full p-2 text-admintext rounded  focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200 ${
                  errors.subCategory ? "border-error" : ""
                }`}
              >
                <option value="" className="text-admintext">
                  Select a subcategory
                </option>
                {subCategories.map((sub) => (
                  <option
                    key={sub._id}
                    value={sub._id}
                    className="text-admintext"
                  >
                    {sub.name}
                  </option>
                ))}
              </select>
              {isLoading && (
                <div className="mt-2 flex items-center microcontent text-bggray">
                  <Loader className="animate-spin mr-2" size={16} />
                  Loading subcategories...
                </div>
              )}
            </div>

            {/* Product Name */}
            <div className="mb-4">
              <label className="block mb-2 text-left">Product Name:</label>
              <input
                {...register("title", { required: true })}
                className="w-full p-2 text-admintext rounded focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
              />
              {errors.name && <span className="text-error">Required</span>}
            </div>

            {/* Product Code - Moved from second modal */}
            <div className="mb-4">
              <label className="block mb-2 text-left">Product Code:</label>
              <input
                type="text"
                {...register("productCode", {
                  required: "Product Code is required",
                  minLength: 1,
                  maxLength: 60,
                })}
                className="w-full p-2 text-admintext rounded focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                autoComplete="off"
              />
              {errors.productCode && (
                <span className="text-error microcontent">
                  {errors.productCode.type === "required" &&
                    errors.productCode.message}
                  {errors.productCode.type === "maxLength" &&
                    "Product Code must be less than 60 characters"}
                </span>
              )}
              <div className="flex justify-between mt-1">
                <p
                  className={`microcontent ${
                    watch("productCode")?.length > 60
                      ? "text-error"
                      : "text-bggray"
                  }`}
                >
                  {watch("productCode")?.length || 0}/60 characters
                </p>
              </div>
            </div>

            {/* Size - Moved from second modal */}
            <div className="mb-4">
              <label className="block mb-2 text-left">Size:</label>
              <input
                type="text"
                {...register("size", {
                  required: "Size is required",
                  minLength: 1,
                  maxLength: 50,
                })}
                className="w-full p-2 text-admintext rounded focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                autoComplete="off"
              />
              {errors.size && (
                <span className="text-error microcontent">
                  {errors.size.type === "required" && errors.size.message}
                  {errors.size.type === "maxLength" &&
                    "Size must be less than 50 characters"}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2 text-left">Description:</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: 1,
                  maxLength: 500,
                })}
                className="w-full p-2 scrollbar-hide rounded border-primary text-admintext focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
              />
              {errors.description && (
                <span className="text-error microcontent">
                  {errors.description.message}
                </span>
              )}
              <div className="flex justify-between mt-1">
                <p
                  className={`microcontent ${
                    !isDescriptionValid ? "text-error" : "text-bggray"
                  }`}
                >
                  {currentDescription.length}/500 characters
                </p>
              </div>
            </div>

            {/* Color Picker */}
            <ColorPicker
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
            />

            {/* Buttons Container - Moved to end */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formChanges.firstForm && !formChanges.secondForm}
                className={`px-4 py-2 text-white rounded transition-colors duration-200 focus:outline-none focus:ring-2 ${
                  !formChanges.firstForm && !formChanges.secondForm
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary focus:ring-primary"
                }`}
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
