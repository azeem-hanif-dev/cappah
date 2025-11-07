import { createPrevilege } from "../../../urls"; // Ensure the correct import path to `createPrevilege`

export const createPrivilege = async (formattedData, CIP_Token) => {
  try {
    const response = await fetch(`${createPrevilege}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify(formattedData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create privilege");
    }

    return result; // Return the success response
  } catch (error) {
    console.error("Error creating permission:", error);
    throw error; // Propagate the error for the caller to handle
  }
};
