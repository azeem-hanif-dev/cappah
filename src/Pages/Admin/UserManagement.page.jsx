import React, { useState, useEffect } from "react";
import UserManagement_Component from "../../Components/Admin/UserManagement/User_Management";
import AddMenu from "../../Components/Common/Admin/AddMenu.component";
import AddAdminModal from "../../Modals/Admin/UserManagement/AddUserModal";
import { fetchUsersApi } from "../../Api/Admin/UserManagement/GetUsers";
import Loader from "../../Components/Admin/Common/Loader.common";
import { fetchUserPermissions } from "../../Redux/reducers/userRoleSlice";
import { useDispatch, useSelector } from "react-redux";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();
  const { permissions, isLoading, error } = useSelector(
    (state) => state.userPermissions
  );

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const CIP_Token = localStorage.getItem("CIP_Token");
      const users = await fetchUsersApi(CIP_Token); // Use API function
      setUsers(users); // Set users from the fetched data
    } catch (error) {
      setUsers([]); // Reset users in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    dispatch(fetchUserPermissions());
  }, [dispatch]);

  if (loading || isLoading) {
    return <Loader />;
  }
  return (
    <>
      <AddMenu
        Title={"User"}
        description={"Start managing the user you find useful"}
        buttontext={"Add User"}
        ModelUrl={AddAdminModal}
        fetchApi={fetchUsers}
        resource="userManagement"
      />
      <UserManagement_Component
        users={users}
        // onDeleteProduct={handleDeleteProduct}
        fetchUsers={fetchUsers}
        permissions={permissions}
      />
    </>
  );
};

export default UserManagement;
