import { productsUrl } from "../../../urls";
export const fetchProducts = async () => {
  try {
    const response = await fetch(productsUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();

    return data.products || []; // Return the products array
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
