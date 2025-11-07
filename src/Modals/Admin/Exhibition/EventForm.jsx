import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createEvent } from "../../../Api/Exhibition.api";
import TimeSelection from "./TimeSelection";
const EventForm = () => {
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
      } else if (value.length > 50) {
        newErrors[name] = "Maximum 50 characters allowed";
      } else {
        delete newErrors[name];
      }
    }

    setErrors(newErrors);
  };

  const convertTo24Hour = (hour, minute, period) => {
    if (hour === "--" || minute === "--" || period === "--") return null;
    let hr = parseInt(hour);
    if (period === "PM" && hr !== 12) hr += 12;
    if (period === "AM" && hr === 12) hr = 0;
    return `${hr.toString().padStart(2, "0")}:${minute}`;
  };
  
  useEffect(() => {
    if (
      formData.fromDate &&
      formData.toDate &&
      new Date(formData.fromDate) > new Date(formData.toDate)
    ) {
      setFormData((prev) => ({ ...prev, toDate: "" }));
    }
  }, [formData.fromDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate and enforce correct date order
    if (name === "toDate" && formData.fromDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(value);

      // Prevent invalid To Date
      if (toDate < fromDate) {
        alert("To Date cannot be earlier than From Date.");
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  //Image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setImageError(
          "Invalid file type. Please select a PNG, JPG, or JPEG file."
        );
        setFormData((prev) => ({ ...prev, bannerImage: null }));
        setSelectedImage(null); // Reset preview
        return;
      }

      setImageError(""); // Clear error
      setFormData((prev) => ({ ...prev, bannerImage: file })); // Set file for backend
      setSelectedImage(URL.createObjectURL(file)); // Image preview
    }
  };

  const isFormValid = () => {
    // Check if all parts of time are selected for both From and To Time
    const isTimeComplete = (time) => {
      const timeParts = time.split(":");
      return (
        (timeParts.length === 2 && timeParts[1].includes("AM")) ||
        timeParts[1].includes("PM")
      );
    };

    const areTimesValid =
      formData.timeFrom &&
      formData.timeTo &&
      isTimeComplete(formData.timeFrom) &&
      isTimeComplete(formData.timeTo) &&
      // Ensure the time ranges are valid if on the same day
      (formData.fromDate !== formData.toDate ||
        convertTo24Hour(formData.timeFrom) < convertTo24Hour(formData.timeTo));

    return (
      Object.keys(errors).length === 0 &&
      Object.values(formData).every(
        (value) => value !== "" && value !== null
      ) &&
      formData.bannerImage !== null &&
      areTimesValid
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const formDataToSubmit = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value instanceof File) {
        formDataToSubmit.append(key, value); // Append the file if it's a file
      } else {
        formDataToSubmit.append(key, value);
      }
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting...");

    try {
      console.log("Submitting data", formDataToSubmit);
      await createEvent(formDataToSubmit); // Assuming createEvent handles FormData
      toast.update(loadingToast, {
        render: "Event created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setFormData({
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
    } catch (error) {
      toast.update(loadingToast, {
        render: "Failed to create event",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-lime-50 flex items-center justify-center p-4 rounded-md">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 adminFormBg">
        <h2 className="text-2xl font-bold text-green-800 mb-6 border-b border-green-100 p-4">Create Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-green-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-green-700 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border adminFieldInput focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter event description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-green-700 font-medium">Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="https://example.com"
            />
            {errors.link && (
              <p className="text-red-500 text-sm">{errors.link}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-green-700 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border adminFieldInput focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter event location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-green-700 font-medium">
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                min={minDate}
                className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-green-700 font-medium">
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={
                  formData.fromDate
                    ? new Date(formData.fromDate).toISOString().split("T")[0]
                    : minDate
                }
                className="w-full px-3 py-2 adminFieldInput focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <TimeSelection
                label="From Time"
                timeValue={formData.timeFrom}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    timeFrom: value,
                    timeTo: "", // Reset To Time when From Time changes
                  }));
                }}
                isDisabled={!formData.fromDate} // Disable if no date selected
              />
            </div>
            <div className="space-y-2">
              <TimeSelection
                label="To Time"
                timeValue={formData.timeTo}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, timeTo: value }))
                }
                minTime={formData.timeFrom} // Pass the minimum time
                isDisabled={!formData.fromDate || !formData.timeFrom} // Disable if no From Time or date
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-green-800 font-medium">
              Banner Image (Format allowed: PNG, JPG, JPEG)
            </label>
            <div className="relative group w-40 h-40 border-2 border-dashed border-green-700 flex items-center justify-center rounded-lg overflow-hidden">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                  {/* Pencil Icon */}
                  <button
                    onClick={() => document.getElementById("fileInput").click()}
                    className="absolute bottom-2 right-2 bg-green-600 text-white p-1 rounded-full hover:bg-green-800"
                    aria-label="Edit Image"
                  >
                    ✏️
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-green-700 group-hover:text-green-900 text-3xl font-bold">
                    +
                  </span>
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
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isFormValid() && !isSubmitting
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
