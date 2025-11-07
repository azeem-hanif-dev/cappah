import React from "react";
import { DividerVertical } from "../../Common/Divider";
const Our_Division = () => {
  return (
    <section className="flex flex-col text-center md:flex-row flex-wrap w-full isolate_container bg-seagreen text-white space-y-6 justify-between ">
      {/* Column 1 */}
      <div className=" w-full lg:w-2/12 flex lg:flex-col   justify-center   lg:text-left gap-2 ">
        <h2 className="heading ">Our </h2>
        <h2 className="heading ">Division</h2>
      </div>

      {/* Column 2 */}
      <div className=" md:flex lg:w-10/12 gap-6 sm:space-y-6 md:space-y-0">
        <div className="flex flex-col   text-justify pl-6 group  lg:border-l-[1px] border-white/50  justify-between gap-4">
          <h2 className="heading opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            Textile
          </h2>
          <p className="content opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            Cappah's textile materials feature durable cotton yarn and
            microfiber. Our cotton is highly absorbent and washable, perfect for
            frequent use. Microfiber offers effective, chemical-free cleaning,
            making it eco-friendly and efficient for all surfaces.
          </p>
        </div>

        <div className="flex flex-col   text-justify pl-6 group  md:border-l-[1px] border-white/50  justify-between gap-4">
          <h2 className="heading opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            Plastic
          </h2>
          <p className="content opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            Cappah uses high-quality plastic in our cleaning tools, ensuring
            durability and lightness. Our plastic components are designed for
            longevity, with features like color-coded handles for improved
            hygiene and easy handling in commercial settings.
          </p>
        </div>

        <div className="flex flex-col   text-justify pl-6 group  md:border-l-[1px] border-white/50  justify-between gap-4">
          <h2 className="heading opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            Metal
          </h2>
          <p className="content opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            Cappah’s cleaning products incorporate heavy-duty metal for strength
            and stability. Our metal parts are built to last, providing reliable
            performance for tough cleaning tasks in professional environments.
            We deliver timeless products.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Our_Division;
