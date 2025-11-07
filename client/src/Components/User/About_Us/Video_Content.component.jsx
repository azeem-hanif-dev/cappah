import React from "react";
import Cappah from "/About/CappahAbout.png";
const Video_Content = () => {
  return (
    <div className="flex flex-col text-bold  items-center justify-center  w-full md:flex-row paddingleft md:pl-0  paddingtop paddingbottom paddingright gap-6">
      <div className="w-full lg:w-1/2 h-full">
        <img src={Cappah} className="object-cover" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col   space-y-6 ">
        <h2 className="heading font-semibold text-primary uppercase">
          Our Story
        </h2>
        <p className="content font-semibold text-primary uppercase">
          Who is behind the hands that clean the world?
        </p>
        <p className="content text-justify font-light">
          CAPPAH International is a manufacturer and global supplier of a vast
          range of agronomic cleaning products, Janitorial Products, and
          equipment for professional and domestic markets. Thanks to the
          Enterprise spirit of our experienced team, modern management
          practices, sustainable policies, and continuous customer support,
          CAPPAH International has come a long way since its inception in 1994.
          Today CAPPAH International is the industry leader in manufacturing &
          supplying quality cleaning products and Janitorial Products catering
          to a wide variety of customers' Cleaning Products and Janitorial
          Products needs and budgets for almost all cleaning situations.
        </p>
      </div>
    </div>
  );
};

export default Video_Content;
