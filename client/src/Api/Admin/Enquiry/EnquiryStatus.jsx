import { enquiryStatusChange } from "../../../urls";
export const updateEnquiryStatusChange = async (
  EnquiryId,
  isActive,
  CIP_Token
) => {
  const isActiveString = String(isActive);

  try {
    const response = await fetch(`${enquiryStatusChange}${EnquiryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
      body: JSON.stringify({ status: isActiveString }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update enquiry status");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
