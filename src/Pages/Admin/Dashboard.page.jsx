import React from "react";
import Potential_Customer from "../../Components/Admin/Dashboard/Potential_Customer.component";
import Heading from "../../Components/Admin/Dashboard/Heading";
import Cards from "../../Components/Admin/Dashboard/Cards.component";
const Dashboard = () => {
  return (
    <>
      <Heading />
      <Cards />
      <Potential_Customer />
    </>
  );
};

export default Dashboard;
