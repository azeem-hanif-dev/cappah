import React, { useState, useEffect } from "react";
import { ChevronDown, Trash2Icon, Eye, UserPen } from "lucide-react";
import { fetchPrivilegesApi } from "../../../Api/Admin/Privilege/GetPrivilege";
import ViewModal from "../../../Modals/Admin/Common/ViewModel";
import { toast } from "react-toastify";
import PrivilegeUpdate from "../../../Modals/Admin/UserManagement/PrivilegeUpdate";
import SearchBar from "../Common/SearchBar.admin.component";

const UserTable = ({ users, fetchUsers, permissions }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privilegeModalOpen, setPrivilegeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPrivilege, setSelectedPrivilege] = useState(""); // State for selected privilege
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [disableUpdateButton, setDisableUpdateButton] = useState(true);
  const [isUserAddModalOpen, setIsUserAddModalOpen] = useState(false);
  const usersPerPage = 10;

  const fetchRoles = async () => {
    try {
      const CIP_Token = localStorage.getItem("CIP_Token"); // Get the CIP_Token
      const privileges = await fetchPrivilegesApi(CIP_Token); // Call the API function
      setRoles(privileges); // Set the privileges
    } catch (error) {
      console.error("Error fetching privileges:", error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openPrivilegeModal = (user) => {
    setSelectedUser(user);
    setPrivilegeModalOpen(true);
    setDisableUpdateButton(true); // Disable the button when modal opens
  };

  const closePrivilegeModal = () => {
    setPrivilegeModalOpen(false);
    setSelectedPrivilege("");
    setDisableUpdateButton(true); // Reset button state when modal closes
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedUser(null);
    setIsViewModalOpen(false);
  };

  return (
    <div className="w-full isolate_bars text-center">
      <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white transition-transform duration-300">
        <div className="flex w-full justify-between">
          <h2 className="subheading3 capitalize font-semibold">
            Users Management
          </h2>
          <div className="flex items-center gap-2">
            <SearchBar
              placeholder="Search by Username..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide relative w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr
                className="
               border-b minicontent text-admintext"
              >
                <th className="pb-4 minicontent font-semibold  text-left">
                  Username
                </th>
                <th className="pb-4 minicontent font-semibold text-left">
                  Full Name
                </th>
                <th className="pb-4 minicontent font-semibold text-left">
                  Email
                </th>
                <th className="pb-4 minicontent font-semibold text-left">
                  Date of Birth
                </th>
                <th className="pb-4 minicontent font-semibold text-left">
                  Role
                </th>
                <th className="pb-4 minicontent font-semibold ">Change Role</th>
                <th className="pb-4 minicontent font-semibold ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-bggray text-center text-admintext"
                >
                  <td className="py-4 minicontent text-left">
                    {user.username}
                  </td>
                  <td className="py-4 minicontent text-left">
                    {user.fullName}
                  </td>
                  <td className="py-4 minicontent text-left">{user.email}</td>
                  <td className="py-4 minicontent text-left">
                    {formatDate(user.dateOfBirth)}
                  </td>
                  <td className="py-4 text-gray-600 capitalize text-left">
                    {user.role}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => openPrivilegeModal(user)}
                      className={`px-3 py-1 text-primary rounded hover:bg-primary hover:text-white transition-colors mr-2 ${
                        user.role === "superAdmin" ? "hidden" : ""
                      }`}
                      disabled={user.role === "superAdmin"} // This is redundant with the className approach
                    >
                      <UserPen className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => openViewModal(user)}
                      className="px-3 py-1 text-orange rounded hover:bg-orange hover:text-white transition-colors mr-2"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
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
      <ViewModal
        isOpen={isViewModalOpen}
        data={selectedUser}
        onClose={closeViewModal}
      />

      <PrivilegeUpdate
        isOpen={privilegeModalOpen}
        onClose={closePrivilegeModal}
        selectedUser={selectedUser}
        roles={roles}
        selectedPrivilege={selectedPrivilege}
        setSelectedPrivilege={setSelectedPrivilege}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};

export default UserTable;
