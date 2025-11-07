import React, { useState, useEffect } from "react";
import Contactimg from "/Contact/Contact_Us.svg";
import { postContactForm } from "../../../urls";
import { toast } from "react-toastify";

const Contact_Form = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    companyName: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState({
    submitting: false,
    isValid: false,
  });

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    return phone.length === 11;
  };

  useEffect(() => {
    const isFormValid =
      formData.fullname.trim() !== "" &&
      validatePhone(formData.phone) &&
      validateEmail(formData.email) &&
      formData.message.trim() !== "";

    setStatus((prev) => ({ ...prev, isValid: isFormValid }));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: digitsOnly });
      setErrors((prev) => ({
        ...prev,
        phone:
          digitsOnly.length !== 11
            ? "Phone number must be exactly 11 digits"
            : "",
      }));
      return;
    }

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !validateEmail(value)
          ? "Email format should be example@provider.com"
          : "",
      }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "");
    setFormData({ ...formData, phone: digitsOnly });
    setErrors((prev) => ({
      ...prev,
      phone:
        digitsOnly.length !== 11
          ? "Phone number must be exactly 11 digits"
          : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status.isValid) return;
    setStatus((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(postContactForm, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          fullname: "",
          phone: "",
          email: "",
          companyName: "",
          message: "",
        });
        toast.success("Message sent successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setStatus((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="flex flex-col items-center text-bold space-y-10 w-full  md:flex-row md:space-y-0 md:space-x-10 isolate_container  justify-between">
      <img
        src={Contactimg}
        className="w-full max-w-sm md:max-w-md lg:max-w-lg md:w-1/2"
        alt="Contact Us"
      />

      <div className="w-full md:w-1/2 flex flex-col space-y-6 items-center">
        <div className="space-y-6">
          <h2 className="subheading2 font-semibold text-primary uppercase">
            GET IN TOUCH
          </h2>
          <p className="text-gray-700 content text-justify font-light">
            Have any questions or need assistance? We're here to help! Whether
            you're looking for product information, support, or partnership
            opportunities, feel free to reach out. Simply fill out the form
            below, and we'll get back to you as soon as possible. We look
            forward to connecting with you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input
                type="text"
                name="fullname"
                placeholder="*Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-3 px-3 content focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                required
                disabled={status.submitting}
              />
            </div>
            <div className="flex flex-col">
              <input
                type="tel"
                name="phone"
                placeholder="*Phone No"
                value={formData.phone}
                onChange={handleChange}
                onKeyPress={handlePhoneKeyPress}
                onPaste={handlePhonePaste}
                className="w-full border border-gray-300 rounded-md py-3 px-3 content focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={status.submitting}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="*Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-3 px-3 content focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={status.submitting}
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email}</span>
            )}
          </div>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-3 px-3 content focus:outline-none focus:ring-2 focus:ring-primary capitalize"
            disabled={status.submitting}
          />
          <textarea
            name="message"
            placeholder="*Message.."
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-3 px-3 h-28 content focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
            disabled={status.submitting}
          ></textarea>
          <button
            type="submit"
            className={`w-full md:w-1/3 font-semibold  rounded-full button transition content capitalize
              ${
                status.isValid && !status.submitting
                  ? "bg-primary hover:bg-darkGreen text-white cursor-pointer opacity-100"
                  : "bg-gray-300 text-gray-600 border border-gray-300 cursor-not-allowed opacity-100"
              }`}
            disabled={!status.isValid || status.submitting}
          >
            {status.submitting ? "Submitting..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact_Form;
