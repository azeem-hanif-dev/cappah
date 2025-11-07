import { deleteEvent } from "../../../urls";
export const deleteExhibition = async (exhibitionId, CIP_CIP_Token) => {
  try {
    const response = await fetch(`${deleteEvent}${exhibitionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_CIP_Token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result; // Return success response
  } catch (error) {
    throw new Error(error.message || "Failed to delete exhibition");
  }
};
