import React from "react";

const Home_Title_Description = ({ title, description }) => {
  return (
    <div className="flex flex-col text-bold  items-center child_container space-y-6">
      <h2 className="subheading1 uppercase text-primary font-semibold">
        {title}
      </h2>
      <p className="content font-light text-justify lg:text-center lg:w-2/3 ">
        {description}
      </p>
    </div>
  );
};

export default Home_Title_Description;
