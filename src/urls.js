// Base URL
const baseUrl = "https://cappah-testing-backend.vercel.app";

//URL to fetch all products
const productsUrl = `${baseUrl}/api/v1/product/`;

//URL to fetch all products
const productDelete = `${baseUrl}/api/v1/product/delete`;

//URL to fetch all products
const productAdd = `${baseUrl}/api/v1/product/create`;

//URL to update product
const productUpdate = `${baseUrl}/api/v1/product/update/`;

//URL to update products status
const updateStatus = `${baseUrl}/api/v1/product/update`;

//URL to fetch all products
const relatedproductsUrl = `${baseUrl}/api/v1/product/related-products/`;

//URL to delete image of product
const deleteImage = `${baseUrl}/api/v1/product/image/`;

//URL to change image
const changeImage = `${baseUrl}/api/v1/product/change-image/`;

//URL to change image of product

//URL to fetch all categories
const categoriesUrl = `${baseUrl}/api/v1/category/`;

//URL to add category
const addCategory = `${baseUrl}/api/v1/category/create`;

//URL to delete category
const categoryDelete = `${baseUrl}/api/v1/category/delete`;

//URL to update category

const categoryUpdate = `${baseUrl}/api/v1/category/update`;

//URL to fetch all subcategories
const subcategoriesUrl = `${baseUrl}/api/v1/sub-category/`;

//URL to delete subcategory
const subcategoryDelete = `${baseUrl}/api/v1/sub-category/delete`;

//URL to add subcategory
const subcategoryAdd = `${baseUrl}/api/v1/sub-category/create`;

//URL to update subcategory
const subcategoryUpdate = `${baseUrl}/api/v1/sub-category/update`;

//URL to fetch Events
const eventsUrl = `${baseUrl}/api/v1/event/get-all`;

//URL to post a event
const addEvent = `${baseUrl}/api/v1/event/create`;

//URL to delete a event
const deleteEvent = `${baseUrl}/api/v1/event/`;

//URL to update Exhibition
const updateExhibitionstatus = `${baseUrl}/api/v1/event/status-change/`;

//URL to update Exhibition
const updateExhibition = `${baseUrl}/api/v1/event/update/`;

//URL to post ContactUs Form Data
const contactUs = `${baseUrl}/api/v1/contact/create`;

//URL to post Email in home page
const emailUs = `${baseUrl}/api/v1/subscribe/`;

//URL to Get all count
const countGet = `${baseUrl}/api/v1/count/get-all-counts`;

//URL to update event
const updateEvent = `${baseUrl}/api/v1/event/update/`;

//URL to fetch heading
const getHeading = `${baseUrl}/api/v1/alert-header/get`;

//URL to update heading
const updateHeading = `${baseUrl}/api/v1/alert-header/update`;

//URL to fetch potential custoemrs
const getPotentialCustomers = `${baseUrl}/api/v1/potential-customer`;

//URL for authentication
const userLogin = `${baseUrl}/api/v1/auth/login`;

//URL for logs api
const logsApi = `${baseUrl}/api/v1/logger/get-all`;

//URL to create permission
const createPrevilege = `${baseUrl}/api/v1/permission/create`;

//URL to get,update(pass id) and delete(pass id) permission/previlege
const getPrevilege = `${baseUrl}/api/v1/permission/`;

//URl to fetch users
const getUsers = `${baseUrl}/api/v1/admin`;

//URL to register user
const registerUser = `${baseUrl}/api/v1/admin/register`;

//URL to update user role
const updateRole = `${baseUrl}/api/v1/admin/update-role/`;

//URL to update user profile
const userUpdate = `${baseUrl}/api/v1/admin/update/`;

//URL to reset-password
const passwordReset = `${baseUrl}/api/v1/auth/reset-password/`;

//URL for passwordforgat

const passwordForget = `${baseUrl}/api/v1/auth/forgot-password`;

//URL to create enquiry

const enquiryCreate = `${baseUrl}/api/v1/enquire/create`;

//URL to create enquiry

const enquiryGet = `${baseUrl}/api/v1/enquire/`;

//URL to create enquiry

const enquiryStatusChange = `${baseUrl}/api/v1/enquire/change-status/`;

//URL to add contact form

const postContactForm = `${baseUrl}/api/v1/get-in-touch/create`;

//URL to subscribe

const subscribe = `${baseUrl}/api/v1/subscribe`;

// Export the URLs
export {
  baseUrl,
  productsUrl,
  eventsUrl,
  addEvent,
  contactUs,
  emailUs,
  categoriesUrl,
  subcategoriesUrl,
  relatedproductsUrl,
  countGet,
  updateEvent,
  getHeading,
  updateHeading,
  getPotentialCustomers,
  categoryDelete,
  categoryUpdate,
  subcategoryDelete,
  subcategoryAdd,
  addCategory,
  subcategoryUpdate,
  productDelete,
  productAdd,
  updateStatus,
  userLogin,
  logsApi,
  createPrevilege,
  getPrevilege,
  getUsers,
  registerUser,
  updateRole,
  userUpdate,
  passwordReset,
  passwordForget,
  deleteEvent,
  updateExhibitionstatus,
  updateExhibition,
  deleteImage,
  changeImage,
  productUpdate,
  enquiryCreate,
  enquiryGet,
  postContactForm,
  enquiryStatusChange,
  subscribe,
};
