import React, { useState, useEffect } from "react";
import Privilege_Component from "../../Components/Admin/Privilege/Privilege.component";
import AddMenu from "../../Components/Common/Admin/AddMenu.component";
import AddPrivilegeModal from "../../Modals/Admin/Privilages/AddPrivilegeModal";
import Loader from "../../Components/Admin/Common/Loader.common";
import { fetchPrivilegesApi } from "../../Api/Admin/Privilege/GetPrivilege";

const Privilege = () => {
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrivileges = async () => {
    try {
      const CIP_Token = localStorage.getItem("CIP_Token"); // Get the CIP_Token
      const privileges = await fetchPrivilegesApi(CIP_Token); // Call the API function
      setPrivileges(privileges); // Set the privileges
    } catch (error) {
      console.error("Error fetching privileges:", error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };
  useEffect(() => {
    fetchPrivileges();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <AddMenu
        Title={"Privilege"}
        description={"Start Creating the privileges for your peasents!!!"}
        buttontext={"Add Role"}
        ModelUrl={AddPrivilegeModal}
        fetchApi={fetchPrivileges}
        resource="privilege"
      />
      <Privilege_Component
        privileges={privileges}
        // onDeleteProduct={handleDeleteProduct}
        fetchPrivileges={fetchPrivileges}
      />
    </>
  );
};

export default Privilege;
