import React, { useState, useEffect } from "react";
import Loader from "../Common/Loader.common";
import { ShoppingCart, Info, User, Package } from "lucide-react";
import MetricCard from "./Common/Multicard.common";
import bluestar from "/Admin/Dashboard/bluestar.png";
import greenstar from "/Admin/Dashboard/greenstar.png";
import orangestar from "/Admin/Dashboard/orangestar.png";
import redstar from "/Admin/Dashboard/redstar.png";
import { getCount } from "../../../Api/Admin/Dashboard/Count.Api";

const Cards = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const countData = await getCount();
        console.log("Fetched data is", countData);

        setData(countData); // Update state with the fetched data
      } catch (err) {
        setError("Failed to fetch count");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Count catalogs and quotations based on the source field
  const catalogCount =
    data?.potentialCustomers?.filter(
      (customer) => customer.source === "catalog"
    ).length || 0;

  const quotationCount =
    data?.potentialCustomers?.filter(
      (customer) => customer.source === "quotation"
    ).length || 0;

  return (
    <div className="relative">
      {/* Background section positioned behind cards */}
      <section className="absolute top-0 left-0 w-full h-20 bg-navback rounded-b-lg z-0"></section>

      {/* Cards grid container */}
      <div
        className="relative paddingleft paddingright grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-4 rounded-b-lg bg-w-1/2 z-10 pt-8"
      >
        <MetricCard
          Cardcolor="bg-card1"
          icon={ShoppingCart}
          title="Total Products"
          value={
            data
              ? (data.activeProductCount ?? 0) +
                (data.inActiveProductCount ?? 0)
              : "null"
          }
          active={data ? data.activeProductCount : "null"}
          inactive={data ? data.inActiveProductCount : "null"}
          bgColor="bg-card1sub"
          error={error}
          star={bluestar}
        />
        <MetricCard
          Cardcolor="bg-card2"
          icon={Package}
          title="Total Categories"
          value={data ? data.categoryCount : "null"}
          subCategoryCount={data ? data.subCategoryCount : "null"}
          bgColor="bg-card2sub"
          error={error}
          star={orangestar}
        />
        <MetricCard
          Cardcolor="bg-card3"
          icon={Info}
          title="Total Enquiry"
          value={data ? data.enquireCount : "null"}
          completed={data ? data.CompletedCount : "null"}
          pending={data ? data.PendingCount : "null"}
          bgColor="bg-card3sub"
          error={error}
          star={greenstar}
        />
        <MetricCard
          Cardcolor="bg-card4"
          icon={User}
          title="Potential Customers"
          value={data ? data.potentialCustomerCount : "null"}
          enquire={data ? data.enquire : "null"}
          getintouch={data ? data.getintouch : "null"}
          bgColor="bg-card4sub"
          error={error}
          star={redstar}
        />
      </div>
    </div>
  );
};

export default Cards;
