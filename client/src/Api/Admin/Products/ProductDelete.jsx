import { productDelete } from "../../../urls";

export const deleteProduct = async (productId, CIP_Token) => {
  try {
    const response = await fetch(`${productDelete}/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`, // Pass Bearer CIP_Token
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete product");
    }

    return result; // Return the result so the caller can handle it
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while deleting the product"
    );
  }
};
