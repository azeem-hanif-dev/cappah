// Update your fetchCategoriesById function to better handle the API response:

import { categoriesUrl } from "../../../urls";

export const fetchCategoriesById = async (categoryId) => {
  try {
    console.log(
      `Fetching category with ID: ${categoryId} from ${categoriesUrl}${categoryId}`
    );
    const response = await fetch(`${categoriesUrl}${categoryId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("API response for category:", result);

    if (result.success) {
      // Handle different response formats
      if (Array.isArray(result.data)) {
        return result.data;
      } else if (result.data && typeof result.data === "object") {
        // If it's a single object, return it as an array
        return [result.data];
      }
    }

    // If we reach here, something is wrong with the response format
    console.error("Unexpected API response format:", result);
    return [];
  } catch (error) {
    console.error("Error fetching category:", error);
    return [];
  }
};
