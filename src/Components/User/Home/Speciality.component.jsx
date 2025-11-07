import React from "react";
import Specialityimg from "/Home/Specialityimg.svg";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const Speciality = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const navigateToAbout = () => navigate("/about_us");
  const navigateToMaterial = () => navigate("/our_material");
  return (
    <div className="flex flex-col text-bold  items-center  space-y-6 w-full lg:flex-row paddingtop gap-6 md:paddingright">
      <img src={Specialityimg} className="w-full lg:w-1/2 " />

      <div className="w-full lg:w-1/2 flex flex-col  space-y-10 isolate_bars">
        <h2 className="subheading1 text-primary font-semibold uppercase">
          The specialist of cleaning made in Pakistan
        </h2>

        <p className="content text-justify font-light">
          CAPPAH International proudly stands as Pakistan's leading manufacturer
          and global supplier of a diverse range of cleaning solutions. From
          agronomic cleaning products to janitorial supplies and advanced
          cleaning equipment, our expertise caters to both professional and
          domestic needs. Since our inception in 1994, we have embraced
          innovation, sustainable practices, and unmatched customer support,
          establishing ourselves as specialists in the cleaning industry. With a
          focus on quality and affordability, our 'Made in Pakistan' products
          meet the highest standards, delivering excellence in almost all
          cleaning scenarios worldwide.
        </p>

        <div className="flex flex-col md:flex-row  w-full md:space-x-4 space-y-2 md:space-y-0 font-semibold text-white items-center justify-center">
          <button
            className="w-2/3 md:w-1/3 bg-lightblack uppercase h-16 rounded-full content "
            onClick={navigateToAbout}
          >
            WHO WE ARE
          </button>
          <button
            className="  w-2/3 bg-seagreen uppercase h-16 rounded-full  content"
            onClick={navigateToMaterial}
          >
            Browse company profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Speciality;
