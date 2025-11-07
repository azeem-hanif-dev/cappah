import { getPrevilege } from "../../../urls";

export const deletePrivilegeApi = async (privilegeId, CIP_Token) => {
  try {
    const response = await fetch(`${getPrevilege}${privilegeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${CIP_Token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete privilege");
    }

    return data; // Return success message and other response data
  } catch (error) {
    console.error("Error deleting privilege:", error);
    throw error; // Propagate the error to the caller
  }
};
