"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2Icon, Plus, X } from "lucide-react";
import Modal from "../../../Components/Admin/Common/Modal.common";
import { createCategory } from "../../../Api/Admin/Category/CategoryAdd";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // Ensure this is 3145728 bytes

const AddCategory = ({ isOpen, onClose, fetchApi }) => {
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [submitErrors, setSubmitErrors] = useState({});
  const [showSampleModal, setShowSampleModal] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const currentDescription = watch("description") || "";
  const currentName = watch("name") || "";
  const isDescriptionValid = currentDescription.length <= 80;
  const isNameValid = currentName.length <= 50;

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Name cannot be empty";
    if (data.name && data.name.length > 50)
      errors.name = "Name cannot exceed 50 characters";
    if (!image?.url) errors.image = "Category image is required";
    if (!logo?.url) errors.logo = "Category icon is required";
    if (data.description && data.description.length > 80) {
      errors.description = "Description cannot exceed 80 characters";
    }
    return errors;
  };

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, and JPEG formats are allowed");
      return;
    }

    // Check file size (convert bytes to MB)
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size cannot be more than 3MB");
      return;
    }

    if (type === "image") {
      setImage({ file, url: URL.createObjectURL(file) });
      setSubmitErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setLogo({ file, url: URL.createObjectURL(file) });
      setSubmitErrors((prev) => ({ ...prev, logo: "" }));
    }
  };

  const removeImage = (type) => {
    if (type === "image") {
      setImage(null);
    } else {
      setLogo(null);
    }
  };

  const onSubmit = async (data) => {
    setIsAdding(true);
    const validationErrors = validateForm(data);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitErrors(validationErrors);
      setIsAdding(false);
      return;
    }

    const categoryData = {
      name: data.name,
      description: data.description,
      image: image.file,
      logo: logo.file,
    };

    try {
      const result = await createCategory(categoryData, CIP_Token);
      console.log("Category created successfully:", result);
      toast.success("Category created successfully!");
      fetchApi();
      onClose();
    } catch (error) {
      console.error("Error creating category:", error.message);
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = useCallback(() => {
    reset();
    setImage();
    // setIsSecondModalOpen(false);
    setLogo();
    // setSelectedSubCategoryId(null);
  }, [reset]);

  const handleCancel = () => {
    resetForm();
    onClose();
  };
  const SampleLogoModal = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-admintext p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sample Icon</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="relative">
          <img
            src="/Admin/Dashboard/SampleLogo.png"
            alt="Sample Logo"
            className="w-full rounded-lg"
          />
        </div>
        <div className="mt-4 text-gray-600 microcontent">
          This is an example of how your category icon should look. Please
          ensure your icon meets these specifications for the best results.
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Category"
      className="max-w-4xl w-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row"
      >
        {/* Image Upload Section */}
        <div className="flex-none w-full md:w-1/4 md:mr-4 text-left">
          <h4 className="minicontent font-semibold mb-4">Category Image</h4>
          {image ? (
            <div className="relative mb-4">
              <img
                src={image.url || "/placeholder.svg"}
                alt="Category"
                className="w-full h-24 object-cover rounded-lg border-2 border-primary"
              />
              <button
                onClick={() => removeImage("image")}
                className="absolute top-2 right-2 text-admintext bg-bggray rounded-full w-8 h-8 flex items-center justify-center hover:bg-error hover:text-white transition-colors"
              >
                <Trash2Icon className="w-4 h-4 hover:text-white" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="w-full h-24 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-white transition-colors">
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
                  onChange={(e) => handleImageChange(e, "image")}
                  className="hidden"
                />
              </div>
            </label>
          )}
          {submitErrors.image && (
            <p className="text-error text-sm mt-2">{submitErrors.image}</p>
          )}

          {/* Logo Upload Section */}
          <h4 className="minicontent font-semibold mb-4 mt-6">Category Icon</h4>
          {logo ? (
            <div className="relative mb-4">
              <img
                src={logo.url || "/placeholder.svg"}
                alt="Category Logo"
                className="w-full h-24 object-cover rounded-lg border-2 border-primary"
              />
              <button
                onClick={() => removeImage("logo")}
                className="absolute top-2 right-2 text-admintext bg-bggray rounded-full w-8 h-8 flex items-center justify-center hover:bg-error hover:text-white transition-colors"
              >
                <Trash2Icon className="w-4 h-4 hover:text-white" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="w-full h-24 border-2 border-dashed border-white rounded-lg flex items-center justify-center hover:border-bggray/80">
                <span className="microcontent text-white">
                  <Plus />
                </span>
                <span className="microcontent text-white">Icon (JPG, PNG)</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "logo")}
                className="hidden"
              />
            </label>
          )}
          {submitErrors.logo && (
            <p className="text-error text-sm mt-2">{submitErrors.logo}</p>
          )}

          <button
            type="button"
            onClick={() => setShowSampleModal(true)}
            className="mt-2 px-4 py-2 text-sm bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors w-full"
          >
            View Sample Icon
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex-grow">
          <div className="mb-4">
            <label className="block microcontent font-medium text-bggray mb-2 text-left">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="Name"
              className={`w-full px-4 py-2 border rounded-md bg-bggray text-admintext ${
                submitErrors.name ? "border-red-500" : "border-bggray"
              }`}
            />
            {submitErrors.name && (
              <p className="text-red-500 microcontent">{submitErrors.name}</p>
            )}
            <div className="flex justify-between mt-1">
              <p
                className={`microcontent ${
                  currentName.length > 50 ? "text-error" : "text-bggray"
                }`}
              >
                {currentName.length}/50 characters
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block microcontent font-medium text-bggray mb-2 text-left">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Description"
              className={`w-full px-4 py-2 border rounded-md bg-bggray text-admintext microcontent ${
                !isDescriptionValid || errors.description
                  ? "border-error"
                  : "border-bggray"
              }`}
            />
            <div className="flex justify-between mt-1">
              <p
                className={`microcontent ${
                  !isDescriptionValid ? "text-error" : "text-bggray"
                }`}
              >
                {currentDescription.length}/80 characters
              </p>
              {/* {!isDescriptionValid && (
                <p className="text-error microcontent">
                  Description cannot exceed 80 characters
                </p>
              )} */}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding || !isDescriptionValid || !isNameValid}
              className={`px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600 ${
                isAdding || !isDescriptionValid || !isNameValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/80"
              } text-white`}
            >
              {isAdding ? (
                <img
                  src="/common/formloader.gif"
                  alt="Loading..."
                  className="h-6 w-6"
                />
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </form>

      {showSampleModal && (
        <SampleLogoModal onClose={() => setShowSampleModal(false)} />
      )}
    </Modal>
  );
};

export default AddCategory;
