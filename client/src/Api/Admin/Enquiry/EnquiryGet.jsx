import { enquiryGet } from "../../../urls";

export const fetchEnquiries = async () => {
  try {
    const response = await fetch(enquiryGet);
    if (!response.ok) {
      throw new Error("Failed to fetch enquiries");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return [];
  }
};
