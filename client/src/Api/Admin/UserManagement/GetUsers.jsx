import { getUsers } from "../../../urls";

export const fetchUsersApi = async (CIP_Token) => {
  try {
    const response = await fetch(`${getUsers}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json.data; // Return the users' data from the API response
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error; // Propagate the error to the caller
  }
};
