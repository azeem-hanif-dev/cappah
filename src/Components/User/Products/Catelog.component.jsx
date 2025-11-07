import catelogbgimg from "/Catelog/Catelog.png";
import catelogvector from "/Catelog/Vector.png";

const Catelog = () => {
  const handleDownloadPDF = () => {
    const pdfPath = "/common/catalogue.pdf"; // Adjust the path based on where you placed the file

    // Create an anchor element
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "catalogue.pdf"; // Set the download filename

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div
      className="relative w-full h-72 bg-cover bg-center flex items-center justify-center mb-4"
      style={{ backgroundImage: `url(${catelogbgimg})` }}
    >
      <div
        className="flex flex-col items-center gap-3 p-6 bg-white bg-opacity-20 backdrop-blur-md rounded-lg cursor-pointer"
        onClick={handleDownloadPDF}
      >
        <img src={catelogvector} alt="Download Icon" className="w-12 h-12" />
        <h2 className="text-white font-semibold content uppercase">
          Download Catalog
        </h2>
      </div>
    </div>
  );
};

export default Catelog;
