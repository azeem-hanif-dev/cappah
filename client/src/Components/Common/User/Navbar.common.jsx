import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "/common/Menu.svg";
import Logo from "/common/Logo.svg";
import FacebookLogo from "/common/icons/facebook.png";
import LinkedinLogo from "/common/icons/linkedin.png";
import InstagramLogo from "/common/icons/instagram.png";
import CallSharpIcon from "@mui/icons-material/CallSharp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { DividerHorizontal } from "../Divider";
import { fetchSubcategories } from "../../../Api/Common/Category/SubCategory/SubCategory.Api";
import { CategoriesContext } from "../../../Context/CategoriesContext";
import Loader from "../../Admin/Common/Loader.common";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [subcategories, setSubcategories] = useState({});
  const [loadingCategories, setLoadingCategories] = useState({});
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const productsTimeoutRef = useRef(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);
  const { categories, loading } = useContext(CategoriesContext);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  const navigate = useNavigate();

  // Check screen size on mount and when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);

      // Close products dropdown if screen becomes small
      if (window.innerWidth < 1024) {
        setIsProductsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProductsMouseEnter = () => {
    // Only handle hover effects on large screens
    if (!isLargeScreen) return;

    if (productsTimeoutRef.current) {
      clearTimeout(productsTimeoutRef.current);
    }
    setIsProductsOpen(true);
  };

  const handleProductsMouseLeave = () => {
    // Only handle hover effects on large screens
    if (!isLargeScreen) return;

    productsTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
      setActiveCategoryId(null);
      setSubcategories({});
    }); // Close after timeout
  };

  const handleCategoryClick = async (categoryId) => {
    if (activeCategoryId === categoryId) {
      setActiveCategoryId(null);
      return;
    }
    if (subcategories[categoryId]) {
      setActiveCategoryId(categoryId);
      return;
    }

    setActiveCategoryId(categoryId);
    setLoadingCategories((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const data = await fetchSubcategories(categoryId);
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: data.data.length ? data.data : null,
      }));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingCategories((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // Function to handle navigation and close menu on small screens
  const handleNavigation = (path = null, state = null) => {
    if (!isLargeScreen) {
      setIsMenuOpen(false); // Close menu on small screens
    }

    if (state) {
      navigate(path, { state });
    } else {
      navigate(path);
    }
  };

  return (
    <header className="flex w-full flex-col">
      <section className="hidden md:flex flex-col paddingleft paddingright">
        <section className="card bg-base-300 rounded-box place-items-center">
          <div className="flex flex-col w-full md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-x-3 bg-seagreen mb-3 px-8 py-3 text-textwhite rounded-b-3xl">
              <div className="flex space-x-2">
                <MailOutlineIcon sx={{ color: "white" }} />
                <p>sales@cappah.com</p>
              </div>
              <div className="flex space-x-2">
                <CallSharpIcon sx={{ color: "white" }} />
                <p>0301-1143779</p>
              </div>
            </div>
            <div className="flex flex-row justify-center md:justify-start items-center space-x-5 py-3">
              {/*  */}
              <a
                href="https://www.facebook.com/CappahInternational"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={FacebookLogo}
                  alt="Facebook Logo"
                  className="w-6 h-6"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/cappahinternational"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={LinkedinLogo}
                  alt="LinkedIn Logo"
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://www.instagram.com/cappah_international"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={InstagramLogo}
                  alt="Instagram Logo"
                  className="w-8 h-8"
                />
              </a>
            </div>
          </div>
        </section>
      </section>

      <DividerHorizontal />

      <section className="flex flex-col py-2 paddingleft paddingright shadow-lg">
        <div className="flex items-center justify-between">
          <img src={Logo} alt="Logo" className="h-[5.5rem] md:h-[5.5rem]" />
          <div className="flex items-center">
            <p className="text-2xl font-normal hidden md:flex">MENU</p>
            <img
              src={Menu}
              alt="Menu Icon"
              className={`h-6 md:h-7 ml-3 cursor-pointer transition-transform ${
                isMenuOpen ? "rotate-45" : "rotate-0"
              }`}
              onClick={toggleMenu}
            />
          </div>
        </div>
      </section>

      <section className="relative">
        {isMenuOpen && (
          <div className="flex w-full transform transition-transform duration-500 opacity-0 animate-menuFadeIn">
            <div className="flex flex-col md:flex-row w-full text-white content">
              <Link
                to={"/"}
                className="flex-1 subnavbutton"
                onClick={() => handleNavigation()}
              >
                Home
              </Link>
              <Link
                to={"/about_us"}
                className="flex-1 subnavbutton"
                onClick={() => handleNavigation()}
              >
                About Us
              </Link>
              <Link
                to={"/our_material"}
                className="flex-1 subnavbutton"
                onClick={() => handleNavigation()}
              >
                Our Material
              </Link>

              <Link
                to={"/products"}
                className="flex-1 subnavbutton"
                onMouseEnter={handleProductsMouseEnter}
                onMouseLeave={handleProductsMouseLeave}
              >
                Products {isLargeScreen && <ArrowDropDownIcon />}
              </Link>

              <Link
                to={"/exhibition"}
                className="flex-1 subnavbutton"
                onClick={() => handleNavigation()}
              >
                Exhibitions
              </Link>
              <Link
                to={"/contact_us"}
                className="flex-1 subnavbutton"
                onClick={() => handleNavigation()}
              >
                Contact Us
              </Link>
              <div className="md:hidden flex flex-row justify-center md:justify-start items-center space-x-5 py-3">
                <a
                  href="https://www.facebook.com/CappahInternational"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={FacebookLogo}
                    alt="Facebook Logo"
                    className="w-6 h-6"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/cappahinternational"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={LinkedinLogo}
                    alt="LinkedIn Logo"
                    className="w-8 h-8"
                  />
                </a>
                <a
                  href="https://www.instagram.com/cappah_international"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={InstagramLogo}
                    alt="Instagram Logo"
                    className="w-8 h-8"
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Only render products dropdown on large screens */}
      {isLargeScreen && (
        <section
          className="flex"
          onMouseEnter={handleProductsMouseEnter}
          onMouseLeave={handleProductsMouseLeave}
        >
          {isProductsOpen && (
            <div
              className="absolute left-0 right-0 bg-seagreen border border-white transform transition-transform duration-500 ease-in-out animate-menuFadeIn z-50"
              style={{ width: "100vw" }}
            >
              <div className="flex isolate_bars">
                <div className="w-1/4 bg-seagreen text-white">
                  {loading ? (
                    <div className="text-center italic py-4">
                      <Loader />
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category._id}
                        className={`flex items-center space-x-3 px-6 py-4 cursor-pointer transition-colors duration-300 ${
                          activeCategoryId === category._id
                            ? "text-white"
                            : "text-white/50 hover:text-white"
                        }`}
                        onClick={() => handleCategoryClick(category._id)}
                      >
                        <img src={category.icon} alt="" className="w-6 h-6" />
                        <span className="text-lg">{category.name}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="w-3/4 bg-seagreen">
                  <div className="px-8 py-4">
                    {Object.entries(loadingCategories).map(
                      ([categoryId, isLoading]) =>
                        isLoading && (
                          <div key={categoryId} className="text-white text-lg">
                            <Loader />
                          </div>
                        )
                    )}
                    {Object.entries(subcategories).map(
                      ([categoryId, subs]) =>
                        categoryId === activeCategoryId && (
                          <div key={categoryId} className="space-y-3">
                            {subs === null ? (
                              <div className="text-white px-4 py-2">
                                No Subcategories Found
                              </div>
                            ) : (
                              subs.map((sub) => (
                                <div
                                  key={sub._id}
                                  className={`px-4 py-2 cursor-pointer transition-colors duration-300 underline underline-offset-8 ${
                                    sub._id === activeSubcategoryId
                                      ? "text-white"
                                      : "text-white/50 hover:text-white"
                                  }`}
                                  onClick={() => {
                                    const selectedCategory = categories.find(
                                      (cat) => cat._id === activeCategoryId
                                    );
                                    setActiveSubcategoryId(sub._id);
                                    setIsMenuOpen(false);
                                    handleNavigation("/products", {
                                      category: selectedCategory,
                                      subcategory: sub,
                                    });
                                  }}
                                >
                                  {sub.name}
                                </div>
                              ))
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </header>
  );
};

export default Navbar;
