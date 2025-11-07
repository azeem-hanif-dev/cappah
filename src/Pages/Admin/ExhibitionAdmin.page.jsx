import React from "react";
import { useState, useEffect } from "react";
import { Search, Eye, User } from "lucide-react";
import Exhibition_Component from "../../Components/Admin/Exhibition/Exhibition.component";
import AddMenu from "../../Components/Common/Admin/AddMenu.component";
import AddExhibition from "../../Modals/Admin/Exhibition/AddExhibition";
import { getEventDetails } from "../../Api/Common/Exhibition/GetExhibition.Api";
import { deleteExhibition } from "../../Api/Admin/Exhibition/DeleteExhibition";
import { toast } from "react-toastify";
import { fetchUserPermissions } from "../../Redux/reducers/userRoleSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Admin/Common/Loader.common";

const Exhibition = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const dispatch = useDispatch();
  const { permissions, isLoading, error } = useSelector(
    (state) => state.userPermissions
  );

  const fetchexhibitions = async () => {
    try {
      const data = await getEventDetails();
      setExhibitions(data.events); // Assuming fetchexhibitions returns an array
    } catch (err) {
      setError("Failed to fetch exhibitions");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExhibition = async (exhibitionId) => {
    try {
      const result = await deleteExhibition(exhibitionId, CIP_Token);

      // If successful, remove the exhibition from state
      setExhibitions((prevExhibitions) =>
        prevExhibitions.filter((exhibition) => exhibition._id !== exhibitionId)
      );

      // Show success message
      toast.success("Exhibition deleted successfully");

      fetchexhibitions();
    } catch (error) {
      // Handle error
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchexhibitions();
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
        Title={"Event"}
        description={"Start Creating the categories your customers find useful"}
        buttontext={"Add Event"}
        ModelUrl={AddExhibition}
        fetchApi={fetchexhibitions}
        resource="event"
      />
      <Exhibition_Component
        exhibitions={exhibitions}
        onDeleteExhibitions={handleDeleteExhibition}
        fetchexhibitions={fetchexhibitions}
        permissions={permissions}
      />
    </>
  );
};

export default Exhibition;
