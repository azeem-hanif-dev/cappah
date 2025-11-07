import { addCategory } from "../../../urls";

export const createCategory = async (categoryData, CIP_Token) => {
  const formData = new FormData();

  // Append category data to FormData
  formData.append("name", categoryData.name);
  formData.append("description", categoryData.description);
  formData.append("image", categoryData.image); // Append the image file
  formData.append("icon", categoryData.logo); // Append the image file

  try {
    const response = await fetch(`${addCategory}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CIP_Token}`, // Include the CIP_Token in the request
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      // Throw an error if the response is not ok
      throw new Error(result.message || "Failed to add category");
    }

    return result; // Return the result if successful
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};
