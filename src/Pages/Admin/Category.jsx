import CategoryTable from "../../Components/Admin/Category/Category.component";
import AddMenu from "../../Components/Common/Admin/AddMenu.component";
import AddCategory from "../../Modals/Admin/Category/AddCategory.Modal";
import { fetchCategories } from "../../Api/GetCategories.Api";
import { deleteCategory } from "../../Api/Admin/Category/CategoryDelete";
import { useState, useEffect } from "react";
import Loader from "../../Components/Admin/Common/Loader.common";
import { toast } from "react-toastify";
import { fetchUserPermissions } from "../../Redux/reducers/userRoleSlice";
import { useDispatch, useSelector } from "react-redux";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const dispatch = useDispatch();
  const { permissions, isLoading, error } = useSelector(
    (state) => state.userPermissions
  );

  const getCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
    setLoading(false);
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    dispatch(fetchUserPermissions());
  }, [dispatch]);

  const handleDeleteCategory = async (categoryId) => {
    setIsDeleting(true);
    try {
      await deleteCategory(categoryId, CIP_Token); // Call the API
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <>
      <AddMenu
        Title={"Category"}
        description={
          "Start by stocking your store with products your customers will love"
        }
        buttontext={"Add Category"}
        ModelUrl={AddCategory}
        fetchApi={getCategories}
        resource="category"
      />
      {/* Pass categories and onDeleteCategory as props */}
      <CategoryTable
        categories={categories}
        onDeleteCategory={handleDeleteCategory}
        onDelete={isDeleting}
        fetchCategories={getCategories}
        permissions={permissions}
      />
    </>
  );
};

export default Category;
