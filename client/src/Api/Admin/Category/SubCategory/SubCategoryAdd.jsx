import { subcategoryAdd } from "../../../../urls";

export const createSubCategory = async (formData, CIP_Token) => {
  try {
    const response = await fetch(`${subcategoryAdd}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CIP_Token}`, // ✅ Send CIP_Token if required
      },
      body: formData, // ✅ Send FormData instead of JSON
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create subcategory");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
