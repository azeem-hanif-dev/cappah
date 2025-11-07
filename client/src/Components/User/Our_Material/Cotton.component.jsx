import React from "react";
import Cottonimg from "/Material/Cotton.svg";
import Cottonicon from "/Material/cottonicon.svg";
const Cotton = () => {
  return (
    <div className="flex flex-col text-bold  items-center     w-full md:flex-row ">
      <img src={Cottonimg} className="w-full md:w-1/2 object-cover " />

      <div className="w-full md:w-1/2 flex flex-col isolate_bars md:py-0  paddingright md:gap-3 gap-1">
        <div>
          <img src={Cottonicon} className="w-16 h-16" />
          <h2 className="subheading2 font-semibold text-primary ">COTTON</h2>
        </div>
        <p className="content md:font-semibold text-primary uppercase">
          Cotton (our name comes from the word cotton known as Cappah in
          Punjabi)
        </p>
        <p className="content text-justify font-light">
          Is a natural fiber that find use in many products including cleaning
          products and assorted cleaning need. Pakistan is known for producing
          some of the best quality cotton than anywhere in the World. The
          elasticity of Cotton fiber allows it to withstand high temperatures,
          can be washed, re-used and is very susceptible to dyes.
        </p>
      </div>
    </div>
  );
};

export default Cotton;
