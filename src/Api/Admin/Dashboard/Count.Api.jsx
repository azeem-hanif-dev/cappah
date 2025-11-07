import { countGet } from "../../../urls";

export const getCount = async () => {
  try {
    const response = await fetch(countGet);
    if (!response.ok) {
      throw new Error("Failed to fetch count");
    }
    const result = await response.json();
    if (result.status && result.data) {
      return result.data; // Return the data object directly
    } else {
      console.error("Unexpected data format:", result);
      return null;
    }
  } catch (error) {
    console.error("Error fetching count:", error);
    return null;
  }
};