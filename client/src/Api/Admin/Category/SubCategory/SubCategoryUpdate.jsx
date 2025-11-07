import { subcategoryUpdate } from "../../../../urls";

export const updateSubCategory = async (
  subCategoryId,
  subCategoryData,
  CIP_Token
) => {
  const formData = new FormData();

  formData.append("name", subCategoryData.name);
  formData.append("description", subCategoryData.description);

  if (subCategoryData.image) formData.append("image", subCategoryData.image);

  try {
    const response = await fetch(`${subcategoryUpdate}/${subCategoryId}`, {
      headers: {
        Authorization: `Bearer ${CIP_Token}`,
      },
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Failed to update subcategory");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};
