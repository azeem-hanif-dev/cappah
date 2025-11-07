import { relatedproductsUrl } from "../urls";
export const fetchProductsFromApi = async (categoryOrSubCategory) => {
    console.log(categoryOrSubCategory)
    try {
      const response = await fetch(`${relatedproductsUrl}${categoryOrSubCategory}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  