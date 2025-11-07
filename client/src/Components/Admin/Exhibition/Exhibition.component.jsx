import { useState, useEffect } from "react";
//import { useSelector } from "react-redux";

import SearchBar from "../Common/SearchBar.admin.component";
import AddExhibition from "../../../Modals/Admin/Exhibition/AddExhibition";
import { ChevronDown, Trash2Icon, EyeIcon, Pen } from "lucide-react";
import noimage from "/common/noimage.png";
import UpdateEventForm from "../../../Modals/Admin/Exhibition/UpdateEventForm";
//import { fetchUserPermissions } from "../../../Redux/reducers/userRoleSlice";
import { toast } from "react-toastify";
import { updateExhibitionStatus } from "../../../Api/Admin/Exhibition/UpdateExhibitionStatus";

const ExhibitionTables = ({
  exhibitions,
  fetchexhibitions,
  onDeleteExhibitions,
  permissions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // New state for modal
  const [isexhibitionAddModalOpen, setIsexhibitionAddModalOpen] =
    useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusFilter2, setStatusFilter2] = useState("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showStatusDropdown2, setShowStatusDropdown2] = useState(false);
  const [selectedexhibition, setSelectedexhibition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const [isUpdateexhibitionModalOpen, setIsUpdateexhibitionModalOpen] =
    useState(false);
  //const { permissions } = useSelector((state) => state.userPermissions);

  // console.log("Env url is", url);
  // console.log("Url is :", config.baseUrl);
  const exhibitionsPerPage = 10;

  useEffect(() => {
    fetchexhibitions();
  }, []);

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

  // Function to handle image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(`${config.baseUrl}${imageUrl}`);
  };
  // console.log("Log", permissions.permissions.exhibition.statusChange);

  const openAddexhibitionModal = () => {
    setIsexhibitionAddModalOpen(true);
  };
  const closeAddexhibitionModal = () => {
    setIsexhibitionAddModalOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //For updating exhibition status
  const handleUpdateExhibitionStatus = async (exhibitionId, isActive) => {
    try {
      console.log("Updating exhibition status...");

      await updateExhibitionStatus(exhibitionId, isActive, CIP_Token);

      // Show success message
      toast.success(`Exhibition status updated successfully`);

      // Refresh exhibitions list after successful update
      fetchexhibitions();
    } catch (error) {
      console.error("Error updating exhibition status:", error);

      // Show error message
      toast.error(error.message || "Failed to update exhibition status");
    }
  };

  const filteredexhibitions = exhibitions
    .filter((exhibition) => {
      // Check status filter
      const matchesStatus =
        statusFilter === "all" || exhibition.status == statusFilter;

      // Check active filter
      const matchesActive =
        statusFilter2 === "all" || exhibition.isActive == statusFilter2;

      // Return true if both conditions are satisfied
      return matchesStatus && matchesActive;
    })
    .filter((exhibition) =>
      // Finally, filter by name search term
      exhibition.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastexhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstexhibition = indexOfLastexhibition - exhibitionsPerPage;

  const totalPages = Math.ceil(filteredexhibitions.length / exhibitionsPerPage);
  const currentexhibitions = filteredexhibitions.slice(
    indexOfFirstexhibition,
    indexOfLastexhibition
  );

  const openModal = (exhibition) => {
    // console.log(exhibition.content);
    setSelectedexhibition(exhibition);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedexhibition(null);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % selectedexhibition.image.length
    );
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedexhibition.image.length) %
        selectedexhibition.image.length
    );
  };

  const openUpdateModal = (exhibition) => {
    setSelectedexhibition(exhibition); // Set the selected exhibition data
    // console.log(exhibition.content);
    setIsUpdateexhibitionModalOpen(true); // Open the update modal
  };
  const closeUpdateModal = () => {
    setIsUpdateexhibitionModalOpen(false);
    setSelectedexhibition(null); // Clear selected exhibition data
  };

  return (
    <div className="w-full isolate_bars text-center">
      <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white transition-transform duration-300">
        <div className="flex w-full justify-between">
          <h2 className="subheading3 capitalize font-semibold">
            Exhibition Management
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="relative flex items-center">
                {/* Status Box */}
                <div className="p-2 rounded-lg bg-primary text-white capitalize">
                  <p>{statusFilter}</p>
                </div>

                {/* Dropdown Toggle Button */}
                <button
                  className="flex items-center space-x-2 px-2 py-1 bg-white hover:bg-bggray rounded-md"
                  onMouseEnter={() => setShowStatusDropdown(true)}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showStatusDropdown && (
                  <div
                    className="absolute z-50 mt-2 bg-white rounded-md shadow-lg text-left font-semibold"
                    style={{
                      minWidth: "112px",
                      left: "0",
                      top: "100%",
                      paddingTop: "4px", // Prevents accidental closing
                    }}
                    onMouseEnter={() => setShowStatusDropdown(true)}
                    onMouseLeave={() => setShowStatusDropdown(false)}
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
                      className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                      onClick={() => {
                        setStatusFilter("upcoming");
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      Upcoming
                    </div>

                    <div
                      className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                      onClick={() => {
                        setStatusFilter("current");
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      Current
                    </div>

                    <div
                      className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                      onClick={() => {
                        setStatusFilter("past");
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      Past
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SearchBar
                placeholder="SEARCH BY TITLE"
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <table className="w-full text-sm sm:text-base table-auto">
            <thead>
              <tr className="text-center text-gray-500 border-b ">
                <th className="pb-4 minicontent font-semibold  text-left">
                  Image
                </th>
                <th className="pb-4 minicontent font-semibold  text-left pl-16">
                  Title
                </th>

                <th className="pb-4 minicontent font-semibold text-center ">
                  Date
                </th>
                <th className="pb-4 minicontent font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    Status
                    {/* Wrap button & dropdown together */}
                    <div
                      className="relative inline-block px-1"
                      onMouseEnter={() => setShowStatusDropdown2(true)}
                      onMouseLeave={() => setShowStatusDropdown2(false)}
                    >
                      <button className="flex items-center space-x-2 px-2 py-1 bg-white rounded-md hover:bg-bggray">
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown menu */}
                      {showStatusDropdown2 && (
                        <div
                          className="absolute z-50 bg-white rounded-md shadow-lg"
                          style={{
                            minWidth: "112px",
                            left: "0",
                            top: "100%",
                            paddingTop: "4px", // Prevents accidental closing
                          }}
                        >
                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter2("all");
                              setCurrentPage(1);
                            }}
                          >
                            Show All
                          </div>

                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter2(true);
                              setCurrentPage(1);
                            }}
                          >
                            Active
                          </div>

                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter2(false);
                              setCurrentPage(1);
                            }}
                          >
                            Inactive
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>

                <th className="pb-4 minicontent font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentexhibitions.map((exhibition) => (
                <tr
                  key={exhibition.id}
                  className="border-b text-left minicontent  border-bggray"
                >
                  <td className="py-4  minicontent w-16 px-2">
                    <img
                      src={
                        exhibition?.bannerImage
                          ? `${exhibition.bannerImage}`
                          : noimage
                      }
                      alt={exhibition.title || "No image"}
                      className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      // onClick={() => handleImageClick(exhibition?.image)}
                      onError={(e) => {
                        e.target.src = noimage;
                      }}
                    />
                  </td>
                  <td className="py-4  minicontent text-left pl-16">
                    {exhibition.title}
                  </td>

                  <td className="py-4  minicontent text-center">
                    {`${formatDate(
                      exhibition.schedule.fromDate
                    )} - ${formatDate(exhibition.schedule.toDate)}`}
                  </td>

                  <td className="py-4  minicontent">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-2 minicontent">
                        <div
                          className={`w-2.5 h-2.5 rounded-full  ${
                            exhibition.isActive ? "bg-primary" : "bg-error"
                          }`}
                        ></div>
                        {permissions.permissions.event?.statusChange && (
                          <select
                            value={exhibition.isActive ? "Active" : "Inactive"}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              // console.log("Selected status:", newStatus);
                              handleUpdateExhibitionStatus(
                                exhibition._id,
                                newStatus === "Active"
                              );
                            }}
                            className="bg-white border border-bggray rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary minicontent"
                          >
                            <option
                              value={
                                exhibition.isActive ? "Active" : "Inactive"
                              }
                              disabled
                            >
                              {exhibition.isActive ? "Active" : "Inactive"}
                            </option>
                            {exhibition.isActive ? (
                              <option
                                value="Inactive"
                                className="font-semibold"
                              >
                                Inactive
                              </option>
                            ) : (
                              <option value="Active" className="font-bold">
                                Active
                              </option>
                            )}
                          </select>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4  minicontent ">
                    <div className="flex gap-2 relative items-center justify-center">
                      <button
                        onClick={() => openModal(exhibition)}
                        className="p-2  hover:bg-bggray rounded-full" // Add a right margin here
                      >
                        <EyeIcon className="h-5 w-5 text-primary" />
                      </button>

                      {permissions.permissions.event.update && (
                        <button
                          onClick={() => openUpdateModal(exhibition)} // Pass exhibition data to openUpdateModal
                          className="p-2 hover:bg-bggray rounded-full"
                        >
                          <Pen className="w-5 h-5 text-orange" />
                        </button>
                      )}

                      {permissions.role === "superAdmin" ? (
                        <button
                          onClick={() => {
                            console.log("exhibition clicked ", exhibition._id);
                            onDeleteExhibitions(exhibition._id);
                          }}
                          className="p-2 hover:bg-bggray rounded-full"
                        >
                          <Trash2Icon className="w-5 h-5 text-error" />
                        </button>
                      ) : (
                        ""
                      )}
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

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto text-justify">
              <h2 className="minicontent font-semibold mb-4">
                Exhibition Details
              </h2>

              {/* Display Product Images Carousel */}
              <div className="mb-4 relative">
                {selectedexhibition?.bannerImage?.length ? (
                  <>
                    <img
                      src={`${selectedexhibition.bannerImage}`}
                      // alt={`Product Image ${currentIndex + 1}`}
                      alt="exhibition image"
                      className="w-full h-40 object-contain rounded"
                    />
                  </>
                ) : (
                  <span>No image available</span>
                )}
              </div>

              {/* Display Product Name */}
              <div className="mb-4">
                <strong>Title: </strong>{" "}
                {selectedexhibition?.title || "No data"}
              </div>
              <div className="mb-4">
                <strong>Link: </strong> {selectedexhibition?.link || "No data"}
              </div>
              <div className="mb-4">
                <strong>Location: </strong>{" "}
                {selectedexhibition?.location || "No data"}
              </div>
              <div className="mb-4">
                <strong>Date: </strong>
                {selectedexhibition?.schedule?.fromDate &&
                selectedexhibition?.schedule?.toDate
                  ? `${formatDate(
                      selectedexhibition.schedule.fromDate
                    )} - ${formatDate(selectedexhibition.schedule.toDate)}`
                  : "No data"}
              </div>
              <div className="mb-4">
                <strong>Time: </strong>
                {selectedexhibition?.time || "No data"}
              </div>
              <div className="mb-4">
                <strong>Status: </strong>
                {selectedexhibition?.status || "No data"}
              </div>
              <div className="mb-4">
                <strong>Description: </strong>
                {selectedexhibition?.description || "No data"}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className=" px-4 py-2 bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {isexhibitionAddModalOpen && (
          <AddExhibition
            isOpen={isexhibitionAddModalOpen}
            onClose={closeAddexhibitionModal}
            onAddexhibition={() => {
              fetchexhibitions();
              closeAddexhibitionModal();
            }}
          />
        )}
        {isUpdateexhibitionModalOpen && (
          <UpdateEventForm
            isOpen={isUpdateexhibitionModalOpen}
            onClose={closeUpdateModal}
            exhibitionData={selectedexhibition} // Pass selected exhibition data to modal
            fetchexhibitions={fetchexhibitions} // Pass the fetchexhibitions function to modal
          />
        )}
      </div>
    </div>
  );
};

export default ExhibitionTables;
