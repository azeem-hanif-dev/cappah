import { useState, useEffect } from "react";

import SearchBar from "../../../Components/Admin/Common/SearchBar.admin.component";
import { fetchPotentialCustomersService } from "../../../Api/Admin/Dashboard/PotentialCustomers.Api";

const Potential_Customer = () => {
  const CIP_Token = localStorage.getItem("CIP_Token");

  const [potentialCustomers, setPotentialCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Search by email
  const potentialCustomersPerPage = 10;

  // Fetch potentialCustomers from API
  const fetchPotentialCustomers = async () => {
    try {
      // Call the service function
      const response = await fetchPotentialCustomersService(CIP_Token);
      console.log("your resposne is ", response);

      // Update state
      if (response) {
        setPotentialCustomers(response);
      } else {
        setPotentialCustomers([]);
      }
    } catch (error) {
      console.error("Failed to fetch potential customers:", error);
    } finally {
      // Ensure loading state is reset
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPotentialCustomers();
  }, []);

  // Pagination calculations
  const indexOfLastCustomer = currentPage * potentialCustomersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - potentialCustomersPerPage;

  // Search by email
  const filteredPotentialCustomers = potentialCustomers.filter((customer) =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPotentialCustomers = filteredPotentialCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(
    filteredPotentialCustomers.length / potentialCustomersPerPage
  );

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
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // console.log("Customers", potentialCustomers);

  return (
    <>
      <div className="w-full isolate_bars text-center  ">
        <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white">
          <div className=" flex w-full justify-between">
            <h1 className="subheading3 capitalize font-semibold">
              Potential Customers
            </h1>
            <SearchBar
              placeholder="Search by Email..."
              onSearch={handleSearch}
            />
          </div>

          <div className="overflow-hidden">
            <table className="w-full minicontent divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 border-b  text-left  minicontent ">
                <tr>
                  <th className="w-1/4 py-3 text-admintext  minicontent  font-semibold text-left">
                    Email
                  </th>
                  <th className="w-1/4 py-3 text-admintext minicontent  font-semibold text-center">
                    Engaged At
                  </th>
                  <th className="w-1/4 py-3 text-admintext minicontent  font-semibold text-center">
                    Visit Count
                  </th>
                  <th className="w-1/4 py-3 text-admintext minicontent font-semibold text-center">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="border-b text-left minicontent  border-bggray">
                {currentPotentialCustomers.map((customer) => (
                  <tr
                    key={customer.email}
                    className="border-b text-left minicontent  border-bggray"
                  >
                    <td className="w-1/4 py-6 minicontent  text-admintext text-left ">
                      {customer.email}
                    </td>
                    <td className="w-1/4 py-6 minicontent text-admintext text-center">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>

                    <td className="w-1/4 py-6 minicontent text-admintext text-center">
                      {customer.visitCount}
                    </td>
                    <td className="w-1/4 py-6 minicontent text-admintext text-center">
                      {customer.source}
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
      </div>
    </>
  );
};

export default Potential_Customer;
