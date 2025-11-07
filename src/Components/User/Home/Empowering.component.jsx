import bgimage from "/Home/Empowering.svg";

const Empowering = () => {
  return (
    <>
      <div
        className="relative flex w-full flex-col md:flex-row bg-no-repeat paddingleft paddingtop"
        style={{
          background:
            "linear-gradient(5deg, rgba(239, 239, 239) 27%, transparent 0%)",
          mixBlendMode: "multiply",
        }}
      >
        {/* Content centered within the background */}
        <div className="flex flex-col md:min-w-1/2 w-full justify-center text-center md:text-left text-primary ">
          <h2 className="title font-blacksword">Empowering</h2>
          <h2 className="title font-blacksword">Professional</h2>
          <p className="heading">Cleaning Excellence</p>
        </div>
        <div className="flex md:min-w-1/2 w-full items-center justify-end lg:w-full ">
          <img src={bgimage} className="w-full" />
        </div>
      </div>
    </>
  );
};

export default Empowering;
