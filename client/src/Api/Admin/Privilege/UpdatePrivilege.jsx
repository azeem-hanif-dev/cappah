import { getPrevilege } from "../../../urls";

export const updatePrivilegeApi = async (
  privilegeId,
  formattedData,
  CIP_Token
) => {
  try {
    const response = await fetch(`${getPrevilege}${privilegeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify(formattedData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update privileges");
    }

    return result; // Return the successful result
  } catch (error) {
    console.error("Error updating privilege:", error);
    throw error; // Propagate the error to the caller
  }
};
