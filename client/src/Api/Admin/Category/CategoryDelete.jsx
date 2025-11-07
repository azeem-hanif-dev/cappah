import { categoryDelete } from "../../../urls";

export const deleteCategory = async (categoryId, CIP_Token) => {
  try {
    const response = await fetch(`${categoryDelete}/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`, // Pass Bearer CIP_Token
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete category");
    }

    return result; // Return the result so the caller can handle it
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while deleting the category"
    );
  }
};
