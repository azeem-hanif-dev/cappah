import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../Api/Admin/UserManagement/ResetPassword";

const ResetPassword = () => {
  const { CIP_Token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onReset = async (data) => {
    // console.log("Form Data:", data);

    const { newPassword } = data;
    setLoading(true);
    setMessage(null);

    try {
      const response = await resetPassword();

      const result = await response.json();

      if (result.status) {
        toast.success(result.message);
        setMessage({ type: "success", text: result.message });
        reset();
        navigate("/admin/login");
      } else {
        toast.error(result.message);
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
      setMessage({
        type: "error",
        text: error.message || "Network or server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col md:flex-row md:justify-evenly space-y-10 my-20 md:m-0 items-center px-6 md:px-8">
      <div className="md:w-1/3 max-w-lg w-1/2 flex justify-start md:ml-16 md:mb-0 mb-10">
        <img src="./common/Logo.svg" alt="Logo" className="w-[300px] h-auto" />
      </div>

      <div className="block md:hidden w-full border-b border-gray-300 px-20"></div>
      <div className="hidden md:block h-2/3 border-l border-gray-300"></div>

      <div className="md:w-1/3 max-w-sm w-full md:ml-8 md:mb-0 mb-48">
        <h1 className="text-3xl font-medium mb-5 text-primary w-full text-center">
          Reset Password
        </h1>

        <div className="mb-4 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
          Password must contain:
          <ul className="list-disc ml-4 mt-1">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>Special characters are allowed (@, #, $, etc.)</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onReset)} className="space-y-4">
          <div>
            <input
              className={`text-sm w-full px-4 py-2 border border-solid ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } rounded transition-colors focus:outline-none focus:border-primary`}
              type="password"
              name="newPassword"
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  // Updated regex to allow special characters
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <input
              className={`text-sm w-full px-4 py-2 border border-solid ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded transition-colors focus:outline-none focus:border-primary`}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="text-center md:text-left">
            <button
              className={`mt-4 px-4 py-2 w-[100px] text-white uppercase rounded text-xs tracking-wider ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-text"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm ${
                message.type === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
