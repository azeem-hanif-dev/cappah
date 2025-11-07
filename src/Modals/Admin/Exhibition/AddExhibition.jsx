import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TimeSelection from "./TimeSelection";
import { X, Pen } from "lucide-react";
import { createEvent } from "../../../Api/Admin/Exhibition/AddExhibition.Api";

const MAX_IMAGE_SIZE_MB = 3; // 3MB limit
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
const EventForm = ({ isOpen, onClose, fetchApi }) => {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    location: "",
    fromDate: "",
    toDate: "",
    banner: null,
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
  const CIP_Token = localStorage.getItem("CIP_Token");

  const handleEventCreation = async (formData, CIP_Token) => {
    try {
      const result = await createEvent(formData, CIP_Token);

      if (!result || result.error) {
        throw new Error(result?.error || "Unknown error occurred");
      }

      return result; // Ensure a successful result is returned
    } catch (error) {
      toast.error("Failed to create event");
      throw error; // Rethrow the error so handleSubmit can catch it
    }
  };

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

    // Check file size (convert bytes to MB)
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error("Image size cannot be more than 3MB");
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, and JPEG formats are allowed");
      return;
    }
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setImageError(
          "Invalid file type. Please select a PNG, JPG, or JPEG file."
        );
        setFormData((prev) => ({ ...prev, banner: null }));
        setSelectedImage(null); // Reset preview
        return;
      }

      setImageError(""); // Clear error
      setFormData((prev) => ({ ...prev, banner: file })); // Set file for backend
      setSelectedImage(URL.createObjectURL(file)); // Image preview
    }
  };

  const isFormValid = () => {
    // Check if all parts of time are selected for both From and To Time
    const isTimeComplete = (time) => {
      if (!time) return false;
      // Check if the time has both hour and minute parts and includes AM/PM
      return (
        time.includes(":") &&
        (time.includes("AM") || time.includes("PM")) &&
        !time.includes("--")
      ); // Make sure there are no placeholder values
    };

    // Function to convert time to 24 hour format for comparison
    const convertTo24Hour = (timeStr) => {
      if (!timeStr || !isTimeComplete(timeStr)) return null;

      const [timePart, period] = timeStr.split(" ");
      const [hourStr, minuteStr] = timePart.split(":");

      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      // Convert to 24-hour format
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    };

    // Validate times
    const fromTime = convertTo24Hour(formData.timeFrom);
    const toTime = convertTo24Hour(formData.timeTo);

    const areTimesValid =
      isTimeComplete(formData.timeFrom) &&
      isTimeComplete(formData.timeTo) &&
      fromTime &&
      toTime &&
      // If dates are different, any time is valid
      // If dates are the same, end time must be after start time
      (formData.fromDate !== formData.toDate || fromTime < toTime);

    return (
      Object.keys(errors).length === 0 &&
      Object.values(formData).every(
        (value) => value !== "" && value !== null
      ) &&
      formData.banner !== null &&
      areTimesValid
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const formDataToSubmit = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      formDataToSubmit.append(key, value);
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting...");

    try {
      const response = await handleEventCreation(formDataToSubmit, CIP_Token);

      if (!response || response.error) {
        throw new Error(response?.error || "Event creation failed");
      }

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
        banner: null,
        timeFrom: "",
        timeTo: "",
      });

      fetchApi();
      onClose();
    } catch (error) {
      toast.update(loadingToast, {
        render: error.message || "Failed to create event",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity "
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4 ">
        <div className="relative w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:text-gray-700"
          >
            <X size={35} />
          </button>
          <div className="bg-admintext flex items-center justify-center p-4 rounded-md">
            <div className="w-full max-w-2xl rounded-lg shadow-lg p-6 bg-gray-800 content">
              <h2 className="subheading3 uppercase text-white mb-6 border-b border-green-100 p-4">
                Create Event
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 text-start">
                <div className="space-y-2">
                  <label className="block text-white content">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 "
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
                    className="w-full px-3 py-2 border bg-gray-700 focus:outline-none focus:ring-2 "
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
                      className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 "
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
                      className="w-full px-3 py-2 border bg-gray-700 focus:outline-none focus:ring-2 "
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
                      min={minDate}
                      className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 "
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
                      className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 "
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
                  <label className="block text-white content">
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
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                          className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full hover:bg-primary/80"
                          aria-label="Edit Image"
                        >
                          <Pen />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-white group-hover:text-blue-400 text-3xl font-bold">
                          +
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      name="banner"
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
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-2 px-4 rounded-md text-white content  ${
                    isFormValid() && !isSubmitting
                      ? "bg-primary hover:bg-primary/70"
                      : "bg-primary cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Create Event"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
