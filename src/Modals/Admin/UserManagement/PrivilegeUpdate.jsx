import React from "react";
import { toast } from "react-toastify";
import { updateUserRole } from "../../../Api/Admin/UserManagement/UpdateRole";

const PrivilegeUpdate = ({
  isOpen,
  onClose,
  selectedUser,
  roles,
  selectedPrivilege,
  setSelectedPrivilege,
  fetchUsers,
}) => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [disableUpdateButton, setDisableUpdateButton] = React.useState(true);
  const CIP_Token = localStorage.getItem("CIP_Token");

  const handlePrivilegeChange = async () => {
    setDisableUpdateButton(true);
    try {
      const response = await updateUserRole(
        selectedUser._id,
        selectedPrivilege,
        CIP_Token
      );
      if (response.ok) {
        toast.success("Role updated successfully!");
        fetchUsers();
        onClose();
      } else {
        toast.error("Failed to update role.");
        setDisableUpdateButton(false);
      }
    } catch (error) {
      toast.error(error.message);
      setDisableUpdateButton(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="content font-semibold mb-4">Update Role</h2>
        <div className="mb-4">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <label htmlFor="privilege" className="block mb-1 font-medium">
            Select Role:
          </label>
          <select
            id="privilege"
            value={selectedPrivilege}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPrivilege(value);
              setDisableUpdateButton(!value);
            }}
            className="border border-gray-300 rounded p-2 w-full"
            disabled={!roles.length}
          >
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((roleObj) => (
              <option key={roleObj.id} value={roleObj.role}>
                {roleObj.role}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={async () => {
              setDisableUpdateButton(true);
              try {
                await handlePrivilegeChange();
              } catch (error) {
                setDisableUpdateButton(false);
              }
            }}
            className={`px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 focus:outline-none focus:ring-2 ${
              disableUpdateButton
                ? "bg-primary text-white cursor-not-allowed" // Disabled state with `cursor-not-allowed`
                : "bg-primary text-white"
            }`}
            disabled={disableUpdateButton}
          >
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivilegeUpdate;
