import { categoryUpdate } from "../../../urls";

// src/Api/UpdateCategory.Api.js
export const updateCategory = async (categoryId, data, CIP_Token) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);

  if (data.image?.file) {
    formData.append("image", data.image.file);
  }
  if (data.icon?.file) {
    formData.append("icon", data.icon.file);
  }

  try {
    const response = await fetch(`${categoryUpdate}/${categoryId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${CIP_Token}`, // Bearer CIP_Token for authentication
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse error details if available
      throw new Error(errorData?.message || "Failed to update category");
    }

    const result = await response.json(); // Assuming the API returns the updated category
    return result;
  } catch (error) {
    console.error("Error updating category:", error.message);
    throw error;
  }
};
