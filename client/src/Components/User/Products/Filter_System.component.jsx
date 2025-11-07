import React, { useState, useEffect, useCallback } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { DividerHorizontal } from "../../Common/Divider";
import { fetchSubcategories } from "../../../Api/Common/Category/SubCategory/SubCategory.Api";
import { fetchCategories } from "../../../Api/GetCategories.Api";
import Loader from "/common/Loader.gif";
import Catelog from "../Products/Catelog.component";

const Filter_System = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategories,
  setSelectedSubcategories,
}) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  const fetchSubcategoriesData = useCallback(async (categoryId) => {
    if (!categoryId) {
      console.error("Category ID is undefined");
      return;
    }

    setLoadingSubcategories(true);
    try {
      const subcategoriesData = await fetchSubcategories(categoryId);
      // console.log("Fetching subcategories", subcategoriesData.data);
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: subcategoriesData.data,
      }));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingSubcategories(false);
    }
  }, []);

  const toggleCategory = useCallback(
    (category) => {
      // console.log("You are in toggle", category._id);
      if (activeCategory === category._id) {
        setActiveCategory(null);
        setCheckedItems((prevState) => {
          // Clear subcategory selections when category is deselected
          const updatedState = { ...prevState };
          // console.log("subcategories are following", subcategories);
          if (subcategories[category._id]) {
            subcategories[category._id].forEach((sub) => {
              delete updatedState[sub._id];
            });
          }
          return updatedState;
        });
        setSelectedSubcategories([]); // Clear selected subcategories
      } else {
        // Set active category and clear previous subcategory selections
        setActiveCategory(category._id);
        setCheckedItems((prevState) => {
          const updatedState = { ...prevState };
          Object.keys(updatedState).forEach((key) => {
            if (subcategories[activeCategory]?.some((sub) => sub._id === key)) {
              delete updatedState[key];
            }
          });
          return updatedState;
        });
        setSelectedSubcategories([]); // Clear selected subcategories

        if (!subcategories[category._id]) {
          fetchSubcategoriesData(category._id);
        }
      }
    },
    [activeCategory, subcategories, fetchSubcategoriesData]
  );

  const toggleCheckbox = useCallback(
    (id, isCategory = false, categoryId = null) => {
      setCheckedItems((prevState) => {
        const updatedState = { ...prevState };

        if (isCategory && categoryId) {
          // Update `selectedCategory`
          if (updatedState[id]) {
            setSelectedCategory(null);
          } else {
            setSelectedCategory(categoryId);
          }

          // Deselect all other categories and their subcategories
          categories.forEach((category) => {
            if (category._id === id) {
              updatedState[category._id] = !prevState[category._id];
            } else {
              delete updatedState[category._id];
              if (subcategories[category._id]) {
                subcategories[category._id].forEach((sub) => {
                  delete updatedState[sub._id];
                });
              }
            }
          });
        } else {
          // Toggle subcategory without affecting other selections
          updatedState[id] = !prevState[id];

          if (updatedState[id]) {
            setSelectedSubcategories((prev) => [...prev, id]);
          } else {
            setSelectedSubcategories((prev) =>
              prev.filter((sub) => sub !== id)
            );
          }
        }

        return updatedState;
      });
    },
    [categories, subcategories, setSelectedCategory, setSelectedSubcategories]
  );

  if (loading) {
    return (
      <div className="flex">
        <img src={Loader} alt="Loading" className="h-64 w-64" />
      </div>
    );
  }

  return (
    <div className=" lg:w-[272px] w-0 relative mr-0 lg:mr-6 ">
      {/* Mobile Filter Button */}
      {!sidebarOpen && (
        <button
          className="fixed bottom-1/2 -left-28 hover:-left-24 button flex lg:hidden items-center space-x-2 w-36 px-2 text-right bg-seagreen text-white rounded-full shadow-lg z-50 transition-all duration-300 ease-in-out"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ArrowForwardIosIcon className="ml-auto" />
        </button>
      )}

      {/* Sidebar */}

      <section
        className={`fixed lg:static top-0 left-0 h-screen lg:h-auto bg-bggray lg:w-full shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto lg:overflow-hidden max-h-screen lg:max-h-full scrollbar-hide  ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="">
          <Catelog />
        </div>
        {/* Header */}
        <div className="p-4 bg-white">
          <div className="flex flex-col justify-center items-center space-y-2 mb-6">
            <h2 className="font-semibold text-primary content flex items-center">
              <FilterAltRoundedIcon className="mr-2" />
              Filters
            </h2>
            <DividerHorizontal />
            <h2 className="font-semibold text-primary content flex items-center">
              Categories
            </h2>
          </div>

          {/* Categories List */}
          <div className="space-y-2 bg-bggray">
            {categories.map((category) => (
              <div key={category._id} className="font-semi">
                {/* Category Button */}
                <button
                  onClick={() => {
                    toggleCheckbox(category._id, true, category._id);
                    toggleCategory(category);
                  }}
                  className={`w-full flex items-center content justify-between py-3 text-left hover:bg-gray-50 rounded-md px-2 font-semibold ${
                    activeCategory === category._id ||
                    checkedItems[category._id]
                      ? "text-primary"
                      : "text-gray-700 hover:text-seagreenfade"
                  }`}
                >
                  <div className="flex items-center space-x-3 text-[15px]">
                    {/* Removed onClick to allow parent button's onClick to handle both selection and dropdown toggle */}
                    {checkedItems[category._id] ? (
                      <CircleRoundedIcon
                        fontSize="inherit"
                        className="text-primary"
                      />
                    ) : (
                      <RadioButtonUncheckedRoundedIcon
                        fontSize="inherit"
                        className="text-primary"
                      />
                    )}
                    <span className="font-semibold microcontent">
                      {category.name}
                    </span>
                  </div>
                  <ArrowForwardIosIcon
                    fontSize="small"
                    className={`transition-transform duration-200 ${
                      activeCategory === category._id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Subcategories */}
                {activeCategory === category._id && (
                  <div className="ml-6 mt-2 mb-3 space-y-2">
                    {loadingSubcategories ? (
                      <div className="w-full flex justify-center items-center">
                        <img src={Loader} alt="Loading" className="h-24 w-24" />
                      </div>
                    ) : subcategories[category._id]?.length === 0 ? (
                      <div className="content text-gray-500 py-2">
                        No subcategories available
                      </div>
                    ) : (
                      subcategories[category._id]?.map((subcategory) => (
                        <div
                          key={`${category._id}-${subcategory._id}`}
                          className={`flex items-center space-x-3 py-2 px-2 hover:bg-gray-50 rounded-md cursor-pointer ${
                            checkedItems[subcategory._id]
                              ? "text-primary"
                              : "text-gray-600 hover:text-primary/80"
                          }`}
                          onClick={() => toggleCheckbox(subcategory._id, false)}
                        >
                          {checkedItems[subcategory._id] ? (
                            <CircleRoundedIcon
                              fontSize="small"
                              className="text-primary"
                            />
                          ) : (
                            <RadioButtonUncheckedRoundedIcon
                              fontSize="small"
                              className="text-primary"
                            />
                          )}
                          <span className="content microcontent">
                            {subcategory.name}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64  shadow-lg z-20 overflow-y-auto">
            {/* Sidebar content goes here */}
          </div>
        </>
      )}
    </div>
  );
};

export default Filter_System;
