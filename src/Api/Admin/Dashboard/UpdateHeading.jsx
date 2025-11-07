import { updateHeading } from "../../../urls";

export const updateHeadingApi = async (newHeading) => {
    try {
      const response = await fetch(`${updateHeading}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textField: newHeading }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json(); // Return the response data
    } catch (error) {
      throw new Error("Failed to update heading: " + error.message);
    }
  };
  