import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Shield, X, Save, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { createPrivilege } from "../../../Api/Admin/Privilege/AddPrivilege";

const AddPrivilegeModal = ({ isOpen, onClose, fetchApi, onAddPrivilage }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      role: "",
      permissions: {
        Category: {
          create: false,
          update: false,
        },
        SubCategory: {
          create: false,
          update: false,
        },
        Products: {
          create: false,
          update: false,
          statusChange: false,
        },
        Event: {
          create: false,
          update: false,
          statusChange: false,
        },
        Quotations: {
          statusChange: false,
        },
      },
    },
  });

  const onSubmit = async (data) => {
    const toCamelCase = (str) => {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0 ? match.toLowerCase() : match.toUpperCase()
        )
        .replace(/\s+/g, "");
    };

    const formattedData = {
      role: data.role,
      permissions: Object.entries(data.permissions).reduce(
        (acc, [key, value]) => {
          acc[toCamelCase(key)] = value;
          return acc;
        },
        {}
      ),
    };

    try {
      const CIP_Token = localStorage.getItem("CIP_Token"); // Get the CIP_Token
      const result = await createPrivilege(formattedData, CIP_Token); // Call the API function

      toast.success(result.message); // Show success message
      reset(); // Reset the form
      onClose(); // Close the modal
      fetchApi(); // Fetch updated privileges
    } catch (error) {
      toast.error(error.message || "Error creating permission");
    }
  };

  if (!isOpen) return null;

  const hasStatusChange = (permissionName) => {
    return ["Product", "Blog", "Quotations", "Event"].includes(permissionName);
  };

  const hasUpdate = (permissionName) => {
    return !["Quotations"].includes(permissionName);
  };

  const permissionNames = [
    "Category",
    "SubCategory",
    "Product",
    "Quotations",
    "Event",
  ];

  return (
    <div className="fixed inset-0 bg-admintext bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-admintext rounded-lg w-full max-w-3xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-bggray" />
            <h2 className="content font-semibold text-white">Add Privilege</h2>
          </div>
          <button
            onClick={onClose}
            className="text-bggray hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-bggray" />
              <label htmlFor="role" className="text-sm font-medium text-white">
                Role Name
              </label>
            </div>
            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-admntext focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter Role Name"
                />
              )}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse ">
              <thead>
                <tr className="bg-admintext">
                  <th className="p-3 text-left font-medium text-bggray border border-bggray">
                    Permission
                  </th>
                  <th className="p-3 text-center font-medium text-bggray border border-bggray">
                    Create
                  </th>
                  <th className="p-3 text-center font-medium text-bggray border border-bggray">
                    Update
                  </th>
                  <th className="p-3 text-center font-medium text-bggray border border-bggray">
                    Status Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissionNames.map((perm) => (
                  <tr key={perm} className=" ">
                    <td className="p-3 border text-left">{perm}</td>
                    <td className="p-3 border text-center">
                      {perm !== "Quotations" ? (
                        <Controller
                          name={`permissions.${perm}.create`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-admintext focus:ring-primary focus:ring-offset-gray-900"
                            />
                          )}
                        />
                      ) : (
                        <span className="text-admintext">—</span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {hasUpdate(perm) ? (
                        <Controller
                          name={`permissions.${perm}.update`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-admintext focus:ring-primary focus:ring-offset-gray-900"
                            />
                          )}
                        />
                      ) : (
                        <span className="text-admintext">—</span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {hasStatusChange(perm) ? (
                        <Controller
                          name={`permissions.${perm}.statusChange`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-admintext focus:ring-primary focus:ring-offset-gray-900"
                            />
                          )}
                        />
                      ) : (
                        <span className="text-admintext">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              <span>Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrivilegeModal;
