import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchHeadingApi } from "../../../Api/Admin/Dashboard/GetHeading";
import { updateHeadingApi } from "../../../Api/Admin/Dashboard/UpdateHeading";
import { useSelector } from "react-redux";
import { fetchUserPermissions } from "../../../Redux/reducers/userRoleSlice";

const Heading = () => {
  const [heading, setHeading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverError, setServerError] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const { permissions, isLoading, error } = useSelector(
    (state) => state.userPermissions
  );

  const fetchHeading = async () => {
    setLoading(true);
    setServerError(false);

    try {
      const data = await fetchHeadingApi();
      setHeading(data);
    } catch (error) {
      console.error(error.message);
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateHeading = async () => {
    const toastId = toast.loading("Updating Heading...");
    setIsUpdating(true);

    try {
      await updateHeadingApi(newHeading);
      setHeading({ textField: newHeading });
      setIsUpdating(false);
      setHasChanged(false);

      toast.update(toastId, {
        render: "Heading updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setIsModalOpen(false);
    } catch (error) {
      setIsUpdating(false);
      toast.update(toastId, {
        render: "Failed to update heading. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchUserPermissions();
    fetchHeading();
  }, []);

  // Set initial value when modal opens
  useEffect(() => {
    if (isModalOpen && heading?.textField) {
      setNewHeading(heading.textField);
      setHasChanged(false);
    }
  }, [isModalOpen, heading]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewHeading(value);

    // Check if the new value is different from the current heading
    setHasChanged(value !== heading?.textField);

    if (!value.trim()) {
      setErrorMessage("This field cannot be empty.");
      setIsInvalid(true);
    } else if (/[<>=`&%$;'[\]{}<>]/.test(value)) {
      setErrorMessage(
        "Special characters like <, >, =, `, &, %, $, etc., are not allowed."
      );
      setIsInvalid(true);
    } else if (value.length > 255) {
      setErrorMessage("Please don't enter more than 255 characters.");
      setIsInvalid(true);
    } else {
      setErrorMessage("");
      setIsInvalid(false);
    }
  };

  return (
    <>
      <div className="bg-navback isolate_bars text-white w-full">
        <div className="bg-white flex w-full text-admintext rounded-lg p-2 justify-between items-center minicontent">
          <div className="flex-shrink-0 bg-gray-700 p-2 pr-5 font-bold  mr-4 border-r-2 border-admintext/60">
            ALERT
          </div>

          <div className="marquee-container overflow-hidden whitespace-nowrap flex-1 mr-4">
            <div className="marquee inline-block w-full">
              {serverError ? (
                <div className="bg-black text-red-500 font-bold">
                  "Network issue / error 505"
                </div>
              ) : (
                heading?.textField || "No data available"
              )}
            </div>
          </div>
          {permissions.role === "superAdmin" && (
            <div
              className="bg-gray-700 p-2 border-l-2 pl-5 border-admintext/60 hover:text-primary transition-all duration-200 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Pencil />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-navback text-white p-6 rounded-lg w-[90%] max-w-[500px]">
            <h2 className="minicontent font-bold mb-4">Edit Heading</h2>
            <input
              type="text"
              value={newHeading}
              onChange={handleInputChange}
              className="w-full p-2 border text-admintext border-gray-300 rounded-lg mb-2"
              placeholder="Enter New Heading"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className=" px-4 button bg-bggray text-admintext rounded hover:bg-mehroon hover:text-white transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 button bg-teal-500 text-white rounded-md hover:bg-teal-600 ${
                  !hasChanged || isInvalid || isUpdating
                    ? "bg-primary text-white cursor-not-allowed"
                    : "bg-primary text-white"
                }`}
                onClick={updateHeading}
                disabled={!hasChanged || isInvalid || isUpdating}
              >
                {isUpdating ? <span>Updating...</span> : <span>Update</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Heading;
