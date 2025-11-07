import React from "react";

const Title_Description = ({ title, description }) => {
  return (
    <div className="flex flex-col text-bold  items-center py-8 px-8 lg:p-28 space-y-6">
      <h2 className="subheading1 text-primary uppercase">{title}</h2>
      <p className="content md:text-center font-light text-justify">
        {description}
      </p>
    </div>
  );
};

export default Title_Description;
