import Home_Hand from "/Home/Home_Hand.svg";

const Choose_Us = () => {
  return (
    <>
      <div className=" relative flex lg:bg-bggray w-full">
        {/* Mobile image - covers the entire screen */}
        <div className="absolute bottom-0 md:-bottom-16 top-0 md:top-  flex lg:hidden w-full min-h-screen -z-10 bg-bggray">
          <img
            src={Home_Hand}
            alt="Hand"
            className="h-full w-full object-cover opacity-20 lg:opacity-100"
          />
        </div>

        {/* Desktop image */}
        <div className="hidden lg:flex xl:w-full bg-bggray">
          <img
            src={Home_Hand}
            alt="Hand"
            className="h-full opacity-50 lg:opacity-100"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col child_container z-20 lg:flex-row">
          <div className="flex flex-col justify-evenly space-y-6 paddingbottom z-10">
            <h2 className="heading text-primary font-semibold">
              WHY CHOOSE US!
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <p className="content font-semibold">
                  ENVIRONMENTAL RESPONSIBILITY
                </p>
                <p className="content font-light text-justify">
                  We prioritize eco-friendly manufacturing, providing
                  sustainable, green cleaning products that ensure safety and
                  effectiveness.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="content font-semibold">QUALITY ASSURANCE</p>
                <p className="content font-light text-justify">
                  At Cappah International, we uphold the highest standards
                  through rigorous quality control at every production stage.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="content font-semibold">CUSTOMER SATISFACTION</p>
                <p className="content font-light text-justify">
                  Our goal is to ensure exceptional customer satisfaction by
                  continuously enhancing our products and services based on
                  customer feedback.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="content font-semibold">
                  CHILD LABOR-FREE ORGANIZATION
                </p>
                <p className="content font-light text-justify">
                  Cappah International is dedicated to a child labor-free
                  society, supporting compulsory education and compliance with
                  child labor laws.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="content font-semibold">PREMIUM PRODUCTS</p>
                <p className="content font-light text-justify">
                  Our premium cotton and microfiber cleaning products, including
                  various mop types and cloths, offer superior performance and
                  durability for all cleaning needs.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="content font-semibold">SAFETY OF USERS</p>
                <p className="content font-light text-justify">
                  We are committed to health, safety, and environmental
                  sustainability, using biodegradable materials to produce
                  hygienic products that meet strict standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Choose_Us;
