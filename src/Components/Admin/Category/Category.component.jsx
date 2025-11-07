import React, { useState, useEffect } from "react";

import {
  ChevronDown,
  ChevronRight,
  Trash2Icon,
  Eye,
  CornerLeftDown,
  Pen,
} from "lucide-react";
import ViewModal from "../../../Modals/Admin/Common/ViewModel";
import SearchBar from "../Common/SearchBar.admin.component";
import { fetchSubcategories } from "../../../Api/Common/Category/SubCategory/SubCategory.Api";
import Loader from "../Common/Loader.common";
import UpdateCategory from "../../../Modals/Admin/Category/UpdateCategory";
import { deleteSubCategory } from "../../../Api/Admin/Category/SubCategory/SubCategoryDelete";
import { toast } from "react-toastify";
import AddSubCategory from "../../../Modals/Admin/Category/SubCategory/AddSubCategory";
import UpdateSubCategoryModal from "../../../Modals/Admin/Category/SubCategory/UpdateSubCategory";

const Category = ({
  categories,
  onDeleteCategory,
  fetchCategories,
  onDelete,
  permissions,
}) => {
  const CIP_Token = localStorage.getItem("CIP_Token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [showSubCategoryButton, setShowSubCategoryButton] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategoryloading, setsubCategoryLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [imgError, setImgError] = useState(false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);
  const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] =
    useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const categoriesPerPage = 10;
  const [editValue, setEditValue] = useState({
    name: "",
    description: "",
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValue({
      name: item.name,
      description: item.description,
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleSave = (id) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: editValue.name,
            description: editValue.description,
            updatedAt: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            }),
          };
        }
        return item;
      })
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
    setDeleteId(null);
  };

  const openViewModal = (category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedCategory(null);
    setIsViewModalOpen(false);
  };

  const indexOfLastCategories = currentPage * categoriesPerPage;
  const indexOfFirstCategories = indexOfLastCategories - categoriesPerPage;

  // Search by category name
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCategories = filteredCategories.slice(
    indexOfFirstCategories,
    indexOfLastCategories
  );
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDropdownClick = async (id, event, preventToggle = false) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Prevent toggling if preventToggle is true
    if (!preventToggle) {
      if (activeDropdown === id) {
        setActiveDropdown(null);
        setShowSubCategoryButton(false);
        return;
      }
      setSubCategories([]);
      setActiveDropdown(id);
      setShowSubCategoryButton(true);
    }

    setsubCategoryLoading(true); // Set loading to true when fetching starts
    setErrorMessage("");

    try {
      const response = await fetchSubcategories(id);
      const data = await response;

      if (data) {
        console.log(data, "Data is");
        console.log(data.data, "Data is");
        setSubCategories(data.data);
      } else {
        setSubCategories([]);
        setErrorMessage("No sub-categories available.");
      }
    } catch (error) {
      setErrorMessage("Failed to load sub-categories.");
    } finally {
      setsubCategoryLoading(false); // Set loading to false when fetching ends
    }
  };

  const handleDeleteSubCategory = async (category) => {
    setIsDeleting(true);
    try {
      const result = await deleteSubCategory(category._id, CIP_Token); // ✅ Use result

      setSubCategories((prevCategories) =>
        prevCategories.filter((item) => item._id !== category._id)
      );

      toast.success(result.message || "Sub Category deleted successfully");

      handleDropdownClick(category.category, null, true);
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  const openUpdateModal = (category) => {
    setIsViewModalOpen(false);
    setSelectedCategory(category);
    setIsUpdateCategoryModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateCategoryModalOpen(false);
    setSelectedCategory(null);
  };
  const openModal = (subcategory) => {
    setSelectedSubCategory(subcategory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubCategory(null);
  };

  const openSubCategoryModal = (category) => {
    setSelectedCategory(category);
    setIsSubCategoryModalOpen(true);
  };

  const closeSubCategoryModal = () => {
    setIsSubCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const closeUpdateSubCategoryModal = () => {
    setSelectedSubCategory(null);
    setIsUpdateSubCategoryModalOpen(false);
  };

  const handleUpdateSubCategorySuccess = () => {
    // Refresh data
    //fetchCategories();
    closeUpdateSubCategoryModal();
  };

  const openUpdateSubCategoryModal = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsUpdateSubCategoryModalOpen(true);
  };

  return (
    <div className="w-full isolate_bars text-center">
      <div className="flex flex-col items-center rounded-lg  justify-between gap-4 tablepadding  bg-white transition-transform duration-300">
        <div className="flex w-full justify-between">
          <h1 className="subheading3 capitalize font-semibold">
            Category Management
          </h1>
          <div className="relative">
            <SearchBar
              placeholder="Search by Name...."
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide relative w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b  text-left  minicontent ">
                <th className="py-4  minicontent font-semibold">Image</th>
                <th className="py-4  minicontent font-semibold pl-16">Name</th>

                <th className="py-4  minicontent font-semibold">Created At</th>

                <th className="py-4 text-center minicontent font-semibold">
                  Actions
                </th>
                <th className="py-4 text-center minicontent font-semibold">
                  Sub Category
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category) => (
                <React.Fragment key={category._id}>
                  <tr className="border-b text-left minicontent  border-bggray">
                    <td className="py-4 text-gray-600 w-16 px-2 text-left">
                      <img
                        src={category?.image ? `${category.image}` : noimage}
                        alt={category.title}
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(category?.image)}
                        onError={(e) => {
                          e.target.src = noimage; // Use default image on error
                          setImgError(true); // Mark the error
                        }}
                      />
                    </td>
                    <td className="py-4 text-gray-600 px-2 pl-16">
                      {category.name}
                    </td>

                    <td className="py-4 text-gray-600">
                      {formatDate(category.createdAt)}
                    </td>

                    <td className="py-8 flex items-center justify-center">
                      <button
                        onClick={() => openViewModal(category)}
                        className="p-2  hover:bg-bggray rounded-full"
                      >
                        <Eye className="w-5 h-5 text-primary" />
                      </button>

                      {/* {permissions.role === "superAdmin" && ( */}
                      {permissions.permissions?.category?.update && (
                        <button
                          onClick={() => openUpdateModal(category)}
                          className="p-2  hover:bg-bggray rounded-full"
                        >
                          <Pen className="w-5 h-5 text-orange" />
                        </button>
                      )}

                      {permissions.role === "superAdmin" && (
                        <button
                          disabled={onDelete}
                          onClick={() => onDeleteCategory(category._id)}
                          className="p-2  hover:bg-bggray rounded-full"
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
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Show subcategory button ONLY when this specific category is active */}
                        {activeDropdown === category._id &&
                          permissions.permissions?.subCategory?.create && (
                            <button
                              onClick={() => {
                                openSubCategoryModal(category);
                                //setActiveDropdown(null);
                              }}
                              className="px-2 py-2 bg-primary text-white rounded hover:bg-primary transition-colors flex items-center gap-1"
                            >
                              <CornerLeftDown className="w-4 h-4" />
                              {/* Removed mt-2 */}
                              <span>Add</span>
                            </button>
                          )}
                        <button
                          type="button"
                          onClick={() => handleDropdownClick(category._id)}
                          className="px-2 py-2 bg-primary border rounded-md shadow-sm text-white hover:bg-primary/80"
                        >
                          {activeDropdown === category._id ? (
                            <ChevronDown className="w-4 h-6" />
                          ) : (
                            <ChevronRight className="w-4 h-6" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expandable Subcategories Section */}
                  {activeDropdown === category._id && (
                    <tr className=" text-left  minicontent">
                      <td colSpan="7" className="bg-bggray/30 rounded-xl">
                        <div
                          className="py-2 px-8 border-y-4 border-primary rounded-xl  overflow-y-auto scrollbar-hide"
                          style={{ maxHeight: "400px" }}
                        >
                          <h3 className=" text-primary flex items-center space-x-2">
                            <span className="subheading3 capitalize font-semibold">
                              Sub Categories
                            </span>

                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full subheading3 capitalize font-semibold">
                              {subCategories.length}
                            </span>
                          </h3>
                          {subCategoryloading ? (
                            <div className="flex justify-center items-center py-4">
                              <Loader />
                            </div>
                          ) : (
                            <table className="w-full minicontent ">
                              <thead>
                                <tr className="text-center  border-b">
                                  <th className="py-1.5 font-semibold">
                                    Image
                                  </th>
                                  <th className="py-1.5 font-semibold text-left pl-16">
                                    Name
                                  </th>
                                  <th className="py-1.5 font-semibold text-left">
                                    Created At
                                  </th>
                                  <th className="py-1.5 font-semibold">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {subCategories.map((subCategory) => (
                                  <tr
                                    key={subCategory._id}
                                    className="border-b border-admintext/20 hover:bg-gray-50/50 text-center" // Added hover effect
                                  >
                                    <td className="py-1.5">
                                      <p>Not available</p>
                                    </td>
                                    <td className="py-1.5 text-gray-600 text-left pl-16">
                                      {subCategory.name}
                                    </td>

                                    <td className="py-1.5 text-gray-600 text-left">
                                      {formatDate(subCategory.createdAt)}
                                    </td>
                                    <td className="p-4 text-center ml-0 mr-0">
                                      <div className="flex items-center justify-center gap-2">
                                        <button
                                          onClick={() => openModal(subCategory)}
                                          className="p-2  hover:bg-bggray rounded-full"
                                        >
                                          <Eye className="w-5 h-5 text-primary" />
                                        </button>

                                        {permissions.permissions?.subCategory
                                          ?.update && (
                                          <button
                                            onClick={() =>
                                              openUpdateSubCategoryModal(
                                                subCategory
                                              )
                                            }
                                            className="p-2  hover:bg-bggray rounded-full"
                                          >
                                            <Pen className="w-5 h-5 text-orange" />
                                          </button>
                                        )}
                                        {permissions.role === "superAdmin" && (
                                          <button
                                            disabled={isDeleting}
                                            onClick={() =>
                                              handleDeleteSubCategory(
                                                subCategory
                                              )
                                            }
                                            className="p-2  hover:bg-bggray rounded-full"
                                          >
                                            {isDeleting ? (
                                              <img
                                                src="/common/formloader.gif"
                                                alt="Loading..."
                                                className="h-6 w-6"
                                              /> // ✅ Show GIF
                                            ) : (
                                              <Trash2Icon className="w-5 h-5 text-error" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                          {/* Modal remains the same */}
                          {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto scrollbar-hide">
                                <h2 className="subheading3 capitalize font-semibold mb-4">
                                  Sub Category Detail
                                </h2>
                                <div className="mb-4 relative">
                                  {selectedSubCategory?.image?.length ? (
                                    <img
                                      src={`${selectedSubCategory.image}`}
                                      alt="blog image"
                                      className="w-full h-40 object-contain rounded"
                                      onError={(e) => {
                                        e.target.src = noimage;
                                      }}
                                    />
                                  ) : (
                                    <span>No image available</span>
                                  )}
                                </div>
                                <div className="mb-4 capitalize minicontent">
                                  <strong>Title: </strong>{" "}
                                  {selectedSubCategory?.name || "No data"}
                                </div>

                                <div className="flex justify-end gap-2 minicontent">
                                  <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Edit Hover Component */}
          {editingId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Edit Item</h3>
                  <button
                    onClick={() => setEditingId(null)}
                    className=" hover:bg-primary  p-2  rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editValue.name}
                      onChange={(e) =>
                        setEditValue({ ...editValue, name: e.target.value })
                      }
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editValue.description}
                      onChange={(e) =>
                        setEditValue({
                          ...editValue,
                          description: e.target.value,
                        })
                      }
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className=" px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(editingId)}
                      className="px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteId(null)}
                    className=" px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="px-4 button bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
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
        data={selectedCategory}
        onClose={closeViewModal}
      />

      {isUpdateCategoryModalOpen && selectedCategory && (
        <UpdateCategory
          isOpen={isUpdateCategoryModalOpen}
          onClose={closeUpdateModal}
          categoryData={selectedCategory}
          fetchCategories={fetchCategories} // Pass fetchCategories to modal
        />
      )}
      {/* Add subCategory model */}
      {isSubCategoryModalOpen && selectedCategory && (
        <AddSubCategory
          isOpen={isSubCategoryModalOpen}
          onClose={closeSubCategoryModal}
          category={selectedCategory}
          handleDropdownClick={handleDropdownClick}
        />
      )}

      {isUpdateSubCategoryModalOpen && selectedSubCategory && (
        <UpdateSubCategoryModal
          isOpen={isUpdateSubCategoryModalOpen}
          subCategory={selectedSubCategory}
          onClose={closeUpdateSubCategoryModal}
          onSuccess={handleUpdateSubCategorySuccess}
          handleDropdownClick={handleDropdownClick}
        />
      )}
    </div>
  );
};

export default Category;
