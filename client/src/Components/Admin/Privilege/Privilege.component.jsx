import { useState, useEffect } from "react";
import { Trash2Icon, Pen } from "lucide-react";
import UpdatePrivilegeModal from "../../../Modals/Admin/Privilages/UpdatePrivilegeModal";
import { toast } from "react-toastify";
import { deletePrivilegeApi } from "../../../Api/Admin/Privilege/DeletePrivilege";
import SearchBar from "../Common/SearchBar.admin.component";

const PrivilegeManagement = ({ privileges, fetchPrivileges }) => {
  const [selectedPrivilege, setSelectedPrivilege] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isUpdatePrivilegeModalOpen, setIsUpdatePrivilegeModalOpen] =
    useState(false);
  const [selectedUpdatePrivilege, setSelectedUpdatePrivilege] = useState(null);

  const onAddPrivilage = () => {
    fetchPrivileges();
  };

  useEffect(() => {}, []);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredPrivileges = privileges.filter((privilege) =>
    privilege.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPrivileges = filteredPrivileges.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPrivileges.length / itemsPerPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleOpenUpdateModal = (privilege) => {
    setSelectedUpdatePrivilege(privilege);
    setIsUpdatePrivilegeModalOpen(true);
  };

  const onUpdatePrivilege = () => {
    setIsUpdatePrivilegeModalOpen(false);
    setSelectedUpdatePrivilege(null);
    fetchPrivileges(); // Refresh the list after update
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (privilegeId) => {
    try {
      const CIP_Token = localStorage.getItem("CIP_Token"); // Get CIP_Token from localStorage
      const data = await deletePrivilegeApi(privilegeId, CIP_Token); // Call the API function
      toast.success(data.message); // Display success message
      fetchPrivileges(); // Refresh privileges
    } catch (error) {
      toast.error(error.message || "Error deleting privilege"); // Handle errors
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };
  return (
    <div className="w-full isolate_bars text-center">
      <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white transition-transform duration-300">
        <div className="flex w-full justify-between">
          <h1 className="subheading3 capitalize font-semibold ">
            Privilege Management
          </h1>
          <div className="relative">
            <SearchBar
              placeholder="Search by Name..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-hide">
          <table className="w-full minicontent table-auto">
            <thead>
              <tr className="text-center text-admintext minicontent  border-b ">
                <th className="pb-4 minicontent font-semibold text-left">
                  Role
                </th>

                <th className="pb-4 minicontent font-semibold">Category</th>
                <th className="pb-4 minicontent font-semibold">Sub-Category</th>
                <th className="pb-4 minicontent font-semibold">Products</th>
                <th className="pb-4 minicontent font-semibold">Quotes</th>
                <th className="pb-4 minicontent font-semibold">Event</th>
                <th className="pb-4 minicontent font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPrivileges.map((privilege) => (
                <tr
                  key={privilege._id}
                  className="border-b text-center border-bggray minicontent"
                >
                  <td className="py-4 text-admintext capitalize font-semibold text-left">
                    {privilege.role}
                  </td>
                  {[
                    { name: "Category", key: "category" },
                    { name: "Sub-Category", key: "subCategory" },
                    { name: "Products", key: "product" },
                    { name: "Quotes", key: "quotations" },

                    { name: "Event", key: "event" },
                  ].map((entity) => (
                    <td key={entity.name} className="py-4 space-x-2">
                      {Object.keys(privilege.permissions[entity.key] || {})
                        .filter(
                          (perm) => privilege.permissions[entity.key][perm]
                        )
                        .map((perm) => (
                          <span
                            key={perm}
                            className={`px-2  py-1 text-[14px]   rounded-full ${
                              perm === "create"
                                ? "bg-orange/20 text-orange"
                                : perm === "update"
                                ? "bg-primary/20 text-primary"
                                : "bg-blue-500/20 text-blue-500"
                            }`}
                          >
                            {perm.charAt(0).toUpperCase()}
                          </span>
                        ))}
                    </td>
                  ))}
                  <td className="py-4">
                    <div
                      className={`flex items-center justify-center ${
                        privilege.role === "superAdmin" ||
                        privilege.role === "Member"
                          ? "hidden"
                          : ""
                      }`}
                    >
                      {" "}
                      {/* Hide buttons for superAdmin and Member */}
                      <button
                        onClick={() => handleOpenUpdateModal(privilege)}
                        className="px-3 py-1 text-primary hover:bg-primary hover:text-white rounded transition-colors"
                      >
                        <Pen className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(privilege._id)}
                        className="px-3 py-1 text-red-500 rounded hover:bg-red-600 hover:text-white transition-colors mr-2"
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full flex justify-end items-end mt-4 text-xs sm:text-sm">
          <div className="flex gap-2">
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border text-gray-500 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              ←
            </button>

            <button
              className={`w-8 h-8 flex items-center justify-center rounded border text-gray-500 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <UpdatePrivilegeModal
        isOpen={isUpdatePrivilegeModalOpen}
        onClose={() => {
          setIsUpdatePrivilegeModalOpen(false);
          setSelectedUpdatePrivilege(null);
        }}
        onUpdate={onUpdatePrivilege}
        fetchPrivileges={fetchPrivileges}
        privilegeData={selectedUpdatePrivilege}
      />
    </div>
  );
};

export default PrivilegeManagement;
