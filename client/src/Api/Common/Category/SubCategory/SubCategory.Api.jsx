//subcategory by id
import { subcategoriesUrl } from "../../../../urls";
export const fetchSubcategories = async (categoryId) => {
  try {
    const response = await fetch(`${subcategoriesUrl}${categoryId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch subcategories");
    }
    const result = await response.json();
    return result; // Return the full result, not just result.data
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error; // Throw the error instead of returning empty array
  }
};
