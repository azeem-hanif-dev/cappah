import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { submitEnquiry } from "../../../Api/User/ProductDetails/Enquiry";
import { toast } from "react-toastify";
const EnquiryModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    product: product._id || "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    const requiredFields = ["fullname", "phone", "email", "address", "message"];
    const areFieldsFilled = requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );

    // Validate phone (must be digits only) and email format
    const isPhoneValid = /^\d+$/.test(formData.phone);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    setIsValid(areFieldsFilled && isPhoneValid && isEmailValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone field, only allow digits
    if (name === "phone" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitEnquiry(formData, product._id);
      toast.success("Enquiry submitted successfully!"); // Show success toast

      setFormData({
        fullname: "",
        phone: "",
        email: "",
        address: "",
        product: product || "",
        message: "",
      });

      onClose();
    } catch (error) {
      toast.error("Error submitting enquiry. Please try again."); // Show error toast
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-primary mb-4">
          GET IN TOUCH
        </h2>
        <p className="text-gray-600 mb-6">
          Have any questions or need assistance? Fill out the form below, and
          we'll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="*Full Name"
              className="border rounded p-2 w-full"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="*Phone No"
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="*Email"
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="*Address"
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="text"
            name="product"
            value={product.title}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="*Message.."
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full rounded p-2 ${
              isValid && !isSubmitting
                ? "bg-primary hover:bg-darkGreen text-white opacity-100"
                : "bg-gray-300 text-gray-600 border border-gray-300 cursor-not-allowed opacity-100"
            }`}
          >
            {isSubmitting ? "Submitting..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
