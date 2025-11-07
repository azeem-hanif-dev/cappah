import React, { useState, useEffect } from "react";
import Products_Component from "../../Components/Admin/Products/Products.component";
import AddMenu from "../../Components/Common/Admin/AddMenu.component";
import AddProduct from "../../Modals/Admin/Product/AddProduct.Modal";
import Loader from "../../Components/Admin/Common/Loader.common";
import { fetchProducts } from "../../Api/Common/Product/Product.Api";
import { deleteProduct } from "../../Api/Admin/Products/ProductDelete";
import { toast } from "react-toastify";
import { fetchUserPermissions } from "../../Redux/reducers/userRoleSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { permissions, isLoading, error } = useSelector(
    (state) => state.userPermissions
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const CIP_Token = localStorage.getItem("CIP_Token");
  const dispatch = useDispatch();

  const getProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    dispatch(fetchUserPermissions());
  }, [dispatch]);

  const handleDeleteProduct = async (productId) => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId, CIP_Token);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingProducts || isLoading) {
    return <Loader />;
  }

  return (
    <>
      <AddMenu
        Title={"Product"}
        description={
          "Start by stocking your store with products your customers will love"
        }
        buttontext={"Add Product"}
        ModelUrl={AddProduct}
        fetchApi={getProducts}
        resource="product"
      />
      <Products_Component
        products={products}
        onDeleteProduct={handleDeleteProduct}
        onDelete={isDeleting}
        getProducts={getProducts}
        permissions={permissions}
      />
    </>
  );
};

export default ProductsAdmin;
