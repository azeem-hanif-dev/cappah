import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { forgotPassword } from "../../../Api/Admin/UserManagement/ResetPassword";

const ForgetPasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onForget = async (data) => {
    setLoading(true);

    try {
      const result = await forgotPassword(data.email);

      if (result.status) {
        toast.success(result.message);
        reset();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <img
              src="/Common/Logo/Logo.svg"
              alt="Logo"
              className="w-[150px] h-auto"
            />
          </div>

          <h1 className="text-2xl font-medium mb-6 text-primary text-center">
            Forgot Password
          </h1>

          <form onSubmit={handleSubmit(onForget)}>
            <input
              className={`text-sm w-full px-4 py-2 border border-solid ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded`}
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}

            <div className="text-center mt-6">
              <button
                className="bg-primary hover:bg-text px-6 py-2 text-white uppercase rounded text-sm tracking-wider transition-colors duration-200"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
