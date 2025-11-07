import { productAdd } from "../../../urls";
//Add Product
// api.js

export const createProduct = async (formData, CIP_Token) => {
  try {
    const response = await fetch(`${productAdd}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${CIP_Token}`, // Pass Bearer CIP_Token
      },
    });

    // Check if response is not ok and extract error message
    if (!response.ok) {
      const errorData = await response.json(); // Parse response body
      throw new Error(errorData.message || "An error occurred");
    }

    // Return the response data
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Propagate the error to the caller
    throw new Error(error.message || "Something went wrong");
  }
};

export default createProduct;
