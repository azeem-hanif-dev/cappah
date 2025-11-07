import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsUrl } from "../../../urls";
import Loader from "/common/Loader.gif";
import Related_Products from "./Related_Products.component";
import EnquiryModal from "../../../Modals/User/Enquiry/EnquiryModal";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Product_Data = () => {
  const { id } = useParams(); // Extract product ID from the URL
  const [productData, setProductData] = useState(null); // To store the fetched product data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null); // For the selected main image
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${productsUrl}${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        console.log("Fetched Data:", data);

        if (!data.product.isActive) {
          navigate("/products"); // Redirect if product is not active
        }

        setProductData(data);
        setSelectedImage(data.product.images[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]); // Add `navigate` to the dependency array

  if (loading)
    return (
      <div className="w-full flex justify-center items-center">
        <img src={Loader} alt="Loading" className="h-72 w-72 md:h-96 md:w-96" />
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row child_container paddingbottom lg:pb-0 w-full gap-6 bg-gray-50  rounded-lg space-y-8 lg:space-y-0 justify-between items-center">
        {/* Product Details Section */}
        <div className="flex flex-col w-full lg:w-1/3    space-y-2 lg:space-y-12 content ">
          <h1 className="subheading2 text-primary font-semibold text-left uppercase">
            {productData.product.title}
          </h1>

          <div className="bg-gray-100 p-4 rounded-lg mb-4 bg-bggray">
            <p className="text-gray-600 mb-2">
              <strong>Article No:</strong> {productData.product.productCode}
            </p>
            <div className="flex items-center space-x-4 mb-2">
              <p className="text-gray-600">
                <strong>Colors:</strong>
              </p>
              <div className="flex">
                {typeof productData.product.colors[0] === "string"
                  ? JSON.parse(productData.product.colors[0]).map(
                      (color, index) => (
                        <div
                          key={index}
                          className="relative"
                          style={{
                            backgroundColor: color.hex,
                            width: "24px",
                            height: "24px",
                            marginRight: "10px",
                            borderRadius: "50%",
                          }}
                          title={color.name}
                        >
                          <span
                            className="absolute text-xs font-thin"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color:
                                color.hex === "#FFFFFF" ? "#000000" : "#FFFFFF", // For contrast
                            }}
                          >
                            {color.id}
                          </span>
                        </div>
                      )
                    )
                  : productData.product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="relative"
                        style={{
                          backgroundColor: color.hex,
                          width: "24px",
                          height: "24px",
                          marginRight: "10px",
                          borderRadius: "50%",
                        }}
                        title={color.name}
                      >
                        <span
                          className="absolute text-xs font-thin"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color:
                              color.hex === "#FFFFFF" ? "#000000" : "#FFFFFF",
                          }}
                        >
                          {color.id}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-2">
              <p className="text-gray-600">
                <strong>Size: </strong>
                {productData.product.size}
              </p>
            </div>
          </div>
          <p className="flex lg:hidden text-gray-600  text-justify content font-light">
            {productData.product.description}
          </p>

          <div className="flex ">
            <button
              className="bg-seagreen text-white w-full lg:px-8 button rounded-full font-semibold hover:bg-darkgreen"
              onClick={openModal} // Add this
            >
              Enquire Now
            </button>
          </div>
        </div>

        {/* Product Images Section */}
        <div className="flex  flex-col md:flex-row w-full   justify-end items-start lg:w-2/3  gap-6">
          <div className="flex justify-center w-full h-full md:w-[800px]  lg:w-[500px]  xl:w-[800px] md:h-[440px] lg:h-[500px] xl:h-[420px]">
            <img
              src={selectedImage}
              alt="Main Product"
              className="w-auto h-auto object-cover   "
            />
          </div>
          <div className="flex   md:flex-col    gap-9 lg:gap-0   lg:space-x-0 lg:space-y-6 md:items-center">
            {productData.product.images.map((image, index) => (
              <>
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-full h-12 sm:h-20 md:h-32  object-cover border cursor-pointer p-1 ${
                    image === selectedImage ? "border-primary" : "border-bggray"
                  }`}
                  onClick={() => setSelectedImage(image)} // Set selected image
                />
              </>
            ))}
          </div>
        </div>
      </div>
      <p className="hidden lg:flex text-gray-600 isolate_container text-justify content font-light">
        {productData.product.description}
      </p>

      {/* Render Related Products only after productData is loaded */}
      {productData && (
        <div className=" bg-bggray isolate_container w-full">
          <h2 className=" heading font-semibold text-center text-primary mb-6">
            Related Products
          </h2>
          <Related_Products
            category={productData.product.productCode}
            subCategory={productData.product.subCategory}
          />
          <EnquiryModal
            isOpen={isModalOpen}
            onClose={closeModal}
            product={productData.product} // Ensure correct property
          />
        </div>
      )}
    </>
  );
};

export default Product_Data;
