import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
// Pages and components
import Main from "../Layout/User/User.Layout";
import Loader from "../Components/Admin/Common/Loader.common";
import Home from "../Pages/User/Home.Page";
import About_Us from "../Pages/User/About_Us.Page";
import Contact_Us from "../Pages/User/Contact_Us.Page";
import Exhibition from "../Pages/User/Exhibition.page";
import Our_Material from "../Pages/User/Our_Material.Page";
import Products from "../Pages/User/Products.Page";
import Product_Details from "../Pages/User/Product_Details.Page";
import Page_404 from "../Pages/Common/404.Page";
import ScrollToTop from "../Components/Common/ScrollToTop";
import Login from "../Pages/Common/Login.Page";
import Signup from "../Pages/Common/Signup.Page";
import Dashboard from "../Pages/Admin/Dashboard.page";
import Category from "../Pages/Admin/Category";
import ProductsAdmin from "../Pages/Admin/ProductsAdmin.page";
import Enquiry from "../Pages/Admin/Enquiry.page";
import UserManagement from "../Pages/Admin/UserManagement.page";
import Privilege from "../Pages/Admin/Privilege.page";
import Logs from "../Pages/Admin/Logs.page";
import ExhibitionAdmin from "../Pages/Admin/ExhibitionAdmin.page";
import { ToastContainer } from "react-toastify";
import Admin from "../Layout/Admin/Admin.Layout";
import { setUserDataFromLocalStorage } from "../Redux/reducers/authSlice";
import { fetchUserPermissions } from "../Redux/reducers/userRoleSlice";
import ResetPassword from "../Pages/Admin/ResetPassword";

const Router = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { permissions } = useSelector((state) => state.userPermissions);

  useEffect(() => {
    dispatch(setUserDataFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserPermissions());
    }
  }, [dispatch, isAuthenticated]);

  const isSuperAdmin = permissions?.role === "superAdmin";

  // Redirect to login if permissions are null
  if (isAuthenticated && permissions === null) {
    return <Navigate to="/login" replace />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <ScrollToTop />
          <ToastContainer position="top-center" autoClose={5000} />
          <Main />
        </>
      ),
      children: [
        { path: "", element: <Home /> },
        { path: "about_us", element: <About_Us /> },
        { path: "our_material", element: <Our_Material /> },
        { path: "products", element: <Products /> },
        { path: "products/:id", element: <Product_Details /> },
        { path: "exhibition", element: <Exhibition /> },
        { path: "contact_us", element: <Contact_Us /> },
      ],
    },
    {
      path: "admin",
      element: (
        <>
          <ScrollToTop />
          {isAuthenticated ? (
            permissions ? (
              <>
                <Admin />
                <ToastContainer position="top-center" autoClose={5000} />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Login />
          )}
        </>
      ),
      children: [
        { path: "", element: isAuthenticated ? <Dashboard /> : <Login /> },
        { path: "login", element: isAuthenticated ? <Dashboard /> : <Login /> },
        {
          path: "category",
          element: isAuthenticated ? <Category /> : <Login />,
        },
        {
          path: "products",
          element: isAuthenticated ? <ProductsAdmin /> : <Login />,
        },
        { path: "enquiry", element: isAuthenticated ? <Enquiry /> : <Login /> },
        {
          path: "exhibition",
          element: isAuthenticated ? <ExhibitionAdmin /> : <Login />,
        },
        {
          path: "reset-password/:CIP_Token",
          element: isAuthenticated ? <Dashboard /> : <ResetPassword />,
        },

        // Only allow superAdmin access
        {
          path: "usermanagement",
          element: isAuthenticated ? (
            isSuperAdmin ? (
              <UserManagement />
            ) : (
              <Navigate to="/admin" replace />
            )
          ) : (
            <Login />
          ),
        },
        {
          path: "privilege",
          element: isAuthenticated ? (
            isSuperAdmin ? (
              <Privilege />
            ) : (
              <Navigate to="/admin" replace />
            )
          ) : (
            <Login />
          ),
        },
        {
          path: "logs",
          element: isAuthenticated ? (
            isSuperAdmin ? (
              <Logs />
            ) : (
              <Navigate to="/admin" replace />
            )
          ) : (
            <Login />
          ),
        },
      ],
    },
    { path: "*", element: <Page_404 /> },
    { path: "/signup", element: <Signup /> },
    { path: "/error", element: <Page_404 /> }, // Error page for unauthorized access
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
