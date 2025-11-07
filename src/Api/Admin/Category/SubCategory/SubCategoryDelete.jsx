import { subcategoryDelete } from "../../../../urls";

export const deleteSubCategory = async (categoryId, CIP_Token) => {
  try {
    const response = await fetch(`${subcategoryDelete}/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
    });

    const result = await response.json(); // ✅ Extract JSON response

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete subcategory");
    }

    return result; // ✅ Return parsed JSON response
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while deleting the subcategory"
    );
  }
};
