import { useState } from "react";
import { Eye, Pen, ChevronDown, Trash2Icon } from "lucide-react";

import ViewModal from "../../../Modals/Admin/Common/ViewModel";
import { updateProductStatusChange } from "../../../Api/Admin/Products/ProductStatusChange";
import UpdateProductModal from "../../../Modals/Admin/Product/UpdateProduct";
import SearchBar from "../Common/SearchBar.admin.component";
import { toast } from "react-toastify";
import Modal from "../Common/Modal.common";

const Products = ({
  products,
  onDeleteProduct,
  getProducts,
  onDelete,
  permissions,
}) => {
  const [isOpen, setisOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const productsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const openModal = () => setisOpen(true);
  const closeModal = () => setisOpen(false);

  const indexOfLastProducts = currentPage * productsPerPage;
  const indexOfFirstProducts = indexOfLastProducts - productsPerPage;

  const filteredProductStatus = products.filter((product) => {
    if (statusFilter === "all") return true; // Show all if filter is 'all'
    return product.isActive == statusFilter; // Otherwise, filter by status
  });

  const filteredProducts = filteredProductStatus.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by name
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProducts,
    indexOfLastProducts
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
  const openViewModal = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedProduct(null);
    setIsViewModalOpen(false);
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product); // Set the selected product
    setIsModalOpen(false); // Close previous modal
    setIsUpdateProductModalOpen(true);
  };
  const closeUpdateModal = () => {
    setIsUpdateProductModalOpen(false);
    getProducts();
  };
  const updateProductStatus = async (productId, isActive) => {
    try {
      await updateProductStatusChange(productId, isActive, CIP_Token);
      toast.success("Product status updated successfully!");
      getProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error(error.message || "Failed to update product status");
    }
  };
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 when searching
  };
  function truncateString(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }

  return (
    <div className="w-full isolate_bars text-center">
      <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white transition-transform duration-300">
        <div className="flex w-full justify-between">
          <h1 className="subheading3 capitalize font-semibold">
            Product Management
          </h1>
          <div className="relative">
            <SearchBar
              placeholder="Search by Name/Code..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full scrollbar-hide">
          <table className="w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="border-b ">
                <th className="w-1/8 py-3 text-left minicontent font-semibold">
                  Product Code
                </th>
                <th className="w-1/8 py-3 text-left pl-16 minicontent font-semibold">
                  Name
                </th>
                <th className="w-1/8 py-3 text-center minicontent font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    Status
                    {/* Wrap both button & dropdown inside a single div */}
                    <div
                      className="relative inline-block px-1"
                      onMouseEnter={() => setShowStatusDropdown(true)}
                      onMouseLeave={() => setShowStatusDropdown(false)}
                    >
                      <button className="flex items-center space-x-2 px-2 py-1 bg-white rounded-md hover:bg-bggray">
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown menu */}
                      {showStatusDropdown && (
                        <div
                          className="absolute z-50 bg-white rounded-md shadow-lg"
                          style={{
                            top: "100%", // Makes sure dropdown appears right below the button
                            left: "0",
                            minWidth: "112px", // Equivalent to w-28
                          }}
                        >
                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter("all");
                              setCurrentPage(1);
                            }}
                          >
                            Show All
                          </div>

                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter(true);
                              setCurrentPage(1);
                            }}
                          >
                            Active
                          </div>

                          <div
                            className="px-4 py-2 hover:bg-bggray cursor-pointer minicontent text-left text-admintext"
                            onClick={() => {
                              setStatusFilter(false);
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

                <th className="w-1/8 py-3 text-center minicontent font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className=" border-bggray">
                  <td className="py-4 minicontent text-left">
                    {truncateString(product.productCode, 20)}
                  </td>
                  <td className="py-4 minicontent text-left  pl-16">
                    {product.title}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-2 minicontent">
                        <div
                          className={`w-2.5 h-2.5 rounded-full  ${
                            product.isActive ? "bg-primary" : "bg-error"
                          }`}
                        ></div>
                        {/* Commented out permissions logic */}
                        {permissions.permissions.product?.statusChange && (
                          <select
                            value={product.isActive ? "Active" : "Inactive"}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              // console.log("Selected status:", newStatus);
                              updateProductStatus(
                                product._id,
                                newStatus === "Active"
                              );
                            }}
                            className="bg-white border border-bggray rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary minicontent"
                          >
                            <option
                              value={product.isActive ? "Active" : "Inactive"}
                              disabled
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </option>
                            {product.isActive ? (
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

                  <td className="py-4 ">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="p-2  hover:bg-bggray rounded-full"
                        onClick={() => openViewModal(product)}
                      >
                        <Eye className="w-5 h-5 text-primary " />
                      </button>
                      <button
                        className="p-2 hover:bg-bggray rounded-full"
                        onClick={() => openUpdateModal(product)}
                      >
                        <Pen className="w-5 h-5 text-orange" />
                      </button>
                      {permissions.role === "superAdmin" ? (
                        <button
                          disabled={onDelete}
                          className="p-2 hover:bg-bggray rounded-full"
                          onClick={() => onDeleteProduct(product._id)}
                        >
                          {onDelete ? (
                            <img
                              src="/common/formloader.gif"
                              alt="Loading..."
                              className="h-6 w-6"
                            /> // ✅ Show GIF
                          ) : (
                            <Trash2Icon className="w-5 h-5 text-error" />
                          )}
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
      </div>
      <ViewModal
        isOpen={isViewModalOpen}
        data={selectedProduct}
        onClose={closeViewModal}
      />
      {isUpdateProductModalOpen && (
        <UpdateProductModal
          isOpen={isUpdateProductModalOpen}
          onClose={closeUpdateModal}
          product={selectedProduct}
          fetchProducts={getProducts}

          // Pass the product data to modal
        />
      )}
    </div>
  );
};
export default Products;
