import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Trash2Icon, Plus } from "lucide-react";
import { updateSubCategory } from "../../../../Api/Admin/Category/SubCategory/SubCategoryUpdate";

const UpdateSubCategoryModal = ({
  isOpen,
  subCategory,
  onClose,
  onSuccess,
  handleDropdownClick,
}) => {
  if (!isOpen || !subCategory) return null;

  const [image, setImage] = React.useState(subCategory.image || null);
  const initialImage = React.useRef(subCategory.image);
  const [submitErrors, setSubmitErrors] = React.useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    watch,
  } = useForm({
    defaultValues: {
      name: subCategory.name,
    },
  });

  // Watch form fields for changes
  const watchedName = watch("name");

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

  const removeImage = () => setImage(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if any changes are made to the form
  const hasFormChanges = React.useMemo(() => {
    const nameChanged = watchedName !== subCategory.name;
    const imageChanged =
      image?.file !== undefined ||
      (initialImage.current !== null && image === null) ||
      (initialImage.current === null && image !== null);

    return nameChanged || imageChanged;
  }, [watchedName, image, subCategory.name]);

  const onSubmit = async (data) => {
    setIsUpdating(true);
    if (!hasFormChanges) {
      toast.info("No changes detected.");
      return;
    }

    // Validate form
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setSubmitErrors(validationErrors);
      return;
    }

    const subCategoryData = {
      name: data.name,
      image: image?.file || null, // Include image only if it exists
    };

    try {
      await updateSubCategory(subCategory._id, subCategoryData, CIP_Token);

      // Show success toast and reset errors
      toast.success("Subcategory updated successfully!");
      setSubmitErrors({});
      onSuccess();

      // Prevent dropdown toggle
      handleDropdownClick(subCategory.category, null, true);
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error(error.message || "Error updating subcategory.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-admintext text-white p-4 rounded shadow-md max-w-xs w-full flex flex-col">
        <div className="mb-4">
          <h3 className="minicontent font-semibold">Update Sub Category</h3>
        </div>

        <div className="mb-4">
          <h3 className="microcontent font-semibold mb-2 text-left">
            Sub Category Image
          </h3>
          <div className="mb-4">
            {image ? (
              <div className="relative mb-4">
                <img
                  src={image.url || subCategory.image}
                  alt="Subcategory"
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-600"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2  text-admintext bg-bggray rounded-full w-8 h-8 flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                >
                  <Trash2Icon className="w-4 h-4 hover:text-white" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="w-full h-24 border-2 border-dashed border-white rounded-lg flex items-center justify-center hover:border-primary">
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
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-left microcontent">
              Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              className={`w-full p-2 bg-gray-700 rounded border ${
                submitErrors.name ? "border-red-500" : "border-gray-600"
              } text-black`}
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
              className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`button px-3 text-white rounded ${
                hasFormChanges
                  ? "bg-primary hover:bg-primary text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              disabled={isUpdating || !hasFormChanges}
            >
              {isUpdating ? (
                <img
                  src="/common/formloader.gif"
                  alt="Loading..."
                  className="h-6 w-6"
                />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubCategoryModal;
