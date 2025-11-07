import { enquiryCreate } from "../../../urls";

export const submitEnquiry = async (formData) => {
  try {
    const response = await fetch(enquiryCreate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    throw error;
  }
};
