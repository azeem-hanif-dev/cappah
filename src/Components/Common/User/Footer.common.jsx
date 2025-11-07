import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { DividerHorizontal } from "../Divider";
import Mapimg from "/common/Footer_Map.png";
import { toast, ToastContainer } from "react-toastify";
import { CategoriesContext } from "../../../Context/CategoriesContext";
import { postEmail } from "../../../Api/User/Subscribe";

import { Loader2 } from "lucide-react";
const Footer = () => {
  const { categories, loading } = useContext(CategoriesContext);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Run scrollToTop on every navigation, even if the pathname is the same
  useEffect(() => {
    scrollToTop();
  }, [location]);

  const handleNavigate = (path = null, state = {}) => {
    navigate(path, { state });
    scrollToTop(); // Ensure it runs immediately when clicked
  };

  const handleCategoryClick = (selectedCategory) => {
    //console.log("Selected category is", selectedCategory);
    handleNavigate("/products", { category: selectedCategory });
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 6);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Special characters regex
  const specialCharsRegex = /[%&$#(){}[\]!`'~]/;

  const handleEmailChange = (e) => {
    const value = e.target.value;

    if (specialCharsRegex.test(value)) {
      toast.error("Special characters not allowed", {
        // position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setEmail(value);
  };

  const handleSubmit = async () => {
    // Validate email format
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email (example@domain.com)", {
        // position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    const submittingToast = toast.loading("Submitting...", {
      // position: "top-right",
    });

    try {
      await postEmail({ email });
      toast.update(submittingToast, {
        render: "Email sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setEmail(""); // Clear the input
    } catch (error) {
      toast.update(submittingToast, {
        render: "Failed to send email. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="text-white bg-gray z-50">
      <div className="flex flex-col child_container pb-6 ">
        {/* Stay Updated Section */}
        <div className="text-center flex flex-col space-y-6 md:space-y-8">
          <h2 className="subheading2 font-semibold md:text-3xl lg:text-4xl">
            Stay Updated
          </h2>
          <p className="font-thin content">
            Get the latest about Cappah products & more
          </p>
          <div className="relative w-full max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full px-6 py-3 rounded-full text-black content"
            />
            <button
              onClick={handleSubmit}
              disabled={!email || isSubmitting}
              className={`absolute top-1/2 right-1 transform -translate-y-1/2 bg-seagreen p-2 rounded-full hover:bg-teal-600 w-10 h-10 md:w-12 md:h-12 ${
                !email || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Submit"
            >
              <MailOutlineIcon />
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col text-center md:text-left md:flex-row justify-between mt-8 text-sm max-w-full text-textwhite content-evenly">
          {/* Products Column */}
          <ul className="content font-thin flex flex-col items-center md:items-start mb-8 md:mb-0">
            <h3 className="font-semibold text-primary mb-4">Products</h3>
            {loading ? (
              <p>Loading categories...</p>
            ) : (
              <div className="grid gap-2 md:gap-4 capitalize">
                {displayedCategories.map((category, index) => (
                  <li
                    key={index}
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.name}
                  </li>
                ))}
                {!showAllCategories && categories.length > 6 && (
                  <li
                    className="cursor-pointer text-primary font-semibold"
                    onClick={() => setShowAllCategories(true)}
                  >
                    Show All
                  </li>
                )}
              </div>
            )}
          </ul>

          {/* Useful Links Column */}
          <ul className="content font-thin flex flex-col items-center md:items-start mb-8 md:mb-0">
            <h3 className="font-semibold text-primary mb-4">Useful Links</h3>
            <div className="grid gap-2 md:gap-4">
              <Link
                to={"/"}
                className="cursor-pointer"
                onClick={() => handleNavigate()}
              >
                Home
              </Link>
              <Link
                to={"/about_us"}
                className="cursor-pointer"
                onClick={() => handleNavigate()}
              >
                About Us
              </Link>
              <Link
                to={"/our_material"}
                className="cursor-pointer"
                onClick={() => handleNavigate()}
              >
                Our Material
              </Link>
              <Link
                to={"/exhibition"}
                className="cursor-pointer"
                onClick={() => handleNavigate()}
              >
                Exhibitions
              </Link>
              <Link
                to={"/contact_us"}
                className="cursor-pointer"
                onClick={() => handleNavigate()}
              >
                Contact Us
              </Link>
            </div>
          </ul>

          {/* Location Column */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="content font-semibold text-primary mb-4">
              Location
            </h3>
            <img
              src={Mapimg}
              alt="Map"
              className="w-full max-w-sm mx-auto md:mx-0"
            />
          </div>
        </div>

        {/* White Divider */}
        <div className="flex justify-center mt-8">
          <DividerHorizontal />
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-6 md:mt-8 text-textwhite font-thin space-y-2 md:space-y-0">
          <p>© 2024 Cappah. All Rights Reserved.</p>
          <p>Powered By Digital Stationz</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
