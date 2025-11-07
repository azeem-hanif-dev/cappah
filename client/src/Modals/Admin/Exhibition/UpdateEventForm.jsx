import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TimeSelection from "./TimeSelection";
import { X, Pen } from "lucide-react";
import { updateEvent } from "../../../Api/Admin/Exhibition/UpdateExhibition";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
const UpdateEventForm = ({
  isOpen,
  onClose,
  exhibitionData,
  fetchexhibitions,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    location: "",
    fromDate: "",
    toDate: "",
    bannerImage: null,
    timeFrom: "",
    timeTo: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [isModified, setIsModified] = useState(false);
  const formatDate = (isoDate) => isoDate.split("T")[0];
  const CIP_Token = localStorage.getItem("CIP_Token");

  // Convert time to comparable format (24-hour)
  const convertTo24Hour = (hour, minute, period) => {
    if (hour === "--" || minute === "--" || period === "--") return null;
    let hr = parseInt(hour);
    if (period === "PM" && hr !== 12) hr += 12;
    if (period === "AM" && hr === 12) hr = 0;
    return `${hr.toString().padStart(2, "0")}:${minute}`;
  };
  //console.log("Event data is", exhibitionData);
  // Add this new function to compare original and current form data
  const compareFormData = (current, original) => {
    if (!original) return false;

    const fieldsToCompare = [
      "title",
      "description",
      "link",
      "location",
      "fromDate",
      "toDate",
      "timeFrom",
      "timeTo",
    ];

    // Create clean version of values for comparison
    const cleanValue = (val) => (val || "").toString().trim();

    for (const field of fieldsToCompare) {
      const currentClean = cleanValue(current[field]);
      const originalClean = cleanValue(original[field]);

      if (currentClean !== originalClean) {
        return true;
      }
    }

    // Separate check for banner image
    if (current.bannerImage instanceof File) {
      return true;
    }

    return false;
  };
  useEffect(() => {
    return () => {
      // Cleanup image URL when component unmounts
      if (formData.bannerImagePreview) {
        URL.revokeObjectURL(formData.bannerImagePreview);
      }
    };
  }, []);

  const specialCharsRegex = /[<>\/\{\}\[\]\(\)\$%@\|`~]/;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    // Special handling for link field
    if (name === "link") {
      // Only check for special characters other than : and /
      const linkSpecialCharsRegex = /[<>{}\[\]\(\)\$%@\|`~]/;
      if (linkSpecialCharsRegex.test(value)) {
        newErrors[name] = "Special characters are not allowed";
      } else if (!value.startsWith("https://")) {
        newErrors[name] = "Link must start with https://";
      } else {
        delete newErrors[name];
      }
    } else {
      // For all other fields, use the original special character check
      if (specialCharsRegex.test(value)) {
        newErrors[name] = "Special characters are not allowed";
      } else if (value.length > 500) {
        newErrors[name] = "Maximum 500 characters allowed";
      } else {
        delete newErrors[name];
      }
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    if (exhibitionData) {
      const [timeFrom, timeTo] = exhibitionData.time
        ? exhibitionData.time.split("-")
        : ["", ""];

      setFormData({
        title: exhibitionData.title || "",
        description: exhibitionData.description || "",
        link: exhibitionData.link || "",
        location: exhibitionData.location || "",
        fromDate: formatDate(exhibitionData.schedule?.fromDate) || "",
        toDate: formatDate(exhibitionData.schedule?.toDate) || "",
        timeFrom: timeFrom || "",
        timeTo: timeTo || "",
        status: exhibitionData.status || "",
        bannerImage: exhibitionData.bannerImage || [],
      });

      //   console.log("Form data after time change is",formData)
      //   console.log("From time",timeFrom)
      //   console.log("To time",timeTo)
    }
  }, [exhibitionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      const isChanged = compareFormData(updatedData, exhibitionData);
      setIsModified(isChanged);
      validateField(name, value);
      return updatedData;
    });
  };

  //Image
  const handleFileChange = (e) => {
    // Check file size (convert bytes to MB)

    const file = e.target.files[0];

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size cannot be more than 3MB");
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, and JPEG formats are allowed");
      return;
    }
    if (file) {
      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          bannerImage: file,
          bannerImagePreview: imageUrl, // Add this for preview
        };
        setIsModified(compareFormData(updatedData, exhibitionData));
        return updatedData;
      });
    }
  };
  const isFormValid = () => {
    // Basic field validation
    const requiredFields = [
      "title",
      "description",
      "link",
      "location",
      "fromDate",
      "toDate",
      "bannerImage",
    ];

    const hasAllRequiredFields = requiredFields.every((field) => {
      const value = formData[field];
      return value && (typeof value === "string" ? value.trim() !== "" : true);
    });

    // Get original dates
    const originalFromDate = exhibitionData?.schedule?.fromDate?.split("T")[0];
    const originalToDate = exhibitionData?.schedule?.toDate?.split("T")[0];

    // Only validate dates against today if they were changed
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.fromDate !== originalFromDate) {
      const fromDate = new Date(formData.fromDate);
      if (fromDate < today) {
        return false;
      }
    }

    if (formData.toDate !== originalToDate) {
      const toDate = new Date(formData.toDate);
      if (toDate < today) {
        return false;
      }
    }

    // Always validate that toDate is not before fromDate
    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      if (toDate < fromDate) {
        return false;
      }
    }

    // Time validation
    const validateTime = (time) => {
      if (!time) return false;
      const [hours, minutesPeriod] = time.split(":");
      if (!hours || !minutesPeriod) return false;
      const [minutes, period] = minutesPeriod.split(" ");
      return !isNaN(hours) && !isNaN(minutes) && ["AM", "PM"].includes(period);
    };

    const hasValidTimes =
      validateTime(formData.timeFrom) && validateTime(formData.timeTo);

    // Validate time range if dates are the same
    if (formData.fromDate === formData.toDate && hasValidTimes) {
      const fromTime = convertTo24Hour(
        ...formData.timeFrom.replace(/(AM|PM)/, " $1").split(/[:\ ]/)
      );
      const toTime = convertTo24Hour(
        ...formData.timeTo.replace(/(AM|PM)/, " $1").split(/[:\ ]/)
      );
      if (fromTime >= toTime) {
        return false;
      }
    }

    // Link validation
    const isLinkValid = formData.link.startsWith("https://");

    return (
      hasAllRequiredFields &&
      hasValidTimes &&
      isLinkValid &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    // Create a new FormData object for changed fields only
    const formDataToSubmit = new FormData();

    // Get original data for comparison
    const originalData = {
      title: exhibitionData.title || "",
      description: exhibitionData.description || "",
      link: exhibitionData.link || "",
      location: exhibitionData.location || "",
      fromDate: formatDate(exhibitionData.schedule?.fromDate) || "",
      toDate: formatDate(exhibitionData.schedule?.toDate) || "",
      timeFrom: exhibitionData.time?.split("-")[0] || "",
      timeTo: exhibitionData.time?.split("-")[1] || "",
    };

    // Compare and append only changed fields
    Object.entries(formData).forEach(([key, value]) => {
      // Handle banner image separately
      if (key === "bannerImage") {
        if (value instanceof File) {
          formDataToSubmit.append(key, value);
        }
        return;
      }

      // Skip status field
      if (key === "status") return;

      // Skip bannerImagePreview field
      if (key === "bannerImagePreview") return;

      // For all other fields, compare with original data
      const originalValue = originalData[key];
      const currentValue = value?.toString().trim() || "";
      const originalValueTrimmed = originalValue?.toString().trim() || "";

      if (currentValue !== originalValueTrimmed) {
        formDataToSubmit.append(key, currentValue);
      }
    });

    // Handle merging timeFrom and timeTo fields
    const timeFrom = formDataToSubmit.get("timeFrom") || originalData.timeFrom;
    const timeTo = formDataToSubmit.get("timeTo") || originalData.timeTo;

    if (timeFrom || timeTo) {
      const combinedTime = `${timeFrom}-${timeTo}`;
      formDataToSubmit.set("time", combinedTime);
      formDataToSubmit.delete("timeFrom");
      formDataToSubmit.delete("timeTo");
    }

    console.log("Final FormData content:");
    for (const pair of formDataToSubmit.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    setIsSubmitting(true);

    try {
      await updateEvent(formDataToSubmit, exhibitionData._id, CIP_Token);
      toast.success("Event updated successfully!");
      fetchexhibitions();
      onClose(); // Close modal on success
    } catch (error) {
      toast.error("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-admintext rounded-lg shadow-lg">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:text-gray-700"
          >
            <X size={35} />
          </button>
          <div className="bg-gray-800-50 flex items-center justify-center p-4 rounded-md">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 adminFormBg">
              <h2 className="subheading3 uppercase  text-white mb-6 border-b p-4">
                Update Event
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="block text-white content">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 "
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-white content">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border adminFieldInput focus:outline-none focus:ring-2 "
                    placeholder="Enter event description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-white content">Link</label>
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 "
                      placeholder="https://example.com"
                    />
                    {errors.link && (
                      <p className="text-red-500 text-sm">{errors.link}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white content">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border adminFieldInput focus:outline-none focus:ring-2 "
                      placeholder="Enter event location"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-white content">
                      From Date
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      //min={minDate}
                      className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 "
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white content">To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      min={
                        formData.fromDate
                          ? new Date(formData.fromDate)
                              .toISOString()
                              .split("T")[0]
                          : minDate
                      }
                      className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 "
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <TimeSelection
                      label="From Time"
                      timeValue={formData.timeFrom}
                      onChange={(value) => {
                        setFormData((prev) => {
                          const updatedData = {
                            ...prev,
                            timeFrom: value,
                            timeTo: "", // Reset To Time when From Time changes
                          };
                          setIsModified(
                            compareFormData(updatedData, exhibitionData)
                          );
                          return updatedData;
                        });
                      }}
                      isDisabled={!formData.fromDate}
                    />
                  </div>
                  <div className="space-y-2">
                    <TimeSelection
                      label="To Time"
                      timeValue={formData.timeTo}
                      onChange={(value) => {
                        setFormData((prev) => {
                          const updatedData = { ...prev, timeTo: value };
                          setIsModified(
                            compareFormData(updatedData, exhibitionData)
                          );
                          return updatedData;
                        });
                      }}
                      minTime={formData.timeFrom}
                      isDisabled={!formData.fromDate || !formData.timeFrom}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-white content">
                    Banner Image (Format allowed: PNG, JPG, JPEG)
                  </label>
                  <div className="relative group w-40 h-40 border-2 border-dashed flex items-center justify-center rounded-lg overflow-hidden">
                    {formData.bannerImage ? (
                      <>
                        <img
                          src={
                            formData.bannerImagePreview || formData.bannerImage
                          }
                          alt="Selected"
                          className="w-full h-full object-cover"
                        />
                        {/* Pencil Icon */}
                        <button
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                          className="absolute top-2 right-2 bg-gray-800 text-primary bg-primary p-1 rounded-full"
                          aria-label="Edit Image"
                        >
                          <Pen size={24} fill="white" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-white text-3xl font-bold">+</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      name="bannerImage"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {imageError && (
                    <p className="text-red-500 text-sm">{imageError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isModified || !isFormValid()}
                  className={`w-full py-2 px-4 rounded-md text-white content ${
                    !isModified || !isFormValid()
                      ? "bg-primary cursor-not-allowed"
                      : isSubmitting
                      ? "bg-primary cursor-wait"
                      : "bg-primary hover:bg-primary/70"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventForm;
