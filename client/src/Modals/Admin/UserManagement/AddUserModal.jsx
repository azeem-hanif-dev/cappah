import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Shield, X, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { addUserApi } from "../../../Api/Admin/UserManagement/AddUser";

const AddAdminModal = ({ isOpen, onClose, onAddUser, fetchApi }) => {
  const CIP_Token = localStorage.getItem("CIP_Token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
      gender: "",
      dateOfBirth: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const addUser = async (userData) => {
    try {
      const CIP_Token = localStorage.getItem("CIP_Token");
      const result = await addUserApi(CIP_Token, userData); // Use the API function
      return result; // Return the result to the caller (if needed)
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error; // Handle the error appropriately in the calling function
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addUser(data);
      toast.success("Admin added successfully!");
      reset();
      fetchApi();
      onClose();
    } catch (error) {
      toast.error(`Failed to add admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-3xl bg-admintext shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-white" />
            <h2 className="content font-semibold text-white">Add Admin</h2>
          </div>
          <button
            onClick={onClose}
            className="text-bggray  transition-colors hover:text-error"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-5 w-full">
              <FormInput
                label="Username"
                id="username"
                placeholder="Username"
                register={register("username", {
                  required: "Username is required",
                  validate: (value) =>
                    value === value.toLowerCase() ||
                    "Username must be lowercase",
                })}
                error={errors.username}
              />

              <FormInput
                label="Full Name"
                id="fullName"
                placeholder="Full Name"
                register={register("fullName", {
                  required: "Full name is required",
                })}
                error={errors.fullName}
              />
            </div>

            <div className="flex gap-5 w-full">
              <FormInput
                label="Email Address"
                id="email"
                type="email"
                placeholder="Email Address"
                register={register("email", { required: "Email is required" })}
                error={errors.email}
              />

              <PasswordInput
                label="Password"
                id="password"
                placeholder="Password"
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
                register={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
                    message:
                      "Password must contain an uppercase letter, a special character, and a digit",
                  },
                })}
                error={errors.password}
              />
            </div>
            <div className="flex gap-5 w-full">
              <FormInput
                label="Phone Number"
                id="contactNumber"
                type="tel"
                placeholder="Phone Number"
                register={register("contactNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{11,15}$/,
                    message: "Phone number must be between 11 and 15 digits",
                  },
                })}
                error={errors.contactNumber}
              />

              <FormInput
                label="Address"
                id="address"
                placeholder="Address"
                register={register("address", {
                  required: "Address is required",
                })}
                error={errors.address}
              />
            </div>
            <div className="flex gap-5 w-full">
              <SelectInput
                label="Gender"
                id="gender"
                options={[
                  { value: "", label: "Select Gender", disabled: true },
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
                register={register("gender", {
                  required: "Gender is required",
                })}
                error={errors.gender}
              />

              <FormInput
                label="Date of Birth"
                id="dateOfBirth"
                type="date"
                register={register("dateOfBirth", {
                  required: "Date of birth is required",
                  validate: (value) => {
                    const dob = new Date(value);
                    const age = new Date().getFullYear() - dob.getFullYear();
                    return age >= 18 || "You must be at least 18 years old";
                  },
                })}
                error={errors.dateOfBirth}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
}) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-bold mb-2 text-white">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`text-sm w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-admintext ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...register}
    />
    {error && <span className="text-red-500 text-sm">{error.message}</span>}
  </div>
);

const PasswordInput = ({
  label,
  id,
  placeholder,
  showPassword,
  toggleShowPassword,
  register,
  error,
}) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-bold mb-2 text-white">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`text-sm w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-admintext ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...register}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
    {error && <span className="text-red-500 text-sm">{error.message}</span>}
  </div>
);

const SelectInput = ({ label, id, options, register, error }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-bold mb-2 text-white">
      {label}
    </label>
    <select
      id={id}
      className={`text-sm w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-admintext ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...register}
    >
      {options.map(({ value, label, disabled }) => (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </select>
    {error && <span className="text-red-500 text-sm">{error.message}</span>}
  </div>
);

export default AddAdminModal;
