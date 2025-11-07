import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Shield, X, Save, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { updatePrivilegeApi } from "../../../Api/Admin/Privilege/UpdatePrivilege";

const UpdatePrivilegeModal = ({
  isOpen,
  onClose,
  privilegeData,
  fetchPrivileges,
  onUpdate,
}) => {
  const initialDataRef = useRef(null);

  const { control, handleSubmit, reset, watch } = useForm({
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
        Product: {
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

  const formValues = watch();

  useEffect(() => {
    if (privilegeData) {
      const formattedData = {
        role: privilegeData.role,
        permissions: {
          Category: {
            create: privilegeData.permissions.category?.create || false,
            update: privilegeData.permissions.category?.update || false,
          },
          SubCategory: {
            create: privilegeData.permissions.subCategory?.create || false,
            update: privilegeData.permissions.subCategory?.update || false,
          },
          Product: {
            create: privilegeData.permissions.product?.create || false,
            update: privilegeData.permissions.product?.update || false,
            statusChange:
              privilegeData.permissions.product?.statusChange || false,
          },
          Event: {
            create: privilegeData.permissions.event?.create || false,
            update: privilegeData.permissions.event?.update || false,
            statusChange:
              privilegeData.permissions.event?.statusChange || false,
          },
          Quotations: {
            statusChange:
              privilegeData.permissions.quotations?.statusChange || false,
          },
        },
      };
      reset(formattedData);
      initialDataRef.current = formattedData;
    }
  }, [privilegeData, reset]);

  const isEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== "object" || typeof obj2 !== "object")
      return obj1 === obj2;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every((key) => isEqual(obj1[key], obj2[key]));
  };

  const onSubmit = async (data) => {
    if (isEqual(data, initialDataRef.current)) {
      toast.info("No changes detected");
      return;
    }

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
      const CIP_Token = localStorage.getItem("CIP_Token");
      const result = await updatePrivilegeApi(
        privilegeData._id,
        formattedData,
        CIP_Token
      ); // Use API function

      toast.success(result.message);
      onClose();
      fetchPrivileges();
      onUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to update privileges");
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
        <div className="flex items-center justify-between p-4 border-b border-bggray">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-bggray" />
            <h2 className="minicontent font-semibold text-bggray">
              Update Privilege
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-bggray  transition-colors hover:text-error"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-bggray" />
              <label htmlFor="role" className="text-sm font-medium text-bggray">
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
                  className="w-full px-3 py-2 bg-gray-800 border border-bggray rounded-md text-admintext focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter role name"
                />
              )}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left font-medium text-gray-300 border border-bggray">
                    Permission
                  </th>
                  <th className="p-3 text-center font-medium text-gray-300 border border-bggray">
                    Create
                  </th>
                  <th className="p-3 text-center font-medium text-gray-300 border border-bggray">
                    Update
                  </th>
                  <th className="p-3 text-center font-medium text-gray-300 border border-bggray">
                    Status Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissionNames.map((perm) => (
                  <tr key={perm} className="hover:bg-gray-800">
                    <td className="p-3 border border-bggray text-left">
                      {perm}
                    </td>
                    <td className="p-3 border border-bggray text-center">
                      {perm !== "Quotations" ? (
                        <Controller
                          name={`permissions.${perm}.create`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-bggray text-primary focus:ring-admintext focus:ring-offset-bggray"
                            />
                          )}
                        />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="p-3 border border-bggray text-center">
                      {hasUpdate(perm) ? (
                        <Controller
                          name={`permissions.${perm}.update`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-bggray text-primary focus:ring-admintext focus:ring-offset-bggray"
                            />
                          )}
                        />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="p-3 border border-bggray text-center">
                      {hasStatusChange(perm) ? (
                        <Controller
                          name={`permissions.${perm}.statusChange`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-bggray text-primary focus:ring-admintext focus:ring-offset-bggray"
                            />
                          )}
                        />
                      ) : (
                        <span className="text-gray-500">—</span>
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

export default UpdatePrivilegeModal;
