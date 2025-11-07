import { updateStatus } from "../../../urls";
export const updateProductStatusChange = async (
  productId,
  isActive,
  CIP_Token
) => {
  const isActiveString = String(isActive);

  try {
    const response = await fetch(`${updateStatus}/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify({ isActive: isActiveString }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product status");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
