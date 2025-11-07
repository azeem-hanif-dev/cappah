import React from "react";
import Plasticimg from "/Material/Plastic.svg";
import Plasticicon from "/Material/plasticicon.svg";

const Plastic = () => {
  return (
    <div className="flex flex-col text-bold  items-center     w-full md:flex-row">
      <img src={Plasticimg} className="w-full md:w-1/2 object-cover " />
      <div className="w-full md:w-1/2 flex flex-col isolate_bars md:py-0  paddingright md:gap-3 gap-1">
        <div>
          <img src={Plasticicon} className="w-10 h-10" />
          <h2 className="subheading2 font-semibold text-primary  ">PLASTIC</h2>
        </div>
        <p className="content md:font-semibold text-primary uppercase">
          represents the pinnacle of refined, high-quality plastic innovation.
        </p>
        <p className="content text-justify font-light">
          Plastic is a versatile material used in packaging, construction, and
          household products. Known for its durability, flexibility, and
          adaptability, it withstands extreme conditions, is reusable,
          recyclable, and easily molded into various shapes. Pakistan excels in
          producing high-quality plastic that meets international standards.
        </p>
      </div>
    </div>
  );
};

export default Plastic;
