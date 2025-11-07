import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Trash2Icon, Plus } from "lucide-react";
import { toast } from "react-toastify";
import formloader from "/common/formloader.gif";
import { updateCategory } from "../../../Api/Admin/Category/CategoryUpdate";

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
const MAX_IMAGE_SIZE_MB = 3; // 3MB limit

const UpdateCategory = ({ isOpen, onClose, categoryData, fetchCategories }) => {
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    image: "",
    icon: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");

  const [image, setImage] = useState(
    categoryData?.image
      ? {
          url: categoryData.image,
          originalPath: categoryData.image,
        }
      : null
  );

  const [originalImage] = useState(
    categoryData?.image
      ? {
          url: categoryData.image,
          originalPath: categoryData.image,
        }
      : null
  );

  // Add logo state
  const [icon, setIcon] = useState(
    categoryData?.icon
      ? {
          url: categoryData.icon,
          originalPath: categoryData.icon,
        }
      : null
  );

  const [originalIcon] = useState(
    categoryData?.icon
      ? {
          url: categoryData.icon,
          originalPath: categoryData.icon,
        }
      : null
  );

  // Add submitErrors state
  const [submitErrors, setSubmitErrors] = useState({
    icon: "",
  });

  // Add state for sample modal
  const [showSampleModal, setShowSampleModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: categoryData?.name || "",
      description: categoryData?.description || "",
    },
    mode: "onChange",
  });

  const currentName = watch("name");
  const currentDescription = watch("description");

  const containsSpecialChars = (text) => {
    const specialCharsRegex = /[<>=`%$;'[\]{}<>]/;
    return specialCharsRegex.test(text);
  };

  useEffect(() => {
    const newErrors = { ...formErrors };

    // Name validation
    if (!currentName || currentName.trim() === "") {
      newErrors.name = "Name cannot be empty";
    } else if (currentName.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    } else if (containsSpecialChars(currentName)) {
      newErrors.name = "Name contains invalid characters";
    } else {
      newErrors.name = "";
    }

    // Description validation
    if (!currentDescription || currentDescription.trim() === "") {
      newErrors.description = "Description cannot be empty";
    } else if (currentDescription.length < 1) {
      newErrors.description = `Description must be at least 1 characters (currently ${currentDescription.length})`;
    } else if (containsSpecialChars(currentDescription)) {
      newErrors.description = "Description contains invalid characters";
    } else {
      newErrors.description = "";
    }

    // Image validation
    if (!image?.url) {
      newErrors.image = "Category image is required";
    } else {
      newErrors.image = "";
    }

    // Logo validation
    if (!icon?.url) {
      newErrors.icon = "Category icon is required";
    } else {
      newErrors.icon = "";
    }

    setFormErrors(newErrors);
  }, [currentName, currentDescription, image, icon]);

  const hasValidChanges = () => {
    const imageChanged = image?.originalPath !== originalImage?.originalPath;
    const iconChanged = icon?.originalPath !== originalIcon?.originalPath;
    const nameChanged = currentName !== categoryData?.name;
    const descriptionChanged = currentDescription !== categoryData?.description;

    const isDescriptionValid =
      currentDescription?.length >= 1 &&
      currentDescription?.length <= 80 &&
      !containsSpecialChars(currentDescription);
    const isNameValid =
      currentName?.length > 0 &&
      currentName?.length <= 50 &&
      !containsSpecialChars(currentName);
    const hasImage = !!image?.url;
    const hasIcon = !!icon?.url;

    return (
      (imageChanged || iconChanged || nameChanged || descriptionChanged) &&
      isDescriptionValid &&
      isNameValid &&
      hasImage &&
      hasIcon
    );
  };

  const handleImageChange = (event, type = "image") => {
    const file = event.target.files[0];

    if (!file) return; // Prevent errors if no file is selected

    // Check file size (convert bytes to MB)
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error("Image size cannot be more than 3MB");
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, and JPEG formats are allowed");
      return;
    }

    const newImage = {
      url: URL.createObjectURL(file),
      file,
      originalPath: null,
    };

    if (type === "icon") {
      setIcon(newImage);
    } else {
      setImage(newImage);
    }
  };

  const removeImage = (type = "image") => {
    if (type === "icon") {
      setIcon(null);
    } else {
      setImage(null);
    }
  };
  const onSubmit = async (data) => {
    if (!hasValidChanges()) return;

    try {
      setIsSubmitting(true);

      // Merge the image and logo from state into the form data

      const formData = { ...data, image, icon };

      // Call the separated API logic with the merged data
      await updateCategory(categoryData._id, formData, CIP_Token);

      // Success actions
      toast.success("Category updated successfully!");
      fetchCategories(); // Refresh categories
      onClose(); // Close the modal
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update category!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SampleIconModal = () => {
    if (!showSampleModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-admintext p-6 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="minicontent font-semibold text-white">
              Sample Icon
            </h3>
            <button
              onClick={() => setShowSampleModal(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              x
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <img
              src="/sample-logo.png"
              alt="Sample Logo"
              className="w-full h-auto"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=200&width=400";
                e.target.alt = "Sample Logo (Placeholder)";
              }}
            />
          </div>
          <div className="mt-4 text-white text-sm">
            <p>Icon requirements:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Format: PNG with transparent background preferred</li>
              <li>Size: Maximum 1MB</li>
              <li>Dimensions: Recommended 400 x 200 px</li>
            </ul>
          </div>
          <button
            onClick={() => setShowSampleModal(false)}
            className="mt-4 px-4 py-2 bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-admintext p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="minicontent font-semibold text-white">
            Update Category
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            x
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Upload Section */}
          <div className="w-full md:w-1/3">
            <h3 className="minicontent font-semibold mb-4 text-white">
              Category Image
            </h3>

            <div className="mb-4">
              {image?.url ? (
                <div className="relative">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt="Category"
                    className="w-full h-24 object-fit rounded-lg border-2 border-white "
                  />
                  <button
                    onClick={() => removeImage()}
                    className="absolute top-2 right-2 bg-gray-800 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-md"
                  >
                    <Trash2Icon className="w-4 h-4 text-white" />
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
                      {...register("image", {
                        onChange: (e) => {
                          const file = e.target.files[0];
                          if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                            toast.error("Image size cannot be more than 3MB");
                            return;
                          }

                          // Check file type
                          if (!allowedTypes.includes(file.type)) {
                            toast.error(
                              "Only PNG, JPG, and JPEG formats are allowed"
                            );
                            return;
                          }
                          if (file) {
                            setImage({
                              url: URL.createObjectURL(file),
                              file,
                              originalPath: null,
                            });
                          }
                        },
                      })}
                      className="hidden"
                    />
                  </div>
                </label>
              )}
              {formErrors.image && (
                <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
              )}
            </div>
            <h4 className="minicontent font-semibold mb-4 mt-6 text-white">
              Category Icon
            </h4>
            {icon ? (
              <div className="relative mb-4">
                <img
                  src={icon.url || "/placeholder.svg"}
                  alt="Category Logo"
                  className="w-full h-24 object-cover rounded-lg border-2 border-primary"
                />
                <button
                  onClick={() => removeImage("icon")}
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
                  <span className="microcontent text-white">
                    Icon (JPG, PNG)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "icon")}
                  className="hidden"
                />
              </label>
            )}
            {submitErrors.icon && (
              <p className="text-error text-sm mt-2">{submitErrors.icon}</p>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block microcontent font-medium text-white mb-2 text-left">
                  Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Name"
                  className={`w-full px-4 py-2 border rounded-md bg-bggray text-admintext focus:ring-2 focus:ring-primary focus:border-primary  ${
                    formErrors.name ? "border-error" : "border-bggray"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-error">{formErrors.name}</p>
                )}
                <p className="mt-1 microcontent text-white text-left">
                  {currentName?.length || 0}/50 characters
                </p>
              </div>

              <div>
                <label className="block microcontent font-medium text-white mb-2 text-left">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Description"
                  className={`w-full px-4 py-2 border rounded-md bg-bggray text-admintext focus:ring-2 focus:ring-primary focus:border-primary  ${
                    formErrors.description ? "border-error" : "border-bggray"
                  } `} // Add a space before "custom-placeholder"
                />

                {formErrors.description && (
                  <p className="mt-1 microcontent text-error text-left">
                    {formErrors.description}
                  </p>
                )}
                <p className="mt-1 microcontent text-white text-left">
                  {currentDescription?.length || 0}/80 characters
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasValidChanges() || isSubmitting}
                  className={`px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600 ${
                    hasValidChanges() && !isSubmitting
                      ? "bg-primary text-white"
                      : "bg-primary text-white cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <img
                      src={formloader || "/placeholder.svg"}
                      className="h-12 w-12"
                    />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
