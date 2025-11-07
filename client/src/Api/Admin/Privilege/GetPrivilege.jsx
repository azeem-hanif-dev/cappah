import { getPrevilege } from "../../../urls";

export const fetchPrivilegesApi = async (CIP_Token) => {
  try {
    const response = await fetch(`${getPrevilege}`, {
      headers: {
        Authorization: `Bearer ${CIP_Token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch privileges");
    }

    return data.permission; // Return the fetched privileges
  } catch (error) {
    console.error("Error fetching privileges:", error);
    throw error; // Propagate the error for the caller to handle
  }
};
