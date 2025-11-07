import { registerUser } from "../../../urls";

export const addUserApi = async (CIP_Token, userData) => {
  try {
    const response = await fetch(`${registerUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    return await response.json(); // Return the response data
  } catch (error) {
    console.error("Error adding user:", error);
    throw error; // Propagate the error to the caller
  }
};
