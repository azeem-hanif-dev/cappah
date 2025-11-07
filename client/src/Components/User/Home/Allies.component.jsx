import React from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Cotten from "/Home/AlliesCotten.svg";
import Book from "/Home/AlliesBook.svg";
import Board from "/Home/AlliesBoard.svg";

const Allies = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleDownloadPDF = () => {
    const pdfPath = "/common/catalogue.pdf"; // Adjust the path based on where you placed the file

    // Create an anchor element
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "catalogue.pdf"; // Set the download filename

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row text-bold items-center space-y-6 gap-6 w-full child_container space-x-6 ">
      {/* Text Section */}
      <div className="w-full  flex flex-col  space-y-10">
        <h2 className="subheading1 font-semibold  text-primary  lg:w-5/12 w-full  uppercase">
          Allies of Professional Cleaning
        </h2>
        <div className="flex w-full gap-6 flex-col lg:flex-row">
          <p className="content text-justify lg:w-5/12 w-full  font-light">
            CAPPAH International partners with professionals to redefine
            cleaning standards across industries. Our comprehensive range of
            high-quality cleaning products, janitorial supplies, and
            cutting-edge equipment is designed to meet the rigorous demands of
            professional cleaning. Whether for commercial spaces, healthcare
            facilities, or industrial environments, we provide reliable
            solutions that ensure efficiency, hygiene, and sustainability. By
            working closely with industry experts, we continue to innovate and
            deliver products that empower professionals to achieve unparalleled
            cleaning excellence.
          </p>
          {/* Card Section */}
          <div className="w-full lg:w-7/12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div
              className="bg-lightblue text-white justify-center items-center flex flex-col p-6 xl:p-12 transform hover:scale-95 scale-90 transition-transform duration-300 space-y-2"
              onClick={() => navigate("/about_us")}
            >
              <img
                src={Cotten}
                className="h-16 w-16 md:w-10 md:h-10 xl:w-12 xl:h-12"
              />
              <p className="content font-light text-center text-sm">
                READ MORE ABOUT
              </p>
              <p className="content font-semibold text-center text-base">
                CAPPAH CONCEPT
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="bg-Darkblue text-white justify-center items-center flex flex-col p-6 xl:p-12 transform hover:scale-95 scale-90 transition-transform duration-300 space-y-2"
              onClick={() => navigate("/contact_us")}
            >
              <img
                src={Board}
                className="h-16 w-16 md:w-10 md:h-10 xl:w-12 xl:h-12"
              />
              <p className="content font-light text-center text-sm">
                Get A Free Quotation On
              </p>
              <p className="content font-semibold text-center text-base">
                CAPPAH PRODUCTS
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="bg-orange text-white justify-center items-center flex flex-col p-6 xl:p-12 transform hover:scale-95 scale-90 transition-transform duration-300 space-y-2"
              onClick={handleDownloadPDF}
            >
              <img
                src={Book}
                className="h-16 w-16 md:w-10 md:h-10 xl:w-12 xl:h-12"
              />
              <p className="content font-light text-center text-sm">View Our</p>
              <p className="content font-semibold text-center text-base">
                PRODUCTS CATALOG
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allies;
