import { productsUrl } from "../../../urls";
export const fetchProductData = async (id) => {
  try {
    const response = await fetch(`${productsUrl}${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await response.json();
    console.log("Fetched Data:", data);

    return data.product;
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
