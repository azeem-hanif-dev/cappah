import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUserPermissions } from "../../../Redux/reducers/userRoleSlice";

const AddMenu = ({
  Title,
  description,
  buttontext,
  ModelUrl,
  fetchApi,
  resource,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { permissions } = useSelector((state) => state.userPermissions);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  // List of resources that do not require permission checks
  const skipPermissionCheck = ["userManagement", "privilege", "logs"];

  // Check permission only if resource is not in the skip list
  const hasPermission =
    skipPermissionCheck.includes(resource) ||
    permissions?.permissions?.[resource]?.create;

  return (
    <div className="w-full isolate_bars text-center">
      <div className="tablepadding bg-white rounded-md">
        <div className="flex w-full justify-between items-center">
          <div className="w-3/4 flex flex-col justify-start items-start space-y-4">
            <div className="space-y-4">
              <h1 className="subheading3 text-start capitalize font-semibold">
                {Title}
              </h1>
              <p className="minicontent text-start">{description}</p>
            </div>
            {hasPermission && (
              <button
                className="bg-primary hover:bg-primary/80 text-white button minicontent rounded-lg px-3"
                onClick={handleOpenModal}
              >
                {buttontext}
              </button>
            )}
          </div>

          <div className="w-1/4 flex flex-col items-end justify-end space-y-2">
            <div className="flex gap-2">
              <img src="/Admin/Common/GroupPic.svg" alt="pic" />
            </div>
          </div>
        </div>
      </div>
      <ModelUrl
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fetchApi={fetchApi}
        className="transition-transform duration-300 ease-in-out"
      />
    </div>
  );
};

export default AddMenu;
