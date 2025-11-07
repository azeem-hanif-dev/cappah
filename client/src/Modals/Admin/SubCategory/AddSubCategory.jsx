import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2Icon } from "lucide-react";
import Modal from "../../../Components/Admin/Common/Modal.common";
import Select_Category from "../../../Components/Common/Select_Category"; // Path to your SelectField component

const AddSubCategory = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(null);
  const [submitErrors, setSubmitErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const currentDescription = watch("description");

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Name cannot be empty";
    if (!data.category) errors.category = "Category is required";
    if (!image?.url) errors.image = "Subcategory image is required";
    return errors;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({ file, url: URL.createObjectURL(file) });
      setSubmitErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => setImage(null);

  const onSubmit = (data) => {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setSubmitErrors(validationErrors);
      return;
    }

    // Print form data
    const subcategoryData = {
      name: data.name,
      category: data.category,
      description: data.description,
      image: image.file ? image.file.name : null,
    };
    console.log("SubCategory Data:", subcategoryData);
    toast.success("Form submitted successfully!");

    // Reset form and close modal
    reset();
    removeImage();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Subcategory"
      className="max-w-4xl w-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row"
      >
        {/* Image Upload Section */}
        <div className="flex-none w-full md:w-1/4 md:mr-4">
          <h4 className="text-lg font-bold mb-4">Subcategory Image</h4>
          {image ? (
            <div className="relative mb-4">
              <img
                src={image.url}
                alt="Subcategory"
                className="w-full h-24 object-cover rounded-lg border-2 border-gray-600"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-gray-800 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2Icon className="w-4 h-4 text-red-800 hover:text-white" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
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
            </label>
          )}
          {submitErrors.image && (
            <p className="text-red-500 text-sm mt-2">{submitErrors.image}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex-grow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <Select_Category
              name="category"
              label="Select Category"
              register={register}
              error={errors.category || submitErrors.category}
              required={true}
            />
            {submitErrors.category && (
              <p className="text-red-500 text-sm">{submitErrors.category}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Name
            </label>
            <input
              {...register("name")}
              className={`w-full px-4 py-2 border rounded-md bg-gray-800 text-black ${
                submitErrors.name ? "border-red-500" : "border-gray-700"
              }`}
            />
            {submitErrors.name && (
              <p className="text-red-500 text-sm">{submitErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className={`w-full px-4  py-2 border rounded-md bg-gray-800 text-black ${
                errors.description ? "border-red-500" : "border-gray-700"
              }`}
            />
            <p className="mt-1 text-sm text-gray-400">
              {currentDescription?.length || 0}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddSubCategory;
