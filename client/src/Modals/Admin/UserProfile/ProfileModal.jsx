import React, { useState, useEffect } from "react";
import { Pencil, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { updateUser } from "../../../Api/Admin/UserProfile/UpdateUser";

const ProfileModal = ({
  user,
  isProfileModalOpen,
  setIsProfileModalOpen,
  onUpdate,
}) => {
  const [tempUser, setTempUser] = useState(user);
  const [editableField, setEditableField] = useState(null);
  const [errors, setErrors] = useState({});
  const [changedFields, setChangedFields] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");

  useEffect(() => {
    if (isProfileModalOpen) {
      setTempUser(user);
      setEditableField(null);
      setErrors({});
      setChangedFields({});
    }
  }, [isProfileModalOpen, user]);

  const validateField = (field, value) => {
    // First, check if the field is empty
    if (!value.trim()) {
      return "This field cannot be empty";
    } // Check for forbidden special characters in all fields // Now includes angle brackets and checks for any HTML-like tags

    const forbiddenChars = /[!<>=`&%$;'[\]{}<>]/;
    if (forbiddenChars.test(value)) {
      return "Special characters like !, <, >, =, `, &, %, $, etc., are not allowed";
    } // Special validation for phone number

    if (field === "contactNumber") {
      // Remove any non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, "");

      // Check length of digits
      if (digitsOnly.length < 11 || digitsOnly.length > 15) {
        return "Phone number must be between 11 and 15 digits";
      }

      // Check if it contains only numbers (already handled by digitsOnly)
      if (!/^\d+$/.test(digitsOnly)) {
        return "Phone number must contain only digits";
      }

      // Format for display: add dash after 4 digits
      const formattedNumber =
        digitsOnly.substring(0, 4) + "-" + digitsOnly.substring(4);

      // You can update the display value here, for example:
      // displayElement.textContent = formattedNumber;

      // Store the original digits-only value for further processing
      // formData[field] = digitsOnly;
    } else if (field === "email") {
      // Check for basic email format and require @provider.com
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      } // Check specifically for @provider.com format
      if (!value.includes("@") || !value.endsWith(".com")) {
        return "Email must be in the format user@provider.com";
      }
    } // For other fields, check max length
    else if (value.length > 50) {
      return "Field cannot be more than 50 characters";
    }

    return null; // No validation errors
  };

  const handleFieldChange = (field, value) => {
    // Update the tempUser
    setTempUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Track changed fields
    if (value !== user[field]) {
      setChangedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setChangedFields((prev) => {
        const newChangedFields = { ...prev };
        delete newChangedFields[field];
        return newChangedFields;
      });
    }

    // Validate and set errors
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const isUpdateDisabled = () => {
    // Check if there are any changes
    const hasChanges = Object.keys(changedFields).length > 0;
    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error);
    // Check if any changed field is empty
    const hasEmptyFields = Object.keys(changedFields).some(
      (field) => !tempUser[field]?.trim()
    );

    return !hasChanges || hasErrors || hasEmptyFields || isUpdating;
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      // Create update payload only with changed fields
      const updateData = {};
      Object.keys(changedFields).forEach((field) => {
        updateData[field] = tempUser[field];
      });

      await updateUser(user._id, updateData, CIP_Token);

      setIsProfileModalOpen(false);
      toast.info("🔔 Re-login for changes to take effect!", {
        className: "text-black",
        bodyClassName: "flex items-center",
      });

      onUpdate(); // Callback function to refresh UI
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to update profile. Please try again.",
      }));
    } finally {
      setIsUpdating(false);
    }
  };
  const handleCancel = () => {
    setTempUser(user);
    setIsProfileModalOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    isProfileModalOpen && (
      <div className="fixed inset-0 content bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-navback rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-sm lg:max-w-lg overflow-y-auto max-h-full">
          <h2 className="subheading2  mb-4 text-center ">User Profile</h2>
          <div className="flex flex-col gap-4 content">
            {[
              { label: "Username", field: "username" },
              { label: "Email", field: "email" },
              { label: "Contact", field: "contactNumber" },
              { label: "Address", field: "address" },
              { label: "Gender", field: "gender" },
              { label: "Role", field: "role" },
              { label: "Dob", field: "dateOfBirth" },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-gray-700 text-sm lg:text-base text-white content">
                  {label}
                </label>
                <div className="flex items-center gap-2 text-navback content">
                  {field === "contactNumber" ? (
                    <input
                      type="text"
                      className={`border rounded-md p-2 w-full ${
                        errors[field]
                          ? "border-red-500"
                          : changedFields[field]
                          ? "border-green-500"
                          : ""
                      } minicontent`}
                      value={
                        tempUser[field]
                          ? tempUser[field].length > 4
                            ? tempUser[field].substring(0, 4) +
                              "-" +
                              tempUser[field].substring(4)
                            : tempUser[field]
                          : ""
                      }
                      readOnly={editableField !== field}
                      onChange={(e) => {
                        // Remove non-digit characters
                        const rawValue = e.target.value.replace(/\D/g, "");
                        // Allow input up to 15 digits
                        if (/^\d{0,15}$/.test(rawValue)) {
                          handleFieldChange(field, rawValue);
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace specially to make deletion easier
                        if (e.key === "Backspace" && tempUser[field]) {
                          // If cursor is right after the dash (position 5), move cursor before dash
                          const cursorPosition = e.target.selectionStart;
                          if (
                            cursorPosition === 5 &&
                            tempUser[field].length > 4
                          ) {
                            e.preventDefault();
                            const newValue = tempUser[field].slice(0, -1);
                            handleFieldChange(field, newValue);
                            // Set cursor position to end of new value
                            setTimeout(() => {
                              e.target.setSelectionRange(4, 4);
                            }, 0);
                          }
                        }
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      className={`border rounded-md p-2 w-full ${
                        !["email", "contactNumber", "address"].includes(field)
                          ? "bg-gray-100 text-gray-600 cursor-default"
                          : errors[field]
                          ? "border-red-500"
                          : changedFields[field]
                          ? "border-green-500"
                          : ""
                      } minicontent`}
                      value={
                        field === "dateOfBirth"
                          ? formatDate(tempUser[field])
                          : field === "role" && tempUser[field]
                          ? tempUser[field][0].toUpperCase() +
                            tempUser[field].slice(1)
                          : tempUser[field] || ""
                      }
                      readOnly={editableField !== field}
                      disabled={
                        !["email", "contactNumber", "address"].includes(field)
                      }
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                    />
                  )}

                  {["email", "contactNumber", "address"].includes(field) && (
                    <div
                      className="bg-gray p-2 rounded-lg hover:bg-primary hover:scale-110 transition-all duration-200 cursor-pointer"
                      onClick={() => setEditableField(field)}
                    >
                      <Pencil className="text-white text-sm lg:text-base" />
                    </div>
                  )}
                </div>
                {editableField === field && (
                  <small className="text-black block text-xs lg:text-sm">
                    Now you can edit this field.
                  </small>
                )}
                {errors[field] && (
                  <small className="text-red-500 text-xs lg:text-sm">
                    {errors[field]}
                  </small>
                )}
              </div>
            ))}
          </div>
          {errors.submit && (
            <div className="text-red-500 mt-2 text-sm lg:text-base">
              {errors.submit}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdateDisabled()}
              className={`px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600${
                isUpdateDisabled()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              } text-white rounded-lg`}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileModal;
