import { userUpdate } from "../../../urls";

export const updateUser = async (userId, updateData, CIP_Token) => {
  try {
    const response = await fetch(`${userUpdate}${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return await response.json(); // Return response data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; // Propagate the error
  }
};
