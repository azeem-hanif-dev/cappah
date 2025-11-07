import { updateExhibition } from "../../../urls";

export const updateEvent = async (formData, exhibitionId, CIP_Token) => {
  try {
    let body = formData;
    let headers = {
      Authorization: `Bearer ${CIP_Token}`,
    };

    // Check if formData contains files; if not, convert it to JSON
    if (![...formData.values()].some((value) => value instanceof File)) {
      body = JSON.stringify(Object.fromEntries(formData.entries()));
      headers["Content-Type"] = "application/json"; // Only set JSON header if no file is present
    }

    console.log("Data being sent:", body);

    const response = await fetch(`${updateExhibition}${exhibitionId}`, {
      method: "PUT",
      body,
      headers,
    });

    console.log("Your response is", response);

    return await response.json(); // Return API response
  } catch (error) {
    throw new Error(error.message || "Error updating event");
  }
};
