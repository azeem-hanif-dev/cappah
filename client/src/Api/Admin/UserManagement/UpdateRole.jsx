import { updateRole } from "../../../urls";
export const updateUserRole = async (userId, role, CIP_Token) => {
  try {
    const response = await fetch(`${updateRole}${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify({ role }),
    });

    return response;
  } catch (error) {
    throw new Error("An error occurred while updating the role.");
  }
};
