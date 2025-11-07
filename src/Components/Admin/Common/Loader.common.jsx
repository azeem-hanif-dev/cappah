import React from "react";
import loaderGif from "/common/Loader.gif";

const Loader = () => {
	return (
		<div className="flex flex-col justify-center items-center bg-white">
			<img src={loaderGif} alt="Loading..." className="w-72" />
			{/* <p className="text-lg font-semibold text-black italic">Loading...</p> */}
		</div>
	);
};

export default Loader;
