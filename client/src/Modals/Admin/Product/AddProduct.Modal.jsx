import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ColorPicker from "./Common/ColorPicker";
import { fetchCategories } from "../../../Api/GetCategories.Api";
import "react-toastify/dist/ReactToastify.css";
import { ImageIcon, Trash2Icon, Plus } from "lucide-react";

import { fetchSubcategories } from "../../../Api/Common/Category/SubCategory/SubCategory.Api";
import createProduct from "../../../Api/Admin/Products/Products.Api";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE_MB = 3; // 3MB limit
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

const ProductModal = ({ isOpen, onClose, fetchApi }) => {
  const [categoryId, setCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [subCategoryLoading, setsubCategoryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const CIP_Token = localStorage.getItem("CIP_Token");

  const getCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
    setLoading(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const formValues = watch();
  const currentDescription = watch("description") || "";
  const isDescriptionValid = currentDescription.length <= 500;

  useEffect(() => {
    getCategories();
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      // Check file size (convert bytes to MB)
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast.error("Image size cannot be more than 3MB");
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, and JPEG formats are allowed");
        return;
      }

      // Check max images limit
      if (images.length >= MAX_IMAGES) {
        toast.error("Maximum image limit reached");
        return;
      }

      setImages((prev) => [
        ...prev,
        {
          url: URL.createObjectURL(file),
          file,
        },
      ]);
    },
    [images.length]
  );

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetForm = useCallback(() => {
    reset();
    setSelectedColors([]);
    setImages([]);
    setSelectedSubCategoryId(null);
  }, [reset]);

  const fetchSubCategory = async (id) => {
    setsubCategoryLoading(true);
    console.log("You are in category section", id);
    try {
      const response = await fetchSubcategories(id);
      const data = await response;
      console.log("You are in category section", id, data);
      if (data) {
        console.log("You are in if loop please check");
        setSubCategories(data.data);
      } else {
        setSubCategories([]);
        setErrorMessage("No sub-categories available.");
      }
    } catch (error) {
      setErrorMessage("Failed to load sub-categories.");
    } finally {
      setsubCategoryLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      console.error("Selected category ID is null or undefined.");
      return;
    }
    setCategoryId(selectedId);
    fetchSubCategory(selectedId);
  };

  const handleFormSubmit = useCallback(
    async (data) => {
      setIsAdding(true);
      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append colors
      formData.append("colors", JSON.stringify(selectedColors));

      // Conditionally append subCategory only if selected
      if (selectedSubCategoryId) {
        formData.append("subCategory", selectedSubCategoryId);
      }

      // Append images
      images.forEach((img) => formData.append("images", img.file));

      console.log("This product addition", formData);

      try {
        const responseData = await createProduct(formData, CIP_Token);
        console.log(responseData);

        toast.success("Product added successfully!");
        fetchApi(); // Refresh products
        resetForm(); // Reset the form
        onClose(); // Close the modal
      } catch (error) {
        // Display backend error message
        toast.error(error.message);
      } finally {
        setIsAdding(false);
      }
    },
    [
      images,
      selectedColors,
      selectedSubCategoryId,
      resetForm,
      onClose,
      fetchApi,
      CIP_Token,
    ]
  );

  const isSubmitButtonDisabled = useMemo(() => {
    return (
      !formValues.category ||
      !formValues.title ||
      !formValues.description ||
      !formValues.productCode ||
      !formValues.size ||
      selectedColors.length === 0 ||
      images.length === 0
    );
  }, [
    formValues.category,
    formValues.title,
    formValues.description,
    formValues.productCode,
    formValues.size,
    selectedColors.length,
    images.length,
  ]);

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-admintext bg-opacity-50 z-50">
      <div className="bg-admintext text-white p-6 rounded shadow-md max-w-4xl w-full flex flex-col md:flex-row">
        {/* Image Upload Section - Made Sticky */}
        <div className="w-full md:w-1/3 mb-4 md:mr-5">
          <div className="sticky top-0">
            <h3 className="minicontent font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Product Images
            </h3>
            <div className="space-y-4">
              {/* Image Preview */}
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-bggray"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-admintext bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-error transition-colors duration-200"
                  >
                    <Trash2Icon className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {images.length < MAX_IMAGES && (
                <label className="cursor-pointer block">
                  <div className="w-full h-24 border-2 border-dashed border-white rounded-lg flex flex-col items-center justify-center gap-2 hover:border-admintext transition-colors duration-200">
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
                      className="hidden"
                    />
                  </div>
                </label>
              )}
              {images.length === 0 && (
                <p className="text-error microcontent mt-2">
                  At least one image is required
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Section - Made Scrollable */}
        <div className="flex-grow mt-4 max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Category Select */}
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left microcontent">
                Category
              </label>
              <select
                {...register("category", { required: true })}
                onChange={handleCategoryChange}
                className="w-full text-admintext p-2 bg-white rounded border border-bggray focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500 microcontent">Required</span>
              )}
            </div>

            {/* Subcategory Select */}
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left microcontent">
                Subcategory
              </label>
              <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                className="w-full text-admintext p-2 bg-bggray rounded border border-bggray focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                disabled={!subCategories.length}
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left microcontent">
                Product Name
              </label>
              <input
                placeholder="Name"
                {...register("title", { required: true })}
                className="w-full text-admintext p-2 bg-bggray rounded border border-bggray focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
              />
              {errors.title && (
                <span className="text-error microcontent">Required</span>
              )}
            </div>

            {/* Product Code - Moved from second page */}
            {/* Product Code - With character counter */}
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left microcontent">
                Product Code
              </label>
              <input
                placeholder="Product Code"
                {...register("productCode", {
                  required: true,
                  minLength: 1,
                  maxLength: 60,
                })}
                className="w-full text-admintext p-2 bg-bggray rounded border border-bggray focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                autoComplete="off"
              />
              {errors.productCode && (
                <span className="text-error microcontent">
                  {errors.productCode?.type === "required" && "Required"}
                  {errors.productCode?.type === "minLength" &&
                    "Must be at least 1 character"}
                  {errors.productCode?.type === "maxLength" &&
                    "Must be less than 60 characters"}
                </span>
              )}
              <div className="flex justify-between mt-1">
                <p
                  className={`microcontent ${
                    (watch("productCode")?.length || 0) > 60
                      ? "text-error"
                      : "text-bggray"
                  }`}
                >
                  {watch("productCode")?.length || 0}/60 characters
                </p>
              </div>
            </div>

            {/* Size - Moved from second page */}
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left microcontent">
                Size
              </label>
              <input
                placeholder="Size"
                {...register("size", {
                  required: true,
                  minLength: 1,
                  maxLength: 100,
                })}
                className="w-full text-admintext p-2 bg-bggray rounded border border-bggray focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                autoComplete="off"
              />
              {errors.size && (
                <span className="text-error microcontent">
                  {errors.size?.type === "required" && "Required"}
                  {errors.size?.type === "minLength" &&
                    "Must be at least 1 character"}
                  {errors.size?.type === "maxLength" &&
                    "Must be less than 100 characters"}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left microcontent">
                Description
              </label>
              <textarea
                placeholder="Description"
                {...register("description", {
                  required: "Description is required",
                  minLength: 1,
                  maxLength: 500,
                })}
                className="w-full text-admintext p-2 bg-bggray rounded border border-bggray focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
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
            <div className="mb-4">
              <label className="block microcontent mb-2 text-left microcontent">
                Select colors
              </label>
              <ColorPicker
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
              />
            </div>

            {/* Buttons Container */}
            {/* Buttons Container - Moved to end */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitButtonDisabled || isAdding}
                className={`px-4 button text-white rounded-md ${
                  isSubmitButtonDisabled
                    ? "bg-bggray cursor-not-allowed"
                    : "bg-seagreen hover:bg-primary focus:ring-primary"
                }`}
              >
                {isAdding ? (
                  <img
                    src="/common/formloader.gif"
                    alt="Loading..."
                    className="h-6 w-6"
                  />
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
