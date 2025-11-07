import Cappah from "/common/Cappah.mp4";
const HeroSection = () => {
  return (
    <>
      <div className="relative w-full aspect-[16/9] overflow-hidden -z-20">
        <video
          src={Cappah}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover  "
        />
      </div>
    </>
  );
};

export default HeroSection;
