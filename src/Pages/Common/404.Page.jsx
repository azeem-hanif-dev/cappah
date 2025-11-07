import { useNavigate } from "react-router-dom";
import errorImg from "/common/404_Page.svg";
const Page_404 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100 gap-10 overflow-hidden relative">
      {/* Background image container with proper responsive handling */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${errorImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Content with z-index to appear above background */}
      <div className="flex flex-col items-center justify-center z-10 px-4 text-center">
        <p className="text-5xl md:text-6xl lg:text-8xl font-bold text-darkblue">
          Oops
        </p>
        <p className="text-xl md:text-2xl font-bold text-darkblue text-center mt-4">
          This Page Could Not Be Found.
        </p>
        <p className="hidden lg:block text-darkblue mt-4 max-w-md">
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
        </p>
        <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold text-primary mt-4">
          404
        </h2>
        <button
          className="flex w-auto py-3 px-4 rounded justify-evenly items-center transition
                  bg-seagreen text-white
                  hover:bg-seagreenfade hover:text-white mt-6"
          onClick={() => navigate("/")}
        >
          Back to HOME
        </button>
      </div>
    </div>
  );
};

export default Page_404;
