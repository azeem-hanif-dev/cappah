import About_Us_Maps from "/About/About_Maps.svg";

const About_Maps = () => {
  return (
    <>
      <div className="flex flex-col isolate_container justify-center items-center space-y-16 bg-bggray">
        <h2 className="subheading1 font-semibold text-primary uppercase">
          Cappah in the world
        </h2>
        <img src={About_Us_Maps} className="w-full h-full object-cover  " />
      </div>
    </>
  );
};

export default About_Maps;
