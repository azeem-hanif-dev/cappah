import React from "react";
import Microfiberimg from "/Material/Microfiber.svg";
import Microfibercion from "/Material/microfibericon.svg";

const Microfiber = () => {
  return (
    <>
      <div className="flex flex-col  text-bold  items-center   w-full md:flex-row-reverse ">
        <img src={Microfiberimg} className="w-full md:w-1/2 object-cover " />

        <div className="w-full md:w-1/2 flex flex-col isolate_bars md:py-0  paddingleftmd:gap-3 gap-1">
          <div>
            <img src={Microfibercion} className="w-16 h-16" />
            <h2 className="subheading2 font-semibold text-primary uppercase">
              MICROFIBER
            </h2>
          </div>
          <p className=" content  md:font-semibold  text-primary uppercase">
            The Ultimate Cleaning Solution
          </p>

          <p className="content text-justify font-light">
            Microfiber is a high-performance material known for its exceptional
            absorbency, softness, and durability. With 200,000 strands per
            square inch, it cleans effortlessly without leaving lint or
            scratches.Eco-friendly and chemical-free, microfiber products reduce
            environmental impact while ensuring superior cleaning results.
            Perfect for efficient, green cleaning with less time and effort!
          </p>
        </div>
      </div>
    </>
  );
};

export default Microfiber;
