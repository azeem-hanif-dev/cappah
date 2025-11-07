import { categoriesUrl } from "../../../urls";

export const fetchCategories = async () => {
	try {
	  const response = await fetch(categoriesUrl);
	  if (!response.ok) {
		throw new Error("Failed to fetch categories");
	  }
	  const result = await response.json();
	  if (result.success && Array.isArray(result.data)) {
		return result.data;
	  } else {
		console.error("Unexpected data format:", result);
		return [];
	  }
	} catch (error) {
	  console.error("Error fetching categories:", error);
	  return [];
	}
  };