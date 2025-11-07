import { updateExhibitionstatus } from "../../../urls";
export const updateExhibitionStatus = async (
  exhibitionId,
  isActive,
  CIP_Token
) => {
  try {
    const response = await fetch(`${updateExhibitionstatus}${exhibitionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify({
        isActive: String(isActive), // Convert boolean to string
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update exhibition status");
    }

    return await response.json(); // Return API response
  } catch (error) {
    throw new Error(error.message || "Error updating exhibition status");
  }
};
