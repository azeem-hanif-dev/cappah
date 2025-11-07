import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Trash2Icon, Plus } from "lucide-react";
import { createSubCategory } from "../../../../Api/Admin/Category/SubCategory/SubCategoryAdd";

const AddSubCategory = ({ isOpen, onClose, category, handleDropdownClick }) => {
  const [image, setImage] = useState(null);
  const [submitErrors, setSubmitErrors] = useState({});
  const CIP_Token = localStorage.getItem("CIP_Token");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch } = useForm();

  const watchedName = watch("name");

  useEffect(() => {
    console.log(category.name, "Category name is ");
    console.log(category._id, "Category is is");
  }, []);

  const containsSpecialChars = (text) => {
    const specialCharsRegex = /[<>=`%$;'[\]{}<>]/;
    return specialCharsRegex.test(text);
  };

  const validateForm = (data) => {
    const errors = {};

    // Name validation
    if (!data.name || data.name.trim() === "") {
      errors.name = "Name cannot be empty";
    } else if (data.name.length > 50) {
      errors.name = "Name cannot exceed 50 characters";
    } else if (containsSpecialChars(data.name)) {
      errors.name = "Name contains invalid characters";
    }

    return errors;
  };

  // const removeImage = () => {
  //   setImage(null);
  // };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImage({ file, url: reader.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const onSubmit = async (data) => {
    // if (!image?.file) {
    //   toast.error("Image is required.");
    //   return;
    // }

    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setSubmitErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    // formData.append("image", image.file);
    formData.append("category", category._id);

    setIsSubmitting(true);

    try {
      const result = await createSubCategory(formData, CIP_Token);
      console.log("Subcategory created successfully:", result);

      toast.success("Subcategory created successfully!");
      onClose();
      handleDropdownClick(category._id, null, true); // Prevent toggle
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Error creating subcategory:", error.message);
      toast.error(error.message || "Failed to create subcategory");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-admintext bg-opacity-70 z-50 ">
      <div className="bg-admintext text-white p-4 rounded shadow-md max-w-xs w-full flex flex-col">
        <div className="mb-4">
          <h3 className="minicontent font-bold mb-2">
            Subcategory for: {category.name}
          </h3>
        </div>

        <div className="mb-4">
          <h3 className="microcontent font-semibold mb-2 text-left ">
            Sub Category Image
          </h3>
          {/* <div className="mb-4">
            {image ? (
              <div className="relative mb-4">
                <img
                  src={image.url}
                  alt="Subcategory"
                  className="w-full h-24 object-cover rounded-lg border-2 border-bggray"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2  text-admintext bg-bggray rounded-full w-8 h-8 flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                >
                  <Trash2Icon className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="w-full h-24 border-2 border-dashed border-white rounded-lg flex items-center justify-center hover:border-black">
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
            {!image && (
              <p className="text-red-500 microcontent mt-2">
                An image is required
              </p>
            )}
          </div> */}
        </div>

        <div className="mb-4 ">
          <label
            htmlFor="category"
            className="block mb-2 microcontent text-left"
          >
            Parent Category:
          </label>
          <input
            id="category"
            type="text"
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 microcontent text-black"
            value={category.name}
            readOnly
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 microcontent text-left">
              Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              className={`w-full p-2 bg-gray-700 rounded border text-black ${
                submitErrors.name ? "border-red-500" : "border-gray-600"
              }`}
              {...register("name")}
            />
            {submitErrors.name && (
              <span className="text-red-500 text-sm">{submitErrors.name}</span>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className=" px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;
