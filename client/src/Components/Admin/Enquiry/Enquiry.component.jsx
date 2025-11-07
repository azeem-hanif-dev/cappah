import { useState } from "react";
import Loader from "../Common/Loader.common";
import SearchBar from "../Common/SearchBar.admin.component";
import ViewModal from "../../../Modals/Admin/Common/ViewModel";
import { updateEnquiryStatusChange } from "../../../Api/Admin/Enquiry/EnquiryStatus";
import { toast } from "react-toastify";
import { Eye, ChevronDown } from "lucide-react";

const Enquiry_Component = ({
  enquiry,

  getEnquiry,

  permissions,
}) => {
  const [isOpen, setisOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateEnquiryModalOpen, setIsUpdateEnquiryModalOpen] =
    useState(false);
  const enquiryPerPage = 10;
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const openModal = () => setisOpen(true);
  const closeModal = () => setisOpen(false);

  // console.log("Permissions are", permissions);
  const indexOfLastenquiry = currentPage * enquiryPerPage;
  const indexOfFirstenquiry = indexOfLastenquiry - enquiryPerPage;

  // Search by Enquiry name

  const filteredenquiryStatus = enquiry.filter((Enquiry) => {
    if (statusFilter === "all") return true; // Show all if filter is 'all'
    return Enquiry.status === statusFilter;
  });

  const filteredEnquiry = filteredenquiryStatus.filter(
    (enquiry) =>
      enquiry.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) // Add other fields if needed
  );
  // console.log("HA HA", filteredEnquiry);

  const currentenquiry = filteredEnquiry.slice(
    indexOfFirstenquiry,
    indexOfLastenquiry
  );
  const totalPages = Math.ceil(filteredEnquiry.length / enquiryPerPage);

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
  const openViewModal = (Enquiry) => {
    setSelectedEnquiry(Enquiry);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedEnquiry(null);
    setIsViewModalOpen(false);
  };

  const updateenquirytatus = async (EnquiryId, status) => {
    try {
      await updateEnquiryStatusChange(EnquiryId, status, CIP_Token);
      toast.success("Enquiry status updated successfully!");
      getEnquiry();
    } catch (error) {
      console.error("Error updating Enquiry status:", error);
      toast.error(error.message || "Failed to update Enquiry status");
    }
  };
  const handleSearch = (query) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  return (
    <div className="w-full isolate_bars text-center">
      <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white transition-transform duration-300">
        <div className="flex w-full justify-between">
          <h1 className="subheading3 capitalize font-semibold">
            Enquiry Management
          </h1>
          <div className="relative">
            <SearchBar
              placeholder="Search by Name/Email..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full scrollbar-hide">
          <table className="w-full minicontent divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="border-b ">
                <th className="w-1/8 py-3 text-left minicontent font-semibold">
                  Full Name
                </th>
                <th className="w-1/8 py-3 text-left pl-16 minicontent font-semibold">
                  Phone
                </th>
                <th className="w-1/8 py-3 text-left pl-16 minicontent font-semibold">
                  Email
                </th>
                <th className="w-1/8 py-3 text-center minicontent font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    Status
                    <div
                      className="relative inline-block px-1"
                      onMouseEnter={() => setShowStatusDropdown(true)} // 👈 Keeps it open when hovering
                      onMouseLeave={() => setShowStatusDropdown(false)} // 👈 Closes when mouse leaves
                    >
                      <button
                        onClick={() =>
                          setShowStatusDropdown(!showStatusDropdown)
                        }
                        className="flex items-center space-x-2 px-2 py-1 bg-white rounded-md hover:bg-bggray"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {showStatusDropdown && (
                        <div
                          className="absolute z-50 bg-white rounded-md shadow-lg"
                          style={{
                            minWidth: "112px",
                            left: "0",
                            top: "100%",
                            paddingTop: "4px",
                          }}
                        >
                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter("all");
                              setShowStatusDropdown(false);
                              setCurrentPage(1);
                            }}
                          >
                            Show All
                          </div>

                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent capitalize text-left text-admintext"
                            onClick={() => {
                              setStatusFilter("completed");
                              setShowStatusDropdown(false);
                              setCurrentPage(1);
                            }}
                          >
                            Completed
                          </div>

                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter("pending");
                              setShowStatusDropdown(false);
                              setCurrentPage(1);
                            }}
                          >
                            Pending
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>

                <th className="w-1/8 py-3 text-center minicontent font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {currentenquiry.map((Enquiry) => (
                <tr key={Enquiry.id} className=" border-bggray">
                  <td className="py-4 minicontent text-left ">
                    {Enquiry.fullname}
                  </td>
                  <td className="py-4 minicontent text-left  pl-16">
                    {Enquiry.phone}
                  </td>
                  <td className="py-4 minicontent text-left  pl-16">
                    {Enquiry.email}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-2 minicontent">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            Enquiry.status === "completed"
                              ? "bg-green-500"
                              : "bg-yellow-500" // Default to yellow (pending)
                          }`}
                        ></div>

                        {/* Commented out permissions logic */}
                        {permissions.permissions.quotations?.statusChange && (
                          <select
                            value={Enquiry.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              updateenquirytatus(Enquiry._id, newStatus);
                            }}
                            className="bg-white border capitalize border-bggray rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary minicontent"
                          >
                            <option value={Enquiry.status || "null"} disabled>
                              {Enquiry.status || "null"}
                            </option>
                            {Enquiry.status === "completed" ? (
                              <option value="pending" className="font-bold">
                                pending
                              </option>
                            ) : (
                              <option value="completed" className="font-bold">
                                completed
                              </option>
                            )}
                          </select>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="p-2  hover:bg-bggray rounded-full"
                        onClick={() => openViewModal(Enquiry)}
                      >
                        <Eye className="w-5 h-5 text-primary " />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
        data={selectedEnquiry}
        onClose={closeViewModal}
      />
    </div>
  );
};

export default Enquiry_Component;
