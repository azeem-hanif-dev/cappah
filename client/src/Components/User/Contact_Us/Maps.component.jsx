import PakistanColored from "/Contact/PakistanColored.svg";
import NetherlandsColored from "/Contact/NetherlandsColored.svg";

const Maps = () => {
  return (
    <section className="w-full flex flex-col items-center isolate_container ">
      <div className="w-full text-center">
        <h2 className="flex subheading2 mb-6 justify-center text-primary">
          OUR LOCATIONS
        </h2>
        <p className="content font-light">Tel: 020-6916115</p>
        <p className="content font-light">Email: sales@cappah.com</p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-10 justify-between">
        {/* Netherlands Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center">
          <img
            src={NetherlandsColored}
            className="w-1/2 h-auto mb-"
            alt="Netherlands Map"
          />
          <h2 className="subheading2 mb-2 uppercase text-primary">
            Netherlands
          </h2>
          <p className="content ">Main Office</p>
          <p className="content font-light">Tel: 020-6916115</p>
          <p className="content font-light">Email: sales@cappah.com</p>
          <p className="content font-light">
            Location: A Kollenbergweg 78 1101 Amsterdam
          </p>
          {/* <p className="content font-light">Amsterdam-Zuidoost</p> */}
        </div>

        {/* Pakistan Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center">
          <img
            src={PakistanColored}
            className="w-1/2 mb:6 md:mb-10 lg:mb-12 xl:mb-16  justify-center items-center"
            alt="Pakistan Map"
          />
          <h2 className="subheading2 mb-2 uppercase text-primary">Pakistan</h2>
          <p className="content ">Production Office</p>
          <p className="content font-light">Tel: 020-6916115</p>
          <p className="content font-light">Email: sales@cappah.com</p>
          <p className="content font-light">
            Location: Ali Enterprises, Baho Wala, Main Barki
          </p>
          <p className="content font-light">Road 3 km from Askari 10, Lahore</p>
        </div>
      </div>
    </section>
  );
};

export default Maps;
