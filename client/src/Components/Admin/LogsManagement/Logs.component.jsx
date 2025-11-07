import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Loader from "../Common/Loader.common";
import { fetchLogs } from "../../../Api/Admin/Logger/FetchLogs";
import ViewModal from "../../../Modals/Admin/Common/ViewModel";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add this if you need search functionality
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const LOGS_PER_PAGE = 10;
  const CIP_Token = localStorage.getItem("CIP_Token");

  const loadLogs = async (page) => {
    setLoading(true);
    try {
      // Call the fetchLogs function from the separate service file
      const { data, totalPages, totalLogs } = await fetchLogs(
        page,
        CIP_Token,
        LOGS_PER_PAGE
      );

      // Update the state with the fetched logs
      setLogs(data);
      setTotalPages(totalPages);
      setTotalLogs(totalLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(currentPage); // Initial fetch on page load
  }, [currentPage]); // Dependency on currentPage, meaning it will reload when the page changes

  // Explicitly define event handlers
  const handlePreviousPage = (e) => {
    e.preventDefault(); // Prevent default button behavior
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault(); // Prevent default button behavior
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle null/undefined dates
    return new Date(dateString).toLocaleString("en-US");
  };

  const openModal = (user) => {
    if (user) {
      // Add null check
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const openViewModal = (log) => {
    setSelectedLog(log); // ✅ Corrected variable
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedLog(null);
    setIsViewModalOpen(false);
  };

  // Calculate the range of items being shown
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * LOGS_PER_PAGE, totalLogs);

  // Add error checking for table data
  const renderTableRow = (log) => {
    if (!log) return null;

    return (
      <tr
        key={log._id}
        className="border-b text-center border-bggray minicontent"
      >
        <td className="py-4 text-gray-600 truncate ">{log.method || "-"}</td>
        <td className="py-4 text-gray-600 truncate ">
          {log.route
            ? log.route.length > 10
              ? `${log.route.slice(0, 10)}...`
              : log.route
            : "-"}
        </td>
        <td className="py-4 text-gray-600 truncate ">
          {log.user
            ? log.user.length > 10
              ? `${log.user.slice(0, 10)}...`
              : log.user
            : "-"}
        </td>
        <td className="py-4 text-gray-600 truncate ">{log.ip || "-"}</td>
        <td className="py-4 text-gray-600 truncate ">{log.username || "-"}</td>
        <td className="py-4 text-gray-600 truncate ">
          {formatDate(log.timestamp)?.length > 10
            ? `${formatDate(log.timestamp).slice(0, 10)}...`
            : formatDate(log.timestamp) || "-"}
        </td>
        <td className="py-4 text-gray-600 truncate ">
          {log.statusCode || "-"}
        </td>
        <td className="py-4">
          <button
            onClick={() => openViewModal(log)}
            className="p-2 hover:bg-bggray rounded-full"
          >
            <Eye className="w-5 h-5 text-primary" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full isolate_bars text-center">
      <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white transition-transform duration-300">
        <div className="flex w-full justify-between">
          <h2 className="subheading3 capitalize font-semibold">
            Logs Management
          </h2>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto relative w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    Method
                  </th>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    Route
                  </th>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    User Agent
                  </th>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    IP Address
                  </th>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    UserName
                  </th>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    Timestamp
                  </th>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    Status Code
                  </th>
                  <th className="py-3 text-center minicontent font-semibold tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>{logs.map(renderTableRow)}</tbody>
            </table>
          </div>
        )}

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
        data={selectedLog}
        onClose={closeViewModal}
      />
    </div>
  );
};

export default Logs;
