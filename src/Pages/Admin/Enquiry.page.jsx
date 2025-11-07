import { useState, useEffect } from "react";
import Loader from "../../Components/Admin/Common/Loader.common";
import Enquiry_Component from "../../Components/Admin/Enquiry/Enquiry.component";
import { fetchUserPermissions } from "../../Redux/reducers/userRoleSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnquiries } from "../../Api/Admin/Enquiry/EnquiryGet";

const Enquiry = () => {
  const [enquiry, setenquiry] = useState([]);
  const [loadingenquiry, setLoadingenquiry] = useState(true);
  const { permissions, isLoading, error } = useSelector(
    (state) => state.userPermissions
  );
  const dispatch = useDispatch();

  const getenquiry = async () => {
    try {
      const fetchedenquiry = await fetchEnquiries();
      setenquiry(fetchedenquiry);
    } catch (error) {
      toast.error("Failed to fetch enquiry");
    } finally {
      setLoadingenquiry(false);
    }
  };

  useEffect(() => {
    getenquiry();
  }, []);

  useEffect(() => {
    dispatch(fetchUserPermissions());
  }, [dispatch]);

  if (loadingenquiry || isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <Enquiry_Component
        enquiry={enquiry}
        getEnquiry={getenquiry}
        permissions={permissions}
      />
    </div>
  );
};

export default Enquiry;
